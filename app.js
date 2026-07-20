const letterOrder = "ENIARLTOSUDYCGHPMKBWFZVXQJ".split("");
const startLetters = 6;
const rowsPerPage = 10;
const masteryRequiredPages = 27;
const masteryRequiredAttempts = 540;
const STORAGE_KEY = "keyboard-disciple-web";
const keyboardSoundStyles = new Set([...Array.from({ length: 26 }, (_, index) => String(index + 1)), "off"]);
const rewardSoundStyles = new Set(["preacher", "key-bloom", "glass-keys"]);
const errorSoundStyles = new Set(["1", "2", "3", "4", "off"]);
const practicePresetStyles = new Set(["balanced", "weak", "accuracy", "speed", "finger", "alternation"]);
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
const testModes = new Set(["time", "words", "quote", "creative", "placement"]);
const scoredModes = new Set(["adaptive", "time", "words", "quote", "creative", "placement", "bible", "bibleQuotes"]);
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
  techniqueMessageUntil: 0
};

let storedData = {};
try { storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}

const defaultPrefs = {
  mode: "adaptive",
  practiceLetters: startLetters,
  wordsPerRow: 10,
  targetSpeed: 35,
  practicePreset: "balanced",
  recoverKeys: true,
  naturalWords: true,
  dailyGoalMinutes: 15,
  testDuration: 30,
  testWordCount: 50,
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
  errorStyle: "1",
  timeWarning: "off",
  theme: "disciple",
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
prefs.testDuration = Math.max(5, Math.min(600, Number(prefs.testDuration) || defaultPrefs.testDuration));
prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(Number(prefs.testWordCount) || defaultPrefs.testWordCount)));
prefs.errorLimit = Math.max(1, Math.min(8, Number(prefs.errorLimit) || defaultPrefs.errorLimit));
prefs.soundVolume = Math.max(0, Math.min(1, Number(prefs.soundVolume) || defaultPrefs.soundVolume));
prefs.targetSpeed = Math.max(10, Math.min(300, Number(prefs.targetSpeed) || defaultPrefs.targetSpeed));
prefs.minWpm = Math.max(0, Math.min(200, Number(prefs.minWpm) || 0));
prefs.minAccuracy = Math.max(0, Math.min(100, Number(prefs.minAccuracy) || 0));
prefs.minBurst = Math.max(0, Math.min(200, Number(prefs.minBurst) || 0));
if (!keyboardSoundStyles.has(prefs.soundStyle)) prefs.soundStyle = defaultPrefs.soundStyle;
if (!keyboardLayouts[prefs.keyboardLayout]) prefs.keyboardLayout = defaultPrefs.keyboardLayout;
if (!rewardSoundStyles.has(prefs.rewardStyle)) prefs.rewardStyle = defaultPrefs.rewardStyle;
if (!errorSoundStyles.has(prefs.errorStyle)) prefs.errorStyle = defaultPrefs.errorStyle;
if (!practicePresetStyles.has(prefs.practicePreset)) prefs.practicePreset = defaultPrefs.practicePreset;
if (!creativeModeStyles.has(prefs.creativeMode)) prefs.creativeMode = defaultPrefs.creativeMode;
if (!themeStyles.has(prefs.theme)) prefs.theme = defaultPrefs.theme;
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
  lessonHistory: [],
  letterHistory: {},
  dailyActivity: {},
  errorReview: [],
  cleanLines: 0,
  placement: null
}, storedData.progress || {});
if (!progress.letterStats || typeof progress.letterStats !== "object") progress.letterStats = {};
if (!Array.isArray(progress.lessonHistory)) progress.lessonHistory = [];
if (!progress.letterHistory || typeof progress.letterHistory !== "object" || Array.isArray(progress.letterHistory)) progress.letterHistory = {};
if (!progress.dailyActivity || typeof progress.dailyActivity !== "object" || Array.isArray(progress.dailyActivity)) progress.dailyActivity = {};
if (!Array.isArray(progress.errorReview)) progress.errorReview = [];
if (!Number.isFinite(Number(progress.cleanLines))) progress.cleanLines = 0;

