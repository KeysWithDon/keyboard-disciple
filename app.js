const letterOrder = "ENIARLTOSUDYCGHPMKBWFZVXQJ".split("");
const startLetters = 6;
const rowsPerPage = 10;
const masteryRequiredPages = 9;
const masteryRequiredAttempts = 180;
const STORAGE_KEY = "keyboard-disciple-web";
const letterHeatmapRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const keyboardSoundStyles = new Set([...Array.from({ length: 26 }, (_, index) => String(index + 1)), "off"]);
const rewardSoundStyles = new Set(["preacher", "key-bloom", "glass-keys"]);
const errorSoundStyles = new Set(["1", "2", "3", "4"]);
const themeStyles = new Set(["dark", "light", "arcade", "chapel", "midnight", "high-contrast"]);
const testModes = new Set(["time", "words", "quote", "custom"]);
const scoredModes = new Set(["adaptive", "time", "words", "quote", "custom", "bible", "bibleQuotes"]);
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
  characterErrors: 0,
  lessonLetterStats: {},
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
  mistakeKey: ""
};

let storedData = {};
try { storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}

const defaultPrefs = {
  practiceLetters: startLetters,
  wordsPerRow: 10,
  dailyGoalMinutes: 15,
  testDuration: 30,
  testWordCount: 50,
  quoteLength: "medium",
  difficulty: "normal",
  quickRestart: "off",
  currentCue: "highlight",
  caretStyle: "highlight",
  smoothCaret: "medium",
  typedEffect: "keep",
  highlightMode: "letter",
  fontSize: "medium",
  lineWidth: "comfortable",
  timerStyle: "text",
  speedUnit: "wpm",
  showLiveWpm: true,
  showLiveAccuracy: true,
  showLiveRaw: false,
  showLiveConsistency: false,
  showProgress: true,
  showAllLines: false,
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
  theme: "dark",
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
  customText: "Practice with purpose and let steady hands build lasting skill.",
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
if (!keyboardSoundStyles.has(prefs.soundStyle)) prefs.soundStyle = defaultPrefs.soundStyle;
if (!keyboardLayouts[prefs.keyboardLayout]) prefs.keyboardLayout = defaultPrefs.keyboardLayout;
if (!rewardSoundStyles.has(prefs.rewardStyle)) prefs.rewardStyle = defaultPrefs.rewardStyle;
if (!errorSoundStyles.has(prefs.errorStyle)) prefs.errorStyle = defaultPrefs.errorStyle;
if (!themeStyles.has(prefs.theme)) prefs.theme = defaultPrefs.theme;
if (storedPrefs.showKeyboard === false && storedPrefs.keymapMode === undefined) prefs.keymapMode = "off";
prefs.dailyGoalMinutes = Math.max(5, Math.min(60, Number(prefs.dailyGoalMinutes) || defaultPrefs.dailyGoalMinutes));

function applyTheme() {
  document.documentElement.dataset.theme = prefs.theme;
}

applyTheme();

const progress = Object.assign({
  rowsCleared: 0,
  avgWpm: 0,
  avgAccuracy: 100,
  letterStats: {},
  lessonHistory: [],
  letterHistory: {},
  dailyActivity: {}
}, storedData.progress || {});
if (!progress.letterStats || typeof progress.letterStats !== "object") progress.letterStats = {};
if (!Array.isArray(progress.lessonHistory)) progress.lessonHistory = [];
if (!progress.letterHistory || typeof progress.letterHistory !== "object" || Array.isArray(progress.letterHistory)) progress.letterHistory = {};
if (!progress.dailyActivity || typeof progress.dailyActivity !== "object" || Array.isArray(progress.dailyActivity)) progress.dailyActivity = {};

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

const kjvQuotes = [
  ["Psalm 23:1 KJV", "The Lord is my shepherd; I shall not want."],
  ["Psalm 23:4 KJV", "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me."],
  ["Isaiah 40:31 KJV", "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."],
  ["Romans 8:28 KJV", "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."],
  ["Philippians 4:13 KJV", "I can do all things through Christ which strengtheneth me."],
  ["Proverbs 3:5-6 KJV", "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."],
  ["Joshua 1:9 KJV", "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest."],
  ["Matthew 6:33 KJV", "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."],
  ["John 3:16-17 KJV", "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. For God sent not his Son into the world to condemn the world; but that the world through him might be saved."],
  ["2 Corinthians 5:7 KJV", "For we walk by faith, not by sight."],
  ["Ephesians 2:8-9 KJV", "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast."],
  ["1 Peter 5:7 KJV", "Casting all your care upon him; for he careth for you."]
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
  "modeEyebrow", "lessonTitle", "modeControls", "liveMetrics", "liveWpmWrap", "liveWpm", "liveAccWrap", "liveAcc",
  "liveRawWrap", "liveRaw", "liveConsistencyWrap", "liveConsistency", "liveProgressWrap", "liveProgress", "timerMeter",
  "timerFill", "typingCard", "typingText", "rowLabel", "charLabel", "scriptureStrip", "scriptureRef", "completionBanner",
  "keyboard", "keyboardWrap", "lessonScore", "lastWpm", "lastAccuracy", "topWpm", "learningRate", "dailyGoalText",
  "dailyGoalFill", "resultPanel", "resultEyebrow", "resultTitle", "resultScore", "resultWpm", "resultRaw",
  "resultAccuracy", "resultConsistency", "resultCharacters", "resultTime", "resultRestartBtn", "settingsDialog", "settingsBtn",
  "statsDialog", "statsBtn", "fullscreenBtn", "restartBtn", "customTextDialog", "customTextInput", "saveCustomText", "letterHud", "unlockNext", "unlockCount",
  "unlockMeterFill", "letterHeatmap", "heatmapSummary", "letterDialog", "letterDetailBadge", "letterDetailTitle",
  "letterMastery", "letterLastSpeed", "letterTopSpeed", "letterAccuracy", "letterLearningRate", "letterLessons",
  "letterCurveCaption", "letterChart"
].map(id => [id, document.getElementById(id)]));

