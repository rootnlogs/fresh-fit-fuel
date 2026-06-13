#!/usr/bin/env node
/**
 * gen-images.mjs — generate realistic food photos for every WON Diet Cafe menu
 * item and wire them into the site.
 *
 *   node --env-file=.env.local scripts/gen-images.mjs              # all items
 *   node --env-file=.env.local scripts/gen-images.mjs --limit 1    # test one
 *   node scripts/gen-images.mjs --dry                              # prompts only (no key needed)
 *
 * Provider is auto-detected from the environment:
 *   OPENAI_API_KEY      -> OpenAI gpt-image-1     (best food realism)
 *   REPLICATE_API_TOKEN -> Replicate FLUX schnell (cheapest)
 *
 * Output: public/menu/<item-id>.jpg (downscaled to 640px via macOS `sips`),
 * and the produced id set is written back into src/data/menu-images.js.
 * Re-runnable: existing files are skipped, so a crashed run just resumes.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const exec = promisify(execFile)
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'menu')
const EXT = 'jpg'
const WIDTH = 640

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const li = args.indexOf('--limit')
const LIMIT = li >= 0 ? parseInt(args[li + 1], 10) : Infinity

// Per-category serving hint, so each shot is composed like the real dish.
const VESSEL = {
  'boiled-eggs': 'peeled boiled eggs on a small white plate',
  omelettes: 'a fluffy omelette with brown bread slices on a plate',
  oats: 'a bowl of cooked oats topped with fruit and seeds',
  pasta: 'a plate of multigrain penne pasta with sauce',
  'rice-bowls': 'a healthy rice bowl in a white bowl with veggies',
  'power-mix': 'a grilled high-protein portion plated simply',
  wraps: 'a rolled wrap cut in half, standing on a wooden board',
  'veg-sandwich': 'a stacked grilled sandwich cut diagonally on a plate',
  'nonveg-sandwich': 'a stacked grilled sandwich cut diagonally on a plate',
  subs: 'a submarine sandwich on a wooden board',
  salads: 'a fresh colourful salad in a bowl',
  drinks: 'a refreshing drink in a tall glass',
  gravy: 'a small bowl of rich smooth sauce',
  kebab: 'grilled kebab skewers on a plate with onions and lemon',
  extras: 'a simple fresh food portion on a plate',
}

function promptFor(item, catId) {
  const vessel = VESSEL[catId] || 'a healthy dish plated simply'
  return (
    `Appetizing professional food photography of ${item.name}: ${vessel}. ` +
    `Healthy cafe style, on a clean light wooden table, soft natural daylight, ` +
    `45-degree angle, shallow depth of field, crisp focus, vibrant fresh ingredients, ` +
    `high detail. No text, no labels, no watermark, no hands, no people.`
  )
}

async function genOpenAI(prompt, key) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1024x1024', quality: 'medium' }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  return Buffer.from(json.data[0].b64_json, 'base64')
}

async function genReplicate(prompt, key) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, Prefer: 'wait' },
      body: JSON.stringify({ input: { prompt, aspect_ratio: '1:1', output_format: 'png', num_outputs: 1 } }),
    },
  )
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${(await res.text()).slice(0, 300)}`)
  let pred = await res.json()
  while (!['succeeded', 'failed', 'canceled'].includes(pred.status)) {
    await new Promise((r) => setTimeout(r, 1500))
    pred = await (await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${key}` } })).json()
  }
  if (pred.status !== 'succeeded') throw new Error(`Replicate prediction ${pred.status}`)
  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output
  return Buffer.from(await (await fetch(url)).arrayBuffer())
}

async function genGemini(prompt, key, model) {
  const base = `https://generativelanguage.googleapis.com/v1beta/models/${model}`
  // Imagen models use :predict; Gemini "flash-image" models use :generateContent.
  if (model.startsWith('imagen')) {
    const res = await fetch(`${base}:predict?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: '1:1' } }),
    })
    if (!res.ok) throw new Error(`Gemini(Imagen) ${res.status}: ${(await res.text()).slice(0, 300)}`)
    const json = await res.json()
    const b64 = json.predictions?.[0]?.bytesBase64Encoded
    if (!b64) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 300)}`)
    return Buffer.from(b64, 'base64')
  }
  const res = await fetch(`${base}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  const parts = json.candidates?.[0]?.content?.parts || []
  const img = parts.find((p) => p.inlineData?.data)
  if (!img) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 300)}`)
  return Buffer.from(img.inlineData.data, 'base64')
}

async function main() {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const replicateKey = process.env.REPLICATE_API_TOKEN
  const provider = geminiKey ? 'gemini' : openaiKey ? 'openai' : replicateKey ? 'replicate' : null
  const geminiModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
  if (!provider && !DRY) {
    console.error(
      'No API key found. Put GEMINI_API_KEY (or OPENAI_API_KEY / REPLICATE_API_TOKEN) in .env.local, then:\n' +
        '  node --env-file=.env.local scripts/gen-images.mjs',
    )
    process.exit(1)
  }
  console.log(
    `Provider: ${provider === 'gemini' ? `gemini (${geminiModel})` : provider || '(dry run — no images written)'}`,
  )

  const menu = JSON.parse(await readFile(join(ROOT, 'menu.json'), 'utf8'))
  await mkdir(OUT_DIR, { recursive: true })

  const items = menu.categories.flatMap((c) => c.items.map((it) => ({ it, catId: c.id })))

  let made = 0
  for (const { it, catId } of items) {
    if (made >= LIMIT) break
    const outPath = join(OUT_DIR, `${it.id}.${EXT}`)
    if (existsSync(outPath)) continue // resumable

    const prompt = promptFor(it, catId)
    if (DRY) {
      console.log(`\n${it.id}\n  ${prompt}`)
      made++
      continue
    }

    try {
      process.stdout.write(`• ${it.id} … `)
      const buf =
        provider === 'gemini'
          ? await genGemini(prompt, geminiKey, geminiModel)
          : provider === 'openai'
            ? await genOpenAI(prompt, openaiKey)
            : await genReplicate(prompt, replicateKey)
      const tmp = join(OUT_DIR, `${it.id}.tmp.png`)
      await writeFile(tmp, buf)
      await exec('sips', ['-Z', String(WIDTH), '-s', 'format', 'jpeg', tmp, '--out', outPath])
      await exec('rm', ['-f', tmp])
      made++
      console.log('ok')
    } catch (e) {
      console.log('FAILED')
      console.error(`  ${it.id}: ${e.message}`)
    }
  }

  // Rewrite the manifest from whatever .jpg files exist now.
  const ids = (await readdir(OUT_DIR))
    .filter((f) => f.endsWith(`.${EXT}`))
    .map((f) => f.slice(0, -(EXT.length + 1)))
    .sort()
  const manifest =
    `// Auto-generated by scripts/gen-images.mjs — do not edit by hand.\n` +
    `// Lists the menu-item ids that have a real photo at /public/menu/<id>.${EXT}.\n` +
    `export const MENU_IMAGE_EXT = '${EXT}'\n` +
    `export const MENU_IMAGE_IDS = new Set(${JSON.stringify(ids, null, 2)})\n`
  await writeFile(join(ROOT, 'src', 'data', 'menu-images.js'), manifest)

  console.log(`\nDone. ${made} ${DRY ? 'prompt(s) shown' : 'new image(s)'}. Manifest lists ${ids.length} id(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
