"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

const iconData = [
  { symbol: '⚡', position: [-3, 2, 0] as [number, number, number], color: '#a855f7' },
  { symbol: '🧠', position: [3, 1.5, -1] as [number, number, number], color: '#c084fc' },
  { symbol: '💻', position: [-2.5, -1.5, 1] as [number, number, number], color: '#e879f9' },
  { symbol: '🔧', position: [2.8, -1, 0.5] as [number, number, number], color: '#a855f7' },
  { symbol: '📊', position: [0, 2.5, -0.5] as [number, number, number], color: '#c084fc' },
]

function FloatingIcon({ symbol, position, color }: { symbol: string; position: [number, number, number]; color: string }) {
  const textRef = useRef<THREE.Mesh>(null)
  const speed = useMemo(() => 0.5 + Math.random() * 0.5, [])
  const rotationSpeed = useMemo(() => 0.1 + Math.random() * 0.2, [])

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
      textRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </Float>
  )
}

function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null)

  const { positions, colors } = useMemo(() => {
    const posArray: number[] = []
    const colorArray: number[] = []
    const color = new THREE.Color('#a855f7')
    
    for (let i = 0; i < iconData.length; i++) {
      for (let j = i + 1; j < iconData.length; j++) {
        posArray.push(...iconData[i].position, ...iconData[j].position)
        colorArray.push(color.r, color.g, color.b, color.r, color.g, color.b)
      }
    }
    
    return {
      positions: new Float32Array(posArray),
      colors: new Float32Array(colorArray)
    }
  }, [])

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.15} />
    </lineSegments>
  )
}

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        {iconData.map((icon, i) => (
          <FloatingIcon key={i} {...icon} />
        ))}
        <ConnectionLines />
      </Canvas>
    </div>
  )
}
