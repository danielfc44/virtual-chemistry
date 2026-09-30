# Virtual Chemistry Lab

An interactive Astro app that helps chemistry students explore how everyday
molecules look in 3D, their qualitative and quantitative composition, and
their molecular geometry.

## Features

- A real-life scenario photo (lake, factory, wheat field, road, forest, sky)
  with clickable/hoverable hotspots — hovering or clicking a point rotates
  the molecule found there right on the spot, e.g. the lake shows **H₂O**.
- A quick-access list of all 8 molecules — clicking an entry highlights its
  hotspot on the scenario image and updates the info panel, no modal needed.
- A 3D, ball-and-stick molecule viewer (Three.js) rendered live in a small
  rotating "bubble" over the hotspot, with auto-rotation and atom-symbol
  labels.
- For every molecule: its real-world relevance, qualitative composition
  (which elements), quantitative composition (atom counts, mass % breakdown,
  molar mass) and molecular geometry (VSEPR shape name, bond angle, and a
  short explanation).

Molecules covered: H₂, H₂O, O₂, N₂, CO, CO₂, O₃, NH₃.

## Project structure

```text
/
├── public
│   └── scenario.jpeg          # Background scenario photo for the hotspots
├── src
│   ├── data
│   │   ├── elements.ts        # Element colors, radii, atomic weights
│   │   └── molecules.ts       # Molecule geometry, bonds, relevance, hotspots
│   ├── lib
│   │   └── moleculeViewer.ts  # Three.js ball-and-stick viewer
│   ├── components
│   │   ├── MoleculeScene.astro # Scenario image + hotspots + rotating preview
│   │   ├── MoleculeList.astro  # Quick-access molecule list
│   │   └── MoleculeInfo.astro  # Relevance/composition/geometry info panel
│   ├── layouts/Layout.astro
│   └── pages/index.astro
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
