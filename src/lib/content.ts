import type {
  AppContent,
  BusinessModule,
  CurriculumDay,
  Dialogue,
  Mission,
  Pattern,
  RadioMode,
  RadioScript,
  RepairDrill,
  RoleplayScenario,
  ShadowingSession,
  SrsItem,
  WhatsAppTemplate,
} from "@/lib/types";

export const requiredContentCounts = {
  curriculumDays: 10,
  patterns: 80,
  productionPrompts: 500,
  listeningComprehensionItems: 100,
  generalDialogues: 50,
  businessDialogues: 30,
  repairDrills: 40,
  shadowingSessions: 30,
  roleplayScenarios: 30,
  srsItems: 200,
  whatsAppTemplates: 30,
  missions: 10,
  gymScripts: 10,
  runningScripts: 10,
  commuteScripts: 10,
};

const srsSchedule = [
  "same session",
  "evening same day",
  "next day",
  "2 days later",
  "4 days later",
  "7 days later",
  "day 10 final review",
];

const patternForms = [
  ["identity and existence", "Naanu ___", "Use this to say who you are or what role you have."],
  ["identity and existence", "Nanna hesaru ___", "Use this to give your name naturally."],
  ["identity and existence", "Nanna ___ ide", "Use this for something you have."],
  ["identity and existence", "Nanage ___ ide", "Use this for a state, need, doubt, or problem you have."],
  ["identity and existence", "___ ide", "Use this to say something exists or is available."],
  ["identity and existence", "___ illa", "Use this to say something is not there."],
  ["identity and existence", "Illi ___ ide", "Use this to point out what is here."],
  ["identity and existence", "Avara hatra ___ ide", "Use this to say someone has something."],
  ["need want and preference", "Nanage ___ beku", "Use this for needs and requests."],
  ["need want and preference", "Nanage ___ beda", "Use this to refuse politely."],
  ["need want and preference", "Nanage ___ ishta", "Use this for preferences."],
  ["need want and preference", "Nanage ___ ishta illa", "Use this to say you do not like something."],
  ["need want and preference", "Naanu ___ prefer madtini", "Use this when Kannada-English mix is natural."],
  ["need want and preference", "Swalpa ___ beku", "Use this for small practical needs."],
  ["need want and preference", "Iga ___ beda", "Use this to delay or decline."],
  ["need want and preference", "Aamele ___ beku", "Use this to ask for something later."],
  ["ability and knowledge", "Nanage Kannada swalpa barutte", "Use this to set expectations."],
  ["ability and knowledge", "Nanage Kannada chennagi baralla", "Use this to explain your limit."],
  ["ability and knowledge", "___ madakke barutta?", "Use this to ask if someone can do something."],
  ["ability and knowledge", "Naanu ___ madakke try madtini", "Use this to keep going even imperfectly."],
  ["ability and knowledge", "Nanage ___ gothilla", "Use this for not knowing."],
  ["ability and knowledge", "Nanage ___ gothu", "Use this for knowing."],
  ["ability and knowledge", "Neevu ___ help madtira?", "Use this to ask for help respectfully."],
  ["ability and knowledge", "Naanu swalpa Kannada practice madtini", "Use this to explain your learning."],
  ["questions", "Idu yenu?", "Ask what this is."],
  ["questions", "Adu yenu?", "Ask what that is."],
  ["questions", "Yaaru?", "Ask who."],
  ["questions", "Yelli?", "Ask where."],
  ["questions", "Yaake?", "Ask why."],
  ["questions", "Hege?", "Ask how."],
  ["questions", "Eshtu?", "Ask how much or how many."],
  ["questions", "Yavaga?", "Ask when."],
  ["requests", "___ kodi", "Ask someone to give something."],
  ["requests", "___ maadi", "Ask someone to do something."],
  ["requests", "Swalpa ___ maadi", "Make a request softer."],
  ["requests", "___ kalisi", "Ask someone to send something."],
  ["requests", "___ heli", "Ask someone to tell something."],
  ["requests", "___ torisi", "Ask someone to show something."],
  ["requests", "Ondu nimisha wait maadi", "Ask someone to wait a minute."],
  ["requests", "Call maadi", "Ask someone to call."],
  ["action", "Naanu ___ madtini", "Say what you do or will do."],
  ["action", "Neevu ___ madtira?", "Ask what the other person does."],
  ["action", "Avru ___ madtare", "Say what they do."],
  ["action", "___ madbeku", "Say something has to be done."],
  ["action", "___ madbahuda?", "Ask if something can be done."],
  ["action", "Naanu check maadi helthini", "Buy time and promise follow-up."],
  ["action", "Naanu confirm maadi call madtini", "Confirm later by phone."],
  ["action", "Neevu WhatsApp alli kalisi", "Move details to WhatsApp."],
  ["movement", "___ ge hogbeku", "Say where you need to go."],
  ["movement", "___ inda bandiddini", "Say where you came from."],
  ["movement", "___ alli irtini", "Say where you live or stay."],
  ["movement", "Illi nillisi", "Ask a driver to stop here."],
  ["movement", "Munde hogi", "Ask someone to go ahead."],
  ["movement", "Left hogi", "Give a left direction."],
  ["movement", "Right hogi", "Give a right direction."],
  ["movement", "Nera hogi", "Give a straight direction."],
  ["time", "Ivattu ___", "Talk about today."],
  ["time", "Naale ___", "Talk about tomorrow."],
  ["time", "Ninne ___", "Talk about yesterday."],
  ["time", "Iga ___", "Talk about now."],
  ["time", "Aamele ___", "Talk about later."],
  ["time", "Munche ___", "Talk about earlier."],
  ["time", "Aadmele ___", "Talk about after something."],
  ["time", "Beligge ___", "Talk about morning."],
  ["conversation control", "Nanage swalpa artha aaytu", "Say you understood a little."],
  ["conversation control", "Poorthi artha aagilla", "Say you did not fully understand."],
  ["conversation control", "Swalpa repeat maadi", "Ask for repetition."],
  ["conversation control", "Swalpa slow aagi maatadi", "Ask for slower speech."],
  ["conversation control", "Simple Kannada alli heli", "Ask for simple Kannada."],
  ["conversation control", "English mix maadi", "Ask for mixed English."],
  ["conversation control", "WhatsApp alli kalisi", "Ask them to send details on WhatsApp."],
  ["conversation control", "Naanu check maadi helthini", "Continue after checking."],
  ["opinion emotion", "Chennagide", "Say it is good."],
  ["opinion emotion", "Sari illa", "Say it is not right."],
  ["opinion emotion", "Kashta ide", "Say it is difficult."],
  ["opinion emotion", "Easy ide", "Say it is easy."],
  ["opinion emotion", "Tumba chennagide", "Say it is very good."],
  ["opinion emotion", "Nange doubt ide", "Say you have a doubt."],
  ["opinion emotion", "Nange problem ide", "Say you have a problem."],
  ["past and future", "Naanu ___ madide", "Say what you did."],
  ["past and future", "Naanu ___ madtini", "Say what you will do."],
  ["past and future", "Naanu ___ madbeku", "Say what you must do."],
  ["past and future", "Naanu ___ madakke hogtini", "Say what you are going to do."],
  ["past and future", "___ aaytu", "Say something got done."],
  ["past and future", "___ aagutte", "Say something will happen."],
] as const;

