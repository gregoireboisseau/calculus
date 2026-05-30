<div align="center">

# 🧮 Calculus

**Le jeu de calcul mental quotidien · The daily mental maths game**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Turso](https://img.shields.io/badge/Turso-SQLite-4ff8d2?logo=turso)](https://turso.tech)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00c7b7?logo=netlify)](https://netlify.com)
[![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN-blue)](#)

[🎮 Jouer · Play](https://calculus-game.netlify.app) · [🇫🇷 Français](#français) · [🇬🇧 English](#english)

</div>

---

## Français

### Présentation

**Calculus** est un jeu de calcul mental quotidien inspiré de l'épreuve des chiffres de *Des Chiffres et des Lettres*, de Wordle et des jeux de réflexion LinkedIn. Chaque jour, un seul tirage — identique pour tous les joueurs dans le monde entier — et **100 secondes** pour atteindre un nombre cible en combinant 6 nombres avec les quatre opérations de base.

### Règles du jeu

| Élément | Détail |
|---|---|
| **Tirage** | 6 nombres parmi `1 2 3 4 5 6 7 8 9 10 25 50 75 100` |
| **Cible** | Nombre entre 100 et 999 |
| **Temps** | 100 secondes (chrono LCD visible) |
| **Opérations** | `+` `−` `×` `÷` — la division ne produit que des entiers |
| **Règle d'usage** | Chaque nombre ne peut être utilisé qu'une seule fois |
| **Obligation** | Il n'est pas obligatoire d'utiliser tous les nombres |

#### Calcul du score

```
score = round(1000 × tempsRestant / 100) − écartAbsolu
```

- `tempsRestant` : secondes restantes au moment de la soumission
- `écartAbsolu` : `|résultat − cible|` (0 si cible atteinte exactement)
- Temps écoulé → score = 0, aucun enregistrement
- Score négatif possible si l'écart est très grand

#### Anti-rejeu

Un cookie `calculus_played_YYYY-MM-DD` est posé après soumission. Il expire à minuit. Tant qu'il est présent, le joueur voit son score et le classement du jour plutôt que le jeu (comportement identique à Wordle — contournable volontairement).

### Stack technique

| Couche | Technologie |
|---|---|
| Framework | **Next.js 16** — App Router, Server Actions |
| UI | **React 19** + **Tailwind CSS 4** + CSS custom (effets LCD) |
| Base de données | **Turso** (SQLite serverless) |
| Internationalisation | **next-intl** — FR (défaut) et EN, détection automatique |
| Hébergement | **Netlify** + `@netlify/plugin-nextjs` |
| PWA | Manifest, Service Worker, icônes multi-résolution |
| Typo LCD | Police `DSEG7Classic` (7 segments) via jsDelivr CDN |

### Démarrage en local

#### Prérequis

- Node.js ≥ 18
- Un projet [Turso](https://turso.tech) (la table `scores` est créée automatiquement au premier démarrage)

#### Installation

```bash
git clone https://github.com/gregoireboisseau/calculus.git
cd calculus
npm install
```

#### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
TURSO_URL=libsql://votre-base.turso.io
TURSO_TOKEN=votre_token_turso
```

> La table `scores` est créée automatiquement si elle n'existe pas (appel à `initDb()` au premier appel du classement).

#### Lancer le serveur de développement

```bash
npm run dev
# → http://localhost:3000
```

L'application redirige automatiquement vers `/fr` ou `/en` selon la langue du navigateur.

### Structure du projet

```
calculus/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx      # Layout avec i18n + bannière PWA
│   │   │   └── page.tsx        # Page de jeu (ou résultat si déjà joué)
│   │   ├── actions/
│   │   │   └── score.ts        # Server Actions : soumission + classement
│   │   ├── layout.tsx          # Root layout : viewport, meta PWA, SW
│   │   ├── manifest.ts         # Web App Manifest (Next.js natif)
│   │   └── globals.css         # Tokens CSS (thème clair/sombre)
│   ├── components/
│   │   ├── Calculator/
│   │   │   ├── Calculator.tsx  # Orchestrateur du jeu (phases de jeu)
│   │   │   ├── LcdScreen.tsx   # Afficheur LCD (cible, expression, résultat)
│   │   │   ├── NumberPad.tsx   # Clavier (nombres, opérateurs, STO, =, DEL)
│   │   │   └── Timer.tsx       # Compte à rebours + barre de progression
│   │   ├── Leaderboard.tsx     # Classement du jour avec rang du joueur
│   │   ├── InstallBanner.tsx   # Bannière installation PWA (Android + iOS)
│   │   ├── PwaRegistration.tsx # Enregistrement du Service Worker
│   │   ├── ThemeToggle.tsx     # Bascule thème clair / sombre
│   │   ├── LangAttribute.tsx   # Attribut lang sur <html>
│   │   └── LegalModal.tsx      # Mentions légales
│   ├── lib/
│   │   ├── game/
│   │   │   ├── draw.ts         # Générateur de tirage (seed = date YYYY-MM-DD)
│   │   │   ├── score.ts        # Calcul du score
│   │   │   └── calculator.ts   # Machine à états de la calculatrice
│   │   └── db.ts               # Client Turso + init de la table
│   └── i18n/                   # Configuration next-intl
├── public/
│   ├── sw.js                   # Service Worker (cache statique + offline)
│   ├── apple-touch-icon.png    # Icône iOS (180×180)
│   └── icons/                  # Icônes PWA (48→512px + variantes maskable)
├── messages/
│   ├── fr.json                 # Traductions françaises
│   └── en.json                 # Traductions anglaises
└── netlify.toml                # Configuration de déploiement Netlify
```

### Déploiement sur Netlify

Le fichier `netlify.toml` est déjà configuré. Il suffit de :

1. Connecter le dépôt GitHub à Netlify
2. Ajouter les variables d'environnement `TURSO_URL` et `TURSO_TOKEN` dans **Site settings → Environment variables**
3. Déclencher un déploiement

Le plugin `@netlify/plugin-nextjs` est appliqué automatiquement.

### PWA

L'application est installable sur mobile et tablette :

- **Android / Chrome** : une bannière apparaît en bas de l'écran avec un bouton *Installer*
- **iOS / Safari** : la bannière indique comment procéder via la feuille de partage (↑ → *Sur l'écran d'accueil*)
- La bannière réapparaît après 7 jours si elle a été fermée

Une fois installée, l'application fonctionne hors-ligne pour les assets statiques (police DSEG7, icônes, chunks Next.js). Les données de jeu et le classement nécessitent une connexion.

---

## English

### Overview

**Calculus** is a daily mental arithmetic game inspired by the numbers round of *Countdown* (UK) / *Des Chiffres et des Lettres* (FR), Wordle, and LinkedIn puzzle games. Every day, one draw — the same for all players worldwide — and **100 seconds** to reach a target number by combining 6 drawn numbers using the four basic operations.

### Rules

| Element | Detail |
|---|---|
| **Draw** | 6 numbers from the pool `1 2 3 4 5 6 7 8 9 10 25 50 75 100` |
| **Target** | A number between 100 and 999 |
| **Time** | 100 seconds (LCD countdown visible at all times) |
| **Operations** | `+` `−` `×` `÷` — division must produce whole numbers only |
| **Usage rule** | Each drawn number may only be used once |
| **Requirement** | You do not have to use all six numbers |

#### Score formula

```
score = round(1000 × timeRemaining / 100) − absoluteGap
```

- `timeRemaining`: seconds left when the answer is submitted
- `absoluteGap`: `|result − target|` (0 if exact)
- Time runs out → score = 0, nothing saved
- Score can be negative if the gap is very large

#### Anti-replay

A cookie `calculus_played_YYYY-MM-DD` is set after submission. It expires at midnight. While it exists, the player sees their score and the day's leaderboard instead of the game (same behaviour as Wordle — deliberately bypassable).

### Tech stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** — App Router, Server Actions |
| UI | **React 19** + **Tailwind CSS 4** + custom CSS (LCD effects) |
| Database | **Turso** (serverless SQLite) |
| Internationalisation | **next-intl** — FR (default) and EN, auto-detected |
| Hosting | **Netlify** + `@netlify/plugin-nextjs` |
| PWA | Manifest, Service Worker, multi-resolution icons |
| LCD font | `DSEG7Classic` (7-segment display) via jsDelivr CDN |

### Local development

#### Prerequisites

- Node.js ≥ 18
- A [Turso](https://turso.tech) project (the `scores` table is created automatically on first run)

#### Install

```bash
git clone https://github.com/gregoireboisseau/calculus.git
cd calculus
npm install
```

#### Environment variables

Create a `.env.local` file at the project root:

```env
TURSO_URL=libsql://your-database.turso.io
TURSO_TOKEN=your_turso_token
```

> The `scores` table is created automatically if it doesn't exist (via `initDb()` on the first leaderboard call).

#### Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

The app auto-redirects to `/fr` or `/en` based on the browser's `Accept-Language` header.

### Project structure

```
calculus/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx      # Locale layout with i18n + PWA banner
│   │   │   └── page.tsx        # Game page (or result if already played today)
│   │   ├── actions/
│   │   │   └── score.ts        # Server Actions: score submission + leaderboard
│   │   ├── layout.tsx          # Root layout: viewport, PWA meta, SW registration
│   │   ├── manifest.ts         # Web App Manifest (Next.js built-in)
│   │   └── globals.css         # CSS design tokens (light/dark themes)
│   ├── components/
│   │   ├── Calculator/
│   │   │   ├── Calculator.tsx  # Game orchestrator (game phases)
│   │   │   ├── LcdScreen.tsx   # LCD display (target, expression, result)
│   │   │   ├── NumberPad.tsx   # Keypad (numbers, operators, STO, =, DEL)
│   │   │   └── Timer.tsx       # Countdown + progress bar
│   │   ├── Leaderboard.tsx     # Daily leaderboard with player rank
│   │   ├── InstallBanner.tsx   # PWA install banner (Android + iOS)
│   │   ├── PwaRegistration.tsx # Service Worker registration
│   │   ├── ThemeToggle.tsx     # Light / dark mode toggle
│   │   ├── LangAttribute.tsx   # Sets lang attribute on <html>
│   │   └── LegalModal.tsx      # Legal credits
│   ├── lib/
│   │   ├── game/
│   │   │   ├── draw.ts         # Draw generator (seed = YYYY-MM-DD date)
│   │   │   ├── score.ts        # Score calculation
│   │   │   └── calculator.ts   # Calculator state machine
│   │   └── db.ts               # Turso client + table initialisation
│   └── i18n/                   # next-intl configuration
├── public/
│   ├── sw.js                   # Service Worker (static cache + offline)
│   ├── apple-touch-icon.png    # iOS icon (180×180)
│   └── icons/                  # PWA icons (48→512px + maskable variants)
├── messages/
│   ├── fr.json                 # French translations
│   └── en.json                 # English translations
└── netlify.toml                # Netlify deployment configuration
```

### Deploying to Netlify

The `netlify.toml` file is already configured. Steps:

1. Connect the GitHub repository to Netlify
2. Add `TURSO_URL` and `TURSO_TOKEN` in **Site settings → Environment variables**
3. Trigger a deploy

The `@netlify/plugin-nextjs` plugin is applied automatically.

### PWA

The app is installable on mobile and tablet devices:

- **Android / Chrome**: a banner appears at the bottom of the screen with an *Install* button
- **iOS / Safari**: the banner shows manual instructions via the share sheet (↑ → *Add to Home Screen*)
- The banner reappears after 7 days if dismissed

Once installed, the app works offline for static assets (DSEG7 font, icons, Next.js chunks). Game data and the leaderboard require an internet connection.

---

<div align="center">

Made with ☕ by [Grégoire Boisseau](https://github.com/gregoireboisseau)

</div>