let saveTimer;

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

  const goalMinutes = Number(prefs.dailyGoalMinutes) || defaultPrefs.dailyGoalMinutes;
  const activeMinutes = (Number(progress.dailyActivity[localDateKey()]) || 0) / 60;
  const shownMinutes = activeMinutes < 10 ? Number(activeMinutes.toFixed(1)) : Math.round(activeMinutes);
  const goalRatio = Math.min(1, activeMinutes / goalMinutes);
  els.dailyGoalText.textContent = `${shownMinutes} / ${goalMinutes} min`;
  els.dailyGoalFill.style.width = `${goalRatio * 100}%`;
  els.dailyGoalFill.parentElement.classList.toggle("complete", goalRatio >= 1);
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
  if (state.mode === "words") return Math.max(0, Math.min(1, (state.rowIndex + (target.length ? state.input.length / target.length : 0)) / Math.max(1, state.targetRows.length)));
  if (state.mode === "zen") return 0;
  return target.length ? Math.max(0, Math.min(1, state.input.length / target.length)) : 0;
}

function renderLiveMetrics() {
  const metrics = currentMetrics();
  const progressRatio = currentProgress();
  const visible = state.mode !== "zen" && !state.testCompleted;
  els.liveMetrics.classList.toggle("hidden", !visible);
  if (!visible) return;
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
  const showBar = state.mode === "time" && ["bar", "both"].includes(prefs.timerStyle);
  els.timerMeter.classList.toggle("hidden", !showBar);
  els.timerFill.style.width = `${progressRatio * 100}%`;
}

