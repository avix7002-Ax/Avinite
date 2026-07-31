import type { Chapter } from '@/types';
import { chemicalReactionsNotes, acidsBasesSaltsNotes, metalsNonMetalsNotes, carbonCompoundsNotes, periodicClassificationNotes } from '@/lib/notes/chemistry';
import { lifeProcessesNotes, controlCoordinationNotes, reproductionNotes, heredityEvolutionNotes } from '@/lib/notes/biology';
import { lightReflectionRefractionNotes, humanEyeNotes, electricityNotes, magneticEffectsNotes, sourcesOfEnergyNotes } from '@/lib/notes/physics';
import { ourEnvironmentNotes, sustainableManagementNotes } from '@/lib/notes/environment';
import { chemicalReactionsFlashcards, chemicalReactionsFormulas, acidsBasesSaltsFlashcards, acidsBasesSaltsFormulas, metalsNonMetalsFlashcards, metalsNonMetalsFormulas, carbonCompoundsFlashcards, carbonCompoundsFormulas, periodicClassificationFlashcards, periodicClassificationFormulas } from '@/lib/flashcards-formulas/chemistry';
import { lifeProcessesFlashcards, lifeProcessesFormulas, controlCoordinationFlashcards, controlCoordinationFormulas, reproductionFlashcards, reproductionFormulas, heredityEvolutionFlashcards, heredityEvolutionFormulas } from '@/lib/flashcards-formulas/biology';
import { lightReflectionRefractionFlashcards, lightReflectionRefractionFormulas, humanEyeFlashcards, humanEyeFormulas, electricityFlashcards, electricityFormulas, magneticEffectsFlashcards, magneticEffectsFormulas, sourcesOfEnergyFlashcards, sourcesOfEnergyFormulas } from '@/lib/flashcards-formulas/physics';
import { ourEnvironmentFlashcards, ourEnvironmentFormulas, sustainableManagementFlashcards, sustainableManagementFormulas } from '@/lib/flashcards-formulas/environment';
import { examContent, type ExamMeta, type LastMinuteShot } from '@/lib/exam-content';

export interface NoteSection {
  title: string;
  icon: string;
  items: string[];
}

export interface Flashcard {
  front: string;
  back: string;
  definition: string;
  explanation: string;
  keyword: string;
  commonMistake: string;
  examTip: string;
  memoryTrick?: string;
}

export interface FormulaCard {
  formula: string;
  label: string;
  symbols: string;
  units: string;
  usedFor: string;
  conditions: string;
  commonMistakes: string;
  example: string;
  signConvention?: string;
}

export interface RevisionContent {
  notes: NoteSection[];
  flashcards: Flashcard[];
  formulas: FormulaCard[];
  mnemonic: string;
  examMeta: ExamMeta;
  lastMinuteShot: LastMinuteShot;
}

