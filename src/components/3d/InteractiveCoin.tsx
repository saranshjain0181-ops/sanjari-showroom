import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

interface CoinProps {
  mousePosition: { x: number; y: number };
}

function Coin({ mousePosition }: CoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Smooth interpolation towards target rotation
    targetRotation.current.x = mousePosition.y * 0.5;
    targetRotation.current.y = mousePosition.x * 0.8;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.08
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main Coin Body - Gold */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 0.25, 64]} />
          <meshStandardMaterial
            color="#D4AC0D"
            metalness={0.95}
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Outer Ring - Silver */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.1, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.98}
            roughness={0.05}
          />
        </mesh>
        
        {/* Inner Detail Ring */}
        <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#B8860B"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Center Emblem */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
          <meshStandardMaterial
            color="#B8860B"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
        
        {/* Decorative dots around the coin */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const x = Math.cos(angle) * 1.8;
          const z = Math.sin(angle) * 1.8;
          return (
            <mesh key={i} position={[x, 0.14, z]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#C0C0C0"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function InteractiveCoin() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    setMousePosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.8} color="#F4D03F" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#E67E22" />
        
        <Coin mousePosition={mousePosition} />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
