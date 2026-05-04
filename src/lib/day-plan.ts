import type {
  AppContent,
  BusinessModule,
  CurriculumDay,
  Dialogue,
  Pattern,
  RadioMode,
  RadioScript,
  RoleplayScenario,
  ShadowingSession,
  SrsItem,
} from "@/lib/types";

export interface DayPlan {
  day: CurriculumDay;
  patterns: Pattern[];
  dialogues: Dialogue[];
  reviewItems: SrsItem[];
  shadowing: ShadowingSession;
  roleplay: RoleplayScenario;
  mission: AppContent["missions"][number];
  businessModule: BusinessModule;
  radioScripts: Partial<Record<RadioMode, RadioScript>>;
}

export function getDayPlan(appContent: AppContent, dayNumber: number): DayPlan {
  const day =
    appContent.curriculumDays.find((candidate) => candidate.day === dayNumber) ??
    appContent.curriculumDays[0];
  const patterns = appContent.patterns.filter((pattern) => day.corePatternIds.includes(pattern.id));
  const dialogues = appContent.dialogues.filter((dialogue) =>
    day.listeningDialogueIds.includes(dialogue.id),
  );
  const reviewItems = appContent.srsItems.filter((item) => day.activeRecallSrsIds.includes(item.id));
  const shadowing =
    appContent.shadowingSessions.find((session) => session.id === day.shadowingSessionId) ??
    appContent.shadowingSessions[0];
  const roleplay =
    appContent.roleplays.find((scenario) => scenario.id === day.conversationScenarioId) ??
    appContent.roleplays[0];
  const mission =
    appContent.missions.find((candidate) => candidate.id === day.missionId) ??
    appContent.missions[0];
  const businessModule =
    appContent.businessModules.find((module) => module.id === day.businessAddonId) ??
    appContent.businessModules[0];
  const radioScripts = appContent.radioScripts
    .filter((script) => script.day === day.day)
    .reduce<Partial<Record<RadioMode, RadioScript>>>((scripts, script) => {
      scripts[script.mode] = script;
      return scripts;
    }, {});

  return {
    day,
    patterns,
    dialogues,
    reviewItems,
    shadowing,
    roleplay,
    mission,
    businessModule,
    radioScripts,
  };
}