function renderResult() {
  const result = state.result;
  if (!result) return;
  els.resultEyebrow.textContent = `${modeCopy()[0]} complete`;
  els.resultTitle.textContent = result.personalBest ? "New personal best" : "Results";
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
  const evidence = Math.min(1, stats.attempts / masteryRequiredAttempts, history.length / masteryRequiredPages);
  const score = Math.max(0, Math.min(1, evidence * accuracy));
  return {
    score,
    percent: Math.round(score * 100),
    pages: history.length,
    attempts: Number(stats.attempts) || 0,
    pagesRemaining: Math.max(0, masteryRequiredPages - history.length),
    attemptsRemaining: Math.max(0, masteryRequiredAttempts - (Number(stats.attempts) || 0))
  };
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

function wordDeck() {
  const unlocked = allowedSet();
  const isAllowed = word => [...word.toLowerCase()].every(ch => !/[a-z]/.test(ch) || unlocked.has(ch));
  const common = shuffle(commonWords.concat(dictionaryExtra.filter(w => w.length <= 6)).filter(isAllowed));
  const moderate = shuffle(moderateWords.concat(dictionaryExtra.filter(w => w.length >= 6 && w.length <= 9)).filter(isAllowed));
  const rare = shuffle(rareWords.concat(dictionaryExtra.filter(w => w.length >= 9)).filter(isAllowed));
  const focus = shuffle(rareLetterFocusPool.filter(isAllowed));
  return { common, moderate, rare, focus };
}

function makeAdaptiveRows() {
  const deck = wordDeck();
  const rows = [];
  let ci = 0, mi = 0, ri = 0, fi = 0;
  for (let r = 0; r < rowsPerPage; r++) {
    const words = [];
    for (let i = 0; i < Number(prefs.wordsPerRow); i++) {
      const pos = r * Number(prefs.wordsPerRow) + i + 1;
      let list = deck.common;
      let index = ci++;
      if (pos % 4 === 0 && deck.focus.length) { list = deck.focus; index = fi++; }
      else if (pos % 100 === 0 && deck.rare.length) { list = deck.rare; index = ri++; }
      else if (pos % 20 === 0 && deck.moderate.length) { list = deck.moderate; index = mi++; }
      if (!list.length) list = deck.common.length ? deck.common : ["lean", "real", "line"];
      words.push(list[index % list.length]);
    }
    rows.push(transformText(words.join(" ")));
  }
  return rows;
}

function testWordPool() {
  if (prefs.difficulty === "master") return commonWords.concat(moderateWords, rareWords, dictionaryExtra);
  if (prefs.difficulty === "expert") return commonWords.concat(moderateWords, dictionaryExtra);
  return commonWords.concat(dictionaryExtra.filter(word => word.length <= 8));
}

function decorateTestWords(words) {
  const output = words.slice();
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
  for (let index = 0; index < words.length; index += 50) {
    sections.push(transformText(words.slice(index, index + 50).join(" ")));
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
  if (!prefs.includePunctuation) out = out.replace(/[^\w\s]/g, "");
  if (prefs.capitalization === "lower") out = out.toLowerCase().replace(/\bgod\b/gi, "God");
  if (prefs.capitalization === "words") out = out.split(" ").map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(" ").replace(/\bgod\b/gi, "God");
  if (prefs.capitalization === "sentences") out = out.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase()).replace(/\bgod\b/gi, "God");
  return out;
}

async function loadKJV() {
  if (state.kjv) return state.kjv;
  const res = await fetch("assets/kjv-verses-1769.json");
  state.kjv = await res.json();
  return state.kjv;
}

async function makeBiblePages() {
  const data = await loadKJV();
  const pages = [];
  for (let v = Number(prefs.bibleStart); v <= Number(prefs.bibleEnd); v++) {
    const key = `${prefs.bibleBook} ${prefs.bibleChapter}:${v}`;
    if (data[key]) pages.push([`${key} KJV`, cleanVerse(data[key])]);
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
  clearTestTimer();
  stopRewardSound();
  state.input = "";
  state.rowIndex = 0;
  state.pageIndex = 0;
  state.startedAt = null;
  state.charsTyped = 0;
  state.rawTyped = 0;
  state.errors = 0;
  state.characterErrors = 0;
  state.lessonLetterStats = {};
  state.lastAcceptedAt = null;
  state.lastActivityAt = null;
  state.lastKeyAt = null;
  state.keyIntervals = [];
  state.timeRemaining = Number(prefs.testDuration);
  state.warningPlayed = false;
  state.testCompleted = false;
  state.result = null;
  state.completion = false;
  els.completionBanner.classList.add("hidden");
  if (state.mode === "adaptive") {
    state.targetRows = makeAdaptiveRows();
    state.scripturePages = [];
  } else if (state.mode === "time") {
    state.targetRows = makeTimedRows();
    state.scripturePages = [];
  } else if (state.mode === "words") {
    state.targetRows = makeWordSections(Number(prefs.testWordCount));
    state.scripturePages = [];
  } else if (state.mode === "quote") {
    const quote = quoteForLength();
    state.scripturePages = [[quote[0], transformText(quote[1])]];
    state.targetRows = [];
  } else if (state.mode === "custom") {
    state.targetRows = [transformText(prefs.customText || defaultPrefs.customText)];
    state.scripturePages = [];
  } else if (state.mode === "bibleQuotes") {
    state.scripturePages = shuffle(kjvQuotes).slice(0, 12);
    state.targetRows = [];
  } else if (state.mode === "bible") {
    state.scripturePages = await makeBiblePages();
    state.targetRows = [];
  } else {
    state.targetRows = [""];
    state.scripturePages = [];
  }
  render();
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

function modeCopy() {
  const copy = {
    adaptive: ["Adaptive Lesson", "Unlock letters. Keep the flow."],
    time: ["Timed Test", `${prefs.testDuration} second sprint`],
    words: ["Word Test", `${prefs.testWordCount} word challenge`],
    quote: ["Quote Test", "Complete the quote"],
    zen: ["Zen Mode", "Type without limits"],
    custom: ["Custom Test", "Your text, your pace"],
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
  document.body.classList.toggle("focus-mode", prefs.focusMode && !!state.startedAt && !state.testCompleted);
}

function render() {
  const [eyebrow, title] = modeCopy();
  els.modeEyebrow.textContent = eyebrow;
  els.lessonTitle.textContent = title;
  renderControls();
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
  els.unlockCount.textContent = `${unlockedCount} / ${letterOrder.length}`;
  els.unlockNext.textContent = nextLetter ? `Next: ${nextLetter}` : "All letters unlocked";
  els.unlockMeterFill.style.width = `${(unlockedCount / letterOrder.length) * 100}%`;

  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalMastery = 0;
  let sampledLetters = 0;
  els.letterHeatmap.innerHTML = letterHeatmapRows.map(row => {
    const keys = [...row].map(letter => {
      const isEarned = earnedLetters.has(letter);
      const isNext = letter === nextLetter;
      const stats = progress.letterStats[letter.toLowerCase()] || { attempts: 0, correct: 0 };
      const mastery = letterMastery(letter);
      if (isEarned) {
        totalAttempts += stats.attempts;
        totalCorrect += stats.correct;
        if (stats.attempts) {
          totalMastery += mastery.score;
          sampledLetters++;
        }
      }
      const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
      const strength = isEarned && stats.attempts ? "sampled" : "unseen";
      const locked = isEarned ? "" : isNext ? " next" : " locked";
      const detail = !isEarned
        ? isNext ? "Next to unlock" : "Locked"
        : stats.attempts ? `${mastery.percent}% mastery, ${accuracy}% accuracy, ${mastery.pages} of ${masteryRequiredPages} pages` : "No samples yet";
      const hue = Math.round(mastery.score * 120);
      const intensity = (.36 + mastery.score * .56).toFixed(2);
      const heatStyle = isEarned && stats.attempts ? ` style="--heat-hue:${hue};--heat-intensity:${intensity}"` : "";
      const disabled = isEarned ? "" : " disabled";
      return `<button type="button" class="heat-key ${strength}${locked}" data-letter="${letter}"${heatStyle}${disabled} title="${letter}: ${detail}" aria-label="${letter}: ${detail}">${letter}</button>`;
    }).join("");
    return `<div class="heat-row">${keys}</div>`;
  }).join("");
  els.heatmapSummary.textContent = totalAttempts
    ? `${Math.round((totalMastery / Math.max(1, sampledLetters)) * 100)}% mastery / ${Math.round((totalCorrect / totalAttempts) * 100)}% accuracy`
    : "No samples yet";
}

function recordLetterAttempt(expected, isCorrect, recordedAt = performance.now()) {
  if (state.mode !== "adaptive") return;
  const letter = String(expected || "").toLowerCase();
  if (!/^[a-z]$/.test(letter)) return;
  const stats = progress.letterStats[letter] ||= { attempts: 0, correct: 0 };
  stats.attempts++;
  if (isCorrect) stats.correct++;

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
  const speeds = points.map(point => Number(point.wpm) || 0);
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

  els.letterChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${letter} speed learning curve">
      ${grid}
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
  els.letterCurveCaption.textContent = mastery.score >= .95
    ? "Mastery earned"
    : `${mastery.pagesRemaining} pages / ${mastery.attemptsRemaining} attempts remaining`;
  renderLetterChart(upperLetter, history, lifetimeStats);
  if (!els.letterDialog.open) els.letterDialog.showModal();
}

function renderText() {
  const target = currentTarget();
  els.scriptureStrip.classList.toggle("hidden", !currentReference());
  els.scriptureRef.textContent = currentReference();
  const rowLabels = {
    adaptive: `Row ${state.rowIndex + 1} of ${rowsPerPage}`,
    time: `${Math.max(0, Math.ceil(state.timeRemaining))} seconds`,
    words: state.targetRows.length > 1 ? `Section ${state.rowIndex + 1} of ${state.targetRows.length}` : `${prefs.testWordCount} words`,
    quote: "Quote",
    zen: "Zen",
    custom: "Custom text",
    bible: `Scripture ${state.pageIndex + 1} of ${state.scripturePages.length}`,
    bibleQuotes: `Quote ${state.pageIndex + 1} of ${state.scripturePages.length}`
  };
  els.rowLabel.textContent = rowLabels[state.mode] || "Practice";
  els.charLabel.textContent = state.mode === "zen" ? `${state.input.length}` : `${state.input.length} / ${target.length}`;
  if (state.mode === "zen") {
    els.typingText.textContent = state.input || "\u00a0";
    return;
  }
  let characterIndex = 0;
  let nextWordMarked = false;
  const wordGroups = target.match(/\S+|\s+/g) || [];
  els.typingText.innerHTML = wordGroups.map(group => {
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
    let wordState = "";
    if (!isSpace) {
      if (state.input.length >= groupStart && state.input.length < groupEnd) wordState = " active-word";
      else if (!nextWordMarked && groupStart > state.input.length) {
        wordState = " next-word";
        nextWordMarked = true;
      }
    }
    const groupClass = isSpace ? "typing-space" : `typing-word${wordState}`;
    return `<span class="${groupClass}">${characters}</span>`;
  }).join("");
  if (prefs.showAllLines && ["adaptive", "time"].includes(state.mode)) {
    const upcoming = state.targetRows.slice(state.rowIndex + 1, state.rowIndex + 3);
    if (upcoming.length) {
      els.typingText.insertAdjacentHTML("beforeend", upcoming.map(line => `<span class="typing-preview-line">${escapeHtml(line)}</span>`).join(""));
    }
  }
}

function renderControls() {
  if (state.mode === "bible") {
    els.modeControls.innerHTML = `
      <strong>KJV</strong>
      <label>Book<select id="bibleBook">${books.map(b => `<option ${b === prefs.bibleBook ? "selected" : ""}>${b}</option>`).join("")}</select></label>
      <label>Chapter<input id="bibleChapter" type="number" min="1" max="150" value="${prefs.bibleChapter}"></label>
      <label>Start<input id="bibleStart" type="number" min="1" max="176" value="${prefs.bibleStart}"></label>
      <label>End<input id="bibleEnd" type="number" min="${prefs.bibleStart}" max="176" value="${prefs.bibleEnd}"></label>`;
    bindBibleControls();
  } else if (state.mode === "bibleQuotes") {
    els.modeControls.innerHTML = `<strong>KJV</strong>`;
  } else if (state.mode === "adaptive") {
    els.modeControls.innerHTML = `<strong>Unlocked</strong><span class="unlocked-list">${letterOrder.slice(0, prefs.practiceLetters).join(" ")}</span>`;
  } else if (state.mode === "time") {
    els.modeControls.innerHTML = controlOptions("testDuration", [15, 30, 60, 120], value => String(value));
  } else if (state.mode === "words") {
    els.modeControls.innerHTML = `
      ${controlOptions("testWordCount", [10, 25, 50], value => String(value))}
      <label class="word-count-control">Custom
        <input id="wordCountControl" type="number" min="1" max="3000" step="1" inputmode="numeric" value="${prefs.testWordCount}">
      </label>
      <button type="button" class="control-option" data-action="apply-word-count">Start</button>`;
  } else if (state.mode === "quote") {
    els.modeControls.innerHTML = controlOptions("quoteLength", ["short", "medium", "long", "epic"], value => value);
  } else if (state.mode === "custom") {
    els.modeControls.innerHTML = `<button type="button" class="control-option active" data-action="custom-text">Change text</button>`;
  } else if (state.mode === "zen") {
    els.modeControls.innerHTML = `<strong>Endless</strong>`;
  }

  if (["time", "words", "custom"].includes(state.mode)) {
    els.modeControls.insertAdjacentHTML("afterbegin", `
      <div class="control-segment">
        <button type="button" class="control-option ${prefs.includePunctuation ? "active" : ""}" data-toggle-pref="includePunctuation">Punctuation</button>
        <button type="button" class="control-option ${prefs.includeNumbers ? "active" : ""}" data-toggle-pref="includeNumbers">Numbers</button>
      </div>`);
  }
}

function controlOptions(prefKey, values, labelFor) {
  return `<div class="control-segment">${values.map(value => `
    <button type="button" class="control-option ${String(prefs[prefKey]) === String(value) ? "active" : ""}" data-pref="${prefKey}" data-value="${value}">${labelFor(value)}</button>`).join("")}</div>`;
}

function bindBibleControls() {
  ["bibleBook","bibleChapter","bibleStart","bibleEnd"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      const key = id.replace("bible", "");
      const prop = `bible${key}`;
      prefs[prop] = e.target.type === "number" ? Number(e.target.value) : e.target.value;
      if (prefs.bibleEnd < prefs.bibleStart) prefs.bibleEnd = prefs.bibleStart;
      save();
      restart();
    });
  });
}

let keyboardElements = new Map();

function renderKeyboard() {
  const unlocked = new Set(letterOrder.slice(0, prefs.practiceLetters));
  const layout = keyboardLayouts[prefs.keyboardLayout] || keyboardLayouts.mac;
  els.keyboard.className = `keyboard ${prefs.keyboardSize} layout-${prefs.keyboardLayout} style-${prefs.keymapStyle}`;
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
let lastErrorSoundAt = 0;

function setKeyboardKeyClass(key, className, isActive) {
  keyboardElements.get(key)?.classList.toggle(className, isActive);
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
  mistakeKeyTimer = setTimeout(() => {
    setKeyboardKeyClass(state.mistakeKey, "mistake", false);
    state.mistakeKey = "";
  }, 240);
}

function handleKey(event) {
  if (els.settingsDialog.open || els.statsDialog.open || els.letterDialog.open || els.customTextDialog.open) return;
  if (event.target instanceof HTMLElement && (event.target.matches("input, select, textarea") || event.target.isContentEditable)) return;
  const restartKey = { escape: "Escape", tab: "Tab", enter: "Enter" }[prefs.quickRestart];
  if (restartKey && event.key === restartKey) {
    event.preventDefault();
    restart();
    return;
  }
  if (state.testCompleted) return;
  state.capsLock = !!event.getModifierState?.("CapsLock");
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
    const backspaceAllowed = prefs.confidenceMode !== "max" && (prefs.confidenceMode !== "word" || state.input.length > wordStart);
    if (state.input.length && backspaceAllowed) {
      state.input = state.input.slice(0, -1);
      state.charsTyped = Math.max(0, state.charsTyped - 1);
      state.characterErrors = 0;
    }
    renderText();
    renderLiveMetrics();
    if (prefs.keymapMode === "next") renderKeyboard();
    return;
  }
  if (event.key === "Enter" && prefs.quickEnd && testModes.has(state.mode) && state.startedAt && state.charsTyped) {
    event.preventDefault();
    finishTest();
    return;
  }
  if (event.key.length !== 1) return;
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
  const key = event.key;
  const expected = target[state.input.length];
  if (state.mode !== "zen" && key !== expected) {
    if (state.characterErrors < Number(prefs.errorLimit)) {
      state.errors++;
      state.characterErrors++;
      recordLetterAttempt(expected, false, recordedAt);
    }
    flashMistakeKey(keyId);
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
  if (prefs.typingSounds) playKey();
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
    const wpm = Math.max(0, Math.min(200, timedWpm));
    const history = Array.isArray(progress.letterHistory[letter]) ? progress.letterHistory[letter] : [];
    progress.letterHistory[letter] = history;
    history.push({
      at: completedAt,
      wpm: Number(wpm.toFixed(1)),
      accuracy: Number(accuracy.toFixed(1)),
      attempts: stats.attempts
    });
    if (history.length > 60) progress.letterHistory[letter] = history.slice(-60);
  });
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
  progress.lessonHistory.push(result);
  if (progress.lessonHistory.length > 120) progress.lessonHistory = progress.lessonHistory.slice(-120);
  state.lastWpm = result.wpm;
  state.lastAccuracy = result.accuracy;
  recordLetterLessonResults(wpm, completedAt);
  return result;
}

