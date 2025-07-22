import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useStorybook } from "./lib/stores/useStorybook";
import StoryScene from "./components/storybook/StoryScene";
import "@fontsource/inter";

// Define control keys for navigation
const controls = [
  { name: "interact", keys: ["Space", "Enter"] },
  { name: "skip", keys: ["KeyS"] },
];

function App() {
  const { currentPage, isLoaded, loadStory, isNarrating, showChoices, resetStory } = useStorybook();
  const { toggleMute } = useAudio();
  const [showCanvas, setShowCanvas] = useState(false);

  // Load the story data and initialize audio on mount
  useEffect(() => {
    loadStory();
    
    // Initialize audio with user gesture handling
    const initAudio = async () => {
      try {
        // Create audio context for better browser support
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          if (audioContext.state === 'suspended') {
            // Audio will resume on first user interaction
            document.addEventListener('click', () => {
              audioContext.resume();
            }, { once: true });
          }
        }

        const backgroundMusic = new Audio('/sounds/background.mp3');
        const hitSound = new Audio('/sounds/hit.mp3');
        const successSound = new Audio('/sounds/success.mp3');
        
        // Set up audio properties
        backgroundMusic.loop = false;
        backgroundMusic.volume = 0.3;
        backgroundMusic.preload = 'auto';
        hitSound.preload = 'auto';
        successSound.preload = 'auto';
        
        // Store in audio state
        const { setBackgroundMusic, setHitSound, setSuccessSound, setNarrationSound, setEnvironmentalSound } = useAudio.getState();
        setBackgroundMusic(backgroundMusic);
        setHitSound(hitSound);
        setSuccessSound(successSound);
        setNarrationSound(hitSound); // Use hit sound as narration effect
        
        // Set up environmental sounds using available audio files
        const forestAmbient = new Audio('/sounds/background.mp3');
        forestAmbient.volume = 0.15;
        forestAmbient.loop = true;
        setEnvironmentalSound('forest', forestAmbient);
        
        const caveAmbient = new Audio('/sounds/hit.mp3');
        caveAmbient.volume = 0.1;
        caveAmbient.loop = true;
        caveAmbient.playbackRate = 0.5; // Slower for eerie cave effect
        setEnvironmentalSound('cave', caveAmbient);
        
        const castleAmbient = new Audio('/sounds/success.mp3');
        castleAmbient.volume = 0.2;
        castleAmbient.loop = true;
        castleAmbient.playbackRate = 0.7; // Majestic castle ambiance
        setEnvironmentalSound('castle', castleAmbient);
        
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
          // Load voices
          const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            console.log(`Loaded ${voices.length} voices for narration`);
          };
          
          // Some browsers load voices asynchronously
          if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', loadVoices);
          } else {
            loadVoices();
          }
        }
        
        console.log("Audio and voice synthesis initialized successfully");
      } catch (error) {
        console.log("Audio initialization failed:", error);
      }
    };
    
    initAudio();
  }, [loadStory]);

  // Show the canvas once everything is loaded
  useEffect(() => {
    if (isLoaded) {
      setShowCanvas(true);
    }
  }, [isLoaded]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'M' || event.key === 'm') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleMute]);

  if (!isLoaded || !currentPage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 4, 12],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
              preserveDrawingBuffer: false
            }}
            style={{ background: 'transparent' }}
          >
            <color attach="background" args={["#000011"]} />
            
            {/* Ambient lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
            />

            <Suspense fallback={null}>
              <StoryScene />
            </Suspense>
          </Canvas>
          
          {/* UI Overlay for instructions */}
          <div className="absolute top-4 right-4 text-white bg-black bg-opacity-70 p-4 rounded-lg text-sm max-w-xs">
            <h3 className="font-bold mb-2 text-yellow-400">How to Play:</h3>
            <div className="space-y-1">
              <div>🖱️ Click bright green choice buttons to continue</div>
              <div>🔊 Press M to toggle sound on/off</div>
              <div>⏳ Wait ~4 seconds for narration to finish</div>
              <div>👤 Watch character move to different positions</div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-70 p-3 rounded-lg text-sm">
            {isNarrating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                <span>Narrating story...</span>
              </div>
            ) : showChoices ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Click a choice to continue</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Story loading...</span>
              </div>
            )}
          </div>

          {/* Restart Button */}
          {currentPage && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={resetStory}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                🔄 Restart Story
              </button>
            </div>
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
