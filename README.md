# 🌊 The River of Sound

### An interactive 3D timeline of Black music — *How has it evolved, and how does it reflect the issues of its time?*

Made from the standpoint of an **11th-grade Black Studies Honors student in Seattle Public Schools.**

Open `index.html` through any local web server (see below) and scroll. You travel
*down a glowing river* — and the river **is** the music: a single audio waveform,
rendered in [Three.js](https://threejs.org), whose shape, color, rhythm, and harmony
are re-sculpted for every era. Sparse call-and-response swells for the spirituals;
syncopated flutter for jazz; a hard square-wave boom-bap for hip-hop. Twelve stations,
four hundred years, one continuous current.

> *“I’ve known rivers ancient as the world and older than the flow of human blood in
> human veins. My soul has grown deep like the rivers.”*
> — Langston Hughes, “The Negro Speaks of Rivers,” 1921

---

## The idea

This isn’t a list of genres. It’s an **argument**: that from the drum forbidden on the
plantation to *Alright* chanted in the street, Black music has always done the same
work — **naming the issue of its moment, and turning survival into art.** The project
reads each era through the four lenses of the **Seattle / Washington State Ethnic
Studies framework** — the same ones used in the course it was built for:

| Lens | What it asks |
|---|---|
| **Origins & Identity** | Where does this come from, and who does it say we are? |
| **Power & Oppression** | What system is pressing down, and how does the music expose it? |
| **Resistance & Liberation** | How does the music push back, organize, or free people? |
| **Reflection & Action** | What is this generation choosing to do about it? |

### 📍 The Seattle thread
The inquiry question — *How has Black music evolved throughout history, and how does
it reflect the issues of time?* — sits under the title in the top bar.

---

## The ten stations

1. **Basic African Drums** — West African drumming *(Origins, pre-1600s)*
2. **Wade in the Water** — Spirituals / the “Sorrow Songs” *(1800s)*
3. **Downhearted Blues** — The Blues *(early 1920s)*
4. **West End Blues** — Jazz *(late 1920s)*
5. **It Don’t Mean a Thing (If It Ain’t Got That Swing)** — Swing-era jazz *(1930s–40s)*
6. **My Girl** — Motown *(1960s)*
7. **The Message** — Conscious hip-hop *(early 1980s)*
8. **F\*\*\* The Police** — The Golden Age, rap as resistance *(late 1980s–90s)*
9. **Doo-Wop (That Thing)** — Neo-Soul & the new millennium *(late 1990s–2000s)*
10. **All the Stars** — The Black Lives Matter era *(2013–present)*

---

## Run it

Because it uses ES-module imports, it needs to be served over HTTP (not opened from `file://`):

```bash
# from this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

**Three.js** loads from the jsDelivr CDN by default (the same approach the official
Three.js docs use), so there's no build step. A copy is **also bundled** at
`vendor/three.module.js`; to run **fully offline**, just point the import map in
`index.html` at it:

```html
<!-- index.html -->
{ "imports": { "three": "./vendor/three.module.js" } }
```

### Deploy to GitHub Pages
Push to GitHub, then **Settings → Pages → Build and deployment → Deploy from a branch**,
and choose this branch with the `/ (root)` folder. The `.nojekyll` file is included so
the assets serve as-is.

### Controls
- **Scroll** (or swipe) to flow down the river.
- **Era dots** on the right — click to glide to any era.
- **🔊 Sound** — two layers through one mixer: **real songs** you add per era (see below), and, for any era with no song file, a **synthesized band** (kick / snare / hats / bass / pad) playing a groove tuned to that genre. Between songs the audio goes **"underwater"** — a brief **low-pass filter dip** and crossfade — and jumping across several eras at once plays a quick **flyby montage** of each one.
- Per-era **Sources** links live at the bottom of each era’s panel.
- Respects `prefers-reduced-motion`, and falls back to a clean readable document if WebGL is unavailable.

## 🎵 Add the songs (optional)

Drop audio files into an **`audio/`** folder next to `index.html`, named by era id:

```
audio/roots.mp3   audio/spirituals.mp3  audio/blues.mp3     audio/jazz.mp3
audio/gospel.mp3  audio/rocknroll.mp3   audio/soul.mp3      audio/funk.mp3
audio/hiphop.mp3  audio/goldenage.mp3   audio/neosoul.mp3   audio/blm.mp3
```

`.mp3`, `.m4a`, `.ogg`, and `.wav` all work. Any era without a file just uses the
synth band, so you can add as few or as many as you like. To start a track at its
hook instead of the intro, add `audioStart: <seconds>` to that era in `src/data.js`.

> The underwater **filter** touches the songs only when the page is served over
> http (a local server or GitHub Pages). Opened straight from a file (the
> single-file build), songs still crossfade and get a brief pitch-warp "dive,"
> and the synth always gets the full filtered effect.

---

## How it’s built

```
index.html               structure, import map (Three.js r160 via CDN), overlay UI
css/style.css            the cinematic look
src/data.js              the content: every era, narrative, source & waveform "DNA"
src/timeline.js          the Three.js river, scroll-driven camera, UI orchestration
src/audio.js             a defensive, synthesized ambient engine (no copyrighted audio)
vendor/three.module.js   Three.js r160 (offline fallback; CDN used by default)
```

The waveform is a 2,000-point line + glow-point cloud swept along a `CatmullRomCurve3`.
Each genre defines six parameters — **amplitude, frequency, attack (sine→square),
jitter, swell, and tempo** — and the visible wave is a live interpolation between the
two nearest eras as you scroll, so it *morphs* rather than cuts. Glow is faked with
additive blending and radial sprites (no post-processing) for speed.

---

## Sources & credibility

Every claim is anchored to a credible source, surfaced in-app and listed here. Anchors
lean on the **Smithsonian (NMAAHC)**, the **Library of Congress National Recording
Registry**, and **HistoryLink.org** (the Washington State history encyclopedia) for the
Seattle threads, with Britannica / PBS / NPR / History.com for supporting detail.

- Smithsonian NMAAHC — *Musical Crossroads* · https://nmaahc.si.edu/explore/exhibitions/musical-crossroads
- “Wade in the Water” · https://en.wikipedia.org/wiki/Wade_in_the_Water — and WHYY on coded songs · https://whyy.org/articles/underground-railroad-expert-decodes-songs-with-practical-advice-for-fleeing-slaves/
- Britannica — *Blues* · https://www.britannica.com/art/blues-music
- HistoryLink — *Jackson Street Jazz Scene* · https://www.historylink.org/File/22930 · and *Rhythm & Roots* · https://www.historylink.org/File/3641
- Britannica — *“Strange Fruit”* · https://www.britannica.com/topic/Strange-Fruit-song
- Britannica & PBS — *Sister Rosetta Tharpe* · https://www.britannica.com/biography/Sister-Rosetta-Tharpe · https://www.pbs.org/wnet/americanmasters/sister-rosetta-tharpe-about-film/2463/
- HistoryLink — *Quincy Jones* · https://historylink.org/File/10354
- Library of Congress — *“A Change Is Gonna Come”* · https://www.loc.gov/static/programs/national-recording-preservation-board/documents/AChangeIsGonnaCome.pdf
- HistoryLink — *Jimi Hendrix* · https://www.historylink.org/file/2498 · and JimiHendrix.com on Woodstock · https://www.jimihendrix.com/editorial/star-spangled-banner-jimi-hendrix-at-woodstock-the-anthem-of-a-generation/
- History.com — *Hip-hop is born (Aug 11, 1973)* · https://www.history.com/this-day-in-history/august-11/hip-hop-is-born-at-a-birthday-party-in-the-bronx · and Library of Congress on *“The Message”* · https://www.loc.gov/static/programs/national-recording-preservation-board/documents/TheMessage.pdf
- Wikipedia — *“Fight the Power”* · https://en.wikipedia.org/wiki/Fight_the_Power_(Public_Enemy_song) · *“F— tha Police”* · https://en.wikipedia.org/wiki/Fuck_tha_Police · and HistoryLink — *Nastymix / Sir Mix-A-Lot* · https://www.historylink.org/file/9793
- Wikipedia — *“Alright”* · https://en.wikipedia.org/wiki/Alright_(Kendrick_Lamar_song) · NPR — *American Anthem* · https://www.npr.org/2019/08/26/753511135/kendrick-lamar-alright-american-anthem-party-protest · NBC — *“This Is America”* · https://www.nbcnews.com/news/nbcblk/america-donald-glover-s-shocking-new-video-tackles-race-violence-n872126
- Seattle Public Schools — *Ethnic Studies* · https://www.seattleschools.org/departments/ethnic-studies/

**Credits:** Three.js (MIT). Epigraph by Langston Hughes (1921, public domain). Built as
a student project for Black Studies Honors; all audio is original/synthesized.
