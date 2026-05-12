#!/usr/bin/env node
/**
 * Generates a set of custom SVGs for the profile README:
 *   - assets/hero.svg     · the top banner
 *   - assets/now.svg      · the /now config card
 *   - assets/stats.svg    · key numbers (followers, repos, total stars)
 *   - assets/pin-*.svg    · 4 selected-work cards
 *
 * Why generate everything custom?
 *   github-readme-stats.vercel.app / its pin endpoint go down often
 *   (DEPLOYMENT_PAUSED). by generating our own SVGs with embedded
 *   Bricolage Grotesque + JetBrains Mono, we own the visual system
 *   end-to-end. fetches GitHub API once at generation time, bakes
 *   numbers into static SVGs that GitHub then serves cache-warm.
 *
 * Fonts embedded as base64 data URIs so typography survives
 * GitHub's image-only render pipeline.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const fontsDir = resolve(__dirname, "fonts");
const outDir = resolve(repoRoot, "assets");
mkdirSync(outDir, { recursive: true });

const fontToBase64 = (p) => readFileSync(p).toString("base64");
const BRICOLAGE = fontToBase64(resolve(fontsDir, "bricolage-latin.woff2"));
const JBM       = fontToBase64(resolve(fontsDir, "jbm-latin.woff2"));

// ─── tokens ─────────────────────────────────────────────────
const T = {
  bg:        "#0a0a0a",
  bgGrid:    "#161616",
  bgCard:    "#0f0f0f",
  accent:    "#22D3EE",
  accentDim: "#155e6b",
  text:      "#ffffff",
  textBody:  "#cbd5e1",
  textMute:  "#64748b",
  rule:      "#1f1f1f",
};

// ─── shared <defs> for fonts + animation ────────────────────
// IMPORTANT: .fade is opacity-only (no CSS transform), because
// a CSS transform overrides any SVG transform="" attribute on
// the same element, breaking inline coords.
const FONTS_AND_ANIM = `
  @font-face{ font-family:'Bricolage'; font-style:normal; font-weight:500;
    src:url(data:font/woff2;base64,${BRICOLAGE}) format('woff2'); }
  @font-face{ font-family:'Bricolage'; font-style:normal; font-weight:700;
    src:url(data:font/woff2;base64,${BRICOLAGE}) format('woff2'); }
  @font-face{ font-family:'JBM'; font-style:normal; font-weight:500;
    src:url(data:font/woff2;base64,${JBM}) format('woff2'); }
  @font-face{ font-family:'JBM'; font-style:normal; font-weight:700;
    src:url(data:font/woff2;base64,${JBM}) format('woff2'); }

  .meta   { font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; letter-spacing:0.18em; }
  .micro  { font-family:'JBM',ui-monospace,monospace; fill:${T.textMute}; letter-spacing:0.16em; }
  .body   { font-family:'JBM',ui-monospace,monospace; fill:${T.textBody}; }
  .name   { font-family:'Bricolage','Helvetica Neue',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.04em; }
  .role   { font-family:'Bricolage','Helvetica Neue',sans-serif; font-weight:500; fill:${T.text}; letter-spacing:-0.012em; }
  .pill-t { font-family:'JBM',ui-monospace,monospace; font-weight:700; letter-spacing:0.14em; }

  .accent-line{ stroke:${T.accent}; stroke-width:3; fill:none; stroke-linecap:square;
    stroke-dasharray:1100; stroke-dashoffset:1100;
    animation:draw 1.6s cubic-bezier(0.65,0,0.35,1) 0.2s forwards; }
  @keyframes draw{ to{ stroke-dashoffset:0; } }

  /* fade is opacity-only on purpose — see comment above */
  .fade   { opacity:0; animation:up .8s cubic-bezier(0.4,0,0.2,1) forwards; }
  .d1{ animation-delay:.10s; } .d2{ animation-delay:.25s; }
  .d3{ animation-delay:.40s; } .d4{ animation-delay:.55s; }
  .d5{ animation-delay:.70s; } .d6{ animation-delay:.85s; }
  @keyframes up{ to{ opacity:1; } }

  .dot{ fill:${T.accent}; animation:pulse 2.4s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
  @keyframes pulse{ 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
`;

// ─── HERO ───────────────────────────────────────────────────
// Layout intent:
//   - top strip:   00 · PROFILE label  ←→  LIVE date
//   - mid:         PUNEET BHARDWAJ (gradient, sized to fit cleanly)
//   - below name:  role line
//   - accent line:
//   - pills row:   4 cyan pills at bottom
//   - right edge:  small N° marker high up so it never collides with title
const W = 1280, H = 440;
const NAME = "PUNEET BHARDWAJ";

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Puneet Bhardwaj — full-stack engineer and system designer">
  <defs>
    <style>${FONTS_AND_ANIM}</style>

    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 L0 0 0 40" fill="none" stroke="${T.bgGrid}" stroke-width="0.8" opacity="0.4"/>
    </pattern>

    <radialGradient id="glow" cx="18%" cy="0%" r="60%">
      <stop offset="0%"  stop-color="${T.accent}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${T.accent}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="${T.accent}" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="glow2" cx="100%" cy="100%" r="50%">
      <stop offset="0%"  stop-color="${T.accent}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${T.accent}" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"  stop-color="${T.text}"/>
      <stop offset="70%" stop-color="${T.text}"/>
      <stop offset="100%" stop-color="${T.accent}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${T.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- corner brackets -->
  <g stroke="${T.accent}" stroke-width="2" fill="none" class="fade d1">
    <path d="M 28 28 L 28 92 M 28 28 L 92 28"/>
    <path d="M ${W-28} 28 L ${W-28} 92 M ${W-28} 28 L ${W-92} 28"/>
    <path d="M 28 ${H-28} L 28 ${H-92} M 28 ${H-28} L 92 ${H-28}"/>
    <path d="M ${W-28} ${H-28} L ${W-28} ${H-92} M ${W-28} ${H-28} L ${W-92} ${H-28}"/>
  </g>

  <!-- top meta strip -->
  <g class="fade d1">
    <line x1="64" y1="76" x2="220" y2="76" stroke="${T.accent}" stroke-width="1.5"/>
    <text x="232" y="80" class="meta" font-size="13">00 · PROFILE / @BeyonderSS</text>
  </g>

  <!-- right meta: small N° tag (never collides with name) -->
  <g class="fade d2">
    <text x="${W-104}" y="80" class="micro" font-size="11" text-anchor="end">N° / 2026</text>
    <circle cx="${W-90}" cy="76" r="4" class="dot"/>
  </g>

  <!-- name — sized so it never crosses x=${W-160} -->
  <text x="62" y="232" class="name fade d2" font-size="98" fill="url(#nameGrad)">${NAME}</text>

  <!-- role line -->
  <text x="64" y="278" class="role fade d3" font-size="24">
    full-stack engineer
    <tspan fill="${T.accent}"> / </tspan>
    system designer
    <tspan dx="10" fill="${T.textMute}" font-family="JBM" font-size="14" letter-spacing="0.14em">— BHOPAL · IN  ·  UTC+5:30</tspan>
  </text>

  <!-- animated accent line -->
  <g class="fade d4">
    <path class="accent-line" d="M 64 312 L ${W-64} 312"/>
  </g>

  <!-- bottom pills (no SVG transform attribute on .fade element) -->
  <g class="fade d5">
    <g transform="translate(64 348)">
      <rect width="178" height="38" rx="2" fill="${T.accent}"/>
      <text x="89" y="25" class="pill-t" font-size="12" fill="${T.bg}" text-anchor="middle">SHIPPING · BLUE ERA</text>
    </g>
    <g transform="translate(256 348)">
      <rect width="158" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="79" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">3+ YRS PROD</text>
    </g>
    <g transform="translate(428 348)">
      <rect width="158" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="79" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">AWS · WEBRTC</text>
    </g>
    <g transform="translate(600 348)">
      <rect width="178" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="89" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">OPEN TO HIRE</text>
    </g>
  </g>

  <!-- right column: huge faded N°26 (offset further right & lower so it sits BELOW the name's right edge) -->
  <g class="fade d3">
    <text x="${W-72}" y="408" class="name" font-size="72" text-anchor="end" fill="${T.accent}" opacity="0.18">N°26</text>
  </g>

</svg>`;

writeFileSync(resolve(outDir, "hero.svg"), hero);
console.log(`✓ assets/hero.svg (${hero.length} bytes)`);

// ─── /NOW CARD ──────────────────────────────────────────────
const NW = 1280, NH = 240;
const now = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${NW} ${NH}" width="${NW}" height="${NH}" role="img" aria-label="What I'm focused on right now">
  <defs><style>${FONTS_AND_ANIM}
    .h     { font-family:'Bricolage',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.02em; }
    .label { font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; letter-spacing:0.16em; font-weight:700; }
    .val   { font-family:'JBM',ui-monospace,monospace; fill:${T.textBody}; }
  </style></defs>

  <rect width="${NW}" height="${NH}" fill="${T.bg}"/>
  <rect x="0" y="0" width="4" height="${NH}" fill="${T.accent}"/>

  <g class="fade d1">
    <text x="42" y="50" class="label" font-size="13">/NOW · <tspan fill="${T.textMute}">~/CONFIG</tspan></text>
    <circle cx="180" cy="46" r="4" class="dot"/>
    <text x="${NW-42}" y="50" class="micro" font-size="11" text-anchor="end">UPDATED · ${new Date().toISOString().slice(0,10).toUpperCase()}</text>
    <text x="42" y="106" class="h" font-size="32">currently on my desk.</text>
  </g>

  <g class="fade d2">
    <text x="42"  y="144" class="label" font-size="11">FOCUS</text>
    <text x="42"  y="166" class="val"   font-size="15">Blue Era · rider + grocery services · scaling RTC</text>
    <text x="42"  y="200" class="label" font-size="11">READING</text>
    <text x="42"  y="222" class="val"   font-size="15">Designing Data-Intensive Applications · Kleppmann</text>
  </g>

  <g class="fade d3">
    <text x="720" y="144" class="label" font-size="11">NOTE TO SELF</text>
    <text x="720" y="166" class="val"   font-size="15">kafka rebalancing is half art, half cron job.</text>
    <text x="720" y="200" class="label" font-size="11">MOOD</text>
    <g transform="translate(720 210)">
      ${Array.from({length:10}).map((_,i)=>`<rect x="${i*16}" y="0" width="10" height="14" fill="${i<8 ? T.accent : T.rule}"/>`).join("")}
      <text x="172" y="12" class="micro" font-size="11">CYAN · 8/10</text>
    </g>
  </g>
</svg>`;

writeFileSync(resolve(outDir, "now.svg"), now);
console.log(`✓ assets/now.svg (${now.length} bytes)`);

// ─── PINNED REPO CARDS ──────────────────────────────────────
async function fetchRepo(owner, name) {
  const r = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: { "User-Agent": "BeyonderSS-readme-generator" }
  });
  if (!r.ok) throw new Error(`${r.status} for ${owner}/${name}`);
  return r.json();
}

function repoCard(repo, idx) {
  const PW = 620, PH = 200;
  // truncate description to ~110 chars and word-wrap to 2 lines
  const desc = (repo.description || "No description.").slice(0, 220);
  const words = desc.split(" ");
  let line1 = "", line2 = "";
  for (const w of words) {
    const candidate = (line1 ? line1 + " " : "") + w;
    if (candidate.length <= 55) line1 = candidate;
    else if ((line2 + " " + w).length <= 60) line2 = (line2 ? line2 + " " : "") + w;
  }
  if (!line2 && desc.length > line1.length) line2 = desc.slice(line1.length).trim().slice(0, 60);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" width="${PW}" height="${PH}" role="img" aria-label="${repo.full_name} — ${desc}">
  <defs><style>${FONTS_AND_ANIM}
    .title { font-family:'Bricolage',sans-serif; font-weight:700; fill:${T.accent}; letter-spacing:-0.012em; }
    .desc  { font-family:'JBM',ui-monospace,monospace; fill:${T.textBody}; }
    .stat  { font-family:'JBM',ui-monospace,monospace; fill:${T.textMute}; letter-spacing:0.1em; }
    .num   { font-family:'JBM',ui-monospace,monospace; fill:${T.text}; font-weight:700; }
    .num-ac{ font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; font-weight:700; }
  </style></defs>

  <rect width="${PW}" height="${PH}" fill="${T.bgCard}" stroke="${T.rule}" stroke-width="1" rx="2"/>
  <rect x="0" y="0" width="${PW}" height="3" fill="${T.accent}"/>

  <g class="fade d1">
    <text x="24" y="40" class="stat" font-size="10">${String(idx).padStart(2,"0")} · PINNED · @${repo.owner.login.toUpperCase()}</text>
    <text x="24" y="76" class="title" font-size="24">${repo.name}</text>
  </g>

  <g class="fade d2">
    <text x="24" y="118" class="desc" font-size="13">${line1}</text>
    ${line2 ? `<text x="24" y="138" class="desc" font-size="13">${line2}</text>` : ""}
  </g>

  <g class="fade d3" transform="translate(24 ${PH-32})">
    <circle cx="6" cy="-4" r="6" fill="${repo.language === "TypeScript" ? "#3178c6" : repo.language === "JavaScript" ? "#f1e05a" : T.accent}"/>
    <text x="20" y="0" class="stat" font-size="11">${(repo.language || "—").toUpperCase()}</text>

    <text x="160" y="0" class="num-ac" font-size="13">★ ${repo.stargazers_count}</text>
    <text x="220" y="0" class="num"    font-size="13">⑂ ${repo.forks_count}</text>
    <text x="${PW-48}" y="0" class="stat" font-size="11" text-anchor="end">→ VIEW</text>
  </g>
</svg>`;
}

const PINS = [
  ["BeyonderSS", "Puneet-Portfolio"],
  ["BeyonderSS", "automail-campaign-manager"],
  ["BeyonderSS", "Waiterless-Production"],
  ["BeyonderSS", "Namaste-Hospital"],
];

let i = 1;
for (const [owner, name] of PINS) {
  try {
    const r = await fetchRepo(owner, name);
    const svg = repoCard(r, i);
    writeFileSync(resolve(outDir, `pin-${i}.svg`), svg);
    console.log(`✓ assets/pin-${i}.svg · ${owner}/${name}`);
  } catch (e) {
    console.warn(`⚠ skipped pin-${i}: ${e.message}`);
  }
  i++;
}

// ─── STATS CARD ─────────────────────────────────────────────
async function fetchStats() {
  const user = await (await fetch("https://api.github.com/users/BeyonderSS", {
    headers: { "User-Agent": "BeyonderSS-readme-generator" }
  })).json();
  const repos = await (await fetch("https://api.github.com/users/BeyonderSS/repos?per_page=100&type=owner", {
    headers: { "User-Agent": "BeyonderSS-readme-generator" }
  })).json();
  const stars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const own   = repos.filter(r => !r.fork).length;
  return { followers: user.followers, following: user.following, public_repos: user.public_repos, stars, own };
}

const stats = await fetchStats().catch(e => { console.warn(`⚠ stats: ${e.message}`); return null; });

if (stats) {
  const SW = 620, SH = 240;
  const cell = (label, value, dx, accent=false) =>
`    <g transform="translate(${dx} 0)">
      <text y="22"  class="stat" font-size="11">${label}</text>
      <text y="84"  class="big${accent ? " ac" : ""}" font-size="60">${value}</text>
    </g>`;

  const statsSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" role="img" aria-label="GitHub stats for BeyonderSS">
  <defs><style>${FONTS_AND_ANIM}
    .stat { font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; letter-spacing:0.18em; font-weight:700; }
    .big  { font-family:'Bricolage',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.04em; }
    .big.ac { fill:${T.accent}; }
    .lbl  { font-family:'JBM',ui-monospace,monospace; fill:${T.textMute}; letter-spacing:0.16em; }
    .h    { font-family:'Bricolage',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.02em; }
  </style></defs>

  <rect width="${SW}" height="${SH}" fill="${T.bgCard}" stroke="${T.rule}" stroke-width="1" rx="2"/>
  <rect x="0" y="0" width="3" height="${SH}" fill="${T.accent}"/>

  <g class="fade d1">
    <text x="24" y="38" class="stat" font-size="11">SYSTEM STATS · @BEYONDERSS</text>
    <text x="24" y="76" class="h"    font-size="28">the receipts.</text>
  </g>

  <g class="fade d2" transform="translate(24 120)">
${cell("REPOS",      stats.public_repos, 0,   false)}
${cell("STARS",      stats.stars,        140, true )}
${cell("FOLLOWERS",  stats.followers,    280, false)}
${cell("FOLLOWING",  stats.following,    440, false)}
  </g>

  <g class="fade d3" transform="translate(24 ${SH-30})">
    <text class="lbl" font-size="10">UPDATED · ${new Date().toISOString().slice(0,10).toUpperCase()}  ·  REGENERATES ON COMMIT</text>
  </g>
</svg>`;
  writeFileSync(resolve(outDir, "stats.svg"), statsSvg);
  console.log(`✓ assets/stats.svg`);
}

console.log("\nall assets generated.");
