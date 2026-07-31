import type { Chapter, SubjectInfo, Subject } from '@/types';

export const subjects: SubjectInfo[] = [
  {
    name: 'Physics',
    description: 'Light, electricity, magnetism & energy',
    icon: 'Atom',
    color: 'text-chart-1',
    gradient: 'from-chart-1 to-chart-3',
    chapterCount: 5,
  },
  {
    name: 'Chemistry',
    description: 'Reactions, acids, metals & carbon',
    icon: 'FlaskConical',
    color: 'text-chart-3',
    gradient: 'from-chart-3 to-chart-4',
    chapterCount: 5,
  },
  {
    name: 'Biology',
    description: 'Life, reproduction, heredity & evolution',
    icon: 'Leaf',
    color: 'text-accent',
    gradient: 'from-accent to-chart-2',
    chapterCount: 4,
  },
  {
    name: 'Environment',
    description: 'Ecosystems, energy & resources',
    icon: 'Globe',
    color: 'text-chart-2',
    gradient: 'from-chart-2 to-accent',
    chapterCount: 2,
  },
];

export const chapters: Chapter[] = [
  // Chemistry (5)
  {
    id: 'ch1',
    name: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    slug: 'chemical-reactions',
    weightage: 7,
    difficulty: 'Easy',
    pyqCount: 14,
    topics: ['Balancing equations', 'Types of reactions', 'Oxidation-reduction', 'Effects of oxidation'],
  },
  {
    id: 'ch2',
    name: 'Acids, Bases and Salts',
    subject: 'Chemistry',
    slug: 'acids-bases-salts',
    weightage: 6,
    difficulty: 'Medium',
    pyqCount: 12,
    topics: ['pH scale', 'Indicators', 'Neutralisation', 'Salt preparation', 'Plaster of Paris'],
  },
  {
    id: 'ch3',
    name: 'Metals and Non-metals',
    subject: 'Chemistry',
    slug: 'metals-non-metals',
    weightage: 8,
    difficulty: 'Medium',
    pyqCount: 16,
    topics: ['Reactivity series', 'Extraction of metals', 'Corrosion', 'Alloys', 'Ionic compounds'],
  },
  {
    id: 'ch4',
    name: 'Carbon and Its Compounds',
    subject: 'Chemistry',
    slug: 'carbon-compounds',
    weightage: 9,
    difficulty: 'Hard',
    pyqCount: 18,
    topics: ['Covalent bonding', 'Hydrocarbons', 'Functional groups', 'Soaps and detergents', 'Isomers'],
  },
  {
    id: 'ch5',
    name: 'Periodic Classification of Elements',
    subject: 'Chemistry',
    slug: 'periodic-classification',
    weightage: 5,
    difficulty: 'Easy',
    pyqCount: 10,
    topics: ['Mendeleev\'s table', 'Modern periodic table', 'Periodic trends', 'Groups and periods'],
  },
  // Biology (4)
  {
    id: 'ch6',
    name: 'Life Processes',
    subject: 'Biology',
    slug: 'life-processes',
    weightage: 10,
    difficulty: 'Medium',
    pyqCount: 20,
    topics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion', 'Photosynthesis'],
  },
  {
    id: 'ch7',
    name: 'Control and Coordination',
    subject: 'Biology',
    slug: 'control-coordination',
    weightage: 7,
    difficulty: 'Medium',
    pyqCount: 14,
    topics: ['Nervous system', 'Reflex action', 'Hormones', 'Plant movement', 'Brain structure'],
  },
  {
    id: 'ch8',
    name: 'How do Organisms Reproduce?',
    subject: 'Biology',
    slug: 'reproduction',
    weightage: 6,
    difficulty: 'Easy',
    pyqCount: 12,
    topics: ['Asexual reproduction', 'Sexual reproduction', 'Puberty', 'Reproductive health'],
  },
  {
    id: 'ch9',
    name: 'Heredity and Evolution',
    subject: 'Biology',
    slug: 'heredity-evolution',
    weightage: 7,
    difficulty: 'Hard',
    pyqCount: 13,
    topics: ['Mendel\'s laws', 'Sex determination', 'Speciation', 'Evolution', 'Fossils'],
  },
  // Physics (5)
  {
    id: 'ch10',
    name: 'Light – Reflection and Refraction',
    subject: 'Physics',
    slug: 'light-reflection-refraction',
    weightage: 9,
    difficulty: 'Medium',
    pyqCount: 18,
    topics: ['Mirrors', 'Lenses', 'Snell\'s law', 'Ray diagrams', 'Power of a lens'],
  },
  {
    id: 'ch11',
    name: 'Human Eye and Colourful World',
    subject: 'Physics',
    slug: 'human-eye',
    weightage: 6,
    difficulty: 'Easy',
    pyqCount: 11,
    topics: ['Eye defects', 'Dispersion', 'Rainbow', 'Tyndall effect', 'Atmospheric refraction'],
  },
  {
    id: 'ch12',
    name: 'Electricity',
    subject: 'Physics',
    slug: 'electricity',
    weightage: 9,
    difficulty: 'Hard',
    pyqCount: 17,
    topics: ['Ohm\'s law', 'Series & parallel', 'Electric power', 'Heating effect', 'Fuses'],
  },
  {
    id: 'ch13',
    name: 'Magnetic Effects of Electric Current',
    subject: 'Physics',
    slug: 'magnetic-effects',
    weightage: 7,
    difficulty: 'Medium',
    pyqCount: 13,
    topics: ['Magnetic field', 'Electromagnet', 'Electric motor', 'Electromagnetic induction', 'Domestic circuits'],
  },
  {
    id: 'ch14',
    name: 'Sources of Energy',
    subject: 'Physics',
    slug: 'sources-of-energy',
    weightage: 5,
    difficulty: 'Easy',
    pyqCount: 9,
    topics: ['Fossil fuels', 'Renewable energy', 'Solar energy', 'Nuclear energy', 'Biogas'],
  },
  // Environment (2)
  {
    id: 'ch15',
    name: 'Our Environment',
    subject: 'Environment',
    slug: 'our-environment',
    weightage: 5,
    difficulty: 'Easy',
    pyqCount: 10,
    topics: ['Ecosystem', 'Food chains', 'Trophic levels', 'Biodegradable waste', 'Ozone depletion'],
  },
  {
    id: 'ch16',
    name: 'Sustainable Management of Natural Resources',
    subject: 'Environment',
    slug: 'sustainable-management',
    weightage: 4,
    difficulty: 'Easy',
    pyqCount: 8,
    topics: ['Water conservation', 'Forests', 'Coal & petroleum', 'Ganga action plan', '3Rs'],
  },
];

export function getChaptersBySubject(subject: Subject): Chapter[] {
  return chapters.filter((c) => c.subject === subject);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getSubjectInfo(name: Subject): SubjectInfo | undefined {
  return subjects.find((s) => s.name === name);
}

export const totalChapters = chapters.length;
export const totalWeightage = chapters.reduce((sum, c) => sum + c.weightage, 0);
