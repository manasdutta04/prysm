# 4. UI/UX Design System & Theme Guidelines

Prysm is designed for enterprise users and features a premium dark theme utilizing glassmorphism, glowing accents, and elegant typography.

---

## 1. Color Palette Tokens

Maintain the following harmonious colors across all dashboard components:

* **Backgrounds**:
  * Main View: Dark indigo/black background (`#071022`).
  * Glassmorphic Cards: Semi-transparent white (`rgba(255, 255, 255, 0.03)` or `0.04`).
  * Card Borders: Very light border (`1px solid rgba(255, 255, 255, 0.08)` or `0.1`).
* **Accents / Highlights**:
  * Positive Sentiment: Green (`#22c55e`), glowing shadows (`box-shadow: 0 0 8px rgba(34, 197, 94, 0.5)`).
  * Negative Sentiment: Red (`#ef4444`), glowing shadows (`box-shadow: 0 0 8px rgba(239, 68, 68, 0.5)`).
  * Neutral Sentiment: Grey (`#6b7280`).
  * Primary Accents / Buttons: Purple/Violet (`#8b5cf6`) or Light Blue (`#60a5fa`).
  * Timeframe Picker Fields: Semi-transparent input background with `color-scheme: dark` to force browser calendar popups to render in dark mode.

---

## 2. Typography Guidelines

* **Logo Font**: Borel cursive (`font-family: Borel, cursive`).
* **Body/Metrics Typography**: Outfit or Inter sans-serif (`font-family: system-ui, -apple-system, sans-serif`). Do not use basic default browser serif fonts.
* **Badges/Labels**: Use small, uppercase letters with letter spacing for labels (e.g., `font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;`).

---

## 3. Interaction Design & Transitions

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
* **Card Expansions**: When cards expand (like in the History view), use keyframe animations (`slideDown`) to reveal text smoothly instead of abrupt cuts.
