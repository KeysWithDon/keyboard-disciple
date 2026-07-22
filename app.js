const letterOrder = "ENIARLTOSUDYCGHPMKBWFZVXQJ".split("");
const specialProgressKeys = [
  { key: " ", label: "Space", glyph: "·" },
  ..."0123456789".split("").map(key => ({ key, label: key, glyph: key })),
  ...[".", ",", "!", "?", ";", ":", "'", "\"", "-", "_", "/", "\\", "(", ")", "[", "]", "{", "}", "@", "#", "$", "%", "&", "*", "+", "="]
    .map(key => ({ key, label: key, glyph: key }))
];
const startLetters = 6;
const rowsPerPage = 10;
const masteryRequiredPages = 27;
const masteryRequiredAttempts = 540;
const STORAGE_KEY = "keyboard-disciple-web";
const keyboardSoundStyles = new Set([...Array.from({ length: 26 }, (_, index) => String(index + 1)), "off"]);
const rewardSoundStyles = new Set(["preacher", "key-bloom", "glass-keys"]);
const reminderSoundStyles = new Set(["bike", "dinner", "trumpet"]);
const errorSoundStyles = new Set(["1", "2", "3", "4", "off"]);
const practicePresetStyles = new Set(["balanced", "weak", "accuracy", "speed", "finger", "alternation", "workout"]);
const practicePresetDescriptions = {
  balanced: "Mixes common words, weak-letter focus, and gradually introduced moderate vocabulary for steady progress.",
  weak: "Repeats natural words containing your least confident earned letters so weak keys get more useful practice.",
  accuracy: "Prioritizes letters with the most errors and keeps vocabulary simpler until clean typing returns.",
  speed: "Introduces more moderate-length natural words to build speed while keeping your current letters in rotation.",
  finger: "Chooses natural words that exercise the finger zone connected to your weakest letters.",
  alternation: "Favors natural words that move between the left and right hands to build a smoother rhythm.",
  workout: "Rotates every five lines through left hand, right hand, inside fingers, and outside fingers with visibly different word pools."
};
const practicePresetLabels = {
  balanced: "Balanced",
  weak: "Weak keys",
  accuracy: "Accuracy repair",
  speed: "Speed builder",
  finger: "Finger focus",
  alternation: "Hand alternation",
  workout: "Zone workout"
};
const lessonReminders = [
  { kind: "posture", title: "Posture check", text: "Keep your wrists straight with your forearms. Avoid bending them up, down, or sideways." },
  { kind: "posture", title: "Soften your shoulders", text: "Let your upper arms hang close to your body and keep your elbows comfortably near your sides." },
  { kind: "posture", title: "Balance your head", text: "Bring your head gently back over your torso. Keep your screen straight in front of you." },
  { kind: "posture", title: "Settle your back", text: "Let the chair support your back. Stay upright or slightly reclined instead of leaning forward." },
  { kind: "posture", title: "Support your feet", text: "Keep both feet supported on the floor or a stable footrest so your legs can relax." },
  { kind: "posture", title: "Bring the keys close", text: "Keep the keyboard close enough that your elbows stay near your body. Avoid reaching forward." },
  { kind: "posture", title: "Check your screen", text: "Keep the monitor centered and about an arm's length away, with the top near eye level." },
  { kind: "breath", title: "Breathe and relax", text: "Take one slow deep breath. Unclench your jaw, soften your grip, and return at an easy pace." },
  { kind: "breath", title: "Reset your rhythm", text: "Inhale gently, exhale a little longer, and let accuracy lead the next phrase." },
  { kind: "breath", title: "Release the grip", text: "Breathe out, loosen your jaw, and use the lightest touch that still keeps the rhythm clean." },
  { kind: "breath", title: "Open your hands", text: "Take a calm breath and let your fingers open briefly before returning softly to home row." },
  { kind: "breath", title: "Plan a small pause", text: "After this row, blink, look into the distance, and roll your shoulders before continuing." },
  { kind: "posture", title: "Change position", text: "No posture needs to stay frozen. Make a small adjustment and keep your body comfortable." }
];
const dictationSentenceBank = [
  "The quiet room made every keystroke easy to hear.",
  "Accuracy grows when the hands stay relaxed and steady.",
  "A short pause can restore a smooth typing rhythm.",
  "The morning light rested softly across the desk.",
  "Clear attention makes difficult words feel more familiar.",
  "Let the next sentence arrive before you hurry to meet it.",
  "Good posture gives the shoulders room to release tension.",
  "The careful typist listens for meaning as well as sound.",
  "Every clean line is a small record of patient practice.",
  "A calm breath can change the pace of an entire lesson.",
  "The old bridge carried travelers over the narrow stream.",
  "Warm bread cooled beside the open kitchen window.",
  "The gardener moved slowly among the rows of herbs.",
  "A thoughtful question often opens a better conversation.",
  "The young tree bent gently in the evening wind.",
  "Write what you hear, then let the finished thought settle.",
  "The library kept its quiet promise through the afternoon.",
  "Small improvements become visible when practice is consistent.",
  "The path curved past the field and toward the hill.",
  "Kind words can make a difficult day feel lighter.",
  "The musician checked the rhythm before beginning the song.",
  "A bright window framed the rain beyond the room.",
  "Strong habits are built from ordinary choices repeated well.",
  "The traveler packed lightly and left before sunrise.",
  "When the mind wanders, return gently to the next word.",
  "The baker measured each ingredient with quiet care.",
  "A useful skill grows through attention, repetition, and rest.",
  "The river moved steadily beneath the wooden footbridge.",
  "The teacher gave the class one clear task to begin.",
  "A well-placed pause helps the listener follow the idea.",
  "The candle cast a small circle of light on the table.",
  "Practice becomes easier when the goal is clear and nearby.",
  "The child watched the clouds gather above the distant hills.",
  "A patient hand can learn a new pattern without force.",
  "The letter arrived with news from a friend far away.",
  "The room grew still as the final sentence was read.",
  "Your hands know more than they did at the start of today.",
  "The blue coat hung neatly beside the open doorway.",
  "A steady pace leaves enough attention for every character.",
  "The farmer repaired the gate before the weather changed.",
  "A simple plan can carry a long lesson to completion.",
  "The choir gathered early to practice the first harmony.",
  "The honest answer was quieter but stronger than the excuse.",
  "A narrow trail led through the trees to the water.",
  "The student listened twice and typed once with confidence.",
  "Rest is part of learning, not a failure to continue.",
  "The final page felt lighter because the rhythm had settled.",
  "A generous spirit makes room for another person's needs.",
  "The bell marked the hour, and the room returned to work.",
  "Keep your eyes soft and let the fingers follow the sound."
];
const creativeModeStyles = new Set([
  "weakspot", "58008", "mirror", "upside_down", "nausea", "round_round_baby", "simon_says", "tts",
  "choo_choo", "arrows", "rAnDoMcAsE", "sPoNgEcAsE", "capitals", "layout_mirror", "layoutfluid",
  "earthquake", "space_balls", "gibberish", "ascii", "specials", "plus_zero", "plus_one", "plus_two",
  "plus_three", "read_ahead_easy", "read_ahead", "read_ahead_hard", "memory", "nospace", "poetry",
  "wikipedia", "pseudolang", "IPv4", "IPv6", "binary", "hexadecimal", "zipf", "morse", "crt",
  "backwards", "ddoouubblleedd", "instant_messaging", "underscore_spaces", "ALL_CAPS", "polyglot", "asl",
  "rot13", "no_quit"
]);
const themeStyles = new Set([
  "disciple", "morning-light", "sanctuary", "living-water", "midnight-prayer", "mustard-seed", "eden",
  "royal-priesthood", "grace", "armor-of-light", "revelation", "clarity"
]);
const lessonColorStyles = new Set(["theme", "cyan", "green", "purple", "white"]);
const lessonColorValues = {
  theme: "var(--gold)",
  cyan: "var(--cyan)",
  green: "var(--green)",
  purple: "var(--purple)",
  white: "var(--text)"
};
const testModes = new Set(["time", "words", "quote", "creative", "placement", "dictation"]);
const scoredModes = new Set(["adaptive", "time", "words", "quote", "creative", "placement", "dictation", "bible", "bibleQuotes"]);
const keyboardKey = (id, label = id, units = 4, shift = "") => ({ id, label, units, shift });
const macKeyboardLayout = [
  [
    keyboardKey("`", "`", 4, "~"), keyboardKey("1", "1", 4, "!"), keyboardKey("2", "2", 4, "@"),
    keyboardKey("3", "3", 4, "#"), keyboardKey("4", "4", 4, "$"), keyboardKey("5", "5", 4, "%"),
    keyboardKey("6", "6", 4, "^"), keyboardKey("7", "7", 4, "&"), keyboardKey("8", "8", 4, "*"),
    keyboardKey("9", "9", 4, "("), keyboardKey("0", "0", 4, ")"), keyboardKey("-", "-", 4, "_"),
    keyboardKey("=", "=", 4, "+"), keyboardKey("backspace", "delete", 8)
  ],
  [
    keyboardKey("tab", "tab", 6), keyboardKey("q", "Q"), keyboardKey("w", "W"), keyboardKey("e", "E"),
    keyboardKey("r", "R"), keyboardKey("t", "T"), keyboardKey("y", "Y"), keyboardKey("u", "U"),
    keyboardKey("i", "I"), keyboardKey("o", "O"), keyboardKey("p", "P"), keyboardKey("[", "[", 4, "{"),
    keyboardKey("]", "]", 4, "}"), keyboardKey("\\", "\\", 6, "|")
  ],
  [
    keyboardKey("capslock", "caps lock", 7), keyboardKey("a", "A"), keyboardKey("s", "S"), keyboardKey("d", "D"),
    keyboardKey("f", "F"), keyboardKey("g", "G"), keyboardKey("h", "H"), keyboardKey("j", "J"),
    keyboardKey("k", "K"), keyboardKey("l", "L"), keyboardKey(";", ";", 4, ":"), keyboardKey("'", "'", 4, "\""),
    keyboardKey("enter", "return", 9)
  ],
  [
    keyboardKey("shiftleft", "shift", 9), keyboardKey("z", "Z"), keyboardKey("x", "X"), keyboardKey("c", "C"),
    keyboardKey("v", "V"), keyboardKey("b", "B"), keyboardKey("n", "N"), keyboardKey("m", "M"),
    keyboardKey(",", ",", 4, "<"), keyboardKey(".", ".", 4, ">"), keyboardKey("/", "/", 4, "?"),
    keyboardKey("shiftright", "shift", 11)
  ],
  [
    keyboardKey("fn", "fn", 4), keyboardKey("controlleft", "control", 5), keyboardKey("altleft", "option", 5),
    keyboardKey("metaleft", "command", 6), keyboardKey("space", "", 20), keyboardKey("metaright", "command", 6),
    keyboardKey("altright", "option", 5), keyboardKey("arrowleft", "◀", 3),
    { type: "arrow-stack", units: 3 }, keyboardKey("arrowright", "▶", 3)
  ]
];
const relabelKeyboardRows = (rows, labels) => rows.map(row => row.map(key =>
  key.type || !labels[key.id] ? key : { ...key, label: labels[key.id] }
));
const windowsKeyboardLayout = [
  ...relabelKeyboardRows(macKeyboardLayout.slice(0, 4), { backspace: "backspace", enter: "enter" }),
  [
    keyboardKey("controlleft", "ctrl", 4), keyboardKey("metaleft", "win", 4), keyboardKey("altleft", "alt", 5),
    keyboardKey("space", "", 21), keyboardKey("altright", "alt", 5), keyboardKey("metaright", "win", 4),
    keyboardKey("menu", "menu", 4), keyboardKey("controlright", "ctrl", 4), keyboardKey("arrowleft", "◀", 3),
    { type: "arrow-stack", units: 3 }, keyboardKey("arrowright", "▶", 3)
  ]
];
const compactKeyboardLayout = [
  ...relabelKeyboardRows(macKeyboardLayout.slice(0, 4), { backspace: "backspace", enter: "enter" }),
  [
    keyboardKey("controlleft", "ctrl", 5), keyboardKey("metaleft", "win", 5), keyboardKey("altleft", "alt", 5),
    keyboardKey("space", "", 30), keyboardKey("altright", "alt", 5), keyboardKey("fnright", "fn", 5),
    keyboardKey("controlright", "ctrl", 5)
  ]
];
const typewriterKeyboardLayout = [
  ...relabelKeyboardRows(macKeyboardLayout.slice(0, 4), { backspace: "backspace", capslock: "shift lock" }),
  [{ type: "spacer", units: 12 }, keyboardKey("space", "", 36), { type: "spacer", units: 12 }]
];
const keyboardLayouts = {
  mac: macKeyboardLayout,
  windows: windowsKeyboardLayout,
  compact: compactKeyboardLayout,
  typewriter: typewriterKeyboardLayout
};
const keyboardCodeIds = {
  Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
  Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/", Backspace: "backspace",
  Tab: "tab", CapsLock: "capslock", Enter: "enter", ShiftLeft: "shiftleft", ShiftRight: "shiftright",
  ControlLeft: "controlleft", ControlRight: "controlright", AltLeft: "altleft", AltRight: "altright", MetaLeft: "metaleft",
  MetaRight: "metaright", Space: "space", ArrowLeft: "arrowleft", ArrowUp: "arrowup",
  ArrowDown: "arrowdown", ArrowRight: "arrowright", ContextMenu: "menu", Fn: "fn"
};

const state = {
  mode: "adaptive",
  rowIndex: 0,
  pageIndex: 0,
  input: "",
  targetRows: [],
  scripturePages: [],
  startedAt: null,
  rowsCleared: 0,
  charsTyped: 0,
  rawTyped: 0,
  errors: 0,
  lineErrors: 0,
  characterErrors: 0,
  lessonLetterStats: {},
  lessonErrorLetters: {},
  lineLetterStats: {},
  lineStartedAt: null,
  lineCharsTyped: 0,
  lineRawTyped: 0,
  lineKeyIntervals: [],
  lineLastKeyAt: null,
  lineLastAcceptedAt: null,
  adaptiveLessonLines: [],
  adaptiveLessonPages: [],
  lastAcceptedAt: null,
  lastActivityAt: null,
  lastKeyAt: null,
  keyIntervals: [],
  timerId: null,
  deadline: null,
  timeRemaining: 0,
  warningPlayed: false,
  testCompleted: false,
  result: null,
  capsLock: false,
  lastWpm: 0,
  lastAccuracy: 100,
  kjv: null,
  pressedKey: "",
  mistakeKey: "",
  shiftSide: "",
  memoryVisible: true,
  lastQuote: null,
  lastRestReminder: 0,
  techniqueMessageUntil: 0,
  postureReminderRow: -1,
  postureReminderNextRow: 3,
  postureReminderAtWord: 3,
  postureReminder: null,
  postureReminderLastIndex: -1,
  practiceFontSize: null,
  practiceFitSignature: "",
  practiceFitRaf: 0,
  dictationAudioBlob: null,
  dictationAudioStatus: "idle",
  dictationPromptHeard: false,
  dictationBrowserFallback: false,
  dictationPromptId: 0,
  dictationPromptStartedAt: null,
  dictationPromptEndedAt: null,
  dictationPromptDurationMs: 0,
  dictationTypedDuringPrompt: 0,
  dictationCorrectDuringPrompt: 0,
  dictationPromptRecorded: false,
  dictationFollowSamples: []
};

let storedData = {};
try { storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}

const defaultPrefs = {
  mode: "adaptive",
  practiceLetters: startLetters,
  focusLetters: [],
  wordsPerRow: 10,
  lessonLengthPages: 1,
  targetSpeed: 35,
  practicePreset: "balanced",
  practicePresets: ["balanced"],
  recoverKeys: true,
  naturalWords: true,
  dailyGoalMinutes: 15,
  testDuration: 30,
  testWordCount: 50,
  dictationPromptCount: 10,
  dictationCapitalization: "exact",
  dictationPunctuation: "exact",
  quoteLength: "medium",
  difficulty: "normal",
  creativeMode: "weakspot",
  quickRestart: "off",
  repeatQuotes: "off",
  resultSaving: "on",
  minWpm: 0,
  minAccuracy: 0,
  minBurst: 0,
  indicateTypos: "key",
  freedomMode: false,
  strictSpace: false,
  oppositeShiftMode: false,
  britishEnglish: false,
  lazyMode: false,
  currentCue: "highlight",
  caretStyle: "highlight",
  smoothCaret: "medium",
  typedEffect: "keep",
  highlightMode: "letter",
  fontSize: "medium",
  fontFamily: "Roboto_Mono",
  lineWidth: "comfortable",
  tapeMode: "off",
  smoothLineScroll: true,
  textGlow: true,
  flipTestColors: false,
  colorfulMode: false,
  timerStyle: "text",
  speedUnit: "wpm",
  showLiveWpm: true,
  showLiveAccuracy: true,
  showLiveRaw: false,
  showLiveConsistency: false,
  rhythmCoach: false,
  techniqueTips: true,
  showProgress: true,
  keyboardLayout: "mac",
  keyboardSize: "standard",
  keymapMode: "react",
  keymapStyle: "staggered",
  keymapLegend: "uppercase",
  soundStyle: "1",
  soundVolume: .5,
  rewardStyle: "preacher",
  reminderSound: "dinner",
  spokenRemindersEnabled: false,
  reminderTtsModel: "chatterbox-english",
  reminderVoiceId: "default-english",
  reminderLanguage: "en",
  reminderVolume: .85,
  errorStyle: "1",
  timeWarning: "off",
  theme: "disciple",
  lessonColor: "theme",
  typingSounds: true,
  errorSounds: true,
  showKeyboard: true,
  includePunctuation: true,
  includeNumbers: false,
  confidenceMode: "off",
  errorLimit: 3,
  blindMode: false,
  quickEnd: false,
  capsLockWarning: true,
  focusMode: false,
  capitalization: "source",
  bibleBook: "John",
  bibleChapter: 3,
  bibleStart: 16,
  bibleEnd: 17
};
const storedPrefs = storedData.prefs || {};
const prefs = Object.fromEntries(Object.keys(defaultPrefs).map(key => [
  key,
  storedPrefs[key] ?? defaultPrefs[key]
]));
prefs.practiceLetters = Math.max(startLetters, Math.min(letterOrder.length, Number(prefs.practiceLetters) || startLetters));
if (!Array.isArray(prefs.focusLetters)) prefs.focusLetters = [];
prefs.focusLetters = [...new Set(prefs.focusLetters.map(letter => String(letter).toUpperCase()))]
  .filter(letter => letterOrder.includes(letter) && letterOrder.indexOf(letter) < prefs.practiceLetters)
  .slice(0, 5);
prefs.testDuration = Math.max(5, Math.min(600, Number(prefs.testDuration) || defaultPrefs.testDuration));
prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(Number(prefs.testWordCount) || defaultPrefs.testWordCount)));
prefs.dictationPromptCount = Math.max(5, Math.min(30, Math.round(Number(prefs.dictationPromptCount) || defaultPrefs.dictationPromptCount)));
prefs.lessonLengthPages = Math.max(1, Math.min(100, Math.round(Number(prefs.lessonLengthPages) || defaultPrefs.lessonLengthPages)));
if (!new Set(["exact", "ignore"]).has(prefs.dictationCapitalization)) prefs.dictationCapitalization = defaultPrefs.dictationCapitalization;
if (!new Set(["exact", "ignore"]).has(prefs.dictationPunctuation)) prefs.dictationPunctuation = defaultPrefs.dictationPunctuation;
prefs.errorLimit = Math.max(1, Math.min(8, Number(prefs.errorLimit) || defaultPrefs.errorLimit));
prefs.soundVolume = Math.max(0, Math.min(1, Number(prefs.soundVolume) || defaultPrefs.soundVolume));
prefs.spokenRemindersEnabled = Boolean(prefs.spokenRemindersEnabled);
const storedReminderVolume = Number(prefs.reminderVolume ?? defaultPrefs.reminderVolume);
prefs.reminderVolume = Number.isFinite(storedReminderVolume)
  ? Math.max(0, Math.min(1, storedReminderVolume))
  : defaultPrefs.reminderVolume;
prefs.reminderTtsModel = String(prefs.reminderTtsModel || defaultPrefs.reminderTtsModel);
prefs.reminderVoiceId = String(prefs.reminderVoiceId || defaultPrefs.reminderVoiceId);
prefs.reminderLanguage = String(prefs.reminderLanguage || defaultPrefs.reminderLanguage).toLowerCase();
prefs.targetSpeed = Math.max(10, Math.min(300, Number(prefs.targetSpeed) || defaultPrefs.targetSpeed));
prefs.minWpm = Math.max(0, Math.min(200, Number(prefs.minWpm) || 0));
prefs.minAccuracy = Math.max(0, Math.min(100, Number(prefs.minAccuracy) || 0));
prefs.minBurst = Math.max(0, Math.min(200, Number(prefs.minBurst) || 0));
if (!keyboardSoundStyles.has(prefs.soundStyle)) prefs.soundStyle = defaultPrefs.soundStyle;
if (!keyboardLayouts[prefs.keyboardLayout]) prefs.keyboardLayout = defaultPrefs.keyboardLayout;
if (!rewardSoundStyles.has(prefs.rewardStyle)) prefs.rewardStyle = defaultPrefs.rewardStyle;
if (!reminderSoundStyles.has(prefs.reminderSound)) prefs.reminderSound = defaultPrefs.reminderSound;
if (!errorSoundStyles.has(prefs.errorStyle)) prefs.errorStyle = defaultPrefs.errorStyle;
if (!practicePresetStyles.has(prefs.practicePreset)) prefs.practicePreset = defaultPrefs.practicePreset;
if (!Array.isArray(prefs.practicePresets)) prefs.practicePresets = [prefs.practicePreset];
prefs.practicePresets = [...new Set(prefs.practicePresets.filter(preset => practicePresetStyles.has(preset)))].slice(0, 3);
if (!prefs.practicePresets.length) prefs.practicePresets = [prefs.practicePreset];
prefs.practicePreset = prefs.practicePresets[0];
if (!creativeModeStyles.has(prefs.creativeMode)) prefs.creativeMode = defaultPrefs.creativeMode;
if (!themeStyles.has(prefs.theme)) prefs.theme = defaultPrefs.theme;
if (!lessonColorStyles.has(prefs.lessonColor)) prefs.lessonColor = defaultPrefs.lessonColor;
if (!scoredModes.has(prefs.mode) && prefs.mode !== "zen") prefs.mode = defaultPrefs.mode;
if (storedPrefs.showKeyboard === false && storedPrefs.keymapMode === undefined) prefs.keymapMode = "off";
prefs.dailyGoalMinutes = Math.max(2, Math.min(60, Number(prefs.dailyGoalMinutes) || defaultPrefs.dailyGoalMinutes));
state.mode = prefs.mode;

function applyTheme() {
  document.documentElement.dataset.theme = prefs.theme;
}

function fontDisplayName(name) {
  if (name === "Comic_Sans_MS") return "Helvetica";
  return name.replaceAll("_", " ");
}

