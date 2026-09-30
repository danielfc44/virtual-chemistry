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
  name: string;
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
  /** The real-life scene hotspot this molecule is attached to. */
  scene: {
    label: string;
    description: string;
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
    name: 'Hidrogénio',
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
    scene: {
      label: 'Balão de hidrogénio',
      description:
        'O balão de festa a flutuar está cheio de gás hidrogénio (H₂), a molécula mais leve que existe, razão pela qual sobe no céu.',
    },
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
    scene: {
      label: 'O lago',
      description:
        'O lago calmo é feito de água (H₂O): dois átomos de hidrogénio ligados a um átomo de oxigénio, a molécula que cobre a maior parte do nosso planeta.',
    },
  },
  O2: {
    id: 'O2',
    name: 'Oxigénio',
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
    scene: {
      label: 'O céu aberto',
      description:
        'O ar que respiramos é composto por cerca de 21% de gás oxigénio (O₂), dois átomos de oxigénio ligados por uma ligação dupla, essencial para a respiração.',
    },
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
    scene: {
      label: 'Fumo da chaminé',
      description:
        'A combustão incompleta na chaminé liberta monóxido de carbono (CO), um gás incolor, inodoro e perigoso, formado quando o combustível arde sem oxigénio suficiente.',
    },
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
    scene: {
      label: 'Fogueira',
      description:
        'O fumo da fogueira transporta dióxido de carbono (CO₂), produzido quando o carbono da madeira se combina totalmente com o oxigénio do ar.',
    },
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
    scene: {
      label: 'Sol e brilho do céu',
      description:
        'Bem no alto, a camada de ozono (O₃) forma-se a partir de três átomos de oxigénio e filtra a maior parte da radiação ultravioleta nociva do Sol.',
    },
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
    scene: {
      label: 'O celeiro',
      description:
        'O cheiro forte perto do celeiro vem do amoníaco (NH₃), um átomo de azoto ligado a três átomos de hidrogénio, comum em fertilizantes e dejetos animais.',
    },
  },
};

export const MOLECULE_ORDER = ['H2O', 'O2', 'O3', 'CO2', 'CO', 'H2', 'NH3'];
