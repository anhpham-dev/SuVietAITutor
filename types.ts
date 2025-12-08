

export type Language = 'en' | 'vi';
export type ViewMode = 'explore' | 'study';
export type PdfSection = 'overview' | 'analysis' | 'storyboard' | 'assets' | 'quiz';

declare global {
  interface AIStudio {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
  }
}

export interface UILabels {
  sections: {
    summary: string;
    timeline: string;
    characters: string;
    causes: string;
    development: string;
    effects: string;
    voiceover: string;
    storyboard: string;
    prompts: string;
    flashcards: string;
    mcq: string;
    thinking: string;
    visual: string;
    angle: string;
    audio: string;
    analysis: string;
  };
  study: {
    flashcardsMode: string;
    quizMode: string;
    next: string;
    prev: string;
    flip: string;
    submit: string;
    score: string;
    retake: string;
    correct: string;
    incorrect: string;
    question: string;
    of: string;
    downloadPdf: string;
    exploreLabel: string;
    studyLabel: string;
    congrats: string;
  };
  pdfModal: {
    title: string;
    description: string;
    selectAll: string;
    deselectAll: string;
    cancel: string;
    print: string;
  };
  media: {
    generateImage: string;
    generateVideo: string;
    generating: string;
    view: string;
    download: string;
    videoDisclaimer: string;
    selectKey: string;
    apiKeyRequired: string;
  };
  settings: {
    title: string;
    apiSection: string;
    apiDesc: string;
    geminiKeyLabel: string;
    veoKeyLabel: string;
    placeholder: string;
    save: string;
    saved: string;
    clear: string;
    close: string;
  };
}

export interface TimelineEvent {
  year: string;
  event: string;
}

export interface AnalysisChart {
  keyCharacters: string[];
  causes: string[];
  developments: string[];
  effects: string[];
}

export interface StoryboardScene {
  sceneNumber: number;
  visualDescription: string;
  cameraAngle: string;
  action: string;
  audio: string;
  textOverlay: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface ThinkingQuestion {
  question: string;
  answerGuide: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface HistoryLessonData {
  title: string;
  summaryPoints: string[];
  timeline: TimelineEvent[];
  analysis: AnalysisChart;
  storyboard: StoryboardScene[];
  imagePrompts: string[];
  voiceOverScript: string;
  quiz: {
    multipleChoice: QuizQuestion[];
    thinking: ThinkingQuestion[];
  };
  flashcards: Flashcard[];
}

export enum SectionTab {
  OVERVIEW = 'Overview',
  ANALYSIS = 'Analysis',
  STORYBOARD = 'Storyboard',
  ASSETS = 'Assets',
  // QUIZ removed from here as it is now in Study Mode
}

export enum StudyTab {
  FLASHCARDS = 'Flashcards',
  QUIZ = 'Quiz'
}