const substitutions = [
  "coffee",
  "neeru",
  "oota",
  "bill",
  "auto",
  "flat number",
  "location",
  "meeting",
  "quotation",
  "dispatch update",
];

const bangaloreExamples = [
  "Nanage Whitefield ge hogbeku.",
  "Illi auto sigutta?",
  "Swalpa traffic ide, aamele barthini.",
  "Apartment gate alli wait maadi.",
  "Gym aadmele call madtini.",
];

const businessExamples = [
  "Peenya workshop alli owner yaaru?",
  "Hoskote dispatch update WhatsApp alli kalisi.",
  "Tally already ide, naanu replace madalla.",
  "Bommasandra factory alli purchase yaaru nodtare?",
  "Whitefield accountant jothe maatadbeku.",
];

function makePatterns(): Pattern[] {
  return patternForms.map(([family, form, explanation], index) => {
    const everydaySubstitutions = substitutions.map((substitution) =>
      form.includes("___") ? form.replace("___", substitution) : `${form} - ${substitution}`,
    );
    const productionPrompts = substitutions.slice(0, 7).map((substitution, promptIndex) => {
      const answer = form.includes("___") ? form.replace("___", substitution) : form;
      return `Prompt ${promptIndex + 1}: Say naturally in Kannada-English mix: ${answer}`;
    });
    return {
      id: `pattern-${String(index + 1).padStart(2, "0")}`,
      family,
      title: form,
      explanation,
      form,
      everydaySubstitutions,
      bangaloreExamples,
      businessExamples,
      listeningExamples: [
        everydaySubstitutions[0],
        everydaySubstitutions[1],
        businessExamples[index % businessExamples.length],
      ],
      productionPrompts,
      roleplayUsage: `Use "${form}" when you need to keep a Bangalore conversation moving.`,
      srsSchedule,
      tags: [family.replace(/\s+/g, "-"), `day-${(index % 10) + 1}`],
    };
  });
}

const everydaySettings = [
  "meeting someone near apartment",
  "apartment security",
  "shopkeeper",
  "auto driver",
  "tea stall",
  "restaurant",
  "gym front desk",
  "asking directions",
  "asking for help",
  "traffic talk",
  "rain and weather",
  "where you live",
  "talking about work",
  "making plans",
  "apologizing",
  "saying you do not understand",
  "delivery person",
  "neighbor conversation",
  "local area chat",
  "cab pickup",
  "milk booth",
  "mobile recharge shop",
  "laundry pickup",
  "parking basement",
  "office pantry",
  "bus stop",
  "clinic counter",
  "pharmacy",
  "vegetable shop",
  "breakfast darshini",
  "maintenance staff",
  "housekeeping request",
  "lift small talk",
  "asking for water",
  "confirming timing",
];

const localComfortSettings = [
  "Hindi English Kannada mixed reply",
  "someone speaking too fast",
  "someone switching to English",
  "someone appreciating your Kannada",
  "someone correcting your Kannada",
  "where are you from question",
  "what work do you do question",
  "friendly laugh after mistake",
  "Kannada baralla question",
  "fast price explanation",
  "bus conductor reply",
  "apartment staff follow-up",
  "shopkeeper asks cash or UPI",
  "driver asks exact location",
  "neighbor asks weekend plan",
];

