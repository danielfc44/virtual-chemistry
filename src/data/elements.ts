/** Chemical element reference data used to render and describe atoms. */
export interface ElementInfo {
  symbol: string;
  name: string;
  /** Standard atomic weight in g/mol. */
  atomicWeight: number;
  /** CPK color convention, used for spheres in the 3D viewer. */
  color: string;
  /** Visual sphere radius (not to scale, tuned for readability in the viewer). */
  radius: number;
}

// Radii are deliberately smaller than the shortest bond lengths used in
// src/data/molecules.ts, ball-and-stick style, so double/triple bond
// cylinders remain visible in the gap between atom spheres instead of being
// swallowed by them.
export const ELEMENTS: Record<string, ElementInfo> = {
  H: { symbol: 'H', name: 'Hidrogénio', atomicWeight: 1.008, color: '#ffffff', radius: 0.22 },
  C: { symbol: 'C', name: 'Carbono', atomicWeight: 12.011, color: '#2b2b2b', radius: 0.4 },
  N: { symbol: 'N', name: 'Azoto', atomicWeight: 14.007, color: '#3050f8', radius: 0.4 },
  O: { symbol: 'O', name: 'Oxigénio', atomicWeight: 15.999, color: '#ff0d0d', radius: 0.4 },
};
