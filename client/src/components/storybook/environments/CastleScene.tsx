import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";
import * as THREE from "three";

export default function CastleScene() {
  const groupRef = useRef<Group>(null);
  const stoneTexture = useTexture("/textures/asphalt.png"); // Using asphalt as stone texture
  
  // Pre-calculate banner positions
  const bannerPositions = useMemo(() => {
    return [
      [5, 4, 0],
      [-5, 4, 0],
      [0, 6, 5],
      [0, 6, -5]
    ];
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Majestic slow rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  // Configure stone texture
  stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(4, 4);

  return (
    <group ref={groupRef}>
      {/* Castle courtyard floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={stoneTexture} color="#cccccc" />
      </mesh>
      
      {/* Main castle keep */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 8, 4]} />
        <meshStandardMaterial map={stoneTexture} color="#aaaaaa" />
      </mesh>
      
      {/* Castle towers */}
      <CastleTower position={[8, 3, 8]} />
      <CastleTower position={[-8, 3, 8]} />
      <CastleTower position={[8, 3, -8]} />
      <CastleTower position={[-8, 3, -8]} />
      
      {/* Castle walls */}
      <CastleWall position={[0, 2, 12]} rotation={[0, 0, 0]} />
      <CastleWall position={[0, 2, -12]} rotation={[0, 0, 0]} />
      <CastleWall position={[12, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      <CastleWall position={[-12, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Banners */}
      {bannerPositions.map((position, index) => (
        <Banner 
          key={index}
          position={position as [number, number, number]}
          delay={index * 0.2}
        />
      ))}
      
      {/* Castle gate */}
      <mesh position={[0, 1, 12]} castShadow>
        <boxGeometry args={[3, 2, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Majestic lighting */}
      <pointLight 
        position={[0, 10, 0]} 
        intensity={1.2} 
        color="#ffeeaa" 
        distance={30}
        castShadow
      />
      
      {/* Torches */}
      <pointLight position={[6, 3, 6]} intensity={0.5} color="#ff8844" />
      <pointLight position={[-6, 3, 6]} intensity={0.5} color="#ff8844" />
      <pointLight position={[6, 3, -6]} intensity={0.5} color="#ff8844" />
      <pointLight position={[-6, 3, -6]} intensity={0.5} color="#ff8844" />
    </group>
  );
}

interface CastleTowerProps {
  position: [number, number, number];
}

function CastleTower({ position }: CastleTowerProps) {
  const stoneTexture = useTexture("/textures/asphalt.png");

  return (
    <group position={position}>
      {/* Tower base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 6, 8]} />
        <meshStandardMaterial map={stoneTexture} color="#999999" />
      </mesh>
      
      {/* Tower roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#4a4a8a" />
      </mesh>
    </group>
  );
}

interface CastleWallProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

function CastleWall({ position, rotation }: CastleWallProps) {
  const stoneTexture = useTexture("/textures/asphalt.png");

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[16, 4, 1]} />
        <meshStandardMaterial map={stoneTexture} color="#aaaaaa" />
      </mesh>
      
      {/* Battlements */}
      {[-6, -2, 2, 6].map((x, index) => (
        <mesh key={index} position={[x, 2.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1.2]} />
          <meshStandardMaterial map={stoneTexture} color="#888888" />
        </mesh>
      ))}
    </group>
  );
}

interface BannerProps {
  position: [number, number, number];
  delay: number;
}

function Banner({ position, delay }: BannerProps) {
  const bannerRef = useRef<Group>(null);

  useFrame((state) => {
    if (bannerRef.current) {
      // Waving banner motion
      bannerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1;
    }
  });

  return (
    <group ref={bannerRef} position={position}>
      {/* Banner pole */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Banner cloth */}
      <mesh position={[0.5, 0.5, 0]} castShadow>
        <planeGeometry args={[1, 1.5]} />
        <meshStandardMaterial color="#cc3333" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