function finishLine() {
  if (state.mode === "adaptive") finishAdaptiveLine();
  else if (state.mode === "time") finishTimedLine();
  else if (state.mode === "words") finishWordSection();
  else if (["quote", "custom"].includes(state.mode)) finishTest();
  else if (["bible", "bibleQuotes"].includes(state.mode)) finishScripture();
}

function updateLifetimeAverages(metrics) {
  progress.avgWpm = progress.avgWpm ? (progress.avgWpm * .75 + metrics.wpm * .25) : metrics.wpm;
  progress.avgAccuracy = progress.avgAccuracy ? (progress.avgAccuracy * .8 + metrics.accuracy * .2) : metrics.accuracy;
}

function finishAdaptiveLine() {
  const completedRow = state.rowIndex + 1;
  const completedPage = completedRow === rowsPerPage;
  const newlyUnlocked = completedPage && prefs.practiceLetters < letterOrder.length ? letterOrder[prefs.practiceLetters] : "";
  if (completedPage) {
    const metrics = currentMetrics();
    updateLifetimeAverages(metrics);
    recordCompletedLesson(metrics.wpm, metrics.accuracy, { raw: metrics.raw, consistency: metrics.consistency, elapsedMs: metrics.elapsedMs });
  }
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = newlyUnlocked ? `${newlyUnlocked} unlocked` : "Line cleared";
  els.completionBanner.classList.remove("hidden");
  playReward(completedRow);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
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
    if (state.rowIndex >= rowsPerPage) {
      state.pageIndex++;
      state.rowIndex = 0;
      if (prefs.practiceLetters < letterOrder.length) {
        prefs.practiceLetters++;
        document.getElementById("practiceLetters").value = String(prefs.practiceLetters);
        save();
      }
      state.targetRows = makeAdaptiveRows();
    }
    render();
  }, 100);
}