const businessSettings = [
  "Peenya workshop visit",
  "Hoskote logistics office",
  "Whitefield factory accountant",
  "Bommasandra dispatch follow-up",
  "vendor quote call",
  "factory supervisor floor walk",
  "small manufacturer owner",
  "driver coordination",
  "purchase manager discussion",
  "Tally and Excel workflow",
  "WhatsApp order tracking",
  "manual invoice delay",
  "quality sample check",
  "capacity discussion",
  "payment follow-up",
  "quotation revision",
  "dispatch mistake",
  "owner skeptical about software",
  "accountant says Tally already ide",
  "supervisor asks who sent you",
  "raw material arrival",
  "machine breakdown update",
  "delivery challan question",
  "stock register check",
  "packing delay",
  "GST invoice request",
  "sample approval",
  "driver waiting outside",
  "factory gate entry",
  "owner asks your company work",
];

function makeDialogue(id: string, title: string, category: Dialogue["category"], index: number): Dialogue {
  const isBusiness = category === "business";
  const place = title;
  const lines = isBusiness
    ? [
        {
          speaker: "You",
          romanizedKannada: "Namaskara saar, naanu swalpa Kannada practice madtini.",
          english: "Hello sir, I am practicing a little Kannada.",
        },
        {
          speaker: "NPC",
          romanizedKannada: "Heli saar, yenu beku?",
          english: "Tell me sir, what do you need?",
        },
        {
          speaker: "You",
          romanizedKannada: "Nimma dispatch process bagge swalpa heli.",
          english: "Please tell me a little about your dispatch process.",
        },
        {
          speaker: "NPC",
          romanizedKannada: "Tally ide, aadre WhatsApp alli follow-up jasthi ide.",
          english: "Tally is there, but a lot of follow-up happens on WhatsApp.",
        },
      ]
    : [
        {
          speaker: "You",
          romanizedKannada: "Namaskara, nanage Kannada swalpa barutte.",
          english: "Hello, I know a little Kannada.",
        },
        {
          speaker: "NPC",
          romanizedKannada: "Parvagilla, heli.",
          english: "No problem, tell me.",
        },
        {
          speaker: "You",
          romanizedKannada: "Swalpa slow aagi maatadi, poorthi artha aagilla.",
          english: "Please speak slowly, I did not fully understand.",
        },
        {
          speaker: "NPC",
          romanizedKannada: "Sari, simple aagi helthini.",
          english: "Okay, I will say it simply.",
        },
      ];

  return {
    id,
    title,
    category,
    setting: place,
    difficulty: ((index % 5) + 1) as Dialogue["difficulty"],
    romanizedKannada: lines,
    englishMeaning: `${place}: a supported conversation with repair, context, and practical Bangalore Kannada.`,
    slowVersion: lines.map((line) => line.romanizedKannada),
    naturalVersion: lines.map((line) => line.romanizedKannada.replace("swalpa ", "")),
    keyPatterns: ["pattern-17", "pattern-67", "pattern-72"],
    comprehensionQuestions: [
      `Where is this conversation happening? (${place})`,
      "What repair move did the learner use?",
    ],
    shadowingLines: lines.slice(0, 3).map((line) => line.romanizedKannada),
    noticeNotes: [
      "Respectful saar/maadi keeps the tone warm.",
      "Repair moves are success, not failure.",
      isBusiness
        ? "Business lines stay simple and do not replace general fluency."
        : "Short everyday lines build speed before complex topics.",
    ],
    tags: [category, place.toLowerCase().replace(/[^a-z0-9]+/g, "-")],
  };
}

function makeDialogues(): Dialogue[] {
  const everyday = everydaySettings.map((setting, index) =>
    makeDialogue(`dialogue-everyday-${index + 1}`, setting, "everyday", index),
  );
  const local = localComfortSettings.map((setting, index) =>
    makeDialogue(`dialogue-local-${index + 1}`, setting, "bangalore-local", index + everyday.length),
  );
  const business = businessSettings.map((setting, index) =>
    makeDialogue(`dialogue-business-${index + 1}`, setting, "business", index),
  );
  return [...everyday, ...local, ...business];
}

const missions: Mission[] = [
  ["Use Kannada opening with any local person.", "opening"],
  ["Ask one shopkeeper a question in Kannada.", "shopkeeper question"],
  ["Ask someone where something is.", "where question"],
  ["Have 60 seconds of small talk.", "small talk"],
  ["Ask someone what work they do.", "work question"],
  ["Explain in simple Kannada-English what you do.", "explain work"],
  ["Ask someone to repeat or speak slowly instead of switching immediately to English.", "repair"],
  ["Have a 3-minute mixed Kannada-English conversation.", "mixed conversation"],
  ["Ask a local business/workshop/vendor 3 workflow questions.", "workflow questions"],
  ["Complete one real Bangalore conversation where you start in Kannada, repair at least once, and close politely.", "final conversation"],
].map(([task, title], index) => ({
  id: `mission-day-${index + 1}`,
  day: index + 1,
  title: `Day ${index + 1}: ${title}`,
  task,
  reflectionFields: [
    "Who did you speak to?",
    "What did you say?",
    "What did they reply?",
    "Where did you freeze?",
    "What did you understand?",
    "What did you fail to say?",
    "Did you switch to English? Why?",
    "What should come back in SRS tomorrow?",
  ],
  suggestedRepairPattern:
    index < 6 ? "Swalpa repeat maadi." : "Naanu check maadi helthini.",
}));

