# MySudokuSolver

> Visualisation interactive des algorithmes de résolution de Sudoku inspirée de l'esthétique des journaux anciens.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)

---

## Aperçu

**MySudokuSolver** est une application web qui permet d'observer en temps réel comment trois algorithmes classiques résolvent une grille de Sudoku. Chaque étape de la résolution est animée directement dans la grille, avec un code couleur pour distinguer les cases actives, en cours de vérification, en conflit ou résolues.

L'interface s'inspire de la mise en page des journaux du XIXe siècle : typographie sérif, fond beige texturé, règles éditoriales et colonnes à la manière d'un quotidien.

---

## Fonctionnalités

- **3 algorithmes de résolution** visualisés pas à pas :
  - **Backtracking** - force brute récursive, explore toutes les possibilités
  - **Greedy MRV** *(Minimum Remaining Values)* - priorise les cases les plus contraintes
  - **Dancing Links** - couverture exacte inspirée de l'Algorithme X de Knuth
- **4 tailles de grilles** : 3×3, 6×6, 9×9 et 16×16
- **5 vitesses d'animation** : de « Très lente » à « Instantanée »
- **Grilles d'exemples** préchargées pour chaque taille
- **Saisie manuelle** : clic sur une case pour modifier sa valeur
- **Statistiques en direct** : nombre d'étapes, temps écoulé, statut
- **Comparatif de complexité** algorithmique affiché en sidebar
- **Pause / reprise** de la résolution en cours

---

## Stack technique

| Technologie | Usage |
|---|---|
| React 19 | Interface et gestion d'état |
| TypeScript 6 | Typage strict de bout en bout |
| Vite 8 | Bundler et serveur de développement |
| CSS-in-JS (inline styles) | Thème journal, typographie Google Fonts |

Aucune dépendance externe en dehors de React - les trois algorithmes sont implémentés from scratch en TypeScript.

---

## Structure du projet

```
MySudokuSolver/
├── src/
│   ├── components/
│   │   ├── Grid.tsx        # Rendu de la grille avec code couleur
│   │   ├── Header.tsx      # Masthead style journal
│   │   ├── Sidebar.tsx     # Stats et légende
│   │   └── Toolbar.tsx     # Contrôles (taille, algo, vitesse, actions)
│   ├── types/
│   │   └── sudoku.ts       # Types, constantes ALGOS et EXAMPLES
│   ├── utils/
│   │   ├── algorithms.ts   # Backtracking, MRV, Dancing Links
│   │   └── helpers.ts      # isValid, findEmpty, findMRV, sleep
│   ├── App.tsx             # Composant principal et logique de résolution
│   └── App.css             # Styles globaux
├── public/
│   ├── favicon.png
│   └── icons.svg
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Installation et lancement

**Prérequis** : Node.js 18+ et npm

```bash
# Cloner le dépôt
git clone https://github.com/MariemeKmr/MySudokuSolver.git
cd MySudokuSolver

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## Les algorithmes

### I. Backtracking

Approche récursive en force brute. L'algorithme parcourt les cases vides de gauche à droite et de haut en bas, essaie chaque valeur valide, et revient en arrière (*backtrack*) dès qu'une impasse est atteinte.

- Complexité : **O(n!)**
- Garantit de trouver une solution si elle existe

### II. Greedy MRV

Variante du backtracking avec heuristique de choix de case. À chaque étape, l'algorithme sélectionne la case vide ayant le **moins de valeurs candidates** *(Minimum Remaining Values)*. Cette heuristique réduit considérablement l'espace de recherche.

- Complexité : **O(n log n)**
- Nettement plus rapide que le backtracking pur sur les grilles denses

### III. Dancing Links

Implémentation inspirée de l'**Algorithme X de Knuth** appliqué au problème de couverture exacte. La résolution commence par les cases les plus contraintes (MRV) et explore les valeurs candidates dans un ordre aléatoire, ce qui produit un comportement différent à chaque exécution.

- Complexité : **O(n)**
- Le plus efficace des trois sur les grandes grilles (16×16)

---

## Personnalisation

**Ajouter une grille d'exemple** : modifier le tableau `EXAMPLES` dans `src/types/sudoku.ts`.

**Ajuster les délais d'animation** : modifier le tableau `DELAYS` dans `src/App.tsx` (valeurs en millisecondes).

**Modifier le thème** : les couleurs principales sont définies directement dans `App.tsx` et `Grid.tsx` - fond `#f2ede4`, encre `#1a1a1a`.

---

## Auteure

Marieme KAMARA - [github.com/MariemeKmr](https://github.com/MariemeKmr)

© 2026 MySudokuSolver - Marieme KAMARA