function finishTimedLine() {
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = "Line cleared";
  els.completionBanner.classList.remove("hidden");
  playReward((state.rowIndex % 9) + 1);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
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
  els.completionBanner.textContent = `Section ${state.rowIndex + 1} cleared`;
  els.completionBanner.classList.remove("hidden");
  playReward((state.rowIndex % 9) + 1);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.characterErrors = 0;
    state.lastAcceptedAt = null;
    state.rowIndex++;
    renderText();
    renderLiveMetrics();
    if (prefs.keymapMode === "next") renderKeyboard();
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
  updateLifetimeAverages(metrics);
  state.result = { ...savedResult, ...metrics, personalBest: metrics.wpm > previousBest };
  state.testCompleted = true;
  save();
  playReward(rowsPerPage);
  render();
}

let audioCtx;
function ctx() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, dur, type = "square", gain = .045, delay = 0) {
  const c = ctx();
  if (c.state === "suspended") c.resume().catch(() => {});
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
}
function playKey() {
  if (prefs.soundStyle === "off") return;
  const buffers = keyboardSoundBuffers[prefs.soundStyle];
  if (!buffers?.length) {
    if (keyboardSoundFiles[prefs.soundStyle]) ensureKeySoundStyle(prefs.soundStyle);
    playSynthKey(keyboardSoundFiles[prefs.soundStyle] ? "soft-tap" : monkeytypeSoundProfiles[prefs.soundStyle]);
    return;
  }

  const c = ctx();
  if (c.state === "suspended") c.resume().catch(() => {});
  const cursor = keyboardSoundCursors[prefs.soundStyle] || 0;
  keyboardSoundCursors[prefs.soundStyle] = (cursor + 1) % buffers.length;

  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffers[cursor % buffers.length];
  gain.gain.value = (keyboardSoundVolumes[prefs.soundStyle] || .5) * Number(prefs.soundVolume);
  source.connect(gain).connect(c.destination);
  source.start();
}
function playError() {
  if (prefs.errorStyle === "2") {
    tone(190, .07, "triangle", .075);
    tone(125, .09, "sine", .045, .025);
    return;
  }
  if (prefs.errorStyle === "3") {
    tone(560, .045, "square", .055);
    tone(280, .07, "square", .04, .045);
    return;
  }
  if (prefs.errorStyle === "4") {
    tone(110, .13, "sawtooth", .065);
    tone(82, .16, "square", .035, .02);
    return;
  }
  tone(420, .11, "square", .08);
}

