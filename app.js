const letterOrder = "ENIARLTOSUDYCGHPMKBWFZVXQNJ".split("");
const startLetters = 6;
const rowsPerPage = 10;
const STORAGE_KEY = "keyboard-disciple-web";

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
  lastWpm: 0,
  lastAccuracy: 100,
  kjv: null,
  pressedKey: "",
  mistakeKey: ""
};

const prefs = Object.assign({
  practiceLetters: startLetters,
  wordsPerRow: 10,
  currentCue: "highlight",
  keyboardSize: "standard",
  soundStyle: "clicky",
  typingSounds: true,
  errorSounds: true,
  showKeyboard: true,
  includePunctuation: true,
  capitalization: "source",
  bibleTranslation: "KJV",
  quoteTranslation: "KJV",
  bibleBook: "John",
  bibleChapter: 3,
  bibleStart: 16,
  bibleEnd: 17
}, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").prefs || {});

const progress = Object.assign({
  rowsCleared: 0,
  avgWpm: 0,
  avgAccuracy: 100
}, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").progress || {});

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

const webQuotes = [
  ["Psalm 23:1 WEB", "Yahweh is my shepherd: I shall lack nothing."],
  ["Psalm 23:4 WEB", "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me."],
  ["Isaiah 40:31 WEB", "But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint."],
  ["Romans 8:28 WEB", "We know that all things work together for good for those who love God, for those who are called according to his purpose."],
  ["Philippians 4:13 WEB", "I can do all things through Christ who strengthens me."],
  ["Proverbs 3:5-6 WEB", "Trust in Yahweh with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight."],
  ["Joshua 1:9 WEB", "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for Yahweh your God is with you wherever you go."],
  ["Matthew 6:33 WEB", "But seek first God's Kingdom and his righteousness; and all these things will be given to you as well."],
  ["John 3:16-17 WEB", "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life. For God didn't send his Son into the world to judge the world, but that the world should be saved through him."],
  ["2 Corinthians 5:7 WEB", "For we walk by faith, not by sight."],
  ["Ephesians 2:8-9 WEB", "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, that no one would boast."],
  ["1 Peter 5:7 WEB", "Casting all your worries on him, because he cares for you."]
];

const books = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
const translationOptions = ["KJV", "WEB", "NIV", "NLT"];
const onlineOnlyTranslations = new Set(["NIV", "NLT"]);

const els = Object.fromEntries(["modeEyebrow","lessonTitle","modeControls","typingText","rowLabel","charLabel","scriptureStrip","scriptureRef","completionBanner","keyboard","keyboardWrap","avgWpm","avgAccuracy","letterCount","rowsCleared","settingsDialog","settingsBtn","restartBtn"].map(id => [id, document.getElementById(id)]));

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ prefs, progress }));
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
  if (onlineOnlyTranslations.has(prefs.bibleTranslation)) {
    const reference = bibleReferenceText();
    return [[`${reference} ${prefs.bibleTranslation}`, `${prefs.bibleTranslation} is connected as an online reading option. Open the passage online to read this translation, then switch back here for local KJV typing practice.`]];
  }
  if (prefs.bibleTranslation === "WEB") {
    const reference = bibleReferenceText();
    return [[`${reference} WEB`, "WEB full-passage reading is not stored locally in this web build yet. WEB is available in Bible Quotes, and NIV or NLT can be opened online from the selector."]];
  }
  const data = await loadKJV();
  const pages = [];
  for (let v = Number(prefs.bibleStart); v <= Number(prefs.bibleEnd); v++) {
    const key = `${prefs.bibleBook} ${prefs.bibleChapter}:${v}`;
    if (data[key]) pages.push([`${key} KJV`, cleanVerse(data[key])]);
  }
  return pages.length ? pages : [["John 3:16 KJV", cleanVerse(data["John 3:16"] || "For God so loved the world, that he gave his only begotten Son.")]];
}

function bibleReferenceText() {
  return `${prefs.bibleBook} ${prefs.bibleChapter}:${prefs.bibleStart}${Number(prefs.bibleEnd) > Number(prefs.bibleStart) ? `-${prefs.bibleEnd}` : ""}`;
}

