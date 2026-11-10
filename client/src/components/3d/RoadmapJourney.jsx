import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Checkpoint node
const CheckpointNode = ({ position, step, isCompleted, onToggle }) => {
  const meshRef = useRef();

  useFrame((s) => {
    if (isCompleted && meshRef.current && meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(s.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onToggle}>
      <sphereGeometry args={[0.26, 20, 20]} />
      <meshStandardMaterial
        color={isCompleted ? '#10b981' : '#6366f1'}
        emissive={isCompleted ? '#10b981' : '#6366f1'}
        emissiveIntensity={isCompleted ? 0.7 : 0.25}
        roughness={0.25}
        metalness={0.5}
      />

      {/* Outer glow halo when completed */}
      {isCompleted && (
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.16} side={THREE.BackSide} />
        </mesh>
      )}

      <Html distanceFactor={6.5} center>
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            background: isCompleted ? 'rgba(16,185,129,0.22)' : 'rgba(15,23,42,0.88)',
            border: `1.5px solid ${isCompleted ? '#10b981' : '#6366f1'}`,
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'white',
            fontSize: '11px',
            fontWeight: 600,
            maxWidth: '160px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isCompleted ? '0 0 16px rgba(16,185,129,0.45)' : '0 4px 10px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <div style={{ marginBottom: 2 }}>{isCompleted ? '✅ Complete' : '⭕ Milestone'}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>{step.step}</div>
        </div>
      </Html>
    </mesh>
  );
};

// Connecting path between nodes
const PathSegment = ({ from, to, completed }) => {
  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={completed ? '#10b981' : '#6366f1'} transparent opacity={completed ? 0.85 : 0.3} />
    </line>
  );
};

const RoadmapScene = ({ steps, onToggle }) => {
  // Position nodes in an organic 3D winding path
  const positions = useMemo(() =>
    steps.map((_, i) => {
      const t = i / (steps.length - 1 || 1);
      const x = Math.sin(t * Math.PI * 2) * 3.2;
      const y = -t * 4.2 + 2.1;
      const z = Math.cos(t * Math.PI * 1.5) * 1.6;
      return [x, y, z];
    }),
    [steps.length]
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 6]} intensity={1.5} color="#6366f1" />
      <pointLight position={[0, -2, -6]} intensity={0.6} color="#10b981" />

      {steps.map((step, i) => (
        <group key={i}>
          {i > 0 && (
            <PathSegment
              from={positions[i - 1]}
              to={positions[i]}
              completed={steps[i - 1].completed && step.completed}
            />
          )}
          <CheckpointNode
            position={positions[i]}
            step={step}
            isCompleted={step.completed}
            onToggle={() => onToggle(i)}
          />
        </group>
      ))}
    </>
  );
};

const RoadmapJourney = ({ steps = [], onToggle }) => {
  if (!steps || steps.length === 0) return null;

  const completed = steps.filter((s) => s.completed).length;
  const pct = Math.round((completed / steps.length) * 100);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div>
      {/* Progress metrics */}
      <div className="roadmap-controls">
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)' }}>
          🗺️ Phased Trajectory Progression
        </span>
        <div className="roadmap-progress-bar">
          <div className="roadmap-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', minWidth: 42 }}>
          {pct}%
        </span>
      </div>

      {/* 3D Journey Canvas */}
      <div style={{
        height: isMobile ? '320px' : '400px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #030712 100%)',
        marginBottom: 'var(--space-3)',
        border: '1px solid var(--color-border)',
      }}>
        <Canvas camera={{ position: [0, 0, 9.5], fov: 48 }} dpr={isMobile ? [1, 1] : [1, 1.5]}>
          <RoadmapScene steps={steps} onToggle={onToggle} />
        </Canvas>
      </div>

      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Tip: Click on any 3D milestone node or the checklist below to record your completion ✨
      </p>
    </div>
  );
};

export default RoadmapJourney;