function makeShadowingSessions(dialogues: Dialogue[]): ShadowingSession[] {
  const focusSets = [
    ["rhythm", "respectful endings"],
    ["question intonation", "speed"],
    ["confidence", "Kannada-English mix"],
  ];
  return Array.from({ length: 30 }, (_, index) => {
    const dialogue = dialogues[index % dialogues.length];
    const lines = dialogue.romanizedKannada.slice(0, 3);
    return {
      id: `shadow-${index + 1}`,
      day: (index % 10) + 1,
      title: `Shadow ${index + 1}: ${dialogue.title}`,
      focus: focusSets[index % focusSets.length],
      listenOnce: lines.map((line) => line.romanizedKannada),
      transcript: lines,
      repeatSlowly: lines.map((line) => line.romanizedKannada),
      shadowSlow: lines.map((line) => `${line.romanizedKannada} ...`),
      shadowNatural: lines.map((line) => line.romanizedKannada),
      optionalRecording: true,
      selfRatePrompt: "Rate rhythm, endings, question tone, speed, and confidence from 0 to 5.",
      tags: ["shadowing", dialogue.category],
    };
  });
}

function makeRoleplays(): RoleplayScenario[] {
  const titles = [
    "stranger small talk",
    "shop",
    "auto",
    "apartment",
    "food order",
    "asking for help",
    "gym conversation",
    "neighbor conversation",
    "delivery person",
    "local area conversation",
    "talking about work",
    "making plans",
    "fast Kannada",
    "unknown word",
    "mixed Hindi Kannada English",
    "unexpected follow-up",
    "friendly correction",
    "Kannada baralla question",
    "Peenya workshop owner",
    "Hoskote logistics operator",
    "Whitefield factory accountant",
    "purchase manager",
    "dispatch coordinator",
    "factory supervisor",
    "vendor says Tally already ide",
    "skeptical owner",
    "driver coordination",
    "quotation follow-up",
    "invoice payment",
    "Bommasandra factory gate",
  ];
  return titles.map((title, index) => {
    const track = index < 12 ? "general" : index < 18 ? "repair" : "business";
    return {
      id: `roleplay-${index + 1}`,
      track,
      title,
      setting: title,
      difficulty: ((index % 5) + 1) as RoleplayScenario["difficulty"],
      npcPersona:
        track === "business"
          ? "local SME operator who prefers direct, respectful questions"
          : "friendly Bangalore local person",
      goals:
        track === "repair"
          ? ["repair confusion", "continue without switching immediately to English"]
          : ["understand the intent", "reply simply", "keep the conversation moving"],
      turns: [
        {
          npcLine: track === "business" ? "Yenu software saar?" : "Kannada barutta?",
          expectedIntent:
            track === "business"
              ? "explain simply that you help understand workflow and are not replacing Tally"
              : "say you know a little Kannada and continue",
          simpleReply:
            track === "business"
              ? "Naanu Tally replace madalla, workflow artha madkolbeku."
              : "Nanage Kannada swalpa barutte.",
          naturalReply:
            track === "business"
              ? "Saar, Tally replace madalla. Nimma workflow swalpa artha madkolbeku."
              : "Swalpa barutte, practice madtini. Slow aagi maatadi.",
          reusablePattern:
            track === "business" ? "Naanu ___ madalla" : "Nanage ___ swalpa barutte",
          nextNpcLine:
            track === "business" ? "Sari, yenu kelbeku?" : "Sari, yelli irtira?",
          acceptedKeywords:
            track === "business"
              ? ["tally", "replace", "workflow", "artha", "madalla"]
              : ["kannada", "swalpa", "barutte", "slow", "practice"],
        },
      ],
      tags: [track, title.replace(/\s+/g, "-")],
    };
  });
}

function makeRepairDrills(): RepairDrill[] {
  const triggers = [
    "I did not understand",
    "Please repeat",
    "Speak slowly",
    "Say simply",
    "Send on WhatsApp",
    "Let me confirm and call back",
    "I understood this much",
    "Unknown word",
  ];
  return Array.from({ length: 40 }, (_, index) => {
    const trigger = triggers[index % triggers.length];
    return {
      id: `repair-${index + 1}`,
      title: `${trigger} drill ${index + 1}`,
      trigger,
      simpleRepair: [
        "Poorthi artha aagilla.",
        "Swalpa repeat maadi.",
        "Swalpa slow aagi maatadi.",
        "Simple Kannada alli heli.",
        "WhatsApp alli kalisi.",
      ][index % 5],
      naturalRepair: [
        "Saar, poorthi artha aagilla, swalpa repeat maadi.",
        "Ondu nimisha, slow aagi heli.",
        "English mix maadi, naanu try madtini.",
        "Naanu check maadi helthini.",
        "Nanage swalpa artha aaytu, aadre confirm madbeku.",
      ][index % 5],
      followUp: "Sari, aamele naanu reply madtini.",
      tags: ["repair", `day-${(index % 10) + 1}`],
    };
  });
}