// Per-chapter revision content keyed by chapter slug.
// All content verified against NCERT Class 10 Science and NEET syllabus.
export const revisionContent: Record<string, RevisionContent> = {
  // ========================== CHEMISTRY ==========================
  'chemical-reactions': {
    notes: chemicalReactionsNotes,
    flashcards: chemicalReactionsFlashcards,
    formulas: chemicalReactionsFormulas,
    mnemonic: '"LEO says GER" — Loss of Electrons = Oxidation; Gain of Electrons = Reduction. Or: OIL RIG — Oxidation Is Loss, Reduction Is Gain (of electrons).',
    examMeta: examContent['chemical-reactions'].examMeta,
    lastMinuteShot: examContent['chemical-reactions'].lastMinuteShot,
  },

  'acids-bases-salts': {
    notes: acidsBasesSaltsNotes,
    flashcards: acidsBasesSaltsFlashcards,
    formulas: acidsBasesSaltsFormulas,
    mnemonic: '"LEO the lion says GER" for redox. For pH: "pH 7 is heaven (neutral), below 7 is hell (acidic), above 7 is high (basic)."',
    examMeta: examContent['acids-bases-salts'].examMeta,
    lastMinuteShot: examContent['acids-bases-salts'].lastMinuteShot,
  },

  'metals-non-metals': {
    notes: metalsNonMetalsNotes,
    flashcards: metalsNonMetalsFlashcards,
    formulas: metalsNonMetalsFormulas,
    mnemonic: '"K Na Ca Mg Al Zn Fe Pb Cu Ag Au" — "Kissable Naughty Cats May All Zink From Playing Cards Silly Aggravating Au-nties."',
    examMeta: examContent['metals-non-metals'].examMeta,
    lastMinuteShot: examContent['metals-non-metals'].lastMinuteShot,
  },

  'carbon-compounds': {
    notes: carbonCompoundsNotes,
    flashcards: carbonCompoundsFlashcards,
    formulas: carbonCompoundsFormulas,
    mnemonic: '"My Elephant Plays Best" — Methane, Ethane, Propane, Butane (1-4 carbon atoms). Functional groups: "OH-Al, CHO-De, COO-Acid" — Alcohol, Aldehyde, Carboxylic Acid.',
    examMeta: examContent['carbon-compounds'].examMeta,
    lastMinuteShot: examContent['carbon-compounds'].lastMinuteShot,
  },

  'periodic-classification': {
    notes: periodicClassificationNotes,
    flashcards: periodicClassificationFlashcards,
    formulas: periodicClassificationFormulas,
    mnemonic: '"He Never Arrived Kill Xeno Rn" — Noble gases: He, Ne, Ar, Kr, Xe, Rn. Periods: "2, 8, 8, 18, 18, 32, incomplete."',
    examMeta: examContent['periodic-classification'].examMeta,
    lastMinuteShot: examContent['periodic-classification'].lastMinuteShot,
  },

  // ========================== BIOLOGY ==========================
  'life-processes': {
    notes: lifeProcessesNotes,
    flashcards: lifeProcessesFlashcards,
    formulas: lifeProcessesFormulas,
    mnemonic: '"Mouth Stomach Small Large" — order of digestive tract. Nephron steps: "FRSU" — Filtration, Reabsorption, Secretion, Urine.',
    examMeta: examContent['life-processes'].examMeta,
    lastMinuteShot: examContent['life-processes'].lastMinuteShot,
  },

  'control-coordination': {
    notes: controlCoordinationNotes,
    flashcards: controlCoordinationFlashcards,
    formulas: controlCoordinationFormulas,
    mnemonic: 'Brain parts: "CBM" — Cerebrum (thinking), Brainstem (involuntary), Cerebellum (balance & movement). Plant hormones: "All Good Children Are Eating" — Auxin, Gibberellin, Cytokinin, Abscisic acid, Ethylene.',
    examMeta: examContent['control-coordination'].examMeta,
    lastMinuteShot: examContent['control-coordination'].lastMinuteShot,
  },

  'reproduction': {
    notes: reproductionNotes,
    flashcards: reproductionFlashcards,
    formulas: reproductionFormulas,
    mnemonic: 'Flower parts: "SF SO" — Stamen = Filament + Anther (male); Stigma + Style + Ovary = Pistil (female). Asexual methods: "BBF SV" — Budding, Binary fission, Fragmentation, Spore, Vegetative.',
    examMeta: examContent['reproduction'].examMeta,
    lastMinuteShot: examContent['reproduction'].lastMinuteShot,
  },

  'heredity-evolution': {
    notes: heredityEvolutionNotes,
    flashcards: heredityEvolutionFlashcards,
    formulas: heredityEvolutionFormulas,
    mnemonic: 'Mendel ratios: "3 to 1 for one trait, 9-3-3-1 for two." Sex: "XX girl, XY boy — dad decides." Evolution evidence: "HHAA" — Homologous = Homology (common Ancestor), Analogous = Adaptation (same environment).',
    examMeta: examContent['heredity-evolution'].examMeta,
    lastMinuteShot: examContent['heredity-evolution'].lastMinuteShot,
  },

  // ========================== PHYSICS ==========================
  'light-reflection-refraction': {
    notes: lightReflectionRefractionNotes,
    flashcards: lightReflectionRefractionFlashcards,
    formulas: lightReflectionRefractionFormulas,
    mnemonic: 'Mirror vs Lens formula: "Mirror Plus, Lens Minus" — mirror: 1/v + 1/u = 1/f; lens: 1/v - 1/u = 1/f. Concave mirror uses: "Shaving, Dentist, Torch, Solar furnace." Convex mirror: "Rear-view, Blind corners."',
    examMeta: examContent['light-reflection-refraction'].examMeta,
    lastMinuteShot: examContent['light-reflection-refraction'].lastMinuteShot,
  },

  'human-eye': {
    notes: humanEyeNotes,
    flashcards: humanEyeFlashcards,
    formulas: humanEyeFormulas,
    mnemonic: 'VIBGYOR = Violet, Indigo, Blue, Green, Yellow, Orange, Red. "Myopia = Minus (concave), Hypermetropia = Hifi (convex)." Twinkling: "Stars twinkle, planets don\'t — point vs disc."',
    examMeta: examContent['human-eye'].examMeta,
    lastMinuteShot: examContent['human-eye'].lastMinuteShot,
  },

  'electricity': {
    notes: electricityNotes,
    flashcards: electricityFlashcards,
    formulas: electricityFormulas,
    mnemonic: 'Series: "Same current, voltage splits, resistances add." Parallel: "Same voltage, current splits, reciprocals add." Power formulas: "PVI squared R" — P = VI = I²R = V²/R. Wire colours: "Red Live, Black Neutral, Green Earth."',
    examMeta: examContent['electricity'].examMeta,
    lastMinuteShot: examContent['electricity'].lastMinuteShot,
  },

  'magnetic-effects': {
    notes: magneticEffectsNotes,
    flashcards: magneticEffectsFlashcards,
    formulas: magneticEffectsFormulas,
    mnemonic: 'Left hand = Motor (MOTor = MOTion by current). Right hand = Generator (GENerator = GENerates current by motion). "Left for Motors, Right for Generators." Wire colours: "Red Live, Black Neutral, Green Earth."',
    examMeta: examContent['magnetic-effects'].examMeta,
    lastMinuteShot: examContent['magnetic-effects'].lastMinuteShot,
  },

  'sources-of-energy': {
    notes: sourcesOfEnergyNotes,
    flashcards: sourcesOfEnergyFlashcards,
    formulas: sourcesOfEnergyFormulas,
    mnemonic: 'Renewable sources: "SWIMBG" — Solar, Wind, (tIdal), (geo thermal), Bio, (hydro/Geothermal). Non-renewable: "Fossil fuels = Finite." Greenhouse gases: "CAMW" — CO₂, CH₄, (water vapour), N₂O.',
    examMeta: examContent['sources-of-energy'].examMeta,
    lastMinuteShot: examContent['sources-of-energy'].lastMinuteShot,
  },

  // ========================== ENVIRONMENT ==========================
  'our-environment': {
    notes: ourEnvironmentNotes,
    flashcards: ourEnvironmentFlashcards,
    formulas: ourEnvironmentFormulas,
    mnemonic: 'Trophic levels: "Producers → Primary → Secondary → Tertiary." 10% law: "Ten percent travels, rest is lost." Ozone: "O₃ saves from UV, CFC kills O₃." Biodegradable: "Can rot" vs Non-biodegradable: "Cannot rot."',
    examMeta: examContent['our-environment'].examMeta,
    lastMinuteShot: examContent['our-environment'].lastMinuteShot,
  },

  'sustainable-management': {
    notes: sustainableManagementNotes,
    flashcards: sustainableManagementFlashcards,
    formulas: sustainableManagementFormulas,
    mnemonic: '3Rs: "Reduce before you Reuse, Reuse before you Recycle." Water: "Harvest rain, recharge aquifer." Forests: "Chipko = Hug trees." Quote: "Borrowed from our children, not inherited from ancestors."',
    examMeta: examContent['sustainable-management'].examMeta,
    lastMinuteShot: examContent['sustainable-management'].lastMinuteShot,
  },
};

export function getRevisionContent(chapter: Chapter): RevisionContent {
  const content = revisionContent[chapter.slug];
  if (!content) {
    return {
      notes: sustainableManagementNotes,
      flashcards: sustainableManagementFlashcards,
      formulas: sustainableManagementFormulas,
      mnemonic: 'Use the NCERT summary at the end of the chapter for quick revision.',
      examMeta: examContent['sustainable-management']?.examMeta,
      lastMinuteShot: examContent['sustainable-management']?.lastMinuteShot,
    } as RevisionContent;
  }
  return content;
}
