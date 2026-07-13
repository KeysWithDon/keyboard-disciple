const letterOrder = "ENIARLTOSUDYCGHPMKBWFZVXQJ".split("");
const startLetters = 6;
const rowsPerPage = 10;
const STORAGE_KEY = "keyboard-disciple-web";
const letterHeatmapRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const keyboardSoundStyles = new Set(["clicky", "clacky", "creamy", "thocky", "poppy", "marbly", "silent", "typewriter"]);
const rewardSoundStyles = new Set(["preacher", "key-bloom", "glass-keys"]);
const errorSoundStyles = new Set(["beep", "soft-knock", "digital-blip"]);
const themeStyles = new Set(["dark", "light"]);
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
  errors: 0,
  characterErrors: 0,
  lessonLetterStats: {},
  lastAcceptedAt: null,
  lastActivityAt: null,
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
  currentCue: "highlight",
  keyboardLayout: "mac",
  keyboardSize: "standard",
  soundStyle: "clicky",
  rewardStyle: "preacher",
  errorStyle: "beep",
  theme: "dark",
  typingSounds: true,
  errorSounds: true,
  showKeyboard: true,
  includePunctuation: true,
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
if (!keyboardSoundStyles.has(prefs.soundStyle)) prefs.soundStyle = defaultPrefs.soundStyle;
if (!keyboardLayouts[prefs.keyboardLayout]) prefs.keyboardLayout = defaultPrefs.keyboardLayout;
if (!rewardSoundStyles.has(prefs.rewardStyle)) prefs.rewardStyle = defaultPrefs.rewardStyle;
if (!errorSoundStyles.has(prefs.errorStyle)) prefs.errorStyle = defaultPrefs.errorStyle;
if (!themeStyles.has(prefs.theme)) prefs.theme = defaultPrefs.theme;
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

const books = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

const els = Object.fromEntries(["modeEyebrow","lessonTitle","modeControls","typingText","rowLabel","charLabel","scriptureStrip","scriptureRef","completionBanner","keyboard","keyboardWrap","lessonScore","lastWpm","lastAccuracy","topWpm","learningRate","dailyGoalText","dailyGoalFill","settingsDialog","settingsBtn","restartBtn","letterHud","unlockNext","unlockCount","unlockMeterFill","unlockTrack","letterHeatmap","heatmapSummary","letterDialog","letterDetailBadge","letterDetailTitle","letterLastSpeed","letterTopSpeed","letterAccuracy","letterLearningRate","letterLessons","letterCurveCaption","letterChart"].map(id => [id, document.getElementById(id)]));

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

function shuffle(items) {
  return items.slice().sort(() => Math.random() - 0.5);
}

function allowedSet() {
  return new Set(letterOrder.slice(0, prefs.practiceLetters).map(x => x.toLowerCase()));
}

function allowed(word) {
  const set = allowedSet();
  return [...word.toLowerCase()].every(ch => !/[a-z]/.test(ch) || set.has(ch));
}

function wordDeck() {
  const common = shuffle(commonWords.concat(dictionaryExtra.filter(w => w.length <= 6)).filter(allowed));
  const moderate = shuffle(moderateWords.concat(dictionaryExtra.filter(w => w.length >= 6 && w.length <= 9)).filter(allowed));
  const rare = shuffle(rareWords.concat(dictionaryExtra.filter(w => w.length >= 9)).filter(allowed));
  return { common, moderate, rare };
}

