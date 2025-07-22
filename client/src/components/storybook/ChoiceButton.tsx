import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";

interface ChoiceButtonProps {
  text: string;
  position: [number, number, number];
  onClick: () => void;
}

export default function ChoiceButton({ text, position, onClick }: ChoiceButtonProps) {
  const groupRef = useRef<Group>(null);
  const buttonRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[1]) * 0.05;
    }
    
    if (buttonRef.current) {
      // Scale animation on hover
      const targetScale = hovered ? 1.1 : 1;
      buttonRef.current.scale.setScalar(
        buttonRef.current.scale.x + (targetScale - buttonRef.current.scale.x) * 0.1
      );
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Button background */}
      <mesh ref={buttonRef} receiveShadow>
        <boxGeometry args={[4, 0.8, 0.2]} />
        <meshStandardMaterial 
          color={hovered ? "#66ff66" : "#00ff00"} 
          transparent
          opacity={1.0}
          emissive={hovered ? "#224422" : "#002200"}
        />
      </mesh>
      
      {/* Button border glow */}
      <mesh>
        <boxGeometry args={[4.2, 1.0, 0.15]} />
        <meshStandardMaterial 
          color={hovered ? "#88ff88" : "#44ff44"}
          transparent
          opacity={hovered ? 0.9 : 0.6}
          wireframe
        />
      </mesh>
      
      {/* Button highlight when hovered */}
      {hovered && (
        <pointLight 
          position={[0, 0, 0.5]} 
          intensity={0.5} 
          color="#88ff88" 
          distance={2}
        />
      )}
      
      {/* Button text */}
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.14}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.8}
        textAlign="center"
        outlineWidth={0.01}
        outlineColor="#ffffff"
      >
        {text}
      </Text>
    </group>
  );
}