function applyFont() {
  const family = fontCatalog.includes(prefs.fontFamily) ? prefs.fontFamily : defaultPrefs.fontFamily;
  prefs.fontFamily = family;
  let link = document.getElementById("selectedFontStylesheet");
  if (googleFontFamilies.has(family)) {
    if (!link) {
      link = document.createElement("link");
      link.id = "selectedFontStylesheet";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const queryName = family.replaceAll("_", "+");
    link.onload = () => renderText();
    link.href = `https://fonts.googleapis.com/css2?family=${queryName}:wght@400;500;600;700&display=swap`;
  } else if (link) {
    link.remove();
  }
  const cssName = family === "Comic_Sans_MS" ? "Helvetica Neue" : family.replaceAll("_", " ");
  const generic = /Sans|Roboto$|Montserrat|Nunito|Oxygen|Lato|Ubuntu$|Geist$|Kanit|Sarabun|Parkinsans|Comfortaa|Itim|Coming Soon|Titillium/.test(cssName)
    ? "ui-sans-serif, system-ui, sans-serif"
    : "ui-monospace, SFMono-Regular, Menlo, monospace";
  document.documentElement.style.setProperty("--app-font", `"${cssName}", ${generic}`);
}

applyTheme();

const progress = Object.assign({
  rowsCleared: 0,
  avgWpm: 0,
  avgAccuracy: 100,
  letterStats: {},
  characterStats: {},
  lessonHistory: [],
  adaptiveLessonHistory: [],
  letterHistory: {},
  dailyActivity: {},
  errorReview: [],
  cleanLines: 0,
  placement: null
}, storedData.progress || {});
if (!progress.letterStats || typeof progress.letterStats !== "object") progress.letterStats = {};
if (!progress.characterStats || typeof progress.characterStats !== "object" || Array.isArray(progress.characterStats)) progress.characterStats = {};
if (!Array.isArray(progress.lessonHistory)) progress.lessonHistory = [];
if (!Array.isArray(progress.adaptiveLessonHistory)) progress.adaptiveLessonHistory = [];
if (!progress.letterHistory || typeof progress.letterHistory !== "object" || Array.isArray(progress.letterHistory)) progress.letterHistory = {};
if (!progress.dailyActivity || typeof progress.dailyActivity !== "object" || Array.isArray(progress.dailyActivity)) progress.dailyActivity = {};
if (!Array.isArray(progress.errorReview)) progress.errorReview = [];
if (!Number.isFinite(Number(progress.cleanLines))) progress.cleanLines = 0;

const commonWords = `a able about act add after again air all also always am an and any are area arm around as ask at back base be bed been best big bit blue book both bring build but by call came can care carry case change child city clear close come cost could course cut day did do door down draw dream drive during each early ease east eat end enough even ever every eye face fact fall far feel few field find fine fire first five for form found four free friend from full game gave get give go good got great green ground group grow had hand hard has have he head hear help her here high him his hold home hope hour house how i idea if in into is it job join just keep key kind know land large last late lead lean learn leave left less let life light like line list little live long look love made make man many mark may me mean men mind miss money more most move much must my name near need never new next night no not note now of off old on once one only open or our out over own page part pass pay people place plan play point power press put quick rain ran read real right river road room run said same saw say school see seem send set she short show side small so some sound stand start stay still story strong study such sure take talk tell than that the their them then there these they thing think this those time to told too took top tree true try turn two type under up use very view voice wait walk want war warm was watch water way we well went were what when where which while white who why will with word work world would write yard year yes yet you young your`.split(" ");
const moderateWords = `abide accent active admire adore advice alert anchor answer arena arise attend balance banner beacon belong better border borrow branch calmly captain careful center chance chosen circle comfort common corner courage custom daily decide delight detail direct divide double eager earnest effect effort either enable ending energy engine entire escape estate expand expect fabric faith family favor fellow figure filter finish flower follow future gather gentle glory golden handle harbor honest humble improve indeed inside intent island joyful keeper kingdom ladder leader lesson letter linger listen living matter memory middle modern moment motion notice number office origin palace patient pattern period phrase planet plenty polish ponder proper public quiet reason record remain rescue rhythm sample season second secret signal simple single smooth steady stream strength summer supply surely temple tender thread travel useful valley virtue window wonder worthy`.split(" ");
const expandedWords = `abandon ability abroad absence absolute absorb abstract academic accent access accident accompany accomplish accurate achieve acquire across adapt addition adequate adjacent adjust admire admission adopt affordable agenda aggressive agriculture aircraft album alert allocate alter alternative ambition ambitious analysis annual anxious apparent appreciate approach appropriate approval architect architecture argument arise arrangement arrival article assemble assess assign assist assume atmosphere attach attempt attitude audience authorize autumn available average avoid awake awareness awkward balance ballot bamboo barrier basic battery battle bedroom behavior beneath biological boundary breakfast brilliant broad budget bulletin burden cabinet calculate calendar capable capital capture career careful cargo category ceiling ceremony chamber champion channel charity chemical chemistry childhood circular circumstance clarify classic climate clinical closet cluster coach coastal collaborate colleague collect collision column combine comfort commercial commission commit communicate community companion comparison compete complete complex component compose compound concentrate concept conclude condition conference confidence confirm connect consequence consider constant construct consult contact contain contemporary context continue contract contrast contribution convert coordinate curiosity curious currency cycle database decade declare decline decrease defeat defend definition deliver demonstrate departure describe design desire despite develop device diagram difference difficult digital dignity discover discuss distance distinct distribute district diverse divide document domestic dominate dramatic durable dynamic eager ecology edition educate effective elaborate election element eliminate embrace emerge emotion emphasis employ enable encounter encourage endure engage enhance enormous ensure entrance equal equipment essential establish estimate evaluate eventual evidence examine example exchange excite exclude executive exhibit expand expectation experience experiment expert explain explore express extension external facility familiar feature festival flexible flourish forecast foreign forgive foundation fragment frequent function generous genuine geography graceful graduate grateful guarantee guidance habit habitat harmony healthy hesitate highlight historic identity illustrate imagine immediate impact implement impressive improve include increase independent influence inform ingredient initial insight inspire install instance instruct instrument insurance intelligent intend intense interact internal interpret interval introduce invent invest invite involve isolate jacket journal journey justice keyboard language launch layer lecture legend leisure liberal license lifetime likely limit literature locate logical maintain major manual margin material mature measure mechanism medical mention method migrate minimum ministry minor miracle mixture mobile modify monitor motivate multiple museum mutual mystery narrow native natural navigate nearby negotiate neither neutral nevertheless normal observe obtain obvious occasion occupy official operate option ordinary organize outcome outline overcome ownership parallel passage perceive perfect perform persist persuade physical pioneer pleasant plenty pocket portion practical precious prefer prepare presence preserve primary principle priority procedure process produce profession progress promise promote proportion protect protocol provide publish purpose qualify quantity quarter rapid rare reaction realize receive recent recognize recommend recover reduce reference reflect regular reject relate release relevant reliable remain remove repair replace request require research reserve respect respond restore reveal revenue review revise routine sacred safety salary satisfy schedule secure segment select senior separate sequence session settle shadow shelter shift signal similar sincere society source specific stable standard strategy strengthen structure submit succeed sufficient suggest suitable summary survive symbol target technique temporary tendency theory therefore threshold translate treasure typical unique universal update urgent useful vacuum valuable variety vehicle version victory video visible volunteer weather wherever whether whole willing withdraw witness wonderful workshop widespread yearn youth zero`.split(" ");
const rareWords = `abeyance acumen adroit aegis alacrity amity apprise ardor askance behoove benison bereft blithe boon celerity comely cordial doughty dulcet efface emprise erstwhile fallow fervor forbear forthright gallant halcyon inure lissome morrow obeisance pensive prudent quaint quell redolent resolute sagacity sallow sojourn stately succor sundry verdant winsome`.split(" ");
const dictionaryExtra = `ability absence account address advance advice affair agency agreement animal answer appeal arrival article artist aspect attempt balance beauty benefit brother budget camera career ceiling channel chapter charity choice church citizen comfort command company concern conduct courage cousin culture damage danger dealer debate degree demand desire detail device dinner doctor effort energy engine estate evening event family father figure flower garden glory habit harbor heaven history honor income island journey kingdom ladder leader lesson letter liberty member memory mercy minute modern moment morning motion mother nation notice number office option palace parent pastor patient pattern period person phrase planet player plenty prayer promise public purpose reason record refuge return rhythm river safety season second secret servant service signal sister spirit station story student summer supply teacher temple tender theory thread travel valley virtue vision window wisdom wonder worker worship writer`.split(" ");
const rareLetterFocusWords = {
  q: `quick quiet quite queen quest query quote quality equal square quarter require unique liquid sequence acquire frequent equipment question`.split(" "),
  z: `size zero zone maze lazy dozen crazy amaze breeze freeze prize zebra cozy zoom dizzy fuzzy buzz blaze bronze realize organize recognize puzzle`.split(" "),
  x: `next text box six fix mix exit exact extra example expect expand expert exist explain index relax complex context exercise explore flexible maximum`.split(" "),
  v: `very view voice love give have save move live river seven leave drive avoid event value cover never over even visit valid verse victory vital vivid velvet vessel venture volume improve discover develop favorite available`.split(" ")
};
const rareLetterFocusPool = [...new Set(Object.values(rareLetterFocusWords).flat())];
const creativeCatalog = [
  ["weakspot", "Weakspot", "Focuses slow and mistyped letters from your saved progress."],
  ["58008", "58008", "A numbers-only challenge."],
  ["mirror", "Mirror", "Mirrors the practice text horizontally."],
  ["upside_down", "Upside Down", "Turns the entire practice line upside down."],
  ["nausea", "Nausea", "Adds a gentle moving challenge to the practice line."],
  ["round_round_baby", "Round Round Baby", "Rotates the practice line while you type."],
  ["simon_says", "Simon Says", "Shows only the word you are meant to follow."],
  ["tts", "Listen Closely", "Reads the line aloud and hides the untyped text."],
  ["choo_choo", "Choo Choo", "Spins the current character."],
  ["arrows", "Arrows", "Use the four arrow keys instead of letters."],
  ["rAnDoMcAsE", "Random Case", "Randomizes the capitalization of each letter."],
  ["sPoNgEcAsE", "Sponge Case", "Alternates upper and lower case."],
  ["capitals", "Capitals", "Capitalizes every word."],
  ["layout_mirror", "Layout Mirror", "Mirrors the on-screen keyboard layout."],
  ["layoutfluid", "Layout Fluid", "Cycles the visible keyboard style after each line."],
  ["earthquake", "Earthquake", "Shakes the current character."],
  ["space_balls", "Space Balls", "Tilts the text into a distant perspective."],
  ["gibberish", "Gibberish", "Generates pronounceable-looking nonsense words."],
  ["ascii", "ASCII", "Uses printable ASCII character groups."],
  ["specials", "Specials", "Uses only punctuation and symbol groups."],
  ["plus_zero", "+0", "Only the current word stays visible."],
  ["plus_one", "+1", "Shows one word ahead."],
  ["plus_two", "+2", "Shows two words ahead."],
  ["plus_three", "+3", "Shows three words ahead."],
  ["read_ahead_easy", "Read Ahead Easy", "Hides the current word."],
  ["read_ahead", "Read Ahead", "Hides the current word and the next word."],
  ["read_ahead_hard", "Read Ahead Hard", "Hides the current word and the next two words."],
  ["memory", "Memory", "Shows each line briefly, then asks you to type it from memory."],
  ["nospace", "No Space", "Removes every space from the test."],
  ["poetry", "Poetry", "Practices a locally included public-domain verse."],
  ["wikipedia", "Encyclopedia", "Practices clear factual prose without a network request."],
  ["pseudolang", "Pseudo Language", "Builds English-looking invented words."],
  ["IPv4", "IPv4", "Generates IPv4 addresses."],
  ["IPv6", "IPv6", "Generates IPv6 addresses."],
  ["binary", "Binary", "Generates eight-bit binary groups."],
  ["hexadecimal", "Hexadecimal", "Generates hexadecimal byte groups."],
  ["zipf", "Zipf", "Heavily favors common words and occasionally surfaces rare ones."],
  ["morse", "Morse", "Converts a short phrase to Morse code."],
  ["crt", "CRT", "Adds a restrained old-monitor glow."],
  ["backwards", "Backwards", "Reverses every word."],
  ["ddoouubblleedd", "Doubled", "Repeats every character twice."],
  ["instant_messaging", "Instant Messaging", "Removes capitalization."],
  ["underscore_spaces", "Underscore Spaces", "Replaces spaces with underscores."],
  ["ALL_CAPS", "All Caps", "Turns every letter into uppercase."],
  ["polyglot", "Polyglot", "Mixes familiar words from several languages."],
  ["asl", "Finger Spelling Focus", "Presents short single-letter groups for finger-spelling drills."],
  ["rot13", "ROT13", "Encodes regular words with ROT13."],
  ["no_quit", "No Quit", "Disables restart until the current section is complete."]
].map(([id, label, description]) => ({ id, label, description }));
const creativeModeLabels = Object.fromEntries(creativeCatalog.map(item => [item.id, item.label]));

const fontCatalog = [
  "Roboto_Mono", "Noto_Naskh_Arabic", "Source_Code_Pro", "IBM_Plex_Sans", "Inconsolata", "Fira_Code", "JetBrains_Mono", "Roboto",
  "Montserrat", "Titillium_Web", "Lexend_Deca", "Comic_Sans_MS", "Oxygen", "Nunito", "Itim", "Courier",
  "Comfortaa", "Coming_Soon", "Atkinson_Hyperlegible", "Lato", "Lalezar", "Boon", "Open_Dyslexic", "Ubuntu", "Ubuntu_Mono",
  "Georgia", "Cascadia_Mono", "IBM_Plex_Mono", "Overpass_Mono", "Hack", "CommitMono", "Mononoki",
  "Parkinsans", "Geist", "Sarabun", "Kanit", "Geist_Mono", "Iosevka", "Proto", "Adwaita_Mono",
  "Inter_Tight", "Space_Grotesk", "Noto_Sans_Lao"
];
const googleFontFamilies = new Set([
  "Roboto_Mono", "Noto_Naskh_Arabic", "Source_Code_Pro", "IBM_Plex_Sans", "Inconsolata", "Fira_Code", "JetBrains_Mono", "Roboto",
  "Montserrat", "Titillium_Web", "Lexend_Deca", "Oxygen", "Nunito", "Itim", "Comfortaa", "Coming_Soon",
  "Atkinson_Hyperlegible", "Lato", "Lalezar", "Ubuntu", "Ubuntu_Mono", "IBM_Plex_Mono", "Overpass_Mono", "Parkinsans",
  "Sarabun", "Kanit", "Inter_Tight", "Space_Grotesk", "Noto_Sans_Lao"
]);

const poetryPassages = [
  "Hope is the thing with feathers that perches in the soul and sings the tune without the words and never stops at all.",
  "I wandered lonely as a cloud that floats on high over vales and hills when all at once I saw a crowd a host of golden daffodils.",
  "Let me not to the marriage of true minds admit impediments. Love is not love which alters when it alteration finds."
];
const encyclopediaPassages = [
  "Touch typing is a method of typing without using the sense of sight to find individual keys. Muscle memory develops through accurate and repeated movement.",
  "A mechanical keyboard uses an individual switch beneath each key. Switch design changes the sound, travel, and tactile feedback felt by the typist.",
  "The printing press enabled written works to be reproduced efficiently and helped knowledge travel across communities and generations."
];
const polyglotWords = `hello hola bonjour hallo grazie gracias merci bitte amigo famille mondo casa agua livre leben paz joie faith hope grace`.split(" ");
const morseAlphabet = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--.."
};

const kjvQuoteReferences = [
  ["Genesis", 1, 1], ["Exodus", 14, 14], ["Deuteronomy", 31, 8], ["Joshua", 1, 9],
  ["Psalm", 23, 1, 4], ["Psalm", 27, 1], ["Psalm", 34, 8], ["Psalm", 37, 4, 5],
  ["Psalm", 46, 1], ["Psalm", 46, 10], ["Psalm", 51, 10], ["Psalm", 91, 1, 2],
  ["Psalm", 118, 24], ["Psalm", 119, 105], ["Psalm", 121, 1, 2], ["Proverbs", 3, 5, 6],
  ["Proverbs", 18, 10], ["Isaiah", 40, 31], ["Isaiah", 41, 10], ["Isaiah", 43, 2],
  ["Isaiah", 53, 5], ["Jeremiah", 29, 11], ["Lamentations", 3, 22, 23], ["Micah", 6, 8],
  ["Nahum", 1, 7], ["Matthew", 5, 14, 16], ["Matthew", 6, 33, 34], ["Matthew", 7, 7],
  ["Matthew", 11, 28, 30], ["Matthew", 19, 26], ["Matthew", 22, 37, 39], ["Mark", 9, 23],
  ["Luke", 1, 37], ["John", 3, 16, 17], ["John", 8, 12], ["John", 10, 10],
  ["John", 14, 1, 3], ["John", 14, 6], ["John", 14, 27], ["John", 15, 5],
  ["John", 16, 33], ["Acts", 1, 8], ["Romans", 5, 8], ["Romans", 8, 1],
  ["Romans", 8, 28], ["Romans", 8, 31], ["Romans", 10, 9], ["Romans", 12, 2],
  ["1 Corinthians", 10, 13], ["1 Corinthians", 13, 4, 7], ["1 Corinthians", 15, 58],
  ["2 Corinthians", 5, 7], ["2 Corinthians", 12, 9], ["Galatians", 2, 20], ["Galatians", 5, 22, 23],
  ["Ephesians", 2, 8, 10], ["Ephesians", 3, 20], ["Ephesians", 6, 10, 11],
  ["Philippians", 1, 6], ["Philippians", 4, 4, 7], ["Philippians", 4, 13], ["Philippians", 4, 19],
  ["Colossians", 3, 23, 24], ["1 Thessalonians", 5, 16, 18], ["2 Timothy", 1, 7],
  ["2 Timothy", 3, 16, 17], ["Hebrews", 4, 12], ["Hebrews", 11, 1], ["Hebrews", 12, 1, 2],
  ["James", 1, 2, 4], ["James", 1, 5], ["1 Peter", 5, 7], ["1 John", 1, 9],
  ["1 John", 4, 4], ["1 John", 4, 19], ["Revelation", 21, 4]
];

const generalQuotes = [
  ["William Shakespeare", "To thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man."],
  ["Jane Austen", "There is no charm equal to tenderness of heart."],
  ["Frederick Douglass", "If there is no struggle, there is no progress."],
  ["Ralph Waldo Emerson", "What lies behind us and what lies before us are tiny matters compared to what lies within us."],
  ["Booker T. Washington", "Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome."],
  ["Helen Keller", "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence."],
  ["Abraham Lincoln", "I will prepare and someday my chance will come."],
  ["Theodore Roosevelt", "Believe you can and you are halfway there."],
  ["Maya Angelou", "Nothing will work unless you do."],
  ["Marcus Aurelius", "The happiness of your life depends upon the quality of your thoughts."],
  ["Epictetus", "No great thing is created suddenly."],
  ["Seneca", "Luck is what happens when preparation meets opportunity."],
  ["Charles Dickens", "No one is useless in this world who lightens the burdens of another."],
  ["Louisa May Alcott", "I am not afraid of storms, for I am learning how to sail my ship."],
  ["Henry David Thoreau", "Go confidently in the direction of your dreams. Live the life you have imagined."],
  ["Harriet Tubman", "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world."],
  ["W. E. B. Du Bois", "The cost of liberty is less than the price of repression."],
  ["Sojourner Truth", "Truth is powerful and it prevails."],
  ["George Washington Carver", "When you can do the common things of life in an uncommon way, you will command the attention of the world."],
  ["Anna Julia Cooper", "The cause of freedom is not the cause of a race or a sect, a party or a class; it is the cause of humankind, the very birthright of humanity."]
];

const books = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

const els = Object.fromEntries([
  "modeEyebrow", "lessonTitle", "liveMetrics", "liveWpmWrap", "liveWpm", "liveAccWrap", "liveAcc",
  "liveRawWrap", "liveRaw", "liveConsistencyWrap", "liveConsistency", "liveProgressWrap", "liveProgress", "timerMeter",
  "timerFill", "typingCard", "typingText", "rowLabel", "charLabel", "scriptureStrip", "scriptureRef", "completionBanner",
  "keyboard", "keyboardWrap", "lessonScore", "lastWpm", "lastAccuracy", "topWpm", "learningRate", "dailyGoalText",
  "dailyGoalFill", "cleanLines", "reviewErrorsBtn", "techniqueCue", "resultPanel", "resultEyebrow", "resultTitle", "resultScore", "resultWpm", "resultRaw",
  "resultAccuracy", "resultConsistency", "resultCharacters", "resultTime", "resultRestartBtn", "settingsDialog", "settingsBtn",
  "resultDictationErrorsWrap", "resultDictationErrors", "resultFollowRateWrap", "resultFollowRate",
  "statsDialog", "statsBtn", "fullscreenBtn", "restartBtn", "letterHud", "unlockNext", "unlockCount",
  "practiceFocusIndicator", "practiceFocusName", "practiceFocusDescription", "practiceFocusState", "letterHeatmap", "letterHeatRow", "heatmapSummary", "specialHeatmap", "letterDialog", "letterDetailBadge", "letterDetailTitle",
  "letterMastery", "letterLastSpeed", "letterTopSpeed", "letterAccuracy", "letterLearningRate", "letterLessons",
  "letterCurveCaption", "letterChart", "adaptiveResultDetails", "adaptiveStatsChart", "adaptiveRank", "adaptiveWeakestLetter", "adaptiveWeakestDetail",
  "adaptiveStrongestLetter", "adaptiveStrongestDetail", "adaptiveFastestWpm", "adaptiveSlowestWpm", "adaptiveErrors", "adaptiveConsistency",
  "adaptiveMissedLetters", "adaptiveMissedSummary", "adaptiveTechniqueSummary", "adaptiveTechniqueList", "adaptiveRepairFocusButton",
  "adaptiveRecommendationName", "adaptiveRecommendationReason", "adaptiveModePicker", "adaptiveFocusPicker", "adaptiveRecommendationButton", "settingsKeyboardMap",
  "letterFocusCheckbox", "letterFocusHint", "postureReminder", "postureReminderTitle", "postureReminderText",
  "dictationControls", "dictationAudioStatus", "dictationReplayButton", "dictationSubmitButton",
  "spokenRemindersEnabled", "reminderTtsModel", "reminderVoiceId", "reminderLanguage", "reminderVolume",
  "previewReminderVoiceButton", "replayReminderButton", "spokenReminderStatus", "reminderLanguageRow",
  "spokenReminderToast", "spokenReminderToastTitle", "spokenReminderToastText", "spokenReminderRetryButton"
].map(id => [id, document.getElementById(id)]));

let saveTimer;
let memoryTimer;
let kjvPromise;
let restartRequestId = 0;

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ prefs, progress }));
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 250);
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function learningRate(history) {
  const values = history.slice(-12).map(item => Number(item?.wpm)).filter(Number.isFinite);
  if (values.length < 2) return null;
  const xMean = (values.length - 1) / 2;
  const yMean = values.reduce((sum, value) => sum + value, 0) / values.length;
  let numerator = 0;
  let denominator = 0;
  values.forEach((value, index) => {
    numerator += (index - xMean) * (value - yMean);
    denominator += (index - xMean) ** 2;
  });
  return denominator ? numerator / denominator : 0;
}

function formatLearningRate(history) {
  const rate = learningRate(history);
  return rate === null ? "Collecting" : `${rate >= 0 ? "+" : ""}${rate.toFixed(1)} WPM/lesson`;
}

function lessonScore(wpm, accuracy) {
  const accuracyFactor = Math.max(0, Math.min(1, accuracy / 100));
  return Math.round(Math.max(0, wpm) * 20 * accuracyFactor ** 2);
}

function snapshotAdaptiveLetterStats(source = state.lessonLetterStats) {
  return Object.fromEntries(Object.entries(source).map(([letter, stats]) => [letter, {
    attempts: Number(stats.attempts) || 0,
    correct: Number(stats.correct) || 0,
    timedCorrect: Number(stats.timedCorrect) || 0,
    elapsedMs: Number(stats.elapsedMs) || 0
  }]));
}

function aggregateAdaptiveLetterStats(pageSamples) {
  const totals = {};
  pageSamples.forEach(page => {
    Object.entries(page.letterStats || {}).forEach(([letter, stats]) => {
      const total = totals[letter] ||= { attempts: 0, correct: 0, timedCorrect: 0, elapsedMs: 0 };
      total.attempts += Number(stats.attempts) || 0;
      total.correct += Number(stats.correct) || 0;
      total.timedCorrect += Number(stats.timedCorrect) || 0;
      total.elapsedMs += Number(stats.elapsedMs) || 0;
    });
  });
  const targetSpeed = Math.max(1, Number(prefs.targetSpeed) || defaultPrefs.targetSpeed);
  return Object.entries(totals).map(([letter, stats]) => {
    const accuracy = stats.attempts ? (stats.correct / stats.attempts) * 100 : 0;
    const wpm = stats.timedCorrect >= 2 && stats.elapsedMs > 0
      ? (stats.timedCorrect / 5) / (stats.elapsedMs / 60000)
      : 0;
    const skill = Math.max(0, Math.min(1, accuracy / 100)) * .62 + Math.min(1, wpm / targetSpeed) * .38;
    return {
      letter: letter.toUpperCase(),
      attempts: stats.attempts,
      correct: stats.correct,
      accuracy: Number(accuracy.toFixed(1)),
      wpm: Number(Math.max(0, Math.min(400, wpm)).toFixed(1)),
      skill: Number(skill.toFixed(3)),
      finger: fingerZone(letter).label
    };
  }).sort((a, b) => b.skill - a.skill || b.attempts - a.attempts);
}

function mostMissedAdaptiveLetters(letterBreakdown, limit = 5) {
  return letterBreakdown
    .map(item => {
      const errors = Math.max(0, Number(item.attempts) - Number(item.correct));
      const errorRate = item.attempts ? (errors / item.attempts) * 100 : 0;
      return {
        ...item,
        errors,
        errorRate: Number(errorRate.toFixed(1))
      };
    })
    .filter(item => item.errors > 0)
    .sort((a, b) => b.errors - a.errors || b.errorRate - a.errorRate || b.attempts - a.attempts)
    .slice(0, limit);
}

function buildAdaptiveLessonSummary(lineSamples) {
  const lines = lineSamples.map((line, index) => ({
    line: index + 1,
    wpm: Number(Number(line.wpm || 0).toFixed(1)),
    raw: Number(Number(line.raw || 0).toFixed(1)),
    accuracy: Number(Number(line.accuracy || 0).toFixed(1)),
    consistency: Number(Number(line.consistency || 0).toFixed(1)),
    score: Number(line.score) || 0,
    elapsedMs: Number(line.elapsedMs) || 0,
    characters: Number(line.characters) || 0,
    errors: Number(line.errors) || 0
  }));
  const totalElapsedMs = lines.reduce((sum, line) => sum + line.elapsedMs, 0);
  const totalCharacters = lines.reduce((sum, line) => sum + line.characters, 0);
  const totalErrors = lines.reduce((sum, line) => sum + line.errors, 0);
  const totalAttempts = totalCharacters + totalErrors;
  const wpm = totalElapsedMs > 0 ? (totalCharacters / 5) / (totalElapsedMs / 60000) : 0;
  const raw = totalElapsedMs > 0 ? (totalAttempts / 5) / (totalElapsedMs / 60000) : 0;
  const accuracy = totalAttempts ? (totalCharacters / totalAttempts) * 100 : 100;
  const consistency = lines.length ? lines.reduce((sum, line) => sum + line.consistency, 0) / lines.length : 100;
  const letterBreakdown = aggregateAdaptiveLetterStats(lineSamples);
  const mostMissedLetters = mostMissedAdaptiveLetters(letterBreakdown);
  const weakest = letterBreakdown.at(-1);
  const strongest = letterBreakdown[0];
  const fastestWpm = lines.reduce((best, line) => Math.max(best, line.wpm), 0);
  const slowestWpm = lines.reduce((slowest, line) => Math.min(slowest, line.wpm), lines[0]?.wpm || 0);
  return {
    at: lineSamples.at(-1)?.at || Date.now(),
    mode: "adaptive",
    adaptiveLesson: true,
    lines: lines.length,
    lineMetrics: lines,
    wpm: Number(wpm.toFixed(1)),
    raw: Number(raw.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    consistency: Number(consistency.toFixed(1)),
    score: lessonScore(wpm, accuracy),
    targetSpeed: Number(prefs.targetSpeed) || defaultPrefs.targetSpeed,
    elapsedMs: totalElapsedMs,
    characters: totalCharacters,
    errors: totalErrors,
    weakestLetter: weakest?.letter || "--",
    strongestLetter: strongest?.letter || "--",
    weakestLetterAccuracy: weakest?.accuracy ?? null,
    strongestLetterAccuracy: strongest?.accuracy ?? null,
    weakestFinger: weakest?.finger || "--",
    strongestFinger: strongest?.finger || "--",
    fastestWpm: Number(fastestWpm.toFixed(1)),
    slowestWpm: Number(slowestWpm.toFixed(1)),
    letterBreakdown,
    mostMissedLetters
  };
}

function recommendAdaptiveFocus(history) {
  const recent = history.filter(item => item?.adaptiveLesson).slice(-3);
  const label = recent.length === 3 ? "your last 3 adaptive lessons" : `${recent.length} recent adaptive lesson${recent.length === 1 ? "" : "s"}`;
  const average = key => recent.length ? recent.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / recent.length : 0;
  const averageAccuracy = average("accuracy");
  const averageWpm = average("wpm");
  const averageConsistency = average("consistency");
  const latest = recent.at(-1);
  const weakLetters = recent.map(item => item.weakestLetter).filter(letter => letter && letter !== "--");
  const weakFingers = recent.map(item => item.weakestFinger).filter(finger => finger && finger !== "--");
  const repeatedWeakLetter = weakLetters.find(letter => weakLetters.filter(value => value === letter).length >= 2);
  const repeatedWeakFinger = weakFingers.find(finger => weakFingers.filter(value => value === finger).length >= 2);
  const targetSpeed = Math.max(1, Number(prefs.targetSpeed) || defaultPrefs.targetSpeed);
  let id = "balanced";
  let reason = recent.length
    ? `Based on ${label}, keep a steady mix while the system gathers more evidence.`
    : "Complete three adaptive lessons to unlock a more specific recommendation.";
  if (recent.length && (averageAccuracy < 91 || Number(latest.accuracy) < 88)) {
    id = "accuracy";
    reason = `Accuracy is the clearest limiter across ${label}; simpler words and error repair should stabilize your typing.`;
  } else if (repeatedWeakLetter || repeatedWeakFinger) {
    id = repeatedWeakFinger ? "finger" : "weak";
    reason = repeatedWeakFinger
      ? `${repeatedWeakFinger} keeps appearing among your weakest areas across ${label}; isolate that finger zone for focused repetitions.`
      : `${repeatedWeakLetter} keeps appearing as a weak letter across ${label}; repeat natural words that contain it.`;
  } else if (recent.length && averageAccuracy >= 95 && averageWpm < targetSpeed * .86) {
    id = "speed";
    reason = `Accuracy is holding at ${Math.round(averageAccuracy)}%, so longer natural words can now build speed toward your ${targetSpeed} WPM target.`;
  } else if (recent.length && averageConsistency < 75) {
    id = "alternation";
    reason = `Your accuracy is workable, but rhythm is uneven across ${label}; left/right hand alternation can smooth the pace.`;
  }
  return {
    id,
    label: practicePresetLabels[id] || practicePresetLabels.balanced,
    reason,
    basedOn: recent.length,
    averageAccuracy: Number(averageAccuracy.toFixed(1)),
    averageWpm: Number(averageWpm.toFixed(1)),
    averageConsistency: Number(averageConsistency.toFixed(1))
  };
}

function rankAdaptiveLesson(result) {
  const history = progress.adaptiveLessonHistory.filter(item => item?.adaptiveLesson);
  const includesCurrent = history.some(item => Number(item.at) === Number(result.at));
  const pool = includesCurrent ? history : history.concat(result);
  const rank = 1 + pool.filter(item => Number(item.score) > Number(result.score)).length;
  const percentile = Math.max(1, Math.round(((pool.length - rank + 1) / pool.length) * 100));
  return { rank, total: pool.length, percentile };
}

function saveAdaptiveLessonSummary(summary) {
  if (prefs.resultSaving !== "on") return;
  progress.adaptiveLessonHistory.push(summary);
  if (progress.adaptiveLessonHistory.length > 60) progress.adaptiveLessonHistory = progress.adaptiveLessonHistory.slice(-60);
}

function trackDailyActivity(now) {
  const previous = state.lastActivityAt;
  state.lastActivityAt = now;
  if (!previous) return;
  const elapsed = now - previous;
  if (elapsed <= 0 || elapsed > 12000) return;
  const today = localDateKey();
  progress.dailyActivity[today] = (Number(progress.dailyActivity[today]) || 0) + elapsed / 1000;
  Object.keys(progress.dailyActivity).sort().slice(0, -35).forEach(key => delete progress.dailyActivity[key]);
  scheduleSave();
}

function renderPerformance() {
  const history = progress.lessonHistory.filter(item => item && Number.isFinite(Number(item.wpm)) && Number.isFinite(Number(item.accuracy)));
  const latest = history.at(-1);
  const topSpeed = history.reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0);
  els.lessonScore.textContent = latest ? Math.round(Number(latest.score) || 0).toLocaleString() : "0";
  els.lastWpm.textContent = latest ? `${Math.round(latest.wpm)} WPM` : "0 WPM";
  els.lastAccuracy.textContent = latest ? `${Math.round(latest.accuracy)}%` : "--";
  els.topWpm.textContent = `${Math.round(topSpeed)} WPM`;
  els.learningRate.textContent = formatLearningRate(history);
  els.cleanLines.textContent = String(Math.round(Number(progress.cleanLines) || 0));
  els.reviewErrorsBtn.classList.toggle("hidden", !progress.errorReview.length);

  const goalMinutes = Number(prefs.dailyGoalMinutes) || defaultPrefs.dailyGoalMinutes;
  const activeMinutes = (Number(progress.dailyActivity[localDateKey()]) || 0) / 60;
  const shownMinutes = activeMinutes < 10 ? Number(activeMinutes.toFixed(1)) : Math.round(activeMinutes);
  const goalRatio = Math.min(1, activeMinutes / goalMinutes);
  els.dailyGoalText.textContent = `${shownMinutes} / ${goalMinutes} min`;
  els.dailyGoalFill.style.width = `${goalRatio * 100}%`;
  els.dailyGoalFill.parentElement.classList.toggle("complete", goalRatio >= 1);
}

