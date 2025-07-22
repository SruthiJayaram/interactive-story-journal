import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useAudio } from "./useAudio";

export interface StoryPage {
  id: string;
  title: string;
  narration: string;
  scene: 'forest' | 'cave' | 'castle';
  character?: {
    position: [number, number, number];
    animation: 'idle' | 'walking' | 'talking';
  };
  choices?: {
    id: string;
    text: string;
    nextPage: string;
  }[];
  isEnding?: boolean;
  audio?: string;
}

export interface StoryData {
  title: string;
  pages: { [key: string]: StoryPage };
  startPage: string;
}

interface StorybookState {
  story: StoryData | null;
  currentPage: StoryPage | null;
  currentPageId: string;
  choiceHistory: string[];
  isLoaded: boolean;
  isNarrating: boolean;
  showChoices: boolean;
  
  // Actions
  loadStory: () => Promise<void>;
  navigateToPage: (pageId: string) => void;
  makeChoice: (choiceId: string) => void;
  startNarration: () => void;
  endNarration: () => void;
  resetStory: () => void;
}

export const useStorybook = create<StorybookState>()(
  subscribeWithSelector((set, get) => ({
    story: null,
    currentPage: null,
    currentPageId: '',
    choiceHistory: [],
    isLoaded: false,
    isNarrating: false,
    showChoices: false,
    
    loadStory: async () => {
      try {
        const response = await fetch('/src/data/story.json');
        const storyData: StoryData = await response.json();
        
        set({
          story: storyData,
          currentPageId: storyData.startPage,
          currentPage: storyData.pages[storyData.startPage],
          isLoaded: true,
          choiceHistory: [storyData.startPage]
        });
        
        // Start environmental sound and narration after a brief delay
        setTimeout(() => {
          const { playEnvironmentalSound } = useAudio.getState();
          playEnvironmentalSound(storyData.pages[storyData.startPage].scene);
          get().startNarration();
        }, 1000);
        
      } catch (error) {
        console.error('Failed to load story:', error);
      }
    },
    
    navigateToPage: (pageId: string) => {
      const { story, choiceHistory } = get();
      if (!story || !story.pages[pageId]) return;
      
      const newPage = story.pages[pageId];
      
      // Stop current environmental sounds and voice narration
      const { stopAllSounds, stopSpeaking, playEnvironmentalSound } = useAudio.getState();
      stopAllSounds();
      stopSpeaking();
      
      set({
        currentPageId: pageId,
        currentPage: newPage,
        choiceHistory: [...choiceHistory, pageId],
        isNarrating: false,
        showChoices: false
      });
      
      // Play environmental sound for new scene
      setTimeout(() => {
        playEnvironmentalSound(newPage.scene);
      }, 500);
      
      // Start narration after scene transition
      setTimeout(() => {
        get().startNarration();
      }, 1500);
    },
    
    makeChoice: (choiceId: string) => {
      const { currentPage } = get();
      if (!currentPage || !currentPage.choices) return;
      
      const choice = currentPage.choices.find(c => c.id === choiceId);
      if (choice) {
        get().navigateToPage(choice.nextPage);
      }
    },
    
    startNarration: () => {
      const { currentPage } = get();
      if (!currentPage) return;

      set({ isNarrating: true, showChoices: false });
      
      // Start voice narration
      const { speakNarration } = useAudio.getState();
      speakNarration(currentPage.narration, () => {
        // Show choices after voice narration completes
        const { currentPage } = get();
        if (currentPage && currentPage.choices && currentPage.choices.length > 0) {
          set({ showChoices: true });
        }
        set({ isNarrating: false });
      });
    },
    
    endNarration: () => {
      const { currentPage } = get();
      set({ isNarrating: false });
      
      if (currentPage && currentPage.choices && currentPage.choices.length > 0) {
        set({ showChoices: true });
      }
    },
    
    resetStory: () => {
      const { story } = get();
      if (!story) return;
      
      set({
        currentPageId: story.startPage,
        currentPage: story.pages[story.startPage],
        choiceHistory: [story.startPage],
        isNarrating: false,
        showChoices: false
      });
      
      setTimeout(() => {
        get().startNarration();
      }, 1000);
    }
  }))
);
