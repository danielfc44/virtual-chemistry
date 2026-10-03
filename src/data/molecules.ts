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

/** The minimum data the 3D viewer needs to draw a molecule. */
export interface MoleculeModel {
  atoms: Atom[];
  bonds: Bond[];
}

export interface Molecule extends MoleculeModel {
  id: string;
  /** Formal/systematic name, e.g. "Di-hidrogénio". */
  name: string;
  /** Optional common/alternative name shown alongside the formal name, e.g. "Hidrogénio molecular". */
  commonName?: string;
  formula: string;
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
export function getQualitativeComposition(molecule: MoleculeModel): string[] {
  return Array.from(new Set(molecule.atoms.map((atom) => atom.element)));
}

/**
 * Computes the quantitative composition: atom counts per element, total atom
 * count, molar mass, and mass percentage contributed by each element.
 */
export function getQuantitativeComposition(molecule: MoleculeModel) {
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
        'Uma molécula diatómica: dois átomos unidos por uma ligação covalente simples.',
    },
    hotspotLabel: 'Energia limpa',
    icon: '⚡',
    relevance:
      'Alternativa energética limpa, produzido por eletrólise da água usando energia renovável.',
    hotspot: { x: 10, y: 10, flipBubble: true },
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
        'O átomo de oxigénio apresenta dois pares de eletrões não ligantes, os quais exercem uma intensa repulsão eletrostática sobre os pares de eletrões ligantes das ligações O–H. ' +
        'Para minimizar estas repulsaões e atingir a máxima estabilidade, a molécula adota uma geometria angular (e não linear).',
    },
    hotspotLabel: 'O lago',
    icon: '💧',
    relevance: 'Substância essencial à vida. Constitui 71% da superfície da Terra.',
    hotspot: { x: 33, y: 55 },
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
        'Dois átomos de oxigénio partilham dois pares de eletrões numa ligação covalente dupla, e qualquer molécula diatómica é necessariamente linear.',
    },
    hotspotLabel: 'A floresta',
    icon: '🌳',
    relevance:
      'Produzido pela fotossíntese da floresta e vegetação. É indispensável para a respiração celular da grande maioria dos organismos vivos.',
    hotspot: { x: 82, y: 53 },
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
        'O carbono e o oxigénio partilham três pares de eletrões numa ligação covalente tripla; com apenas dois átomos, a geometria é sempre linear.',
    },
    hotspotLabel: 'O carro na estrada',
    icon: '🚗',
    relevance:
      'Gás poluente tóxico resultante da combustão incompleta de combustíveis em veículos e em aquecedores antigos ou mal ventilados.',
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
        'O carbono central não tem pares de eletrões não ligantes, apenas dois grupos de eletrões ligantes nas ligações C=O. Para minimizar a repulsão entre eles, a molécula adota uma geometria linear (180º).',
    },
    hotspotLabel: 'Fumo da fábrica',
    icon: '🏭',
    relevance:
      'Gás resultante de processos industriais e da combustão de combustíveis fósseis. Essencial para a fotossíntese e responsável pelo efeito de estufa.',
    hotspot: { x: 37, y: 12, flipBubble: true },
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
        'o átomo central de oxigénio possui um par de eletrões não ligantes que repulsa os pares ligantes vizinhos, conferindo à molécula uma geometria angular (e não linear). A ressonância distribui os eletrões da ligação uniformemente pelas duas ligações O–O.',
    },
    hotspotLabel: 'Camada de ozono',
    icon: '🛡️',
    relevance:
      'Forma-se na atmosfera a partir de três átomos de oxigénio e filtra a maior parte da radiação ultravioleta nociva do Sol, protegendo a vida na Terra.',
    hotspot: { x: 90, y: 8, flipBubble: true },
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
        'O par de eletrões não ligantes de nitrogénio exerce uma intensa repulsão sobre os pares ligantes N–H, fletindo as ligações para baixo. Para minimizar essa repulsão, a molécula de amoníaco (NH3) adota uma geometria piramidal trigonal em vez de uma estrutura plana trigonal.',
    },
    hotspotLabel: 'O campo agrícola',
    icon: '🌾',
    relevance:
      'Composto muito utilizado na produção de fertilizantes agrícolas para nutrir o solo, e em produtos de limpeza.',
    hotspot: { x: 17, y: 75 },
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
        'Os dois átomos de nitrogénio partilham três pares de eletrões numa ligação covalente tripla muito forte.',
    },
    hotspotLabel: 'O ar atmosférico',
    icon: '🌬️',
    relevance:
      'Componente maioritário do ar atmosférico (cerca de 78%), quimicamente inerte em condições normais.',
    hotspot: { x: 60, y: 10, flipBubble: true },
  },
};

