import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group } from "three";
import * as THREE from "three";

interface CharacterProps {
  position: [number, number, number];
  animation: 'idle' | 'walking' | 'talking';
}

export default function Character({ position, animation }: CharacterProps) {
  const characterRef = useRef<Group>(null);

  useFrame((state) => {
    if (!characterRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Always update the base position first
    characterRef.current.position.x = position[0];
    characterRef.current.position.y = position[1];
    characterRef.current.position.z = position[2];
    
    switch (animation) {
      case 'idle':
        // Completely still - no movement
        break;
      case 'walking':
        // Walking bob motion
        characterRef.current.position.y = position[1] + Math.abs(Math.sin(time * 4)) * 0.2;
        characterRef.current.rotation.z = Math.sin(time * 4) * 0.1;
        break;
      case 'talking':
        // Slight head nod motion
        characterRef.current.rotation.x = Math.sin(time * 3) * 0.05;
        characterRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
        break;
    }
  });

  // Static pose - no arm movement, minimal leg animation
  const armRotation = 0; // Keep arms still
  const legRotation = 0; // Keep legs still for idle pose

  return (
    <group ref={characterRef} position={position} castShadow receiveShadow>
      {/* Main character body - more detailed humanoid figure */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.25, 0.8, 6, 12]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      
      {/* Head with better proportions */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.45, -0.05]}>
        <sphereGeometry args={[0.24, 12, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.08, 1.35, 0.18]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.08, 1.35, 0.18]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Left arm - hanging naturally */}
      <mesh position={[-0.3, 0.6, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 6, 8]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* Right arm - hanging naturally */}
      <mesh position={[0.3, 0.6, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 6, 8]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* Left leg - static */}
      <mesh position={[-0.12, -0.1, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 6, 8]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
      
      {/* Right leg - static */}
      <mesh position={[0.12, -0.1, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 6, 8]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
      
      {/* Character glow effect */}
      <pointLight position={[0, 1, 0]} intensity={0.3} color="#ffaa44" distance={3} />
    </group>
  );
}