function renderTechniqueCue(metrics) {
  if (!prefs.techniqueTips || ["bible", "bibleQuotes", "zen"].includes(state.mode) || state.testCompleted) {
    els.techniqueCue.classList.add("hidden");
    return;
  }
  const activeMinutes = (Number(progress.dailyActivity[localDateKey()]) || 0) / 60;
  const restCheckpoint = Math.floor(activeMinutes / 10);
  if (restCheckpoint >= 1 && restCheckpoint > state.lastRestReminder) {
    state.lastRestReminder = restCheckpoint;
    state.techniqueMessageUntil = Date.now() + 8000;
  }
  let message = "Relax your shoulders and let your fingers return to the home row.";
  if (Date.now() < state.techniqueMessageUntil) message = "Take a short break, loosen your hands, and come back fresh.";
  else if (metrics.accuracy < 90) message = "Slow down slightly and finish each word cleanly before building speed.";
  else if (metrics.consistency < 70 && state.keyIntervals.length > 5) message = "Keep an even rhythm; steady keystrokes become speed.";
  else if (prefs.rhythmCoach) message = "Listen for an even beat between keystrokes.";
  els.techniqueCue.textContent = message;
  els.techniqueCue.classList.remove("hidden");
}

function currentMetrics(now = performance.now()) {
  const elapsedMs = state.startedAt ? Math.max(1000, now - state.startedAt) : 1000;
  const elapsedMinutes = elapsedMs / 60000;
  const attempts = state.rawTyped + state.errors;
  const wpm = (state.charsTyped / 5) / elapsedMinutes;
  const raw = (attempts / 5) / elapsedMinutes;
  const accuracy = attempts ? (state.charsTyped / attempts) * 100 : 100;
  let consistency = 100;
  if (state.keyIntervals.length > 2) {
    const mean = state.keyIntervals.reduce((sum, value) => sum + value, 0) / state.keyIntervals.length;
    const variance = state.keyIntervals.reduce((sum, value) => sum + (value - mean) ** 2, 0) / state.keyIntervals.length;
    consistency = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / mean) * 100));
  }
  return { elapsedMs, wpm, raw, accuracy, consistency, attempts };
}

function currentAdaptiveLineMetrics(now = performance.now()) {
  const elapsedMs = state.lineStartedAt ? Math.max(1000, now - state.lineStartedAt) : 1000;
  const elapsedMinutes = elapsedMs / 60000;
  const attempts = state.lineRawTyped + state.lineErrors;
  const wpm = (state.lineCharsTyped / 5) / elapsedMinutes;
  const raw = (attempts / 5) / elapsedMinutes;
  const accuracy = attempts ? (state.lineCharsTyped / attempts) * 100 : 100;
  let consistency = 100;
  if (state.lineKeyIntervals.length > 2) {
    const mean = state.lineKeyIntervals.reduce((sum, value) => sum + value, 0) / state.lineKeyIntervals.length;
    const variance = state.lineKeyIntervals.reduce((sum, value) => sum + (value - mean) ** 2, 0) / state.lineKeyIntervals.length;
    consistency = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / mean) * 100));
  }
  return {
    at: Date.now(),
    wpm: Number(wpm.toFixed(1)),
    raw: Number(raw.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    consistency: Number(consistency.toFixed(1)),
    score: lessonScore(wpm, accuracy),
    elapsedMs,
    characters: state.lineCharsTyped,
    errors: state.lineErrors,
    letterStats: snapshotAdaptiveLetterStats(state.lineLetterStats)
  };
}

function formattedSpeed(wpm) {
  if (prefs.speedUnit === "cpm") return `${Math.round(wpm * 5)} CPM`;
  if (prefs.speedUnit === "wps") return `${(wpm / 60).toFixed(1)} WPS`;
  return `${Math.round(wpm)} WPM`;
}

function currentProgress() {
  const target = currentTarget();
  if (state.mode === "time") return Math.max(0, Math.min(1, 1 - state.timeRemaining / Number(prefs.testDuration)));
  if (state.mode === "adaptive") return Math.max(0, Math.min(1, (state.rowIndex + (target.length ? state.input.length / target.length : 0)) / lessonLineLimit()));
  if (["words", "creative", "placement"].includes(state.mode)) return Math.max(0, Math.min(1, (state.rowIndex + (target.length ? state.input.length / target.length : 0)) / Math.max(1, state.targetRows.length)));
  if (state.mode === "zen") return target.length ? Math.max(0, Math.min(1, state.input.length / target.length)) : 0;
  if (["quote", "bible", "bibleQuotes"].includes(state.mode)) {
    return Math.max(0, Math.min(1, (state.pageIndex + (target.length ? state.input.length / target.length : 0)) / Math.max(1, state.scripturePages.length)));
  }
  return target.length ? Math.max(0, Math.min(1, state.input.length / target.length)) : 0;
}

function renderLiveMetrics() {
  const metrics = currentMetrics();
  const progressRatio = currentProgress();
  const visible = state.mode !== "zen" && !state.testCompleted;
  els.liveMetrics.classList.toggle("hidden", !visible);
  if (!visible) {
    els.techniqueCue.classList.add("hidden");
    return;
  }
  els.liveWpm.textContent = formattedSpeed(metrics.wpm);
  els.liveAcc.textContent = `${Math.round(metrics.accuracy)}%`;
  els.liveRaw.textContent = formattedSpeed(metrics.raw);
  els.liveConsistency.textContent = `${Math.round(metrics.consistency)}%`;
  els.liveProgress.textContent = state.mode === "time" && ["text", "both"].includes(prefs.timerStyle)
    ? `${Math.max(0, Math.ceil(state.timeRemaining))}s`
    : `${Math.round(progressRatio * 100)}%`;
  els.liveWpmWrap.classList.toggle("hidden", !prefs.showLiveWpm);
  els.liveAccWrap.classList.toggle("hidden", !prefs.showLiveAccuracy);
  els.liveRawWrap.classList.toggle("hidden", !prefs.showLiveRaw);
  els.liveConsistencyWrap.classList.toggle("hidden", !prefs.showLiveConsistency);
  els.liveProgressWrap.classList.toggle("hidden", !prefs.showProgress || prefs.timerStyle === "off");
  els.liveConsistencyWrap.classList.toggle("hidden", !(prefs.showLiveConsistency || prefs.rhythmCoach));
  const showBar = state.mode === "time" && ["bar", "both"].includes(prefs.timerStyle);
  els.timerMeter.classList.toggle("hidden", !showBar);
  els.timerFill.style.width = `${progressRatio * 100}%`;
  renderTechniqueCue(metrics);
}

function renderAdaptiveStatsChart(result) {
  const samples = Array.isArray(result?.lineMetrics)
    ? result.lineMetrics
    : Array.isArray(result?.pageMetrics) ? result.pageMetrics : [];
  const unit = Array.isArray(result?.lineMetrics) ? "Line" : "Page";
  if (!samples.length) {
    els.adaptiveStatsChart.innerHTML = `<div class="adaptive-chart-empty">Complete a full adaptive lesson to build the line trend.</div>`;
    return;
  }
  const width = 780;
  const height = 260;
  const margin = { top: 26, right: 24, bottom: 34, left: 54 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const target = Number(result.targetSpeed) || Number(prefs.targetSpeed) || defaultPrefs.targetSpeed;
  const speeds = samples.map(sample => Number(sample.wpm) || 0);
  const minY = Math.max(0, Math.floor((Math.min(...speeds, target) - 5) / 5) * 5);
  const maxY = Math.max(minY + 10, Math.ceil((Math.max(...speeds, target) + 5) / 5) * 5);
  const xFor = index => samples.length === 1
    ? margin.left + plotWidth / 2
    : margin.left + (index / (samples.length - 1)) * plotWidth;
  const yFor = value => margin.top + ((maxY - value) / (maxY - minY)) * plotHeight;
  const points = speeds.map((speed, index) => [xFor(index), yFor(speed)]);
  const path = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const grid = Array.from({ length: 5 }, (_, index) => {
    const value = maxY - ((maxY - minY) * index / 4);
    const y = yFor(value);
    return `<g><line class="adaptive-chart-grid" x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}"></line><text class="adaptive-chart-axis" x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${Math.round(value)}</text></g>`;
  }).join("");
  const xLabels = samples.map((sample, index) => {
    if (index !== 0 && index !== samples.length - 1 && index !== Math.floor((samples.length - 1) / 2)) return "";
    return `<text class="adaptive-chart-axis" x="${xFor(index).toFixed(1)}" y="${height - 10}" text-anchor="middle">${unit} ${sample.line || sample.page || index + 1}</text>`;
  }).join("");
  const dots = points.map(([x, y], index) => {
    const sample = samples[index];
    return `<circle class="adaptive-chart-point" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${index === samples.length - 1 ? 6 : 4}"><title>${unit} ${sample.line || sample.page || index + 1}: ${Math.round(sample.wpm)} WPM, ${Math.round(sample.accuracy)}% accuracy</title></circle>`;
  }).join("");
  const targetY = yFor(target);
  els.adaptiveStatsChart.innerHTML = `
    <div class="adaptive-chart-legend"><span><i class="speed-key"></i>${unit} speed</span><span><i class="target-key"></i>${Math.round(target)} WPM target</span></div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Adaptive lesson speed across ${samples.length} lines">
      ${grid}
      <line class="adaptive-chart-target" x1="${margin.left}" y1="${targetY.toFixed(1)}" x2="${width - margin.right}" y2="${targetY.toFixed(1)}"></line>
      <path class="adaptive-chart-area" d="${path} L${points.at(-1)[0].toFixed(1)} ${(margin.top + plotHeight).toFixed(1)} L${points[0][0].toFixed(1)} ${(margin.top + plotHeight).toFixed(1)} Z"></path>
      <path class="adaptive-chart-line" d="${path}"></path>
      ${dots}
      ${xLabels}
      <text class="adaptive-chart-axis" x="${margin.left}" y="16">WPM</text>
    </svg>`;
}

function adaptiveResultMissedLetters(result) {
  if (Array.isArray(result?.mostMissedLetters)) return result.mostMissedLetters;
  return mostMissedAdaptiveLetters(Array.isArray(result?.letterBreakdown) ? result.letterBreakdown : []);
}

function suggestedAdaptiveFocusLetters(result) {
  return [...new Set(adaptiveResultMissedLetters(result).slice(0, 5)
    .map(item => String(item.letter || "").toUpperCase()))]
    .filter(letter => letterOrder.includes(letter));
}

function renderAdaptiveRepairPlan(result, missedLetters) {
  const names = missedLetters.slice(0, 3).map(item => item.letter).join(", ");
  const suggestedLetters = suggestedAdaptiveFocusLetters(result);
  const techniqueItems = [];
  if (missedLetters.length) {
    techniqueItems.push({
      title: "Slow clean repetitions",
      detail: `Practice ${names} at a comfortable pace and let accuracy lead. Use short bursts until the error count drops before raising the target.`
    });
    techniqueItems.push({
      title: "Interleave the repair",
      detail: `After two focused lines with ${names}, mix those letters back into ordinary words so the improvement transfers beyond the drill.`
    });
  }
  if (Number(result.consistency) < 75) {
    techniqueItems.push({
      title: "Use shorter sessions",
      detail: "Keep the next block brief, aim for an even rhythm, then return after a real pause instead of forcing speed through fatigue."
    });
  } else {
    techniqueItems.push({
      title: "Finish with a transfer line",
      detail: "End with a normal mixed-vocabulary line at the same relaxed pace to test whether the repaired keys hold outside focused practice."
    });
  }
  const summary = missedLetters.length
    ? `Start with ${names}, then blend them back into natural words. Protect accuracy first; speed becomes useful after the motion is reliable.`
    : "No blocked letter errors stood out. Keep a relaxed pace and use mixed natural words to preserve the clean pattern.";
  els.adaptiveTechniqueSummary.textContent = summary;
  els.adaptiveTechniqueList.innerHTML = techniqueItems.map(item => `
    <article class="adaptive-technique-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </article>`).join("");
  if (els.adaptiveRepairFocusButton) {
    els.adaptiveRepairFocusButton.classList.toggle("hidden", !suggestedLetters.length);
    els.adaptiveRepairFocusButton.dataset.focusLetters = suggestedLetters.join(",");
    els.adaptiveRepairFocusButton.textContent = suggestedLetters.length
      ? `Focus ${suggestedLetters.join(" / ")}`
      : "Focus repair letters";
  }
}

function renderAdaptiveMissedLetters(result) {
  const missedLetters = adaptiveResultMissedLetters(result);
  const totalErrors = missedLetters.reduce((sum, item) => sum + (Number(item.errors) || 0), 0);
  els.adaptiveMissedSummary.textContent = totalErrors
    ? `${totalErrors} blocked ${totalErrors === 1 ? "miss" : "misses"}`
    : "Clean run";
  if (!missedLetters.length) {
    els.adaptiveMissedLetters.innerHTML = `<div class="adaptive-missed-empty">No letter stood out as a repeated miss.</div>`;
    renderAdaptiveRepairPlan(result, missedLetters);
    return;
  }
  const maxErrors = Math.max(1, ...missedLetters.map(item => Number(item.errors) || 0));
  els.adaptiveMissedLetters.innerHTML = missedLetters.map((item, index) => {
    const errors = Number(item.errors) || 0;
    const accuracy = Math.round(Number(item.accuracy) || 0);
    const barWidth = Math.max(12, (errors / maxErrors) * 100);
    const detail = `${errors} ${errors === 1 ? "miss" : "misses"} · ${accuracy}% accuracy · ${item.finger || "finger zone"}`;
    return `<button type="button" class="adaptive-missed-row" data-letter="${escapeHtml(item.letter)}" title="Open ${escapeHtml(item.letter)} letter details">
      <span class="adaptive-missed-rank">${index + 1}</span>
      <strong>${escapeHtml(item.letter)}</strong>
      <span class="adaptive-missed-bar" aria-hidden="true"><i style="width:${barWidth.toFixed(1)}%"></i></span>
      <span class="adaptive-missed-detail">${escapeHtml(detail)}</span>
    </button>`;
  }).join("");
  renderAdaptiveRepairPlan(result, missedLetters);
}

function suggestedAdaptivePresets(recommendation) {
  const combinations = {
    accuracy: ["accuracy", "weak", "alternation"],
    weak: ["weak", "accuracy", "finger"],
    speed: ["speed", "alternation", "balanced"],
    finger: ["finger", "weak", "speed"],
    alternation: ["alternation", "speed", "balanced"],
    balanced: ["balanced", "weak", "speed"]
  };
  return [...new Set(combinations[recommendation.id] || combinations.balanced)];
}

function adaptiveModeSelection() {
  if (!els.adaptiveModePicker) return [];
  return [...els.adaptiveModePicker.querySelectorAll("input[data-adaptive-mode]:checked")]
    .map(input => input.value)
    .filter(preset => practicePresetStyles.has(preset))
    .slice(0, 3);
}

function adaptiveFocusSelection() {
  if (!els.adaptiveFocusPicker) return [];
  return [...els.adaptiveFocusPicker.querySelectorAll("input[data-adaptive-letter]:checked")]
    .map(input => input.value.toUpperCase())
    .filter(letter => letterOrder.includes(letter))
    .slice(0, 5);
}

function syncAdaptiveModeButton() {
  if (!els.adaptiveRecommendationButton) return;
  const selected = adaptiveModeSelection();
  els.adaptiveRecommendationButton.disabled = !selected.length;
  els.adaptiveRecommendationButton.textContent = selected.length ? "Start selected lesson" : "Select a mode";
}

function renderAdaptiveModePicker(recommendation) {
  if (!els.adaptiveModePicker) return;
  const presets = suggestedAdaptivePresets(recommendation);
  els.adaptiveModePicker.innerHTML = `
    <p>Select one or more focuses. Combined modes shape the next adaptive word mix.</p>
    <div class="adaptive-mode-options">
      ${presets.map((preset, index) => `
        <label class="adaptive-mode-option">
          <input type="checkbox" value="${preset}" data-adaptive-mode${index === 0 ? " checked" : ""}>
          <span>
            <strong>${escapeHtml(practicePresetLabels[preset])}</strong>
            <small>${escapeHtml(practicePresetDescriptions[preset])}</small>
          </span>
        </label>`).join("")}
    </div>`;
  els.adaptiveRecommendationButton.dataset.preset = recommendation.id;
  syncAdaptiveModeButton();
}

function renderAdaptiveFocusPicker(result) {
  if (!els.adaptiveFocusPicker) return;
  const missedLetters = adaptiveResultMissedLetters(result);
  const suggestedLetters = suggestedAdaptiveFocusLetters(result);
  if (!suggestedLetters.length) {
    els.adaptiveFocusPicker.innerHTML = `
      <p>Letter focus</p>
      <div class="adaptive-focus-empty">No repair letters stood out in this lesson. Your current focus will be kept.</div>`;
    els.adaptiveFocusPicker.dataset.hasSuggestions = "false";
    return;
  }
  const details = new Map(missedLetters.map(item => [String(item.letter || "").toUpperCase(), item]));
  els.adaptiveFocusPicker.dataset.hasSuggestions = "true";
  els.adaptiveFocusPicker.innerHTML = `
    <p>Select the repair letters to emphasize next.</p>
    <div class="adaptive-focus-options">
      ${suggestedLetters.map(letter => {
        const item = details.get(letter) || {};
        const errors = Number(item.errors) || 0;
        const accuracy = Number.isFinite(Number(item.accuracy)) ? `${Math.round(Number(item.accuracy))}% accuracy` : "Needs more samples";
        return `<label class="adaptive-focus-option">
          <input type="checkbox" value="${letter}" data-adaptive-letter checked>
          <span><strong>${letter}</strong><small>${errors ? `${errors} ${errors === 1 ? "miss" : "misses"} · ` : ""}${escapeHtml(accuracy)}</small></span>
        </label>`;
      }).join("")}
    </div>`;
}

function renderAdaptiveLessonResult(result) {
  const recommendation = result.recommendation || recommendAdaptiveFocus(progress.adaptiveLessonHistory);
  const rank = Number.isFinite(Number(result.rank))
    ? { rank: Number(result.rank), total: Number(result.total) || 1, percentile: Number(result.percentile) || 1 }
    : rankAdaptiveLesson(result);
  const weakest = result.weakestLetter || "--";
  const strongest = result.strongestLetter || "--";
  els.adaptiveRank.textContent = `Local rank ${rank.rank} of ${rank.total} / top ${rank.percentile}%`;
  els.adaptiveWeakestLetter.textContent = weakest;
  els.adaptiveWeakestDetail.textContent = weakest === "--"
    ? "Not enough letter data"
    : `${Math.round(result.weakestLetterAccuracy || 0)}% accuracy · ${result.weakestFinger}`;
  els.adaptiveStrongestLetter.textContent = strongest;
  els.adaptiveStrongestDetail.textContent = strongest === "--"
    ? "Not enough letter data"
    : `${Math.round(result.strongestLetterAccuracy || 0)}% accuracy · ${result.strongestFinger}`;
  els.adaptiveFastestWpm.textContent = `${Math.round(result.fastestWpm || 0)} WPM`;
  els.adaptiveSlowestWpm.textContent = `${Math.round(result.slowestWpm || 0)} WPM`;
  els.adaptiveErrors.textContent = String(Math.round(result.errors || 0));
  els.adaptiveConsistency.textContent = `${Math.round(result.consistency || 0)}%`;
  renderAdaptiveMissedLetters(result);
  els.adaptiveRecommendationName.textContent = recommendation.label;
  els.adaptiveRecommendationReason.textContent = recommendation.reason;
  renderAdaptiveModePicker(recommendation);
  renderAdaptiveFocusPicker(result);
  renderAdaptiveStatsChart(result);
}

function renderResult() {
  const result = state.result;
  const isAdaptiveLesson = Boolean(result?.adaptiveLesson);
  els.adaptiveResultDetails.classList.toggle("hidden", !isAdaptiveLesson);
  els.resultPanel.classList.toggle("adaptive-results", isAdaptiveLesson);
  if (!result) return;
  els.resultEyebrow.textContent = `${modeCopy()[0]} complete`;
  els.resultTitle.textContent = result.adaptiveLesson
    ? "Ten-line lesson profile"
    : result.mode === "dictation"
      ? "Dictation submitted"
    : result.failedReason || (result.placement ? "Baseline saved" : result.personalBest ? "New personal best" : "Results");
  els.resultScore.textContent = Number(result.score).toLocaleString();
  els.resultWpm.textContent = Math.round(result.wpm);
  els.resultRaw.textContent = Math.round(result.raw);
  els.resultAccuracy.textContent = `${Math.round(result.accuracy)}%`;
  els.resultConsistency.textContent = `${Math.round(result.consistency)}%`;
  els.resultCharacters.textContent = String(result.adaptiveLesson ? result.characters : state.charsTyped);
  els.resultTime.textContent = `${(result.elapsedMs / 1000).toFixed(1)}s`;
  const hasDictationErrors = result.mode === "dictation" && Number.isFinite(Number(result.dictationErrors));
  els.resultDictationErrorsWrap.classList.toggle("hidden", !hasDictationErrors);
  if (hasDictationErrors) els.resultDictationErrors.textContent = String(Math.round(result.dictationErrors));
  const hasDictationFollowRate = result.mode === "dictation" && Number.isFinite(Number(result.dictationFollowRate));
  els.resultFollowRateWrap.classList.toggle("hidden", !hasDictationFollowRate);
  if (hasDictationFollowRate) els.resultFollowRate.textContent = `${Math.round(result.dictationFollowRate)}%`;
  els.resultRestartBtn.textContent = result.mode === "dictation" ? "Next dictation" : "Restart";
  if (result.adaptiveLesson) renderAdaptiveLessonResult(result);
}

function letterMastery(letter) {
  const key = String(letter || "").toLowerCase();
  const stats = progress.letterStats[key] || { attempts: 0, correct: 0 };
  const history = Array.isArray(progress.letterHistory[key]) ? progress.letterHistory[key] : [];
  const accuracy = stats.attempts ? stats.correct / stats.attempts : 0;
  const recentSpeeds = history.slice(-12).map(item => Number(item.wpm)).filter(Number.isFinite);
  const smoothedWpm = recentSpeeds.reduce((value, speed) => value === null ? speed : value * .82 + speed * .18, null) || 0;
  const targetSpeed = Math.max(1, Number(prefs.targetSpeed) || defaultPrefs.targetSpeed);
  const speedConfidence = Math.min(1, smoothedWpm / targetSpeed);
  const accuracyConfidence = Math.max(0, Math.min(1, (accuracy - .75) / .2));
  const evidence = Math.min(1, stats.attempts / masteryRequiredAttempts, history.length / masteryRequiredPages);
  const currentConfidence = Math.max(0, Math.min(1, Math.min(speedConfidence, accuracyConfidence) * evidence));
  const savedBest = Number(stats.bestConfidence) || 0;
  const bestConfidence = Math.max(savedBest, currentConfidence);
  const score = prefs.recoverKeys ? currentConfidence : bestConfidence;
  // Keep the visible tile responsive to all recorded practice, even before a
  // completed-page sample is available for the stricter mastery calculation.
  const attemptProgress = Math.min(1, (Number(stats.attempts) || 0) / masteryRequiredAttempts);
  const pageProgress = Math.min(1, history.length / masteryRequiredPages);
  const evidenceProgress = Math.max(attemptProgress, pageProgress);
  const visualScore = evidenceProgress
    ? recentSpeeds.length
      ? speedConfidence * (.35 + Math.max(0, Math.min(1, accuracy)) * .65)
      : Math.max(score, evidenceProgress * (.35 + Math.max(0, Math.min(1, accuracy)) * .65))
    : 0;
  return {
    score,
    percent: Math.round(score * 100),
    visualScore: Math.max(0, Math.min(1, visualScore)),
    visualPercent: Math.round(Math.max(0, Math.min(1, visualScore)) * 100),
    targetSpeed,
    targetProgress: Math.max(0, Math.min(1, speedConfidence)),
    currentConfidence,
    bestConfidence,
    smoothedWpm,
    accuracy,
    pages: history.length,
    attempts: Number(stats.attempts) || 0,
    pagesRemaining: Math.max(0, masteryRequiredPages - history.length),
    attemptsRemaining: Math.max(0, masteryRequiredAttempts - (Number(stats.attempts) || 0))
  };
}

function adaptiveFocusLetter() {
  const earned = letterOrder.slice(0, Number(prefs.practiceLetters));
  const belowTarget = earned.filter(letter => letterMastery(letter).score < .98);
  if (!belowTarget.length) return earned.at(-1) || letterOrder[0];
  const due = belowTarget.filter(letter => {
    const stats = progress.letterStats[letter.toLowerCase()] || {};
    return !Number(stats.reviewDueAt) || Number(stats.reviewDueAt) <= Date.now();
  });
  const candidates = due.length ? due : belowTarget;
  return candidates.sort((a, b) => {
    const aMastery = letterMastery(a);
    const bMastery = letterMastery(b);
    return aMastery.score - bMastery.score || aMastery.attempts - bMastery.attempts;
  })[0];
}

function selectedAdaptiveFocusLetters() {
  const earned = new Set(letterOrder.slice(0, Number(prefs.practiceLetters)));
  return [...new Set((Array.isArray(prefs.focusLetters) ? prefs.focusLetters : []).map(letter => String(letter).toUpperCase()))]
    .filter(letter => earned.has(letter))
    .slice(0, 5);
}

function selectedAdaptivePracticePresets() {
  const selected = Array.isArray(prefs.practicePresets) ? prefs.practicePresets : [prefs.practicePreset];
  const valid = [...new Set(selected.filter(preset => practicePresetStyles.has(preset)))].slice(0, 3);
  return valid.length ? valid : [defaultPrefs.practicePreset];
}

function adaptiveFocusLabel() {
  const selected = selectedAdaptiveFocusLetters();
  return selected.length ? selected.join(" / ") : adaptiveFocusLetter();
}

function canUnlockNextLetter() {
  if (Number(prefs.practiceLetters) >= letterOrder.length) return false;
  const earned = letterOrder.slice(0, Number(prefs.practiceLetters));
  if (prefs.recoverKeys) return earned.every(letter => letterMastery(letter).currentConfidence >= .98);
  return earned.every(letter => letterMastery(letter).bestConfidence >= .98);
}

function shuffle(items) {
  const output = items.slice();
  for (let index = output.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function allowedSet() {
  return new Set(letterOrder.slice(0, prefs.practiceLetters).map(x => x.toLowerCase()));
}

function handForLetter(letter) {
  return "qwertasdfgzxcvb".includes(String(letter).toLowerCase()) ? "left" : "right";
}

function handWeight(word, hand) {
  const letters = [...String(word || "").toLowerCase()].filter(letter => /^[a-z]$/.test(letter));
  if (!letters.length) return 0;
  const matches = letters.filter(letter => handForLetter(letter) === hand).length;
  return matches / letters.length;
}

function fingerBand(letter) {
  const zone = fingerZone(String(letter || "").toLowerCase()).label.toLowerCase();
  if (zone.includes("pinky") || zone.includes("ring")) return "outer";
  if (zone.includes("index") || zone.includes("middle")) return "inner";
  return "neutral";
}

function keyMatchesWorkoutPhase(keyId, phase = zoneWorkoutPhase()) {
  if (state.mode !== "adaptive" || !selectedAdaptivePracticePresets().includes("workout")) return false;
  const label = fingerZone(String(keyId || "").toLowerCase()).label.toLowerCase();
  if (phase.id === "left") return label.startsWith("left ");
  if (phase.id === "right") return label.startsWith("right ");
  if (phase.id === "inner") return label.includes("index") || label.includes("middle");
  if (phase.id === "outer") return label.includes("ring") || label.includes("pinky");
  return false;
}

function fingerBandWeight(word, band) {
  const letters = [...String(word || "").toLowerCase()].filter(letter => /^[a-z]$/.test(letter));
  if (!letters.length) return 0;
  const matches = letters.filter(letter => fingerBand(letter) === band).length;
  return matches / letters.length;
}

function zoneWorkoutPhase(rowNumber = state.rowIndex) {
  const block = Math.floor(Math.max(0, rowNumber) / 5) % 4;
  return [
    { id: "left", label: "Left-hand heavy", description: "Five lines weighted heavily toward left-hand keys without banning natural crossing letters.", type: "hand", value: "left" },
    { id: "right", label: "Right-hand heavy", description: "Five lines weighted heavily toward right-hand keys without banning natural crossing letters.", type: "hand", value: "right" },
    { id: "inner", label: "Inside-finger heavy", description: "Five lines weighted heavily toward index and middle fingers.", type: "band", value: "inner" },
    { id: "outer", label: "Outside-finger heavy", description: "Five lines weighted heavily toward ring and pinky fingers.", type: "band", value: "outer" }
  ][block];
}

function alternatingWord(word) {
  const letters = [...word.toLowerCase()].filter(letter => /^[a-z]$/.test(letter));
  if (letters.length < 4) return false;
  let changes = 0;
  for (let index = 1; index < letters.length; index++) {
    if (handForLetter(letters[index]) !== handForLetter(letters[index - 1])) changes++;
  }
  return changes / Math.max(1, letters.length - 1) >= .58;
}

function adaptiveRecoveryActive() {
  return progress.lessonHistory.length > 0 && Number(progress.avgAccuracy) < 88;
}

function wordDeck() {
  const unlocked = allowedSet();
  const selectedFocusLetters = selectedAdaptiveFocusLetters().map(letter => letter.toLowerCase());
  const focusLetters = selectedFocusLetters.length ? selectedFocusLetters : [adaptiveFocusLetter().toLowerCase()];
  const isAllowed = word => [...word.toLowerCase()].every(ch => !/[a-z]/.test(ch) || unlocked.has(ch));
  const allNatural = [...new Set(commonWords.concat(expandedWords, moderateWords, rareWords, dictionaryExtra, rareLetterFocusPool))].filter(isAllowed);
  const broadCommon = prefs.naturalWords
    ? commonWords.concat(expandedWords.filter(w => w.length <= 8), dictionaryExtra.filter(w => w.length <= 6))
    : commonWords.concat(expandedWords, moderateWords, dictionaryExtra);
  const common = shuffle([...new Set(broadCommon.filter(isAllowed))]);
  const moderate = shuffle([...new Set(moderateWords.concat(expandedWords.filter(w => w.length >= 6 && w.length <= 11), dictionaryExtra.filter(w => w.length >= 6 && w.length <= 9)).filter(isAllowed))]);
  const rare = shuffle([...new Set(rareWords.concat(expandedWords.filter(w => w.length >= 12), dictionaryExtra.filter(w => w.length >= 9)).filter(isAllowed))]);
  const rareFocus = shuffle([...new Set(rareLetterFocusPool.filter(isAllowed))]);
  const focusScore = word => focusLetters.reduce((score, letter) => score + [...word].filter(character => character === letter).length, 0);
  const focus = shuffle(allNatural.filter(word => focusScore(word) > 0))
    .sort((a, b) => focusScore(b) - focusScore(a));
  const weakLetters = weakestPracticeLetters();
  const weak = shuffle(allNatural.filter(word => weakLetters.some(letter => word.includes(letter))));
  const finger = shuffle(allNatural.filter(word => weakLetters.some(letter => {
    const zone = fingerZone(letter).label;
    return [...word].some(candidate => /^[a-z]$/i.test(candidate) && fingerZone(candidate).label === zone);
  })));
  const alternating = shuffle(allNatural.filter(alternatingWord));
  const leftHand = shuffle(allNatural.filter(word => handWeight(word, "left") >= .64));
  const rightHand = shuffle(allNatural.filter(word => handWeight(word, "right") >= .64));
  const outerFinger = shuffle(allNatural.filter(word => fingerBandWeight(word, "outer") >= .42));
  const innerFinger = shuffle(allNatural.filter(word => fingerBandWeight(word, "inner") >= .58));
  const workout = {
    left: shuffle(allNatural.filter(word => handWeight(word, "left") >= .76)),
    right: shuffle(allNatural.filter(word => handWeight(word, "right") >= .76)),
    inner: shuffle(allNatural.filter(word => fingerBandWeight(word, "inner") >= .72)),
    outer: shuffle(allNatural.filter(word => fingerBandWeight(word, "outer") >= .58))
  };
  return {
    common, moderate, rare, rareFocus, focus, weak, finger, alternating,
    leftHand, rightHand, outerFinger, innerFinger, workout,
    focusLetter: focusLetters[0], focusLetters: selectedFocusLetters
  };
}

function adaptiveFlowPhase(rowNumber = state.rowIndex) {
  const block = Math.floor(Math.max(0, rowNumber) / 5) % 4;
  return [
    { hand: "left", band: "outer", label: "left outer" },
    { hand: "left", band: "inner", label: "left inner" },
    { hand: "right", band: "outer", label: "right outer" },
    { hand: "right", band: "inner", label: "right inner" }
  ][block];
}

function visibleWordsPerRow(minimum = 2) {
  const requested = Math.max(minimum, Number(prefs.wordsPerRow) || 10);
  const density = state.mode === "adaptive"
    ? { small: 1, medium: .72, large: .58, xlarge: .44 }[prefs.fontSize] || 1
    : { small: 1, medium: .8, large: .65, xlarge: .55 }[prefs.fontSize] || 1;
  const viewport = window.innerWidth || 1200;
  const viewportCap = viewport <= 620
    ? { small: 8, medium: 4, large: 3, xlarge: 2 }[prefs.fontSize]
    : viewport <= 900
      ? { small: 10, medium: 8, large: 5, xlarge: 5 }[prefs.fontSize]
      : Infinity;
  return Math.max(minimum, Math.min(requested, Math.round(requested * density), viewportCap || Infinity));
}

function lessonPageCount() {
  return Math.max(1, Math.min(100, Math.round(Number(prefs.lessonLengthPages) || 1)));
}

function lessonLineLimit() {
  return lessonPageCount() * rowsPerPage;
}

function lessonWordTarget() {
  return lessonLineLimit() * visibleWordsPerRow();
}

function adaptiveRowCharacterBudget() {
  const viewport = window.innerWidth || 1200;
  const base = { small: 72, medium: 56, large: 44, xlarge: 36 }[prefs.fontSize] || 56;
  const viewportAdjustment = viewport <= 620 ? .62 : viewport <= 900 ? .78 : 1;
  return Math.max(18, Math.round(base * viewportAdjustment));
}

function pickWordForRow(list, index, currentWords, budget, fallbackList = []) {
  const candidates = [...new Set([...(list || []), ...(fallbackList || [])])].filter(Boolean);
  if (!candidates.length) return "practice";
  const used = currentWords.join(" ");
  const usedLength = used.length;
  const remaining = Math.max(1, budget - usedLength - (currentWords.length ? 1 : 0));
  const start = Math.max(0, index % candidates.length);
  for (let offset = 0; offset < candidates.length; offset++) {
    const word = candidates[(start + offset) % candidates.length];
    if (word.length <= remaining) return word;
  }
  const shortest = candidates.slice().sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
  return currentWords.length && shortest.length > remaining ? "" : shortest;
}

function makeAdaptiveRows(rowCount = rowsPerPage * 2) {
  const deck = wordDeck();
  const rows = [];
  const wordsPerRow = visibleWordsPerRow();
  const rowBudget = adaptiveRowCharacterBudget();
  let ci = 0, mi = 0, ri = 0, fi = 0, rfi = 0;
  let wi = 0;
  const recoveryMode = adaptiveRecoveryActive();
  const selectedPresets = selectedAdaptivePracticePresets();
  const activePresets = recoveryMode && !selectedPresets.includes("workout") ? ["accuracy"] : selectedPresets;
  const presetPools = activePresets.map(preset => ({
    preset,
    words: {
      weak: deck.weak,
      accuracy: deck.weak,
      finger: deck.finger,
      alternation: deck.alternating,
      speed: deck.moderate,
      workout: []
    }[preset] || []
  })).filter(item => item.words.length);
  const presetPool = shuffle([...new Set(presetPools.flatMap(item => item.words))]);
  const readiness = Math.min(1, progress.lessonHistory.length / 8) * Math.min(1, (Number(progress.avgAccuracy) || 0) / 94);
  const moderateInterval = recoveryMode ? Number.MAX_SAFE_INTEGER : readiness > .7 ? 10 : 20;
  const rareInterval = recoveryMode ? Number.MAX_SAFE_INTEGER : readiness > .88 ? 50 : 100;
  const explicitFocus = deck.focusLetters.length > 0;
  const workoutActive = activePresets.includes("workout");
  for (let r = 0; r < rowCount; r++) {
    const words = [];
    const phase = adaptiveFlowPhase(state.rowIndex + r);
    const workoutPhase = zoneWorkoutPhase(state.rowIndex + r);
    const handPool = phase.hand === "left" ? deck.leftHand : deck.rightHand;
    const bandPool = phase.band === "outer" ? deck.outerFinger : deck.innerFinger;
    const phasePool = shuffle([...new Set([...handPool, ...bandPool])]);
    const workoutStrictPool = workoutActive ? deck.workout[workoutPhase.id] || [] : [];
    const workoutFallbackPool = workoutActive
      ? workoutPhase.type === "hand"
        ? workoutPhase.value === "left" ? deck.leftHand : deck.rightHand
        : workoutPhase.value === "inner" ? deck.innerFinger : deck.outerFinger
      : [];
    const workoutPool = workoutActive ? shuffle([...new Set([...workoutStrictPool, ...workoutFallbackPool])]) : [];
    for (let i = 0; i < wordsPerRow; i++) {
      const pos = r * wordsPerRow + i + 1;
      let list = deck.common;
      let index = ci++;
      if (workoutActive && workoutPool.length && pos % 6 !== 0) { list = workoutPool; index = wi++; }
      else if (explicitFocus && deck.focus.length && pos % 5 !== 0) { list = deck.focus; index = fi++; }
      else if (phasePool.length && pos % 4 !== 1) { list = phasePool; index = wi++; }
      else if (presetPool.length && pos % 2 === 0) { list = presetPool; index = wi++; }
      else if (pos % 3 === 0 && deck.focus.length) { list = deck.focus; index = fi++; }
      else if (pos % 11 === 0 && deck.rareFocus.length) { list = deck.rareFocus; index = rfi++; }
      else if (pos % rareInterval === 0 && deck.rare.length) { list = deck.rare; index = ri++; }
      else if (pos % moderateInterval === 0 && deck.moderate.length) { list = deck.moderate; index = mi++; }
      if (!list.length) list = deck.common.length ? deck.common : deck.focus.length ? deck.focus : ["a", "an", "in", "is", "it"];
      const word = pickWordForRow(list, index, words, rowBudget, deck.common);
      if (!word) break;
      words.push(word);
    }
    rows.push(transformText(words.join(" ")));
  }
  return rows;
}

function makePlacementRows(rowCount = lessonLineLimit()) {
  const pool = shuffle([...new Set(commonWords.concat(expandedWords, moderateWords, dictionaryExtra))]);
  const words = Array.from({ length: rowCount * visibleWordsPerRow() }, (_, index) => {
    if ((index + 1) % 7 === 0 && rareLetterFocusPool.length) return rareLetterFocusPool[index % rareLetterFocusPool.length];
    return pool[index % Math.max(1, pool.length)] || "practice";
  });
  const size = visibleWordsPerRow();
  const rows = [];
  for (let index = 0; index < words.length; index += size) rows.push(transformText(words.slice(index, index + size).join(" ")));
  return rows;
}

function testWordPool() {
  if (prefs.difficulty === "master") return commonWords.concat(expandedWords, moderateWords, rareWords, dictionaryExtra);
  if (prefs.difficulty === "expert") return commonWords.concat(expandedWords, moderateWords, dictionaryExtra);
  return commonWords.concat(expandedWords.filter(word => word.length <= 10), dictionaryExtra.filter(word => word.length <= 8));
}

function decorateTestWords(words) {
  const output = words.slice();
  if (prefs.britishEnglish) {
    const british = { color: "colour", favor: "favour", favorite: "favourite", honor: "honour", center: "centre", theater: "theatre", organize: "organise", recognize: "recognise" };
    output.forEach((word, index) => { output[index] = british[word] || word; });
  }
  if (prefs.includeNumbers) {
    for (let index = 8; index < output.length; index += 11) {
      output[index] = String(10 + Math.floor(Math.random() * 990));
    }
  }
  if (prefs.includePunctuation) {
    for (let index = 0; index < output.length; index++) {
      if (index % 10 === 0 && /^[a-z]/.test(output[index])) {
        output[index] = output[index][0].toUpperCase() + output[index].slice(1);
      }
      if (index % 10 === 9 || index === output.length - 1) output[index] += index % 20 === 19 ? "?" : ".";
      else if (index % 10 === 5) output[index] += ",";
    }
  }
  return output;
}

function makeTestWords(count) {
  const pool = shuffle(testWordPool());
  const focus = shuffle(rareLetterFocusPool);
  let focusIndex = 0;
  const words = Array.from({ length: count }, (_, index) => {
    if ((index + 1) % 5 === 0 && focus.length) return focus[focusIndex++ % focus.length];
    return pool[index % pool.length] || "practice";
  });
  return decorateTestWords(words);
}

function makeWordSections(count = lessonWordTarget()) {
  const words = makeTestWords(count);
  const sections = [];
  const size = visibleWordsPerRow();
  for (let index = 0; index < words.length; index += size) {
    sections.push(transformText(words.slice(index, index + size).join(" ")));
  }
  return sections.length ? sections : ["practice"];
}

function makeZenParagraph(wordCount = lessonWordTarget()) {
  const words = makeTestWords(wordCount).map(word => word.toLowerCase());
  const sentences = [];
  let index = 0;
  while (index < words.length) {
    const length = 9 + Math.floor(Math.random() * 8);
    const slice = words.slice(index, index + length);
    if (!slice.length) break;
    slice[0] = slice[0][0].toUpperCase() + slice[0].slice(1);
    sentences.push(`${slice.join(" ")}.`);
    index += length;
  }
  return transformText(sentences.join(" "));
}

function ensureZenTargetBuffer() {
  if (state.mode !== "zen") return;
  const current = state.targetRows[0] || "";
  if (!current) {
    state.targetRows = [makeZenParagraph()];
  }
}

function weakestPracticeLetters() {
  return letterOrder
    .slice(0, Number(prefs.practiceLetters))
    .map(letter => letter.toLowerCase())
    .sort((a, b) => {
      const aStats = progress.letterStats[a] || { attempts: 0, correct: 0 };
      const bStats = progress.letterStats[b] || { attempts: 0, correct: 0 };
      const aAccuracy = aStats.attempts ? aStats.correct / aStats.attempts : 0;
      const bAccuracy = bStats.attempts ? bStats.correct / bStats.attempts : 0;
      const aErrors = Number(aStats.errors) || 0;
      const bErrors = Number(bStats.errors) || 0;
      const aMastery = letterMastery(a).score;
      const bMastery = letterMastery(b).score;
      return bErrors - aErrors || aMastery - bMastery || aAccuracy - bAccuracy || aStats.attempts - bStats.attempts;
    })
    .slice(0, 4);
}

function makeWeakspotWords(count) {
  const focusLetters = [...new Set([...weakestPracticeLetters(), "q", "z", "x", "v"])];
  const allWords = [...new Set(testWordPool().concat(rareLetterFocusPool))];
  const focused = shuffle(allWords.filter(word => focusLetters.some(letter => word.includes(letter))));
  const general = shuffle(allWords);
  return Array.from({ length: count }, (_, index) => {
    if (focused.length && index % 5 !== 4) return focused[index % focused.length];
    return general[index % general.length] || "practice";
  });
}

function randomPrintableAscii() {
  const length = 1 + Math.floor(Math.random() * 10);
  return Array.from({ length }, () => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join("");
}

function randomGibberish() {
  const starts = ["br", "cl", "dr", "fl", "gr", "pl", "qu", "sh", "st", "tr", "v", "z"];
  const middles = ["a", "e", "i", "o", "u", "ae", "ou"];
  const ends = ["n", "r", "s", "t", "ck", "nd", "sh", "ve", "x", "z"];
  return `${starts[Math.floor(Math.random() * starts.length)]}${middles[Math.floor(Math.random() * middles.length)]}${ends[Math.floor(Math.random() * ends.length)]}`;
}

function randomSpecials() {
  const characters = "!@#$%^&*()-_=+[]{};:'\",.<>/?\\|`~";
  const length = 2 + Math.floor(Math.random() * 6);
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
}

function randomIPv4() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
}

function randomIPv6() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 65536).toString(16).padStart(4, "0")).join(":");
}

