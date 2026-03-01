import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVision } from '../../contexts/VisionContext';

function Iris({ radius = 0.35 }) {
  const irisRef = useRef<THREE.Mesh>(null);

  const irisTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // 棕色虹膜
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#4a3728');
    gradient.addColorStop(0.3, '#5c4033');
    gradient.addColorStop(0.6, '#3d2817');
    gradient.addColorStop(1, '#1f0f08');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // 放射状纹理
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(
        256 + Math.cos(angle) * 256,
        256 + Math.sin(angle) * 256
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <mesh ref={irisRef} position={[0, 0, 0.12]} rotation={[0, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial
        map={irisTexture}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

function Pupil({ radius = 0.12 }) {
  return (
    <mesh position={[0, 0, 0.13]}>
      <circleGeometry args={[radius, 32]} />
      <meshStandardMaterial color="#000000" roughness={0.2} />
    </mesh>
  );
}

function Cornea() {
  return (
    <group position={[0, 0, 0.2]}>
      {/* 角膜 - 半球形覆盖在眼睛前方 */}
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0}
          metalness={0}
          transmission={0.92}
          thickness={0.15}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </group>
  );
}

function Sclera({ scaleZ = 1 }: { scaleZ?: number }) {
  return (
    <group>
      {/* 巩膜（眼白）- 半透明 */}
      <mesh scale={[1, 0.85, scaleZ]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          color="#f8f8f8"
          roughness={0.8}
          metalness={0}
          transparent
          opacity={0.35}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* 巩膜内壁 */}
      <mesh scale={[0.9, 0.76, scaleZ * 0.9]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#d8c8c8"
          roughness={0.9}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function BloodVessels() {
  const vesselsRef = useRef<THREE.Group>(null);

  const vessels = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < 12; i++) {
      const startAngle = Math.random() * Math.PI * 2;
      const startY = (Math.random() - 0.5) * 0.2;
      const points: THREE.Vector3[] = [];
      let x = Math.cos(startAngle) * 0.28;
      let y = startY;
      let z = Math.sin(startAngle) * 0.28 * 0.12 - 0.05;

      for (let j = 0; j < 6; j++) {
        points.push(new THREE.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 0.03;
        y += (Math.random() - 0.5) * 0.015;
        z += Math.random() * 0.01;
      }
      lines.push(points);
    }
    return lines;
  }, []);

  return (
    <group ref={vesselsRef} position={[0, 0, 0]}>
      {vessels.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              count={points.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#c41e3a" opacity={0.5} transparent />
        </line>
      ))}
    </group>
  );
}

export default function EyeModel() {
  const { params } = useVision();
  const eyeRef = useRef<THREE.Group>(null);

  const myopiaScale = useMemo(() => {
    const scale = 1 + Math.abs(params.sphere) * 0.03;
    return Math.min(scale, 1.4);
  }, [params.sphere]);

  useFrame((state) => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      eyeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
  });

  return (
    <group ref={eyeRef} position={[0, 0, 0]}>
      {/* 内部结构 */}
      <BloodVessels />
      <Iris />
      <Pupil />

      {/* 外部结构 - 半透明 */}
      <Sclera scaleZ={myopiaScale} />
      <Cornea />

      {/* 高光 */}
      <mesh position={[0.1, 0.1, 0.3]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#ffffff" opacity={0.95} transparent />
      </mesh>
    </group>
  );
}
