import { ELEMENTS } from './elements';

export interface Atom {
  /** Element symbol, looked up in {@link ELEMENTS}. */
  element: string;
  /** Position in angstrom-scaled 3D coordinates, [x, y, z]. */
  position: [number, number, number];
}

export interface Bond {
  /** Index into the molecule's atoms array. */
  from: number;
  to: number;
  /** Bond order: 1 = single, 2 = double, 3 = triple. */
  order: 1 | 2 | 3;
}

export interface Molecule {
  id: string;
  /** Formal/systematic name, e.g. "Di-hidrogénio". */
  name: string;
  /** Optional common/alternative name shown alongside the formal name, e.g. "Hidrogénio molecular". */
  commonName?: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  geometry: {
    /** VSEPR shape name, e.g. "Angular", "Linear", "Piramidal trigonal". */
    shape: string;
    /** Bond angle description, e.g. "104.5°". */
    angle: string;
    /** Short explanation of why the molecule has this shape. */
    description: string;
  };
  /** Short name of the real-life spot this molecule is tied to, e.g. "O lago". */
  hotspotLabel: string;
  /** Emoji shown inside the hotspot dot, suggesting the molecule's real-life context. */
  icon: string;
  /** Why this molecule matters in everyday life / nature. */
  relevance: string;
  /** Position of the hotspot marker over the scenario image, in percent. */
  hotspot: {
    x: number;
    y: number;
    /** Show the rotating preview bubble below the marker instead of above it. */
    flipBubble?: boolean;
  };
}

/**
 * Computes the qualitative composition (distinct elements) of a molecule.
 */
export function getQualitativeComposition(molecule: Molecule): string[] {
  return Array.from(new Set(molecule.atoms.map((atom) => atom.element)));
}

/**
 * Computes the quantitative composition: atom counts per element, total atom
 * count, molar mass, and mass percentage contributed by each element.
 */
export function getQuantitativeComposition(molecule: Molecule) {
  const counts = new Map<string, number>();
  for (const atom of molecule.atoms) {
    counts.set(atom.element, (counts.get(atom.element) ?? 0) + 1);
  }

  const molarMass = Array.from(counts.entries()).reduce(
    (total, [symbol, count]) => total + ELEMENTS[symbol].atomicWeight * count,
    0,
  );

  const breakdown = Array.from(counts.entries()).map(([symbol, count]) => {
    const elementMass = ELEMENTS[symbol].atomicWeight * count;
    return {
      symbol,
      name: ELEMENTS[symbol].name,
      count,
      massPercent: (elementMass / molarMass) * 100,
    };
  });

  return {
    totalAtoms: molecule.atoms.length,
    molarMass,
    breakdown,
  };
}

