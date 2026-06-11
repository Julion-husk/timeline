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
 * Resistance & Liberation, and Reflection & Action.
 *
 * Song links open a YouTube search so the listener can hear the music.
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
    years: "Origins (Pre-1600s)",
    title: "Basic African Drums",
    genre: "West African drumming",
    lens: "identity",
    hook: "“Ceremony, storytelling, communication.”",
    body:
      "The drums were the predecessor to modern Black music. In West Africa, drums weren’t only an " +
      "instrument of beat; they were cultural instruments used in ceremonies, storytelling, and " +
      "communication. Enslaved Africans brought with them drums like the Djembe, bringing those cultural " +
      "traditions with them.",
    voices: ["The Djembe", "West African drummers"],
    songs: [{ t: "Djembe drumming", a: "" }],
    seattle: null,
    sources: [
      { label: "The History of the Djembe Drum — Drum Roots", url: "https://www.drumroots.org.uk/2025/06/the-fascinating-history-of-the-djembe-drum-a-journey-through-rhythm-and-culture/" },
    ],
    colors: { bg: "#160d07", accent: "#ff9d3c", accent2: "#ffd28a" },
    wave: { amp: 0.80, freq: 1.1, sharp: 0.06, jitter: 0.10, swell: 0.85, speed: 0.45 },
  },

  /* 2 ───────────────────────────────────────────────────────── */
  {
    id: "spirituals",
    years: "1800s",
    title: "Wade in the Water",
    genre: "Spirituals · the “Sorrow Songs”",
    lens: "resistance",
    hook: "“Wade in the water, children…”",
    body:
      "Wade in the Water is widely associated with the Underground Railroad. W.E.B. Du Bois called the " +
      "genre of the acapella song “Sorrow Songs.” This genre was created by enslaved Black Americans. " +
      "Sorrow songs were very spiritual, but were sometimes encoded with other meanings. Some examples of " +
      "this are songs being used to communicate immediate alerts along with the escape through the " +
      "Underground Railroad. Wade in the Water, specifically, has the message of wading through the water " +
      "to lose bloodhounds’ trail.",
    voices: ["W.E.B. Du Bois", "The “Sorrow Songs”"],
    songs: [{ t: "Wade in the Water", a: "Negro spiritual" }],
    seattle: null,
    sources: [
      { label: "Behind the Meaning of “Wade in the Water” — American Songwriter", url: "https://americansongwriter.com/behind-the-meaning-of-the-classic-gospel-song-wade-in-the-water/" },
    ],
    colors: { bg: "#07101f", accent: "#5b8cff", accent2: "#aecbff" },
    wave: { amp: 0.66, freq: 0.9, sharp: 0.0, jitter: 0.04, swell: 1.45, speed: 0.38 },
  },

  /* 3 ───────────────────────────────────────────────────────── */
  {
    id: "blues",
    years: "Early 1920s",
    title: "Downhearted Blues",
    genre: "The Blues",
    lens: "power",
    hook: "“The Empress of the Blues.”",
    body:
      "Downhearted Blues was written by two Black women, Alberta Hunter and Lovie Austin. Over 750 " +
      "thousand copies were sold and earned Bessie Smith the title, “Empress of the Blues,” showing " +
      "record labels the audience for blues music is huge and should not be underestimated.",
    voices: ["Alberta Hunter", "Lovie Austin", "Bessie Smith"],
    songs: [{ t: "Downhearted Blues", a: "Bessie Smith" }],
    seattle: null,
    sources: [
      { label: "“Down Hearted Blues” — Library of Congress (National Recording Registry)", url: "https://www.loc.gov/static/programs/national-recording-preservation-board/documents/Down-HeartedBlues.pdf" },
    ],
    colors: { bg: "#140a18", accent: "#9a5bff", accent2: "#cfa8ff" },
    wave: { amp: 0.90, freq: 1.5, sharp: 0.10, jitter: 0.16, swell: 0.70, speed: 0.55 },
  },

  /* 4 ───────────────────────────────────────────────────────── */
  {
    id: "jazz",
    years: "Late 1920s",
    title: "West End Blues",
    genre: "Jazz",
    lens: "identity",
    hook: "“The day jazz changed forever.”",
    body:
      "In 1928, King Oliver wrote West End Blues for Louis Armstrong and His Hot Five. The intro changed " +
      "how the genre of jazz was played and showed that an individual in a band could steal the show with " +
      "a solo. Billie Holiday was inspired by this intro and song to build her career. Louis Armstrong " +
      "went on to become the greatest jazz artist of all time.",
    voices: ["King Oliver", "Louis Armstrong", "Billie Holiday"],
    songs: [{ t: "West End Blues", a: "Louis Armstrong" }],
    seattle: null,
    sources: [
      { label: "The Day Jazz Changed Forever — uDiscover Music", url: "https://www.udiscovermusic.com/stories/the-day-jazz-changed-forever/" },
    ],
    colors: { bg: "#1a1305", accent: "#ffc24a", accent2: "#ffe6a8" },
    wave: { amp: 0.80, freq: 3.2, sharp: 0.12, jitter: 0.46, swell: 0.60, speed: 1.00 },
  },

  /* 5 ───────────────────────────────────────────────────────── */
  {
    id: "swing",
    years: "1930s – 1940s",
    title: "It Don’t Mean a Thing (If It Ain’t Got That Swing)",
    genre: "Swing-era jazz",
    lens: "identity",
    hook: "“It don’t mean a thing if it ain’t got that swing.”",
    body:
      "Made in 1932, this song by Duke Ellington became an instant hit as it mixed a calming melody with a " +
      "catchy rhythm. Duke Ellington was a very famous composer during this time, and he was especially " +
      "known for his more unique pieces of jazz that really highlighted individual instruments in each of " +
      "his works. Both Duke Ellington and this song elevated jazz in a way that no one else could have at " +
      "the time. This song also popularized the use of the word “swing” to the public. It was a slang term " +
      "in jazz, but he allowed the public to see and understand what it meant.",
    voices: ["Duke Ellington"],
    songs: [{ t: "It Don’t Mean a Thing (If It Ain’t Got That Swing)", a: "Duke Ellington" }],
    seattle: null,
    sources: [
      { label: "“It Don’t Mean a Thing…” (1932, Duke Ellington) — Swing & Beyond", url: "https://swingandbeyond.com/2016/09/01/it-dont-mean-a-thing-if-it-aint-got-that-swing-1932-duke-ellington/" },
    ],
    colors: { bg: "#1a0820", accent: "#d8b13a", accent2: "#ff9ed1" },
    wave: { amp: 0.85, freq: 2.6, sharp: 0.14, jitter: 0.40, swell: 0.6, speed: 0.95 },
  },

  /* 6 ───────────────────────────────────────────────────────── */
  {
    id: "motown",
    years: "1960s",
    title: "My Girl",
    genre: "Motown · soul & R&B",
    lens: "resistance",
    hook: "“I’ve got sunshine on a cloudy day.”",
    body:
      "My Girl by The Temptations was created in 1964 and has since become a very classic and popular " +
      "song. It is a mix of soul and R&B music, which creates the music genre of Motown. This genre was " +
      "most popular in the 60s and 70s, but many of the songs created during that time are still very " +
      "popular to this day. Some notable songs of this genre include “My Girl,” “Super Freak,” and “Just " +
      "the Two of Us.”",
    voices: ["The Temptations", "Motown"],
    songs: [{ t: "My Girl", a: "The Temptations" }],
    seattle: null,
    sources: [
      { label: "The Temptations, “My Girl” — uDiscover Music", url: "https://www.udiscovermusic.com/stories/the-temptations-my-girl-motown-song/" },
    ],
    colors: { bg: "#1a0a14", accent: "#ff5e8a", accent2: "#ffb37e" },
    wave: { amp: 0.85, freq: 1.7, sharp: 0.08, jitter: 0.10, swell: 0.85, speed: 0.60 },
  },

  /* 7 ───────────────────────────────────────────────────────── */
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

  /* 8 ───────────────────────────────────────────────────────── */
  {
    id: "goldenage",
    years: "late 1980s – 1990s",
    title: "F*** The Police",
    genre: "The Golden Age — rap as resistance",
    lens: "power",
    hook: "“F*** the police comin straight from the underground!”",
    body:
      "1988, Compton California, five men came together, the hip hop group known as N.W.A. This was the " +
      "year they would go on to release one of the most influential anti-police harassment songs of all " +
      "time. F*** The Police was a direct call out based on real life actions and experience, through " +
      "shared hatred for the unlawful actions being committed by law enforcement, the group not only " +
      "shared their message in an undeniable way, but they also established a legacy. This legacy is one " +
      "that has been reciprocated throughout protests and movements to this day, with the song being " +
      "played at many modern-day events, including ones such as the George Floyd protests in 2020.",
    voices: ["N.W.A"],
    songs: [
      { t: "Fight the Power", a: "Public Enemy" },
      { t: "F*** The Police", a: "N.W.A" },
    ],
    seattle:
      "Sir Mix-a-Lot’s “Posse on Broadway” (1988) — cruising Seattle’s own streets — and his Nastymix " +
      "label “put Seattle on the rap map,” proving the culture belonged to the whole country, not just " +
      "the coasts.",
    sources: [
      { label: "“Fight the Power” (Public Enemy) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fight_the_Power_(Public_Enemy_song)" },
      { label: "“F*** tha Police” (N.W.A) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fuck_tha_Police" },
      { label: "HistoryLink — Nastymix / Sir Mix-A-Lot Gold Record (1989)", url: "https://www.historylink.org/file/9793" },
    ],
    colors: { bg: "#120a06", accent: "#ffcf3a", accent2: "#ff5151" },
    wave: { amp: 1.05, freq: 2.7, sharp: 0.55, jitter: 0.30, swell: 0.45, speed: 1.00 },
  },

  /* 9 ──────────────────────────────────────────────────────── */
  {
    id: "neosoul",
    years: "late 1990s – 2000s",
    title: "Doo-Wop (That Thing)",
    genre: "Neo-Soul & the new millennium",
    lens: "reflection",
    hook: "“A generation asking what it had gained and lost.”",
    body:
      "By the 1990’s, hip hop had solidified itself as a cultural pillar in America, but its presence " +
      "still had its flaws; artist Lauryn Hill was the one to point them out. From its early beginnings " +
      "hip hop had a divide in gender, an issue of objectivity and disrespect. Through the song Doo Wop, " +
      "Hill spoke on both genders and their flawed portrayal of identities; she did so without putting " +
      "herself above it all, showing that the issue was not necessarily individual, but systemic. By " +
      "doing so, she opened a new lane for the genre, one in which people could be vulnerable and admit " +
      "to their faults.",
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

  /* 10 ──────────────────────────────────────────────────────── */
  {
    id: "blm",
    years: "2013 – present",
    title: "All the Stars",
    genre: "The Black Lives Matter era",
    lens: "reflection",
    hook: "“Love, let’s talk about love.”",
    body:
      "Black Panther was a colossal release in the cinema industry; it brought forth Black pride and " +
      "empowerment, reaching a level of popularity far out of the reach of most movies. But this success " +
      "did not just come from the high-level acting or production quality; the music played a massive role " +
      "as well. All The Stars by Kendrick Lamar featuring SZA was not just a soundtrack; it was a " +
      "representation of history, culture, and innovation. The song features callbacks to themes of " +
      "Afrofuturism, mythology, and much more. Its tone and lyricism called attention to the individuality " +
      "and beauty of African culture, all while looking stunning both in theatres and music videos.",
    voices: ["Kendrick Lamar", "SZA"],
    songs: [
      { t: "All The Stars", a: "Kendrick Lamar, SZA" },
      { t: "Alright", a: "Beyoncé" },
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
