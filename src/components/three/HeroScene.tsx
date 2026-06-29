import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const Blob = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    const { x, y } = state.pointer;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.6, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.4, 0.05);
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1.6, 4]} position={[2.2, 0.2, 0]}>
        <MeshDistortMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
          distort={0.35}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
};

const Ring = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = t * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.4;
  });
  return (
    <Torus ref={ref} args={[2.6, 0.04, 16, 200]} position={[2.2, 0.2, 0]}>
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} />
    </Torus>
  );
};

const HeroScene = () => {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -3, -2]} intensity={1} color="#60a5fa" />
        <Blob />
        <Ring />
      </Suspense>
    </Canvas>
  );
};

export default HeroScene;