export const MOLECULE_ORDER = ['H2O', 'O2', 'N2', 'CO2', 'CO', 'O3', 'H2', 'NH3'];

export interface FactoryProduct {
  id: string;
  name: string;
  /** 3D model shown rotating over the product's numbered button. */
  model: MoleculeModel;
  /** Caption under the rotating 3D model. */
  modelLabel: string;
  formula?: string;
  molecule?: string;
  /** Components of a mixture; products without it show the qualitative composition of their molecule. */
  mixtureComposition?: string;
  description: string;
  hotspot: { x: number; y: number };
}

const ETHANOL_MODEL: MoleculeModel = {
  atoms: [
    { element: 'C', position: [-1.52, 0, 0] },
    { element: 'C', position: [0, 0, 0] },
    { element: 'O', position: [0.478, 1.348, 0] },
    { element: 'H', position: [-1.884, 0.514, 0.89] },
    { element: 'H', position: [-1.884, -1.028, 0] },
    { element: 'H', position: [-1.884, 0.514, -0.89] },
    { element: 'H', position: [0.364, -0.513, 0.891] },
    { element: 'H', position: [0.364, -0.513, -0.891] },
    { element: 'H', position: [1.438, 1.348, 0] },
  ],
  bonds: [
    { from: 0, to: 1, order: 1 },
    { from: 1, to: 2, order: 1 },
    { from: 0, to: 3, order: 1 },
    { from: 0, to: 4, order: 1 },
    { from: 0, to: 5, order: 1 },
    { from: 1, to: 6, order: 1 },
    { from: 1, to: 7, order: 1 },
    { from: 2, to: 8, order: 1 },
  ],
};

const ACETONE_MODEL: MoleculeModel = {
  atoms: [
    { element: 'C', position: [0, 0, 0] },
    { element: 'O', position: [0, 1.21, 0] },
    { element: 'C', position: [1.289, -0.806, 0] },
    { element: 'C', position: [-1.289, -0.806, 0] },
    { element: 'H', position: [2.143, -0.127, 0] },
    { element: 'H', position: [1.326, -1.435, 0.89] },
    { element: 'H', position: [1.326, -1.435, -0.89] },
    { element: 'H', position: [-2.143, -0.127, 0] },
    { element: 'H', position: [-1.326, -1.435, 0.89] },
    { element: 'H', position: [-1.326, -1.435, -0.89] },
  ],
  bonds: [
    { from: 0, to: 1, order: 2 },
    { from: 0, to: 2, order: 1 },
    { from: 0, to: 3, order: 1 },
    { from: 2, to: 4, order: 1 },
    { from: 2, to: 5, order: 1 },
    { from: 2, to: 6, order: 1 },
    { from: 3, to: 7, order: 1 },
    { from: 3, to: 8, order: 1 },
    { from: 3, to: 9, order: 1 },
  ],
};

export const FACTORY_PRODUCTS: FactoryProduct[] = [
  {
    id: 'ethyl-alcohol',
    model: ETHANOL_MODEL,
    modelLabel: 'C₂H₆O · Álcool etílico',
    name: 'Álcool etílico comercial',
    formula: 'C₂H₆O',
    description: 'É usado como desinfetante e antisséptico para eliminar microrganismos, solvente para limpeza e fabricação de produtos, e em combustíveis. O álcool etílico comercial é uma mistura de duas substâncias moleculares: álcool etílico e água.',
    hotspot: { x: 39, y: 56 },
  },
  {
    id: 'distilled-water',
    model: MOLECULES.H2O,
    modelLabel: 'H₂O · Água',
    name: 'Água destilada',
    formula: 'H₂O',
    description: 'A água destilada é frequentemente utilizada no laboratório, por exemplo na preparação de soluções.',
    hotspot: { x: 51, y: 57 },
  },
  {
    id: 'pure-acetone',
    model: ACETONE_MODEL,
    modelLabel: 'C₃H₆O · Acetona',
    name: 'Acetona pura',
    formula: 'C₃H₆O',
    molecule: 'Acetona',
    description: 'A acetona pura é constituída apenas por um único tipo de moléculas. É frequentemente utilizada no laboratório como solvente e reagente químico.',
    hotspot: { x: 63, y: 60 },
  },
  {
    id: 'commercial-acetone',
    model: ACETONE_MODEL,
    modelLabel: 'Acetona (componente principal)',
    name: 'Acetona comercial',
    mixtureComposition: 'Acetona (C₃H₆O), água (H₂O), óleo de rícino, fragrâncias e corantes.',
    description: 'A acetona comercial não é uma substância pura, mas sim uma solução em que a acetona está misturada com outros componentes para evitar o ressecamento excessivo da pele e dar aroma. É comummente utilizada no dia a dia para remover verniz das unhas.',
    hotspot: { x: 75, y: 47 },
  },
];