function playTimeWarning() {
  tone(880, .09, "sine", .055);
  tone(1174.66, .12, "sine", .045, .08);
}

function playSynthKey(style) {
  const cursor = keyboardSoundCursors[style] || 0;
  keyboardSoundCursors[style] = cursor + 1;
  const scales = {
    pentatonic: [261.63, 293.66, 329.63, 392, 440],
    blues: [261.63, 311.13, 349.23, 369.99, 392, 466.16]
  };
  if (scales[style]) {
    tone(scales[style][cursor % scales[style].length], .08, "sine", .025);
    return;
  }
  const profiles = {
    "soft-tap": [220, .025, "sine", .028],
    "sharp-tap": [920, .018, "square", .025],
    wooden: [170, .045, "triangle", .045],
    bubble: [540 + (cursor % 3) * 45, .055, "sine", .03],
    metallic: [1200, .04, "sawtooth", .022],
    glass: [1568, .09, "sine", .025],
    deep: [95, .065, "sine", .055],
    crisp: [760, .025, "triangle", .035],
    "arcade-key": [330 + (cursor % 4) * 55, .045, "square", .03],
    retro: [196 + (cursor % 2) * 98, .05, "square", .03],
    stone: [82, .075, "triangle", .07],
    paper: [1380, .018, "sawtooth", .018],
    muted: [135, .025, "sine", .02],
    spring: [420 + (cursor % 3) * 70, .08, "triangle", .035],
    sine: [440, .04, "sine", .03],
    sawtooth: [330, .035, "sawtooth", .024],
    square: [330, .035, "square", .025],
    triangle: [392, .045, "triangle", .03]
  };
  const [freq, duration, type, gain] = profiles[style] || profiles["soft-tap"];
  tone(freq, duration, type, gain);
  if (style === "stone") tone(61, .08, "sine", .035, .008);
  if (style === "glass") tone(2349.32, .08, "sine", .012, .01);
}

