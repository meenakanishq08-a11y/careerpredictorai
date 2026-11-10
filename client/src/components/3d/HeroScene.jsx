import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Individual floating orb
const Orb = ({ position, color, size, speed }) => {
  const meshRef = useRef();
  const time = useRef(Math.random() * 100);

  useFrame(() => {
    if (!meshRef.current) return;
    time.current += speed * 0.01;
    meshRef.current.position.y = position[1] + Math.sin(time.current) * 0.35;
    meshRef.current.rotation.x = time.current * 0.25;
    meshRef.current.rotation.z = time.current * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.85}
        roughness={0.15}
        metalness={0.4}
      />
    </mesh>
  );
};

// Rotating wireframe globe
const Globe = () => {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0018;
      meshRef.current.rotation.x += 0.0008;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2.2, 2]} />
      <meshStandardMaterial
        color="#6366f1"
        emissive="#6366f1"
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  );
};

// Particle field
const Particles = ({ count = 180 }) => {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef();
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#818cf8" transparent opacity={0.65} />
    </points>
  );
};

const HeroScene = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 55 }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />

      <Stars radius={45} depth={45} count={isMobile ? 800 : 2000} factor={3.5} fade />
      <Particles count={isMobile ? 70 : 180} />
      <Globe />

      {/* Floating orbs */}
      <Orb position={[-3.8, 1.8, -2]} color="#6366f1" size={0.45} speed={0.8} />
      <Orb position={[3.8, -1.2, -2.5]} color="#06b6d4" size={0.55} speed={0.6} />
      <Orb position={[-2, -2.6, -1]} color="#f59e0b" size={0.32} speed={1.1} />
      <Orb position={[2.8, 2.5, -2]} color="#10b981" size={0.4} speed={0.85} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 1.6}
        minPolarAngle={Math.PI / 2.8}
      />
    </Canvas>
  );
};

export default HeroScene;
