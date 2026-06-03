/*
 * THE RIVER OF SOUND — content & data model
 * ------------------------------------------------------------
 * An interactive timeline: "How has Black music evolved throughout history,
 * and how does it reflect the issues of its time?"
 *
 * Standpoint: an 11th-grade Black Studies Honors student, Seattle Public Schools.
 *
 * Each era is read through one of the four lenses of the SPS / WA State
 * Ethnic Studies framework — Origins & Identity, Power & Oppression,
 * Resistance & Liberation, and Reflection & Action — so the project speaks
 * the same language as the course it was made for.
 *
 * Every claim below is anchored to a credible source listed in `sources`
 * (Smithsonian / NMAAHC, the Library of Congress, HistoryLink.org for the
 * Seattle threads, Britannica, PBS, NPR, History.com). Song links open a
 * YouTube search so the listener can hear the music for themselves.
 */

export const EPIGRAPH = {
  lines: [
    "I’ve known rivers ancient as the world and older",
    "than the flow of human blood in human veins.",
    "My soul has grown deep like the rivers.",
  ],
  attribution: "Langston Hughes, “The Negro Speaks of Rivers,” 1921",
};

// The four Ethnic Studies lenses (color-coded in the UI).
export const LENSES = {
  identity:   { label: "Origins & Identity",       short: "Identity" },
  power:      { label: "Power & Oppression",        short: "Power" },
  resistance: { label: "Resistance & Liberation",   short: "Resistance" },
  reflection: { label: "Reflection & Action",       short: "Reflection" },
};