const commonWords = `a able about act add after again air all also always am an and any are area arm around as ask at back base be bed been best big bit blue book both bring build but by call came can care carry case change child city clear close come cost could course cut day did do door down draw dream drive during each early ease east eat end enough even ever every eye face fact fall far feel few field find fine fire first five for form found four free friend from full game gave get give go good got great green ground group grow had hand hard has have he head hear help her here high him his hold home hope hour house how i idea if in into is it job join just keep key kind know land large last late lead lean learn leave left less let life light like line list little live long look love made make man many mark may me mean men mind miss money more most move much must my name near need never new next night no not note now of off old on once one only open or our out over own page part pass pay people place plan play point power press put quick rain ran read real right river road room run said same saw say school see seem send set she short show side small so some sound stand start stay still story strong study such sure take talk tell than that the their them then there these they thing think this those time to told too took top tree true try turn two type under up use very view voice wait walk want war warm was watch water way we well went were what when where which while white who why will with word work world would write yard year yes yet you young your`.split(" ");
const moderateWords = `abide accent active admire adore advice alert anchor answer arena arise attend balance banner beacon belong better border borrow branch calmly captain careful center chance chosen circle comfort common corner courage custom daily decide delight detail direct divide double eager earnest effect effort either enable ending energy engine entire escape estate expand expect fabric faith family favor fellow figure filter finish flower follow future gather gentle glory golden handle harbor honest humble improve indeed inside intent island joyful keeper kingdom ladder leader lesson letter linger listen living matter memory middle modern moment motion notice number office origin palace patient pattern period phrase planet plenty polish ponder proper public quiet reason record remain rescue rhythm sample season second secret signal simple single smooth steady stream strength summer supply surely temple tender thread travel useful valley virtue window wonder worthy`.split(" ");
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
  "statsDialog", "statsBtn", "fullscreenBtn", "restartBtn", "letterHud", "unlockNext", "unlockCount",
  "letterHeatmap", "heatmapSummary", "letterDialog", "letterDetailBadge", "letterDetailTitle",
  "letterMastery", "letterLastSpeed", "letterTopSpeed", "letterAccuracy", "letterLearningRate", "letterLessons",
  "letterCurveCaption", "letterChart"
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

function formattedSpeed(wpm) {
  if (prefs.speedUnit === "cpm") return `${Math.round(wpm * 5)} CPM`;
  if (prefs.speedUnit === "wps") return `${(wpm / 60).toFixed(1)} WPS`;
  return `${Math.round(wpm)} WPM`;
}

