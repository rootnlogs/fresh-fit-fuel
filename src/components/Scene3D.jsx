import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  ContactShadows,
  Sparkles,
  PresentationControls,
  MeshWobbleMaterial,
} from '@react-three/drei'
import { BRAND } from '../config.js'

const { lime, sun, won } = BRAND.colors

// ---------------------------------------------------------------------------
// Interactive wrapper: hover to grow + cursor, tap to "pop" (spin + scale).
// All animation is frame-based and decays, so it's cheap and self-settling.
// ---------------------------------------------------------------------------
function Interactive({ children, reducedMotion, ...props }) {
  const ref = useRef()
  const hovered = useRef(false)
  const spin = useRef(0)
  const pop = useRef(0)

  useFrame((_, delta) => {
    const g = ref.current
    if (!g) return
    pop.current *= 0.9
    const target = (hovered.current ? 1.12 : 1) + pop.current
    g.scale.x += (target - g.scale.x) * 0.2
    g.scale.y = g.scale.z = g.scale.x
    if (!reducedMotion) {
      spin.current *= 0.93
      g.rotation.y += spin.current * delta * 60
    }
  })

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation()
        hovered.current = true
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hovered.current = false
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        pop.current = 0.3
        spin.current = 0.14
      }}
      {...props}
    >
      {children}
    </group>
  )
}

// --- Low-poly primitive props ----------------------------------------------

function Bowl(props) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={lime} roughness={0.35} metalness={0.1} side={2} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.2]} castShadow>
        <icosahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color={sun} roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.05, -0.15]} castShadow>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={won} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.12, 0.35]} castShadow>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Leaf(props) {
  return (
    <mesh castShadow {...props}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color={lime} roughness={0.4} flatShading />
    </mesh>
  )
}

function Cup(props) {
  return (
    <group {...props}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.32, 0.9, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.12, 24]} />
        <meshStandardMaterial color={lime} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.85, 0]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
        <meshStandardMaterial color={sun} roughness={0.4} />
      </mesh>
    </group>
  )
}

// A juicy, organically-wobbling "smoothie drop" — the showpiece material.
function WobbleOrb({ color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <sphereGeometry args={[0.34, 48, 48]} />
      <MeshWobbleMaterial color={color} factor={0.35} speed={1.2} roughness={0.25} metalness={0.15} />
    </mesh>
  )
}

function Orb({ color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <sphereGeometry args={[0.3, 24, 24]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

// --- Scene contents (idle spin lives on an inner group) --------------------
function SceneContents({ reducedMotion, sparkles }) {
  const idle = useRef()

  useFrame((_, delta) => {
    if (!reducedMotion && idle.current) idle.current.rotation.y += delta * 0.12
  })

  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.4, rotationIntensity: 0.6, floatIntensity: 0.8 }

  return (
    <group ref={idle}>
      <Float {...floatProps}>
        <Interactive reducedMotion={reducedMotion} position={[0, -0.2, 0]} scale={1.15}>
          <Bowl />
        </Interactive>
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 0.8}>
        <Interactive reducedMotion={reducedMotion} position={[1.7, 0.4, -0.5]} scale={0.8}>
          <Cup />
        </Interactive>
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.2}>
        <Interactive reducedMotion={reducedMotion} position={[-1.8, 0.7, 0.2]}>
          <Leaf rotation={[0.3, 0.2, 0.6]} />
        </Interactive>
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.1}>
        <Interactive reducedMotion={reducedMotion} position={[-1.5, -0.6, -0.6]} scale={0.8}>
          <Leaf rotation={[-0.4, 0.1, -0.5]} />
        </Interactive>
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 0.9}>
        <Interactive reducedMotion={reducedMotion} position={[1.4, -0.8, 0.4]} scale={0.95}>
          <WobbleOrb color={sun} />
        </Interactive>
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.3}>
        <Interactive reducedMotion={reducedMotion} position={[-0.4, 1.4, -0.4]} scale={0.5}>
          <Orb color={won} />
        </Interactive>
      </Float>

      {sparkles && (
        <Sparkles count={40} scale={6} size={3} speed={0.4} color={sun} opacity={0.6} />
      )}

      <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={8} blur={2.6} far={4} color="#000" />
    </group>
  )
}

/**
 * Hero R3F canvas. Light + interactive:
 *  - drag to rotate (PresentationControls, snaps back) on pointer devices
 *  - tap/click a shape to pop it; hover to grow
 *  - GPU Sparkles for sparkle without overdraw
 * Drag + sparkles + parallax are disabled on small screens (avoids scroll
 * hijack / saves the GPU) and under prefers-reduced-motion.
 */
export default function Scene3D({ reducedMotion = false, isSmallScreen = false }) {
  const interactiveDrag = !reducedMotion && !isSmallScreen
  const sparkles = !reducedMotion
  const dpr = isSmallScreen ? [1, 1.5] : [1, 2]

  const contents = <SceneContents reducedMotion={reducedMotion} sparkles={sparkles} />

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0, 0.5, 5.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 2, -2]} intensity={0.6} color={sun} />

      <Suspense fallback={null}>
        {interactiveDrag ? (
          <PresentationControls
            global
            snap
            cursor={false}
            polar={[-0.3, 0.3]}
            azimuth={[-0.6, 0.6]}
            config={{ mass: 1, tension: 220, friction: 28 }}
          >
            {contents}
          </PresentationControls>
        ) : (
          contents
        )}
      </Suspense>
    </Canvas>
  )
}