export const ERAS = [
  /* 1 ───────────────────────────────────────────────────────── */
  {
    id: "roots",
    years: "Before 1619",
    title: "Before the Word, the Drum",
    genre: "West & Central African roots",
    lens: "identity",
    hook: "“The drum talks; the people answer.”",
    body:
      "Every genre downstream of this point begins in West and Central Africa, where music was never " +
      "merely entertainment — it was memory, law, worship, and news. The griot carried a community’s " +
      "entire history in song; the talking drum imitated speech; and everyone answered the leader’s line " +
      "in <em>call-and-response</em>. When millions were stolen through the Middle Passage, captors could " +
      "take their freedom but not these tools. Polyrhythm, the bent “blue note,” improvisation, and " +
      "call-and-response survived in the body — the hidden source code of everything that follows.",
    voices: ["Griots", "Talking drums", "Polyrhythm", "Call-and-response"],
    songs: [{ t: "West African drum & griot tradition", a: "" }],
    seattle: null,
    sources: [
      { label: "Smithsonian NMAAHC — Musical Crossroads", url: "https://nmaahc.si.edu/explore/exhibitions/musical-crossroads" },
      { label: "Smithsonian Music — Musical Crossroads", url: "https://music.si.edu/story/musical-crossroads" },
    ],
    colors: { bg: "#160d07", accent: "#ff9d3c", accent2: "#ffd28a" },
    wave: { amp: 0.80, freq: 1.1, sharp: 0.06, jitter: 0.10, swell: 0.85, speed: 0.45 },
  },

  /* 2 ───────────────────────────────────────────────────────── */
  {
    id: "spirituals",
    years: "1619 – 1865",
    title: "Steal Away",
    genre: "Spirituals · field hollers · work songs",
    lens: "resistance",
    hook: "“Wade in the water, children…”",
    body:
      "Enslaved people were forbidden to read, write, or gather freely — so they testified in song. " +
      "Spirituals and field hollers turned Christian imagery into a double language: “Heaven” could mean " +
      "the North, the “Jordan” the Ohio River, and <em>Wade in the Water</em> a warning to throw the " +
      "bloodhounds off the scent. Harriet Tubman is said to have used spirituals as signals on the " +
      "Underground Railroad. Historians debate how literally any song worked as a map — but whether map " +
      "or metaphor, the music did real work: it organized hope, preserved dignity, and made a way to " +
      "endure, and sometimes escape, the unendurable.",
    voices: ["The ring shout", "Harriet Tubman", "Fisk Jubilee Singers"],
    songs: [
      { t: "Wade in the Water", a: "Negro spiritual" },
      { t: "Swing Low, Sweet Chariot", a: "Negro spiritual" },
      { t: "Steal Away", a: "Negro spiritual" },
    ],
    seattle: null,
    sources: [
      { label: "NMAAHC — Musical Crossroads (Roots & Agency)", url: "https://nmaahc.si.edu/explore/exhibitions/musical-crossroads" },
      { label: "“Wade in the Water” — Wikipedia", url: "https://en.wikipedia.org/wiki/Wade_in_the_Water" },
      { label: "WHYY — Decoding Underground Railroad songs", url: "https://whyy.org/articles/underground-railroad-expert-decodes-songs-with-practical-advice-for-fleeing-slaves/" },
    ],
    colors: { bg: "#07101f", accent: "#5b8cff", accent2: "#aecbff" },
    wave: { amp: 0.66, freq: 0.9, sharp: 0.0, jitter: 0.04, swell: 1.45, speed: 0.38 },
  },

  /* 3 ───────────────────────────────────────────────────────── */
  {
    id: "blues",
    years: "c. 1900 – 1920s",
    title: "Trouble in Mind",
    genre: "The Blues",
    lens: "power",
    hook: "“I hate to see that evenin’ sun go down.”",
    body:
      "Freedom on paper met Jim Crow in fact: sharecropping debt, segregation, and the daily threat of " +
      "violence. Out of the Mississippi Delta came the blues — three chords, twelve bars, and a brutally " +
      "honest “I.” The blue notes bent between the cracks of the piano keys the way Black life bent around " +
      "the cracks of the law. W.C. Handy wrote it down, Bessie Smith — the “Empress of the Blues” — sold " +
      "millions, and the form became the grammar of nearly all American popular music to come. The blues " +
      "did not cause the sorrow; it <em>named</em> it, and naming it was a kind of power.",
    voices: ["W.C. Handy", "Bessie Smith", "Ma Rainey", "Robert Johnson"],
    songs: [
      { t: "Downhearted Blues", a: "Bessie Smith" },
      { t: "Cross Road Blues", a: "Robert Johnson" },
    ],
    seattle: null,
    sources: [
      { label: "Britannica — Blues (music)", url: "https://www.britannica.com/art/blues-music" },
      { label: "NMAAHC — Musical Crossroads", url: "https://nmaahc.si.edu/explore/exhibitions/musical-crossroads" },
    ],
    colors: { bg: "#140a18", accent: "#9a5bff", accent2: "#cfa8ff" },
    wave: { amp: 0.90, freq: 1.5, sharp: 0.10, jitter: 0.16, swell: 0.70, speed: 0.55 },
  },

  /* 4 ───────────────────────────────────────────────────────── */
  {
    id: "jazz",
    years: "1920s – 1930s",
    title: "Take the A Train",
    genre: "Jazz & the Harlem Renaissance",
    lens: "identity",
    hook: "“The freedom to invent yourself — even in a segregated room.”",
    body:
      "The Great Migration carried six million Black Americans north and west, toward jobs and away from " +
      "terror. In crowded new cities the blues went bright and modern and became jazz — improvised, " +
      "swinging, brand-new. Harlem’s “New Negro” Renaissance made Black art a declaration of full " +
      "citizenship; Louis Armstrong’s trumpet and Duke Ellington’s orchestra were sonic proof of genius. " +
      "The contradiction was loud: at the Cotton Club, Black musicians played for whites-only crowds. By " +
      "1939 Billie Holiday turned this music toward open protest with <em>Strange Fruit</em>, an " +
      "anti-lynching ballad now called the first modern protest song.",
    voices: ["Louis Armstrong", "Duke Ellington", "Bessie Smith", "Billie Holiday"],
    songs: [
      { t: "Take the A Train", a: "Duke Ellington" },
      { t: "West End Blues", a: "Louis Armstrong" },
      { t: "Strange Fruit", a: "Billie Holiday" },
    ],
    seattle:
      "The same years lit up S. Jackson Street, the spine of Seattle’s Central District. Its clubs were " +
      "among the only rooms in town where Black, white, and Asian residents met as social equals — the " +
      "cradle of the city’s first real music scene.",
    sources: [
      { label: "HistoryLink — Jackson Street Jazz Scene (Seattle)", url: "https://www.historylink.org/File/22930" },
      { label: "HistoryLink — Rhythm & Roots: Seattle’s First Sound", url: "https://www.historylink.org/File/3641" },
      { label: "Britannica — “Strange Fruit”", url: "https://www.britannica.com/topic/Strange-Fruit-song" },
    ],
    colors: { bg: "#1a1305", accent: "#ffc24a", accent2: "#ffe6a8" },
    wave: { amp: 0.80, freq: 3.2, sharp: 0.12, jitter: 0.46, swell: 0.60, speed: 1.00 },
  },

  /* 5 ───────────────────────────────────────────────────────── */
  {
    id: "gospel",
    years: "1930s – 1940s",
    title: "Precious Lord, Take My Hand",
    genre: "Gospel",
    lens: "identity",
    hook: "“The safest room in America to be fully, joyfully Black.”",
    body:
      "During the Depression, Thomas A. Dorsey fused blues feeling with sacred words to invent gospel — " +
      "and the Black church became a sanctuary where Black joy and grief could be voiced without apology. " +
      "Mahalia Jackson’s voice could hold a whole congregation; Sister Rosetta Tharpe plugged in an " +
      "electric guitar and, with holy distortion, essentially invented the sound of rock and roll a decade " +
      "early. Gospel built the muscle — the choirs, the cadences, the organizing networks — that would " +
      "soon power the Civil Rights Movement from the pew to the street.",
    voices: ["Thomas A. Dorsey", "Mahalia Jackson", "Sister Rosetta Tharpe"],
    songs: [
      { t: "Take My Hand, Precious Lord", a: "Mahalia Jackson" },
      { t: "Strange Things Happening Every Day", a: "Sister Rosetta Tharpe" },
    ],
    seattle: null,
    sources: [
      { label: "Britannica — Sister Rosetta Tharpe", url: "https://www.britannica.com/biography/Sister-Rosetta-Tharpe" },
      { label: "PBS American Masters — Sister Rosetta Tharpe", url: "https://www.pbs.org/wnet/americanmasters/sister-rosetta-tharpe-about-film/2463/" },
    ],
    colors: { bg: "#1a0820", accent: "#d8b13a", accent2: "#ff9ed1" },
    wave: { amp: 1.05, freq: 1.3, sharp: 0.05, jitter: 0.08, swell: 1.6, speed: 0.50 },
  },

  /* 6 ───────────────────────────────────────────────────────── */
  {
    id: "rocknroll",
    years: "late 1940s – 1950s",
    title: "Tutti Frutti",
    genre: "Rhythm & Blues → the birth of Rock ’n’ Roll",
    lens: "power",
    hook: "“They integrated the teenagers faster than the law integrated the schools.”",
    body:
      "After the war, gospel’s fire and the blues’ beat collided into rhythm & blues, then rock ’n’ roll. " +
      "Chuck Berry’s storytelling and Little Richard’s scream were Black, defiant, and explosively new — " +
      "Berry called his style “one long Sister Rosetta Tharpe impersonation.” But the color line ran " +
      "straight through the charts: white artists covered Black songs for bigger sales and softer radio, " +
      "and a sanitized “King” was crowned while the inventors were pushed to the margins. The music " +
      "integrated American teenagers years before the law integrated their schools.",
    voices: ["Chuck Berry", "Little Richard", "Fats Domino", "Big Mama Thornton"],
    songs: [
      { t: "Tutti Frutti", a: "Little Richard" },
      { t: "Johnny B. Goode", a: "Chuck Berry" },
    ],
    seattle:
      "In 1948 a blind 17-year-old named Ray Charles stepped off a bus and cut his first records here; " +
      "his Maxin Trio gigged on Jackson Street alongside teenage Quincy Jones and Ernestine Anderson. " +
      "Seattle’s scene helped raise three future legends.",
    sources: [
      { label: "HistoryLink — Jackson Street Jazz Scene (Ray Charles, 1948)", url: "https://www.historylink.org/File/22930" },
      { label: "HistoryLink — Quincy Jones (1933–2024)", url: "https://historylink.org/File/10354" },
      { label: "Britannica — Sister Rosetta Tharpe", url: "https://www.britannica.com/biography/Sister-Rosetta-Tharpe" },
    ],
    colors: { bg: "#1a0707", accent: "#ff5a4d", accent2: "#ffb38f" },
    wave: { amp: 0.95, freq: 2.4, sharp: 0.35, jitter: 0.12, swell: 0.50, speed: 0.92 },
  },

  /* 7 ───────────────────────────────────────────────────────── */
  {
    id: "soul",
    years: "1960s",
    title: "A Change Is Gonna Come",
    genre: "Soul & Motown",
    lens: "resistance",
    hook: "“R-E-S-P-E-C-T.”",
    body:
      "As the Civil Rights Movement marched, soul gave it a heartbeat. Motown’s Berry Gordy engineered " +
      "crossover hits that put Black faces and voices into white American living rooms — integration by " +
      "airwave. Aretha Franklin spelled the movement’s demand in a single word: R-E-S-P-E-C-T. And in " +
      "1964, after being turned away from a whites-only motel, Sam Cooke wrote <em>A Change Is Gonna " +
      "Come</em>, a hymn of weary hope that became the movement’s unofficial anthem. Soul insisted that " +
      "Black dignity was not up for negotiation.",
    voices: ["Sam Cooke", "Aretha Franklin", "The Motown sound", "Curtis Mayfield"],
    songs: [
      { t: "A Change Is Gonna Come", a: "Sam Cooke" },
      { t: "Respect", a: "Aretha Franklin" },
    ],
    seattle:
      "Across town, a left-handed kid from the Central District named Jimmy Hendrix was teaching himself " +
      "guitar — soon to leave Seattle and remake the instrument itself.",
    sources: [
      { label: "Library of Congress — “A Change Is Gonna Come” (National Recording Registry)", url: "https://www.loc.gov/static/programs/national-recording-preservation-board/documents/AChangeIsGonnaCome.pdf" },
      { label: "“A Change Is Gonna Come” — Wikipedia", url: "https://en.wikipedia.org/wiki/A_Change_Is_Gonna_Come" },
    ],
    colors: { bg: "#1a0a14", accent: "#ff5e8a", accent2: "#ffb37e" },
    wave: { amp: 0.85, freq: 1.7, sharp: 0.08, jitter: 0.10, swell: 0.85, speed: 0.60 },
  },

  /* 8 ───────────────────────────────────────────────────────── */
  {
    id: "funk",
    years: "late 1960s – 1970s",
    title: "Say It Loud",
    genre: "Funk & the Black Power era",
    lens: "identity",
    hook: "“Say it loud — I’m Black and I’m proud.”",
    body:
      "When nonviolence met fire hoses and assassinations, the mood hardened from <em>hope</em> to " +
      "<em>pride and power</em>. In 1968 James Brown released “Say It Loud — I’m Black and I’m Proud,” and " +
      "a generation traded the word “Negro” for “Black.” Funk made the downbeat — “the One” — heavy and " +
      "unapologetic; Sly Stone, Gil Scott-Heron (“The Revolution Will Not Be Televised”), and " +
      "Parliament-Funkadelic turned liberation into something you could dance to. Marvin Gaye’s " +
      "<em>What’s Going On</em> (1971) mourned Vietnam, poverty, and a planet in trouble.",
    voices: ["James Brown", "Sly & the Family Stone", "Gil Scott-Heron", "Marvin Gaye"],
    songs: [
      { t: "Say It Loud – I’m Black and I’m Proud", a: "James Brown" },
      { t: "Star-Spangled Banner (Live at Woodstock)", a: "Jimi Hendrix" },
      { t: "What’s Going On", a: "Marvin Gaye" },
    ],
    seattle:
      "At Woodstock in 1969, Garfield High’s own Jimi Hendrix tore “The Star-Spangled Banner” into sirens " +
      "and screams — a Black Seattleite forcing America to hear its own anthem through the chaos of war.",
    sources: [
      { label: "“Say It Loud – I’m Black and I’m Proud” — Wikipedia", url: "https://en.wikipedia.org/wiki/Say_It_Loud_%E2%80%93_I%27m_Black_and_I%27m_Proud" },
      { label: "JimiHendrix.com — Star-Spangled Banner at Woodstock", url: "https://www.jimihendrix.com/editorial/star-spangled-banner-jimi-hendrix-at-woodstock-the-anthem-of-a-generation/" },
      { label: "HistoryLink — Jimi Hendrix (1942–1970)", url: "https://www.historylink.org/file/2498" },
    ],
    colors: { bg: "#0f061a", accent: "#b6ff3a", accent2: "#ff5ee6" },
    wave: { amp: 1.00, freq: 2.2, sharp: 0.50, jitter: 0.20, swell: 0.50, speed: 0.95 },
  },

  /* 9 ───────────────────────────────────────────────────────── */
  {
    id: "hiphop",
    years: "1973 – early 1980s",
    title: "The Message",
    genre: "The birth of Hip-Hop",
    lens: "identity",
    hook: "“It’s like a jungle sometimes…”",
    body:
      "The post–Civil-Rights city was broke and burning — factories gone, the Bronx literally on fire, " +
      "public schools cutting music. On August 11, 1973, at a back-to-school party, DJ Kool Herc looped " +
      "the drum “break” of a record across two turntables, and dancers and rappers filled the space the " +
      "city had abandoned. From nothing — no budget, no instruments, just records, a mic, and a lamppost " +
      "to plug into — came a whole new art form. In 1982, Grandmaster Flash & the Furious Five’s " +
      "<em>The Message</em> put inner-city reality into rhyme and pushed the MC to the front.",
    voices: ["DJ Kool Herc", "Afrika Bambaataa", "Grandmaster Flash", "The Sugarhill Gang"],
    songs: [
      { t: "The Message", a: "Grandmaster Flash & the Furious Five" },
      { t: "Rapper’s Delight", a: "The Sugarhill Gang" },
    ],
    seattle: null,
    sources: [
      { label: "History.com — Hip-hop is born in the Bronx (Aug 11, 1973)", url: "https://www.history.com/this-day-in-history/august-11/hip-hop-is-born-at-a-birthday-party-in-the-bronx" },
      { label: "Library of Congress — “The Message” (National Recording Registry)", url: "https://www.loc.gov/static/programs/national-recording-preservation-board/documents/TheMessage.pdf" },
    ],
    colors: { bg: "#0b0b10", accent: "#46e0ff", accent2: "#ff5ea8" },
    wave: { amp: 1.10, freq: 2.0, sharp: 0.72, jitter: 0.16, swell: 0.40, speed: 0.82 },
  },

  /* 10 ──────────────────────────────────────────────────────── */
  {
    id: "goldenage",
    years: "late 1980s – 1990s",
    title: "Fight the Power",
    genre: "The Golden Age — rap as resistance",
    lens: "power",
    hook: "“Black America’s frontline news, set to a beat.”",
    body:
      "Hip-hop grew up angry and articulate. As the War on Drugs and mandatory-minimum sentencing filled " +
      "prisons with young Black men, rap became Black America’s frontline news. Public Enemy’s <em>Fight " +
      "the Power</em> (1989) scored Spike Lee’s <em>Do the Right Thing</em>; N.W.A’s “F— tha Police” " +
      "(1988) testified to everyday police violence so vividly that the FBI mailed the label a warning. " +
      "When the officers who beat Rodney King were acquitted in 1992, Los Angeles erupted — and the " +
      "records had already told you why. This is “power and oppression” set to a breakbeat.",
    voices: ["Public Enemy", "N.W.A", "Tupac Shakur", "Queen Latifah"],
    songs: [
      { t: "Fight the Power", a: "Public Enemy" },
      { t: "Straight Outta Compton", a: "N.W.A" },
    ],
    seattle:
      "Sir Mix-a-Lot’s “Posse on Broadway” (1988) — cruising Seattle’s own streets — and his Nastymix " +
      "label “put Seattle on the rap map,” proving the culture belonged to the whole country, not just " +
      "the coasts.",
    sources: [
      { label: "“Fight the Power” (Public Enemy) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fight_the_Power_(Public_Enemy_song)" },
      { label: "“F— tha Police” (N.W.A) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fuck_tha_Police" },
      { label: "HistoryLink — Nastymix / Sir Mix-A-Lot Gold Record (1989)", url: "https://www.historylink.org/file/9793" },
    ],
    colors: { bg: "#120a06", accent: "#ffcf3a", accent2: "#ff5151" },
    wave: { amp: 1.05, freq: 2.7, sharp: 0.55, jitter: 0.30, swell: 0.45, speed: 1.00 },
  },

  /* 11 ──────────────────────────────────────────────────────── */
  {
    id: "neosoul",
    years: "late 1990s – 2000s",
    title: "Doo-Wop (That Thing)",
    genre: "Neo-Soul & the new millennium",
    lens: "reflection",
    hook: "“A generation asking what it had gained and lost.”",
    body:
      "Against a backdrop of bling and big-label commercialism, a wave of artists turned back toward the " +
      "roots. Lauryn Hill’s <em>The Miseducation of Lauryn Hill</em> (1998) wove gospel, soul, reggae, and " +
      "hip-hop into a meditation on love, faith, and self-respect; Erykah Badu and D’Angelo made " +
      "“neo-soul” a home for Black introspection. The lens here is <em>reflection</em>: a generation " +
      "reclaiming live instruments, spirituality, and — above all — the voice of Black women at the " +
      "center of the story.",
    voices: ["Lauryn Hill", "Erykah Badu", "D’Angelo", "The Roots"],
    songs: [
      { t: "Doo-Wop (That Thing)", a: "Lauryn Hill" },
      { t: "On & On", a: "Erykah Badu" },
    ],
    seattle: null,
    sources: [
      { label: "“The Miseducation of Lauryn Hill” — Wikipedia", url: "https://en.wikipedia.org/wiki/The_Miseducation_of_Lauryn_Hill" },
      { label: "NMAAHC — Musical Crossroads (Agency & Identity)", url: "https://nmaahc.si.edu/explore/exhibitions/musical-crossroads" },
    ],
    colors: { bg: "#08140f", accent: "#4fd6b0", accent2: "#ffbf6b" },
    wave: { amp: 0.80, freq: 1.6, sharp: 0.10, jitter: 0.12, swell: 0.95, speed: 0.55 },
  },

  /* 12 ──────────────────────────────────────────────────────── */
  {
    id: "blm",
    years: "2013 – present",
    title: "Alright",
    genre: "The Black Lives Matter era",
    lens: "reflection",
    hook: "“We gon’ be alright.”",
    body:
      "After the killings of Trayvon Martin (2012), Michael Brown in Ferguson (2014), and George Floyd " +
      "(2020), #BlackLivesMatter turned grief into a movement — and music answered, again. Kendrick " +
      "Lamar’s <em>Alright</em> (2015) became a literal chant in the streets, called this generation’s " +
      "“We Shall Overcome.” Beyoncé’s <em>Lemonade</em> and “Formation” (2016) centered Black Southern " +
      "womanhood; Childish Gambino’s “This Is America” (2018) crammed gun violence, minstrelsy, and police " +
      "terror into four shocking minutes. Four hundred years on, the river runs straight from the spiritual " +
      "to the streaming single — and the music still names the issue, because naming it is still power.",
    voices: ["Kendrick Lamar", "Beyoncé", "Childish Gambino", "Solange"],
    songs: [
      { t: "Alright", a: "Kendrick Lamar" },
      { t: "Formation", a: "Beyoncé" },
      { t: "This Is America", a: "Childish Gambino" },
    ],
    seattle:
      "In 2020, Seattle hosted some of the nation’s largest George Floyd protests and the Capitol Hill " +
      "protest zone — the river of sound flowing right past the same Central District where it first " +
      "reached this city a century ago.",
    sources: [
      { label: "“Alright” (Kendrick Lamar) — Wikipedia", url: "https://en.wikipedia.org/wiki/Alright_(Kendrick_Lamar_song)" },
      { label: "NPR — “Alright,” party and protest (American Anthem)", url: "https://www.npr.org/2019/08/26/753511135/kendrick-lamar-alright-american-anthem-party-protest" },
      { label: "NBC News — Childish Gambino, “This Is America”", url: "https://www.nbcnews.com/news/nbcblk/america-donald-glover-s-shocking-new-video-tackles-race-violence-n872126" },
    ],
    colors: { bg: "#0a0a0a", accent: "#ffd23f", accent2: "#ffffff" },
    wave: { amp: 1.10, freq: 2.5, sharp: 0.45, jitter: 0.25, swell: 0.60, speed: 0.92 },
  },
];

// A YouTube search link so any track can be heard without embedding/copyright risk.
export function listenURL(song) {
  const q = encodeURIComponent(`${song.a} ${song.t}`.trim());
  return `https://www.youtube.com/results?search_query=${q}`;
}
