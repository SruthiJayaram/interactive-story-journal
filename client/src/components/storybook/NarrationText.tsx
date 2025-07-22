import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useStorybook } from "../../lib/stores/useStorybook";

interface NarrationTextProps {
  text: string;
  title: string;
}

export default function NarrationText({ text, title }: NarrationTextProps) {
  const groupRef = useRef<Group>(null);
  const { isNarrating } = useStorybook();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion for the text
      groupRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      {/* Title */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>
      
      {/* Narration text - always visible */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {text}
      </Text>
      
      {/* Voice narrating indicator */}
      {isNarrating && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.1}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          🎙️ Narrating Story... 🎙️
        </Text>
      )}
    </group>
  );
}
