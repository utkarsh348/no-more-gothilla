"use client";

import { useEffect, useMemo, useState } from "react";
import { content } from "@/lib/content";
import { getDayPlan } from "@/lib/day-plan";
import { missionLogToSrsItems } from "@/lib/mission";
import { buildRadioQueue, scriptToSpeakableText } from "@/lib/radio";
import { createInitialProgress, loadProgress, saveProgress } from "@/lib/progress";
import { evaluateScriptedReply } from "@/lib/roleplay";
import { calculateWeakTags, getDueItems, reviewSrsItem } from "@/lib/srs";
import type {
  DayMilestone,
  MissionLog,
  RadioMode,
  RoleplayEvaluation,
  UserProgress,
} from "@/lib/types";
import type { DayPlan } from "@/lib/day-plan";

type Screen =
  | "Command Center"
  | "Curriculum"
  | "Kannada Radio"
  | "Review"
  | "Listening"
  | "Shadowing"
  | "Conversation Dojo"
  | "Grammar Without Grammar"
  | "Mission Log"
  | "Business Context Pack"
  | "WhatsApp Companion"
  | "Progress";

const screens: Screen[] = [
  "Command Center",
  "Curriculum",
  "Kannada Radio",
  "Review",
  "Listening",
  "Shadowing",
  "Conversation Dojo",
  "Grammar Without Grammar",
  "Mission Log",
  "Business Context Pack",
  "WhatsApp Companion",
  "Progress",
];

const grammarPoints = [
  ["beku / beda", "Need or do not need: Nanage coffee beku. Iga coffee beda."],
  ["ide / illa", "There is or is not: Illi parking ide. Cash illa."],
  ["barutte / baralla", "Ability: Nanage Kannada swalpa barutte. Chennagi baralla."],
  ["madtini / madtira / madtare", "I do, you do, they do: Naanu check madtini."],
  ["madbeku / madbahuda", "Must do or can do: Payment madbeku. UPI madbahuda?"],
  ["ge / alli / inda / jothe / bagge", "To, in, from, with, about: Peenya ge, office alli."],
  ["question words", "Yenu, yelli, yaake, hege, eshtu, yavaga, yaaru, yavudu."],
  ["respectful forms", "Use maadi, heli, kodi, saar, madam for warm practical tone."],
  ["past/future basics", "Madide, madtini, madbeku, madakke hogtini, aaytu, aagutte."],
  ["sentence order", "Keep it simple: person + place/object + action is enough."],
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border border-[#dedede] bg-[#ffffff]">
      <div className="flex items-center justify-between border-b border-[#dedede] px-4 py-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "min-h-12 px-4 py-3 text-sm font-semibold transition-colors",
        variant === "primary" && "bg-[#111111] text-white hover:bg-[#333333]",
        variant === "secondary" && "border border-[#111111] bg-white text-[#111111]",
        variant === "ghost" && "bg-transparent text-[#111111] underline",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#dedede] bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-[#666666]">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress() ?? createInitialProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const updateProgress = (updater: (current: UserProgress) => UserProgress) => {
    setProgress((current) => {
      return updater(current);
    });
  };

  return [progress, updateProgress] as const;
}