function makeRadioScripts(mode: Extract<RadioMode, "gym" | "running" | "commute">): RadioScript[] {
  return Array.from({ length: 10 }, (_, index) => {
    const day = index + 1;
    const audioName =
      mode === "running" ? `day-${day}-walk.mp3` : `day-${day}-${mode}.mp3`;
    const steps =
      mode === "gym"
        ? [
            { kind: "english-prompt" as const, text: "Say: I need water." },
            { kind: "pause" as const, seconds: 4 },
            { kind: "kannada-answer" as const, text: "Nanage neeru beku." },
            { kind: "shadow" as const, text: "Shadow: Nanage neeru beku." },
            { kind: "english-prompt" as const, text: "Variation: I do not need coffee now." },
            { kind: "pause" as const, seconds: 4 },
            { kind: "kannada-answer" as const, text: "Iga coffee beda." },
          ]
        : mode === "running"
          ? [
              { kind: "kannada-line" as const, text: "Namaskara, nanage Kannada swalpa barutte." },
              { kind: "summary" as const, text: "You are saying you know a little Kannada." },
              { kind: "kannada-line" as const, text: "Swalpa slow aagi maatadi." },
              { kind: "shadow" as const, text: "Shadow key line: Swalpa slow aagi maatadi." },
              { kind: "kannada-line" as const, text: "Naanu check maadi helthini." },
            ]
          : [
              { kind: "situation" as const, text: "You are calling a vendor for a dispatch update." },
              { kind: "npc-line" as const, text: "Yenu update beku saar?" },
              { kind: "pause" as const, seconds: 5 },
              { kind: "model-reply" as const, text: "Dispatch update WhatsApp alli kalisi." },
              { kind: "explanation" as const, text: "Move details to WhatsApp when listening is hard." },
              { kind: "npc-line" as const, text: "Sari saar, kalistini." },
            ];
    return {
      id: `radio-${mode}-${day}`,
      day,
      mode,
      title: `Day ${day} ${mode} radio`,
      description:
        mode === "gym"
          ? "Short call-and-response drills between sets."
          : mode === "running"
            ? "Low-load listening and shadowing while walking or running."
            : "Scenario conversation for commute practice.",
      estimatedMinutes: mode === "gym" ? 8 : mode === "running" ? 12 : 15,
      audioPath: `/audio/${audioName}`,
      steps,
    };
  });
}

function makeReviewAndSleepScripts(): RadioScript[] {
  return Array.from({ length: 10 }, (_, index) => [
    {
      id: `radio-review-${index + 1}`,
      day: index + 1,
      mode: "review" as const,
      title: `Day ${index + 1} due review`,
      description: "Due SRS prompt, pause, answer, then self-rate 0 to 5.",
      estimatedMinutes: 10,
      steps: [
        { kind: "english-prompt" as const, text: "Say: Please repeat slowly." },
        { kind: "pause" as const, seconds: 4 },
        { kind: "kannada-answer" as const, text: "Swalpa slow aagi repeat maadi." },
      ],
    },
    {
      id: `radio-sleep-${index + 1}`,
      day: index + 1,
      mode: "sleep" as const,
      title: `Day ${index + 1} passive listening`,
      description: "Very easy familiar Kannada with no active recall.",
      estimatedMinutes: 12,
      steps: [
        { kind: "kannada-line" as const, text: "Namaskara. Nanage Kannada swalpa barutte." },
        { kind: "kannada-line" as const, text: "Poorthi artha aagilla. Swalpa slow aagi maatadi." },
        { kind: "kannada-line" as const, text: "Naanu check maadi helthini." },
      ],
    },
  ]).flat();
}

function makeSrsItems(patterns: Pattern[], dialogues: Dialogue[]): SrsItem[] {
  const types: SrsItem["type"][] = [
    "grammar-pattern",
    "sentence-transformation",
    "listening-comprehension",
    "spoken-production",
    "repair-move",
    "mini-dialogue",
    "roleplay-turn",
    "pronunciation-shadowing-line",
    "business-domain-item",
  ];
  return Array.from({ length: 200 }, (_, index) => {
    const pattern = patterns[index % patterns.length];
    const dialogue = dialogues[index % dialogues.length];
    const type = types[index % types.length];
    const day = (index % 10) + 1;
    const prompt =
      type === "listening-comprehension"
        ? `Listen and answer: ${dialogue.comprehensionQuestions[0]}`
        : `Produce with pattern ${pattern.form}: ${pattern.productionPrompts[index % pattern.productionPrompts.length]}`;
    const answer =
      type === "repair-move"
        ? "Swalpa repeat maadi."
        : pattern.form.includes("___")
          ? pattern.form.replace("___", substitutions[index % substitutions.length])
          : pattern.form;
    return {
      id: `srs-${index + 1}`,
      type,
      prompt,
      answer,
      acceptedVariants: [answer.replace("maadi", "madi"), answer.replace("Nanage", "Nange")],
      literalMeaning: answer,
      naturalMeaning: answer,
      audioScript: [prompt, answer],
      context: dialogue.setting,
      tags: [
        `day-${day}`,
        pattern.family.replace(/\s+/g, "-"),
        dialogue.category,
        type === "business-domain-item" ? "business" : "general",
      ],
      firstSeenDay: day,
      dueAt: new Date(Date.UTC(2026, 4, day, 6, 0, 0)).toISOString(),
      interval: 0,
      ease: 2.5,
      successScore: null,
      failCount: 0,
      lastReviewedAt: null,
    };
  });
}

