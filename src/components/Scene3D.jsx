import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import { BRAND } from '../config.js'

const { lime, sun, won } = BRAND.colors

// --- Low-poly primitive props ----------------------------------------------

function Bowl(props) {
  return (
    <group {...props}>
      {/* Open bowl: bottom hemisphere */}
      <mesh castShadow receiveShadow rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={lime} roughness={0.35} metalness={0.1} side={2} />
      </mesh>
      {/* A few "ingredients" inside */}
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
      {/* Flattened, pointed shape reads as a leaf */}
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color={lime} roughness={0.4} flatShading />
    </mesh>
  )
}

function Cup(props) {
  return (
    <group {...props}>
      {/* Cup body echoing the logo's cup-with-straw */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.32, 0.9, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.12, 24]} />
        <meshStandardMaterial color={lime} roughness={0.3} />
      </mesh>
      {/* Straw */}
      <mesh position={[0.12, 0.85, 0]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
        <meshStandardMaterial color={sun} roughness={0.4} />
      </mesh>
    </group>
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

// --- Scene contents (parallax + gentle idle spin) --------------------------

function SceneContents({ reducedMotion, parallax }) {
  const group = useRef()

  useFrame((state, delta) => {
    if (!group.current) return
    // Slow idle rotation (skipped under reduced motion).
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.12
    }
    // Pointer parallax — lerp toward pointer position for a soft follow.
    if (parallax) {
      const targetX = state.pointer.y * 0.15
      const targetZ = state.pointer.x * 0.1
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
      group.current.rotation.z += (-targetZ - group.current.rotation.z) * 0.05
    }
  })

  // Float helper "breathes" the shapes. Under reduced motion we freeze it.
  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.4, rotationIntensity: 0.6, floatIntensity: 0.8 }

  return (
    <group ref={group}>
      <Float {...floatProps}>
        <Bowl position={[0, -0.2, 0]} scale={1.15} />
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 0.8}>
        <Cup position={[1.7, 0.4, -0.5]} scale={0.8} />
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.2}>
        <Leaf position={[-1.8, 0.7, 0.2]} rotation={[0.3, 0.2, 0.6]} />
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.1}>
        <Leaf position={[-1.5, -0.6, -0.6]} rotation={[-0.4, 0.1, -0.5]} scale={0.8} />
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 0.9}>
        <Orb color={sun} position={[1.4, -0.8, 0.4]} scale={0.7} />
      </Float>
      <Float {...floatProps} speed={floatProps.speed * 1.3}>
        <Orb color={won} position={[-0.4, 1.4, -0.4]} scale={0.5} />
      </Float>

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.35}
        scale={8}
        blur={2.6}
        far={4}
        color="#000000"
      />
    </group>
  )
}

/**
 * The hero's R3F canvas. Kept light: low-poly primitives, plain lights (no HDR
 * environment fetch), dpr capped, and parallax/spin disabled on small screens
 * or under prefers-reduced-motion.
 */
export default function Scene3D({ reducedMotion = false, isSmallScreen = false }) {
  const parallax = !reducedMotion && !isSmallScreen
  const dpr = isSmallScreen ? [1, 1.5] : [1, 2]

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0, 0.5, 5.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      // Render only when something changes if motion is off — saves battery.
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      {/* Soft studio lighting (no external HDR — fast + offline-safe) */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -2]} intensity={0.6} color={sun} />

      <Suspense fallback={null}>
        <SceneContents reducedMotion={reducedMotion} parallax={parallax} />
      </Suspense>
    </Canvas>
  )
}