function speak(text: string, rate = 0.88) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "kn-IN";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function AppShell() {
  const [progress, updateProgress] = useProgress();
  const [screen, setScreen] = useState<Screen>("Command Center");
  const [selectedDayNumber, setSelectedDayNumber] = useState(progress.currentDay);
  const [radioMode, setRadioMode] = useState<RadioMode>("gym");
  const dayPlan = useMemo(() => getDayPlan(content, selectedDayNumber), [selectedDayNumber]);
  const dueItems = useMemo(
    () => getDueItems(progress.srsItems, new Date()),
    [progress.srsItems],
  );

  const dashboardProgress = progress;
  const weakGrammar = calculateWeakTags(progress.srsItems).slice(0, 3);
  const openMilestone = (milestone: DayMilestone) => {
    if (milestone.radioMode) setRadioMode(milestone.radioMode);
    const target: Record<DayMilestone["module"], Screen> = {
      radio: "Kannada Radio",
      review: "Review",
      curriculum: "Curriculum",
      shadowing: "Shadowing",
      dojo: "Conversation Dojo",
      mission: "Mission Log",
      business: "Business Context Pack",
    };
    setScreen(target[milestone.module]);
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-[#fafafa]">
      <header className="border-b border-[#dedede] bg-[#fafafa]">
        <div className="px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-[#666666]">
            No install. Safari ready. Audio first.
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Kannada Comfort Sprint</h1>
          <p className="mt-2 text-sm text-[#444444]">
            10 days toward functional spoken Kannada comfort for Bangalore life, not a true fluency claim.
          </p>
        </div>
      </header>

      <div className="space-y-4 p-4">
        <SprintMap
          progress={dashboardProgress}
          selectedDay={selectedDayNumber}
          dueItems={dueItems}
          onSelectDay={(dayNumber) => {
            setSelectedDayNumber(dayNumber);
            setScreen("Command Center");
          }}
        />

        <Panel title={`Selected Day Tools: ${dayPlan.day.title}`}>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {screens.map((item) => (
            <button
              key={item}
              onClick={() => setScreen(item)}
              className={classNames(
                "shrink-0 border px-3 py-2 text-sm",
                screen === item
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#dedede] bg-white text-[#111111]",
              )}
            >
              {item}
            </button>
          ))}
        </nav>
        </Panel>

        {screen === "Command Center" && (
          <DayCommandCenter
            progress={dashboardProgress}
            dayPlan={dayPlan}
            dueCount={dueItems.length}
            weakGrammar={weakGrammar}
            setScreen={setScreen}
            openMilestone={openMilestone}
            updateProgress={updateProgress}
          />
        )}
        {screen === "Curriculum" && <Curriculum dayPlan={dayPlan} updateProgress={updateProgress} />}
        {screen === "Kannada Radio" && (
          <KannadaRadio
            dayPlan={dayPlan}
            mode={radioMode}
            setMode={setRadioMode}
            progress={dashboardProgress}
            updateProgress={updateProgress}
          />
        )}
        {screen === "Review" && <Review dueItems={dueItems} dayReviewItems={dayPlan.reviewItems} updateProgress={updateProgress} />}
        {screen === "Listening" && <Listening dayPlan={dayPlan} />}
        {screen === "Shadowing" && <Shadowing dayPlan={dayPlan} updateProgress={updateProgress} />}
        {screen === "Conversation Dojo" && <ConversationDojo dayPlan={dayPlan} />}
        {screen === "Grammar Without Grammar" && <Grammar />}
        {screen === "Mission Log" && <MissionLogView dayPlan={dayPlan} updateProgress={updateProgress} />}
        {screen === "Business Context Pack" && <BusinessPack dayPlan={dayPlan} />}
        {screen === "WhatsApp Companion" && <WhatsAppCompanion />}
        {screen === "Progress" && <ProgressView progress={dashboardProgress} />}
      </div>
    </main>
  );
}

function SprintMap({
  progress,
  selectedDay,
  dueItems,
  onSelectDay,
}: {
  progress: UserProgress;
  selectedDay: number;
  dueItems: UserProgress["srsItems"];
  onSelectDay: (dayNumber: number) => void;
}) {
  return (
    <Panel title="Sprint Map: Pick Any Day">
      <p className="mb-4 text-sm text-[#444444]">
        Start anywhere. The recommended day is based on progress, but every day can be opened directly.
      </p>
      <div className="space-y-2">
        {content.curriculumDays.map((day) => {
          const status = progress.completedDays.includes(day.day)
            ? "done"
            : day.day === progress.currentDay
              ? "recommended"
              : "open";
          const dayDueCount = dueItems.filter((item) => item.firstSeenDay === day.day).length;
          return (
            <div
              key={day.day}
              className={classNames(
                "border bg-white p-3",
                selectedDay === day.day ? "border-[#111111]" : "border-[#dedede]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#666666]">
                    Day {day.day} · {status} · {dayDueCount} due
                  </p>
                  <h2 className="mt-1 text-base font-semibold">{day.title}</h2>
                  <p className="mt-1 text-sm text-[#444444]">{day.intent}</p>
                </div>
                <Button variant={selectedDay === day.day ? "primary" : "secondary"} onClick={() => onSelectDay(day.day)}>
                  Open Day
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <ul className="divide-y divide-[#dedede] border border-[#dedede] bg-white">
        {items.slice(0, 5).map((item) => (
          <li key={item} className="px-3 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DayCommandCenter({
  progress,
  dayPlan,
  dueCount,
  weakGrammar,
  setScreen,
  openMilestone,
  updateProgress,
}: {
  progress: UserProgress;
  dayPlan: DayPlan;
  dueCount: number;
  weakGrammar: string[];
  setScreen: (screen: Screen) => void;
  openMilestone: (milestone: DayMilestone) => void;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const { day } = dayPlan;

  return (
    <Panel
      title="Day Command Center"
      action={
        <Button
          onClick={() =>
            updateProgress((current) => ({
              ...current,
              completedDays: Array.from(new Set([...current.completedDays, day.day])),
              currentDay: Math.max(current.currentDay, Math.min(10, day.day + 1)),
              scores: {
                conversationReadiness: Math.min(100, current.scores.conversationReadiness + 8),
                fieldBusinessComfort: Math.min(100, current.scores.fieldBusinessComfort + 4),
              },
            }))
          }
        >
          Complete Sprint
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Selected day" value={`${day.day}/10`} />
          <Metric label="Due SRS" value={dueCount} />
          <Metric label="Readiness" value={`${progress.scores.conversationReadiness}%`} />
          <Metric label="Field score" value={`${progress.scores.fieldBusinessComfort}%`} />
        </div>

        <SectionIntro title="Intent" description={day.intent} />
        <InstructionList title="Goals" description="Use these as your finish line for the day." items={day.goals} />
        <SectionIntro title="How To Run This Day" description={day.dailyInstruction} />

        <div>
          <h3 className="mb-2 text-sm font-semibold">Milestones</h3>
          <p className="mb-3 text-sm text-[#444444]">
            Finish these in the life slot where they fit: commute, running or walking, gym, desk review, and one real-world attempt.
          </p>
          <div className="space-y-2">
            {day.milestones.map((milestone) => (
              <div key={milestone.id} className="border border-[#dedede] bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-[#666666]">
                  {milestone.mode} · {milestone.durationMinutes} min
                </p>
                <h4 className="mt-1 font-semibold">{milestone.title}</h4>
                <p className="mt-1 text-sm text-[#444444]">{milestone.instruction}</p>
                <div className="mt-3">
                  <Button variant="secondary" onClick={() => openMilestone(milestone)}>
                    {milestone.actionLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <InstructionList
          title="Curriculum"
          description="These are the exact day-specific pieces behind the milestones."
          items={[
            `${dayPlan.patterns.length} patterns to generate sentences`,
            `${dayPlan.dialogues.length} listening dialogues`,
            `Shadowing: ${dayPlan.shadowing.title}`,
            `Dojo: ${dayPlan.roleplay.title}`,
            `Mission: ${dayPlan.mission.task}`,
            `Optional business: ${dayPlan.businessModule.title}`,
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <List title="Weak grammar" items={weakGrammar.length ? weakGrammar : progress.weakGrammarPatterns} />
          <List title="Weak listening" items={progress.weakListeningAreas} />
          <List title="Weak scenarios" items={progress.weakRealLifeScenarios} />
        </div>
        <Button variant="secondary" onClick={() => setScreen("Curriculum")}>
          Open Full Curriculum
        </Button>
      </div>
    </Panel>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-[#dedede] bg-white p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[#444444]">{description}</p>
    </div>
  );
}

function InstructionList({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="mb-2 text-sm text-[#444444]">{description}</p>
      <ul className="divide-y divide-[#dedede] border border-[#dedede] bg-white">
        {items.map((item) => (
          <li key={item} className="px-3 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Curriculum({
  dayPlan,
  updateProgress,
}: {
  dayPlan: DayPlan;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const { day } = dayPlan;

  return (
    <Panel
      title={`Curriculum: ${day.title}`}
      action={
        <Button
          onClick={() =>
            updateProgress((current) => ({
              ...current,
              completedSprints: Array.from(new Set([...current.completedSprints, `day-${day.day}-curriculum`])),
            }))
          }
        >
          Mark Curriculum Done
        </Button>
      }
    >
      <div className="space-y-4">
        <SectionIntro title="Intent" description={day.intent} />
        <InstructionList
          title="Patterns To Generate Sentences With"
          description="Say each pattern aloud, then swap the noun or action so it becomes flexible speech."
          items={dayPlan.patterns.map((pattern) => `${pattern.form}: ${pattern.explanation}`)}
        />
        <InstructionList
          title="Listening Dialogues To Understand"
          description="Listen for meaning first, then shadow one useful line from each dialogue."
          items={dayPlan.dialogues.map((dialogue) => dialogue.title)}
        />
        <InstructionList
          title="Active Recall Items To Produce"
          description="Try to answer before revealing. Slow understandable Kannada scores better than silent recognition."
          items={dayPlan.reviewItems.map((item) => item.prompt)}
        />
        <InstructionList
          title="Mission And Optional Business Add-On"
          description="Do the mission for general comfort first; business remains secondary."
          items={[dayPlan.mission.task, `Optional: ${dayPlan.businessModule.title}`]}
        />
      </div>
    </Panel>
  );
}

function KannadaRadio({
  dayPlan,
  mode,
  setMode,
  progress,
  updateProgress,
}: {
  dayPlan: DayPlan;
  mode: RadioMode;
  setMode: (mode: RadioMode) => void;
  progress: UserProgress;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const script =
    dayPlan.radioScripts[mode] ??
    content.radioScripts.find((item) => item.mode === mode) ??
    content.radioScripts[0];
  const queue = buildRadioQueue(script);

  return (
    <Panel title={`Kannada Radio: ${dayPlan.day.title}`}>
      <p className="mb-4 text-sm text-[#444444]">
        Pick the life slot you are in now. This radio script is scoped to the selected day.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(["gym", "running", "commute", "review", "sleep"] as RadioMode[]).map((item) => (
          <Button key={item} variant={mode === item ? "primary" : "secondary"} onClick={() => setMode(item)}>
            {item}
          </Button>
        ))}
      </div>
      <div className="mt-4 border border-[#dedede] bg-white p-4">
        <h3 className="text-lg font-semibold">{queue.title}</h3>
        <p className="mt-1 text-sm text-[#444444]">{queue.description}</p>
        <p className="mt-2 text-xs text-[#666666]">Optional MP3 path: {queue.audioPath ?? "/public/audio"}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => {
              speak(scriptToSpeakableText(queue), mode === "running" || mode === "sleep" ? 0.78 : 0.9);
              updateProgress((current) => ({
                ...current,
                minutes: {
                  ...current.minutes,
                  listening: current.minutes.listening + queue.estimatedMinutes,
                  speaking: current.minutes.speaking + (mode === "sleep" ? 0 : 3),
                },
              }));
            }}
          >
            Play With Browser TTS
          </Button>
          <Button variant="secondary" onClick={() => window.speechSynthesis?.cancel()}>
            Stop
          </Button>
        </div>
      </div>
      <ol className="mt-4 divide-y divide-[#dedede] border border-[#dedede] bg-white">
        {queue.steps.map((step, index) => (
          <li key={`${step.kind}-${index}`} className="px-3 py-2 text-sm">
            <span className="font-semibold">{step.kind}</span>
            {step.seconds ? ` ${step.seconds}s` : ""}
            {step.text ? `: ${step.text}` : ""}
          </li>
        ))}
      </ol>
      {mode === "review" && <p className="mt-3 text-sm">Due review items now: {getDueItems(progress.srsItems, new Date()).length}</p>}
    </Panel>
  );
}

function Review({
  dueItems,
  dayReviewItems,
  updateProgress,
}: {
  dueItems: UserProgress["srsItems"];
  dayReviewItems: UserProgress["srsItems"];
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const item = dueItems[0] ?? dayReviewItems[0];
  const [showAnswer, setShowAnswer] = useState(false);

  if (!item) {
    return <Panel title="Review">No SRS items are available right now. Kannada Radio review mode will pick them up later.</Panel>;
  }

  return (
    <Panel title="Selected Day Active Recall">
      <p className="mb-4 text-sm text-[#444444]">
        Produce the answer before revealing it. Due SRS appears first; selected-day recall fills the gap.
      </p>
      <p className="text-xs uppercase tracking-wide text-[#666666]">{item.type}</p>
      <h3 className="mt-2 text-lg font-semibold">{item.prompt}</h3>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
        <Button variant="secondary" onClick={() => speak(item.audioScript.join(". "))}>
          Speak Prompt
        </Button>
      </div>
      {showAnswer && (
        <div className="mt-4 border border-[#dedede] bg-white p-4">
          <p className="text-xl font-semibold">{item.answer}</p>
          <p className="mt-2 text-sm text-[#444444]">{item.naturalMeaning}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((score) => (
              <Button
                key={score}
                variant="secondary"
                onClick={() => {
                  updateProgress((current) => ({
                    ...current,
                    srsItems: current.srsItems.map((candidate) =>
                      candidate.id === item.id ? reviewSrsItem(candidate, score, new Date()) : candidate,
                    ),
                  }));
                  setShowAnswer(false);
                }}
              >
                {score}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function Listening({ dayPlan }: { dayPlan: DayPlan }) {
  const [category, setCategory] = useState<"all" | "everyday" | "bangalore-local" | "business">("all");
  const dialogues = content.dialogues.filter((dialogue) => category === "all" || dialogue.category === category);

  return (
    <Panel title="Listening Library">
      <InstructionList
        title="Selected Day Listening"
        description="Start here before browsing the full library. Understand meaning first; shadow only after it feels familiar."
        items={dayPlan.dialogues.map((dialogue) => dialogue.title)}
      />
      <select className="mb-4 w-full border border-[#dedede] bg-white p-3" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
        <option value="all">All categories</option>
        <option value="everyday">Everyday</option>
        <option value="bangalore-local">Bangalore local comfort</option>
        <option value="business">Business/domain add-on</option>
      </select>
      <div className="space-y-3">
        {dialogues.slice(0, 12).map((dialogue) => (
          <div key={dialogue.id} className="border border-[#dedede] bg-white p-4">
            <h3 className="font-semibold">{dialogue.title}</h3>
            <p className="mt-1 text-sm text-[#444444]">{dialogue.englishMeaning}</p>
            <div className="mt-3 space-y-2">
              {dialogue.romanizedKannada.map((line) => (
                <p key={`${dialogue.id}-${line.speaker}-${line.romanizedKannada}`} className="text-sm">
                  <span className="font-semibold">{line.speaker}:</span> {line.romanizedKannada}
                </p>
              ))}
            </div>
            <Button variant="secondary" onClick={() => speak(dialogue.slowVersion.join(". "), 0.78)}>
              Play Slow TTS
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Shadowing({
  dayPlan,
  updateProgress,
}: {
  dayPlan: DayPlan;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const session = dayPlan.shadowing;

  return (
    <Panel title={`Shadowing Trainer: ${dayPlan.day.title}`}>
      <p className="mb-4 text-sm text-[#444444]">
        This is the selected day shadowing session. Copy rhythm, endings, and question tone; do not worry about speech recognition.
      </p>
      <h3 className="text-lg font-semibold">{session.title}</h3>
      <p className="mt-1 text-sm text-[#444444]">Focus: {session.focus.join(", ")}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button onClick={() => speak(session.listenOnce.join(". "), 0.82)}>Listen Once</Button>
        <Button variant="secondary" onClick={() => speak(session.shadowSlow.join(". "), 0.72)}>Shadow Slow</Button>
        <Button variant="secondary" onClick={() => speak(session.shadowNatural.join(". "), 0.95)}>Natural Speed</Button>
      </div>
      <div className="mt-4 divide-y divide-[#dedede] border border-[#dedede] bg-white">
        {session.transcript.map((line) => (
          <p key={`${session.id}-${line.speaker}`} className="px-3 py-2 text-sm">
            <span className="font-semibold">{line.speaker}:</span> {line.romanizedKannada}
          </p>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={() => {
            updateProgress((current) => ({
              ...current,
              minutes: { ...current.minutes, shadowing: current.minutes.shadowing + 8 },
            }));
          }}
        >
          Self-Rate And Continue
        </Button>
      </div>
    </Panel>
  );
}

function ConversationDojo({ dayPlan }: { dayPlan: DayPlan }) {
  const [reply, setReply] = useState("");
  const [evaluation, setEvaluation] = useState<RoleplayEvaluation | null>(null);
  const scenario = dayPlan.roleplay;
  const turn = scenario.turns[0];

  return (
    <Panel title={`Conversation Dojo: ${dayPlan.day.title}`}>
      <p className="mb-4 text-sm text-[#444444]">
        This scenario is selected for the day. Reply simply, then use feedback to keep the next turn alive.
      </p>
      <div className="mt-4 border border-[#dedede] bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-[#666666]">{scenario.setting}</p>
        <h3 className="mt-1 text-lg font-semibold">{scenario.title}</h3>
        <p className="mt-3 font-semibold">NPC: {turn.npcLine}</p>
        <textarea
          className="mt-3 min-h-28 w-full border border-[#dedede] p-3"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Type or say your Kannada reply, then self-check here."
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => setEvaluation(evaluateScriptedReply(turn, reply))}>Evaluate Reply</Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const response = await fetch("/api/roleplay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenario: scenario.title, reply }),
              });
              const data = await response.json();
              setEvaluation({
                ...evaluateScriptedReply(turn, reply),
                whatWasUnclear: data.message ?? "LLM mode is not configured.",
              });
            }}
          >
            Try Optional LLM
          </Button>
        </div>
      </div>
      {evaluation && (
        <div className="mt-4 border border-[#dedede] bg-white p-4 text-sm">
          <p><span className="font-semibold">Good:</span> {evaluation.whatWasGood}</p>
          <p className="mt-2"><span className="font-semibold">Unclear:</span> {evaluation.whatWasUnclear}</p>
          <p className="mt-2"><span className="font-semibold">Simple:</span> {evaluation.betterSimpleVersion}</p>
          <p className="mt-2"><span className="font-semibold">Natural:</span> {evaluation.betterNaturalVersion}</p>
          <p className="mt-2"><span className="font-semibold">Pattern:</span> {evaluation.reusablePattern}</p>
          <p className="mt-2"><span className="font-semibold">Next NPC:</span> {evaluation.nextNpcLine}</p>
        </div>
      )}
    </Panel>
  );
}

function Grammar() {
  return (
    <Panel title="Grammar Without Grammar">
      <div className="space-y-3">
        {grammarPoints.map(([title, explanation]) => (
          <div key={title} className="border border-[#dedede] bg-white p-4">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-[#444444]">{explanation}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MissionLogView({
  dayPlan,
  updateProgress,
}: {
  dayPlan: DayPlan;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
}) {
  const mission = dayPlan.mission;
  const [form, setForm] = useState({
    person: "",
    said: "",
    reply: "",
    frozeAt: "",
    understood: "",
    failedToSay: "",
    switchedToEnglish: "",
    tomorrowReview: "",
  });

  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <Panel title="Real-World Mission Log">
      <h3 className="text-lg font-semibold">{mission.title}</h3>
      <p className="mt-1 text-sm text-[#444444]">{mission.task}</p>
      <div className="mt-4 space-y-3">
        {Object.entries(form).map(([field, value]) => (
          <label key={field} className="block text-sm font-semibold">
            {field}
            <textarea
              className="mt-1 min-h-16 w-full border border-[#dedede] p-3 font-normal"
              value={value}
              onChange={(event) => setField(field as keyof typeof form, event.target.value)}
            />
          </label>
        ))}
      </div>
      <Button
        onClick={() => {
          const log: MissionLog = {
            missionId: mission.id,
            day: mission.day,
            createdAt: new Date().toISOString(),
            ...form,
          };
          const generated = missionLogToSrsItems(log, new Date());
          updateProgress((current) => ({
            ...current,
            missionLogs: [...current.missionLogs, log],
            srsItems: [...generated, ...current.srsItems],
          }));
        }}
      >
        Save Mission And Generate Review
      </Button>
    </Panel>
  );
}

function BusinessPack({ dayPlan }: { dayPlan: DayPlan }) {
  const selectedModule = dayPlan.businessModule;
  return (
    <Panel title="Business Context Pack">
      <p className="mb-4 text-sm text-[#444444]">
        This is separate from core fluency. Use it after the daily general sprint, not instead of it.
      </p>
      <div className="mb-4 border border-[#111111] bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-[#666666]">Selected day optional add-on</p>
        <h3 className="mt-1 font-semibold">{selectedModule.title}</h3>
        <p className="mt-1 text-sm text-[#444444]">{selectedModule.goal}</p>
        <List title="Use these after general practice" items={selectedModule.simpleKannadaLines} />
      </div>
      <div className="space-y-3">
        {content.businessModules.map((module) => (
          <div key={module.id} className="border border-[#dedede] bg-white p-4">
            <h3 className="font-semibold">{module.title}</h3>
            <p className="mt-1 text-sm text-[#444444]">{module.scenario}</p>
            <List title="Core questions" items={module.coreQuestions.slice(0, 3)} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function WhatsAppCompanion() {
  const [category, setCategory] = useState<"everyday" | "business">("everyday");
  const templates = content.whatsAppTemplates.filter((template) => template.category === category);

  return (
    <Panel title="WhatsApp Companion">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button variant={category === "everyday" ? "primary" : "secondary"} onClick={() => setCategory("everyday")}>
          Everyday
        </Button>
        <Button variant={category === "business" ? "primary" : "secondary"} onClick={() => setCategory("business")}>
          Business
        </Button>
      </div>
      <div className="space-y-3">
        {templates.slice(0, 12).map((template) => (
          <div key={template.id} className="border border-[#dedede] bg-white p-4">
            <h3 className="font-semibold">{template.title}</h3>
            <p className="mt-2 text-lg">{template.kannadaEnglish}</p>
            <p className="mt-2 text-sm text-[#444444]">{template.englishMeaning}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProgressView({ progress }: { progress: UserProgress }) {
  return (
    <Panel title="Progress">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Completed days" value={progress.completedDays.length} />
        <Metric label="SRS total" value={progress.srsItems.length} />
        <Metric label="Missions" value={progress.missionLogs.length} />
        <Metric label="Day now" value={progress.currentDay} />
      </div>
      <div className="mt-4">
        <List title="Completed day numbers" items={progress.completedDays.map(String)} />
      </div>
    </Panel>
  );
}
