import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";
import * as THREE from "three";

export default function ForestScene() {
  const groupRef = useRef<Group>(null);
  const grassTexture = useTexture("/textures/grass.png");
  const skyTexture = useTexture("/textures/sky.png");
  
  // Pre-calculate tree positions
  const treePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 25; i++) {
      positions.push([
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      ]);
    }
    return positions;
  }, []);

  // Pre-calculate bush positions
  const bushPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 15; i++) {
      positions.push([
        (Math.random() - 0.5) * 35,
        0,
        (Math.random() - 0.5) * 35
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion for the entire scene
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  // Configure textures
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(25, 25);
  
  skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping;

  return (
    <group ref={groupRef}>
      {/* Sky dome background */}
      <mesh>
        <sphereGeometry args={[100, 32, 16]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
      </mesh>
      
      {/* Enhanced ground with subtle hills */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80, 20, 20]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color="#2d5a2d"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Trees with varied sizes */}
      {treePositions.map((position, index) => (
        <Tree 
          key={index} 
          position={position as [number, number, number]} 
          delay={index * 0.1}
          scale={0.8 + Math.random() * 0.6}
        />
      ))}
      
      {/* Bushes for ground cover */}
      {bushPositions.map((position, index) => (
        <Bush 
          key={index} 
          position={position as [number, number, number]} 
        />
      ))}
      
      {/* Realistic forest lighting */}
      <ambientLight intensity={0.4} color="#87CEEB" />
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.2} 
        color="#FFF8DC"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Filtered sunlight through trees */}
      <pointLight 
        position={[0, 8, 0]} 
        intensity={0.6} 
        color="#90EE90" 
        distance={25}
      />
      
      {/* Atmospheric fog */}
      <fog attach="fog" args={["#87CEEB", 40, 120]} />
    </group>
  );
}

interface TreeProps {
  position: [number, number, number];
  delay: number;
  scale?: number;
}

function Tree({ position, delay, scale = 1 }: TreeProps) {
  const treeRef = useRef<Group>(null);

  useFrame((state) => {
    if (treeRef.current) {
      // Individual tree swaying
      const sway = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.03;
      treeRef.current.rotation.z = sway;
      treeRef.current.rotation.x = sway * 0.5;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Tree trunk with realistic texture */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Main tree canopy */}
      <mesh position={[0, 4, 0]} castShadow>
        <sphereGeometry args={[2, 12, 8]} />
        <meshStandardMaterial 
          color="#228B22" 
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>
      
      {/* Additional foliage for depth */}
      <mesh position={[0.5, 3.5, 0.5]} castShadow>
        <sphereGeometry args={[1.2, 10, 6]} />
        <meshStandardMaterial 
          color="#32CD32" 
          transparent
          opacity={0.8}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[-0.3, 3.8, -0.3]} castShadow>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial 
          color="#228B22" 
          transparent
          opacity={0.7}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

interface BushProps {
  position: [number, number, number];
}

function Bush({ position }: BushProps) {
  return (
    <group position={position}>
      {/* Bush body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshStandardMaterial 
          color="#228B22" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      
      {/* Additional bush details */}
      <mesh position={[0.3, 0.2, 0.2]} castShadow>
        <sphereGeometry args={[0.5, 6, 4]} />
        <meshStandardMaterial 
          color="#32CD32" 
          transparent
          opacity={0.9}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}