const monkeytypeSoundProfiles = {
  8: "sine",
  9: "sawtooth",
  10: "square",
  11: "triangle",
  12: "pentatonic",
  13: "blues",
  14: "soft-tap",
  15: "sharp-tap",
  16: "wooden",
  17: "bubble",
  18: "metallic",
  19: "glass",
  20: "deep",
  21: "crisp",
  22: "arcade-key",
  23: "retro",
  24: "stone",
  25: "paper",
  26: "spring"
};

const keyboardSoundFiles = {
  1: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/clicky/key-${index + 1}.mp3`),
  2: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/clacky/key-${index + 1}.mp3`),
  3: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/creamy/key-${index + 1}.mp3`),
  4: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/thocky/key-${index + 1}.mp3`),
  5: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/poppy/key-${index + 1}.mp3`),
  6: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/marbly/key-${index + 1}.mp3`),
  7: ["assets/key-sounds/typewriter/key.wav", "assets/key-sounds/typewriter/key2.wav"]
};
const keyboardSoundVolumes = {
  1: .48,
  2: .5,
  3: .58,
  4: .58,
  5: .54,
  6: .52,
  7: .42
};
const keyboardSoundBuffers = {};
const keyboardSoundCursors = {};
const keyboardSoundLoading = {};

async function ensureKeySoundStyle(style) {
  if (!keyboardSoundFiles[style] || keyboardSoundBuffers[style]) return;
  if (keyboardSoundLoading[style]) return keyboardSoundLoading[style];
  const c = ctx();
  keyboardSoundLoading[style] = Promise.all(keyboardSoundFiles[style].map(async file => {
      const response = await fetch(new URL(file, document.baseURI));
      if (!response.ok) throw new Error(`Could not load ${file}`);
      return c.decodeAudioData(await response.arrayBuffer());
  })).then(decoded => {
    keyboardSoundBuffers[style] = decoded;
  }).catch(error => console.warn(`Keyboard sound ${style} could not be loaded.`, error));
  return keyboardSoundLoading[style];
}

