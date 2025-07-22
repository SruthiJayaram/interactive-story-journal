import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";
import * as THREE from "three";

export default function CaveScene() {
  const groupRef = useRef<Group>(null);
  const stoneTexture = useTexture("/textures/asphalt.png"); // Using asphalt as stone texture
  
  // Pre-calculate stalactite/stalagmite positions
  const formations = useMemo(() => {
    const forms = [];
    for (let i = 0; i < 15; i++) {
      forms.push({
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 3,
          (Math.random() - 0.5) * 20
        ],
        type: Math.random() > 0.5 ? 'stalactite' : 'stalagmite',
        scale: 0.5 + Math.random() * 0.5
      });
    }
    return forms;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle cave ambiance movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  // Configure stone texture
  stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(10, 10);

  return (
    <group ref={groupRef}>
      {/* Cave floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={stoneTexture} color="#444444" />
      </mesh>
      
      {/* Cave ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 8, 0]}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={stoneTexture} color="#333333" />
      </mesh>
      
      {/* Cave walls */}
      <mesh position={[15, 3.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[9, 30]} />
        <meshStandardMaterial map={stoneTexture} color="#3a3a3a" />
      </mesh>
      <mesh position={[-15, 3.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <planeGeometry args={[9, 30]} />
        <meshStandardMaterial map={stoneTexture} color="#3a3a3a" />
      </mesh>
      <mesh position={[0, 3.5, 15]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 9]} />
        <meshStandardMaterial map={stoneTexture} color="#3a3a3a" />
      </mesh>
      <mesh position={[0, 3.5, -15]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 9]} />
        <meshStandardMaterial map={stoneTexture} color="#3a3a3a" />
      </mesh>
      
      {/* Cave formations */}
      {formations.map((formation, index) => (
        <CaveFormation
          key={index}
          position={formation.position as [number, number, number]}
          type={formation.type as 'stalactite' | 'stalagmite'}
          scale={formation.scale}
        />
      ))}
      
      {/* Mysterious cave lighting */}
      <pointLight 
        position={[0, 4, 0]} 
        intensity={0.8} 
        color="#ffaa44" 
        distance={15}
        castShadow
      />
      
      {/* Additional ambient torches */}
      <pointLight position={[-8, 2, -8]} intensity={0.3} color="#ff6644" />
      <pointLight position={[8, 2, 8]} intensity={0.3} color="#ff6644" />
      
      {/* Additional cave lighting for visibility */}
      <pointLight position={[3, 2, 3]} intensity={0.4} color="#ffcc88" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#ffcc88" />
      
      {/* Reduced cave fog for better visibility */}
      <fog attach="fog" args={["#3a3a3a", 20, 50]} />
    </group>
  );
}

interface CaveFormationProps {
  position: [number, number, number];
  type: 'stalactite' | 'stalagmite';
  scale: number;
}

function CaveFormation({ position, type, scale }: CaveFormationProps) {
  const formationRef = useRef<Group>(null);

  useFrame((state) => {
    if (formationRef.current) {
      // Slight dripping animation for stalactites
      if (type === 'stalactite') {
        formationRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.01;
      }
    }
  });

  return (
    <group ref={formationRef} position={position} scale={[scale, scale, scale]}>
      <mesh castShadow receiveShadow>
        {type === 'stalactite' ? (
          <coneGeometry args={[0.2, 2, 6]} />
        ) : (
          <>
            <coneGeometry args={[0.3, 1.5, 6]} />
          </>
        )}
        <meshStandardMaterial color="#666666" roughness={0.8} />
      </mesh>
    </group>
  );
}
