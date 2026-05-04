export type NationStrand =
  | "meaning-focused-input"
  | "meaning-focused-output"
  | "language-focused-learning"
  | "fluency-development";

export type SrsItemType =
  | "grammar-pattern"
  | "sentence-transformation"
  | "listening-comprehension"
  | "spoken-production"
  | "repair-move"
  | "mini-dialogue"
  | "roleplay-turn"
  | "pronunciation-shadowing-line"
  | "business-domain-item";

export type RadioMode = "gym" | "running" | "commute" | "review" | "sleep";

export type DayMilestoneMode =
  | "commute"
  | "running-walking"
  | "gym"
  | "review"
  | "shadowing"
  | "dojo"
  | "mission"
  | "business";

export type DayMilestoneModule =
  | "radio"
  | "review"
  | "curriculum"
  | "shadowing"
  | "dojo"
  | "mission"
  | "business";

export type RadioStepKind =
  | "situation"
  | "english-prompt"
  | "kannada-line"
  | "kannada-answer"
  | "npc-line"
  | "model-reply"
  | "explanation"
  | "summary"
  | "shadow"
  | "pause";

export interface Pattern {
  id: string;
  family: string;
  title: string;
  explanation: string;
  form: string;
  kannadaScript?: string;
  everydaySubstitutions: string[];
  bangaloreExamples: string[];
  businessExamples: string[];
  listeningExamples: string[];
  productionPrompts: string[];
  roleplayUsage: string;
  srsSchedule: string[];
  tags: string[];
}

export interface DialogueLine {
  speaker: string;
  romanizedKannada: string;
  english: string;
}

export interface Dialogue {
  id: string;
  title: string;
  category: "everyday" | "bangalore-local" | "business";
  setting: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  romanizedKannada: DialogueLine[];
  kannadaScript?: string;
  englishMeaning: string;
  slowVersion: string[];
  naturalVersion: string[];
  keyPatterns: string[];
  comprehensionQuestions: string[];
  shadowingLines: string[];
  noticeNotes: string[];
  tags: string[];
}

export interface SrsItem {
  id: string;
  type: SrsItemType;
  prompt: string;
  answer: string;
  acceptedVariants: string[];
  literalMeaning: string;
  naturalMeaning: string;
  audioScript: string[];
  context: string;
  tags: string[];
  firstSeenDay: number;
  dueAt: string;
  interval: number;
  ease: number;
  successScore: number | null;
  failCount: number;
  lastReviewedAt: string | null;
}

export interface CurriculumDay {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  dailyInstruction: string;
  milestones: DayMilestone[];
  generalFluencyTarget: string;
  nationBalance: NationStrand[];
  corePatternIds: string[];
  pronunciationFocus: string;
  listeningDialogueIds: string[];
  shadowingSessionId: string;
  activeRecallSrsIds: string[];
  conversationScenarioId: string;
  missionId: string;
  businessAddonId: string;
}

export interface DayMilestone {
  id: string;
  mode: DayMilestoneMode;
  title: string;
  durationMinutes: number;
  instruction: string;
  actionLabel: string;
  module: DayMilestoneModule;
  radioMode?: RadioMode;
}

export interface RadioStep {
  kind: RadioStepKind;
  text?: string;
  seconds?: number;
}

export interface RadioScript {
  id: string;
  day: number;
  mode: RadioMode;
  title: string;
  description: string;
  estimatedMinutes: number;
  audioPath?: string;
  steps: RadioStep[];
}

export interface ShadowingSession {
  id: string;
  day: number;
  title: string;
  focus: string[];
  listenOnce: string[];
  transcript: DialogueLine[];
  repeatSlowly: string[];
  shadowSlow: string[];
  shadowNatural: string[];
  optionalRecording: boolean;
  selfRatePrompt: string;
  tags: string[];
}

export interface RoleplayTurn {
  npcLine: string;
  expectedIntent: string;
  simpleReply: string;
  naturalReply: string;
  reusablePattern: string;
  nextNpcLine: string;
  acceptedKeywords: string[];
}

export interface RoleplayScenario {
  id: string;
  track: "general" | "repair" | "business";
  title: string;
  setting: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  npcPersona: string;
  goals: string[];
  turns: RoleplayTurn[];
  tags: string[];
}

export interface RoleplayEvaluation {
  intentMatch: number;
  understandableKannada: number;
  respectTone: number;
  continuation: number;
  repairStrategy: number;
  naturalness: number;
  confidence: number;
  whatWasGood: string;
  whatWasUnclear: string;
  betterSimpleVersion: string;
  betterNaturalVersion: string;
  reusablePattern: string;
  nextNpcLine: string;
}

export interface Mission {
  id: string;
  day: number;
  title: string;
  task: string;
  reflectionFields: string[];
  suggestedRepairPattern: string;
}

export interface MissionLog {
  missionId: string;
  day: number;
  person: string;
  said: string;
  reply: string;
  frozeAt: string;
  understood: string;
  failedToSay: string;
  switchedToEnglish: string;
  tomorrowReview: string;
  createdAt: string;
}

export interface BusinessModule {
  id: string;
  title: string;
  goal: string;
  scenario: string;
  coreQuestions: string[];
  simpleKannadaLines: string[];
  repairMoves: string[];
  tags: string[];
}

export interface WhatsAppTemplate {
  id: string;
  category: "everyday" | "business";
  title: string;
  context: string;
  kannadaEnglish: string;
  englishMeaning: string;
  tags: string[];
}

export interface RepairDrill {
  id: string;
  title: string;
  trigger: string;
  simpleRepair: string;
  naturalRepair: string;
  followUp: string;
  tags: string[];
}

export interface UserProgress {
  startedAt: string;
  currentDay: number;
  completedDays: number[];
  completedSprints: string[];
  minutes: {
    listening: number;
    speaking: number;
    shadowing: number;
  };
  scores: {
    conversationReadiness: number;
    fieldBusinessComfort: number;
  };
  weakGrammarPatterns: string[];
  weakListeningAreas: string[];
  weakRealLifeScenarios: string[];
  srsItems: SrsItem[];
  missionLogs: MissionLog[];
  radioSelfRatings: Record<string, number>;
}

export interface AppContent {
  curriculumDays: CurriculumDay[];
  patterns: Pattern[];
  dialogues: Dialogue[];
  srsItems: SrsItem[];
  radioScripts: RadioScript[];
  shadowingSessions: ShadowingSession[];
  roleplays: RoleplayScenario[];
  missions: Mission[];
  businessModules: BusinessModule[];
  whatsAppTemplates: WhatsAppTemplate[];
  repairDrills: RepairDrill[];
}
