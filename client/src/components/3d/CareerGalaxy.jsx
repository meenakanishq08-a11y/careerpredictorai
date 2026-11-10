import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Individual planet for each career
const Planet = ({ career, index, total, isSelected, onClick, simulatedScore }) => {
  const meshRef = useRef();
  const orbitRef = useRef();
  const displayScore = simulatedScore ?? career.fitScore;

  // Orbit radius based on index
  const orbitRadius = 2.8 + index * 1.35;
  const angle0 = (index / total) * Math.PI * 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 0.12 / (index + 1);
    const angle = angle0 + t * speed;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  // Size and glow based on fitScore
  const size = 0.35 + (displayScore / 100) * 0.45;
  const colors = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981'];
  const color = colors[index % colors.length];

  return (
    <group ref={orbitRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        scale={isSelected ? 1.28 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : 0.35}
          roughness={0.25}
          metalness={0.7}
        />

        {/* Selected glowing ring / atmosphere */}
        {isSelected && (
          <mesh>
            <ringGeometry args={[size * 1.3, size * 1.6, 32]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}

        {/* Subtle Outer Halo */}
        <mesh>
          <sphereGeometry args={[size * 1.35, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.BackSide} />
        </mesh>

        {/* Planet Card Tag */}
        <Html distanceFactor={9} center>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(index);
            }}
            style={{
              background: isSelected ? 'rgba(99,102,241,0.92)' : 'rgba(10,15,30,0.85)',
              border: `1.5px solid ${isSelected ? '#ffffff' : color}`,
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '11px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: isSelected ? `0 0 20px ${color}` : `0 4px 12px rgba(0,0,0,0.5)`,
              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div>{career.title}</div>
            <div style={{ color: isSelected ? '#ffffff' : color, fontSize: '10px', marginTop: 2 }}>
              Score: {displayScore}%
              {simulatedScore !== undefined && simulatedScore !== career.fitScore && (
                <span style={{ color: simulatedScore > career.fitScore ? '#4ade80' : '#f87171', fontWeight: 800 }}>
                  {' '}({simulatedScore > career.fitScore ? `+${simulatedScore - career.fitScore}` : `${simulatedScore - career.fitScore}`})
                </span>
              )}
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

// Subtle Orbit Track Ring
const OrbitRing = ({ index }) => {
  const r = 2.8 + index * 1.35;
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    return pts;
  }, [r]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.18} />
    </line>
  );
};

// Central Sun / Galaxy Core
const CentralStar = () => {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={1.2}
        roughness={0.1}
      />
      <pointLight intensity={3} color="#f59e0b" distance={18} decay={2} />
    </mesh>
  );
};

// Scene Wrapper
const GalaxyScene = ({ careerPaths, selectedIndex, onSelect, simulatedScores, enableZoom }) => (
  <>
    <ambientLight intensity={0.4} />
    <pointLight position={[12, 10, 10]} intensity={1.2} color="#6366f1" />
    <pointLight position={[-12, -8, -10]} intensity={0.8} color="#0ea5e9" />

    <Stars radius={40} depth={40} count={2200} factor={3.5} fade speed={1} />
    <CentralStar />

    {careerPaths.map((cp, i) => (
      <group key={cp.title}>
        <OrbitRing index={i} />
        <Planet
          career={cp}
          index={i}
          total={careerPaths.length}
          isSelected={selectedIndex === i}
          onClick={onSelect}
          simulatedScore={simulatedScores ? simulatedScores[i]?.fitScore : undefined}
        />
      </group>
    ))}

    <OrbitControls
      enableZoom={enableZoom}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 3.5}
      maxDistance={22}
      minDistance={6}
    />
  </>
);

const CareerGalaxy = ({ careerPaths, selectedIndex, onSelect, simulatedScores }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [zoomAllowed, setZoomAllowed] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: isMobile ? '380px' : '480px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'radial-gradient(ellipse at center, #0f172a 0%, #030712 100%)', border: '1px solid var(--color-border)' }}>
      
      {/* Zoom Toggle control so mouse wheel doesn't trap page scroll unless user wants */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: 6 }}>
        <button
          type="button"
          onClick={() => setZoomAllowed(!zoomAllowed)}
          className="btn btn-secondary btn-sm"
          style={{
            background: zoomAllowed ? 'var(--color-primary)' : 'rgba(15,23,42,0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 11,
            padding: '4px 10px',
            backdropFilter: 'blur(8px)'
          }}
        >
          {zoomAllowed ? '🔍 Scroll Zoom: ON' : '🔍 Scroll Zoom: OFF'}
        </button>
      </div>

      <Canvas camera={{ position: [0, 7, 13], fov: 52 }} dpr={isMobile ? [1, 1] : [1, 2]}>
        <GalaxyScene
          careerPaths={careerPaths}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          simulatedScores={simulatedScores}
          enableZoom={zoomAllowed}
        />
      </Canvas>
    </div>
  );
};

export default CareerGalaxy;
