#!/usr/bin/env node
/**
 * Generates a custom hero SVG for the profile README.
 *
 * Why this exists:
 *   GitHub markdown can't load custom fonts or run JS. To get
 *   production-grade typography in a readme, we generate an SVG
 *   with the fonts embedded as base64 data URIs and reference it
 *   from the markdown as a plain <img>.
 *
 * Design notes:
 *   - dark base, single bright cyan accent (#22D3EE), the only
 *     color besides whites and greys. lifted from the portfolio.
 *   - editorial-brutalist: huge sliced display type, asymmetric
 *     composition, mono micro-text, a clear horizontal accent.
 *   - animations are CSS-only (SVG <img> tags don't run script
 *     but DO run CSS animations and SMIL). draw-in stroke +
 *     staggered fade-up on text + a slow accent shimmer.
 *
 * Inputs: assets/bricolage-latin.woff2, assets/jbm-latin.woff2
 * Output: assets/hero.svg
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
  accent:    "#22D3EE",
  accentDim: "#155e6b",
  text:      "#ffffff",
  textBody:  "#cbd5e1",
  textMute:  "#64748b",
  rule:      "#1f1f1f",
};

// ─── hero ───────────────────────────────────────────────────
const W = 1280, H = 440;

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Puneet Bhardwaj — full-stack engineer and system designer">
  <defs>
    <style>
      @font-face{ font-family:'Bricolage'; font-style:normal; font-weight:500;
        src:url(data:font/woff2;base64,${BRICOLAGE}) format('woff2'); }
      @font-face{ font-family:'Bricolage'; font-style:normal; font-weight:700;
        src:url(data:font/woff2;base64,${BRICOLAGE}) format('woff2'); }
      @font-face{ font-family:'JBM'; font-style:normal; font-weight:500;
        src:url(data:font/woff2;base64,${JBM}) format('woff2'); }
      @font-face{ font-family:'JBM'; font-style:normal; font-weight:700;
        src:url(data:font/woff2;base64,${JBM}) format('woff2'); }

      :root{ --ac:${T.accent}; }
      .meta   { font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; letter-spacing:0.18em; }
      .micro  { font-family:'JBM',ui-monospace,monospace; fill:${T.textMute}; letter-spacing:0.16em; }
      .body   { font-family:'JBM',ui-monospace,monospace; fill:${T.textBody}; }
      .name   { font-family:'Bricolage','Helvetica Neue',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.045em; }
      .role   { font-family:'Bricolage','Helvetica Neue',sans-serif; font-weight:500; fill:${T.text}; letter-spacing:-0.012em; }
      .role .ac{ fill:${T.accent}; }
      .pill-t { font-family:'JBM',ui-monospace,monospace; font-weight:700; letter-spacing:0.14em; }

      /* draw-in for the cyan accent */
      .accent-line{ stroke:${T.accent}; stroke-width:3; fill:none; stroke-linecap:square;
        stroke-dasharray:1100; stroke-dashoffset:1100;
        animation:draw 1.6s cubic-bezier(0.65,0,0.35,1) 0.2s forwards; }
      @keyframes draw{ to{ stroke-dashoffset:0; } }

      /* staggered fade-up for each text band */
      .fade   { opacity:0; transform:translateY(8px); animation:up .8s cubic-bezier(0.4,0,0.2,1) forwards; }
      .d1{ animation-delay:.10s; } .d2{ animation-delay:.25s; }
      .d3{ animation-delay:.40s; } .d4{ animation-delay:.55s; }
      .d5{ animation-delay:.70s; } .d6{ animation-delay:.85s; }
      @keyframes up{ to{ opacity:1; transform:translateY(0); } }

      /* subtle pulse on the live-status dot */
      .dot{ fill:${T.accent}; animation:pulse 2.4s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
      @keyframes pulse{ 0%,100%{ opacity:1; transform:scale(1);} 50%{ opacity:.45; transform:scale(.85);} }

      /* slow shimmer over the title */
      .shimmer{ animation:shim 6s linear infinite; }
      @keyframes shim{ from{ transform:translateX(-120%);} to{ transform:translateX(120%);} }
    </style>

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
      <stop offset="65%" stop-color="${T.text}"/>
      <stop offset="100%" stop-color="${T.accent}"/>
    </linearGradient>

    <clipPath id="titleClip"><rect x="64" y="146" width="${W-128}" height="120"/></clipPath>
  </defs>

  <!-- ── background ── -->
  <rect width="${W}" height="${H}" fill="${T.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- ── outer frame: thin cyan square brackets ── -->
  <g stroke="${T.accent}" stroke-width="2" fill="none">
    <path d="M 28 28 L 28 92 M 28 28 L 92 28" class="fade d1"/>
    <path d="M ${W-28} 28 L ${W-28} 92 M ${W-28} 28 L ${W-92} 28" class="fade d1"/>
    <path d="M 28 ${H-28} L 28 ${H-92} M 28 ${H-28} L 92 ${H-28}" class="fade d6"/>
    <path d="M ${W-28} ${H-28} L ${W-28} ${H-92} M ${W-28} ${H-28} L ${W-92} ${H-28}" class="fade d6"/>
  </g>

  <!-- ── top meta strip ── -->
  <g class="fade d1">
    <line x1="64" y1="76" x2="220" y2="76" stroke="${T.accent}" stroke-width="1.5"/>
    <text x="232" y="80" class="meta" font-size="13">00 · PROFILE / @BeyonderSS</text>
    <circle cx="${W-180}" cy="76" r="4" class="dot"/>
    <text x="${W-168}" y="80" class="micro" font-size="12">LIVE · ${new Date().toISOString().slice(0,10).toUpperCase()}</text>
  </g>

  <!-- ── name ── -->
  <g clip-path="url(#titleClip)" class="fade d2">
    <text x="62" y="244" class="name" font-size="118" fill="url(#nameGrad)">PUNEET BHARDWAJ.</text>
  </g>

  <!-- ── role line ── -->
  <text x="64" y="294" class="role fade d3" font-size="26">
    full-stack engineer <tspan class="ac">/</tspan> system designer
    <tspan dx="6" fill="${T.textMute}" font-family="JBM" font-size="14" letter-spacing="0.14em">— BHOPAL · IN</tspan>
  </text>

  <!-- ── accent line + section labels ── -->
  <g class="fade d4">
    <path class="accent-line" d="M 64 332 L ${W-64} 332"/>
  </g>

  <!-- ── bottom pills ── -->
  <g class="fade d5" transform="translate(64 368)">
    <g>
      <rect x="0" y="0" width="178" height="38" rx="2" fill="${T.accent}"/>
      <text x="89" y="25" class="pill-t" font-size="12" fill="${T.bg}" text-anchor="middle">SHIPPING · BLUE ERA</text>
    </g>
    <g transform="translate(192 0)">
      <rect x="0" y="0" width="158" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="79" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">3+ YRS PROD</text>
    </g>
    <g transform="translate(364 0)">
      <rect x="0" y="0" width="158" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="79" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">AWS · WEBRTC</text>
    </g>
    <g transform="translate(536 0)">
      <rect x="0" y="0" width="178" height="38" rx="2" fill="none" stroke="${T.accent}" stroke-width="1.5"/>
      <text x="89" y="25" class="pill-t" font-size="12" fill="${T.accent}" text-anchor="middle">OPEN TO HIRE</text>
    </g>
  </g>

  <!-- ── right column: vertical mono tag ── -->
  <g class="fade d3" transform="translate(${W-92} 184) rotate(90)">
    <text x="0" y="0" class="micro" font-size="11">SYSTEM-DESIGNER · 技術者</text>
  </g>

  <!-- ── right column: index number ── -->
  <g class="fade d2">
    <text x="${W-180}" y="160" class="micro" font-size="11" text-anchor="end">N°</text>
    <text x="${W-86}" y="232" class="name" font-size="84" text-anchor="end" fill="${T.accent}" opacity="0.85">26</text>
    <text x="${W-86}" y="252" class="micro" font-size="10" text-anchor="end">YEARS / 2026</text>
  </g>

</svg>`;

writeFileSync(resolve(outDir, "hero.svg"), hero);
console.log(`✓ wrote assets/hero.svg (${hero.length} bytes)`);

// ─── /now card ──────────────────────────────────────────────
const NW = 1280, NH = 240;
const now = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${NW} ${NH}" width="${NW}" height="${NH}" role="img" aria-label="What I'm working on right now">
  <defs>
    <style>
      @font-face{ font-family:'Bricolage'; font-weight:700;
        src:url(data:font/woff2;base64,${BRICOLAGE}) format('woff2'); }
      @font-face{ font-family:'JBM'; font-weight:500;
        src:url(data:font/woff2;base64,${JBM}) format('woff2'); }
      @font-face{ font-family:'JBM'; font-weight:700;
        src:url(data:font/woff2;base64,${JBM}) format('woff2'); }
      .h     { font-family:'Bricolage',sans-serif; font-weight:700; fill:${T.text}; letter-spacing:-0.02em; }
      .label { font-family:'JBM',ui-monospace,monospace; fill:${T.accent}; letter-spacing:0.16em; font-weight:700; }
      .val   { font-family:'JBM',ui-monospace,monospace; fill:${T.textBody}; }
      .mute  { font-family:'JBM',ui-monospace,monospace; fill:${T.textMute}; letter-spacing:0.14em; }
      .dot   { fill:${T.accent}; animation:p 2s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
      @keyframes p{ 50%{ opacity:.4; transform:scale(.7);} }
      .fade  { opacity:0; animation:f .7s cubic-bezier(0.4,0,0.2,1) forwards; }
      .d1{animation-delay:.05s} .d2{animation-delay:.18s} .d3{animation-delay:.31s} .d4{animation-delay:.44s}
      @keyframes f{ to{ opacity:1; } }
    </style>
  </defs>

  <rect width="${NW}" height="${NH}" fill="${T.bg}"/>
  <rect x="0" y="0" width="4" height="${NH}" fill="${T.accent}"/>

  <text x="42" y="50" class="label fade d1" font-size="13">/NOW · <tspan fill="${T.textMute}">~/CONFIG</tspan></text>
  <circle cx="180" cy="46" r="4" class="dot"/>
  <text x="${NW-42}" y="50" class="mute" font-size="11" text-anchor="end">UPDATED · ${new Date().toISOString().slice(0,10).toUpperCase()}</text>

  <text x="42" y="106" class="h fade d1" font-size="32">currently on my desk.</text>

  <!-- two columns of key/val -->
  <g transform="translate(42 144)">
    <g class="fade d2">
      <text class="label" font-size="11" y="0">FOCUS</text>
      <text class="val"   font-size="15" y="22">Blue Era · rider + grocery services · scaling RTC</text>
    </g>
    <g class="fade d3" transform="translate(0 56)">
      <text class="label" font-size="11" y="0">READING</text>
      <text class="val"   font-size="15" y="22">Designing Data-Intensive Applications · Kleppmann</text>
    </g>
  </g>

  <g transform="translate(720 144)">
    <g class="fade d3">
      <text class="label" font-size="11" y="0">NOTE TO SELF</text>
      <text class="val"   font-size="15" y="22">kafka rebalancing is half art, half cron job.</text>
    </g>
    <g class="fade d4" transform="translate(0 56)">
      <text class="label" font-size="11" y="0">MOOD</text>
      <g transform="translate(0 18)">
        ${Array.from({length:10}).map((_,i)=>`<rect x="${i*16}" y="0" width="10" height="14" fill="${i<8 ? T.accent : T.rule}"/>`).join("")}
        <text x="172" y="12" class="mute" font-size="11">CYAN · 8/10</text>
      </g>
    </g>
  </g>
</svg>`;

writeFileSync(resolve(outDir, "now.svg"), now);
console.log(`✓ wrote assets/now.svg (${now.length} bytes)`);

console.log("done.");
