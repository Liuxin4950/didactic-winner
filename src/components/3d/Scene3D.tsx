import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useVision } from '../../contexts/VisionContext';
import EyeModel from './EyeModel';
import SimulationScene from './SimulationScene';

// 模拟近视模糊效果 - 使用简单的雾效
function MyopiaFog() {
  const { params } = useVision();
  const { scene } = useThree();

  const fogParams = useMemo(() => {
    const sphere = Math.abs(params.sphere);
    const cylinder = Math.abs(params.cylinder);
    const total = sphere + cylinder * 0.5;

    // 只有度数大于0.25才添加模糊效果
    if (total < 0.25) {
      return { near: 100, far: 100, opacity: 0 };
    }

    // 近视越深，雾越浓
    const opacity = Math.min(total * 0.08, 0.85);
    const near = 1;
    const far = 20 - total * 0.5;

    return { near, far, opacity };
  }, [params.sphere, params.cylinder]);

  useMemo(() => {
    if (fogParams.opacity > 0) {
      scene.fog = new THREE.Fog('#1a1a2e', fogParams.near, fogParams.far);
    } else {
      scene.fog = null;
    }
  }, [scene, fogParams]);

  return null;
}

// 3D场景内容
function SceneContent() {
  const { viewMode, params } = useVision();

  return (
    <>
      {/* 环境光照 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#87CEEB" />

      {viewMode === 'anatomy' ? (
        <>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={8}
            autoRotate={true}
            autoRotateSpeed={0.8}
          />
          <EyeModel />
          <Environment preset="city" />
        </>
      ) : (
        <>
          <MyopiaFog />
          <SimulationScene />
        </>
      )}
    </>
  );
}

// 加载指示器
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#0ea5e9" wireframe />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0f172a']} />
        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