function bibleGatewayUrl(reference, version) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${encodeURIComponent(version)}`;
}

function cleanVerse(text) {
  return text.replace(/[#\[\]]/g, "").replace(/\s+/g, " ").trim();
}

async function restart() {
  state.input = "";
  state.rowIndex = 0;
  state.pageIndex = 0;
  state.startedAt = null;
  state.completion = false;
  els.completionBanner.classList.add("hidden");
  if (state.mode === "adaptive") {
    state.targetRows = makeAdaptiveRows();
    state.scripturePages = [];
  } else if (state.mode === "quotes") {
    if (onlineOnlyTranslations.has(prefs.quoteTranslation)) {
      state.scripturePages = shuffle(kjvQuotes).slice(0, 12).map(([ref]) => {
        const reference = ref.replace(/\sKJV$/, "");
        return [`${reference} ${prefs.quoteTranslation}`, `${prefs.quoteTranslation} is connected as an online quote option. Use the Open online button to read this reference in ${prefs.quoteTranslation}.`];
      });
    } else {
      const pool = prefs.quoteTranslation === "WEB" ? webQuotes : kjvQuotes;
      state.scripturePages = shuffle(pool).slice(0, 12);
    }
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
  els.avgWpm.textContent = Math.round(progress.avgWpm);
  els.avgAccuracy.textContent = `${Math.round(progress.avgAccuracy)}%`;
  els.letterCount.textContent = prefs.practiceLetters;
  els.rowsCleared.textContent = progress.rowsCleared;
  els.keyboardWrap.classList.toggle("hidden", !prefs.showKeyboard);
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
  els.typingText.innerHTML = [...target].map((ch, i) => {
    const cls = i < state.input.length ? "done" : i === state.input.length ? `current ${prefs.currentCue}` : "pending";
    return `<span class="${cls}">${escapeHtml(ch)}</span>`;
  }).join("");
}

function renderControls() {
  if (state.mode === "bible") {
    els.modeControls.innerHTML = `
      <label>Version<select id="bibleVersion">${translationOptions.map(t => `<option ${prefs.bibleTranslation === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>Book<select id="bibleBook">${books.map(b => `<option ${b === prefs.bibleBook ? "selected" : ""}>${b}</option>`).join("")}</select></label>
      <label>Chapter<input id="bibleChapter" type="number" min="1" max="150" value="${prefs.bibleChapter}"></label>
      <label>Start<input id="bibleStart" type="number" min="1" max="176" value="${prefs.bibleStart}"></label>
      <label>End<input id="bibleEnd" type="number" min="${prefs.bibleStart}" max="176" value="${prefs.bibleEnd}"></label>
      ${onlineOnlyTranslations.has(prefs.bibleTranslation) ? `<a class="primary-button link-button" target="_blank" rel="noopener" href="${bibleGatewayUrl(bibleReferenceText(), prefs.bibleTranslation)}">Open ${prefs.bibleTranslation} online</a>` : ""}`;
    bindBibleControls();
  } else if (state.mode === "quotes") {
    const currentRef = currentReference().replace(/\s(KJV|WEB|NIV|NLT)$/, "");
    els.modeControls.innerHTML = `<label>Quote version<select id="quoteTranslation">${translationOptions.map(t => `<option ${prefs.quoteTranslation === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>${onlineOnlyTranslations.has(prefs.quoteTranslation) && currentRef ? `<a class="primary-button link-button" target="_blank" rel="noopener" href="${bibleGatewayUrl(currentRef, prefs.quoteTranslation)}">Open ${prefs.quoteTranslation} online</a>` : ""}`;
    document.getElementById("quoteTranslation").addEventListener("change", e => { prefs.quoteTranslation = e.target.value; save(); restart(); });
  } else if (state.mode === "adaptive") {
    els.modeControls.innerHTML = `<strong>Unlocked:</strong> ${letterOrder.slice(0, prefs.practiceLetters).join(" ")}`;
  } else {
    els.modeControls.innerHTML = `<span>Type anything. Progress is not scored here.</span>`;
  }
}

function bindBibleControls() {
  ["bibleVersion","bibleBook","bibleChapter","bibleStart","bibleEnd"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      const key = id.replace("bible", "");
      const prop = id === "bibleVersion" ? "bibleTranslation" : `bible${key}`;
      prefs[prop] = e.target.type === "number" ? Number(e.target.value) : e.target.value;
      if (prefs.bibleEnd < prefs.bibleStart) prefs.bibleEnd = prefs.bibleStart;
      save();
      restart();
    });
  });
}

function renderKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const unlocked = new Set(letterOrder.slice(0, prefs.practiceLetters));
  els.keyboard.className = `keyboard ${prefs.keyboardSize}`;
  els.keyboard.innerHTML = rows.map(row => `<div class="key-row">${[...row].map(k => {
    const finger = "ASDFJKL".includes(k) ? "home" : "QWERTGZXCVB".includes(k) ? "left" : "right";
    const cls = ["key", finger, unlocked.has(k) ? "" : "locked", state.pressedKey === k.toLowerCase() ? "pressed" : "", state.mistakeKey === k.toLowerCase() ? "mistake" : ""].join(" ");
    return `<span class="${cls}" data-key="${k.toLowerCase()}">${k}</span>`;
  }).join("")}</div>`).join("") + `<div class="key-row"><span class="key thumb" data-key=" ">Space</span></div>`;
}

function handleKey(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === "Backspace") {
    if (state.input.length) state.input = state.input.slice(0, -1);
    renderText();
    return;
  }
  if (event.key.length !== 1) return;
  event.preventDefault();
  if (!state.startedAt) state.startedAt = performance.now();
  const target = currentTarget();
  const key = event.key;
  state.pressedKey = key.toLowerCase();
  setTimeout(() => { state.pressedKey = ""; renderKeyboard(); }, 90);
  if (state.mode !== "free" && key !== target[state.input.length]) {
    state.errors++;
    state.mistakeKey = key.toLowerCase();
    if (prefs.errorSounds) playError();
    setTimeout(() => { state.mistakeKey = ""; renderKeyboard(); }, 220);
    renderKeyboard();
    return;
  }
  state.input += key;
  state.charsTyped++;
  if (prefs.typingSounds) playKey();
  if (state.mode !== "free" && state.input.length >= target.length) finishLine();
  render();
}

function finishLine() {
  const elapsedMin = Math.max(.02, (performance.now() - state.startedAt) / 60000);
  const wpm = (state.input.length / 5) / elapsedMin;
  const accuracy = Math.max(0, 100 - (state.errors / Math.max(1, state.charsTyped)) * 100);
  progress.avgWpm = progress.avgWpm ? (progress.avgWpm * .75 + wpm * .25) : wpm;
  progress.avgAccuracy = progress.avgAccuracy ? (progress.avgAccuracy * .8 + accuracy * .2) : accuracy;
  progress.rowsCleared++;
  save();
  els.completionBanner.textContent = state.mode === "adaptive" ? "Line cleared" : "Scripture cleared";
  els.completionBanner.classList.remove("hidden");
  playSuccess(state.rowIndex + 1);
  setTimeout(() => {
    els.completionBanner.classList.add("hidden");
    state.input = "";
    state.startedAt = null;
    if (state.mode === "adaptive") {
      state.rowIndex++;
      if (state.rowIndex >= rowsPerPage) {
        state.pageIndex++;
        state.rowIndex = 0;
        state.targetRows = makeAdaptiveRows();
        playPage();
      }
    } else {
      state.pageIndex++;
      if (state.pageIndex >= state.scripturePages.length) state.pageIndex = 0;
    }
    render();
  }, 360);
}

let audioCtx;
function ctx() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, dur, type = "square", gain = .045) {
  const c = ctx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + dur);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + dur);
}
function playKey() {
  const map = { clicky: [1800, .025, "square"], clacky: [1100, .035, "sawtooth"], creamy: [520, .045, "sine"], crunchy: [760, .05, "sawtooth"], thacky: [330, .05, "triangle"], blocky: [190, .065, "square"] };
  tone(...(map[prefs.soundStyle] || map.clicky));
}
function playError() { tone(420, .11, "square", .08); }
function playSuccess(level) { tone(440 + level * 22, .08, "triangle", .06); setTimeout(() => tone(660 + level * 18, .08, "triangle", .04), 70); }
function playPage() { [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, .11, "triangle", .055), i * 90)); }

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
  ["wordsPerRow","currentCue","keyboardSize","soundStyle","capitalization"].forEach(id => {
    const el = document.getElementById(id);
    el.value = prefs[id];
    el.addEventListener("change", e => { prefs[id] = e.target.value; save(); restart(); });
  });
  ["practiceLetters"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => { prefs[id] = Number(e.target.value); save(); restart(); });
  });
  ["typingSounds","errorSounds","showKeyboard","includePunctuation"].forEach(id => {
    const el = document.getElementById(id);
    el.checked = !!prefs[id];
    el.addEventListener("change", e => { prefs[id] = e.target.checked; save(); restart(); });
  });
  els.settingsBtn.addEventListener("click", () => els.settingsDialog.showModal());
}

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
setupSettings();
restart();
