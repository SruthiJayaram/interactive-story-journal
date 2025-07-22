import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useStorybook } from "../../lib/stores/useStorybook";
import ForestScene from "./environments/ForestScene";
import CaveScene from "./environments/CaveScene";
import CastleScene from "./environments/CastleScene";
import Character from "./Character";
import ChoiceButton from "./ChoiceButton";

export default function StoryScene() {
  const groupRef = useRef<Group>(null);
  const { currentPage, showChoices, makeChoice, isNarrating } = useStorybook();

  // Debug logging
  console.log('StoryScene render:', { 
    currentPage: currentPage?.id, 
    showChoices, 
    isNarrating,
    choicesLength: currentPage?.choices?.length 
  });

  // Gentle scene rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  if (!currentPage) return null;

  const renderScene = () => {
    switch (currentPage.scene) {
      case 'forest':
        return <ForestScene />;
      case 'cave':
        return <CaveScene />;
      case 'castle':
        return <CastleScene />;
      default:
        return <ForestScene />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting setup for better visibility */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Additional lighting for character visibility */}
      <pointLight position={[0, 6, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, 4, 5]} intensity={0.4} color="#ffaa88" />
      <pointLight position={[5, 4, 5]} intensity={0.4} color="#88aaff" />
      
      {/* Ground plane for reference */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2a4a2a" transparent opacity={0.3} />
      </mesh>
      
      {/* Environment */}
      {renderScene()}
      
      {/* Character - positioned in front of scene elements */}
      {currentPage.character && (
        <Character 
          position={[0, 1, 5]}
          animation={currentPage.character.animation}
        />
      )}
      
      {/* Choice Buttons - positioned vertically in front */}
      {showChoices && currentPage.choices && currentPage.choices.map((choice, index) => (
        <ChoiceButton
          key={choice.id}
          text={choice.text}
          position={[
            0,
            2 - (index * 0.8),
            8
          ]}
          onClick={() => makeChoice(choice.id)}
        />
      ))}
    </group>
  );
}