async function preloadKeySounds() {
  await Promise.all([ensureKeySoundStyle(prefs.soundStyle), ensureKeySoundStyle("3")]);
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
  const preferred = prefs.soundStyle === "off" ? "3" : prefs.soundStyle;
  return keyboardSoundBuffers[preferred] || keyboardSoundBuffers["3"] || keyboardSoundBuffers["1"] || [];
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

function setupSettings() {
  const practiceLetters = document.getElementById("practiceLetters");
  for (let i = startLetters; i <= 26; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${i} letters`;
    if (i === Number(prefs.practiceLetters)) opt.selected = true;
    practiceLetters.appendChild(opt);
  }

  const selectIds = [
    "testDuration", "testWordCount", "quoteLength", "difficulty", "capitalization", "quickRestart", "confidenceMode",
    "errorLimit", "theme", "currentCue", "caretStyle", "smoothCaret", "typedEffect", "highlightMode", "fontSize",
    "lineWidth", "timerStyle", "speedUnit", "keyboardLayout", "keyboardSize", "keymapMode", "keymapStyle",
    "keymapLegend", "soundStyle", "soundVolume", "rewardStyle", "errorStyle", "timeWarning", "practiceLetters",
    "wordsPerRow", "dailyGoalMinutes"
  ];
  const numericIds = new Set(["testDuration", "testWordCount", "errorLimit", "soundVolume", "practiceLetters", "wordsPerRow", "dailyGoalMinutes"]);
  const restartIds = new Set(["testDuration", "testWordCount", "quoteLength", "difficulty", "capitalization", "practiceLetters", "wordsPerRow"]);
  const keyboardIds = new Set(["keyboardLayout", "keyboardSize", "keymapMode", "keymapStyle", "keymapLegend"]);

  selectIds.forEach(id => {
    const el = document.getElementById(id);
    el.value = prefs[id];
    el.addEventListener("change", event => {
      prefs[id] = numericIds.has(id) ? Number(event.target.value) : event.target.value;
      if (id === "testWordCount") {
        prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(prefs.testWordCount || defaultPrefs.testWordCount)));
        event.target.value = String(prefs.testWordCount);
      }
      save();
      if (id === "theme") applyTheme();
      if (id === "soundStyle") {
        ensureKeySoundStyle(prefs.soundStyle).then(() => {
          if (prefs.typingSounds) playKey();
        });
      } else if (id === "rewardStyle") {
        stopRewardSound();
        playReward(1);
      } else if (id === "errorStyle" && prefs.errorSounds) {
        playError();
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
    "showLiveAccuracy", "showLiveRaw", "showLiveConsistency", "showProgress", "showAllLines", "typingSounds", "errorSounds"
  ];
  toggleIds.forEach(id => {
    const el = document.getElementById(id);
    el.checked = !!prefs[id];
    el.addEventListener("change", event => {
      prefs[id] = event.target.checked;
      save();
      if (["includePunctuation", "includeNumbers"].includes(id)) restart();
      else render();
    });
  });

  els.settingsBtn.addEventListener("click", () => els.settingsDialog.showModal());

  els.saveCustomText.addEventListener("click", () => {
    const value = els.customTextInput.value.replace(/\s+/g, " ").trim();
    if (value) prefs.customText = value;
    save();
    if (state.mode === "custom") restart();
  });
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

els.letterHeatmap.addEventListener("click", event => {
  const key = event.target.closest("[data-letter]");
  if (!key || key.disabled) return;
  openLetterDetails(key.dataset.letter);
});

function applyWordCountControl() {
  const input = document.getElementById("wordCountControl");
  if (!input) return;
  prefs.testWordCount = Math.max(1, Math.min(3000, Math.round(Number(input.value) || defaultPrefs.testWordCount)));
  input.value = String(prefs.testWordCount);
  document.getElementById("testWordCount").value = String(prefs.testWordCount);
  save();
  restart();
}

els.modeControls.addEventListener("click", event => {
  const option = event.target.closest("[data-pref]");
  const toggle = event.target.closest("[data-toggle-pref]");
  const action = event.target.closest("[data-action]");
  if (option) {
    const key = option.dataset.pref;
    const numeric = ["testDuration", "testWordCount"].includes(key);
    prefs[key] = numeric ? Number(option.dataset.value) : option.dataset.value;
    const setting = document.getElementById(key);
    if (setting) setting.value = String(prefs[key]);
    save();
    restart();
  } else if (toggle) {
    const key = toggle.dataset.togglePref;
    prefs[key] = !prefs[key];
    const setting = document.getElementById(key);
    if (setting) setting.checked = !!prefs[key];
    save();
    restart();
  } else if (action?.dataset.action === "apply-word-count") {
    applyWordCountControl();
  } else if (action?.dataset.action === "custom-text") {
    els.customTextInput.value = prefs.customText;
    els.customTextDialog.showModal();
  }
});

els.modeControls.addEventListener("keydown", event => {
  if (event.target.id === "wordCountControl" && event.key === "Enter") {
    event.preventDefault();
    applyWordCountControl();
  }
});

document.querySelectorAll(".mode-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.mode = btn.dataset.mode;
    restart();
    if (state.mode === "custom") {
      els.customTextInput.value = prefs.customText;
      els.customTextDialog.showModal();
    }
  });
});
els.restartBtn.addEventListener("click", restart);
els.resultRestartBtn.addEventListener("click", restart);
els.statsBtn.addEventListener("click", () => els.statsDialog.showModal());
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncFullscreenButton);
document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
document.addEventListener("keydown", handleKey);
window.addEventListener("pagehide", save);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});
preloadRewardSounds();
preloadKeySounds();
setupSettings();
if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) els.fullscreenBtn.hidden = true;
syncFullscreenButton();
save();
restart();