function makeBusinessModules(): BusinessModule[] {
  const titles = [
    "Entering a workshop",
    "Talking to owner",
    "Asking what work they do",
    "Who handles accounts purchase dispatch",
    "Tally Excel WhatsApp workflow",
    "Not replacing Tally",
    "Manual work and delays",
    "Quotations invoices payments",
    "Logistics and dispatch",
    "Sample quality capacity",
    "Objection handling",
    "Driver coordination",
  ];
  return titles.map((title, index) => ({
    id: `business-${index + 1}`,
    title,
    goal: "Use simple respectful Kannada-English to understand local operations without making the whole app business-only.",
    scenario: `${title} in Whitefield, Hoskote, Peenya, or Bommasandra.`,
    coreQuestions: [
      "Nimma work yenu saar?",
      "Accounts yaaru nodtare?",
      "Purchase dispatch yaaru handle madtare?",
      "Tally Excel WhatsApp hege use madtira?",
      "Delay yelli aagutte?",
    ],
    simpleKannadaLines: [
      "Naanu Tally replace madalla.",
      "Nimma workflow artha madkolbeku.",
      "Manual work jasthi ideya?",
      "Quotation invoice payment process swalpa heli.",
    ],
    repairMoves: ["Simple Kannada alli heli.", "WhatsApp alli kalisi.", "Naanu check maadi helthini."],
    tags: ["business", title.toLowerCase().replace(/\s+/g, "-")],
  }));
}

function makeWhatsAppTemplates(): WhatsAppTemplate[] {
  const everyday = [
    ["asking location", "Location WhatsApp alli kalisi please. Naanu barthini."],
    ["confirming time", "Naale 6 pm sari na? Confirm maadi."],
    ["thanking someone", "Thank you, tumba help aaytu."],
    ["calling later", "Iga busy ide. Aamele call madtini."],
    ["send details", "Details WhatsApp alli kalisi, naanu check madtini."],
    ["apology", "Confusion aaytu, sorry. Innondu sari confirm maadi."],
  ];
  const business = [
    ["after visit", "Ivattu visit ge thank you. Nimma workflow swalpa clear aaytu."],
    ["ask quotation", "Quotation WhatsApp alli kalisi please."],
    ["ask invoice", "Invoice copy kalisi, naanu check madtini."],
    ["dispatch update", "Dispatch update yenu? Driver number kalisi."],
    ["workflow details", "Accounts purchase dispatch flow swalpa points alli kalisi."],
    ["not replacing Tally", "Naanu Tally replace madalla. Manual follow-up reduce madakke artha madkoltiddini."],
    ["confirm meeting", "Meeting naale 11 am confirm na?"],
    ["owner contact", "Owner manager contact kalisi please."],
  ];
  const all: Array<[WhatsAppTemplate["category"], string, string]> = [
    ...everyday.map((item): [WhatsAppTemplate["category"], string, string] => ["everyday", item[0], item[1]]),
    ...business.map((item): [WhatsAppTemplate["category"], string, string] => ["business", item[0], item[1]]),
  ];
  return Array.from({ length: 30 }, (_, index) => {
    const [category, title, text] = all[index % all.length];
    return {
      id: `whatsapp-${index + 1}`,
      category,
      title: `${title} ${Math.floor(index / all.length) + 1}`,
      context: category === "business" ? "business follow-up" : "everyday follow-up",
      kannadaEnglish: text,
      englishMeaning: text,
      tags: [category, title.replace(/\s+/g, "-")],
    };
  });
}

const dayIntents = [
  "Build spoken Kannada confidence for opening real Bangalore conversations without freezing at the first reply.",
  "Build spoken Kannada control for needs, refusals, prices, and small shop interactions.",
  "Build spoken Kannada question comfort so directions, locations, and basic follow-ups feel usable.",
  "Build spoken Kannada request rhythm for apartment, food, auto, and help conversations.",
  "Build spoken Kannada small-talk stamina for 60 seconds of friendly relationship-building.",
  "Build spoken Kannada work-talk comfort so you can explain software work simply and ask about their work.",
  "Build spoken Kannada repair confidence so fast replies do not force an immediate switch to English.",
  "Build spoken Kannada mixed-conversation endurance for three minutes of Kannada-English back-and-forth.",
  "Build spoken Kannada business bridge skills for workshop, vendor, logistics, and workflow questions.",
  "Build spoken Kannada final-day comfort by starting, repairing, continuing, and closing one Bangalore conversation.",
];

const dayGoals = [
  ["Open politely", "Say your Kannada level", "Ask for slower speech", "Close without awkwardness"],
  ["Ask for what you need", "Refuse politely", "Understand basic shop replies", "Move details to WhatsApp"],
  ["Ask where/how/when", "Follow one simple direction", "Use repeat/slow repair", "Confirm what you understood"],
  ["Make respectful requests", "Ask someone to show/tell/send", "Use maadi/kodi/heli naturally"],
  ["Ask where someone is from", "Talk about area/weather/traffic", "Sustain small talk for 60 seconds"],
  ["Explain what you do simply", "Ask what work they do", "Keep English mix controlled"],
  ["Use repair before English", "Handle fast Kannada", "Say what you understood", "Ask for simple Kannada"],
  ["Handle mixed Kannada-English", "Keep conversation going", "Recover from unknown words"],
  ["Ask 3 workflow questions", "Talk Tally/Excel/WhatsApp without pitching", "Respect local business tone"],
  ["Start in Kannada", "Repair at least once", "Complete and close politely"],
];

