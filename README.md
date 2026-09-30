# Virtual Chemistry Lab

An interactive Astro app that helps chemistry students explore how everyday
molecules look in 3D, their qualitative and quantitative composition, and
their molecular geometry.

## Features

- An illustrated everyday scene (a lake, campfire, farm, chimney, sky and a
  hydrogen balloon) with clickable hotspots — click a point to open the
  molecule found there, e.g. the lake opens **H₂O**.
- A quick-access directory grid to jump straight to any of the 7 molecules.
- A 3D, ball-and-stick molecule viewer (Three.js) you can drag to rotate and
  scroll to zoom, with auto-rotation and atom-symbol labels.
- For every molecule: qualitative composition (which elements), quantitative
  composition (atom counts, mass % breakdown, molar mass) and molecular
  geometry (VSEPR shape name, bond angle, and a short explanation).

Molecules covered: H₂, H₂O, O₂, CO, CO₂, O₃, NH₃.

## Project structure

```text
/
├── src
│   ├── data
│   │   ├── elements.ts        # Element colors, radii, atomic weights
│   │   └── molecules.ts       # Molecule geometry, bonds, scene descriptions
│   ├── lib
│   │   └── moleculeViewer.ts  # Three.js ball-and-stick viewer
│   ├── components
│   │   ├── SceneHotspots.astro    # Illustrated scene + clickable hotspots
│   │   ├── MoleculeDirectory.astro# Quick-access molecule grid
│   │   └── MoleculeModal.astro    # 3D viewer + composition/geometry panel
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