function makeAdaptiveRows() {
  const deck = wordDeck();
  const rows = [];
  let ci = 0, mi = 0, ri = 0;
  for (let r = 0; r < rowsPerPage; r++) {
    const words = [];
    for (let i = 0; i < Number(prefs.wordsPerRow); i++) {
      const pos = r * Number(prefs.wordsPerRow) + i + 1;
      let list = deck.common;
      let index = ci++;
      if (pos % 100 === 0 && deck.rare.length) { list = deck.rare; index = ri++; }
      else if (pos % 20 === 0 && deck.moderate.length) { list = deck.moderate; index = mi++; }
      if (!list.length) list = deck.common.length ? deck.common : ["lean", "real", "line"];
      words.push(list[index % list.length]);
    }
    rows.push(transformText(words.join(" ")));
  }
  return rows;
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

async function restart() {
  stopRewardSound();
  state.input = "";
  state.rowIndex = 0;
  state.pageIndex = 0;
  state.startedAt = null;
  state.charsTyped = 0;
  state.errors = 0;
  state.characterErrors = 0;
  state.lessonLetterStats = {};
  state.lastAcceptedAt = null;
  state.lastActivityAt = null;
  state.completion = false;
  els.completionBanner.classList.add("hidden");
  if (state.mode === "adaptive") {
    state.targetRows = makeAdaptiveRows();
    state.scripturePages = [];
  } else if (state.mode === "quotes") {
    state.scripturePages = shuffle(kjvQuotes).slice(0, 12);
  } else if (state.mode === "bible") {
    state.scripturePages = await makeBiblePages();
  } else {
    state.targetRows = [""];
    state.scripturePages = [];
  }
  render();
}

function currentTarget() {
  if (state.mode === "bible" || state.mode === "quotes") return state.scripturePages[state.pageIndex]?.[1] || "";
  if (state.mode === "free") return "";
  return state.targetRows[state.rowIndex] || "";
}

function currentReference() {
  if (state.mode === "bible" || state.mode === "quotes") return state.scripturePages[state.pageIndex]?.[0] || "";
  return "";
}

function render() {
  els.modeEyebrow.textContent = state.mode === "adaptive" ? "Adaptive Lesson" : state.mode === "bible" ? "Scripture Reading" : state.mode === "quotes" ? "Bible Quotes" : "Free Typing";
  els.lessonTitle.textContent = state.mode === "adaptive" ? "Unlock letters. Keep the flow." : state.mode === "bible" ? "Bible Reading" : state.mode === "quotes" ? "Complete Quotes" : "Free Typing";
  renderControls();
  renderText();
  renderKeyboard();
  renderLetterProgress();
  renderPerformance();
  els.keyboardWrap.classList.toggle("hidden", !prefs.showKeyboard);
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
  els.unlockTrack.innerHTML = letterOrder.map((letter, index) => {
    const status = index < unlockedCount ? "unlocked" : index === unlockedCount ? "next" : "locked";
    return `<span class="unlock-letter ${status}" title="${letter} - ${status}">${letter}</span>`;
  }).join("");

  let totalAttempts = 0;
  let totalCorrect = 0;
  els.letterHeatmap.innerHTML = letterHeatmapRows.map(row => {
    const keys = [...row].map(letter => {
      const isEarned = earnedLetters.has(letter);
      const stats = progress.letterStats[letter.toLowerCase()] || { attempts: 0, correct: 0 };
      if (isEarned) {
        totalAttempts += stats.attempts;
        totalCorrect += stats.correct;
      }
      const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
      const strength = isEarned && stats.attempts ? "sampled" : "unseen";
      const locked = isEarned ? "" : " locked";
      const detail = !isEarned
        ? "Locked"
        : stats.attempts ? `${accuracy}% accuracy over ${stats.attempts} attempts` : "No samples yet";
      const hue = Math.round((accuracy / 100) * 120);
      const intensity = (.42 + Math.min(1, stats.attempts / 20) * .5).toFixed(2);
      const heatStyle = isEarned && stats.attempts ? ` style="--heat-hue:${hue};--heat-intensity:${intensity}"` : "";
      const disabled = isEarned ? "" : " disabled";
      return `<button type="button" class="heat-key ${strength}${locked}" data-letter="${letter}"${heatStyle}${disabled} title="${letter}: ${detail}" aria-label="${letter}: ${detail}">${letter}</button>`;
    }).join("");
    return `<div class="heat-row">${keys}</div>`;
  }).join("");
  els.heatmapSummary.textContent = totalAttempts
    ? `${Math.round((totalCorrect / totalAttempts) * 100)}% overall`
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
  els.letterDetailBadge.textContent = upperLetter;
  els.letterDetailTitle.textContent = `${upperLetter} progress`;
  els.letterLastSpeed.textContent = latest ? `${Math.round(latest.wpm)} WPM` : "--";
  els.letterTopSpeed.textContent = history.length ? `${Math.round(topSpeed)} WPM` : "--";
  els.letterAccuracy.textContent = accuracy === null ? "--" : `${accuracy}%`;
  els.letterLearningRate.textContent = formatLearningRate(history);
  els.letterLessons.textContent = String(history.length);
  els.letterCurveCaption.textContent = history.length ? `${history.length} completed ${history.length === 1 ? "page" : "pages"}` : "No completed pages";
  renderLetterChart(upperLetter, history, lifetimeStats);
  if (!els.letterDialog.open) els.letterDialog.showModal();
}

function renderText() {
  const target = currentTarget();
  els.scriptureStrip.classList.toggle("hidden", !currentReference());
  els.scriptureRef.textContent = currentReference();
  els.rowLabel.textContent = state.mode === "adaptive" ? `Row ${state.rowIndex + 1} of ${rowsPerPage}` : state.mode === "free" ? "Free Typing" : `Scripture ${state.pageIndex + 1} of ${state.scripturePages.length}`;
  els.charLabel.textContent = state.mode === "free" ? `${state.input.length}` : `${state.input.length} / ${target.length}`;
  if (state.mode === "free") {
    els.typingText.textContent = state.input || "Start typing freely.";
    return;
  }
  let characterIndex = 0;
  const wordGroups = target.match(/\S+|\s+/g) || [];
  els.typingText.innerHTML = wordGroups.map(group => {
    const characters = [...group].map(ch => {
      const index = characterIndex++;
      const cls = index < state.input.length ? "done" : index === state.input.length ? `current ${prefs.currentCue}` : "pending";
      return `<span class="${cls}">${escapeHtml(ch)}</span>`;
    }).join("");
    const groupClass = /^\s+$/.test(group) ? "typing-space" : "typing-word";
    return `<span class="${groupClass}">${characters}</span>`;
  }).join("");
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
  } else if (state.mode === "quotes") {
    els.modeControls.innerHTML = `<strong>KJV</strong>`;
  } else if (state.mode === "adaptive") {
    els.modeControls.innerHTML = `<strong>Unlocked:</strong> ${letterOrder.slice(0, prefs.practiceLetters).join(" ")}`;
  } else {
    els.modeControls.innerHTML = `<span>Type anything. Progress is not scored here.</span>`;
  }
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
  els.keyboard.className = `keyboard ${prefs.keyboardSize} layout-${prefs.keyboardLayout}`;
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
  const isLockedLetter = isLetter && !unlocked.has(key.id.toUpperCase());
  const isModifier = !isLetter && !key.shift && !/^[`0-9\-=\[\]\\;',./]$/.test(key.id);
  const classes = ["key", zone.className, isLockedLetter ? "locked" : "", isModifier ? "modifier" : "", key.id === "space" ? "spacebar" : "", keyboardStateClasses(key.id)].join(" ");
  const label = key.shift
    ? `<span class="key-symbols"><small>${escapeHtml(key.shift)}</small><span>${escapeHtml(key.label)}</span></span>`
    : `<span>${escapeHtml(key.label)}</span>`;
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
  if (els.settingsDialog.open || els.letterDialog.open) return;
  const keyId = visualKeyId(event);
  flashPressedKey(keyId);
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.repeat && state.mode !== "free") {
    event.preventDefault();
    return;
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    if (state.input.length) {
      state.input = state.input.slice(0, -1);
      state.characterErrors = 0;
    }
    renderText();
    return;
  }
  if (event.key.length !== 1) return;
  event.preventDefault();
  const recordedAt = performance.now();
  if (!state.startedAt) state.startedAt = recordedAt;
  trackDailyActivity(recordedAt);
  const target = currentTarget();
  const key = event.key;
  const expected = target[state.input.length];
  if (state.mode !== "free" && key !== expected) {
    if (state.characterErrors < 3) {
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
    return;
  }
  if (state.mode !== "free") recordLetterAttempt(expected, true, recordedAt);
  state.characterErrors = 0;
  state.input += key;
  state.charsTyped++;
  if (prefs.typingSounds) playKey();
  if (state.mode !== "free" && state.input.length >= target.length) finishLine();
  render();
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

function recordCompletedLesson(wpm, accuracy) {
  const completedAt = Date.now();
  const result = {
    at: completedAt,
    mode: state.mode,
    wpm: Number(wpm.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    score: lessonScore(wpm, accuracy)
  };
  progress.lessonHistory.push(result);
  if (progress.lessonHistory.length > 120) progress.lessonHistory = progress.lessonHistory.slice(-120);
  state.lastWpm = result.wpm;
  state.lastAccuracy = result.accuracy;
  recordLetterLessonResults(wpm, completedAt);
  return result;
}

function finishLine() {
  const completedAdaptiveRow = state.mode === "adaptive" ? state.rowIndex + 1 : 0;
  const completedPage = state.mode !== "adaptive" || completedAdaptiveRow === rowsPerPage;
  const newlyUnlocked = completedAdaptiveRow === rowsPerPage && prefs.practiceLetters < letterOrder.length
    ? letterOrder[prefs.practiceLetters]
    : "";
  if (completedPage) {
    const elapsedMin = Math.max(.02, (performance.now() - state.startedAt) / 60000);
    const wpm = (state.charsTyped / 5) / elapsedMin;
    const attempts = state.charsTyped + state.errors;
    const accuracy = attempts ? (state.charsTyped / attempts) * 100 : 100;
    progress.avgWpm = progress.avgWpm ? (progress.avgWpm * .75 + wpm * .25) : wpm;
    progress.avgAccuracy = progress.avgAccuracy ? (progress.avgAccuracy * .8 + accuracy * .2) : accuracy;
    recordCompletedLesson(wpm, accuracy);
  }
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = newlyUnlocked ? `${newlyUnlocked} unlocked` : state.mode === "adaptive" ? "Line cleared" : "Scripture cleared";
  els.completionBanner.classList.remove("hidden");
  if (completedAdaptiveRow) playReward(completedAdaptiveRow);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    if (completedPage) {
      state.startedAt = null;
      state.charsTyped = 0;
      state.errors = 0;
      state.lessonLetterStats = {};
    }
    state.lastAcceptedAt = null;
    if (state.mode === "adaptive") {
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
    } else {
      state.pageIndex++;
      if (state.pageIndex >= state.scripturePages.length) state.pageIndex = 0;
    }
    render();
  }, 100);
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
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(.0001, start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur);
}
function playKey() {
  if (prefs.soundStyle === "silent") return;
  const buffers = keyboardSoundBuffers[prefs.soundStyle] || keyboardSoundBuffers.clicky;
  if (!buffers?.length) return;

  const c = ctx();
  if (c.state === "suspended") c.resume().catch(() => {});
  const cursor = keyboardSoundCursors[prefs.soundStyle] || 0;
  keyboardSoundCursors[prefs.soundStyle] = (cursor + 1) % buffers.length;

  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffers[cursor % buffers.length];
  gain.gain.value = keyboardSoundVolumes[prefs.soundStyle] || .5;
  source.connect(gain).connect(c.destination);
  source.start();
}
function playError() {
  if (prefs.errorStyle === "soft-knock") {
    tone(190, .07, "triangle", .075);
    tone(125, .09, "sine", .045, .025);
    return;
  }
  if (prefs.errorStyle === "digital-blip") {
    tone(560, .045, "square", .055);
    tone(280, .07, "square", .04, .045);
    return;
  }
  tone(420, .11, "square", .08);
}

const keyboardSoundFiles = {
  clicky: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/clicky/key-${index + 1}.mp3`),
  clacky: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/clacky/key-${index + 1}.mp3`),
  creamy: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/creamy/key-${index + 1}.mp3`),
  thocky: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/thocky/key-${index + 1}.mp3`),
  poppy: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/poppy/key-${index + 1}.mp3`),
  marbly: Array.from({ length: 5 }, (_, index) => `assets/key-sounds/marbly/key-${index + 1}.mp3`),
  typewriter: ["assets/key-sounds/typewriter/key.wav", "assets/key-sounds/typewriter/key2.wav"]
};
const keyboardSoundVolumes = {
  clicky: .48,
  clacky: .5,
  creamy: .58,
  thocky: .58,
  poppy: .54,
  marbly: .52,
  typewriter: .42
};
const keyboardSoundBuffers = {};
const keyboardSoundCursors = {};