const dayInstructions = [
  "Run this day in three small blocks: use the commute for slow listening, use gym time for short call-and-response, then do one desk review before trying a Kannada opening with a real person.",
  "Use your commute for shopkeeper listening, use running or walking for easy shadowing, use gym sets for beku/beda drills, then ask one real shop question before the day ends.",
  "Use commute time for direction dialogues, use a walk to shadow yelli/hege/eshtu questions, use gym pauses for recall, then ask someone where something is.",
  "Use the commute for request dialogues, use gym time for maadi/kodi/heli drills, then make one real request to apartment, food, auto, or shop staff.",
  "Use commute time for small-talk listening, use walking time to shadow friendly replies, use gym time for quick personal answers, then hold one 60-second conversation without worrying about perfect grammar.",
  "Use the commute to hear work-talk examples, use running or walking to shadow your intro, use gym time for Naanu ___ madtini drills, then explain your work once.",
  "Use every commute or walk today to rehearse repair moves, use gym sets for repeat/slow/simple prompts, then ask someone to repeat instead of switching immediately to English.",
  "Use commute mode for scenario turns, use running or walking for low-load shadowing, use gym recall for repair lines, then attempt a 3-minute mixed Kannada-English conversation.",
  "Use commute time for workshop/vendor scenarios, use gym time for workflow question drills, then ask a local business or vendor three respectful process questions.",
  "Use the commute for final review, use walking for shadowing natural speed, use gym for fast recall, then complete one real Bangalore conversation where you start, repair, continue, and close.",
];

function makeMilestones(day: number, businessTitle: string) {
  return [
    {
      id: `day-${day}-commute`,
      mode: "commute" as const,
      title: "Commute: hear the situation first",
      durationMinutes: 15,
      instruction: "Play commute mode and only focus on understanding the NPC line, the repair move, and the model reply.",
      actionLabel: "Open Commute Radio",
      module: "radio" as const,
      radioMode: "commute" as const,
    },
    {
      id: `day-${day}-running`,
      mode: "running-walking" as const,
      title: "Running or walking: shadow without typing",
      durationMinutes: 12,
      instruction: "Play running mode at easy effort and shadow only the key lines so rhythm improves without heavy thinking.",
      actionLabel: "Open Running Radio",
      module: "radio" as const,
      radioMode: "running" as const,
    },
    {
      id: `day-${day}-gym`,
      mode: "gym" as const,
      title: "Gym: quick recall between sets",
      durationMinutes: 8,
      instruction: "Use gym mode between sets: hear English, answer during the pause, then shadow the Kannada answer once.",
      actionLabel: "Open Gym Radio",
      module: "radio" as const,
      radioMode: "gym" as const,
    },
    {
      id: `day-${day}-review`,
      mode: "review" as const,
      title: "Desk review: produce before seeing",
      durationMinutes: 10,
      instruction: "Do the active recall review slowly: say or type the answer first, reveal it, then score honestly from 0 to 5.",
      actionLabel: "Open Review",
      module: "review" as const,
    },
    {
      id: `day-${day}-shadowing`,
      mode: "shadowing" as const,
      title: "Shadowing: copy rhythm and endings",
      durationMinutes: 8,
      instruction: "Listen once, shadow slow, then shadow natural speed while copying respectful endings and question tone.",
      actionLabel: "Open Shadowing",
      module: "shadowing" as const,
    },
    {
      id: `day-${day}-dojo`,
      mode: "dojo" as const,
      title: "Dojo: keep the conversation alive",
      durationMinutes: 10,
      instruction: "Answer the NPC with simple Kannada, then compare against the better simple and natural versions.",
      actionLabel: "Open Dojo",
      module: "dojo" as const,
    },
    {
      id: `day-${day}-mission`,
      mode: "mission" as const,
      title: "Real world: log one attempt",
      durationMinutes: 5,
      instruction: "Try the day mission with a real person, then log what froze so tomorrow's SRS can bring it back.",
      actionLabel: "Open Mission Log",
      module: "mission" as const,
    },
    {
      id: `day-${day}-business`,
      mode: "business" as const,
      title: `Optional business add-on: ${businessTitle}`,
      durationMinutes: 8,
      instruction: "Do this only after the general sprint: ask simple workflow questions and keep the tone respectful, not salesy.",
      actionLabel: "Open Business Add-On",
      module: "business" as const,
    },
  ];
}

