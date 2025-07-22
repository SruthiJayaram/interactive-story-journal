import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
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
  const [characterState, setCharacterState] = useState({
    position: [0, 0, 5] as [number, number, number],
    animation: 'idle' as 'idle' | 'walking' | 'talking',
    targetPosition: undefined as [number, number, number] | undefined
  });

  // Debug logging
  console.log('StoryScene render:', { 
    currentPage: currentPage?.id, 
    showChoices, 
    isNarrating,
    choicesLength: currentPage?.choices?.length 
  });

  // Handle choice selection with character movement
  const handleChoiceClick = (choiceId: string) => {
    // Generate a random position for the character to walk to
    const walkDirections = [
      [2, 0, 3],   // Right
      [-2, 0, 3],  // Left
      [0, 0, 2],   // Forward
      [1, 0, 4],   // Slight right back
      [-1, 0, 4]   // Slight left back
    ];
    
    const randomDirection = walkDirections[Math.floor(Math.random() * walkDirections.length)];
    
    // Set character to walking animation and target position
    setCharacterState({
      position: characterState.position,
      animation: 'walking',
      targetPosition: randomDirection as [number, number, number]
    });
    
    // After a delay, make the actual choice
    setTimeout(() => {
      makeChoice(choiceId);
      // Reset character to idle after choice is made
      setCharacterState({
        position: randomDirection as [number, number, number],
        animation: 'idle',
        targetPosition: undefined
      });
    }, 1500); // 1.5 second walking duration
  };

  const onWalkComplete = () => {
    // Character finished walking
    setCharacterState(prev => ({
      ...prev,
      animation: 'idle',
      targetPosition: undefined
    }));
  };

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
      {/* Enhanced lighting setup for realistic environments */}
      <ambientLight intensity={0.3} color="#87CEEB" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.0}
        color="#FFF8DC"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      
      {/* Subtle character rim lighting */}
      <pointLight position={[0, 8, 12]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-3, 5, 8]} intensity={0.2} color="#ffaa88" />
      <pointLight position={[3, 5, 8]} intensity={0.2} color="#88aaff" />
      
      {/* Realistic ground plane (hidden but receives shadows) */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#2a4a2a" 
          transparent 
          opacity={0.1}
          roughness={1.0}
        />
      </mesh>
      
      {/* Environment */}
      {renderScene()}
      
      {/* Character - positioned on ground and moves when choices are made */}
      {currentPage.character && (
        <Character 
          position={characterState.position}
          animation={characterState.animation}
          targetPosition={characterState.targetPosition}
          onWalkComplete={onWalkComplete}
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
          onClick={() => handleChoiceClick(choice.id)}
        />
      ))}
    </group>
  );
}