export const MOLECULES: Record<string, Molecule> = {
  H2: {
    id: 'H2',
    name: 'Di-hidrogénio',
    commonName: 'Hidrogénio molecular',
    formula: 'H₂',
    atoms: [
      { element: 'H', position: [-0.37, 0, 0] },
      { element: 'H', position: [0.37, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1, order: 1 }],
    geometry: {
      shape: 'Linear',
      angle: '180°',
      description:
        'Uma molécula diatómica: dois átomos unidos por uma ligação covalente simples formam sempre uma linha reta.',
    },
    hotspotLabel: 'Energia limpa',
    icon: '⚡',
    relevance:
      'Alternativa energética limpa, produzido por eletrólise da água usando energia renovável.',
    hotspot: { x: 8, y: 9, flipBubble: true },
  },
  H2O: {
    id: 'H2O',
    name: 'Água',
    formula: 'H₂O',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [0.759, 0.588, 0] },
      { element: 'H', position: [-0.759, 0.588, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
    geometry: {
      shape: 'Angular',
      angle: '104.5°',
      description:
        'O oxigénio tem dois pares de eletrões isolados que empurram as ligações O–H uma contra a outra, dobrando a molécula em vez de a deixar linear.',
    },
    hotspotLabel: 'O lago',
    icon: '💧',
    relevance: 'Substância essencial à vida. Constitui 71% da superfície da Terra.',
    hotspot: { x: 35, y: 52 },
  },
  O2: {
    id: 'O2',
    name: 'Dioxigénio',
    commonName: 'Oxigénio molecular',
    formula: 'O₂',
    atoms: [
      { element: 'O', position: [-0.605, 0, 0] },
      { element: 'O', position: [0.605, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1, order: 2 }],
    geometry: {
      shape: 'Linear',
      angle: '180°',
      description:
        'Dois átomos de oxigénio partilham dois pares de eletrões numa ligação dupla, e qualquer molécula de dois átomos é necessariamente linear.',
    },
    hotspotLabel: 'A floresta',
    icon: '🌳',
    relevance:
      'Produzido pela fotossíntese da floresta e vegetação. É indispensável para a respiração celular da grande maioria dos organismos vivos.',
    hotspot: { x: 86, y: 58 },
  },
  CO: {
    id: 'CO',
    name: 'Monóxido de carbono',
    formula: 'CO',
    atoms: [
      { element: 'C', position: [-0.565, 0, 0] },
      { element: 'O', position: [0.565, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1, order: 3 }],
    geometry: {
      shape: 'Linear',
      angle: '180°',
      description:
        'O carbono e o oxigénio partilham três pares de eletrões numa ligação tripla; com apenas dois átomos, a forma é sempre linear.',
    },
    hotspotLabel: 'O carro na estrada',
    icon: '🚗',
    relevance:
      'Gás poluente tóxico resultante da combustão incompleta de combustível no motor do veículo.',
    hotspot: { x: 73, y: 83 },
  },
  CO2: {
    id: 'CO2',
    name: 'Dióxido de carbono',
    formula: 'CO₂',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [-1.16, 0, 0] },
      { element: 'O', position: [1.16, 0, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    geometry: {
      shape: 'Linear',
      angle: '180°',
      description:
        'O carbono não tem pares de eletrões isolados aqui, por isso as duas ligações duplas ao oxigénio apontam em direções exatamente opostas.',
    },
    hotspotLabel: 'Fumo da fábrica',
    icon: '🏭',
    relevance:
      'Gás resultante de processos industriais e da combustão de combustíveis fósseis. Essencial para a fotossíntese e responsável pelo efeito de estufa.',
    hotspot: { x: 41, y: 16, flipBubble: true },
  },
  O3: {
    id: 'O3',
    name: 'Ozono',
    formula: 'O₃',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'O', position: [1.089, 0.67, 0] },
      { element: 'O', position: [-1.089, 0.67, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
    geometry: {
      shape: 'Angular',
      angle: '116.8°',
      description:
        'O oxigénio central tem um par de eletrões isolado que dobra a molécula, e a ressonância distribui os eletrões de ligação uniformemente pelas duas ligações O–O.',
    },
    hotspotLabel: 'Camada de ozono',
    icon: '🛡️',
    relevance:
      'Forma-se na atmosfera a partir de três átomos de oxigénio e filtra a maior parte da radiação ultravioleta nociva do Sol, protegendo a vida na Terra.',
    hotspot: { x: 92, y: 7, flipBubble: true },
  },
  NH3: {
    id: 'NH3',
    name: 'Amoníaco',
    formula: 'NH₃',
    atoms: [
      { element: 'N', position: [0, 0.3, 0] },
      { element: 'H', position: [0, 0.219, 0.938] },
      { element: 'H', position: [-0.812, 0.219, -0.469] },
      { element: 'H', position: [0.812, 0.219, -0.469] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    geometry: {
      shape: 'Piramidal trigonal',
      angle: '106.7°',
      description:
        'O par de eletrões isolado do azoto empurra as três ligações N–H para baixo, formando uma pirâmide em vez do arranjo plano trigonal.',
    },
    hotspotLabel: 'O campo agrícola',
    icon: '🌾',
    relevance:
      'Composto muito utilizado na produção de fertilizantes agrícolas para nutrir o solo, e em produtos de limpeza.',
    hotspot: { x: 15, y: 79 },
  },
  N2: {
    id: 'N2',
    name: 'Dinitrogénio',
    commonName: 'Nitrogénio molecular',
    formula: 'N₂',
    atoms: [
      { element: 'N', position: [-0.55, 0, 0] },
      { element: 'N', position: [0.55, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1, order: 3 }],
    geometry: {
      shape: 'Linear',
      angle: '180°',
      description:
        'Os dois átomos de azoto partilham três pares de eletrões numa ligação tripla muito forte; com apenas dois átomos, a forma é sempre linear.',
    },
    hotspotLabel: 'O ar atmosférico',
    icon: '🌬️',
    relevance:
      'Componente maioritário do ar atmosférico (cerca de 78%), quimicamente inerte em condições normais.',
    hotspot: { x: 55, y: 9, flipBubble: true },
  },
};

export const MOLECULE_ORDER = ['H2O', 'O2', 'N2', 'CO2', 'CO', 'O3', 'H2', 'NH3'];