function currentProgress() {
  const target = currentTarget();
  if (state.mode === "time") return Math.max(0, Math.min(1, 1 - state.timeRemaining / Number(prefs.testDuration)));
  if (state.mode === "adaptive") return Math.max(0, Math.min(1, (state.rowIndex + (target.length ? state.input.length / target.length : 0)) / rowsPerPage));
  if (["words", "creative", "placement"].includes(state.mode)) return Math.max(0, Math.min(1, (state.rowIndex + (target.length ? state.input.length / target.length : 0)) / Math.max(1, state.targetRows.length)));
  if (state.mode === "zen") return 0;
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

function renderResult() {
  const result = state.result;
  if (!result) return;
  els.resultEyebrow.textContent = `${modeCopy()[0]} complete`;
  els.resultTitle.textContent = result.failedReason || (result.placement ? "Baseline saved" : result.personalBest ? "New personal best" : "Results");
  els.resultScore.textContent = Number(result.score).toLocaleString();
  els.resultWpm.textContent = Math.round(result.wpm);
  els.resultRaw.textContent = Math.round(result.raw);
  els.resultAccuracy.textContent = `${Math.round(result.accuracy)}%`;
  els.resultConsistency.textContent = `${Math.round(result.consistency)}%`;
  els.resultCharacters.textContent = String(state.charsTyped);
  els.resultTime.textContent = `${(result.elapsedMs / 1000).toFixed(1)}s`;
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

function alternatingWord(word) {
  const letters = [...word.toLowerCase()].filter(letter => /^[a-z]$/.test(letter));
  if (letters.length < 4) return false;
  let changes = 0;
  for (let index = 1; index < letters.length; index++) {
    if (handForLetter(letters[index]) !== handForLetter(letters[index - 1])) changes++;
  }
  return changes / Math.max(1, letters.length - 1) >= .58;
}

function wordDeck() {
  const unlocked = allowedSet();
  const focusLetter = adaptiveFocusLetter().toLowerCase();
  const isAllowed = word => [...word.toLowerCase()].every(ch => !/[a-z]/.test(ch) || unlocked.has(ch));
  const allNatural = [...new Set(commonWords.concat(moderateWords, rareWords, dictionaryExtra, rareLetterFocusPool))].filter(isAllowed);
  const broadCommon = prefs.naturalWords
    ? commonWords.concat(dictionaryExtra.filter(w => w.length <= 6))
    : commonWords.concat(moderateWords, dictionaryExtra);
  const common = shuffle(broadCommon.filter(isAllowed));
  const moderate = shuffle(moderateWords.concat(dictionaryExtra.filter(w => w.length >= 6 && w.length <= 9)).filter(isAllowed));
  const rare = shuffle(rareWords.concat(dictionaryExtra.filter(w => w.length >= 9)).filter(isAllowed));
  const rareFocus = shuffle(rareLetterFocusPool.filter(isAllowed));
  const focus = shuffle(allNatural.filter(word => word.includes(focusLetter)));
  const weakLetters = weakestPracticeLetters();
  const weak = shuffle(allNatural.filter(word => weakLetters.some(letter => word.includes(letter))));
  const finger = shuffle(allNatural.filter(word => weakLetters.some(letter => {
    const zone = fingerZone(letter).label;
    return [...word].some(candidate => /^[a-z]$/i.test(candidate) && fingerZone(candidate).label === zone);
  })));
  const alternating = shuffle(allNatural.filter(alternatingWord));
  return { common, moderate, rare, rareFocus, focus, weak, finger, alternating, focusLetter };
}

function makeAdaptiveRows(rowCount = rowsPerPage * 2) {
  const deck = wordDeck();
  const rows = [];
  let ci = 0, mi = 0, ri = 0, fi = 0, rfi = 0;
  let wi = 0, fgi = 0, ai = 0;
  const recoveryMode = progress.lessonHistory.length > 0 && Number(progress.avgAccuracy) < 88;
  const activePreset = recoveryMode ? "accuracy" : prefs.practicePreset;
  const presetPool = {
    weak: deck.weak,
    accuracy: deck.weak,
    finger: deck.finger,
    alternation: deck.alternating,
    speed: deck.moderate
  }[activePreset] || [];
  const readiness = Math.min(1, progress.lessonHistory.length / 8) * Math.min(1, (Number(progress.avgAccuracy) || 0) / 94);
  const moderateInterval = recoveryMode ? Number.MAX_SAFE_INTEGER : readiness > .7 ? 10 : 20;
  const rareInterval = recoveryMode ? Number.MAX_SAFE_INTEGER : readiness > .88 ? 50 : 100;
  for (let r = 0; r < rowCount; r++) {
    const words = [];
    for (let i = 0; i < Number(prefs.wordsPerRow); i++) {
      const pos = r * Number(prefs.wordsPerRow) + i + 1;
      let list = deck.common;
      let index = ci++;
      if (presetPool.length && pos % 2 === 0) { list = presetPool; index = activePreset === "finger" ? fgi++ : activePreset === "alternation" ? ai++ : wi++; }
      else if (pos % 3 === 0 && deck.focus.length) { list = deck.focus; index = fi++; }
      else if (pos % 11 === 0 && deck.rareFocus.length) { list = deck.rareFocus; index = rfi++; }
      else if (pos % rareInterval === 0 && deck.rare.length) { list = deck.rare; index = ri++; }
      else if (pos % moderateInterval === 0 && deck.moderate.length) { list = deck.moderate; index = mi++; }
      if (!list.length) list = deck.common.length ? deck.common : deck.focus.length ? deck.focus : ["a", "an", "in", "is", "it"];
      words.push(list[index % list.length]);
    }
    rows.push(transformText(words.join(" ")));
  }
  return rows;
}

function makePlacementRows() {
  const pool = shuffle([...new Set(commonWords.concat(moderateWords, dictionaryExtra))]);
  const words = Array.from({ length: 80 }, (_, index) => {
    if ((index + 1) % 7 === 0 && rareLetterFocusPool.length) return rareLetterFocusPool[index % rareLetterFocusPool.length];
    return pool[index % Math.max(1, pool.length)] || "practice";
  });
  const size = Math.max(8, Number(prefs.wordsPerRow) || 10);
  const rows = [];
  for (let index = 0; index < words.length; index += size) rows.push(transformText(words.slice(index, index + size).join(" ")));
  return rows;
}

function testWordPool() {
  if (prefs.difficulty === "master") return commonWords.concat(moderateWords, rareWords, dictionaryExtra);
  if (prefs.difficulty === "expert") return commonWords.concat(moderateWords, dictionaryExtra);
  return commonWords.concat(dictionaryExtra.filter(word => word.length <= 8));
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

function makeWordSections(count) {
  const words = makeTestWords(count);
  const sections = [];
  const size = Math.max(2, Number(prefs.wordsPerRow) || 10);
  for (let index = 0; index < words.length; index += size) {
    sections.push(transformText(words.slice(index, index + size).join(" ")));
  }
  return sections.length ? sections : ["practice"];
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

function makeCreativeSections(count) {
  const words = makeCreativeWords(count);
  const sections = [];
  const size = Math.max(2, Number(prefs.wordsPerRow) || 10);
  for (let index = 0; index < words.length; index += size) {
    let text = words.slice(index, index + size).join(" ");
    if (prefs.creativeMode === "nospace") text = text.replaceAll(" ", "");
    if (prefs.creativeMode === "underscore_spaces") text = text.replaceAll(" ", "_");
    sections.push(text);
  }
  return sections.length ? sections : ["practice"];
}

function makeTimedRows() {
  const words = makeTestWords(600);
  const size = Math.max(4, Number(prefs.wordsPerRow) || 10);
  const rows = [];
  for (let index = 0; index < words.length; index += size) {
    rows.push(transformText(words.slice(index, index + size).join(" ")));
  }
  return rows;
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
  els.completionBanner.classList.add("hidden");
  if (state.mode === "adaptive") {
    state.targetRows = makeAdaptiveRows(rowsPerPage * 2);
    state.scripturePages = [];
  } else if (state.mode === "time") {
    state.targetRows = makeTimedRows();
    state.scripturePages = [];
  } else if (state.mode === "words") {
    state.targetRows = makeWordSections(Number(prefs.testWordCount));
    state.scripturePages = [];
  } else if (state.mode === "creative") {
    state.targetRows = makeCreativeSections(Number(prefs.testWordCount));
    state.scripturePages = [];
  } else if (state.mode === "placement") {
    state.targetRows = makePlacementRows();
    state.scripturePages = [];
  } else if (state.mode === "quote") {
    const shouldRepeat = prefs.repeatQuotes === "always" || (prefs.repeatQuotes === "typing" && wasTyping);
    const quote = shouldRepeat && state.lastQuote ? state.lastQuote : quoteForLength();
    state.lastQuote = quote;
    state.scripturePages = [[quote[0], transformText(quote[1])]];
    state.targetRows = [];
  } else if (state.mode === "bibleQuotes") {
    const data = await loadKJV();
    if (requestId !== restartRequestId) return;
    state.scripturePages = makeBibleQuotePages(data);
    state.targetRows = [];
  } else if (state.mode === "bible") {
    const pages = await makeBiblePages();
    if (requestId !== restartRequestId) return;
    state.scripturePages = pages;
    state.targetRows = [];
  } else {
    state.targetRows = [""];
    state.scripturePages = [];
  }
  prefs.mode = state.mode;
  scheduleSave();
  render();
  prepareCreativeLine();
}

function currentTarget() {
  if (["bible", "bibleQuotes", "quote"].includes(state.mode)) return state.scripturePages[state.pageIndex]?.[1] || "";
  if (state.mode === "zen") return "";
  return state.targetRows[state.rowIndex] || "";
}

function currentReference() {
  if (["bible", "bibleQuotes", "quote"].includes(state.mode)) return state.scripturePages[state.pageIndex]?.[0] || "";
  return "";
}

function speakCurrentTarget() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentTarget());
  utterance.rate = .92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
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

function modeCopy() {
  const copy = {
    adaptive: ["Adaptive letters", `Focus ${adaptiveFocusLetter()} / ${prefs.targetSpeed} WPM target`],
    time: ["Timed Test", `${prefs.testDuration} second sprint`],
    words: ["Word Test", `${prefs.testWordCount} word challenge`],
    placement: ["Placement Check", "Find your starting point"],
    quote: ["Quote Test", "Complete the quote"],
    zen: ["Zen Mode", "Type without limits"],
    creative: ["Creative Test", creativeModeLabels[prefs.creativeMode]],
    bible: ["Scripture Reading", "Bible Reading"],
    bibleQuotes: ["Bible Quotes", "Complete Quotes"]
  };
  return copy[state.mode] || copy.adaptive;
}

function applyDisplayPreferences() {
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
  renderText();
  renderKeyboard();
  renderLetterProgress();
  renderPerformance();
  renderLiveMetrics();
  renderResult();
  applyDisplayPreferences();
  els.typingCard.classList.toggle("hidden", state.testCompleted);
  els.resultPanel.classList.toggle("hidden", !state.testCompleted);
  els.keyboardWrap.classList.toggle("hidden", prefs.keymapMode === "off" || state.testCompleted);
}

function renderLetterProgress() {
  const isAdaptive = state.mode === "adaptive";
  els.letterHud.classList.toggle("hidden", !isAdaptive);
  if (!isAdaptive) return;

  const unlockedCount = Number(prefs.practiceLetters);
  const earnedLetters = new Set(letterOrder.slice(0, unlockedCount));
  const nextLetter = letterOrder[unlockedCount];
  const focusLetter = adaptiveFocusLetter();
  els.unlockCount.textContent = `${unlockedCount} / ${letterOrder.length}`;
  els.unlockNext.textContent = nextLetter ? `Focus ${focusLetter} / next ${nextLetter}` : `Focus ${focusLetter} / alphabet complete`;

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
  els.letterHeatmap.innerHTML = `<div class="heat-row">${keys}</div>`;
  els.heatmapSummary.textContent = totalAttempts
    ? `${Math.round((totalMastery / Math.max(1, sampledLetters)) * 100)}% confidence / ${Math.round((totalCorrect / totalAttempts) * 100)}% accuracy`
    : `Build ${focusLetter} toward ${prefs.targetSpeed} WPM`;
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
  lessonStats.attempts++;
  if (isCorrect) {
    lessonStats.correct++;
    if (state.lastAcceptedAt) {
      const elapsed = recordedAt - state.lastAcceptedAt;
      if (elapsed > 0 && elapsed <= 12000) {
        lessonStats.elapsedMs += elapsed;
        lessonStats.timedCorrect++;
      }
    }
    state.lastAcceptedAt = recordedAt;
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
  els.letterCurveCaption.textContent = mastery.score >= .98
    ? "Target confidence earned"
    : `${mastery.pagesRemaining} evidence pages / ${mastery.attemptsRemaining} keystrokes remaining`;
  renderLetterChart(upperLetter, history, lifetimeStats);
  if (!els.letterDialog.open) els.letterDialog.showModal();
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
    return;
  }
  requestAnimationFrame(() => {
    const longest = Math.max(1, ...lines.map(line => [...line].length));
    const baseSize = { small: 25, medium: 32, large: 38, xlarge: 44 }[prefs.fontSize] || 32;
    const fitted = Math.max(13, Math.min(baseSize, els.typingText.clientWidth / (longest * .61)));
    els.typingText.style.fontSize = `${fitted.toFixed(1)}px`;
  });
}

function renderText() {
  const target = currentTarget();
  const reference = currentReference();
  els.scriptureStrip.classList.toggle("hidden", !reference);
  els.scriptureRef.textContent = reference;
  const rowLabels = {
    adaptive: `Page ${state.pageIndex + 1} / line ${(state.rowIndex % rowsPerPage) + 1} of ${rowsPerPage}`,
    time: `${Math.max(0, Math.ceil(state.timeRemaining))} seconds`,
    words: `Line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    creative: `${creativeModeLabels[prefs.creativeMode]} / line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    placement: `Placement line ${state.rowIndex + 1} of ${state.targetRows.length}`,
    quote: "Complete quote",
    zen: "Endless practice",
    bible: `Scripture ${state.pageIndex + 1} of ${state.scripturePages.length}`,
    bibleQuotes: `Quote ${state.pageIndex + 1} of ${state.scripturePages.length}`
  };
  els.rowLabel.textContent = rowLabels[state.mode] || "Practice";
  els.charLabel.textContent = state.mode === "zen" ? `${state.input.length}` : `${state.input.length} / ${target.length}`;
  if (state.mode === "zen") {
    els.typingText.innerHTML = `<span class="practice-line active">${escapeHtml(state.input || "\u00a0")}</span>`;
    els.typingText.style.fontSize = "";
    return;
  }

  const streamMode = ["adaptive", "time", "words", "creative", "placement"].includes(state.mode);
  if (streamMode) {
    const lines = state.targetRows.slice(state.rowIndex, state.rowIndex + 4);
    while (lines.length < 4) lines.push("");
    els.typingText.innerHTML = lines.map((line, index) => `<span class="practice-line${index === 0 ? " active" : ""}" data-line-offset="${index}">${index === 0 ? renderInteractiveTarget(line) : renderPlainLine(line)}</span>`).join("");
    fitPracticeLines(lines);
    return;
  }

  els.typingText.innerHTML = renderInteractiveTarget(target);
  els.typingText.style.fontSize = "";
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
  const classes = ["key", zone.className, isLockedLetter ? "locked" : "", isModifier ? "modifier" : "", key.id === "space" ? "spacebar" : "", isNext ? "next-key" : "", keyboardStateClasses(key.id)].join(" ");
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
  if (event.repeat && state.mode !== "zen") {
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
      state.characterErrors = 0;
    }
    els.rowLabel.textContent = `${Math.max(0, Math.ceil(state.timeRemaining))} seconds`;
    renderLiveMetrics();
    if (prefs.keymapMode === "next") renderKeyboard();
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
  const recordedAt = performance.now();
  if (!state.startedAt) {
    state.startedAt = recordedAt;
    if (state.mode === "time") startTimedTest();
  }
  if (state.lastKeyAt) {
    const interval = recordedAt - state.lastKeyAt;
    if (interval > 0 && interval < 5000) state.keyIntervals.push(interval);
    if (state.keyIntervals.length > 300) state.keyIntervals.shift();
  }
  state.lastKeyAt = recordedAt;
  trackDailyActivity(recordedAt);
  const target = currentTarget();
  const key = arrowCharacter || event.key;
  const expected = target[state.input.length];
  const expectedLower = String(expected || "").toLowerCase();
  const expectedZone = /^[a-z]$/.test(expectedLower) ? fingerZone(expectedLower).label : "";
  const oppositeShiftError = prefs.oppositeShiftMode && /^[A-Z]$/.test(String(expected || "")) && !["b", "y"].includes(expectedLower)
    && state.shiftSide !== (expectedZone.startsWith("Left") ? "right" : "left");
  if (state.mode !== "zen" && (key !== expected || oppositeShiftError)) {
    state.lineErrors++;
    if (state.characterErrors < Number(prefs.errorLimit)) {
      state.errors++;
      state.characterErrors++;
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
    return;
  }
  if (state.mode !== "zen") recordLetterAttempt(expected, true, recordedAt);
  state.characterErrors = 0;
  state.input += key;
  state.charsTyped++;
  state.rawTyped++;
  if (prefs.typingSounds) playKey(event.code, event.shiftKey || state.capsLock);
  if (state.mode !== "zen" && state.input.length >= target.length) {
    finishLine();
    return;
  }
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
  else if (state.mode === "quote") finishTest();
  else if (["bible", "bibleQuotes"].includes(state.mode)) finishScripture();
}

function updateLifetimeAverages(metrics) {
  progress.avgWpm = progress.avgWpm ? (progress.avgWpm * .75 + metrics.wpm * .25) : metrics.wpm;
  progress.avgAccuracy = progress.avgAccuracy ? (progress.avgAccuracy * .8 + metrics.accuracy * .2) : metrics.accuracy;
}

function finishAdaptiveLine() {
  const completedRow = (state.rowIndex % rowsPerPage) + 1;
  const completedPage = completedRow === rowsPerPage;
  let newlyUnlocked = "";
  if (completedPage) {
    const metrics = currentMetrics();
    updateLifetimeAverages(metrics);
    recordCompletedLesson(metrics.wpm, metrics.accuracy, { raw: metrics.raw, consistency: metrics.consistency, elapsedMs: metrics.elapsedMs });
    if (canUnlockNextLetter()) {
      newlyUnlocked = letterOrder[Number(prefs.practiceLetters)] || "";
      prefs.practiceLetters = Math.min(letterOrder.length, Number(prefs.practiceLetters) + 1);
      const practiceSelector = document.getElementById("practiceLetters");
      if (practiceSelector) practiceSelector.value = String(prefs.practiceLetters);
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
    if (completedPage && state.rowIndex >= 100) {
      state.targetRows = state.targetRows.slice(state.rowIndex);
      state.rowIndex = 0;
    }
    save();
    render();
  }, 72);
}

function finishTimedLine() {
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
    if (state.rowIndex >= state.targetRows.length - 2) state.targetRows.push(...makeTimedRows());
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

function finishScripture() {
  const metrics = currentMetrics();
  updateLifetimeAverages(metrics);
  recordCompletedLesson(metrics.wpm, metrics.accuracy, { raw: metrics.raw, consistency: metrics.consistency, elapsedMs: metrics.elapsedMs });
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = "Scripture cleared";
  els.completionBanner.classList.remove("hidden");
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.lineErrors = 0;
    state.startedAt = null;
    state.charsTyped = 0;
    state.rawTyped = 0;
    state.errors = 0;
    state.keyIntervals = [];
    state.lastKeyAt = null;
    state.pageIndex = (state.pageIndex + 1) % state.scripturePages.length;
    render();
  }, 100);
}

function finishTest() {
  if (state.testCompleted || !state.startedAt) return;
  clearTestTimer();
  if (state.mode === "time") state.timeRemaining = 0;
  const metrics = currentMetrics();
  const previousBest = progress.lessonHistory
    .filter(item => item?.mode === state.mode)
    .reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0);
  const savedResult = recordCompletedLesson(metrics.wpm, metrics.accuracy, {
    raw: Number(metrics.raw.toFixed(1)),
    consistency: Number(metrics.consistency.toFixed(1)),
    elapsedMs: Math.round(metrics.elapsedMs)
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
let timeWarningBuffer;
let timeWarningLoading;

async function ensureKeySoundStyle(style) {
  if (!keyboardSoundFiles[style] || keyboardSoundBuffers[style]) return;
  if (keyboardSoundLoading[style]) return keyboardSoundLoading[style];
  keyboardSoundLoading[style] = Promise.all(keyboardSoundFiles[style].map(decodeAudioFile)).then(decoded => {
    keyboardSoundBuffers[style] = decoded;
  }).catch(error => console.warn(`Keyboard sound ${style} could not be loaded.`, error));
  return keyboardSoundLoading[style];
}

async function ensureErrorSoundStyle(style) {
  if (!errorSoundFiles[style] || errorSoundBuffers[style]) return;
  if (errorSoundLoading[style]) return errorSoundLoading[style];
  errorSoundLoading[style] = Promise.all(errorSoundFiles[style].map(decodeAudioFile)).then(decoded => {
    errorSoundBuffers[style] = decoded;
  }).catch(error => console.warn(`Error sound ${style} could not be loaded.`, error));
  return errorSoundLoading[style];
}

async function ensureTimeWarningSound() {
  if (timeWarningBuffer) return;
  timeWarningLoading ||= decodeAudioFile("assets/keyboard-sounds/time-warning.wav").then(decoded => {
    timeWarningBuffer = decoded;
  }).catch(error => console.warn("Time warning sound could not be loaded.", error));
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
  const response = await fetch(new URL(file, document.baseURI));
  if (!response.ok) throw new Error(`Could not load ${file}`);
  return ctx().decodeAudioData(await response.arrayBuffer());
}

async function preloadRewardSounds() {
  try {
    const buffers = await Promise.all([...rowRewardFiles, specialRewardFile].map(decodeAudioFile));
    rowRewardBuffers.push(...buffers.slice(0, rowRewardFiles.length));
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
  practiceMode: "Changes the active typing experience. Modes are selected only here so the practice page stays focused.",
  practicePreset: "Chooses the training emphasis while keeping every adaptive word a real natural word.",
  testDuration: "Sets the length of timed tests.",
  testWordCount: "Sets Words and Creative test length up to 3,000 words. Only four lines are shown at once.",
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
  soundVolume: "Sets the volume of keystrokes, errors, warnings, and rewards.",
  rewardStyle: "Chooses the sound used when a line or full section is completed.",
  errorStyle: "Chooses the sound played when an incorrect key is blocked.",
  timeWarning: "Chooses how many seconds before a timed test ends to play a warning.",
  typingSounds: "Turns accepted-keystroke sounds on or off without changing the selected sound.",
  errorSounds: "Turns blocked-error sounds on or off without changing the selected sound.",
  practiceLetters: "Sets the starting alphabet size. Automatic unlocks still require confidence evidence.",
  targetSpeed: "Sets the per-letter speed needed for full confidence and the next automatic unlock.",
  recoverKeys: "Requires every earned letter to be currently above target before the next one unlocks.",
  naturalWords: "Keeps adaptive lessons inside the curated natural vocabulary; off broadens that vocabulary without using nonsense strings.",
  wordsPerRow: "Sets the target word count for each adaptive row.",
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

  const selectIds = [
    "practiceMode", "testDuration", "testWordCount", "quoteLength", "difficulty", "creativeMode", "capitalization", "quickRestart",
    "repeatQuotes", "resultSaving", "minWpm", "minAccuracy", "minBurst", "indicateTypos", "confidenceMode", "errorLimit",
    "theme", "fontFamily", "currentCue", "caretStyle", "smoothCaret", "typedEffect", "highlightMode", "fontSize",
    "lineWidth", "tapeMode", "timerStyle", "speedUnit", "keyboardLayout", "keyboardSize", "keymapMode", "keymapStyle",
    "keymapLegend", "soundStyle", "soundVolume", "rewardStyle", "errorStyle", "timeWarning", "practiceLetters",
    "targetSpeed", "practicePreset", "wordsPerRow", "dailyGoalMinutes", "bibleBook", "bibleChapter", "bibleStart", "bibleEnd"
  ];
  const prefKeys = { practiceMode: "mode" };
  const numericIds = new Set([
    "testDuration", "testWordCount", "minWpm", "minAccuracy", "minBurst", "errorLimit", "soundVolume", "practiceLetters",
    "targetSpeed", "wordsPerRow", "dailyGoalMinutes", "bibleChapter", "bibleStart", "bibleEnd"
  ]);
  const restartIds = new Set([
    "practiceMode", "testDuration", "testWordCount", "quoteLength", "difficulty", "creativeMode", "capitalization",
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
      if (id === "testWordCount") {
        prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(prefs.testWordCount || defaultPrefs.testWordCount)));
        event.target.value = String(prefs.testWordCount);
      }
      if (["bibleStart", "bibleEnd"].includes(id) && prefs.bibleEnd < prefs.bibleStart) {
        prefs.bibleEnd = prefs.bibleStart;
        document.getElementById("bibleEnd").value = String(prefs.bibleEnd);
      }
      if (id === "practiceMode") state.mode = prefs.mode;
      save();
      if (id === "theme") applyTheme();
      if (id === "fontFamily") applyFont();
      if (id === "creativeMode") updateCreativeDescription();
      if (id === "soundStyle") {
        ensureKeySoundStyle(prefs.soundStyle).then(() => {
          if (prefs.typingSounds) playKey();
        });
      } else if (id === "rewardStyle") {
        stopRewardSound();
        playReward(1);
      } else if (id === "errorStyle" && prefs.errorSounds) {
        ensureErrorSoundStyle(prefs.errorStyle).then(playError);
      } else if (id === "timeWarning" && prefs.timeWarning !== "off") {
        ensureTimeWarningSound().then(playTimeWarning);
      }
      if (restartIds.has(id)) restart();
      else if (keyboardIds.has(id)) render();
      else {
        renderText();
        renderLiveMetrics();
        renderPerformance();
        applyDisplayPreferences();
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

  els.settingsBtn.addEventListener("click", () => els.settingsDialog.showModal());

  updateCreativeDescription();
  installSettingDescriptions();
}

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

function startErrorReview() {
  if (!progress.errorReview.length) return;
  prefs.mode = "adaptive";
  prefs.practicePreset = "accuracy";
  state.mode = "adaptive";
  els.statsDialog.close();
  save();
  restart();
}

els.letterHeatmap.addEventListener("click", event => {
  const key = event.target.closest("[data-letter]");
  if (!key || key.disabled) return;
  openLetterDetails(key.dataset.letter);
});

els.restartBtn.addEventListener("click", () => {
  if (state.mode === "creative" && prefs.creativeMode === "no_quit" && state.startedAt && !state.testCompleted) return;
  restart();
});
els.resultRestartBtn.addEventListener("click", restart);
els.statsBtn.addEventListener("click", () => els.statsDialog.showModal());
els.reviewErrorsBtn.addEventListener("click", startErrorReview);
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncFullscreenButton);
document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
document.addEventListener("pointerdown", unlockAudio, { passive: true });
document.addEventListener("keydown", unlockAudio, { capture: true });
document.addEventListener("keydown", handleKey);
document.addEventListener("keyup", event => {
  if (event.key === "Shift") state.shiftSide = "";
});
window.addEventListener("pagehide", save);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});
preloadRewardSounds();
preloadKeySounds();
applyFont();
setupSettings();
if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) els.fullscreenBtn.hidden = true;
syncFullscreenButton();
save();
restart();
