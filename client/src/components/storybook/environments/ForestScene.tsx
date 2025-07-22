import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";
import * as THREE from "three";

export default function ForestScene() {
  const groupRef = useRef<Group>(null);
  const grassTexture = useTexture("/textures/grass.png");
  
  // Pre-calculate tree positions
  const treePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      positions.push([
        (Math.random() - 0.5) * 30,
        0,
        (Math.random() - 0.5) * 30
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion for the entire scene
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Trees */}
      {treePositions.map((position, index) => (
        <Tree 
          key={index} 
          position={position as [number, number, number]} 
          delay={index * 0.1}
        />
      ))}
      
      {/* Ambient forest lighting */}
      <pointLight 
        position={[0, 5, 0]} 
        intensity={0.5} 
        color="#88ff88" 
        distance={20}
      />
      
      {/* Additional lighting for visibility */}
      <pointLight 
        position={[5, 3, 5]} 
        intensity={0.3} 
        color="#ffffff" 
        distance={15}
      />
      <pointLight 
        position={[-5, 3, -5]} 
        intensity={0.3} 
        color="#ffffff" 
        distance={15}
      />
      
      {/* Reduced fog for better visibility */}
      <fog attach="fog" args={["#204020", 30, 80]} />
    </group>
  );
}

interface TreeProps {
  position: [number, number, number];
  delay: number;
}

function Tree({ position, delay }: TreeProps) {
  const treeRef = useRef<Group>(null);

  useFrame((state) => {
    if (treeRef.current) {
      // Individual tree swaying
      const sway = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.05;
      treeRef.current.rotation.z = sway;
      treeRef.current.rotation.x = sway * 0.5;
    }
  });

  return (
    <group ref={treeRef} position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Tree canopy */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      
      {/* Additional foliage layers */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  );
}
