# 4. UI/UX Design System & Theme Guidelines

Prysm is designed for enterprise users and features a premium dark theme utilizing neutral blacks, glassmorphic elements, vibrant lime highlights, and high-contrast typography aligned with the landing page.

---

## 1. Color Palette Tokens

Maintain the following harmonious colors across all dashboard and application components:

* **Backgrounds**:
  * Main View/Body Background: Pure neutral black (`#0A0A0A`). No blue/indigo tints.
  * Glassmorphic Cards / Surfaces: Semi-transparent white (`rgba(255, 255, 255, 0.03)` or `0.04`, or solid `#0F0F0F` for cards requiring deep contrast).
  * Card Borders: Very light border (`1px solid rgba(255, 255, 255, 0.08)` or `0.1`).
* **Accents / Highlights**:
  * Primary Accent: Brand Lime Green (`#CCFF00`). Used for active selectors, interactive call-to-actions, and main status highlights.
  * Glowing Accents: Neo-glowing shadows (`box-shadow: 0 0 25px rgba(204, 255, 0, 0.15)`).
  * Positive Sentiment: Green (`#22c55e` or `#CCFF00`), with glowing shadows (`rgba(204, 255, 0, 0.2)`).
  * Negative Sentiment: Red (`#ef4444`), with glowing shadows (`rgba(239, 68, 68, 0.2)`).
  * Neutral Sentiment: Grey/White (`#6b7280` or `rgba(255, 255, 255, 0.5)`).
  * Timeframe Picker Fields: Semi-transparent input background with `color-scheme: dark` to force browser calendar popups to render in dark mode.

---

## 2. Typography Guidelines

* **Logo Typography**: Instrument Serif in italic (`font-family: 'Instrument Serif', serif; font-style: italic`).
* **Body/Metrics Typography**: Geist or system-sans (`font-family: 'Geist', -apple-system, sans-serif`).
* **Data Indicators / Technical Monospace**: IBM Plex Mono (`font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em;`).
* **Badges/Labels**: Use small, uppercase letters with letter spacing for labels (e.g., `font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;`).

---

## 3. Brand Assets & Logos

* **Integration Sources**: Use official monochrome SVGs instead of name initials for logos.
  * **App Store Reviews**: Apple logo (`/appstore.svg`).
  * **Play Store Reviews**: Play Store triangle (`/playstore.svg`).
  * **Gmail Feed**: Gmail icon (`/gmail.svg`).
  * **X / Nitter RSS**: Official X brand inline SVG.
  * **Custom CSV Data**: Spreadsheet grid/table inline SVG.
* **LLM Providers**:
  * **Gemini**: Gemini sparkle (`/gemini.svg`).
  * **OpenAI**: OpenAI spiral (`/openai.svg`).
  * **Claude**: Claude hand/logo (`/claude.svg`).
  * **Groq**: Groq logo (`/groq.svg`).
  * **Ollama**: Ollama logo (`/ollama.svg`).
* **Monochrome Dynamic Coloring Rule**:
  * Standalone SVGs use `fill="currentColor"` or are styled via CSS filters to match text contrast:
    * Active state (on `#CCFF00` buttons): Renders as solid black (`filter: brightness(0);`).
    * Inactive state (on dark backgrounds): Renders as solid white (`filter: brightness(0) invert(1);`).

---

## 4. Interaction Design & Transitions

* **Liquid Glass Effect**:
  * Apply a frosted liquid glass aesthetic to key interactive buttons/pills:
    * Background: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(14px)`.
    * Shimmer border: `1px solid rgba(255, 255, 255, 0.1)`.
    * Active state: A gradient background with the Prysm lime brand color (`#CCFF00`), turning text/icons black.
  * For dashboard widgets and charts, use a complex layered glass effect:
    * Background: `rgba(255, 255, 255, 0.02)`.
    * Border: `1px solid rgba(255, 255, 255, 0.11)`.
    * Shadows: Layered `box-shadow` combining deep dropshadows with bright inner rim lighting.
* **Hover States**: Cards must scale up slightly and increase border brightness on hover:
  ```css
  .card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  ```
* **Transitions**: Use smooth cubic-bezier transitions for transforms and opacity shifts:
  ```css
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ```
