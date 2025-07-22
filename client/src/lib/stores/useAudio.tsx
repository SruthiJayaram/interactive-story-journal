import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  narrationSound: HTMLAudioElement | null;
  environmentalSounds: { [key: string]: HTMLAudioElement | null };
  speechSynthesis: SpeechSynthesis | null;
  currentUtterance: SpeechSynthesisUtterance | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setNarrationSound: (sound: HTMLAudioElement) => void;
  setEnvironmentalSound: (scene: string, sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playNarrationSound: () => void;
  playEnvironmentalSound: (scene: string) => void;
  stopAllSounds: () => void;
  speakNarration: (text: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  narrationSound: null,
  environmentalSounds: {},
  speechSynthesis: typeof window !== 'undefined' ? window.speechSynthesis : null,
  currentUtterance: null,
  isMuted: false, // Start unmuted so users can hear narration
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setNarrationSound: (sound) => set({ narrationSound: sound }),
  setEnvironmentalSound: (scene, sound) => set(state => ({ 
    environmentalSounds: { ...state.environmentalSounds, [scene]: sound }
  })),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },

  playNarrationSound: () => {
    const { narrationSound, hitSound, isMuted } = get();
    if (!isMuted) {
      // Play a short narration sound effect
      const soundToPlay = narrationSound || hitSound;
      if (soundToPlay) {
        const soundClone = soundToPlay.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.4;
        soundClone.playbackRate = 0.8; // Slower for narration effect
        soundClone.play().catch(error => {
          console.log("Narration sound play prevented:", error);
        });
        console.log("Playing narration sound effect");
      }
    } else {
      console.log("Narration sound skipped (muted)");
    }
  },

  playEnvironmentalSound: (scene: string) => {
    const { environmentalSounds, backgroundMusic, isMuted } = get();
    if (!isMuted) {
      const envSound = environmentalSounds[scene];
      if (envSound) {
        envSound.loop = true;
        envSound.volume = 0.2;
        envSound.play().catch(error => {
          console.log(`Environmental sound for ${scene} play prevented:`, error);
        });
        console.log(`Playing environmental sound for ${scene}`);
      } else if (backgroundMusic && scene === 'cave') {
        // Use background music with lower volume for cave ambiance
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.15;
        backgroundMusic.play().catch(error => {
          console.log("Cave ambient sound play prevented:", error);
        });
        console.log("Playing cave ambient sound");
      }
    }
  },

  stopAllSounds: () => {
    const { backgroundMusic, environmentalSounds } = get();
    
    // Stop background music
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    // Stop all environmental sounds
    Object.values(environmentalSounds).forEach(sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
    
    console.log("All sounds stopped");
  },

  speakNarration: (text: string, onComplete?: () => void) => {
    const { speechSynthesis, isMuted } = get();
    
    if (!speechSynthesis || isMuted) {
      console.log("Speech synthesis not available or muted");
      if (onComplete) onComplete();
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for storytelling
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a female storytelling voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') || 
       voice.name.toLowerCase().includes('samantha') || 
       voice.name.toLowerCase().includes('karen') || 
       voice.name.toLowerCase().includes('susan') ||
       voice.name.toLowerCase().includes('victoria'))
    ) || voices.find(voice => 
      voice.lang.includes('en') && voice.name.toLowerCase().includes('natural')
    ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(`Using voice: ${preferredVoice.name} (${preferredVoice.lang})`);
    } else {
      console.log("No female voice found, using default voice");
    }

    // Set up event handlers
    utterance.onend = () => {
      console.log("Voice narration completed");
      set({ currentUtterance: null });
      if (onComplete) onComplete();
    };

    utterance.onerror = (error) => {
      console.log("Voice narration error:", error);
      set({ currentUtterance: null });
      if (onComplete) onComplete();
    };

    utterance.onstart = () => {
      console.log("Voice narration started");
    };

    // Store and speak
    set({ currentUtterance: utterance });
    speechSynthesis.speak(utterance);
  },

  stopSpeaking: () => {
    const { speechSynthesis, currentUtterance } = get();
    
    if (speechSynthesis && currentUtterance) {
      speechSynthesis.cancel();
      set({ currentUtterance: null });
      console.log("Voice narration stopped");
    }
  }
}));