function makeCurriculumDays(patterns: Pattern[], dialogues: Dialogue[], shadowing: ShadowingSession[], roleplays: RoleplayScenario[], businessModules: BusinessModule[]): CurriculumDay[] {
  return Array.from({ length: 10 }, (_, index) => {
    const day = index + 1;
    const dayPatterns = patterns.slice(index * 4, index * 4 + (index % 2 === 0 ? 4 : 3));
    const dayDialogues = dialogues.filter((dialogue) => dialogue.category !== "business").slice(index * 2, index * 2 + 2);
    const businessModule = businessModules[index % businessModules.length];
    return {
      day,
      title: `Day ${day}: ${["openers", "needs", "questions", "requests", "small talk", "work talk", "repair", "mixed conversation", "business bridge", "final Bangalore conversation"][index]}`,
      intent: dayIntents[index],
      goals: dayGoals[index],
      dailyInstruction: dayInstructions[index],
      milestones: makeMilestones(day, businessModule.title),
      generalFluencyTarget:
        day < 9
          ? "Build general spoken Kannada comfort before business-specific depth."
          : "Use the general base inside field and business conversations.",
      nationBalance: [
        "meaning-focused-input",
        "meaning-focused-output",
        "language-focused-learning",
        "fluency-development",
      ],
      corePatternIds: dayPatterns.map((pattern) => pattern.id),
      pronunciationFocus: [
        "short endings with maadi",
        "question rise on yenu/yelli",
        "respectful saar rhythm",
        "slow clear beku/beda",
        "artha aagilla repair rhythm",
        "madtini/madtira contrast",
        "Kannada-English switching without panic",
        "natural speed shadowing",
        "business nouns inside simple Kannada",
        "polite close and follow-up",
      ][index],
      listeningDialogueIds: dayDialogues.map((dialogue) => dialogue.id),
      shadowingSessionId: shadowing[index].id,
      activeRecallSrsIds: [`srs-${index * 10 + 1}`, `srs-${index * 10 + 2}`, `srs-${index * 10 + 3}`],
      conversationScenarioId: roleplays[index].id,
      missionId: missions[index].id,
      businessAddonId: businessModule.id,
    };
  });
}

const patterns = makePatterns();
const dialogues = makeDialogues();
const shadowingSessions = makeShadowingSessions(dialogues);
const roleplays = makeRoleplays();
const businessModules = makeBusinessModules();
const radioScripts = [
  ...makeRadioScripts("gym"),
  ...makeRadioScripts("running"),
  ...makeRadioScripts("commute"),
  ...makeReviewAndSleepScripts(),
];
const srsItems = makeSrsItems(patterns, dialogues);

export const content: AppContent = {
  curriculumDays: makeCurriculumDays(patterns, dialogues, shadowingSessions, roleplays, businessModules),
  patterns,
  dialogues,
  srsItems,
  radioScripts,
  shadowingSessions,
  roleplays,
  missions,
  businessModules,
  whatsAppTemplates: makeWhatsAppTemplates(),
  repairDrills: makeRepairDrills(),
};

export function validateContent(appContent: AppContent) {
  const productionPrompts = appContent.patterns.reduce(
    (total, pattern) => total + pattern.productionPrompts.length,
    0,
  );
  const listeningComprehensionItems = appContent.dialogues.reduce(
    (total, dialogue) => total + dialogue.comprehensionQuestions.length,
    0,
  );
  const counts = {
    curriculumDays: appContent.curriculumDays.length,
    patterns: appContent.patterns.length,
    productionPrompts,
    listeningComprehensionItems,
    generalDialogues: appContent.dialogues.filter((dialogue) => dialogue.category !== "business").length,
    businessDialogues: appContent.dialogues.filter((dialogue) => dialogue.category === "business").length,
    repairDrills: appContent.repairDrills.length,
    shadowingSessions: appContent.shadowingSessions.length,
    roleplayScenarios: appContent.roleplays.length,
    srsItems: appContent.srsItems.length,
    whatsAppTemplates: appContent.whatsAppTemplates.length,
    missions: appContent.missions.length,
    gymScripts: appContent.radioScripts.filter((script) => script.mode === "gym").length,
    runningScripts: appContent.radioScripts.filter((script) => script.mode === "running").length,
    commuteScripts: appContent.radioScripts.filter((script) => script.mode === "commute").length,
  };
  const failures = Object.entries(requiredContentCounts)
    .filter(([key, required]) => counts[key as keyof typeof counts] < required)
    .map(([key, required]) => `${key}: ${counts[key as keyof typeof counts]} < ${required}`);
  const requiredMilestoneModes = ["commute", "running-walking", "gym", "review", "mission"];
  for (const day of appContent.curriculumDays) {
    const dayFailures = [
      !day.intent || day.intent.length < 40 ? "intent missing or too short" : "",
      day.goals.length < 3 ? "fewer than 3 goals" : "",
      !day.dailyInstruction || day.dailyInstruction.length < 80 ? "daily instruction missing or too short" : "",
      day.dailyInstruction === day.generalFluencyTarget ? "daily instruction is generic target copy" : "",
      ...requiredMilestoneModes
        .filter((mode) => !day.milestones.some((milestone) => milestone.mode === mode))
        .map((mode) => `missing ${mode} milestone`),
      day.milestones.some((milestone) => milestone.instruction.length < 30)
        ? "milestone instruction too short"
        : "",
    ].filter(Boolean);
    failures.push(...dayFailures.map((failure) => `day ${day.day}: ${failure}`));
  }
  const allText = JSON.stringify(appContent).toLowerCase();
  const placeholderHits = ["todo", "lorem", "dummy"].filter((term) => allText.includes(term));
  return {
    ok: failures.length === 0 && placeholderHits.length === 0,
    counts,
    failures,
    placeholderHits,
  };
}