function rot13(text) {
  return text.replace(/[a-z]/gi, letter => {
    const base = letter <= "Z" ? 65 : 97;
    return String.fromCharCode(base + (letter.charCodeAt(0) - base + 13) % 26);
  });
}

function toMorse(text) {
  return text.toLowerCase().split(" ").map(word => [...word].map(letter => morseAlphabet[letter] || "").filter(Boolean).join("/")).join(" // ");
}

function makeCreativeWords(count) {
  const mode = prefs.creativeMode;
  if (mode === "weakspot") return makeWeakspotWords(count);
  if (mode === "58008") return Array.from({ length: count }, () => String(Math.floor(100 + Math.random() * 999999)));
  if (mode === "gibberish" || mode === "pseudolang") return Array.from({ length: count }, randomGibberish);
  if (mode === "ascii") return Array.from({ length: count }, randomPrintableAscii);
  if (mode === "specials") return Array.from({ length: count }, randomSpecials);
  if (mode === "arrows") return Array.from({ length: count }, () => ["↑", "↓", "←", "→"][Math.floor(Math.random() * 4)]);
  if (mode === "IPv4") return Array.from({ length: count }, randomIPv4);
  if (mode === "IPv6") return Array.from({ length: count }, randomIPv6);
  if (mode === "binary") return Array.from({ length: count }, () => Math.floor(Math.random() * 256).toString(2).padStart(8, "0"));
  if (mode === "hexadecimal") return Array.from({ length: count }, () => `0x${Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()}`);
  if (mode === "polyglot") return Array.from({ length: count }, (_, index) => polyglotWords[index % polyglotWords.length]);
  if (mode === "asl") return Array.from({ length: count }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  if (mode === "poetry") return shuffle(poetryPassages)[0].split(/\s+/).slice(0, count);
  if (mode === "wikipedia") return shuffle(encyclopediaPassages)[0].split(/\s+/).slice(0, count);
  const pool = shuffle(testWordPool());
  let words = Array.from({ length: count }, (_, index) => {
    if (mode === "zipf") {
      const weightedIndex = Math.floor(Math.pow(Math.random(), 2.7) * Math.max(1, commonWords.length));
      return commonWords[weightedIndex] || "practice";
    }
    return pool[index % pool.length] || "practice";
  });
  if (mode === "backwards") return words.map(word => [...word].reverse().join(""));
  if (mode === "ddoouubblleedd") return words.map(word => [...word].map(letter => letter + letter).join(""));
  if (mode === "rAnDoMcAsE") {
    return words.map(word => [...word].map(letter => Math.random() < .5 ? letter.toUpperCase() : letter.toLowerCase()).join(""));
  }
  if (mode === "sPoNgEcAsE") return words.map((word, wordIndex) => [...word].map((letter, index) => (index + wordIndex) % 2 ? letter.toUpperCase() : letter.toLowerCase()).join(""));
  if (mode === "capitals") return words.map(word => word[0].toUpperCase() + word.slice(1));
  if (mode === "instant_messaging") return words.map(word => word.toLowerCase());
  if (mode === "ALL_CAPS") return words.map(word => word.toUpperCase());
  if (mode === "rot13") return words.map(rot13);
  if (mode === "morse") return toMorse(words.slice(0, Math.min(words.length, 8)).join(" ")).split(" ");
  return words;
}

function makeCreativeSections(count = lessonWordTarget()) {
  if (prefs.creativeMode === "tts") {
    const sentences = shuffle(dictationSentenceBank);
    const sectionCount = Math.max(1, lessonLineLimit(), Math.ceil(Number(count) / Math.max(6, visibleWordsPerRow())));
    return Array.from({ length: sectionCount }, (_, index) => transformText(sentences[index % sentences.length]));
  }
  const words = makeCreativeWords(count);
  const sections = [];
  const size = visibleWordsPerRow();
  for (let index = 0; index < words.length; index += size) {
    let text = words.slice(index, index + size).join(" ");
    if (prefs.creativeMode === "nospace") text = text.replaceAll(" ", "");
    if (prefs.creativeMode === "underscore_spaces") text = text.replaceAll(" ", "_");
    sections.push(text);
  }
  return sections.length ? sections : ["practice"];
}

function makeTimedRows(rowCount = lessonLineLimit()) {
  const words = makeTestWords(rowCount * visibleWordsPerRow());
  const size = visibleWordsPerRow();
  const rows = [];
  for (let index = 0; index < words.length; index += size) {
    rows.push(transformText(words.slice(index, index + size).join(" ")));
  }
  return rows;
}

async function makeDictationRows(count = lessonLineLimit()) {
  let passages = [];
  try {
    passages = makeBibleQuotePages(await loadKJV()).map(([, text]) => text).filter(Boolean);
  } catch (error) {
    console.warn("Scripture prompts could not be loaded; using the local fallback bank.", error);
  }
  const sentences = shuffle(passages.length ? passages : dictationSentenceBank);
  return Array.from({ length: Math.max(1, Number(count) || 1) }, (_, index) => {
    return transformText(sentences[index % sentences.length] || "Practice with patience and care.");
  });
}

function quoteForLength() {
  const ranges = {
    short: [0, 11],
    medium: [12, 20],
    long: [21, 32],
    epic: [33, Infinity]
  };
  const [min, max] = ranges[prefs.quoteLength] || ranges.medium;
  const matches = generalQuotes.filter(([, text]) => {
    const count = text.split(/\s+/).length;
    return count >= min && count <= max;
  });
  return shuffle(matches.length ? matches : generalQuotes)[0];
}

async function bibleQuoteForLength() {
  const pages = makeBibleQuotePages(await loadKJV());
  const ranges = {
    short: [0, 11],
    medium: [12, 20],
    long: [21, 32],
    epic: [33, Infinity]
  };
  const [min, max] = ranges[prefs.quoteLength] || ranges.medium;
  const matches = pages.filter(([, text]) => {
    const count = text.split(/\s+/).length;
    return count >= min && count <= max;
  });
  return shuffle(matches.length ? matches : pages)[0] || ["John 3:16 KJV", "For God so loved the world, that he gave his only begotten Son."];
}

async function makeBibleQuoteLessonPages() {
  const pages = makeBibleQuotePages(await loadKJV());
  const ranges = {
    short: [0, 11],
    medium: [12, 20],
    long: [21, 32],
    epic: [33, Infinity]
  };
  const [min, max] = ranges[prefs.quoteLength] || ranges.medium;
  const matches = pages.filter(([, text]) => {
    const count = text.split(/\s+/).length;
    return count >= min && count <= max;
  });
  return (matches.length ? matches : pages).slice(0, lessonPageCount());
}

function transformText(text) {
  let out = text.replace(/\s+/g, " ").trim();
  if (prefs.lazyMode) out = out.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!prefs.includePunctuation) out = out.replace(/[^\w\s]/g, "");
  if (prefs.capitalization === "lower") out = out.toLowerCase().replace(/\bgod\b/gi, "God");
  if (prefs.capitalization === "words") out = out.split(" ").map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(" ").replace(/\bgod\b/gi, "God");
  if (prefs.capitalization === "sentences") out = out.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase()).replace(/\bgod\b/gi, "God");
  return out.replace(/\bgod\b/gi, "God");
}

async function loadKJV() {
  if (state.kjv) return state.kjv;
  kjvPromise ||= fetch("assets/kjv-verses-1769.json").then(response => {
    if (!response.ok) throw new Error(`Unable to load KJV text (${response.status})`);
    return response.json();
  });
  state.kjv = await kjvPromise;
  return state.kjv;
}

function bibleDataBook(book) {
  return { Psalm: "Psalms", "Song of Solomon": "Solomon's Song" }[book] || book;
}

function makeBibleQuotePages(data) {
  const pages = shuffle(kjvQuoteReferences).map(([book, chapter, start, end = start]) => {
    const dataBook = bibleDataBook(book);
    const verses = [];
    for (let verse = start; verse <= end; verse++) {
      const text = data[`${dataBook} ${chapter}:${verse}`];
      if (text) verses.push(cleanVerse(text));
    }
    const verseLabel = start === end ? start : `${start}-${end}`;
    return [`${book} ${chapter}:${verseLabel} KJV`, verses.join(" ")];
  }).filter(([, text]) => text);
  return pages.length ? pages : [["John 3:16 KJV", cleanVerse(data["John 3:16"] || "For God so loved the world.")]];
}

async function makeBiblePages() {
  const data = await loadKJV();
  const pages = [];
  const dataBook = bibleDataBook(prefs.bibleBook);
  for (let v = Number(prefs.bibleStart); v <= Number(prefs.bibleEnd); v++) {
    const key = `${dataBook} ${prefs.bibleChapter}:${v}`;
    if (data[key]) pages.push([`${prefs.bibleBook} ${prefs.bibleChapter}:${v} KJV`, cleanVerse(data[key])]);
  }
  return pages.length ? pages : [["John 3:16 KJV", cleanVerse(data["John 3:16"] || "For God so loved the world, that he gave his only begotten Son.")]];
}