async function preloadKeySounds() {
  const c = ctx();
  await Promise.all(Object.entries(keyboardSoundFiles).map(async ([style, files]) => {
    const decoded = await Promise.all(files.map(async file => {
      const response = await fetch(new URL(file, document.baseURI));
      if (!response.ok) throw new Error(`Could not load ${file}`);
      return c.decodeAudioData(await response.arrayBuffer());
    }));
    keyboardSoundBuffers[style] = decoded;
  })).catch(error => console.warn("Keyboard sounds could not be preloaded.", error));
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
  gain.gain.value = gainValue;
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
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur);
}

function rewardKeySamples() {
  const preferred = prefs.soundStyle === "silent" ? "creamy" : prefs.soundStyle;
  return keyboardSoundBuffers[preferred] || keyboardSoundBuffers.creamy || keyboardSoundBuffers.clicky || [];
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
  for (let i = startLetters; i <= 26; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${i} letters`;
    if (i === Number(prefs.practiceLetters)) opt.selected = true;
    document.getElementById("practiceLetters").appendChild(opt);
  }
  ["wordsPerRow", "dailyGoalMinutes", "currentCue", "keyboardLayout", "keyboardSize", "soundStyle", "rewardStyle", "errorStyle", "theme", "capitalization"].forEach(id => {
    const el = document.getElementById(id);
    el.value = prefs[id];
  });

  ["wordsPerRow", "capitalization"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      prefs[id] = e.target.value;
      save();
      restart();
    });
  });
  document.getElementById("practiceLetters").addEventListener("change", e => {
    prefs.practiceLetters = Number(e.target.value);
    save();
    restart();
  });
  document.getElementById("dailyGoalMinutes").addEventListener("change", e => {
    prefs.dailyGoalMinutes = Number(e.target.value);
    save();
    renderPerformance();
  });
  document.getElementById("currentCue").addEventListener("change", e => {
    prefs.currentCue = e.target.value;
    save();
    renderText();
  });
  ["keyboardLayout", "keyboardSize"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      prefs[id] = e.target.value;
      save();
      renderKeyboard();
    });
  });
  document.getElementById("soundStyle").addEventListener("change", e => {
    prefs.soundStyle = e.target.value;
    save();
    if (prefs.typingSounds) playKey();
  });
  document.getElementById("rewardStyle").addEventListener("change", e => {
    prefs.rewardStyle = e.target.value;
    save();
    stopRewardSound();
    playReward(1);
  });
  document.getElementById("errorStyle").addEventListener("change", e => {
    prefs.errorStyle = e.target.value;
    save();
    if (prefs.errorSounds) playError();
  });
  document.getElementById("theme").addEventListener("change", e => {
    prefs.theme = e.target.value;
    save();
    applyTheme();
  });
  ["typingSounds", "errorSounds"].forEach(id => {
    const el = document.getElementById(id);
    el.checked = !!prefs[id];
    el.addEventListener("change", e => {
      prefs[id] = e.target.checked;
      save();
    });
  });
  const showKeyboard = document.getElementById("showKeyboard");
  showKeyboard.checked = !!prefs.showKeyboard;
  showKeyboard.addEventListener("change", e => {
    prefs.showKeyboard = e.target.checked;
    save();
    els.keyboardWrap.classList.toggle("hidden", !prefs.showKeyboard);
  });
  const includePunctuation = document.getElementById("includePunctuation");
  includePunctuation.checked = !!prefs.includePunctuation;
  includePunctuation.addEventListener("change", e => {
    prefs.includePunctuation = e.target.checked;
    save();
    restart();
  });
  els.settingsBtn.addEventListener("click", () => els.settingsDialog.showModal());
}

els.letterHeatmap.addEventListener("click", event => {
  const key = event.target.closest("[data-letter]");
  if (!key || key.disabled) return;
  openLetterDetails(key.dataset.letter);
});

document.querySelectorAll(".mode-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.mode = btn.dataset.mode;
    restart();
  });
});
els.restartBtn.addEventListener("click", restart);
document.addEventListener("keydown", handleKey);
window.addEventListener("pagehide", save);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") save();
});
preloadRewardSounds();
preloadKeySounds();
setupSettings();
save();
restart();
