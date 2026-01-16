
export interface Scene {
  id: number;
  prompt: string;
  soundVoice: string;
  physicsDetail: string;
}

export interface SeoData {
  title: string;
  description: string;
  hashtags: string[];
  keywords: string;
  thumbnailPrompt: string;
  thumbnailTextSuggestions: string[];
  nextThemeSuggestions: string[];
}

export type Language = 'en' | 'vi';

export interface ScriptState {
  title: string;
  totalScenes: number;
  currentBatch: number;
  scenes: Scene[];
  isGenerating: boolean;
  isGeneratingSeo: boolean;
  seoData: SeoData | null;
  error: string | null;
  language: Language;
  // Image Generation State
  isGeneratingImage: boolean;
  thumbnailUrl: string | null;
  imageError: string | null;
}
