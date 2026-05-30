# CLAUDE.md — Calculus

## Contexte du projet

**Calculus** est un jeu de calcul mental quotidien, inspiré de l'épreuve des chiffres de "Des Chiffres et Des Lettres", de Wordle et des jeux LinkedIn (Nerdle, Mini Sudoku…).

Un seul tirage par jour, identique pour tout le monde. Le joueur a 100 secondes pour atteindre un nombre cible en utilisant 6 nombres tirés aléatoirement.

Concurrent direct identifié : [Numble](https://numble.wtf/) — même concept, sans chrono, sans classement, sans soin design.

---

## Stack technique

- **Framework** : Next.js (App Router)
- **Base de données** : Turso (SQLite serverless)
- **Hébergement** : Netlify
- **Style** : Tailwind CSS + CSS custom pour les effets LCD
- **PWA** : oui (installable sur mobile)
- **i18n** : FR + EN (next-intl ou next-i18next)

---

## Règles du jeu

### Tirage
- 6 nombres tirés aléatoirement parmi : `1 2 3 4 5 6 7 8 9 10 25 50 75 100`
- 1 nombre cible entre 100 et 999
- Tirage déterministe : seed = date du jour (YYYY-MM-DD), même tirage pour tous les joueurs

### Résolution
- Le joueur utilise les 6 nombres (pas obligé de tous les utiliser)
- Opérations autorisées : `+ - × ÷`
- Chaque nombre ne peut être utilisé qu'une seule fois
- La division ne produit que des entiers (pas de décimaux)
- Saisie via clavier de calculatrice (boutons chiffres + opérateurs)

### Temps
- 100 secondes maximum
- Le chrono démarre dès l'affichage du tirage
- À 0 seconde : le jeu se termine automatiquement, score = 0

### Score
```
score = Math.round(1000 * (tempsRestant / 100)) - écartAbsolu
```
- `tempsRestant` : secondes restantes au moment de la soumission
- `écartAbsolu` : différence absolue entre le résultat et le nombre cible
- Cible atteinte exactement : écart = 0
- Temps écoulé : score = 0, pas d'enregistrement en BDD
- Le score peut être négatif si l'écart est très grand

---

## Anti-rejeu

- Cookie `calculus_played_YYYY-MM-DD` posé après soumission
- Cookie présent → afficher le score du joueur + classement, pas de nouvelle partie
- Cookie expire à minuit
- Contournable volontairement (comme Wordle) — acceptable en v1

---

## Classement

- Stocké dans Turso
- Table `scores` : `id`, `pseudo`, `score`, `date` (YYYY-MM-DD), `temps_restant`, `ecart`, `locale`
- Affichage : classement du jour uniquement, trié par score décroissant
- Pas de compte, pas d'auth — pseudo libre saisi avant de jouer

---

## UI/UX — Style calculatrice LCD rétro

### Concept visuel
L'interface imite une **calculatrice de poche rétro** des années 80-90. Chaque élément doit renforcer l'illusion : matière plastique, écran LCD, touches physiques.

### Éléments visuels clés
- **Faux panneau solaire** en haut de la calculatrice (décoratif, bandes noires horizontales)
- **Écran LCD** pour afficher : nombre cible, résultat en cours, opérations saisies
- **Typographie LCD** : police `DSEG7Classic` (7 segments) pour tous les afficheurs numériques
- **Thème clair** : boîtier beige/crème, écran vert pâle ou gris-vert, touches gris foncé
- **Thème sombre** : boîtier anthracite, écran noir avec chiffres verts lumineux (phosphore)
- Switch clair/sombre accessible en permanence

### Chronomètre
- Affiché en LCD 7 segments : format `1:40` qui défile
- Barre de progression horizontale qui décroît
- **Sentiment d'urgence** en dessous de 20 secondes :
  - La barre de progression passe au rouge
  - Le chrono clignote
  - Légère animation de "pulse" sur l'écran
  - Optionnel : vibration sur mobile (`navigator.vibrate`)

### Boutons
- Style touches de calculatrice physique : relief, ombre portée, border-radius modéré
- **Click effect** : enfoncement au clic (transform: translateY + box-shadow réduite)
- Distinction visuelle entre :
  - Touches chiffres (couleur neutre)
  - Touches opérateurs `+ - × ÷` (couleur accent)
  - Touche `=` (couleur primaire, plus grande)
  - Touche `DEL` / `RESET` (couleur rouge/orange)
- Les nombres du tirage déjà utilisés apparaissent grisés/enfoncés

### Layout général
- Centré, format portrait (comme une vraie calculatrice)
- En haut : panneau solaire + nom "CALCULUS" gravé
- Milieu : écran LCD (cible, opérations en cours, résultat)
- Bas : grille de boutons (nombres du tirage + opérateurs)
- Footer : score, classement, switch de langue, switch thème

---

## Internationalisation (v1)

- Langues supportées : **FR** et **EN**
- Switch de langue visible en permanence (drapeau ou label FR/EN)
- Librairie suggérée : `next-intl`
- Les règles du jeu, les labels UI, les messages d'erreur et le classement sont traduits
- La logique du jeu (tirage, score) est identique dans les deux langues
- URL avec préfixe de locale : `/fr/` et `/en/`

---

## PWA

- Installable sur mobile (manifest + service worker minimal)
- Fonctionne bien sur mobile : touch targets suffisants, viewport adapté, pas de zoom intempestif

---

## Ce qui est reporté en v2

- Authentification (comptes utilisateurs)
- Streak
- Épreuve des lettres
- Multijoueur
- Classement global (toutes dates)

---

## Ordre de développement suggéré

1. Setup Next.js + Turso + Tailwind + next-intl
2. Moteur du jeu : générateur de tirage (seed date), vérificateur de solution, chrono
3. UI jouable : écran LCD, clavier calculatrice, chrono avec urgence
4. Sauvegarde du score + classement du jour
5. Cookie anti-rejeu
6. Switch thème clair/sombre
7. PWA (manifest + service worker)
8. Deploy Netlify

---

## Conventions de code

- App Router Next.js (`/app`)
- Server Actions pour les appels Turso (pas d'API routes sauf si nécessaire)
- Composants en TypeScript
- Tailwind pour la structure, CSS custom autorisé pour les effets LCD (box-shadow, textures, animations)
- Pas de librairie UI (shadcn ou autre) en v1 — garder léger
- Police DSEG7 : à charger via `@font-face` (fichier local ou CDN jsDelivr)