function cleanVerse(text) {
  return text.replace(/[#\[\]]/g, "").replace(/\s+/g, " ").trim();
}

function clearTestTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
  state.deadline = null;
}

async function restart() {
  const requestId = ++restartRequestId;
  const wasTyping = !!state.startedAt && !state.testCompleted;
  clearTestTimer();
  clearTimeout(memoryTimer);
  window.speechSynthesis?.cancel();
  spokenReminderManager.resetSession();
  stopRewardSound();
  state.input = "";
  state.rowIndex = 0;
  state.pageIndex = 0;
  state.startedAt = null;
  state.charsTyped = 0;
  state.rawTyped = 0;
  state.errors = 0;
  state.lineErrors = 0;
  state.characterErrors = 0;
  state.lessonLetterStats = {};
  state.lessonErrorLetters = {};
  state.lineLetterStats = {};
  state.lineStartedAt = null;
  state.lineCharsTyped = 0;
  state.lineRawTyped = 0;
  state.lineKeyIntervals = [];
  state.lineLastKeyAt = null;
  state.lineLastAcceptedAt = null;
  state.adaptiveLessonLines = [];
  state.adaptiveLessonPages = [];
  state.lastAcceptedAt = null;
  state.lastActivityAt = null;
  state.lastKeyAt = null;
  state.keyIntervals = [];
  state.timeRemaining = Number(prefs.testDuration);
  state.warningPlayed = false;
  state.testCompleted = false;
  state.result = null;
  state.completion = false;
  state.memoryVisible = true;
  state.lastRestReminder = 0;
  state.techniqueMessageUntil = 0;
  state.postureReminderRow = -1;
  state.postureReminderNextRow = 3 + Math.floor(Math.random() * 3);
  state.postureReminderAtWord = 3;
  state.postureReminder = null;
  state.postureReminderLastIndex = -1;
  state.practiceFontSize = null;
  state.practiceFitSignature = "";
  if (state.practiceFitRaf) {
    cancelAnimationFrame(state.practiceFitRaf);
    state.practiceFitRaf = 0;
  }
  state.dictationAudioBlob = null;
  state.dictationAudioStatus = "idle";
  state.dictationPromptHeard = false;
  state.dictationBrowserFallback = false;
  state.dictationPromptId++;
  state.dictationPromptStartedAt = null;
  state.dictationPromptEndedAt = null;
  state.dictationPromptDurationMs = 0;
  state.dictationTypedDuringPrompt = 0;
  state.dictationCorrectDuringPrompt = 0;
  state.dictationPromptRecorded = false;
  state.dictationFollowSamples = [];
  stopReminderSound();
  els.completionBanner.classList.add("hidden");
  if (state.mode === "adaptive") {
    state.targetRows = makeAdaptiveRows(rowsPerPage * 2);
    state.scripturePages = [];
  } else if (state.mode === "time") {
    state.targetRows = makeTimedRows(lessonLineLimit());
    state.scripturePages = [];
  } else if (state.mode === "words") {
    state.targetRows = makeWordSections(lessonWordTarget());
    state.scripturePages = [];
  } else if (state.mode === "creative") {
    state.targetRows = makeCreativeSections(lessonWordTarget());
    state.scripturePages = [];
  } else if (state.mode === "placement") {
    state.targetRows = makePlacementRows(lessonLineLimit());
    state.scripturePages = [];
  } else if (state.mode === "dictation") {
    state.targetRows = await makeDictationRows(lessonLineLimit());
    if (requestId !== restartRequestId) return;
    state.scripturePages = [];
  } else if (state.mode === "quote") {
    const shouldRepeat = prefs.repeatQuotes === "always" || (prefs.repeatQuotes === "typing" && wasTyping);
    const quotePages = shouldRepeat && state.lastQuote
      ? [state.lastQuote]
      : await makeBibleQuoteLessonPages();
    if (requestId !== restartRequestId) return;
    state.lastQuote = quotePages[0] || null;
    state.scripturePages = quotePages.map(([ref, text]) => [ref, transformText(text)]);
    state.targetRows = [];
  } else if (state.mode === "bibleQuotes") {
    const pages = await makeBibleQuoteLessonPages();
    if (requestId !== restartRequestId) return;
    state.scripturePages = pages;
    state.targetRows = [];
  } else if (state.mode === "bible") {
    const pages = await makeBiblePages();
    if (requestId !== restartRequestId) return;
    state.scripturePages = pages.slice(0, lessonPageCount());
    state.targetRows = [];
  } else if (state.mode === "zen") {
    state.targetRows = [makeZenParagraph(lessonWordTarget())];
    state.scripturePages = [];
  } else {
    state.targetRows = [""];
    state.scripturePages = [];
  }
  prefs.mode = state.mode;
  scheduleSave();
  render();
  prepareCreativeLine();
  if (state.mode === "dictation") prepareDictationPrompt(requestId);
}

function currentTarget() {
  if (["bible", "bibleQuotes", "quote"].includes(state.mode)) return state.scripturePages[state.pageIndex]?.[1] || "";
  if (state.mode === "zen") {
    ensureZenTargetBuffer();
    return state.targetRows[0] || "";
  }
  return state.targetRows[state.rowIndex] || "";
}

function isListenCloselyMode() {
  return state.mode === "creative" && prefs.creativeMode === "tts";
}

function usesDictationTypingRules() {
  return state.mode === "dictation" || isListenCloselyMode();
}

function currentTypingTarget() {
  const target = currentTarget();
  if (!usesDictationTypingRules()) return target;
  let typingTarget = target;
  if (prefs.dictationPunctuation === "ignore") typingTarget = typingTarget.replace(/[^\w\s]/g, "");
  if (prefs.dictationCapitalization === "ignore") typingTarget = typingTarget.toLowerCase();
  return typingTarget;
}

function currentReference() {
  if (["bible", "bibleQuotes", "quote"].includes(state.mode)) return state.scripturePages[state.pageIndex]?.[0] || "";
  return "";
}

async function speakCurrentTarget() {
  const text = currentTarget();
  if (!text) return;
  unlockAudio();
  spokenReminderManager.stop();
  window.speechSynthesis?.cancel();
  try {
    await spokenReminderManager.synthesizeAndPlay(text, { scope: "creative", rate: .9 });
  } catch (error) {
    if (error?.name !== "AbortError") console.warn("Creative listening prompt could not play.", error);
  }
}

function prepareCreativeLine() {
  if (state.mode !== "creative") return;
  clearTimeout(memoryTimer);
  if (prefs.creativeMode === "memory") {
    state.memoryVisible = true;
    applyDisplayPreferences();
    memoryTimer = setTimeout(() => {
      state.memoryVisible = false;
      renderText();
      applyDisplayPreferences();
    }, 2600);
  }
  if (["tts", "simon_says"].includes(prefs.creativeMode)) setTimeout(speakCurrentTarget, 40);
}

async function prepareDictationPrompt(requestId = restartRequestId) {
  if (state.mode !== "dictation" || state.testCompleted) return;
  const promptId = ++state.dictationPromptId;
  state.dictationAudioBlob = null;
  state.dictationAudioStatus = "loading";
  state.dictationPromptHeard = false;
  state.dictationPromptStartedAt = null;
  state.dictationPromptEndedAt = null;
  state.dictationPromptDurationMs = 0;
  state.dictationTypedDuringPrompt = 0;
  state.dictationCorrectDuringPrompt = 0;
  state.dictationPromptRecorded = false;
  renderText();
  try {
    const blob = await spokenReminderManager.synthesizeAudio(currentTarget(), { scope: "dictation" });
    if (requestId !== restartRequestId || promptId !== state.dictationPromptId || state.mode !== "dictation") return;
    state.dictationAudioBlob = blob;
    state.dictationAudioStatus = "ready";
    state.dictationBrowserFallback = false;
    renderText();
    if (spokenReminderManager.unlocked) playDictationPrompt();
  } catch (error) {
    if (requestId !== restartRequestId || promptId !== state.dictationPromptId || error?.name === "AbortError") return;
    console.warn("Dictation prompt could not be generated.", error);
    if ("speechSynthesis" in window) {
      state.dictationAudioStatus = "browser-ready";
      state.dictationBrowserFallback = true;
      renderText();
      if (spokenReminderManager.unlocked) playDictationPrompt();
      return;
    }
    state.dictationAudioStatus = "error";
    renderText();
    spokenReminderManager.showToast("Dictation audio unavailable", "Connect the Chatterbox service, then replay the prompt.", true);
  }
}

async function playDictationPrompt() {
  if (state.mode !== "dictation" || (!state.dictationAudioBlob && !state.dictationBrowserFallback)) return;
  const promptId = state.dictationPromptId;
  const firstPlayback = state.dictationPromptStartedAt === null;
  if (firstPlayback) state.dictationPromptStartedAt = performance.now();
  state.dictationAudioStatus = "playing";
  renderText();
  try {
    spokenReminderManager.unlock();
    if (state.dictationBrowserFallback) await speakBrowserDictationPrompt(currentTarget());
    else await spokenReminderManager.playBlob(state.dictationAudioBlob);
    if (promptId !== state.dictationPromptId || state.mode !== "dictation" || state.testCompleted) return;
    if (firstPlayback) {
      state.dictationPromptEndedAt = performance.now();
      state.dictationPromptDurationMs = Math.max(0, state.dictationPromptEndedAt - state.dictationPromptStartedAt);
    }
    state.dictationPromptHeard = true;
    state.dictationAudioStatus = "ready";
    renderText();
  } catch (error) {
    if (promptId !== state.dictationPromptId || error?.name === "AbortError") return;
    if (firstPlayback) {
      state.dictationPromptStartedAt = null;
      state.dictationPromptEndedAt = null;
      state.dictationPromptDurationMs = 0;
    }
    console.warn("Dictation prompt playback failed.", error);
    state.dictationAudioStatus = "error";
    renderText();
    spokenReminderManager.showToast("Playback blocked", "Press replay prompt to hear the sentence again.", false);
  }
}

function speakBrowserDictationPrompt(text) {
  return spokenReminderManager.playBrowserSpeech(text, { rate: .9 });
}

function modeCopy() {
  const copy = {
    adaptive: ["Adaptive letters", `${lessonPageCount()} page lesson / ${prefs.targetSpeed} WPM target`],
    time: ["Timed Test", `${prefs.testDuration} second sprint`],
    words: ["Word Test", `${lessonPageCount()} page challenge`],
    placement: ["Placement Check", "Find your starting point"],
    quote: ["Quote Test", "Complete the quote"],
    zen: ["Zen Mode", `${lessonPageCount()} page freewrite`],
    creative: ["Creative Test", creativeModeLabels[prefs.creativeMode]],
    dictation: ["Dictation", "Listen, then type"],
    bible: ["Scripture Reading", "Bible Reading"],
    bibleQuotes: ["Bible Quotes", "Complete Quotes"]
  };
  return copy[state.mode] || copy.adaptive;
}

function applyDisplayPreferences() {
  document.documentElement.style.setProperty("--lesson-color", lessonColorValues[prefs.lessonColor] || lessonColorValues.theme);
  els.typingText.dataset.caret = prefs.caretStyle;
  els.typingText.dataset.smooth = prefs.smoothCaret;
  els.typingText.dataset.typed = prefs.typedEffect;
  els.typingText.dataset.highlight = prefs.highlightMode;
  els.typingCard.dataset.size = prefs.fontSize;
  els.typingCard.dataset.width = prefs.lineWidth;
  document.body.dataset.mode = state.mode;
  document.body.classList.toggle("smooth-lines", prefs.smoothLineScroll);
  document.body.classList.toggle("text-glow", prefs.textGlow);
  document.body.classList.toggle("flip-test-colors", prefs.flipTestColors);
  document.body.classList.toggle("colorful-test", prefs.colorfulMode);
  document.body.classList.toggle("tape-mode", prefs.tapeMode !== "off");
  document.body.classList.toggle("memory-hidden", state.mode === "creative" && prefs.creativeMode === "memory" && !state.memoryVisible);
  [...document.body.classList].filter(name => name.startsWith("funbox-")).forEach(name => document.body.classList.remove(name));
  if (state.mode === "creative") document.body.classList.add(`funbox-${prefs.creativeMode}`);
  document.body.classList.toggle("focus-mode", prefs.focusMode && !!state.startedAt && !state.testCompleted);
}

function render() {
  const [eyebrow, title] = modeCopy();
  els.modeEyebrow.textContent = eyebrow;
  els.lessonTitle.textContent = title;
  applyDisplayPreferences();
  renderText();
  renderKeyboard();
  renderSettingsKeyboardMap();
  renderLetterProgress();
  renderPerformance();
  renderLiveMetrics();
  renderResult();
  els.typingCard.classList.toggle("hidden", state.testCompleted);
  els.resultPanel.classList.toggle("hidden", !state.testCompleted);
  els.keyboardWrap.classList.toggle("hidden", prefs.keymapMode === "off" || state.testCompleted);
}

function currentRowWordCount() {
  return (String(currentTarget()).match(/\S+/g) || []).length;
}

function preparePostureReminderRow() {
  const wordCount = currentRowWordCount();
  const midpoint = Math.max(1, Math.round(wordCount / 2));
  const centerWeightedOffsets = [-2, -1, -1, 0, 0, 0, 0, 0, 1, 1];
  const offset = centerWeightedOffsets[Math.floor(Math.random() * centerWeightedOffsets.length)];
  state.postureReminderAtWord = Math.max(1, Math.min(Math.max(1, wordCount - 1), midpoint + offset));
  state.postureReminderRow = state.rowIndex;
  state.postureReminderNextRow = state.rowIndex + 4 + Math.floor(Math.random() * 4);
  state.postureReminder = null;
}

function completedWordsInCurrentRow() {
  const prefix = String(currentTarget()).slice(0, state.input.length);
  return (prefix.match(/\s+/g) || []).length;
}

function maybeShowPostureReminder() {
  if (state.mode !== "adaptive" || state.testCompleted || !currentTarget()) return;
  if (state.postureReminderRow !== state.rowIndex) {
    if (state.rowIndex < state.postureReminderNextRow) return;
    preparePostureReminderRow();
  }
  if (state.postureReminder || completedWordsInCurrentRow() < state.postureReminderAtWord) return;

  const lastKind = lessonReminders[state.postureReminderLastIndex]?.kind;
  const candidates = lessonReminders
    .map((reminder, index) => ({ reminder, index }))
    .filter(({ reminder, index }) => index !== state.postureReminderLastIndex && (!lastKind || reminder.kind !== lastKind));
  const choices = candidates.length ? candidates : lessonReminders
    .map((reminder, index) => ({ reminder, index }))
    .filter(({ index }) => index !== state.postureReminderLastIndex);
  const selected = choices[Math.floor(Math.random() * choices.length)] || { reminder: lessonReminders[0], index: 0 };
  const reminderIndex = selected.index;
  state.postureReminderLastIndex = reminderIndex;
  state.postureReminder = selected.reminder;
  playReminderSound();
  spokenReminderManager.enqueue({
    id: `adaptive-${state.rowIndex}-${reminderIndex}`,
    text: selected.reminder.text
  });
}

function renderPostureReminder() {
  // Reminder delivery is spoken or shown in the transient fallback toast.
  // Keep this hook so the existing scheduler and render flow remain intact.
  els.postureReminder?.classList.add("hidden");
}

function renderSpecialProgress() {
  if (!els.specialHeatmap) return;
  els.specialHeatmap.innerHTML = specialProgressKeys.map(({ key, label, glyph }) => {
    const stats = progress.characterStats[key] || { attempts: 0, correct: 0 };
    const attempts = Number(stats.attempts) || 0;
    const correct = Number(stats.correct) || 0;
    const accuracy = attempts ? correct / attempts : 0;
    const progressScore = attempts ? Math.min(1, attempts / 60) * accuracy : 0;
    const hue = Math.round(progressScore * 120);
    const deepHue = Math.min(120, hue + 12);
    const hasProgress = attempts > 0;
    const heatColor = hasProgress ? `hsl(${hue} 78% 48%)` : "var(--panel-strong)";
    const heatColorDeep = hasProgress ? `hsl(${deepHue} 76% 34%)` : "var(--panel-strong)";
    const detail = attempts
      ? `${Math.round(accuracy * 100)}% accuracy, ${attempts} attempts`
      : "No samples yet";
    return `<span class="special-key ${hasProgress ? "sampled" : "unseen"}" style="--special-color:${heatColor};--special-color-deep:${heatColorDeep}" title="${escapeHtml(label)}: ${detail}" aria-label="${escapeHtml(label)}: ${detail}">${escapeHtml(glyph)}</span>`;
  }).join("");
}

function renderLetterProgress() {
  const isAdaptive = state.mode === "adaptive";
  els.letterHud.classList.toggle("hidden", !isAdaptive);
  renderPostureReminder();
  if (!isAdaptive) return;

  const unlockedCount = Number(prefs.practiceLetters);
  const earnedLetters = new Set(letterOrder.slice(0, unlockedCount));
  const nextLetter = letterOrder[unlockedCount];
  const focusLetter = adaptiveFocusLetter();
  const selectedFocusLetters = selectedAdaptiveFocusLetters();
  const recoveryMode = adaptiveRecoveryActive();
  const selectedPresets = selectedAdaptivePracticePresets();
  const activePresets = recoveryMode && !selectedPresets.includes("workout") ? ["accuracy"] : selectedPresets;
  const activePreset = activePresets[0];
  const workoutActive = activePresets.includes("workout");
  const workoutPhase = zoneWorkoutPhase();
  els.practiceFocusIndicator.dataset.focus = activePreset;
  els.practiceFocusName.textContent = workoutActive
    ? `Zone workout · ${workoutPhase.label}`
    : selectedFocusLetters.length
    ? `Letters ${selectedFocusLetters.join(" / ")}`
    : activePresets.map(preset => practicePresetLabels[preset] || practicePresetLabels.balanced).join(" + ");
  els.practiceFocusDescription.textContent = workoutActive
    ? `${workoutPhase.description} The keyboard highlights the zone in focus.`
    : selectedFocusLetters.length
    ? `Upcoming words prioritize ${selectedFocusLetters.join(", ")} while staying inside the earned alphabet.`
    : activePresets.map(preset => practicePresetDescriptions[preset] || practicePresetDescriptions.balanced).join(" ");
  els.practiceFocusState.textContent = recoveryMode ? "Recovery" : "Active";
  els.unlockCount.textContent = `${unlockedCount} / ${letterOrder.length}`;
  const focusLabel = selectedFocusLetters.length ? selectedFocusLetters.join(" / ") : focusLetter;
  els.unlockNext.textContent = nextLetter ? `Focus ${focusLabel} / next ${nextLetter}` : `Focus ${focusLabel} / alphabet complete`;

  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalMastery = 0;
  let sampledLetters = 0;
  const keys = letterOrder.map(letter => {
    const isEarned = earnedLetters.has(letter);
    const isNext = letter === nextLetter;
    const isFocus = letter === focusLetter;
    const stats = progress.letterStats[letter.toLowerCase()] || { attempts: 0, correct: 0 };
    const mastery = letterMastery(letter);
    if (isEarned) {
      totalAttempts += Number(stats.attempts) || 0;
      totalCorrect += Number(stats.correct) || 0;
      if (stats.attempts) {
        totalMastery += mastery.score;
        sampledLetters++;
      }
    }
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
    const hasProgress = isEarned && (Number(stats.attempts) > 0 || mastery.pages > 0 || mastery.bestConfidence > 0);
    const strength = hasProgress ? "sampled" : "unseen";
    const status = [isEarned ? "" : isNext ? "next" : "locked", isFocus ? "focus" : ""].filter(Boolean).join(" ");
    const detail = !isEarned
      ? isNext ? "Next to unlock" : "Locked"
      : stats.attempts ? `${mastery.percent}% confidence, ${Math.round(mastery.smoothedWpm)} WPM, ${accuracy}% accuracy` : "Building baseline";
    const disabled = isEarned ? "" : " disabled";
    const hasEvidence = Boolean(hasProgress);
    const hue = Math.round(mastery.visualScore * 120);
    const deepHue = Math.min(120, hue + 12);
    const heatColor = hasEvidence ? `hsl(${hue} 78% 48%)` : "var(--panel-strong)";
    const heatColorDeep = hasEvidence ? `hsl(${deepHue} 76% 34%)` : "var(--panel-strong)";
  const fill = hasEvidence ? `background:linear-gradient(145deg,${heatColor},${heatColorDeep});` : "";
    return `<button type="button" class="heat-key ${strength} ${status}" data-letter="${letter}" style="--confidence:${mastery.visualScore.toFixed(3)};--heat-color:${heatColor};--heat-color-deep:${heatColorDeep};${fill}"${disabled} title="${letter}: ${detail}" aria-label="${letter}: ${detail}">${letter}</button>`;
  }).join("");
  els.letterHeatRow.innerHTML = keys;
  renderSpecialProgress();
  els.heatmapSummary.textContent = totalAttempts
    ? `${Math.round((totalMastery / Math.max(1, sampledLetters)) * 100)}% confidence / ${Math.round((totalCorrect / totalAttempts) * 100)}% accuracy`
    : `Build ${focusLetter} toward ${prefs.targetSpeed} WPM`;
}

function recordCharacterAttempt(expected, isCorrect) {
  const character = String(expected || "");
  if (!specialProgressKeys.some(item => item.key === character)) return;
  const stats = progress.characterStats[character] ||= { attempts: 0, correct: 0, lastPracticedAt: 0 };
  stats.attempts++;
  if (isCorrect) stats.correct++;
  stats.lastPracticedAt = Date.now();
  scheduleSave();
}

function recordLetterAttempt(expected, isCorrect, recordedAt = performance.now()) {
  const letter = String(expected || "").toLowerCase();
  if (!/^[a-z]$/.test(letter)) return;
  if (["bible", "bibleQuotes"].includes(state.mode)) return;
  if (!["adaptive", "placement"].includes(state.mode)) {
    if (!isCorrect) {
      progress.errorReview.push(letter);
      if (progress.errorReview.length > 120) progress.errorReview = progress.errorReview.slice(-120);
      scheduleSave();
    }
    return;
  }
  const stats = progress.letterStats[letter] ||= { attempts: 0, correct: 0 };
  stats.attempts++;
  if (isCorrect) stats.correct++;
  if (!isCorrect) {
    stats.errors = (Number(stats.errors) || 0) + 1;
    state.lessonErrorLetters[letter] = (state.lessonErrorLetters[letter] || 0) + 1;
    progress.errorReview.push(letter);
    if (progress.errorReview.length > 120) progress.errorReview = progress.errorReview.slice(-120);
  }

  const lessonStats = state.lessonLetterStats[letter] ||= { attempts: 0, correct: 0, timedCorrect: 0, elapsedMs: 0 };
  const lineStats = state.lineLetterStats[letter] ||= { attempts: 0, correct: 0, timedCorrect: 0, elapsedMs: 0 };
  lessonStats.attempts++;
  lineStats.attempts++;
  if (isCorrect) {
    lessonStats.correct++;
    lineStats.correct++;
    if (state.lastAcceptedAt) {
      const elapsed = recordedAt - state.lastAcceptedAt;
      if (elapsed > 0 && elapsed <= 12000) {
        lessonStats.elapsedMs += elapsed;
        lessonStats.timedCorrect++;
      }
    }
    state.lastAcceptedAt = recordedAt;
    if (state.lineLastAcceptedAt) {
      const elapsed = recordedAt - state.lineLastAcceptedAt;
      if (elapsed > 0 && elapsed <= 12000) {
        lineStats.elapsedMs += elapsed;
        lineStats.timedCorrect++;
      }
    }
    state.lineLastAcceptedAt = recordedAt;
  }
  scheduleSave();
}

function renderLetterChart(letter, history, lifetimeStats) {
  const points = history.slice(-24);
  if (!points.length) {
    const detail = lifetimeStats.attempts
      ? `${Math.round((lifetimeStats.correct / lifetimeStats.attempts) * 100)}% accuracy over ${lifetimeStats.attempts} attempts`
      : "No typing samples yet";
    els.letterChart.innerHTML = `<div class="curve-empty"><strong>No completed-page samples</strong><span>${detail}</span></div>`;
    return;
  }

  const width = 720;
  const height = 270;
  const margin = { top: 22, right: 22, bottom: 38, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const speeds = points.map(point => Number(point.wpm) || 0).concat(Number(prefs.targetSpeed) || 35);
  let minY = Math.max(0, Math.floor((Math.min(...speeds) - 5) / 5) * 5);
  let maxY = Math.ceil((Math.max(...speeds) + 5) / 5) * 5;
  if (maxY - minY < 10) maxY = minY + 10;
  const xFor = index => points.length === 1
    ? margin.left + plotWidth / 2
    : margin.left + (index / (points.length - 1)) * plotWidth;
  const yFor = value => margin.top + ((maxY - value) / (maxY - minY)) * plotHeight;
  const coordinates = points.map((point, index) => [xFor(index), yFor(Number(point.wpm) || 0)]);
  const linePath = coordinates.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const areaPath = points.length > 1
    ? `${linePath} L${coordinates.at(-1)[0].toFixed(1)} ${(margin.top + plotHeight).toFixed(1)} L${coordinates[0][0].toFixed(1)} ${(margin.top + plotHeight).toFixed(1)} Z`
    : "";
  const grid = Array.from({ length: 5 }, (_, index) => {
    const value = maxY - ((maxY - minY) * index / 4);
    const y = yFor(value);
    return `<g><line class="curve-grid-line" x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}"></line><text class="curve-axis-label" x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${Math.round(value)} WPM</text></g>`;
  }).join("");
  const dots = coordinates.map(([x, y], index) => {
    const point = points[index];
    const lessonNumber = Math.max(1, history.length - points.length + index + 1);
    const currentClass = index === points.length - 1 ? " current" : "";
    return `<circle class="curve-point${currentClass}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${index === points.length - 1 ? 6 : 4}"><title>Lesson ${lessonNumber}: ${Math.round(point.wpm)} WPM, ${Math.round(point.accuracy)}% accuracy</title></circle>`;
  }).join("");
  const targetY = yFor(Number(prefs.targetSpeed) || 35);

  els.letterChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${letter} speed learning curve">
      ${grid}
      <line class="curve-target-line" x1="${margin.left}" y1="${targetY.toFixed(1)}" x2="${width - margin.right}" y2="${targetY.toFixed(1)}"></line>
      <text class="curve-target-label" x="${width - margin.right}" y="${(targetY - 6).toFixed(1)}" text-anchor="end">${prefs.targetSpeed} WPM target</text>
      ${areaPath ? `<path class="curve-area" d="${areaPath}"></path>` : ""}
      <path class="curve-line" d="${linePath}"></path>
      ${dots}
      <text class="curve-axis-label" x="${margin.left}" y="${height - 10}">Older</text>
      <text class="curve-axis-label" x="${width - margin.right}" y="${height - 10}" text-anchor="end">Latest</text>
    </svg>`;
}

function openLetterDetails(letter) {
  const upperLetter = String(letter || "").toUpperCase();
  const letterIndex = letterOrder.indexOf(upperLetter);
  if (letterIndex < 0 || letterIndex >= Number(prefs.practiceLetters)) return;
  const key = upperLetter.toLowerCase();
  const lifetimeStats = progress.letterStats[key] || { attempts: 0, correct: 0 };
  const history = Array.isArray(progress.letterHistory[key])
    ? progress.letterHistory[key].filter(item => item && Number.isFinite(Number(item.wpm)))
    : [];
  const latest = history.at(-1);
  const topSpeed = history.reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0);
  const accuracy = lifetimeStats.attempts ? Math.round((lifetimeStats.correct / lifetimeStats.attempts) * 100) : null;
  const mastery = letterMastery(upperLetter);
  els.letterDetailBadge.textContent = upperLetter;
  els.letterDetailTitle.textContent = `${upperLetter} progress`;
  els.letterMastery.textContent = `${mastery.percent}%`;
  els.letterLastSpeed.textContent = latest ? `${Math.round(latest.wpm)} WPM` : "--";
  els.letterTopSpeed.textContent = history.length ? `${Math.round(topSpeed)} WPM` : "--";
  els.letterAccuracy.textContent = accuracy === null ? "--" : `${accuracy}%`;
  els.letterLearningRate.textContent = formatLearningRate(history);
  els.letterLessons.textContent = `${history.length} / ${masteryRequiredPages}`;
  syncLetterFocusControl(upperLetter);
  els.letterCurveCaption.textContent = mastery.score >= .98
    ? "Target confidence earned"
    : `${mastery.pagesRemaining} evidence pages / ${mastery.attemptsRemaining} keystrokes remaining`;
  renderLetterChart(upperLetter, history, lifetimeStats);
  if (!els.letterDialog.open) els.letterDialog.showModal();
}

function syncLetterFocusControl(letter) {
  if (!els.letterFocusCheckbox || !els.letterFocusHint) return;
  const upperLetter = String(letter || "").toUpperCase();
  const selected = selectedAdaptiveFocusLetters();
  const isSelected = selected.includes(upperLetter);
  const atLimit = selected.length >= 5 && !isSelected;
  els.letterFocusCheckbox.checked = isSelected;
  els.letterFocusCheckbox.disabled = atLimit;
  els.letterFocusHint.textContent = isSelected
    ? `${selected.length} of 5 focus slots used. Upcoming adaptive words prioritize ${upperLetter}.`
    : atLimit
      ? "Five focus letters are already selected. Uncheck one before adding this letter."
      : "Add this earned letter to the adaptive focus rotation.";
}

function renderInteractiveTarget(target) {
  let characterIndex = 0;
  let wordIndex = 0;
  const groups = target.match(/\S+|\s+/g) || [];
  let currentWord = 0;
  for (const group of groups) {
    if (/^\s+$/.test(group)) {
      characterIndex += [...group].length;
      continue;
    }
    const start = characterIndex;
    const end = start + [...group].length;
    if (state.input.length >= start) currentWord = wordIndex;
    characterIndex = end;
    wordIndex++;
  }

  characterIndex = 0;
  wordIndex = 0;
  return groups.map(group => {
    const groupStart = characterIndex;
    const groupCharacters = [...group];
    const groupEnd = groupStart + groupCharacters.length;
    const isSpace = /^\s+$/.test(group);
    const wordInProgress = !isSpace && state.input.length > groupStart && state.input.length < groupEnd;
    const characters = groupCharacters.map(ch => {
      const index = characterIndex++;
      const cls = index < state.input.length
        ? `done${prefs.blindMode ? " blind" : ""}${wordInProgress ? " word-in-progress" : ""}`
        : index === state.input.length ? `current ${prefs.currentCue}` : "pending";
      const shownCharacter = prefs.typedEffect === "dots" && index < state.input.length && !/\s/.test(ch) ? "•" : ch;
      return `<span class="${cls}">${escapeHtml(shownCharacter)}</span>`;
    }).join("");
    if (isSpace) return `<span class="typing-space">${characters}</span>`;
    const distance = wordIndex - currentWord;
    const stateClass = distance < 0 ? " completed-word" : distance === 0 ? " active-word" : " future-word";
    const shownDistance = Math.max(0, Math.min(4, distance));
    wordIndex++;
    return `<span class="typing-word${stateClass}" data-distance="${shownDistance}">${characters}</span>`;
  }).join("");
}

function renderPlainLine(line) {
  return (line.match(/\S+|\s+/g) || []).map(group => /^\s+$/.test(group)
    ? `<span class="typing-space">${escapeHtml(group)}</span>`
    : `<span class="typing-word">${escapeHtml(group)}</span>`).join("");
}

function fitPracticeLines(lines) {
  if (!["adaptive", "time", "words", "creative", "placement"].includes(state.mode)) {
    els.typingText.style.fontSize = "";
    state.practiceFontSize = null;
    state.practiceFitSignature = "";
    return;
  }
  if (state.mode === "adaptive") {
    els.typingText.style.fontSize = "";
    state.practiceFontSize = null;
    state.practiceFitSignature = "";
    return;
  }
  const availableWidth = Math.floor(els.typingText.getBoundingClientRect().width || els.typingText.clientWidth || 0);
  const lineSignature = [
    state.mode,
    prefs.fontSize,
    prefs.fontFamily,
    prefs.lineWidth,
    availableWidth,
    ...lines.map(line => String(line || ""))
  ].join("\u001f");
  if (state.practiceFontSize && state.practiceFitSignature === lineSignature) {
    els.typingText.style.fontSize = `${state.practiceFontSize}px`;
    return;
  }
  els.typingText.style.fontSize = "";
  state.practiceFontSize = null;
  state.practiceFitSignature = "";
  const lineWidths = [...els.typingText.querySelectorAll(".practice-line")]
    .map(line => line.scrollWidth)
    .filter(width => width > 0);
  const widestLine = Math.max(...lineWidths, 0);
  const baseSize = Number.parseFloat(getComputedStyle(els.typingText).fontSize) || 24;
  if (!availableWidth) return;
  if (!widestLine || widestLine <= availableWidth) {
    state.practiceFontSize = baseSize;
    state.practiceFitSignature = lineSignature;
    els.typingText.style.fontSize = `${state.practiceFontSize}px`;
    return;
  }
  const fittedSize = Math.max(12, baseSize * Math.min(1, availableWidth / widestLine));
  state.practiceFontSize = Number(fittedSize.toFixed(2));
  state.practiceFitSignature = lineSignature;
  els.typingText.style.fontSize = `${state.practiceFontSize}px`;
}

function schedulePracticeRefit(lines) {
  if (!["adaptive", "time", "words", "creative", "placement"].includes(state.mode)) return;
  if (state.practiceFitRaf) cancelAnimationFrame(state.practiceFitRaf);
  const visibleLines = lines.slice();
  state.practiceFitRaf = requestAnimationFrame(() => {
    state.practiceFitRaf = 0;
    if (state.testCompleted) return;
    state.practiceFontSize = null;
    state.practiceFitSignature = "";
    fitPracticeLines(visibleLines);
  });
}

function positionAdaptiveLineMask() {
  if (state.mode !== "adaptive") return;
  const activeLine = els.typingText.querySelector(".practice-line.active");
  if (!activeLine) return;
  const current = activeLine.querySelector(".current") || activeLine.querySelector(".word-in-progress") || activeLine.querySelector(".done:last-child");
  if (!current) {
    activeLine.scrollLeft = 0;
    return;
  }
  const targetLeft = current.offsetLeft - Math.round(activeLine.clientWidth * .18);
  activeLine.scrollLeft = Math.max(0, targetLeft);
}

function renderText() {
  const target = currentTarget();
  const typingTarget = currentTypingTarget();
  const reference = currentReference();
  els.scriptureStrip.classList.toggle("hidden", !reference);
  els.scriptureRef.textContent = reference;
  const rowLabels = {
    adaptive: `Line ${Math.min(lessonLineLimit(), state.rowIndex + 1)} of ${lessonLineLimit()}`,
    time: `${Math.max(0, Math.ceil(state.timeRemaining))} seconds`,
    words: `Line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    creative: `${creativeModeLabels[prefs.creativeMode]} / line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    placement: `Placement line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    dictation: `Prompt ${state.rowIndex + 1} of ${state.targetRows.length}`,
    quote: "Complete quote",
    zen: `Freewrite ${state.input.length} / ${target.length}`,
    bible: `Scripture ${state.pageIndex + 1} of ${state.scripturePages.length}`,
    bibleQuotes: `Quote ${state.pageIndex + 1} of ${state.scripturePages.length}`
  };
  els.rowLabel.textContent = rowLabels[state.mode] || "Practice";
  els.charLabel.textContent = state.mode === "zen"
    ? `${state.input.length} / ${target.length}`
    : state.mode === "dictation"
      ? `${state.input.length} typed`
      : `${state.input.length} / ${typingTarget.length}`;
  const isDictation = state.mode === "dictation";
  const isListenClosely = isListenCloselyMode();
  const hasPromptControls = isDictation || isListenClosely;
  els.dictationControls?.classList.toggle("hidden", !hasPromptControls || state.testCompleted);
  if (hasPromptControls && els.dictationAudioStatus && els.dictationReplayButton) {
    const statusCopy = {
      idle: "Preparing prompt",
      loading: "Generating audio...",
      ready: state.dictationPromptHeard ? "Prompt heard. Type what you remember." : "Listen before typing.",
      "browser-ready": state.dictationPromptHeard ? "Prompt heard. Type what you remember." : "Browser voice ready. Listen before typing.",
      playing: "Type while listening...",
      error: "Audio unavailable. Try replay."
    }[state.dictationAudioStatus] || "Listen before typing.";
    els.dictationAudioStatus.textContent = isListenClosely ? "Listen Closely prompt" : statusCopy;
    els.dictationReplayButton.disabled = isDictation
      ? (!state.dictationAudioBlob && !state.dictationBrowserFallback) || ["loading", "playing"].includes(state.dictationAudioStatus)
      : false;
    els.dictationReplayButton.textContent = isDictation && state.dictationAudioStatus === "playing"
      ? "Playing..."
      : "Replay audio";
    els.dictationSubmitButton.classList.toggle("hidden", isListenClosely);
    els.dictationSubmitButton.disabled = isListenClosely || !state.input.length;
  }
  if (state.mode === "zen") {
    ensureZenTargetBuffer();
    els.typingText.innerHTML = `<span class="practice-line zen-paragraph active">${renderInteractiveTarget(currentTarget())}</span>`;
    els.typingText.style.fontSize = "";
    state.practiceFontSize = null;
    state.practiceFitSignature = "";
    return;
  }
  if (isDictation) {
    const typed = state.input
      ? escapeHtml(state.input)
      : `<span class="dictation-placeholder">${state.dictationPromptHeard ? "Start typing" : state.dictationAudioStatus === "playing" ? "Type what you hear" : "Listen for the prompt"}</span>`;
    els.typingText.innerHTML = `<div class="dictation-stage"><div class="dictation-typed">${typed}</div><span class="dictation-hint">Type what you hear while the prompt plays.</span></div>`;
    els.typingText.style.fontSize = "";
    state.practiceFontSize = null;
    state.practiceFitSignature = "";
    return;
  }

  const streamMode = ["adaptive", "time", "words", "creative", "placement"].includes(state.mode);
  if (streamMode) {
    const lines = state.mode === "adaptive"
      ? state.targetRows.slice(state.rowIndex, state.rowIndex + 2)
      : [usesDictationTypingRules() ? typingTarget : state.targetRows[state.rowIndex] || ""];
    while (state.mode === "adaptive" && lines.length < 2) lines.push("");
    els.typingText.innerHTML = lines.map((line, index) => `<span class="practice-line${index === 0 ? " active" : ""}" data-line-offset="${index}">${index === 0 ? renderInteractiveTarget(line) : renderPlainLine(line)}</span>`).join("");
    if (state.mode === "adaptive") positionAdaptiveLineMask();
    fitPracticeLines(lines);
    schedulePracticeRefit(lines);
    return;
  }

  els.typingText.innerHTML = renderInteractiveTarget(typingTarget);
  els.typingText.style.fontSize = "";
  state.practiceFontSize = null;
  state.practiceFitSignature = "";
}

let keyboardElements = new Map();

function renderKeyboard() {
  const unlocked = new Set(letterOrder.slice(0, prefs.practiceLetters));
  const fluidLayouts = ["mac", "windows", "compact", "typewriter"];
  const layoutName = state.mode === "creative" && prefs.creativeMode === "layoutfluid"
    ? fluidLayouts[state.rowIndex % fluidLayouts.length]
    : prefs.keyboardLayout;
  const layout = keyboardLayouts[layoutName] || keyboardLayouts.mac;
  els.keyboard.className = `keyboard ${prefs.keyboardSize} layout-${layoutName} style-${prefs.keymapStyle}`;
  els.keyboard.innerHTML = layout.map((row, rowIndex) => {
    const keys = row.map(key => {
      if (key.type === "arrow-stack") return renderArrowStack(key);
      if (key.type === "spacer") return `<span class="keyboard-spacer" style="grid-column: span ${key.units}"></span>`;
      return renderKeyboardKey(key, unlocked);
    }).join("");
    return `<div class="key-row key-row-${rowIndex + 1}">${keys}</div>`;
  }).join("");
  keyboardElements = new Map([...els.keyboard.querySelectorAll("[data-key]")].map(key => [key.dataset.key, key]));
}

function renderSettingsKeyboardMap() {
  if (!els.settingsKeyboardMap) return;
  const layout = keyboardLayouts[prefs.keyboardLayout] || keyboardLayouts.mac;
  const earned = new Set(letterOrder.slice(0, Number(prefs.practiceLetters)));
  const focused = new Set(selectedAdaptiveFocusLetters());
  els.settingsKeyboardMap.className = `settings-keyboard-map keyboard ${prefs.keyboardSize} layout-${prefs.keyboardLayout} style-${prefs.keymapStyle}`;
  els.settingsKeyboardMap.innerHTML = layout.map((row, rowIndex) => {
    const keys = row.map(key => {
      if (key.type === "arrow-stack" || key.type === "spacer") {
        return `<span class="settings-map-spacer" style="grid-column:span ${key.units}"></span>`;
      }
      const zone = fingerZone(key.id);
      const isLetter = /^[a-z]$/.test(key.id);
      const stats = isLetter ? progress.letterStats[key.id] || { attempts: 0, correct: 0 } : null;
      const mastery = isLetter ? letterMastery(key.id) : null;
      const isEarned = isLetter && earned.has(key.id.toUpperCase());
      const isFocus = isLetter && focused.has(key.id.toUpperCase());
      const classes = [
        "key", "settings-map-key", zone.className,
        isLetter ? "map-letter" : "modifier",
        isLetter && isEarned ? "earned" : "",
        isLetter && !isEarned ? "map-locked" : "",
        isFocus ? "map-focus" : "",
        isLetter && stats?.attempts ? "has-progress" : ""
      ].filter(Boolean).join(" ");
      const label = isLetter ? key.id.toUpperCase() : key.label;
      const detail = isLetter
        ? `${key.id.toUpperCase()} · ${zone.label}${stats?.attempts ? ` · ${Math.round((stats.correct / stats.attempts) * 100)}% accuracy` : " · no samples yet"}`
        : zone.label;
      const progressStyle = isLetter && stats?.attempts ? `--map-progress:${mastery.visualScore.toFixed(3)}` : "";
      return `<span class="${classes}" style="grid-column:span ${key.units};${progressStyle}" title="${escapeHtml(detail)}" aria-label="${escapeHtml(detail)}">${escapeHtml(label)}</span>`;
    }).join("");
    return `<div class="key-row key-row-${rowIndex + 1}">${keys}</div>`;
  }).join("");
}

function fingerZone(key) {
  if (["tab", "capslock", "shiftleft", "controlleft", "fn"].includes(key) || "`1qaz".includes(key)) {
    return { className: "zone-pinky", label: "Left pinky" };
  }
  if ("2wsx".includes(key)) return { className: "zone-ring", label: "Left ring finger" };
  if ("3edc".includes(key)) return { className: "zone-middle", label: "Left middle finger" };
  if ("45rftgvb".includes(key)) return { className: "zone-left-index", label: "Left index finger" };
  if ("67yuhjnm".includes(key)) return { className: "zone-right-index", label: "Right index finger" };
  if ("8ik,".includes(key)) return { className: "zone-middle", label: "Right middle finger" };
  if ("9ol.".includes(key)) return { className: "zone-ring", label: "Right ring finger" };
  if (["0", "-", "=", "p", "[", "]", "\\", ";", "'", "/", "backspace", "enter", "shiftright", "controlright"].includes(key)) {
    return { className: "zone-pinky", label: "Right pinky" };
  }
  if (["space", "altleft", "altright", "metaleft", "metaright", "menu", "fnright"].includes(key)) {
    return { className: "zone-thumb", label: "Thumbs" };
  }
  return { className: "zone-neutral", label: "Navigation key" };
}

function keyboardStateClasses(id) {
  return [state.pressedKey === id ? "pressed" : "", state.mistakeKey === id ? "mistake" : ""].join(" ");
}

function renderKeyboardKey(key, unlocked) {
  const zone = fingerZone(key.id);
  const isLetter = /^[a-z]$/.test(key.id);
  const isLockedLetter = state.mode === "adaptive" && isLetter && !unlocked.has(key.id.toUpperCase());
  const isModifier = !isLetter && !key.shift && !/^[`0-9\-=\[\]\\;',./]$/.test(key.id);
  const expectedKey = currentTarget()[state.input.length]?.toLowerCase() === " " ? "space" : currentTarget()[state.input.length]?.toLowerCase();
  const isNext = prefs.keymapMode === "next" && expectedKey === key.id;
  const isWorkoutZone = keyMatchesWorkoutPhase(key.id);
  const classes = ["key", zone.className, isLockedLetter ? "locked" : "", isModifier ? "modifier" : "", key.id === "space" ? "spacebar" : "", isNext ? "next-key" : "", isWorkoutZone ? "workout-zone" : "", keyboardStateClasses(key.id)].join(" ");
  let displayLabel = key.label;
  if (isLetter) {
    if (prefs.keymapLegend === "blank") displayLabel = "";
    else displayLabel = prefs.keymapLegend === "lowercase" ? key.id : key.id.toUpperCase();
  }
  const label = key.shift
    ? `<span class="key-symbols"><small>${escapeHtml(key.shift)}</small><span>${escapeHtml(displayLabel)}</span></span>`
    : `<span>${escapeHtml(displayLabel)}</span>`;
  return `<span class="${classes}" style="grid-column: span ${key.units}" data-key="${escapeHtml(key.id)}" title="${zone.label}">${label}</span>`;
}

function renderArrowStack(key) {
  const arrows = [["arrowup", "▲"], ["arrowdown", "▼"]].map(([id, label]) =>
    `<span class="key arrow-key zone-neutral ${keyboardStateClasses(id)}" data-key="${id}" title="Navigation key">${label}</span>`
  ).join("");
  return `<span class="arrow-stack" style="grid-column: span ${key.units}">${arrows}</span>`;
}

function visualKeyId(event) {
  if (/^Key[A-Z]$/.test(event.code)) return event.code.slice(3).toLowerCase();
  if (/^Digit[0-9]$/.test(event.code)) return event.code.slice(5);
  if (event.code === "Fn" && prefs.keyboardLayout === "compact") return "fnright";
  return keyboardCodeIds[event.code] || event.key.toLowerCase();
}

let pressedKeyTimer;
let mistakeKeyTimer;
let lastErrorSoundAt = -Infinity;

function setKeyboardKeyClass(key, className, isActive) {
  const element = keyboardElements.get(key) || [...els.keyboard.querySelectorAll("[data-key]")].find(item => item.dataset.key === key);
  element?.classList.toggle(className, isActive);
}

function flashPressedKey(key) {
  if (prefs.keymapMode === "static" || prefs.keymapMode === "off") return;
  clearTimeout(pressedKeyTimer);
  if (state.pressedKey) setKeyboardKeyClass(state.pressedKey, "pressed", false);
  state.pressedKey = key;
  setKeyboardKeyClass(key, "pressed", true);
  pressedKeyTimer = setTimeout(() => {
    setKeyboardKeyClass(state.pressedKey, "pressed", false);
    state.pressedKey = "";
  }, 110);
}

function flashMistakeKey(key) {
  clearTimeout(mistakeKeyTimer);
  if (state.mistakeKey) setKeyboardKeyClass(state.mistakeKey, "mistake", false);
  state.mistakeKey = key;
  setKeyboardKeyClass(key, "mistake", true);
  els.keyboard.dataset.lastMistake = key;
  mistakeKeyTimer = setTimeout(() => {
    setKeyboardKeyClass(state.mistakeKey, "mistake", false);
    state.mistakeKey = "";
    delete els.keyboard.dataset.lastMistake;
  }, 240);
}

function handleKey(event) {
  if (els.settingsDialog.open || els.statsDialog.open || els.letterDialog.open) return;
  if (event.target instanceof HTMLElement && (event.target.matches("input, select, textarea") || event.target.isContentEditable)) return;
  const restartKey = { escape: "Escape", tab: "Tab", enter: "Enter" }[prefs.quickRestart];
  if (restartKey && event.key === restartKey) {
    event.preventDefault();
    if (state.mode === "creative" && prefs.creativeMode === "no_quit" && state.startedAt && !state.testCompleted) return;
    restart();
    return;
  }
  if (state.testCompleted) return;
  state.capsLock = !!event.getModifierState?.("CapsLock");
  if (event.key === "Shift") state.shiftSide = event.code === "ShiftRight" ? "right" : "left";
  els.typingCard.classList.toggle("caps-on", prefs.capsLockWarning && state.capsLock);
  const keyId = visualKeyId(event);
  flashPressedKey(keyId);
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.repeat && state.mode !== "zen" && event.key !== "Backspace") {
    event.preventDefault();
    return;
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    const wordStart = state.input.lastIndexOf(" ") + 1;
    const backspaceAllowed = prefs.freedomMode || (prefs.confidenceMode !== "max" && (prefs.confidenceMode !== "word" || state.input.length > wordStart));
    if (state.input.length && backspaceAllowed) {
      state.input = state.input.slice(0, -1);
      state.charsTyped = Math.max(0, state.charsTyped - 1);
      if (state.mode === "adaptive") state.lineCharsTyped = Math.max(0, state.lineCharsTyped - 1);
      state.characterErrors = 0;
    }
    els.rowLabel.textContent = `${Math.max(0, Math.ceil(state.timeRemaining))} seconds`;
    renderText();
    renderLiveMetrics();
    if (prefs.keymapMode === "next") renderKeyboard();
    return;
  }
  if (event.key === "Enter" && state.mode === "dictation" && state.input.length) {
    event.preventDefault();
    finishDictationLine();
    return;
  }
  if (event.key === "Enter" && prefs.quickEnd && testModes.has(state.mode) && state.startedAt && state.charsTyped) {
    event.preventDefault();
    finishTest();
    return;
  }
  const arrowCharacter = state.mode === "creative" && prefs.creativeMode === "arrows"
    ? { ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→" }[event.key]
    : "";
  if (event.key.length !== 1 && !arrowCharacter) return;
  event.preventDefault();
  const dictationCanType = state.mode !== "dictation"
    || state.dictationPromptHeard
    || state.dictationAudioStatus === "playing";
  if (!dictationCanType) {
    if (state.dictationAudioStatus === "error") {
      spokenReminderManager.showToast("Listen before typing", "Replay the prompt after the audio service is available.", true);
    }
    return;
  }
  const recordedAt = performance.now();
  if (!state.startedAt) {
    state.startedAt = recordedAt;
    if (state.mode === "time") startTimedTest();
  }
  if (state.mode === "adaptive") {
    state.lineStartedAt ||= recordedAt;
    if (state.lineLastKeyAt) {
      const interval = recordedAt - state.lineLastKeyAt;
      if (interval > 0 && interval < 5000) state.lineKeyIntervals.push(interval);
      if (state.lineKeyIntervals.length > 100) state.lineKeyIntervals.shift();
    }
    state.lineLastKeyAt = recordedAt;
  }
  if (state.lastKeyAt) {
    const interval = recordedAt - state.lastKeyAt;
    if (interval > 0 && interval < 5000) state.keyIntervals.push(interval);
    if (state.keyIntervals.length > 300) state.keyIntervals.shift();
  }
  state.lastKeyAt = recordedAt;
  trackDailyActivity(recordedAt);
  const target = currentTypingTarget();
  const enteredKey = arrowCharacter || event.key;
  const key = usesDictationTypingRules() && prefs.dictationCapitalization === "ignore"
    ? enteredKey.toLowerCase()
    : enteredKey;
  const expected = target[state.input.length];
  const expectedLower = String(expected || "").toLowerCase();
  const expectedZone = /^[a-z]$/.test(expectedLower) ? fingerZone(expectedLower).label : "";
  const oppositeShiftError = prefs.oppositeShiftMode && state.mode !== "dictation" && /^[A-Z]$/.test(String(expected || "")) && !["b", "y"].includes(expectedLower)
    && state.shiftSide !== (expectedZone.startsWith("Left") ? "right" : "left");
  const isCorrect = key === expected && !oppositeShiftError;
  const followingPrompt = state.mode === "dictation"
    && state.dictationAudioStatus === "playing"
    && !state.dictationPromptHeard;
  if (followingPrompt) {
    state.dictationTypedDuringPrompt++;
    if (isCorrect) state.dictationCorrectDuringPrompt++;
  }
  if (state.mode !== "zen" && !isCorrect) {
    state.lineErrors++;
    if (state.characterErrors < Number(prefs.errorLimit)) {
      state.errors++;
      state.characterErrors++;
      recordCharacterAttempt(expected, false);
      recordLetterAttempt(expected, false, recordedAt);
    }
    flashMistakeKey(keyId);
    if (prefs.indicateTypos === "flash") {
      els.typingCard.classList.add("typo-flash");
      setTimeout(() => els.typingCard.classList.remove("typo-flash"), 130);
    }
    if (prefs.errorSounds && recordedAt - lastErrorSoundAt > 90) {
      playError();
      lastErrorSoundAt = recordedAt;
    }
    renderLetterProgress();
    renderPerformance();
    renderLiveMetrics();
    if (state.mode !== "dictation" && !isListenCloselyMode()) return;
  } else if (state.mode !== "zen") {
    recordCharacterAttempt(expected, true);
    recordLetterAttempt(expected, true, recordedAt);
  }
  if (isCorrect) state.characterErrors = 0;
  state.input += enteredKey;
  state.charsTyped++;
  state.rawTyped++;
  if (state.mode === "zen") ensureZenTargetBuffer();
  if (state.mode === "adaptive") {
    state.lineCharsTyped++;
    state.lineRawTyped++;
  }
  if (prefs.typingSounds) playKey(event.code, event.shiftKey || state.capsLock);
  if (state.input.length >= target.length) {
    finishLine();
    return;
  }
  maybeShowPostureReminder();
  renderText();
  renderLiveMetrics();
  renderPerformance();
  applyDisplayPreferences();
  if (prefs.keymapMode === "next") renderKeyboard();
}

function startTimedTest() {
  clearTestTimer();
  state.timeRemaining = Number(prefs.testDuration);
  state.deadline = performance.now() + state.timeRemaining * 1000;
  state.timerId = setInterval(() => {
    state.timeRemaining = Math.max(0, (state.deadline - performance.now()) / 1000);
    const warningAt = Number(prefs.timeWarning);
    if (!state.warningPlayed && Number.isFinite(warningAt) && warningAt > 0 && state.timeRemaining <= warningAt) {
      state.warningPlayed = true;
      playTimeWarning();
    }
    renderText();
    renderLiveMetrics();
    if (state.timeRemaining <= 0) finishTest();
  }, 100);
}

function recordLetterLessonResults(pageWpm, completedAt) {
  if (state.mode !== "adaptive") return;
  Object.entries(state.lessonLetterStats).forEach(([letter, stats]) => {
    if (!stats.attempts) return;
    const accuracy = (stats.correct / stats.attempts) * 100;
    const timedWpm = stats.timedCorrect >= 2 && stats.elapsedMs > 0
      ? (stats.timedCorrect / 5) / (stats.elapsedMs / 60000)
      : pageWpm;
    const wpm = Math.max(0, Math.min(400, timedWpm));
    const history = Array.isArray(progress.letterHistory[letter]) ? progress.letterHistory[letter] : [];
    progress.letterHistory[letter] = history;
    history.push({
      at: completedAt,
      wpm: Number(wpm.toFixed(1)),
      accuracy: Number(accuracy.toFixed(1)),
      attempts: stats.attempts
    });
    if (history.length > 60) progress.letterHistory[letter] = history.slice(-60);
    const current = letterMastery(letter).currentConfidence;
    const lifetime = progress.letterStats[letter] ||= { attempts: 0, correct: 0 };
    lifetime.bestConfidence = Math.max(Number(lifetime.bestConfidence) || 0, current);
    const reviewDelay = current >= .98 ? 72 * 60 * 60 * 1000 : current >= .8 ? 12 * 60 * 60 * 1000 : current >= .5 ? 2 * 60 * 60 * 1000 : 10 * 60 * 1000;
    lifetime.lastPracticedAt = completedAt;
    lifetime.reviewDueAt = completedAt + reviewDelay;
  });
}

function recordPlacementResults(wpm, accuracy, completedAt) {
  const letterStats = Object.fromEntries(Object.entries(state.lessonLetterStats).map(([letter, stats]) => [letter, {
    attempts: stats.attempts,
    correct: stats.correct,
    accuracy: Number(((stats.correct / Math.max(1, stats.attempts)) * 100).toFixed(1))
  }]));
  progress.placement = {
    at: completedAt,
    wpm: Number(wpm.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    letterStats
  };
}

function recordCompletedLesson(wpm, accuracy, extra = {}) {
  const completedAt = Date.now();
  const result = {
    at: completedAt,
    mode: state.mode,
    wpm: Number(wpm.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    score: lessonScore(wpm, accuracy),
    ...extra
  };
  if (prefs.resultSaving === "on") {
    progress.lessonHistory.push(result);
    if (progress.lessonHistory.length > 120) progress.lessonHistory = progress.lessonHistory.slice(-120);
    if (state.mode === "placement") recordPlacementResults(wpm, accuracy, completedAt);
    else recordLetterLessonResults(wpm, completedAt);
  }
  state.lastWpm = result.wpm;
  state.lastAccuracy = result.accuracy;
  return result;
}

function finishLine() {
  if (!['bible', 'bibleQuotes'].includes(state.mode) && state.lineErrors === 0) progress.cleanLines = (Number(progress.cleanLines) || 0) + 1;
  if (state.mode === "adaptive") finishAdaptiveLine();
  else if (state.mode === "time") finishTimedLine();
  else if (["words", "creative", "placement"].includes(state.mode)) finishWordSection();
  else if (state.mode === "dictation") finishDictationLine();
  else if (state.mode === "zen") finishTest();
  else if (["quote", "bible", "bibleQuotes"].includes(state.mode)) finishScripture();
}

function updateLifetimeAverages(metrics) {
  progress.avgWpm = progress.avgWpm ? (progress.avgWpm * .75 + metrics.wpm * .25) : metrics.wpm;
  progress.avgAccuracy = progress.avgAccuracy ? (progress.avgAccuracy * .8 + metrics.accuracy * .2) : metrics.accuracy;
}

function finishAdaptiveLine() {
  const completedRow = (state.rowIndex % rowsPerPage) + 1;
  const completedPage = completedRow === rowsPerPage;
  let adaptiveLessonComplete = false;
  let newlyUnlocked = "";
  if (state.mode === "adaptive") state.adaptiveLessonLines.push(currentAdaptiveLineMetrics());
  if (completedPage) {
    const metrics = currentMetrics();
    const letterStats = snapshotAdaptiveLetterStats();
    updateLifetimeAverages(metrics);
    const pageResult = recordCompletedLesson(metrics.wpm, metrics.accuracy, {
      raw: metrics.raw,
      consistency: metrics.consistency,
      elapsedMs: metrics.elapsedMs,
      characters: state.charsTyped,
      errors: state.errors,
      letterStats
    });
    state.adaptiveLessonPages.push(pageResult);
    adaptiveLessonComplete = state.adaptiveLessonLines.length >= lessonLineLimit();
    if (canUnlockNextLetter()) {
      newlyUnlocked = letterOrder[Number(prefs.practiceLetters)] || "";
      prefs.practiceLetters = Math.min(letterOrder.length, Number(prefs.practiceLetters) + 1);
      const practiceSelector = document.getElementById("practiceLetters");
      if (practiceSelector) practiceSelector.value = String(prefs.practiceLetters);
    }
    if (adaptiveLessonComplete) {
      const summary = buildAdaptiveLessonSummary(state.adaptiveLessonLines);
      summary.recommendation = recommendAdaptiveFocus(progress.adaptiveLessonHistory);
      saveAdaptiveLessonSummary(summary);
      state.result = { ...summary, ...rankAdaptiveLesson(summary) };
      state.testCompleted = true;
    }
  }
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = newlyUnlocked ? `${newlyUnlocked} unlocked` : state.lineErrors === 0 ? "Perfect line" : "Line cleared";
  els.completionBanner.classList.remove("hidden");
  playReward(completedRow);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.lineErrors = 0;
    state.lineLetterStats = {};
    state.lineStartedAt = null;
    state.lineCharsTyped = 0;
    state.lineRawTyped = 0;
    state.lineKeyIntervals = [];
    state.lineLastKeyAt = null;
    state.lineLastAcceptedAt = null;
    if (adaptiveLessonComplete) {
      state.startedAt = null;
      state.charsTyped = 0;
      state.rawTyped = 0;
      state.errors = 0;
      state.keyIntervals = [];
      state.lastKeyAt = null;
      state.lastAcceptedAt = null;
      state.lessonLetterStats = {};
      save();
      render();
      return;
    }
    if (completedPage) {
      state.startedAt = null;
      state.charsTyped = 0;
      state.rawTyped = 0;
      state.errors = 0;
      state.keyIntervals = [];
      state.lastKeyAt = null;
      state.lessonLetterStats = {};
    }
    state.lastAcceptedAt = null;
    state.rowIndex++;
    if (completedPage) state.pageIndex++;
    if (completedPage) {
      state.targetRows = state.targetRows.slice(0, state.rowIndex);
      state.targetRows.push(...makeAdaptiveRows(rowsPerPage * 2));
    } else if (state.targetRows.length - state.rowIndex < 8) {
      state.targetRows.push(...makeAdaptiveRows(rowsPerPage));
    }
    if (completedPage && state.rowIndex >= Math.max(1000, lessonLineLimit() + rowsPerPage)) {
      state.targetRows = state.targetRows.slice(state.rowIndex);
      state.rowIndex = 0;
    }
    save();
    render();
  }, 72);
}

function finishTimedLine() {
  if (state.rowIndex >= state.targetRows.length - 1) {
    finishTest();
    return;
  }
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = state.lineErrors === 0 ? "Perfect line" : "Line cleared";
  els.completionBanner.classList.remove("hidden");
  playReward((state.rowIndex % 9) + 1);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.lineErrors = 0;
    state.rowIndex++;
    renderText();
    renderLiveMetrics();
    if (prefs.keymapMode === "next") renderKeyboard();
  }, 70);
}

function finishWordSection() {
  if (state.rowIndex >= state.targetRows.length - 1) {
    finishTest();
    return;
  }
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = state.lineErrors === 0 ? "Perfect line" : `Line ${state.rowIndex + 1} cleared`;
  els.completionBanner.classList.remove("hidden");
  playReward((state.rowIndex % 9) + 1);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.lineErrors = 0;
    state.characterErrors = 0;
    state.lastAcceptedAt = null;
    state.rowIndex++;
    renderText();
    renderLiveMetrics();
    if (prefs.keymapMode === "next" || prefs.creativeMode === "layoutfluid") renderKeyboard();
    prepareCreativeLine();
  }, 70);
}

function dictationPromptEvaluation() {
  const target = currentTypingTarget();
  const typed = state.input;
  const comparedLength = Math.max(target.length, typed.length);
  let correctCharacters = 0;
  for (let index = 0; index < Math.min(target.length, typed.length); index++) {
    if (target[index] === typed[index]) correctCharacters++;
  }
  const errors = Math.max(0, comparedLength - correctCharacters);
  return {
    targetCharacters: target.length,
    typedCharacters: typed.length,
    correctCharacters,
    errors,
    attempts: comparedLength,
    accuracy: comparedLength ? (correctCharacters / comparedLength) * 100 : 0
  };
}

function recordDictationPromptFollow() {
  if (state.mode !== "dictation" || state.dictationPromptRecorded) return;
  const targetCharacters = currentTypingTarget().length;
  const hasPlayback = state.dictationPromptStartedAt !== null;
  const endedAt = state.dictationPromptEndedAt ?? performance.now();
  const durationMs = hasPlayback
    ? Math.max(0, endedAt - state.dictationPromptStartedAt)
    : 0;
  const followedCharacters = hasPlayback
    ? Math.min(targetCharacters, Math.max(0, state.dictationCorrectDuringPrompt))
    : 0;
  state.dictationFollowSamples.push({
    prompt: state.rowIndex + 1,
    targetCharacters,
    followedCharacters,
    typedDuringPrompt: hasPlayback ? Math.max(0, state.dictationTypedDuringPrompt) : 0,
    durationMs: Math.round(durationMs),
    followRate: hasPlayback && targetCharacters
      ? Number(((followedCharacters / targetCharacters) * 100).toFixed(1))
      : null
  });
  state.dictationPromptRecorded = true;
}

function dictationFollowSummary() {
  const samples = state.dictationFollowSamples.filter(sample => Number.isFinite(Number(sample.followRate)));
  const targetCharacters = samples.reduce((sum, sample) => sum + (Number(sample.targetCharacters) || 0), 0);
  const followedCharacters = samples.reduce((sum, sample) => sum + (Number(sample.followedCharacters) || 0), 0);
  return {
    dictationFollowRate: targetCharacters
      ? Number(((followedCharacters / targetCharacters) * 100).toFixed(1))
      : null,
    dictationFollowedCharacters: followedCharacters,
    dictationPromptCharacters: targetCharacters,
    dictationPromptsMeasured: samples.length,
    dictationFollowSamples: state.dictationFollowSamples
  };
}

async function nextDictationPrompt() {
  if (state.mode !== "dictation") {
    restart();
    return;
  }
  let nextRows = state.targetRows;
  let nextRowIndex = state.rowIndex + 1;
  if (nextRowIndex >= nextRows.length) {
    nextRows = await makeDictationRows();
    if (state.mode !== "dictation") return;
    nextRowIndex = 0;
  }
  const requestId = ++restartRequestId;
  window.speechSynthesis?.cancel();
  spokenReminderManager.stop();
  state.targetRows = nextRows;
  state.rowIndex = nextRowIndex;
  state.input = "";
  state.startedAt = null;
  state.charsTyped = 0;
  state.rawTyped = 0;
  state.errors = 0;
  state.lineErrors = 0;
  state.characterErrors = 0;
  state.lastAcceptedAt = null;
  state.lastActivityAt = null;
  state.lastKeyAt = null;
  state.keyIntervals = [];
  state.testCompleted = false;
  state.result = null;
  state.completion = false;
  state.dictationAudioBlob = null;
  state.dictationAudioStatus = "idle";
  state.dictationPromptHeard = false;
  state.dictationBrowserFallback = false;
  state.dictationPromptId++;
  state.dictationPromptStartedAt = null;
  state.dictationPromptEndedAt = null;
  state.dictationPromptDurationMs = 0;
  state.dictationTypedDuringPrompt = 0;
  state.dictationCorrectDuringPrompt = 0;
  state.dictationPromptRecorded = false;
  state.dictationFollowSamples = [];
  render();
  prepareDictationPrompt(requestId);
}

function finishDictationLine() {
  recordDictationPromptFollow();
  progress.rowsCleared++;
  save();
  finishTest();
}

function finishScripture() {
  const metrics = currentMetrics();
  updateLifetimeAverages(metrics);
  const savedResult = recordCompletedLesson(metrics.wpm, metrics.accuracy, { raw: metrics.raw, consistency: metrics.consistency, elapsedMs: metrics.elapsedMs });
  const finalPage = state.pageIndex >= state.scripturePages.length - 1;
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = finalPage ? "Lesson complete" : state.mode === "quote" ? "Quote cleared" : "Scripture cleared";
  els.completionBanner.classList.remove("hidden");
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    if (finalPage) {
      state.result = { ...savedResult, ...metrics };
      state.testCompleted = true;
      save();
      render();
      return;
    }
    state.input = "";
    state.lineErrors = 0;
    state.startedAt = null;
    state.charsTyped = 0;
    state.rawTyped = 0;
    state.errors = 0;
    state.keyIntervals = [];
    state.lastKeyAt = null;
    state.pageIndex++;
    render();
  }, 100);
}

function finishTest() {
  if (state.testCompleted || !state.startedAt) return;
  clearTestTimer();
  if (state.mode === "time") state.timeRemaining = 0;
  if (state.mode === "dictation") {
    window.speechSynthesis?.cancel();
    spokenReminderManager.stop();
  }
  let metrics = currentMetrics();
  const dictationEvaluation = state.mode === "dictation" ? dictationPromptEvaluation() : null;
  if (dictationEvaluation) {
    const elapsedMinutes = Math.max(1 / 60, metrics.elapsedMs / 60000);
    metrics = {
      ...metrics,
      raw: (dictationEvaluation.attempts / 5) / elapsedMinutes,
      accuracy: dictationEvaluation.accuracy,
      attempts: dictationEvaluation.attempts,
      errors: dictationEvaluation.errors
    };
  }
  const previousBest = progress.lessonHistory
    .filter(item => item?.mode === state.mode)
    .reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0);
  const dictationFollow = state.mode === "dictation" ? dictationFollowSummary() : {};
  const savedResult = recordCompletedLesson(metrics.wpm, metrics.accuracy, {
    raw: Number(metrics.raw.toFixed(1)),
    consistency: Number(metrics.consistency.toFixed(1)),
    elapsedMs: Math.round(metrics.elapsedMs),
    ...(dictationEvaluation ? {
      dictationCorrectCharacters: dictationEvaluation.correctCharacters,
      dictationErrors: dictationEvaluation.errors,
      dictationTargetCharacters: dictationEvaluation.targetCharacters,
      dictationSubmittedCharacters: dictationEvaluation.typedCharacters
    } : {}),
    ...dictationFollow
  });
  let failedReason = "";
  if (Number(prefs.minWpm) && metrics.wpm < Number(prefs.minWpm)) failedReason = `Below ${prefs.minWpm} WPM`;
  else if (Number(prefs.minAccuracy) && metrics.accuracy < Number(prefs.minAccuracy)) failedReason = `Below ${prefs.minAccuracy}% accuracy`;
  else if (Number(prefs.minBurst) && metrics.raw < Number(prefs.minBurst)) failedReason = `Below ${prefs.minBurst} WPM burst`;
  else if (prefs.difficulty === "master" && state.errors > 0) failedReason = "Master test missed a key";
  updateLifetimeAverages(metrics);
  state.result = { ...savedResult, ...metrics, failedReason, placement: state.mode === "placement", personalBest: !failedReason && metrics.wpm > previousBest };
  state.testCompleted = true;
  save();
  playReward(rowsPerPage);
  render();
}

let audioCtx;
let audioUnlockStarted = false;
function ctx() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function unlockAudio() {
  try {
    const c = ctx();
    if (c.state === "suspended") c.resume().catch(() => {});
    if (!audioUnlockStarted) {
      audioUnlockStarted = true;
      preloadKeySounds();
    }
    spokenReminderManager.unlock();
  } catch (error) {
    console.warn("Audio is unavailable.", error);
  }
}
function withAudioReady(action) {
  try {
    const c = ctx();
    if (c.state === "suspended") c.resume().then(() => action(c)).catch(() => {});
    else action(c);
  } catch (error) {
    console.warn("Audio is unavailable.", error);
  }
}
function tone(freq, dur, type = "square", gain = .045, delay = 0) {
  withAudioReady(c => {
    const start = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain * Number(prefs.soundVolume), start);
    g.gain.exponentialRampToValueAtTime(.0001, start + dur);
    osc.connect(g).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur);
  });
}
const activeReminderNodes = new Set();
function trackReminderNode(node) {
  activeReminderNodes.add(node);
  node.addEventListener("ended", () => activeReminderNodes.delete(node), { once: true });
  return node;
}
function stopReminderSound() {
  [...activeReminderNodes].forEach(node => {
    try { node.stop(); } catch (_) {}
  });
  activeReminderNodes.clear();
}
function playReminderSound(style = prefs.reminderSound) {
  unlockAudio();
  if (!reminderSoundStyles.has(style) || Number(prefs.soundVolume) <= 0) return;
  withAudioReady(c => {
    const strike = c.currentTime;
    const tones = {
      bike: [
        [1318.5, .22, .72, 0, "sine"],
        [1760, .12, .56, .02, "sine"],
        [1568, .1, .62, .13, "sine"]
      ],
      dinner: [
        [659.25, .22, 1.18, 0, "sine"],
        [1318.5, .12, .92, 0, "sine"],
        [1977.75, .06, .72, 0, "sine"],
        [2637, .035, .56, 0, "sine"]
      ],
      trumpet: [
        [392, .26, .5, 0, "sawtooth"],
        [784, .1, .42, 0, "triangle"],
        [1174.65, .055, .34, 0, "sine"]
      ]
    }[style];
    tones.forEach(([frequency, gainValue, duration, delay, type]) => {
      const start = strike + delay;
      const oscillator = c.createOscillator();
      const gain = c.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * .994, start + duration);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(gainValue * Number(prefs.soundVolume), start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain).connect(c.destination);
      trackReminderNode(oscillator);
      oscillator.start(start);
      oscillator.stop(start + duration + .02);
    });
  });
}

function cleanSpokenReminderText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[`*_>#\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

class SpokenReminderAudioManager {
  constructor() {
    this.queue = [];
    this.queuedIds = new Set();
    this.playedIds = new Set();
    this.cache = new Map();
    this.processing = false;
    this.unlocked = false;
    this.currentAudio = null;
    this.currentRequest = null;
    this.lastReminder = null;
    this.toastTimer = null;
    this.catalogLoaded = false;
    this.catalogAvailable = false;
    this.models = [];
    this.browserVoices = new Map();
  }

  apiBase() {
    return String(window.KD_TTS_API_BASE || "/api/tts").replace(/\/$/, "");
  }

  ttsConfig(options = {}) {
    return {
      modelId: String(options.modelId || prefs.reminderTtsModel),
      voiceId: String(options.voiceId || prefs.reminderVoiceId),
      language: String(options.language || prefs.reminderLanguage).toLowerCase(),
      volume: Number(options.volume ?? prefs.reminderVolume),
      scope: String(options.scope || "reminder")
    };
  }

  cacheKey(text, options = {}) {
    const config = this.ttsConfig(options);
    return JSON.stringify([
      cleanSpokenReminderText(text),
      config.modelId,
      config.voiceId,
      config.language,
      Number(config.volume).toFixed(2),
      config.scope
    ]);
  }

  enqueue({ id, text }, force = false) {
    if (!prefs.spokenRemindersEnabled) return;
    const cleanText = cleanSpokenReminderText(text);
    if (!cleanText) return;
    this.lastReminder = { id: String(id || `reminder-${Date.now()}`), text: cleanText };
    if (!force && (this.playedIds.has(this.lastReminder.id) || this.queuedIds.has(this.lastReminder.id))) return;
    this.playedIds.add(this.lastReminder.id);
    this.queuedIds.add(this.lastReminder.id);
    this.queue.push(this.lastReminder);
    if (!this.unlocked) {
      this.showToast("Spoken reminders are ready", "Click or press a key once to enable reminder audio.", false);
      return;
    }
    this.processQueue();
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.hideToast();
    this.processQueue();
  }

  resetSession() {
    this.queue = [];
    this.queuedIds.clear();
    this.playedIds.clear();
    this.lastReminder = null;
    this.stop();
  }

  stop() {
    this.currentRequest?.abort();
    this.currentRequest = null;
    if (this.currentAudio) {
      const audio = this.currentAudio;
      audio.pause();
      audio.dispatchEvent(new Event("ended"));
      audio.removeAttribute("src");
      audio.load();
      this.currentAudio = null;
    }
  }

  async processQueue() {
    if (this.processing || !this.unlocked || !prefs.spokenRemindersEnabled) return;
    this.processing = true;
    while (this.queue.length && this.unlocked && prefs.spokenRemindersEnabled) {
      const reminder = this.queue.shift();
      this.queuedIds.delete(reminder.id);
      try {
        await this.synthesizeAndPlay(reminder.text);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.warn("Spoken reminder could not play.", error);
          this.showToast("Reminder audio unavailable", reminder.text, true);
        }
      }
    }
    this.processing = false;
  }

  async synthesize(text, options = {}) {
    const config = this.ttsConfig(options);
    const controller = new AbortController();
    this.currentRequest = controller;
    try {
      const response = await fetch(`${this.apiBase()}/synthesize`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "audio/wav" },
        body: JSON.stringify({
          text: cleanSpokenReminderText(text),
          modelId: config.modelId,
          voiceId: config.voiceId,
          language: config.language
        })
      });
      if (!response.ok) {
        let detail = "Speech generation failed.";
        try { detail = (await response.json()).detail || detail; } catch (_) {}
        throw new Error(detail);
      }
      return response.blob();
    } finally {
      if (this.currentRequest === controller) this.currentRequest = null;
    }
  }

  cachedAudio(text, options = {}) {
    const key = this.cacheKey(text, options);
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.createdAt > 30 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }
    item.createdAt = Date.now();
    return item.blob;
  }

  async synthesizeAudio(text, options = {}) {
    const cached = this.cachedAudio(text, options);
    const blob = cached || await this.synthesize(text, options);
    if (!cached) {
      this.cache.set(this.cacheKey(text, options), { blob, createdAt: Date.now() });
      while (this.cache.size > 24) this.cache.delete(this.cache.keys().next().value);
    }
    return blob;
  }

  async synthesizeAndPlay(text, options = {}) {
    const voiceId = String(options.voiceId || prefs.reminderVoiceId);
    if (voiceId.startsWith("browser-")) {
      await this.playBrowserSpeech(text, options);
      return;
    }
    try {
      const blob = await this.synthesizeAudio(text, options);
      await this.playBlob(blob, options);
    } catch (error) {
      if (error?.name === "AbortError" || !("speechSynthesis" in window)) throw error;
      this.updateStatus("Chatterbox is unavailable; using the selected browser voice.");
      await this.playBrowserSpeech(text, options);
    }
  }

  async playBlob(blob, options = {}) {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = Math.max(0, Math.min(1, Number(options.volume ?? prefs.reminderVolume) || 0));
    this.currentAudio = audio;
    const speechWasSpeaking = !!window.speechSynthesis?.speaking;
    if (speechWasSpeaking) window.speechSynthesis.pause();
    try {
      await audio.play();
      await new Promise((resolve, reject) => {
        audio.addEventListener("ended", resolve, { once: true });
        audio.addEventListener("error", () => reject(new Error("Reminder audio playback failed.")), { once: true });
      });
    } finally {
      if (speechWasSpeaking) window.speechSynthesis.resume();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      URL.revokeObjectURL(url);
      if (this.currentAudio === audio) this.currentAudio = null;
    }
  }

  async playBrowserSpeech(text, options = {}) {
    if (!("speechSynthesis" in window)) throw new Error("Browser speech is unavailable.");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanSpokenReminderText(text));
    const voiceId = String(options.voiceId || prefs.reminderVoiceId);
    const voice = this.browserVoices.get(voiceId);
    if (voice) utterance.voice = voice;
    utterance.volume = Math.max(0, Math.min(1, Number(options.volume ?? prefs.reminderVolume) || 0));
    utterance.rate = Number(options.rate) || .92;
    utterance.pitch = Number(options.pitch) || 1;
    await new Promise((resolve, reject) => {
      utterance.onend = resolve;
      utterance.onerror = () => reject(new Error("Browser speech playback failed."));
      window.speechSynthesis.speak(utterance);
    });
  }

  async previewVoice() {
    if (!prefs.reminderVoiceId || !prefs.reminderTtsModel) {
      this.showToast("Choose a voice first", "Select an available model and voice in Audio settings.", false);
      return;
    }
    const button = els.previewReminderVoiceButton;
    if (button) {
      button.disabled = true;
      button.textContent = "Generating...";
    }
    try {
      this.unlock();
      await this.synthesizeAndPlay("Welcome to Keyboard Disciple. This is how your spoken reminders will sound.");
    } catch (error) {
      console.warn("Voice preview failed.", error);
      this.showToast("Voice preview unavailable", "Check the Chatterbox service and try again.", false);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Preview voice";
      }
    }
  }

  replayLastReminder() {
    if (this.lastReminder) this.enqueue(this.lastReminder, true);
  }

  async loadCatalog() {
    if (this.catalogLoaded) return;
    try {
      const response = await fetch(`${this.apiBase()}/models`, { credentials: "include", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Model catalog unavailable.");
      this.models = (await response.json()).models || [];
      this.catalogLoaded = true;
      this.catalogAvailable = this.models.length > 0;
      this.syncModelOptions();
      await this.syncVoices();
      this.updateStatus(this.catalogAvailable ? "Chatterbox voices ready." : "Browser voices ready while Chatterbox is unavailable.");
    } catch (error) {
      console.warn("Spoken reminder catalog unavailable.", error);
      this.catalogAvailable = false;
      this.syncModelOptions([]);
      this.syncFallbackVoiceOptions();
      this.updateStatus("Browser voices ready while Chatterbox is unavailable.");
    }
  }

  fallbackModels() {
    return [
      { id: "chatterbox-english", name: "Chatterbox English", description: "Expressive English voice" },
      { id: "chatterbox-turbo", name: "Chatterbox Turbo", description: "Fast English voice" },
      { id: "chatterbox-multilingual", name: "Chatterbox Multilingual", description: "Multilingual voice" }
    ];
  }

  syncModelOptions(models = this.models) {
    const select = els.reminderTtsModel;
    if (!select) return;
    select.replaceChildren();
    const availableModels = models.length ? models : this.fallbackModels();
    select.disabled = false;
    availableModels.forEach(model => select.add(new Option(`${model.name} - ${model.description}`, model.id)));
    const selected = availableModels.some(model => model.id === prefs.reminderTtsModel)
      ? prefs.reminderTtsModel
      : availableModels.some(model => model.id === "chatterbox-english")
        ? "chatterbox-english"
        : availableModels[0].id;
    prefs.reminderTtsModel = selected;
    select.value = selected;
    this.syncLanguageVisibility();
  }

  async syncVoices() {
    const select = els.reminderVoiceId;
    if (!select || !prefs.reminderTtsModel) return;
    try {
      const response = await fetch(`${this.apiBase()}/voices?model=${encodeURIComponent(prefs.reminderTtsModel)}&language=${encodeURIComponent(prefs.reminderLanguage)}`, {
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Voice catalog unavailable.");
      const voices = (await response.json()).voices || [];
      if (!voices.length) {
        if (this.catalogAvailable && prefs.reminderTtsModel === "chatterbox-turbo") {
          prefs.reminderTtsModel = "chatterbox-english";
          if (els.reminderTtsModel) els.reminderTtsModel.value = prefs.reminderTtsModel;
          save();
          return this.syncVoices();
        }
        this.catalogAvailable = false;
        this.syncFallbackVoiceOptions();
        this.updateStatus("No approved Chatterbox voice is available; using browser voices.");
        return voices;
      }
      this.catalogAvailable = true;
      select.replaceChildren();
      voices.forEach(voice => select.add(new Option(voice.description ? `${voice.name} - ${voice.description}` : voice.name, voice.id)));
      select.disabled = false;
      if (voices.some(voice => voice.id === prefs.reminderVoiceId)) select.value = prefs.reminderVoiceId;
      else if (voices[0]) {
        prefs.reminderVoiceId = voices[0].id;
        select.value = prefs.reminderVoiceId;
        save();
      }
      this.updateStatus("Chatterbox voice selected.");
      return voices;
    } catch (error) {
      this.catalogAvailable = false;
      this.syncFallbackVoiceOptions();
      this.updateStatus("Browser voices ready while Chatterbox is unavailable.");
      return [];
    }
  }

  syncFallbackVoiceOptions() {
    const select = els.reminderVoiceId;
    if (!select) return;
    this.browserVoices = new Map([["browser-default", null]]);
    const browserVoices = "speechSynthesis" in window ? window.speechSynthesis.getVoices() : [];
    const preferredLanguage = String(prefs.reminderLanguage || "en").toLowerCase();
    const matchingVoices = browserVoices.filter(voice => String(voice.lang || "").toLowerCase().startsWith(preferredLanguage));
    const voices = matchingVoices.length ? matchingVoices : browserVoices;
    select.replaceChildren(new Option("Browser default voice", "browser-default"));
    voices.forEach((voice, index) => {
      const id = `browser-${index}-${voice.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
      this.browserVoices.set(id, voice);
      select.add(new Option(`${voice.name}${voice.lang ? ` (${voice.lang})` : ""}`, id));
    });
    select.disabled = false;
    const selected = this.browserVoices.has(prefs.reminderVoiceId) ? prefs.reminderVoiceId : "browser-default";
    prefs.reminderVoiceId = selected;
    select.value = selected;
    save();
  }

  syncLanguageVisibility() {
    const multilingual = prefs.reminderTtsModel === "chatterbox-multilingual";
    if (els.reminderLanguageRow) els.reminderLanguageRow.hidden = !multilingual;
    if (!multilingual) prefs.reminderLanguage = "en";
    if (els.reminderLanguage) els.reminderLanguage.value = prefs.reminderLanguage;
  }

  updateStatus(message) {
    if (els.spokenReminderStatus) els.spokenReminderStatus.textContent = message;
  }

  showToast(title, text, retry) {
    if (!els.spokenReminderToast) return;
    els.spokenReminderToastTitle.textContent = title;
    els.spokenReminderToastText.textContent = text;
    els.spokenReminderRetryButton.classList.toggle("hidden", !retry);
    els.spokenReminderToast.classList.remove("hidden");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.hideToast(), retry ? 9000 : 5000);
  }

  hideToast() {
    clearTimeout(this.toastTimer);
    els.spokenReminderToast?.classList.add("hidden");
  }
}

const spokenReminderManager = new SpokenReminderAudioManager();
window.KeyboardDiscipleSpokenReminders = {
  stop: () => spokenReminderManager.stop(),
  resetSession: () => spokenReminderManager.resetSession(),
  unlock: () => spokenReminderManager.unlock()
};
function playDecodedBuffer(buffer, gainValue = 1) {
  if (!buffer) return false;
  const c = ctx();
  const play = () => {
    try {
      const source = c.createBufferSource();
      const gain = c.createGain();
      source.buffer = buffer;
      gain.gain.value = gainValue * Number(prefs.soundVolume);
      source.connect(gain).connect(c.destination);
      source.start();
    } catch (error) {
      console.warn("Audio buffer could not play.", error);
    }
  };
  if (c.state === "suspended") c.resume().then(play).catch(() => {});
  else play();
  return true;
}

const keyboardCodeSemitones = {
  KeyZ: 0, KeyS: 1, KeyX: 2, KeyD: 3, KeyC: 4, KeyV: 5, KeyG: 6, KeyB: 7,
  KeyH: 8, KeyN: 9, KeyJ: 10, KeyM: 11, Comma: 12, KeyL: 13, Period: 14,
  Semicolon: 15, Slash: 16, KeyQ: 12, Digit2: 13, KeyW: 14, Digit3: 15, KeyE: 16,
  KeyR: 17, Digit5: 18, KeyT: 19, Digit6: 20, KeyY: 21, Digit7: 22, KeyU: 23,
  KeyI: 24, Digit9: 25, KeyO: 26, Digit0: 27, KeyP: 28, BracketLeft: 29,
  Equal: 30, BracketRight: 31
};
const oscillatorSoundStyles = { 8: "sine", 9: "sawtooth", 10: "square", 11: "triangle" };
const scaleSoundStyles = { 12: [0, 2, 4, 7, 9], 13: [0, 2, 4, 6, 8, 10] };
const scaleSoundState = {
  12: { octave: 4, direction: 1 },
  13: { octave: 4, direction: 1 }
};

function playMappedTone(code = "KeyQ", oscillatorType = "sine", shifted = false) {
  withAudioReady(c => {
    const semitone = (keyboardCodeSemitones[code] ?? keyboardCodeSemitones.KeyQ) + (shifted ? 12 : 0);
    const frequency = 130.81 * (2 ** (semitone / 12));
    const oscillator = c.createOscillator();
    const gain = c.createGain();
    oscillator.type = oscillatorType;
    oscillator.frequency.value = frequency;
    gain.gain.value = Number(prefs.soundVolume) / 10;
    oscillator.connect(gain).connect(c.destination);
    oscillator.start(c.currentTime);
    gain.gain.setTargetAtTime(0, c.currentTime, .15);
    oscillator.stop(c.currentTime + .5);
  });
}

function playScaleSound(style) {
  const notes = scaleSoundStyles[style];
  const scale = scaleSoundState[style];
  if (!notes || !scale) return;
  if (Math.random() < .5) scale.octave += scale.direction;
  if (scale.octave >= 6) scale.direction = -1;
  if (scale.octave <= 4) scale.direction = 1;
  const semitone = notes[Math.floor(Math.random() * notes.length)] || 0;
  const frequency = 261.63 * (2 ** (scale.octave - 4)) * (2 ** (semitone / 12));
  withAudioReady(c => {
    const oscillator = c.createOscillator();
    const gain = c.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = Number(prefs.soundVolume) / 10;
    oscillator.connect(gain).connect(c.destination);
    oscillator.start(c.currentTime);
    gain.gain.setTargetAtTime(0, c.currentTime, .3);
    oscillator.stop(c.currentTime + 2);
  });
}

function playKey(code = "KeyQ", shifted = false) {
  unlockAudio();
  const style = prefs.soundStyle;
  if (style === "off") return;
  if (oscillatorSoundStyles[style]) {
    playMappedTone(code, oscillatorSoundStyles[style], shifted);
    return;
  }
  if (scaleSoundStyles[style]) {
    playScaleSound(style);
    return;
  }
  const buffers = keyboardSoundBuffers[style];
  if (!buffers?.length) {
    ensureKeySoundStyle(style);
    playMappedTone(code, "square", shifted);
    return;
  }
  playDecodedBuffer(buffers[Math.floor(Math.random() * buffers.length)]);
}

function playError() {
  unlockAudio();
  const style = prefs.errorStyle;
  if (style === "off") return;
  const buffers = errorSoundBuffers[style];
  if (!buffers?.length) {
    ensureErrorSoundStyle(style);
    tone(165, .075, "square", .065);
    return;
  }
  playDecodedBuffer(buffers[Math.floor(Math.random() * buffers.length)]);
}

function playTimeWarning() {
  if (!timeWarningBuffer) {
    ensureTimeWarningSound();
    return;
  }
  playDecodedBuffer(timeWarningBuffer);
}

function numberedSoundFiles(folder, count) {
  return Array.from({ length: count }, (_, index) => `assets/keyboard-sounds/${folder}/${index + 1}.wav`);
}

const keyboardSoundFiles = {
  1: numberedSoundFiles("click", 3),
  2: numberedSoundFiles("beep", 3),
  3: numberedSoundFiles("pop", 3),
  4: numberedSoundFiles("nk-creams", 6),
  5: numberedSoundFiles("typewriter", 6),
  6: numberedSoundFiles("osu", 3),
  7: numberedSoundFiles("hitmarker", 3),
  14: numberedSoundFiles("fist-fight", 8),
  15: numberedSoundFiles("rubber-keys", 5),
  16: numberedSoundFiles("fart", 8),
  17: numberedSoundFiles("akko-lavenders", 10),
  18: numberedSoundFiles("cherrymx-black-abs", 10),
  19: numberedSoundFiles("cherrymx-black-pbt", 10),
  20: numberedSoundFiles("cherrymx-blue-abs", 10),
  21: numberedSoundFiles("cherrymx-blue-pbt", 10),
  22: numberedSoundFiles("cherrymx-brown-pbt", 10),
  23: numberedSoundFiles("kailh-box-white", 10),
  24: numberedSoundFiles("razer-green", 10),
  25: numberedSoundFiles("tealios-v2", 10),
  26: numberedSoundFiles("trust-gxt", 10)
};
const errorSoundFiles = {
  1: numberedSoundFiles("error-damage", 1),
  2: numberedSoundFiles("error-triangle", 1),
  3: numberedSoundFiles("error-square", 1),
  4: numberedSoundFiles("error-missed-punch", 2)
};
const keyboardSoundBuffers = {};
const keyboardSoundLoading = {};
const errorSoundBuffers = {};
const errorSoundLoading = {};
const decodedAudioPromises = new Map();
let timeWarningBuffer;
let timeWarningLoading;

async function ensureKeySoundStyle(style) {
  if (!keyboardSoundFiles[style] || keyboardSoundBuffers[style]) return;
  if (keyboardSoundLoading[style]) return keyboardSoundLoading[style];
  keyboardSoundLoading[style] = Promise.all(keyboardSoundFiles[style].map(decodeAudioFile)).then(decoded => {
    keyboardSoundBuffers[style] = decoded;
  }).catch(error => {
    delete keyboardSoundLoading[style];
    console.warn(`Keyboard sound ${style} could not be loaded.`, error);
  });
  return keyboardSoundLoading[style];
}

async function ensureErrorSoundStyle(style) {
  if (!errorSoundFiles[style] || errorSoundBuffers[style]) return;
  if (errorSoundLoading[style]) return errorSoundLoading[style];
  errorSoundLoading[style] = Promise.all(errorSoundFiles[style].map(decodeAudioFile)).then(decoded => {
    errorSoundBuffers[style] = decoded;
  }).catch(error => {
    delete errorSoundLoading[style];
    console.warn(`Error sound ${style} could not be loaded.`, error);
  });
  return errorSoundLoading[style];
}

async function ensureTimeWarningSound() {
  if (timeWarningBuffer) return;
  timeWarningLoading ||= decodeAudioFile("assets/keyboard-sounds/time-warning.wav").then(decoded => {
    timeWarningBuffer = decoded;
  }).catch(error => {
    timeWarningLoading = null;
    console.warn("Time warning sound could not be loaded.", error);
  });
  return timeWarningLoading;
}

async function preloadKeySounds() {
  await Promise.all([
    ensureKeySoundStyle(prefs.soundStyle),
    ensureKeySoundStyle("4"),
    ensureErrorSoundStyle(prefs.errorStyle),
    prefs.timeWarning === "off" ? Promise.resolve() : ensureTimeWarningSound()
  ]);
}

const rowRewardFiles = Array.from({ length: 9 }, (_, index) => `assets/Shout_${index + 1}.wav`);
const specialRewardFile = "assets/Shout_Special.wav";
const rowRewardBuffers = [];
const activeRewardNodes = new Set();
let specialRewardBuffer;

async function decodeAudioFile(file) {
  const url = new URL(file, document.baseURI).href;
  if (decodedAudioPromises.has(url)) return decodedAudioPromises.get(url);
  const promise = fetch(url, { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`Could not load ${file}`);
      return response.arrayBuffer();
    })
    .then(buffer => ctx().decodeAudioData(buffer))
    .catch(error => {
      decodedAudioPromises.delete(url);
      throw error;
    });
  decodedAudioPromises.set(url, promise);
  return promise;
}

async function preloadRewardSounds() {
  if (rowRewardBuffers.length === rowRewardFiles.length && specialRewardBuffer) return;
  try {
    const buffers = await Promise.all([...rowRewardFiles, specialRewardFile].map(decodeAudioFile));
    rowRewardBuffers.splice(0, rowRewardBuffers.length, ...buffers.slice(0, rowRewardFiles.length));
    specialRewardBuffer = buffers.at(-1);
  } catch (error) {
    console.warn("Reward sounds could not be preloaded.", error);
  }
}

function trackRewardNode(node) {
  activeRewardNodes.add(node);
  node.addEventListener("ended", () => activeRewardNodes.delete(node), { once: true });
  return node;
}

function stopRewardSound() {
  [...activeRewardNodes].forEach(node => {
    try { node.stop(); } catch (_) {}
  });
  activeRewardNodes.clear();
}

function playRewardBuffer(buffer, gainValue = .75, delay = 0, rate = 1) {
  if (!buffer) return false;
  const c = ctx();
  if (c.state === "suspended") c.resume().catch(() => {});
  const source = trackRewardNode(c.createBufferSource());
  const gain = c.createGain();
  source.buffer = buffer;
  source.playbackRate.value = rate;
  gain.gain.value = gainValue * Number(prefs.soundVolume);
  source.connect(gain).connect(c.destination);
  source.start(c.currentTime + delay);
  return true;
}

function rewardTone(freq, dur, type, gainValue, delay = 0) {
  const c = ctx();
  if (c.state === "suspended") c.resume().catch(() => {});
  const start = c.currentTime + delay;
  const osc = trackRewardNode(c.createOscillator());
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainValue * Number(prefs.soundVolume), start);
  gain.gain.exponentialRampToValueAtTime(.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur);
}

function rewardKeySamples() {
  const preferred = keyboardSoundFiles[prefs.soundStyle] ? prefs.soundStyle : "4";
  return keyboardSoundBuffers[preferred] || keyboardSoundBuffers["4"] || keyboardSoundBuffers["1"] || [];
}

function playKeyBloom(isSection) {
  const samples = rewardKeySamples();
  const taps = isSection
    ? [[0, 1, .42], [.045, 1.12, .38], [.09, 1.28, .34], [.135, 1.5, .3]]
    : [[0, 1, .42], [.055, 1.2, .32]];
  taps.forEach(([delay, rate, gain], index) => playRewardBuffer(samples[index % samples.length], gain, delay, rate));
  const notes = isSection
    ? [[523.25, 0], [659.25, .055], [783.99, .11], [1046.5, .165]]
    : [[659.25, .015], [987.77, .065]];
  notes.forEach(([freq, delay], index) => rewardTone(freq, isSection ? .28 : .16, "sine", isSection ? .027 : .021 - index * .004, delay));
}

function playGlassKeys(isSection) {
  const notes = isSection
    ? [[523.25, 0, .032], [659.25, .065, .028], [783.99, .13, .025], [1046.5, .195, .022]]
    : [[783.99, 0, .027], [1174.66, .065, .019]];
  notes.forEach(([freq, delay, gain]) => rewardTone(freq, isSection ? .38 : .22, "sine", gain, delay));
}

function playReward(completedRow) {
  stopReminderSound();
  stopRewardSound();
  const isSection = completedRow === rowsPerPage;
  if (prefs.rewardStyle === "key-bloom") {
    playKeyBloom(isSection);
    return;
  }
  if (prefs.rewardStyle === "glass-keys") {
    playGlassKeys(isSection);
    return;
  }
  const preacherReward = isSection ? specialRewardBuffer : rowRewardBuffers[completedRow - 1];
  if (!playRewardBuffer(preacherReward, .82)) playKeyBloom(isSection);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
}

const settingDescriptions = {
  practiceMode: "Changes the active typing experience. Dictation plays a hidden sentence while you type, then scores the submitted answer for speed, accuracy, errors, and follow rate.",
  testDuration: "Sets the length of timed tests.",
  lessonLengthPages: "Sets how many ten-line pages a lesson runs before results are shown. This applies across practice modes.",
  testWordCount: "Keeps a custom word-count value available for word challenges; Lesson length controls the standard page cap.",
  dictationPromptCount: "Keeps a custom prompt-count value available for Dictation; Lesson length controls the standard page cap.",
  dictationCapitalization: "Choose whether Dictation requires uppercase letters or accepts the same words in lowercase.",
  dictationPunctuation: "Choose whether Dictation requires punctuation or accepts the spoken words without sentence marks.",
  quoteLength: "Limits general quotes to the selected length range.",
  difficulty: "Controls how broad and challenging the regular word pool is.",
  capitalization: "Controls letter case in generated practice outside Scripture.",
  quickRestart: "Assigns one key to restart the current test immediately.",
  creativeMode: "Chooses the word or character transformation used by Creative tests.",
  repeatQuotes: "Chooses whether restart loads a new quote or repeats the current one.",
  resultSaving: "Turns local lesson-history saving on or off. Adaptive progress requires saved results.",
  minWpm: "Marks a completed test as failed when corrected speed is below this value.",
  minAccuracy: "Marks a completed test as failed when accuracy is below this value.",
  minBurst: "Marks a completed test as failed when raw speed is below this value.",
  indicateTypos: "Controls how a blocked incorrect key is shown. Incorrect letters are never added.",
  includePunctuation: "Adds sentence marks to generated Time and Words tests.",
  includeNumbers: "Mixes number groups into generated Time and Words tests.",
  practicePreset: "Sets the default adaptive focus. The lesson summary can combine up to three suggested focuses before the next lesson begins.",
  confidenceMode: "Limits backspacing to the current word or disables it completely.",
  errorLimit: "Caps repeated errors on one character so accidental key holds cannot ruin statistics.",
  blindMode: "Hides feedback on completed characters to encourage rhythm over correction.",
  quickEnd: "Lets Enter finish an active scored test early.",
  capsLockWarning: "Warns when Caps Lock would make the expected letter case incorrect.",
  focusMode: "Dims controls and statistics while a test is active.",
  freedomMode: "Allows backspacing into any previous word unless backspace is fully disabled.",
  strictSpace: "Treats an early or extra space as a blocked mistake.",
  oppositeShiftMode: "Requires the opposite hand to supply Shift for capital letters.",
  britishEnglish: "Uses familiar British spellings in generated English word tests.",
  lazyMode: "Lets accented characters use their unaccented equivalent.",
  theme: "Changes the color and contrast style of the whole app.",
  fontFamily: "Changes the website typeface from the app's broad typography catalog.",
  lessonColor: "Changes the color used by lesson text, the active character, and its glow.",
  currentCue: "Chooses how the exact character you need to type is marked.",
  caretStyle: "Changes the shape used to show the current typing position.",
  smoothCaret: "Controls how quickly the caret animates between characters.",
  typedEffect: "Chooses how completed text remains visible. Hide waits until the whole word is finished.",
  highlightMode: "Chooses whether the current letter, word, next word, or nothing is emphasized.",
  fontSize: "Changes the size of the typing text.",
  lineWidth: "Controls the maximum width of the typing area.",
  tapeMode: "Limits practice to one horizontally followed line, moving by word or letter.",
  timerStyle: "Shows timed-test progress as text, a bar, both, or neither.",
  speedUnit: "Displays speed as words, characters, or words per second.",
  showLiveWpm: "Shows current corrected typing speed during a test.",
  showLiveAccuracy: "Shows current accuracy during a test.",
  showLiveRaw: "Shows speed before accuracy penalties.",
  showLiveConsistency: "Shows how evenly spaced your keystrokes are.",
  rhythmCoach: "Keeps the consistency readout visible and adds timing guidance during practice.",
  techniqueTips: "Shows brief reminders for relaxed hands, home-row position, accuracy, and breaks.",
  showProgress: "Shows test completion percentage or remaining time.",
  smoothLineScroll: "Animates the four-line practice window when a line is completed.",
  textGlow: "Adds a restrained glow to typed and current text.",
  flipTestColors: "Swaps the emphasis of typed and untyped characters.",
  colorfulMode: "Uses the current theme accent for completed text.",
  keyboardLayout: "Changes the labels and key arrangement of the on-screen keyboard.",
  keyboardSize: "Changes the on-screen keyboard scale.",
  keymapMode: "Shows pressed keys, the next key, a static keyboard, or no keyboard.",
  keymapStyle: "Displays the keyboard as staggered, matrix, or split rows.",
  keymapLegend: "Shows uppercase, lowercase, or blank letter keys.",
  soundStyle: "Chooses the keystroke sound played for accepted keys.",
  soundVolume: "Sets the volume of keystrokes, errors, warnings, reminders, and rewards.",
  rewardStyle: "Chooses the sound used when a line or full section is completed.",
  reminderSound: "Chooses the cue that appears during the middle of a practice row with a posture or breathing reminder.",
  errorStyle: "Chooses the sound played when an incorrect key is blocked.",
  timeWarning: "Chooses how many seconds before a timed test ends to play a warning.",
  typingSounds: "Turns accepted-keystroke sounds on or off without changing the selected sound.",
  errorSounds: "Turns blocked-error sounds on or off without changing the selected sound.",
  practiceLetters: "Sets the starting alphabet size. Automatic unlocks still require confidence evidence.",
  targetSpeed: "Sets the per-letter speed needed for full confidence and the next automatic unlock.",
  recoverKeys: "Requires every earned letter to be currently above target before the next one unlocks.",
  naturalWords: "Keeps adaptive lessons inside the curated natural vocabulary; off broadens that vocabulary without using nonsense strings.",
  wordsPerRow: "Sets the maximum word count per row. Larger text sizes automatically use fewer words so each row stays on one line.",
  dailyGoalMinutes: "Sets the amount of active typing time needed to complete the daily goal."
};

function installSettingDescriptions() {
  Object.entries(settingDescriptions).forEach(([id, description]) => {
    const control = document.getElementById(id);
    const label = control?.closest("label");
    if (!control || !label || label.querySelector(`[data-setting-help="${id}"]`)) return;
    const help = document.createElement("small");
    help.className = "setting-help";
    help.id = `settingHelp-${id}`;
    help.dataset.settingHelp = id;
    help.textContent = description;
    label.appendChild(help);
    control.setAttribute("aria-describedby", help.id);
  });
}

function setupSettings() {
  const practiceLetters = document.getElementById("practiceLetters");
  for (let i = startLetters; i <= 26; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${i} letters`;
    if (i === Number(prefs.practiceLetters)) opt.selected = true;
    practiceLetters.appendChild(opt);
  }

  const creativeMode = document.getElementById("creativeMode");
  creativeCatalog.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    creativeMode.appendChild(option);
  });

  const fontFamily = document.getElementById("fontFamily");
  fontCatalog.forEach(font => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = fontDisplayName(font);
    fontFamily.appendChild(option);
  });

  const bibleBook = document.getElementById("bibleBook");
  books.forEach(book => {
    const option = document.createElement("option");
    option.value = book;
    option.textContent = book;
    bibleBook.appendChild(option);
  });

  function updateCreativeDescription() {
    const selected = creativeCatalog.find(item => item.id === prefs.creativeMode) || creativeCatalog[0];
    const description = document.getElementById("creativeModeDescription");
    if (description) description.textContent = selected.description;
  }

  function updatePracticePresetDescription() {
    const description = document.getElementById("practicePresetDescription");
    if (description) description.textContent = practicePresetDescriptions[prefs.practicePreset] || practicePresetDescriptions.balanced;
  }

  const selectIds = [
    "practiceMode", "testDuration", "lessonLengthPages", "testWordCount", "dictationPromptCount", "dictationCapitalization", "dictationPunctuation", "quoteLength", "difficulty", "creativeMode", "capitalization", "quickRestart",
    "repeatQuotes", "resultSaving", "minWpm", "minAccuracy", "minBurst", "indicateTypos", "confidenceMode", "errorLimit",
    "theme", "fontFamily", "lessonColor", "currentCue", "caretStyle", "smoothCaret", "typedEffect", "highlightMode", "fontSize",
    "lineWidth", "tapeMode", "timerStyle", "speedUnit", "keyboardLayout", "keyboardSize", "keymapMode", "keymapStyle",
    "keymapLegend", "soundStyle", "soundVolume", "rewardStyle", "reminderSound", "errorStyle", "timeWarning", "practiceLetters",
    "targetSpeed", "practicePreset", "wordsPerRow", "dailyGoalMinutes", "bibleBook", "bibleChapter", "bibleStart", "bibleEnd"
  ];
  const prefKeys = { practiceMode: "mode" };
  const numericIds = new Set([
    "testDuration", "lessonLengthPages", "testWordCount", "dictationPromptCount", "minWpm", "minAccuracy", "minBurst", "errorLimit", "soundVolume", "practiceLetters",
    "targetSpeed", "wordsPerRow", "dailyGoalMinutes", "bibleChapter", "bibleStart", "bibleEnd"
  ]);
  const restartIds = new Set([
    "practiceMode", "testDuration", "lessonLengthPages", "testWordCount", "dictationPromptCount", "dictationCapitalization", "dictationPunctuation", "quoteLength", "difficulty", "creativeMode", "capitalization",
    "practiceLetters", "targetSpeed", "practicePreset", "wordsPerRow", "bibleBook", "bibleChapter", "bibleStart", "bibleEnd"
  ]);
  const keyboardIds = new Set(["keyboardLayout", "keyboardSize", "keymapMode", "keymapStyle", "keymapLegend"]);

  selectIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefKey = prefKeys[id] || id;
    el.value = prefs[prefKey];
    el.addEventListener("change", event => {
      prefs[prefKey] = numericIds.has(id) ? Number(event.target.value) : event.target.value;
      if (["fontSize", "lineWidth", "fontFamily"].includes(id)) {
        state.practiceFontSize = null;
        state.practiceFitSignature = "";
      }
      if (id === "testWordCount") {
        prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(prefs.testWordCount || defaultPrefs.testWordCount)));
        event.target.value = String(prefs.testWordCount);
      }
      if (id === "dictationPromptCount") {
        prefs.dictationPromptCount = Math.max(5, Math.min(30, Math.round(prefs.dictationPromptCount || defaultPrefs.dictationPromptCount)));
        event.target.value = String(prefs.dictationPromptCount);
      }
      if (id === "lessonLengthPages") {
        prefs.lessonLengthPages = Math.max(1, Math.min(100, Math.round(prefs.lessonLengthPages || defaultPrefs.lessonLengthPages)));
        event.target.value = String(prefs.lessonLengthPages);
      }
      if (["bibleStart", "bibleEnd"].includes(id) && prefs.bibleEnd < prefs.bibleStart) {
        prefs.bibleEnd = prefs.bibleStart;
        document.getElementById("bibleEnd").value = String(prefs.bibleEnd);
      }
      if (id === "practiceMode") state.mode = prefs.mode;
      if (id === "practicePreset") prefs.practicePresets = [prefs.practicePreset];
      save();
      if (id === "theme") applyTheme();
      if (id === "fontFamily") applyFont();
      if (id === "creativeMode") updateCreativeDescription();
      if (id === "practicePreset") updatePracticePresetDescription();
      if (id === "soundStyle") {
        ensureKeySoundStyle(prefs.soundStyle).then(() => {
          if (prefs.typingSounds) playKey();
        });
      } else if (id === "rewardStyle") {
        stopRewardSound();
        playReward(1);
      } else if (id === "reminderSound") {
        playReminderSound();
      } else if (id === "errorStyle" && prefs.errorSounds) {
        ensureErrorSoundStyle(prefs.errorStyle).then(playError);
      } else if (id === "timeWarning" && prefs.timeWarning !== "off") {
        ensureTimeWarningSound().then(playTimeWarning);
      }
      if (restartIds.has(id)) restart();
      else if (keyboardIds.has(id)) render();
      else {
        applyDisplayPreferences();
        renderText();
        renderLiveMetrics();
        renderPerformance();
      }
    });
  });

  const toggleIds = [
    "includePunctuation", "includeNumbers", "blindMode", "quickEnd", "capsLockWarning", "focusMode", "showLiveWpm",
    "freedomMode", "strictSpace", "oppositeShiftMode", "britishEnglish", "lazyMode", "showLiveAccuracy", "showLiveRaw",
    "showLiveConsistency", "rhythmCoach", "techniqueTips", "showProgress", "smoothLineScroll", "textGlow", "flipTestColors", "colorfulMode", "typingSounds",
    "errorSounds", "recoverKeys", "naturalWords"
  ];
  toggleIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = !!prefs[id];
    el.addEventListener("change", event => {
      prefs[id] = event.target.checked;
      save();
      if (["includePunctuation", "includeNumbers", "britishEnglish", "lazyMode", "recoverKeys", "naturalWords"].includes(id)) restart();
      else render();
    });
  });

  els.settingsBtn.addEventListener("click", () => {
    hideProgressPeek();
    els.settingsDialog.showModal();
    spokenReminderManager.loadCatalog();
  });
  els.settingsDialog.querySelectorAll("[data-settings-jump]").forEach(button => {
    button.addEventListener("click", () => {
      const target = els.settingsDialog.querySelector(`[data-settings-panel="${button.dataset.settingsJump}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      els.settingsDialog.querySelectorAll("[data-settings-jump]").forEach(item => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  updateCreativeDescription();
  updatePracticePresetDescription();
  installSettingDescriptions();
}

function setupSpokenReminderSettings() {
  if (!els.spokenRemindersEnabled) return;
  els.spokenRemindersEnabled.checked = prefs.spokenRemindersEnabled;
  els.reminderTtsModel.value = prefs.reminderTtsModel;
  els.reminderVoiceId.value = prefs.reminderVoiceId;
  els.reminderLanguage.value = prefs.reminderLanguage;
  els.reminderVolume.value = String(prefs.reminderVolume);
  spokenReminderManager.syncLanguageVisibility();
  spokenReminderManager.updateStatus(prefs.spokenRemindersEnabled ? "Spoken reminders are off until a service is connected." : "Spoken reminders are off.");

  els.spokenRemindersEnabled.addEventListener("change", event => {
    prefs.spokenRemindersEnabled = event.target.checked;
    save();
    if (!prefs.spokenRemindersEnabled) spokenReminderManager.resetSession();
    else spokenReminderManager.loadCatalog();
    spokenReminderManager.updateStatus(prefs.spokenRemindersEnabled ? "Spoken reminders are enabled." : "Spoken reminders are off.");
  });
  els.reminderTtsModel.addEventListener("change", async event => {
    prefs.reminderTtsModel = event.target.value;
    save();
    spokenReminderManager.syncLanguageVisibility();
    try { await spokenReminderManager.syncVoices(); }
    catch (error) { spokenReminderManager.updateStatus("Voice list is unavailable."); }
  });
  els.reminderVoiceId.addEventListener("change", event => {
    prefs.reminderVoiceId = event.target.value;
    save();
    spokenReminderManager.cache.clear();
  });
  els.reminderLanguage.addEventListener("change", async event => {
    prefs.reminderLanguage = event.target.value;
    save();
    try { await spokenReminderManager.syncVoices(); }
    catch (error) { spokenReminderManager.updateStatus("Voice list is unavailable."); }
  });
  els.reminderVolume.addEventListener("input", event => {
    prefs.reminderVolume = Math.max(0, Math.min(1, Number(event.target.value)));
    save();
  });
  els.previewReminderVoiceButton.addEventListener("click", () => spokenReminderManager.previewVoice());
  els.replayReminderButton.addEventListener("click", () => spokenReminderManager.replayLastReminder());
  els.spokenReminderRetryButton.addEventListener("click", () => {
    spokenReminderManager.hideToast();
    if (state.mode === "dictation") {
      if (state.dictationAudioBlob) playDictationPrompt();
      else prepareDictationPrompt(restartRequestId);
    } else spokenReminderManager.replayLastReminder();
  });
  window.speechSynthesis?.addEventListener("voiceschanged", () => {
    if (!spokenReminderManager.catalogAvailable) spokenReminderManager.syncFallbackVoiceOptions();
  });
}

els.dictationReplayButton?.addEventListener("click", () => {
  unlockAudio();
  if (isListenCloselyMode()) {
    speakCurrentTarget();
    return;
  }
  if (state.dictationAudioStatus === "error" && !state.dictationAudioBlob) {
    prepareDictationPrompt(restartRequestId);
    return;
  }
  playDictationPrompt();
});

els.dictationSubmitButton?.addEventListener("click", () => {
  if (state.mode === "dictation" && state.input.length) finishDictationLine();
});

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function syncFullscreenButton() {
  const active = !!fullscreenElement();
  const label = active ? "Exit fullscreen" : "Enter fullscreen";
  els.fullscreenBtn.title = label;
  els.fullscreenBtn.setAttribute("aria-label", label);
  els.fullscreenBtn.setAttribute("aria-pressed", String(active));
  els.fullscreenBtn.classList.toggle("active", active);
  document.body.classList.toggle("is-fullscreen", active);
}

async function toggleFullscreen() {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  try {
    if (fullscreenElement()) await exit?.call(document);
    else await request?.call(root);
  } catch (error) {
    console.warn("Fullscreen mode is unavailable.", error);
  }
}

let progressPeekPointerId = null;
let progressPeekDialogOpen = false;

function showProgressPeek(event) {
  if (event?.pointerType === "mouse" && event.button !== 0) return;
  event?.preventDefault();
  progressPeekPointerId = event?.pointerId ?? null;
  progressPeekDialogOpen = false;
  if (event?.currentTarget?.setPointerCapture && progressPeekPointerId !== null) {
    try { event.currentTarget.setPointerCapture(progressPeekPointerId); }
    catch (_) { /* Pointer capture is best effort for older browsers. */ }
  }
  if (state.mode === "adaptive") {
    renderLetterProgress();
    document.body.classList.add("progress-peek-active");
    return;
  }
  if (!els.statsDialog.open) {
    els.statsDialog.showModal();
    progressPeekDialogOpen = true;
  }
}

function hideProgressPeek(event) {
  if (progressPeekPointerId === null && !progressPeekDialogOpen && !document.body.classList.contains("progress-peek-active")) return;
  if (progressPeekPointerId !== null && event?.pointerId !== undefined && event.pointerId !== progressPeekPointerId) return;
  document.body.classList.remove("progress-peek-active");
  if (progressPeekDialogOpen && els.statsDialog.open) els.statsDialog.close();
  progressPeekPointerId = null;
  progressPeekDialogOpen = false;
}

function startErrorReview() {
  if (!progress.errorReview.length) return;
  prefs.mode = "adaptive";
  prefs.practicePreset = "accuracy";
  state.mode = "adaptive";
  els.statsDialog.close();
  save();
  restart();
}

function startRecommendedAdaptiveFocus() {
  const selected = adaptiveModeSelection();
  const fallback = els.adaptiveRecommendationButton.dataset.preset;
  const presets = selected.length ? selected : practicePresetStyles.has(fallback) ? [fallback] : [defaultPrefs.practicePreset];
  const focus = adaptiveFocusSelection();
  prefs.practicePresets = presets;
  prefs.practicePreset = presets[0];
  if (els.adaptiveFocusPicker?.dataset.hasSuggestions === "true") {
    prefs.focusLetters = letterOrder.filter(letter => focus.includes(letter)).slice(0, 5);
  }
  prefs.mode = "adaptive";
  state.mode = "adaptive";
  save();
  restart();
}

function startAdaptiveRepairFocus() {
  const suggested = String(els.adaptiveRepairFocusButton.dataset.focusLetters || "")
    .split(",")
    .map(letter => letter.trim().toUpperCase())
    .filter(letter => letterOrder.includes(letter));
  if (!suggested.length) return;
  prefs.focusLetters = letterOrder.filter(letter => suggested.includes(letter)).slice(0, 5);
  prefs.mode = "adaptive";
  state.mode = "adaptive";
  save();
  restart();
}

els.letterHeatmap.addEventListener("click", event => {
  const key = event.target.closest("[data-letter]");
  if (!key || key.disabled) return;
  openLetterDetails(key.dataset.letter);
});
els.letterFocusCheckbox.addEventListener("change", event => {
  const letter = els.letterDetailBadge.textContent.toUpperCase();
  const selected = selectedAdaptiveFocusLetters();
  if (event.target.checked && !selected.includes(letter) && selected.length >= 5) {
    event.target.checked = false;
    syncLetterFocusControl(letter);
    return;
  }
  const next = event.target.checked
    ? [...selected, letter]
    : selected.filter(item => item !== letter);
  prefs.focusLetters = letterOrder.filter(item => next.includes(item));
  save();
  render();
  syncLetterFocusControl(letter);
  if (state.mode === "adaptive") restart();
});
els.adaptiveMissedLetters.addEventListener("click", event => {
  const key = event.target.closest("[data-letter]");
  if (!key) return;
  openLetterDetails(key.dataset.letter);
});

els.restartBtn.addEventListener("click", () => {
  if (state.mode === "creative" && prefs.creativeMode === "no_quit" && state.startedAt && !state.testCompleted) return;
  restart();
});
els.resultRestartBtn.addEventListener("click", () => {
  if (state.mode === "dictation") nextDictationPrompt();
  else restart();
});
els.adaptiveRecommendationButton.addEventListener("click", startRecommendedAdaptiveFocus);
els.adaptiveModePicker.addEventListener("change", syncAdaptiveModeButton);
els.adaptiveRepairFocusButton.addEventListener("click", startAdaptiveRepairFocus);
els.statsBtn.addEventListener("pointerdown", showProgressPeek);
els.statsBtn.addEventListener("pointerup", hideProgressPeek);
els.statsBtn.addEventListener("pointercancel", hideProgressPeek);
els.statsBtn.addEventListener("lostpointercapture", hideProgressPeek);
els.statsBtn.addEventListener("click", event => event.preventDefault());
els.reviewErrorsBtn.addEventListener("click", startErrorReview);
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncFullscreenButton);
document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
document.addEventListener("pointerup", hideProgressPeek);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) hideProgressPeek();
});
document.addEventListener("pointerdown", unlockAudio, { passive: true });
document.addEventListener("keydown", unlockAudio, { capture: true });
document.addEventListener("keydown", handleKey);
document.addEventListener("keyup", event => {
  if (event.key === "Shift") state.shiftSide = "";
});
let resizeFitTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeFitTimer);
  resizeFitTimer = setTimeout(() => {
    if (["adaptive", "time", "words", "creative", "placement"].includes(state.mode) && !state.testCompleted) {
      state.practiceFontSize = null;
      renderText();
    }
  }, 120);
});
window.addEventListener("pagehide", () => {
  spokenReminderManager.stop();
  save();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});
preloadRewardSounds();
preloadKeySounds();
applyFont();
setupSettings();
setupSpokenReminderSettings();
if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) els.fullscreenBtn.hidden = true;
syncFullscreenButton();
save();
restart();
