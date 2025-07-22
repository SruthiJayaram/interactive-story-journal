import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Group, Vector3 } from "three";
import * as THREE from "three";

interface CharacterProps {
  position: [number, number, number];
  animation: 'idle' | 'walking' | 'talking';
  targetPosition?: [number, number, number];
  onWalkComplete?: () => void;
}

export default function Character({ position, animation, targetPosition, onWalkComplete }: CharacterProps) {
  const characterRef = useRef<Group>(null);
  const [currentPos, setCurrentPos] = useState(new Vector3(...position));
  const [targetPos, setTargetPos] = useState(new Vector3(...position));
  const [isWalking, setIsWalking] = useState(false);

  // Update target position when it changes
  useEffect(() => {
    if (targetPosition) {
      setTargetPos(new Vector3(...targetPosition));
      setIsWalking(true);
    }
  }, [targetPosition]);

  useFrame((state) => {
    if (!characterRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Handle walking movement
    if (isWalking && animation === 'walking') {
      const distance = currentPos.distanceTo(targetPos);
      
      if (distance > 0.1) {
        // Move towards target
        const direction = targetPos.clone().sub(currentPos).normalize();
        const speed = 2; // Movement speed
        const movement = direction.multiplyScalar(speed * 0.016); // ~60fps
        
        currentPos.add(movement);
        setCurrentPos(currentPos.clone());
        
        // Look towards movement direction
        if (characterRef.current) {
          const lookDirection = Math.atan2(direction.x, direction.z);
          characterRef.current.rotation.y = lookDirection;
        }
      } else {
        // Reached target
        setIsWalking(false);
        if (onWalkComplete) {
          onWalkComplete();
        }
      }
    } else {
      // Update position directly if not walking
      setCurrentPos(new Vector3(...position));
    }
    
    // Apply current position to character
    characterRef.current.position.copy(currentPos);
    
    // Apply animations
    switch (animation) {
      case 'idle':
        // Completely still - no movement
        characterRef.current.position.y = 0; // Keep on ground
        break;
      case 'walking':
        // Walking bob motion while moving
        if (isWalking) {
          characterRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.1;
          // Arm swinging while walking
          const armSwing = Math.sin(time * 8) * 0.3;
          // Apply arm swing to character rotation slightly
          characterRef.current.rotation.z = Math.sin(time * 8) * 0.05;
        } else {
          characterRef.current.position.y = 0;
        }
        break;
      case 'talking':
        // Slight head nod motion
        characterRef.current.rotation.x = Math.sin(time * 3) * 0.05;
        characterRef.current.position.y = Math.sin(time * 1.5) * 0.02;
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
