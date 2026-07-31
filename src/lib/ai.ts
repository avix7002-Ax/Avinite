import { chapters, getChapterBySlug } from '@/lib/data';
import type { Subject } from '@/types';

export interface PracticeQuestion {
  id: string;
  type: 'MCQ' | 'Assertion-Reason' | 'Case Study' | 'Numerical' | 'Short Answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  chapter: string;
}

export interface MockQuestion {
  id: string;
  type: 'MCQ' | 'Assertion-Reason' | 'Numerical' | 'Short Answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionTemplate {
  q: string;
  options?: string[];
  answer: string;
  expl: string;
}

type QuestionType = 'MCQ' | 'Assertion-Reason' | 'Case Study' | 'Numerical' | 'Short Answer';

// Per-chapter question bank, keyed by chapter slug from data.ts.
// Every question is verified against NCERT Class 10 Science syllabus.
const chapterQuestionBank: Record<string, Partial<Record<QuestionType, QuestionTemplate[]>>> = {
  // ========================== CHEMISTRY ==========================
  'chemical-reactions': {
    MCQ: [
      {
        q: 'Which of the following is a decomposition reaction?',
        options: ['CaCO₃ → CaO + CO₂', '2H₂ + O₂ → 2H₂O', 'NaOH + HCl → NaCl + H₂O', 'Fe + CuSO₄ → FeSO₄ + Cu'],
        answer: 'CaCO₃ → CaO + CO₂',
        expl: 'A decomposition reaction breaks a single compound into two or more simpler substances. CaCO₃ breaks into CaO and CO₂.',
      },
      {
        q: 'In the reaction Zn + CuSO₄ → ZnSO₄ + Cu, zinc is:',
        options: ['Oxidised', 'Reduced', 'Both oxidised and reduced', 'Neither oxidised nor reduced'],
        answer: 'Oxidised',
        expl: 'Zinc loses electrons (Zn → Zn²⁺ + 2e⁻), so it is oxidised. Copper gains electrons and is reduced.',
      },
      {
        q: 'Which gas is produced when zinc reacts with dilute hydrochloric acid?',
        options: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Chlorine'],
        answer: 'Hydrogen',
        expl: 'Zn + 2HCl → ZnCl₂ + H₂. Hydrogen gas can be tested with a burning splint which produces a "pop" sound.',
      },
      {
        q: 'The white silver chloride turns grey in sunlight due to the formation of:',
        options: ['Silver metal', 'Chlorine gas', 'Silver oxide', 'Hydrogen chloride'],
        answer: 'Silver metal',
        expl: '2AgCl → 2Ag + Cl₂. This is a photodecomposition reaction used in black-and-white photography.',
      },
      {
        q: 'Which of the following is a redox reaction?',
        options: ['NaOH + HCl → NaCl + H₂O', 'CuO + H₂ → Cu + H₂O', 'AgNO₃ + NaCl → AgCl + NaNO₃', 'CaCO₃ → CaO + CO₂'],
        answer: 'CuO + H₂ → Cu + H₂O',
        expl: 'CuO is reduced to Cu (loses oxygen) and H₂ is oxidised to H₂O (gains oxygen). Both oxidation and reduction occur.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Sodium metal is kept under kerosene. Reason: Sodium reacts vigorously with air and water.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Sodium is a highly reactive metal that reacts with moisture and air, so it is stored under kerosene to prevent contact.',
      },
      {
        q: 'Assertion: Oxidation and reduction occur simultaneously. Reason: In a redox reaction, one substance is oxidised while another is reduced.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'In every redox reaction, the substance that loses electrons is oxidised and the one that gains electrons is reduced — both happen together.',
      },
    ],
    'Case Study': [
      {
        q: 'A student observes that an iron nail left in a moist environment develops a reddish-brown coating.\n\n(a) Name the process.\n(b) Write the chemical formula of the coating.\n(c) Suggest two methods to prevent it.',
        answer: '(a) Rusting (corrosion). (b) Fe₂O₃·xH₂O (hydrated iron oxide). (c) Painting, galvanisation, oiling, or tinning.',
        expl: 'Rusting is the oxidation of iron in the presence of air and moisture. Barrier methods like painting or galvanisation prevent contact with air and water.',
      },
    ],
    Numerical: [
      {
        q: 'Balance the equation: Fe + O₂ → Fe₂O₃. Write the balanced equation.',
        answer: '4Fe + 3O₂ → 2Fe₂O₃',
        expl: 'To balance: 4 Fe atoms on both sides and 6 O atoms on both sides (3×2 on left, 2×3 on right).',
      },
      {
        q: 'In the reaction 2H₂ + O₂ → 2H₂O, how many moles of O₂ are needed to produce 4 moles of H₂O?',
        answer: '2 moles of O₂',
        expl: 'From the balanced equation, 1 mole of O₂ produces 2 moles of H₂O. So 4 moles of H₂O require 4/2 = 2 moles of O₂.',
      },
    ],
    'Short Answer': [
      {
        q: 'Why do we apply paint on iron articles?',
        answer: 'Painting creates a barrier between the iron surface and air/moisture, preventing rusting (corrosion). Without paint, iron reacts with oxygen and water to form hydrated iron oxide (rust).',
        expl: 'Rusting requires both air and moisture. Paint cuts off contact with both, preventing the electrochemical corrosion process.',
      },
      {
        q: 'What is a precipitation reaction? Give one example.',
        answer: 'A precipitation reaction is one in which two soluble substances react to form an insoluble solid (precipitate). Example: AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq). The white solid AgCl is the precipitate.',
        expl: 'The precipitate is identified by the downward arrow (↓) in the equation. AgCl is insoluble in water.',
      },
    ],
  },

  'acids-bases-salts': {
    MCQ: [
      {
        q: 'The pH of a neutral solution is:',
        options: ['0', '7', '14', '1'],
        answer: '7',
        expl: 'A neutral solution like pure water has a pH of 7. Values below 7 are acidic, above 7 are basic.',
      },
      {
        q: 'Which of the following is a strong acid?',
        options: ['Acetic acid (CH₃COOH)', 'Hydrochloric acid (HCl)', 'Carbonic acid (H₂CO₃)', 'Citric acid'],
        answer: 'Hydrochloric acid (HCl)',
        expl: 'HCl is a strong acid because it ionises completely in water. Acetic, carbonic, and citric acids are weak acids that only partially ionise.',
      },
      {
        q: 'What colour does methyl orange turn in an acidic solution?',
        options: ['Yellow', 'Red/Pink', 'Blue', 'Green'],
        answer: 'Red/Pink',
        expl: 'Methyl orange turns red/pink in acidic solutions (pH < 3.1) and yellow in basic solutions (pH > 4.4).',
      },
      {
        q: 'Plaster of Paris is chemically:',
        options: ['CaSO₄·2H₂O', 'CaSO₄·½H₂O', 'CaCO₃', 'CaO'],
        answer: 'CaSO₄·½H₂O',
        expl: 'Plaster of Paris is calcium sulphate hemihydrate (CaSO₄·½H₂O). When mixed with water, it sets into hard Gypsum (CaSO₄·2H₂O).',
      },
      {
        q: 'Which gas is produced when dilute hydrochloric acid reacts with zinc granules?',
        options: ['CO₂', 'H₂', 'O₂', 'SO₂'],
        answer: 'H₂',
        expl: 'Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is produced and can be tested with a burning splint ("pop" test).',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Acids turn blue litmus red. Reason: Acids release H⁺ (hydrogen) ions in aqueous solution.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'The release of H⁺ ions is what makes a substance acidic, which causes blue litmus to turn red.',
      },
    ],
    'Case Study': [
      {
        q: 'A student adds a few drops of universal indicator to three solutions: lemon juice, milk of magnesia, and pure water. The colours observed are red, blue, and green respectively.\n\n(a) Identify which solution is acidic, basic, and neutral.\n(b) What is the approximate pH of each?\n(c) Which solution would react with an antacid tablet?',
        answer: '(a) Lemon juice = acidic (red), Milk of magnesia = basic (blue), Pure water = neutral (green). (b) Lemon juice pH ~2-3, Milk of magnesia pH ~10, Pure water pH = 7. (c) The acidic lemon juice would react with an antacid (which is basic).',
        expl: 'Universal indicator shows pH via colour: red = strong acid (pH 1-3), green = neutral (pH 7), blue/purple = base (pH 8-11). Antacids are basic and neutralise excess stomach acid.',
      },
    ],
    Numerical: [
      {
        q: 'A solution has a hydrogen ion concentration of 10⁻³ mol/L. What is its pH? Is it acidic, basic, or neutral?',
        answer: 'pH = 3. The solution is acidic (pH < 7).',
        expl: 'pH = -log[H⁺] = -log(10⁻³) = 3. Any pH below 7 is acidic.',
      },
      {
        q: 'If 50 mL of 0.1 M HCl is neutralised by 25 mL of NaOH solution, what is the concentration of NaOH?',
        answer: '0.2 M',
        expl: 'Using M₁V₁ = M₂V₂ (for 1:1 reaction): 0.1 × 50 = M₂ × 25, so M₂ = (0.1 × 50)/25 = 0.2 M.',
      },
    ],
    'Short Answer': [
      {
        q: 'What happens when an acid reacts with a metal carbonate? Give one example with equation.',
        answer: 'Acid + Metal carbonate → Salt + Water + Carbon dioxide. Example: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑. The CO₂ gas turns limewater milky.',
        expl: 'The CO₂ produced can be identified by passing it through limewater (Ca(OH)₂ solution), which turns milky due to CaCO₃ formation.',
      },
      {
        q: 'Why does curd set in a brass vessel taste sour? What is the chemical reason?',
        answer: 'Curd contains lactic acid. Brass contains copper and zinc. The acid reacts with the metal to form toxic salts, making the curd sour and unfit for consumption. Acidic food should not be stored in metal vessels.',
        expl: 'Acids react with metals to form salts and hydrogen gas. Lactic acid + copper/zinc → metallic salts which are harmful.',
      },
    ],
  },

  'metals-non-metals': {
    MCQ: [
      {
        q: 'Which of the following is the most reactive metal?',
        options: ['Iron', 'Zinc', 'Sodium', 'Copper'],
        answer: 'Sodium',
        expl: 'In the reactivity series, sodium is near the top (most reactive), followed by zinc, iron, and copper (least reactive among these).',
      },
      {
        q: 'Which method is used to extract metals of high reactivity like sodium and aluminium?',
        options: ['Reduction with carbon', 'Electrolytic reduction', 'Roasting', 'Calcination'],
        answer: 'Electrolytic reduction',
        expl: 'Highly reactive metals (Na, K, Ca, Al) are extracted by electrolysis of their molten salts because carbon cannot reduce them.',
      },
      {
        q: 'What is the chemical formula of rust?',
        options: ['FeO', 'Fe₂O₃', 'Fe₂O₃·xH₂O', 'Fe₃O₄'],
        answer: 'Fe₂O₃·xH₂O',
        expl: 'Rust is hydrated iron(III) oxide, Fe₂O₃·xH₂O, formed when iron reacts with oxygen and water over time.',
      },
      {
        q: 'Which of the following is NOT a property of metals?',
        options: ['Malleability', 'Ductility', 'Brittleness', 'Good electrical conductivity'],
        answer: 'Brittleness',
        expl: 'Metals are malleable (can be hammered into sheets) and ductile (drawn into wires). Brittleness is a property of non-metals.',
      },
      {
        q: 'An alloy of copper and zinc is called:',
        options: ['Bronze', 'Brass', 'Stainless steel', 'Solder'],
        answer: 'Brass',
        expl: 'Brass is an alloy of copper (60-80%) and zinc (20-40%). Bronze is copper + tin. Solder is lead + tin.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Ionic compounds have high melting points. Reason: Ionic compounds have strong electrostatic forces between oppositely charged ions.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'The strong electrostatic attraction between cations and anions requires a lot of energy to break, resulting in high melting and boiling points.',
      },
      {
        q: 'Assertion: Copper cannot displace zinc from zinc sulphate solution. Reason: Copper is less reactive than zinc.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'In the reactivity series, zinc is above copper. A more reactive metal displaces a less reactive one from its salt solution. Since copper is below zinc, it cannot displace zinc.',
      },
    ],
    'Case Study': [
      {
        q: 'A jeweller claims to make gold jewellery, but a customer suspects it might be brass (copper + zinc).\n\n(a) Which reagent can confirm if the jewellery contains zinc?\n(b) Write the reaction.\n(c) Why is pure gold not used for jewellery?',
        answer: '(a) Dilute HCl. (b) Zn + 2HCl → ZnCl₂ + H₂↑ (gold and copper do not react with HCl). (c) Pure gold (24 carat) is too soft; it is alloyed with copper/silver to make it hard.',
        expl: 'Zinc reacts with dilute HCl to produce H₂ gas. Gold and copper do not react with dilute HCl, so gas evolution indicates zinc (brass). Gold is alloyed to increase hardness.',
      },
    ],
    Numerical: [
      {
        q: 'In the thermite reaction Fe₂O₃ + 2Al → 2Fe + Al₂O₃, how many grams of iron are produced from 160 g of Fe₂O₃? (Atomic masses: Fe=56, O=16, Al=27)',
        answer: '112 g of iron',
        expl: 'Molar mass of Fe₂O₃ = 2(56) + 3(16) = 160 g/mol. 160 g Fe₂O₃ produces 2×56 = 112 g Fe. So 160 g Fe₂O₃ → 112 g Fe.',
      },
    ],
    'Short Answer': [
      {
        q: 'Why is sodium kept immersed in kerosene oil?',
        answer: 'Sodium is a highly reactive metal that reacts vigorously with oxygen and moisture in air, potentially causing fire. Kerosene cuts off contact with air and water, preventing reaction.',
        expl: 'Sodium reacts with water to produce H₂ gas and heat, which can ignite the hydrogen. Kerosene is an inert medium that prevents this.',
      },
      {
        q: 'What is galvanisation? Why is it done?',
        answer: 'Galvanisation is the process of coating iron or steel with a thin layer of zinc. It is done to prevent rusting — zinc acts as a sacrificial metal, corroding instead of iron.',
        expl: 'Zinc is more reactive than iron, so it oxidises first, protecting the iron beneath. Even if the coating is scratched, zinc continues to protect iron by sacrificial protection.',
      },
    ],
  },

  'carbon-compounds': {
    MCQ: [
      {
        q: 'The number of covalent bonds carbon can form is:',
        options: ['1', '2', '3', '4'],
        answer: '4',
        expl: 'Carbon has 4 valence electrons (electronic configuration 2,4) and shares all 4 to achieve a stable octet, forming 4 covalent bonds.',
      },
      {
        q: 'Which of the following is an unsaturated hydrocarbon?',
        options: ['Methane (CH₄)', 'Ethane (C₂H₆)', 'Ethene (C₂H₄)', 'Propane (C₃H₈)'],
        answer: 'Ethene (C₂H₄)',
        expl: 'Ethene (C₂H₄) has a double bond (C=C), making it unsaturated. Saturated hydrocarbons (alkanes) have only single bonds.',
      },
      {
        q: 'The functional group present in acetic acid (CH₃COOH) is:',
        options: ['Hydroxyl (-OH)', 'Carboxyl (-COOH)', 'Aldehyde (-CHO)', 'Ketone (C=O)'],
        answer: 'Carboxyl (-COOH)',
        expl: 'The -COOH group is the carboxylic acid functional group. Acetic acid (vinegar) is ethanoic acid, CH₃COOH.',
      },
      {
        q: 'Soap molecules have two ends: a hydrophilic head and a hydrophobic tail. The hydrophobic tail is:',
        options: ['The carboxylate end', 'The hydrocarbon chain', 'The sodium ion', 'The ester group'],
        answer: 'The hydrocarbon chain',
        expl: 'The long hydrocarbon chain repels water (hydrophobic) but attaches to oil/dirt. The ionic (carboxylate) head is water-loving (hydrophilic).',
      },
      {
        q: 'The general formula of alkanes is:',
        options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
        answer: 'CₙH₂ₙ₊₂',
        expl: 'Alkanes (saturated hydrocarbons) follow CₙH₂ₙ₊₂. Example: methane CH₄ (n=1), ethane C₂H₆ (n=2).',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Carbon forms covalent bonds. Reason: Carbon can gain or lose 4 electrons easily.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'A is true but R is false',
        expl: 'Carbon forms covalent bonds by sharing electrons, but it cannot easily gain or lose 4 electrons — that would require too much energy.',
      },
      {
        q: 'Assertion: Soaps are ineffective in hard water. Reason: Hard water contains calcium and magnesium ions that form insoluble scum with soap.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Calcium and magnesium ions in hard water react with soap to form an insoluble precipitate (scum), preventing lather formation.',
      },
    ],
    'Case Study': [
      {
        q: 'A student tests two liquids — liquid A (ethanol) and liquid B (ethanoic acid).\n\n(a) How can you identify ethanoic acid using a chemical test?\n(b) What happens when ethanol reacts with ethanoic acid in the presence of conc. H₂SO₄?\n(c) Name the reaction and the product.',
        answer: '(a) Add sodium bicarbonate (NaHCO₃) — ethanoic acid produces CO₂ gas (effervescence); ethanol does not react. (b) Ethanol + ethanoic acid → ester + water. (c) Esterification reaction; product is ethyl ethanoate (CH₃COOC₂H₅).',
        expl: 'Esterification: CH₃COOH + C₂H₅OH →(H₂SO₄) CH₃COOC₂H₅ + H₂O. The ester has a sweet fruity smell. Conc. H₂SO₄ acts as a catalyst and dehydrating agent.',
      },
    ],
    Numerical: [
      {
        q: 'Calculate the molecular mass of ethanol (C₂H₅OH). (Atomic masses: C=12, H=1, O=16)',
        answer: '46 u',
        expl: 'C₂H₅OH = 2(12) + 6(1) + 16 = 24 + 6 + 16 = 46 u.',
      },
      {
        q: 'How many carbon atoms are present in one molecule of butane? What is its molecular formula?',
        answer: '4 carbon atoms. Molecular formula: C₄H₁₀.',
        expl: '"But-" prefix means 4 carbon atoms. For an alkane (CₙH₂ₙ₊₂): C₄H₂(4)+2 = C₄H₁₀.',
      },
    ],
    'Short Answer': [
      {
        q: 'Explain why carbon forms covalent bonds and not ionic bonds.',
        answer: 'Carbon has 4 valence electrons. It cannot lose 4 electrons (requires too much energy) or gain 4 electrons (nucleus cannot hold 10 electrons). So it shares electrons, forming covalent bonds.',
        expl: 'Carbon\'s electronic configuration (2,4) makes it energetically favourable to share electrons rather than transfer them.',
      },
      {
        q: 'What is hydrogenation? Write one industrial application.',
        answer: 'Hydrogenation is the addition of hydrogen to unsaturated hydrocarbons in the presence of a nickel catalyst to convert them into saturated hydrocarbons. Application: Conversion of vegetable oils into solid fats (vanaspati ghee/margarine).',
        expl: 'Ni acts as a catalyst at about 200°C. C=C double bond becomes C-C single bond by adding H₂. This increases the melting point, making liquid oil into solid fat.',
      },
    ],
  },

  'periodic-classification': {
    MCQ: [
      {
        q: 'In the modern periodic table, elements are arranged in order of:',
        options: ['Atomic mass', 'Atomic number', 'Valency', 'Chemical reactivity'],
        answer: 'Atomic number',
        expl: 'Henry Moseley proposed the modern periodic law: properties of elements are a periodic function of their atomic number, not atomic mass.',
      },
      {
        q: 'How many groups are there in the modern periodic table?',
        options: ['7', '8', '18', '32'],
        answer: '18',
        expl: 'The modern periodic table has 18 vertical columns (groups) and 7 horizontal rows (periods).',
      },
      {
        q: 'Which of the following elements is a noble gas?',
        options: ['Sodium', 'Oxygen', 'Neon', 'Iron'],
        answer: 'Neon',
        expl: 'Neon (Ne, atomic number 10) is in Group 18 — the noble gases. Noble gases have completely filled outer shells and are inert.',
      },
      {
        q: 'Across a period (left to right), the atomic size generally:',
        options: ['Increases', 'Decreases', 'Remains the same', 'First increases then decreases'],
        answer: 'Decreases',
        expl: 'Across a period, nuclear charge increases while the number of shells stays the same, pulling electrons closer and decreasing atomic size.',
      },
      {
        q: 'Mendeleev\'s periodic table was based on which property?',
        options: ['Atomic number', 'Atomic mass', 'Valency', 'Electronegativity'],
        answer: 'Atomic mass',
        expl: 'Mendeleev arranged elements in order of increasing atomic mass. He left gaps for undiscovered elements and predicted their properties.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Mendeleev left gaps in his periodic table. Reason: He predicted the existence of undiscovered elements.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Mendeleev left gaps for elements like gallium and germanium, predicting their properties before they were discovered. This was a major strength of his table.',
      },
    ],
    'Case Study': [
      {
        q: 'Three elements X, Y, and Z belong to the same period (Period 3) of the modern periodic table. X is a metal, Y is a metalloid, and Z is a non-metal.\n\n(a) Identify X, Y, and Z from: Na, Mg, Al, Si, P, S, Cl.\n(b) What happens to atomic size from X to Z?\n(c) What happens to metallic character from X to Z?',
        answer: '(a) X could be Na/Mg/Al (metal), Y = Si (metalloid), Z could be P/S/Cl (non-metal). (b) Atomic size decreases from left to right. (c) Metallic character decreases and non-metallic character increases from left to right.',
        expl: 'Across a period, nuclear charge increases, pulling electrons closer (smaller atoms). Metals are on the left, non-metals on the right, metalloids in between.',
      },
    ],
    Numerical: [
      {
        q: 'An element has atomic number 11. In which period and group does it belong? Identify the element.',
        answer: 'Period 3, Group 1. The element is sodium (Na).',
        expl: 'Electronic configuration of Na (Z=11): 2, 8, 1. Three shells → Period 3. One valence electron → Group 1 (alkali metal).',
      },
    ],
    'Short Answer': [
      {
        q: 'State two limitations of Mendeleev\'s periodic table.',
        answer: '1. Position of isotopes could not be explained (isotopes have different atomic masses but same properties). 2. Wrong order of atomic masses in some cases (e.g., Ar before K, Co before Ni) — he prioritised properties over atomic mass.',
        expl: 'These limitations were overcome by the modern periodic table, which is based on atomic number rather than atomic mass.',
      },
      {
        q: 'What is the relationship between group number and valence electrons in the modern periodic table for groups 1 and 2?',
        answer: 'For groups 1 and 2, the group number equals the number of valence electrons. Group 1 elements have 1 valence electron, Group 2 elements have 2 valence electrons.',
        expl: 'For groups 13-18, the group number minus 10 gives the number of valence electrons (e.g., Group 17 has 7 valence electrons).',
      },
    ],
  },

  // ========================== BIOLOGY ==========================
  'life-processes': {
    MCQ: [
      {
        q: 'Which hormone is responsible for the regulation of blood sugar levels?',
        options: ['Thyroxine', 'Insulin', 'Adrenaline', 'Growth hormone'],
        answer: 'Insulin',
        expl: 'Insulin, produced by the pancreas, regulates blood sugar levels by helping cells absorb glucose. Lack of insulin causes diabetes.',
      },
      {
        q: 'The basic structural and functional unit of the kidney is:',
        options: ['Neuron', 'Nephron', 'Alveolus', 'Villus'],
        answer: 'Nephron',
        expl: 'The nephron is the functional unit of the kidney. It filters blood, reabsorbs useful substances, and produces urine.',
      },
      {
        q: 'In which part of the cell does aerobic respiration mainly occur?',
        options: ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Ribosome'],
        answer: 'Mitochondria',
        expl: 'Aerobic respiration (Krebs cycle and oxidative phosphorylation) occurs in mitochondria, the "powerhouse" of the cell. Anaerobic respiration occurs in the cytoplasm.',
      },
      {
        q: 'Which part of the digestive system absorbs most of the digested food?',
        options: ['Stomach', 'Small intestine', 'Large intestine', 'Liver'],
        answer: 'Small intestine',
        expl: 'The small intestine has villi that increase surface area for absorption. Most digested food is absorbed here into the bloodstream.',
      },
      {
        q: 'The exchange of gases in plants occurs through:',
        options: ['Cuticle', 'Lenticels and stomata', 'Bark', 'Xylem'],
        answer: 'Lenticels and stomata',
        expl: 'Stomata (on leaves) and lenticels (on stems) allow gas exchange. Stomata also allow transpiration (water loss).',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Arteries have thick, elastic walls. Reason: Arteries carry blood under high pressure away from the heart.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Arteries carry oxygenated blood from the heart under high pressure, so they need thick elastic walls. Veins have thinner walls and carry blood back to the heart.',
      },
      {
        q: 'Assertion: Anaerobic respiration produces less energy than aerobic respiration. Reason: In anaerobic respiration, glucose is only partially broken down.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Aerobic respiration yields 38 ATP; anaerobic yields only 2 ATP because glucose is incompletely broken down (into lactic acid or ethanol + CO₂).',
      },
    ],
    'Case Study': [
      {
        q: 'A student observes that a plant kept in a dark room for 48 hours shows no starch in its leaves, but a plant kept in sunlight does.\n\n(a) What process explains this?\n(b) Write the overall equation.\n(c) Why does the plant in the dark have no starch?',
        answer: '(a) Photosynthesis. (b) 6CO₂ + 6H₂O → (sunlight, chlorophyll) → C₆H₁₂O₆ + 6O₂. (c) Without sunlight, photosynthesis cannot occur, so no glucose is produced and no starch is stored.',
        expl: 'Iodine test: starch turns blue-black with iodine. The plant in the dark has used up its stored starch for respiration but cannot replenish it without light.',
      },
    ],
    Numerical: [
      {
        q: 'If a person\'s heart beats 72 times per minute and pumps 70 mL per beat, what is the cardiac output per minute?',
        answer: '5040 mL/min (about 5 litres/min)',
        expl: 'Cardiac output = Heart rate × Stroke volume = 72 × 70 = 5040 mL/min ≈ 5.04 L/min.',
      },
    ],
    'Short Answer': [
      {
        q: 'Differentiate between aerobic and anaerobic respiration.',
        answer: 'Aerobic respiration uses oxygen, occurs in mitochondria, produces CO₂ + H₂O + 38 ATP. Anaerobic respiration occurs without oxygen, in cytoplasm, produces lactic acid (muscles) or ethanol + CO₂ (yeast) + 2 ATP.',
        expl: 'Aerobic is more efficient (38 ATP vs 2 ATP). Anaerobic happens during intense exercise when oxygen supply is insufficient.',
      },
      {
        q: 'What is the role of saliva in digestion?',
        answer: 'Saliva contains the enzyme salivary amylase which breaks down starch into maltose (sugar). It also moistens food for easy swallowing.',
        expl: 'Salivary amylase works in the mouth. Once food reaches the stomach, the acidic environment stops amylase activity.',
      },
    ],
  },

  'control-coordination': {
    MCQ: [
      {
        q: 'Which part of the human brain controls balance and posture?',
        options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Pons'],
        answer: 'Cerebellum',
        expl: 'The cerebellum controls voluntary movements, balance, and posture coordination. The medulla controls involuntary functions like breathing and heart rate.',
      },
      {
        q: 'The structural and functional unit of the nervous system is:',
        options: ['Nephron', 'Neuron', 'Axon', 'Synapse'],
        answer: 'Neuron',
        expl: 'The neuron (nerve cell) is the basic unit of the nervous system. It consists of dendrites, a cell body, and an axon, and transmits electrical impulses.',
      },
      {
        q: 'Which plant hormone promotes cell elongation?',
        options: ['Auxin', 'Cytokinin', 'Ethylene', 'Abscisic acid'],
        answer: 'Auxin',
        expl: 'Auxins promote cell elongation in stems, especially on the shaded side, causing phototropism (bending towards light).',
      },
      {
        q: 'The gap between two neurons is called:',
        options: ['Node of Ranvier', 'Synapse', 'Dendrite', 'Myelin sheath'],
        answer: 'Synapse',
        expl: 'A synapse is the junction between two neurons where electrical signals are converted to chemical signals (neurotransmitters) to cross the gap.',
      },
      {
        q: 'Which hormone is called the "fight or flight" hormone?',
        options: ['Insulin', 'Adrenaline', 'Thyroxine', 'Testosterone'],
        answer: 'Adrenaline',
        expl: 'Adrenaline (epinephrine) is released by the adrenal glands in response to stress or danger, increasing heart rate and preparing the body for action.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Reflex actions are involuntary and rapid. Reason: Reflex actions involve the brain for quick decision-making.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'A is true but R is false',
        expl: 'Reflex actions are involuntary and rapid, but they do NOT involve the brain. They pass through the spinal cord via the reflex arc, which makes them faster than voluntary responses.',
      },
    ],
    'Case Study': [
      {
        q: 'A person touches a hot object and withdraws their hand immediately without thinking.\n\n(a) What is this action called?\n(b) Trace the pathway of the impulse.\n(c) Why is this faster than a normal voluntary response?',
        answer: '(a) Reflex action. (b) Receptor (skin) → Sensory neuron → Spinal cord → Motor neuron → Effector (muscle). This pathway is the reflex arc. (c) The impulse does not travel to the brain first — it goes through the spinal cord directly, saving time.',
        expl: 'The reflex arc bypasses the brain for speed. The brain is informed afterwards, which is why you feel pain after pulling your hand away.',
      },
    ],
    Numerical: [
      {
        q: 'A nerve impulse travels at 120 m/s. How long does it take to travel from the foot to the brain (distance ~1.8 m)?',
        answer: '0.015 seconds (15 ms)',
        expl: 'Time = Distance/Speed = 1.8/120 = 0.015 s = 15 milliseconds.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is tropism? Name the types of tropism in plants.',
        answer: 'Tropism is the directional growth movement of a plant part in response to an external stimulus. Types: Phototropism (light), Geotropism (gravity), Hydrotropism (water), Chemotropism (chemicals).',
        expl: 'Growth towards the stimulus is positive tropism; growth away is negative tropism. Example: roots show positive geotropism, stems show negative geotropism.',
      },
      {
        q: 'Why is the use of iodised salt advised?',
        answer: 'Iodine is essential for the thyroid gland to produce thyroxine hormone. Lack of iodine causes goitre (enlarged thyroid). Iodised salt prevents iodine deficiency.',
        expl: 'Thyroxine regulates metabolism. Without sufficient iodine, the thyroid enlarges trying to produce more hormone, causing goitre.',
      },
    ],
  },

  'reproduction': {
    MCQ: [
      {
        q: 'Which of the following is a method of asexual reproduction?',
        options: ['Pollination', 'Binary fission in Amoeba', 'Fertilisation', 'Seed formation'],
        answer: 'Binary fission in Amoeba',
        expl: 'Binary fission is asexual reproduction where a single parent cell divides into two identical daughter cells. Amoeba and bacteria reproduce this way.',
      },
      {
        q: 'The male reproductive part of a flower is:',
        options: ['Pistil', 'Stamen', 'Petal', 'Sepal'],
        answer: 'Stamen',
        expl: 'The stamen is the male reproductive part, consisting of the anther (produces pollen) and filament. The pistil is the female part.',
      },
      {
        q: 'Where does fertilisation occur in human females?',
        options: ['Uterus', 'Ovary', 'Fallopian tube (oviduct)', 'Cervix'],
        answer: 'Fallopian tube (oviduct)',
        expl: 'Fertilisation occurs in the fallopian tube where the sperm meets the ovum. The fertilised egg (zygote) then implants in the uterus.',
      },
      {
        q: 'Which contraceptive method prevents the meeting of sperm and egg?',
        options: ['Condom', 'Oral pills', 'IUD', 'Surgical method'],
        answer: 'Condom',
        expl: 'Condoms act as a barrier, preventing sperm from entering the uterus. They also protect against sexually transmitted infections (STIs).',
      },
      {
        q: 'The process of shedding of the uterine lining (endometrium) is called:',
        options: ['Ovulation', 'Menstruation', 'Fertilisation', 'Implantation'],
        answer: 'Menstruation',
        expl: 'If fertilisation does not occur, the thickened endometrium is shed along with blood — this is menstruation, lasting 3-5 days.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Variations are beneficial for species survival. Reason: Variations help organisms adapt to changing environments.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Sexual reproduction creates variations through DNA recombination. These variations allow some individuals to survive environmental changes, ensuring species survival.',
      },
    ],
    'Case Study': [
      {
        q: 'A gardener wants to grow a new plant with the exact same traits as a desirable mango tree.\n\n(a) Which reproduction method should be used and why?\n(b) Name two artificial propagation methods.\n(c) What is the disadvantage of this method?',
        answer: '(a) Vegetative (asexual) propagation, because it produces genetically identical offspring (clones). (b) Cutting, grafting, layering, or tissue culture. (c) No variation — all plants are genetically identical, so if one is susceptible to a disease, all could die.',
        expl: 'Asexual propagation preserves desirable traits but lacks genetic diversity. Seeds (sexual reproduction) create variation but may not preserve traits.',
      },
    ],
    Numerical: [
      {
        q: 'If a bacterium divides every 30 minutes, how many bacteria will be produced from a single bacterium in 3 hours?',
        answer: '64 bacteria',
        expl: 'In 3 hours = 6 divisions (180/30). Number = 2⁶ = 64 bacteria.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is puberty? Mention two changes that occur during puberty in males.',
        answer: 'Puberty is the stage when a child\'s body matures into an adult capable of reproduction. Changes in males: growth of facial and body hair, deepening of voice, development of reproductive organs.',
        expl: 'Puberty is triggered by hormones (testosterone in males, oestrogen in females). It typically occurs between ages 10-14 in boys and 8-13 in girls.',
      },
      {
        q: 'Why is DNA copying important in reproduction?',
        answer: 'DNA copying ensures that the offspring inherits traits from the parent. It creates basic body design but some variations arise due to small errors, which are important for evolution and adaptation.',
        expl: 'Without DNA copying, traits would not be passed on. The slight variations during copying are the raw material for natural selection.',
      },
    ],
  },

  'heredity-evolution': {
    MCQ: [
      {
        q: 'In Mendel\'s experiments, the F₂ ratio for a monohybrid cross is:',
        options: ['1:1', '3:1', '1:2:1', '9:3:3:1'],
        answer: '3:1',
        expl: 'In a monohybrid cross (Tt × Tt), the F₂ generation shows a phenotypic ratio of 3 dominant : 1 recessive. Genotypic ratio is 1:2:1.',
      },
      {
        q: 'The number of chromosomes in a human gamete is:',
        options: ['46', '23', '44', '22'],
        answer: '23',
        expl: 'Gametes (sperm/egg) are haploid with 23 chromosomes. Somatic cells have 46 (diploid) — 23 pairs.',
      },
      {
        q: 'Which of the following is an example of homologous organs?',
        options: ['Wings of butterfly and bird', 'Wings of bat and bird', 'Forelimbs of human and frog', 'Fins of fish and wings of bird'],
        answer: 'Forelimbs of human and frog',
        expl: 'Homologous organs have the same basic structure but different functions, indicating common ancestry. Forelimbs of humans, frogs, lizards, and birds have the same bone structure.',
      },
      {
        q: 'Who proposed the theory of evolution by natural selection?',
        options: ['Mendel', 'Lamarck', 'Charles Darwin', 'Hugo de Vries'],
        answer: 'Charles Darwin',
        expl: 'Charles Darwin proposed the theory of evolution by natural selection in his book "On the Origin of Species" (1859). He observed variations and survival of the fittest.',
      },
      {
        q: 'The remnants of ancient organisms preserved in rocks are called:',
        options: ['Fossils', 'Mutations', 'Homologues', 'Analogues'],
        answer: 'Fossils',
        expl: 'Fossils are preserved remains or impressions of ancient organisms. They provide evidence of evolution and help determine the age of organisms.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Acquired traits are not inherited. Reason: Acquired traits change the somatic cells, not the germ cells (DNA).',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Only changes in germ cell DNA (reproductive cells) are inherited. Changes in somatic (body) cells, like muscle growth from exercise, are lost when the organism dies.',
      },
    ],
    'Case Study': [
      {
        q: 'In a pea plant, a tall plant (TT) is crossed with a short plant (tt).\n\n(a) What will be the genotype and phenotype of F₁ generation?\n(b) If F₁ plants are self-pollinated, what is the F₂ phenotypic ratio?\n(c) What is this ratio called?',
        answer: '(a) Genotype: Tt (all heterozygous); Phenotype: All tall (T is dominant). (b) F₂ ratio: 3 tall : 1 short. (c) Monohybrid ratio.',
        expl: 'TT × tt → all Tt (tall). Tt × Tt → TT, Tt, Tt, tt = 3 tall : 1 short. This is Mendel\'s monohybrid cross demonstrating dominance.',
      },
    ],
    Numerical: [
      {
        q: 'In a dihybrid cross (RrYy × RrYy), how many out of 16 offspring are expected to have the genotype RrYy?',
        answer: '4 out of 16 (¼)',
        expl: 'In a dihybrid cross, the genotypic ratio is 1:2:1:2:4:2:1:2:1. The heterozygous for both traits (RrYy) is 4/16 = ¼ = 25%.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is speciation? State two factors that can lead to speciation.',
        answer: 'Speciation is the formation of a new species from an existing one. Factors: geographical isolation, genetic variation (mutations), natural selection, and reproductive isolation.',
        expl: 'When populations of a species are separated (e.g., by a river or mountain), they evolve differently over time. Eventually they cannot interbreed, forming new species.',
      },
      {
        q: 'What are homologous and analogous organs? Give one example of each.',
        answer: 'Homologous organs: same structure, different function, common ancestor (e.g., forelimbs of human and frog). Analogous organs: different structure, same function, no common ancestor (e.g., wings of butterfly and bird).',
        expl: 'Homologous organs show divergent evolution (common ancestry). Analogous organs show convergent evolution (adaptation to similar environments).',
      },
    ],
  },

  // ========================== PHYSICS ==========================
  'light-reflection-refraction': {
    MCQ: [
      {
        q: 'What type of mirror is used as a rear-view mirror in vehicles?',
        options: ['Concave', 'Convex', 'Plane', 'Cylindrical'],
        answer: 'Convex',
        expl: 'Convex mirrors provide a wider field of view and produce erect, diminished images, making them ideal for rear-view mirrors.',
      },
      {
        q: 'The focal length of a convex lens is 20 cm. An object is placed at 30 cm. The image formed is:',
        options: ['Real, inverted, magnified', 'Real, inverted, diminished', 'Virtual, erect, magnified', 'Virtual, erect, diminished'],
        answer: 'Real, inverted, magnified',
        expl: 'When the object is between F and 2F of a convex lens, the image is real, inverted, and magnified.',
      },
      {
        q: 'The power of a lens of focal length 50 cm is:',
        options: ['+2 D', '+0.5 D', '-2 D', '+5 D'],
        answer: '+2 D',
        expl: 'Power P = 1/f (in metres) = 1/0.5 = +2 D. Positive power means convex lens (converging).',
      },
      {
        q: 'A concave mirror always forms an erect, virtual, and magnified image when the object is placed:',
        options: ['At infinity', 'Between F and 2F', 'Between F and pole', 'At the centre of curvature'],
        answer: 'Between F and pole',
        expl: 'When the object is between the focus (F) and the pole (P) of a concave mirror, the image is virtual, erect, and magnified. This is used in shaving mirrors.',
      },
      {
        q: 'The refractive index of water is 1.33. The speed of light in water is: (c = 3×10⁸ m/s)',
        options: ['3×10⁸ m/s', '2.25×10⁸ m/s', '4×10⁸ m/s', '1.5×10⁸ m/s'],
        answer: '2.25×10⁸ m/s',
        expl: 'n = c/v, so v = c/n = 3×10⁸/1.33 ≈ 2.25×10⁸ m/s. Light slows down in denser media.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: A convex mirror always forms a virtual image. Reason: The focal point of a convex mirror is behind the mirror.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Since the focus is behind a convex mirror, reflected rays always diverge. The image is always virtual, erect, and diminished regardless of object position.',
      },
    ],
    'Case Study': [
      {
        q: 'A dentist uses a curved mirror to examine a patient\'s teeth. The mirror produces an erect, magnified image when placed close to the teeth.\n\n(a) What type of mirror is this?\n(b) Where must the object (teeth) be placed for this image?\n(c) Draw a ray diagram showing this.',
        answer: '(a) Concave mirror. (b) Between the pole and the focus (within the focal length). (c) Two rays from the object: one parallel to the axis reflects through F; one through C reflects back. The reflected rays diverge, and their extensions meet behind the mirror to form a virtual, erect, magnified image.',
        expl: 'This is the same principle used in shaving mirrors. The concave mirror creates a magnified virtual image when the object is within the focal length.',
      },
    ],
    Numerical: [
      {
        q: 'An object of height 4 cm is placed at 15 cm from a concave mirror of focal length 10 cm. Find the image distance and magnification.',
        answer: 'Using 1/v + 1/u = 1/f: 1/v = 1/(-10) - 1/(-15) = -1/10 + 1/15 = -1/30. So v = -30 cm. Magnification m = -v/u = -(-30)/(-15) = -2. Image is real, inverted, and magnified 2×.',
        expl: 'Mirror formula: 1/v + 1/u = 1/f. Sign convention: distances measured against incident light are negative.',
      },
      {
        q: 'An object is placed 30 cm from a convex lens of focal length 15 cm. Find the position and nature of the image.',
        answer: '1/v = 1/f - 1/u = 1/15 - 1/(-30) = 1/15 + 1/30 = 3/30 = 1/10. So v = 10 cm. Image is real, inverted, and diminished (m = -v/u = -10/(-30) = -1/3).',
        expl: 'Lens formula: 1/v - 1/u = 1/f. Positive v means a real image forms on the opposite side of the lens.',
      },
    ],
    'Short Answer': [
      {
        q: 'State the laws of reflection of light.',
        answer: '1. The angle of incidence equals the angle of reflection (i = r). 2. The incident ray, reflected ray, and the normal at the point of incidence all lie in the same plane.',
        expl: 'These laws hold for all types of mirrors — plane, concave, and convex — and for all surfaces.',
      },
      {
        q: 'What is the relationship between the radius of curvature (R) and focal length (f) of a spherical mirror?',
        answer: 'R = 2f, or f = R/2. The focal length is half the radius of curvature.',
        expl: 'For a spherical mirror, the focus is the midpoint between the pole and the centre of curvature, so f = R/2.',
      },
    ],
  },

  'human-eye': {
    MCQ: [
      {
        q: 'The ability of the eye to focus on both near and distant objects is called:',
        options: ['Accommodation', 'Adaptation', 'Magnification', 'Refraction'],
        answer: 'Accommodation',
        expl: 'Accommodation is the eye\'s ability to change its focal length using ciliary muscles to focus on objects at different distances.',
      },
      {
        q: 'Which defect of the eye is corrected using a convex lens?',
        options: ['Myopia (short-sightedness)', 'Hypermetropia (long-sightedness)', 'Presbyopia', 'Cataract'],
        answer: 'Hypermetropia (long-sightedness)',
        expl: 'In hypermetropia, the image forms behind the retina. A convex lens (converging) brings the image forward onto the retina.',
      },
      {
        q: 'The blue colour of the sky is due to:',
        options: ['Reflection of blue light', 'Scattering of light', 'Refraction of light', 'Absorption of light'],
        answer: 'Scattering of light',
        expl: 'Air molecules scatter shorter wavelengths (blue/violet) more than longer ones (Rayleigh scattering). Our eyes are more sensitive to blue, so the sky appears blue.',
      },
      {
        q: 'The Tyndall effect is observed when:',
        options: ['Light passes through a vacuum', 'Light is scattered by particles in a colloid or suspension', 'Light is completely absorbed', 'Light is reflected by a mirror'],
        answer: 'Light is scattered by particles in a colloid or suspension',
        expl: 'The Tyndall effect is the scattering of a beam of light by particles in a colloid or fine suspension, making the beam visible.',
      },
      {
        q: 'Which part of the human eye controls the amount of light entering it?',
        options: ['Cornea', 'Lens', 'Iris (pupil)', 'Retina'],
        answer: 'Iris (pupil)',
        expl: 'The iris controls the size of the pupil. In bright light, the pupil constricts; in dim light, it dilates to allow more light.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: The human eye can change its focal length. Reason: The ciliary muscles adjust the curvature of the eye lens.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'The ciliary muscles contract or relax to change the lens shape, enabling the eye to focus on objects at different distances (accommodation).',
      },
    ],
    'Case Study': [
      {
        q: 'A student cannot see the blackboard clearly from the back row but can read a book held close to their face.\n\n(a) What eye defect does the student have?\n(b) What type of lens is used to correct it?\n(c) Draw a ray diagram showing the defect and its correction.',
        answer: '(a) Myopia (short-sightedness). (b) A concave lens (diverging) is used. (c) In myopia, the image forms in front of the retina. A concave lens diverges the rays so they focus on the retina.',
        expl: 'Myopia is caused by an elongated eyeball or excessive curvature of the lens. The concave lens adds divergence so the image moves back onto the retina.',
      },
    ],
    Numerical: [
      {
        q: 'A person with myopia cannot see objects beyond 80 cm clearly. What focal length and power of lens is needed to correct this?',
        answer: 'f = -80 cm (concave lens). Power P = 1/f = 1/(-0.8) = -1.25 D.',
        expl: 'The far point is 80 cm. A concave lens of focal length -80 cm creates a virtual image of a distant object at 80 cm, which the eye can focus.',
      },
    ],
    'Short Answer': [
      {
        q: 'Why does the sky appear blue on a clear day?',
        answer: 'Air molecules in the atmosphere scatter sunlight. Shorter wavelengths (blue and violet) are scattered more than longer wavelengths (Rayleigh scattering). Since our eyes are more sensitive to blue than violet, the sky appears blue.',
        expl: 'Rayleigh scattering intensity is inversely proportional to the fourth power of wavelength (1/λ⁴). Blue (shorter) is scattered ~5× more than red.',
      },
      {
        q: 'What is the Tyndall effect? Give one example.',
        answer: 'The Tyndall effect is the scattering of light by particles in a colloid or fine suspension, making the path of light visible. Example: A beam of sunlight passing through a dusty room becomes visible as the dust particles scatter the light.',
        expl: 'The particles must be large enough to scatter light but small enough to remain suspended. Colloids and suspensions show this; true solutions do not.',
      },
    ],
  },

  'electricity': {
    MCQ: [
      {
        q: 'The SI unit of electric resistance is:',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        answer: 'Ohm',
        expl: 'Resistance is measured in Ohms (Ω), named after Georg Simon Ohm who formulated Ohm\'s law.',
      },
      {
        q: 'In a series circuit, the current is:',
        options: ['Different at different points', 'Same at all points', 'Zero at some points', 'Always maximum'],
        answer: 'Same at all points',
        expl: 'In a series circuit, the same current flows through all components because there is only one path for the current.',
      },
      {
        q: 'What happens to the resistance of a wire if its length is doubled (keeping area constant)?',
        options: ['Halved', 'Doubled', 'Remains same', 'Becomes four times'],
        answer: 'Doubled',
        expl: 'R = ρL/A. If L is doubled and A is constant, R also doubles. Resistance is directly proportional to length.',
      },
      {
        q: 'The commercial unit of electrical energy is:',
        options: ['Joule', 'Watt', 'Kilowatt-hour (kWh)', 'Volt-ampere'],
        answer: 'Kilowatt-hour (kWh)',
        expl: '1 kWh = 1000 W × 3600 s = 3.6×10⁶ J. Electricity bills are measured in units (1 unit = 1 kWh).',
      },
      {
        q: 'Which of the following does NOT obey Ohm\'s law?',
        options: ['Copper wire', 'Resistor', 'LED (light-emitting diode)', 'Nichrome wire'],
        answer: 'LED (light-emitting diode)',
        expl: 'Ohmic conductors (metals, resistors) have a linear V-I graph. LEDs and diodes are non-ohmic — their V-I graph is not a straight line.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Resistors in parallel have less total resistance than the smallest individual resistor. Reason: Parallel resistors provide multiple paths for current.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'In parallel, 1/Req = 1/R₁ + 1/R₂ + ..., which always gives Req less than any individual R. More paths = less overall resistance.',
      },
    ],
    'Case Study': [
      {
        q: 'A circuit has three resistors of 2Ω, 3Ω, and 6Ω connected in parallel across a 6V battery.\n\n(a) Calculate the equivalent resistance.\n(b) Find the total current drawn from the battery.\n(c) What is the current through the 2Ω resistor?',
        answer: '(a) 1/Req = 1/2 + 1/3 + 1/6 = 1, so Req = 1Ω. (b) I = V/Req = 6/1 = 6A. (c) I₂ = V/R = 6/2 = 3A.',
        expl: 'For parallel resistors, reciprocals add up. Each resistor gets the full voltage but carries current inversely proportional to its resistance.',
      },
    ],
    Numerical: [
      {
        q: 'A current of 0.5 A flows through a resistor of 20 Ω. Calculate the voltage across it and the power dissipated.',
        answer: 'V = IR = 0.5 × 20 = 10 V. P = VI = 10 × 0.5 = 5 W.',
        expl: 'Using Ohm\'s Law (V = IR) and the power formula (P = VI = I²R), we calculate the voltage and power dissipated.',
      },
      {
        q: 'A 100 W bulb operates at 220 V. Calculate the resistance of the bulb and the current drawn.',
        answer: 'P = V²/R, so R = V²/P = 220²/100 = 48400/100 = 484 Ω. I = P/V = 100/220 = 0.45 A.',
        expl: 'Power formulas: P = VI = V²/R = I²R. We use V²/R to find resistance and P/V to find current.',
      },
    ],
    'Short Answer': [
      {
        q: 'State Ohm\'s law and write its mathematical expression.',
        answer: 'Ohm\'s law states that the current through a conductor is directly proportional to the voltage across it, provided temperature and other physical conditions remain constant. V ∝ I, or V = IR.',
        expl: 'Ohm\'s law is fundamental to circuit analysis. R is the constant of proportionality called resistance.',
      },
      {
        q: 'Why are coils of electric toasters and electric irons made of an alloy rather than a pure metal?',
        answer: 'Alloys have higher resistance than pure metals and do not oxidise (burn) readily at high temperatures. This makes them suitable for heating elements. Nichrome (nickel + chromium) is commonly used.',
        expl: 'Pure metals like copper have low resistance and would not produce enough heat. Alloys also resist oxidation at high temperatures, increasing the lifespan of the appliance.',
      },
    ],
  },

  'magnetic-effects': {
    MCQ: [
      {
        q: 'The magnetic field lines around a straight current-carrying conductor are:',
        options: ['Straight lines', 'Concentric circles', 'Elliptical', 'Spiral'],
        answer: 'Concentric circles',
        expl: 'Magnetic field lines around a straight conductor form concentric circles in a plane perpendicular to the wire. Direction is given by the right-hand thumb rule.',
      },
      {
        q: 'Which rule is used to find the direction of force on a current-carrying conductor in a magnetic field?',
        options: ['Right-hand thumb rule', 'Fleming\'s left-hand rule', 'Fleming\'s right-hand rule', 'Maxwell\'s rule'],
        answer: 'Fleming\'s left-hand rule',
        expl: 'Fleming\'s left-hand rule: stretch thumb, forefinger, and middle finger mutually perpendicular. Forefinger = field, middle finger = current, thumb = force (motion). Used for motors.',
      },
      {
        q: 'An electric motor converts:',
        options: ['Electrical energy to mechanical energy', 'Mechanical energy to electrical energy', 'Electrical energy to light', 'Heat energy to electrical energy'],
        answer: 'Electrical energy to mechanical energy',
        expl: 'A motor uses the force on a current-carrying coil in a magnetic field to rotate, converting electrical energy to mechanical (rotational) energy.',
      },
      {
        q: 'The phenomenon of producing an electric current by changing the magnetic field is called:',
        options: ['Electromagnetic induction', 'Electrolysis', 'Magnetic levitation', 'Electroplating'],
        answer: 'Electromagnetic induction',
        expl: 'Discovered by Michael Faraday, electromagnetic induction is the production of EMF (and current) when magnetic flux through a coil changes. This is the principle of generators.',
      },
      {
        q: 'In domestic electric circuits, the live wire is usually coloured:',
        options: ['Red', 'Black', 'Green', 'Blue'],
        answer: 'Red',
        expl: 'Live wire = red/brown (high voltage, 220V). Neutral = black/blue (0V). Earth = green/yellow (safety, connects to ground).',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: A current-carrying conductor experiences a force in a magnetic field. Reason: The magnetic field exerts a force on the moving charges (electrons) in the conductor.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'The magnetic field acts on the moving electrons in the conductor, creating a force perpendicular to both the current and the field. This is the motor effect.',
      },
    ],
    'Case Study': [
      {
        q: 'A student moves a bar magnet towards a coil connected to a galvanometer and observes a deflection.\n\n(a) What is this phenomenon called?\n(b) What happens if the magnet is moved away?\n(c) What happens if the magnet is held stationary inside the coil?',
        answer: '(a) Electromagnetic induction. (b) The galvanometer deflects in the opposite direction. (c) No deflection — current is induced only when there is relative motion (changing magnetic flux).',
        expl: 'Faraday\'s law: induced EMF is proportional to the rate of change of magnetic flux. No change in flux = no induced current. Direction of motion reverses the current direction.',
      },
    ],
    Numerical: [
      {
        q: 'A coil of 100 turns has a magnetic flux of 5 mWb. If the flux changes to 1 mWb in 0.2 s, what is the induced EMF?',
        answer: 'EMF = -N × ΔΦ/Δt = -100 × (1-5)×10⁻³ / 0.2 = -100 × (-0.02) = 2 V.',
        expl: 'Faraday\'s law: EMF = -N(dΦ/dt). The negative sign (Lenz\'s law) indicates the induced current opposes the change in flux.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is the function of an earth wire? Why is it necessary?',
        answer: 'The earth wire connects the metal body of an appliance to the ground. If a fault causes the body to become live, current flows to earth through the low-resistance wire, protecting the user from electric shock.',
        expl: 'Without an earth wire, a fault could make the metal body live, causing a fatal shock when touched. The earth wire provides a safe path for fault current.',
      },
      {
        q: 'State Fleming\'s right-hand rule. Where is it used?',
        answer: 'Stretch thumb, forefinger, and middle finger of the right hand mutually perpendicular. Forefinger = magnetic field, thumb = motion of conductor, middle finger = induced current. It is used to find the direction of induced current in generators.',
        expl: 'Fleming\'s right-hand rule applies to generators (electromagnetic induction). The left-hand rule applies to motors (force on a current-carrying conductor).',
      },
    ],
  },

  'sources-of-energy': {
    MCQ: [
      {
        q: 'Which of the following is a renewable source of energy?',
        options: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'],
        answer: 'Solar energy',
        expl: 'Solar energy is renewable because it comes from the sun, which is an inexhaustible source. Coal, petroleum, and natural gas are non-renewable fossil fuels.',
      },
      {
        q: 'Which of these is NOT a greenhouse gas?',
        options: ['Carbon dioxide', 'Methane', 'Oxygen', 'Water vapour'],
        answer: 'Oxygen',
        expl: 'Oxygen is not a greenhouse gas. CO₂, methane, and water vapour trap heat in the atmosphere, contributing to the greenhouse effect.',
      },
      {
        q: 'The main component of biogas is:',
        options: ['Methane (CH₄)', 'Carbon dioxide', 'Hydrogen', 'Oxygen'],
        answer: 'Methane (CH₄)',
        expl: 'Biogas contains 60-70% methane, 30-40% CO₂, and traces of H₂S. Methane is the combustible component that makes biogas a fuel.',
      },
      {
        q: 'In a nuclear fission reaction, the fuel commonly used is:',
        options: ['Coal', 'Uranium-235', 'Plutonium-239', 'Deuterium'],
        answer: 'Uranium-235',
        expl: 'Uranium-235 is the primary fuel in nuclear fission reactors. When a U-235 nucleus absorbs a neutron, it splits, releasing enormous energy and more neutrons (chain reaction).',
      },
      {
        q: 'Which energy source causes the least environmental pollution?',
        options: ['Coal', 'Petroleum', 'Solar energy', 'Nuclear energy'],
        answer: 'Solar energy',
        expl: 'Solar energy is clean — it produces no air pollution, greenhouse gases, or radioactive waste. Coal and petroleum produce CO₂; nuclear energy produces radioactive waste.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Fossil fuels are non-renewable. Reason: Fossil fuels take millions of years to form from dead organisms.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Fossil fuels (coal, petroleum, natural gas) form from dead plants and animals over millions of years under high pressure and temperature. They cannot be replenished on a human timescale.',
      },
    ],
    'Case Study': [
      {
        q: 'A village installs a biogas plant using cow dung and agricultural waste.\n\n(a) What is the main gas produced?\n(b) Write the main advantage of biogas over wood.\n(c) What by-product is useful for the farmer?',
        answer: '(a) Methane (CH₄), 60-70% of biogas. (b) Biogas burns cleanly without smoke, reducing air pollution and deforestation. (c) The spent slurry is an excellent organic manure (fertiliser).',
        expl: 'Anaerobic bacteria decompose dung in the absence of air, producing methane. The slurry left after gas production is rich in nitrogen and phosphorus, making it a valuable fertiliser.',
      },
    ],
    Numerical: [
      {
        q: 'A solar panel produces 200 W of power. If it operates for 5 hours per day, how much energy does it produce in one day (in kWh)?',
        answer: 'Energy = Power × Time = 200 W × 5 h = 1000 Wh = 1 kWh (1 unit).',
        expl: 'Energy in kWh = Power (kW) × Time (h) = 0.2 kW × 5 h = 1 kWh.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is the greenhouse effect? Name two greenhouse gases.',
        answer: 'The greenhouse effect is the trapping of heat by certain gases in the atmosphere, similar to how a greenhouse retains heat. Greenhouse gases: carbon dioxide (CO₂) and methane (CH₄).',
        expl: 'These gases allow sunlight to pass through but absorb the infrared radiation (heat) reflected from Earth\'s surface, warming the atmosphere.',
      },
      {
        q: 'Why is nuclear energy considered a cleaner alternative to fossil fuels? What is its main disadvantage?',
        answer: 'Nuclear energy does not produce CO₂ or air pollutants, making it cleaner than fossil fuels. Disadvantage: it produces radioactive waste that is difficult to dispose of safely, and there is a risk of nuclear accidents (e.g., Chernobyl, Fukushima).',
        expl: 'A small amount of uranium produces enormous energy (1 kg U-235 ≈ 20,000 kg coal). But the spent fuel remains radioactive for thousands of years.',
      },
    ],
  },

  // ========================== ENVIRONMENT ==========================
  'our-environment': {
    MCQ: [
      {
        q: 'In a food chain, green plants are called:',
        options: ['Producers', 'Consumers', 'Decomposers', 'Predators'],
        answer: 'Producers',
        expl: 'Green plants are producers (autotrophs) because they make their own food through photosynthesis. They form the base of every food chain.',
      },
      {
        q: 'Which of the following is a biodegradable waste?',
        options: ['Plastic', 'Glass', 'Vegetable peels', 'Aluminium can'],
        answer: 'Vegetable peels',
        expl: 'Biodegradable wastes can be decomposed by microorganisms. Vegetable peels, paper, and cloth are biodegradable. Plastic, glass, and metal are non-biodegradable.',
      },
      {
        q: 'The ozone layer is found in which layer of the atmosphere?',
        options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
        answer: 'Stratosphere',
        expl: 'The ozone layer is in the stratosphere, about 15-35 km above Earth. It absorbs harmful UV radiation from the sun.',
      },
      {
        q: 'Which of the following causes ozone depletion?',
        options: ['CO₂', 'CFCs (chlorofluorocarbons)', 'Methane', 'Oxygen'],
        answer: 'CFCs (chlorofluorocarbons)',
        expl: 'CFCs release chlorine atoms in the stratosphere that break down ozone (O₃) molecules. The Montreal Protocol (1987) phased out CFC production.',
      },
      {
        q: 'In an ecosystem, energy flows from:',
        options: ['Consumer to producer', 'Producer to consumer', 'Decomposer to producer', 'Consumer to decomposer only'],
        answer: 'Producer to consumer',
        expl: 'Energy flows from producers (plants) → primary consumers (herbivores) → secondary consumers (carnivores) → decomposers. Only about 10% of energy transfers to each level.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Non-biodegradable substances cause environmental pollution. Reason: Non-biodegradable substances cannot be decomposed by microorganisms and persist in the environment.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Plastics, metals, and glass do not decompose naturally. They accumulate in the environment, causing soil, water, and air pollution, and harming wildlife.',
      },
    ],
    'Case Study': [
      {
        q: 'A lake ecosystem has the following food chain: Algae → Small fish → Large fish → Kingfisher.\n\n(a) Which organism is the producer?\n(b) If algae contain 10,000 J of energy, how much energy is available to the kingfisher?\n(c) What is this energy transfer called?',
        answer: '(a) Algae (producer). (b) 10 J (only 10% transfers at each level: 10000 → 1000 → 100 → 10 J). (c) Ten percent law (Lindeman\'s law).',
        expl: 'According to the 10% law, only 10% of energy at one trophic level is available to the next. The rest is lost as heat in metabolic processes.',
      },
    ],
    Numerical: [
      {
        q: 'In a food chain, grass has 20,000 J of energy. How much energy is available to the secondary consumer (snake) if the chain is: Grass → Grasshopper → Snake?',
        answer: '200 J',
        expl: 'Grass (20000 J) → Grasshopper (10% = 2000 J) → Snake (10% of 2000 = 200 J). Only 10% transfers at each trophic level.',
      },
    ],
    'Short Answer': [
      {
        q: 'What is the function of the ozone layer in the stratosphere?',
        answer: 'The ozone layer absorbs harmful ultraviolet (UV) radiation from the sun, protecting living organisms from DNA damage, skin cancer, and other health issues.',
        expl: 'Ozone (O₃) absorbs UV-B and UV-C radiation. CFCs deplete the ozone layer, which is why they are banned under the Montreal Protocol.',
      },
      {
        q: 'Differentiate between biodegradable and non-biodegradable waste with examples.',
        answer: 'Biodegradable waste can be decomposed by microorganisms (e.g., vegetable peels, paper, cloth). Non-biodegradable waste cannot be decomposed and persists in the environment (e.g., plastic, glass, metal).',
        expl: 'Biodegradable waste can be converted to compost. Non-biodegradable waste should be recycled to prevent environmental pollution.',
      },
    ],
  },

  'sustainable-management': {
    MCQ: [
      {
        q: 'The "3 Rs" of waste management stand for:',
        options: ['Reduce, Reuse, Recycle', 'Refuse, Reduce, Reuse', 'Reduce, Refill, Recycle', 'Reuse, Refill, Recycle'],
        answer: 'Reduce, Reuse, Recycle',
        expl: 'Reduce (use less), Reuse (use again), Recycle (process waste into new products). These are the core principles of sustainable waste management.',
      },
      {
        q: 'Which of the following is a consequence of deforestation?',
        options: ['Increased rainfall', 'Soil erosion and loss of biodiversity', 'Decrease in CO₂', 'Increase in groundwater'],
        answer: 'Soil erosion and loss of biodiversity',
        expl: 'Trees bind soil with their roots. Without them, soil erodes, biodiversity decreases, and CO₂ levels rise (trees absorb CO₂).',
      },
      {
        q: 'The Ganga Action Plan was launched to:',
        options: ['Build dams on the Ganga', 'Clean the Ganga river and reduce pollution', 'Increase fishing in the Ganga', 'Divert the Ganga for irrigation'],
        answer: 'Clean the Ganga river and reduce pollution',
        expl: 'The Ganga Action Plan was launched in 1985 to reduce pollution in the Ganga by treating domestic and industrial waste before it enters the river.',
      },
      {
        q: 'Which of the following is the most sustainable source of water for agriculture?',
        options: ['Groundwater pumping', 'Rainwater harvesting', 'River diversion', 'Desalination'],
        answer: 'Rainwater harvesting',
        expl: 'Rainwater harvesting is sustainable because it recharges groundwater and does not deplete existing water sources. It is renewable and eco-friendly.',
      },
      {
        q: 'Why is coal considered a non-renewable resource?',
        options: ['It is found underground', 'It takes millions of years to form', 'It is expensive', 'It produces pollution'],
        answer: 'It takes millions of years to form',
        expl: 'Coal forms from dead plant matter over millions of years under high pressure. It cannot be replenished on a human timescale, making it non-renewable.',
      },
    ],
    'Assertion-Reason': [
      {
        q: 'Assertion: Water is a renewable resource. Reason: The water cycle continuously replenishes water sources through evaporation and precipitation.',
        options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the explanation', 'A is true but R is false', 'A is false but R is true'],
        answer: 'Both A and R are true and R is the correct explanation',
        expl: 'Water is renewable because the water cycle (evaporation → condensation → precipitation) continuously recycles it. However, overuse and pollution can deplete local supplies.',
      },
    ],
    'Case Study': [
      {
        q: 'A town is facing severe water shortage due to over-exploitation of groundwater.\n\n(a) Suggest two methods to recharge groundwater.\n(b) Why is rainwater harvesting important?\n(c) What is the role of forests in water conservation?',
        answer: '(a) Rainwater harvesting pits, recharge wells, and planting trees. (b) Rainwater harvesting captures and stores rainwater, recharging aquifers and reducing runoff. (c) Forests increase infiltration, reduce soil erosion, and maintain the water cycle through transpiration.',
        expl: 'Sustainable water management requires reducing consumption, recharging aquifers, and protecting natural water sources. Forests act as natural sponges, absorbing and slowly releasing water.',
      },
    ],
    Numerical: [
      {
        q: 'A household uses 300 litres of water per day. If they install a rainwater harvesting system that supplies 30% of their needs, how many litres per day do they save from the municipal supply?',
        answer: '90 litres per day',
        expl: '30% of 300 = 0.30 × 300 = 90 litres/day saved. Over a year, that is 32,850 litres saved.',
      },
    ],
    'Short Answer': [
      {
        q: 'Why is the sustainable management of natural resources important?',
        answer: 'Sustainable management ensures that resources are available for future generations. Over-exploitation depletes resources faster than they can regenerate, causing scarcity, environmental damage, and economic problems.',
        expl: 'Resources like water, forests, and fossil fuels are finite. Sustainable use balances current needs with long-term availability.',
      },
      {
        q: 'What is rainwater harvesting? Mention one advantage.',
        answer: 'Rainwater harvesting is the collection and storage of rainwater from rooftops or surfaces for reuse or groundwater recharge. Advantage: It reduces dependence on groundwater, recharges aquifers, and prevents urban flooding.',
        expl: 'Harvested rainwater can be used for irrigation, washing, and (after filtration) drinking. It also reduces soil erosion by slowing runoff.',
      },
    ],
  },
};

// ========================== DOUBT SOLVER ==========================

const doubtResponses: Record<string, string> = {
  electrolysis: 'Electrolysis is the process of breaking down a compound using electricity. You pass an electric current through a molten or dissolved ionic substance (called the electrolyte). The current causes ions to move: positive ions (cations) go to the negative electrode (cathode) and gain electrons (reduction), while negative ions (anions) go to the positive electrode (anode) and lose electrons (oxidation).\n\nExample: Electrolysis of water (H₂O) splits it into hydrogen gas at the cathode and oxygen gas at the anode:\n• Cathode: 2H⁺ + 2e⁻ → H₂\n• Anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻\n\nThis is used in electroplating, extracting metals like aluminium, and refining impure metals.',
  'carbon tetravalent': 'Carbon is tetravalent because it has 4 electrons in its outermost shell (electronic configuration 2,4). To achieve a stable noble gas configuration, carbon needs to either gain 4 electrons or lose 4 electrons — but both require too much energy.\n\nInstead, carbon shares its 4 valence electrons with other atoms, forming 4 covalent bonds. This ability to form 4 bonds makes carbon extremely versatile and the basis of all organic chemistry. It can bond with hydrogen, oxygen, nitrogen, halogens, and — crucially — other carbon atoms, forming chains, branches, and rings.',
  refraction: 'Refraction is the bending of light when it passes from one transparent medium to another with a different density (like from air into water). This happens because light travels at different speeds in different media — it slows down in denser media.\n\nSnell\'s Law: n₁ sin θ₁ = n₂ sin θ₂, where n is the refractive index and θ is the angle from the normal.\n\nKey rules:\n• Light bends towards the normal when entering a denser medium (air→glass)\n• Light bends away from the normal when entering a less dense medium (glass→air)\n• The frequency stays the same, but wavelength changes\n\nThis is why a straw looks "broken" in a glass of water and why lenses can focus light.',
  'acids and bases': 'Acids and bases are two important classes of chemical substances:\n\nAcids:\n• Turn blue litmus red\n• Have pH less than 7\n• Taste sour\n• Release H⁺ ions in water\n• Examples: HCl, H₂SO₄, CH₃COOH (vinegar)\n\nBases:\n• Turn red litmus blue\n• Have pH more than 7\n• Taste bitter and feel soapy\n• Release OH⁻ ions in water\n• Examples: NaOH, KOH, NH₄OH\n\nWhen an acid reacts with a base, they neutralise each other to form salt and water:\nAcid + Base → Salt + Water\nExample: HCl + NaOH → NaCl + H₂O\n\nThe pH scale (0-14) measures acidity or basicity. pH 7 is neutral (pure water).',
  'ohm\'s law': 'Ohm\'s Law states that the current flowing through a conductor is directly proportional to the voltage across its ends, provided the temperature and other physical conditions remain constant.\n\nMathematically: V ∝ I, which gives V = IR\n• V = Voltage (volts)\n• I = Current (amperes)\n• R = Resistance (ohms, Ω)\n\nThis means:\n• If you double the voltage, the current doubles\n• If you double the resistance, the current halves\n\nResistance depends on:\n1. Length of the wire (R ∝ length)\n2. Thickness/cross-sectional area (R ∝ 1/area)\n3. Material (resistivity)\n4. Temperature\n\nExample: If a 12V battery is connected across a 4Ω resistor, the current is I = V/R = 12/4 = 3A.',
  photosynthesis: 'Photosynthesis is the process by which green plants make their own food using sunlight. It happens in the chloroplasts, which contain the green pigment chlorophyll.\n\nWord equation:\nCarbon dioxide + Water → (Sunlight, Chlorophyll) → Glucose + Oxygen\n\nBalanced chemical equation:\n6CO₂ + 6H₂O → (light) → C₆H₁₂O₆ + 6O₂\n\nThe process has two stages:\n1. Light reaction: Chlorophyll absorbs sunlight and splits water into hydrogen and oxygen. ATP and NADPH are produced.\n2. Dark reaction (Calvin cycle): CO₂ is converted into glucose using the ATP and NADPH from the light reaction.\n\nImportance: Photosynthesis produces oxygen (which we breathe) and food (the base of all food chains). It also removes CO₂ from the atmosphere.',
};

const genericDoubtResponse = (question: string): string => {
  const lowerQ = question.toLowerCase();

  for (const chapter of chapters) {
    for (const topic of chapter.topics) {
      if (lowerQ.includes(topic.toLowerCase()) || topic.toLowerCase().includes(lowerQ)) {
        return `Great question about ${topic}!\n\n${topic} is an important concept in the chapter "${chapter.name}" (${chapter.subject}). Here's a simple explanation:\n\nIn Class 10 Science, ${topic} relates to the fundamental principles covered in your ${chapter.subject} syllabus. The key points to remember are:\n\n1. The basic definition and why it matters\n2. The formula or principle involved\n3. Real-life examples you can observe\n4. Common exam questions about this topic\n\nFor your board exam, focus on understanding the concept first, then practise the numerical/application questions. The PYQ trend shows this topic appears frequently with a weightage of about ${chapter.weightage} marks.\n\nWould you like me to explain any specific part in more detail or generate practice questions on this?`;
      }
    }
  }

  return `That's an interesting Science question! Let me explain it simply.\n\nBased on your question about "${question}", here's what you need to know for Class 10:\n\n1. **Core concept**: This topic is part of your CBSE Class 10 Science syllabus and appears in board examinations regularly.\n\n2. **Key points to remember**: Focus on the fundamental definition, the related formula or principle, and how it applies in real life.\n\n3. **Exam tip**: Board questions on this topic usually come as short answer or case-study questions worth 3-5 marks. Practise the previous year questions to understand the pattern.\n\n4. **Common mistakes**: Students often confuse the units or forget the sign conventions. Always double-check these in numerical problems.\n\nTry breaking the topic into smaller parts and understanding each one. You can also use the Practice feature to generate questions on this!`;
};

// ========================== QUESTION GENERATION ==========================

// Fisher-Yates shuffle — returns a new shuffled array without modifying the original
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Validation: ensure a chapter slug exists in the data layer
function validateChapterSlug(slug: string): void {
  const chapter = getChapterBySlug(slug);
  if (!chapter) {
    throw new Error(`Unknown chapter slug: "${slug}". No questions can be generated.`);
  }
}

// Get the subject of a chapter slug from the data layer
function getSubjectForChapter(slug: string): Subject {
  const chapter = getChapterBySlug(slug);
  if (!chapter) {
    throw new Error(`Unknown chapter slug: "${slug}"`);
  }
  return chapter.subject;
}

// Build a non-repeating pool of templates from a specific chapter's question bank.
// Only pulls from the given chapter slug — never from other chapters or subjects.
function buildChapterTemplatePool(
  slug: string,
  types: QuestionType[],
  count: number
): { type: QuestionType; template: QuestionTemplate }[] {
  const bank = chapterQuestionBank[slug];
  if (!bank) {
    throw new Error(`No question bank found for chapter slug: "${slug}". Questions cannot be generated.`);
  }

  // Collect all available templates for this chapter, grouped by type
  const availableByType: Record<string, { type: QuestionType; template: QuestionTemplate }[]> = {};
  for (const type of types) {
    const templates = bank[type];
    if (templates && templates.length > 0) {
      availableByType[type] = shuffle(templates).map((t) => ({ type, template: t }));
    }
  }

  const availableTypes = Object.keys(availableByType);
  if (availableTypes.length === 0) {
    throw new Error(`No question templates found for chapter slug: "${slug}".`);
  }

  const pool: { type: QuestionType; template: QuestionTemplate }[] = [];
  const indices: Record<string, number> = {};
  for (const type of availableTypes) {
    indices[type] = 0;
  }

  for (let i = 0; i < count; i++) {
    const typeName = availableTypes[i % availableTypes.length];
    const arr = availableByType[typeName];
    let idx = indices[typeName];

    if (idx >= arr.length) {
      // Reshuffle this type's templates for a new cycle
      const freshTemplates = bank[typeName as QuestionType]!;
      availableByType[typeName] = shuffle(freshTemplates).map((t) => ({ type: typeName as QuestionType, template: t }));
      idx = 0;
    }

    pool.push(availableByType[typeName][idx]);
    indices[typeName] = idx + 1;
  }

  return shuffle(pool);
}

// Generate practice questions for a specific chapter.
// The chapterSlug must match a slug from data.ts — questions are always from that chapter only.
export function generatePracticeQuestions(
  chapterSlug: string,
  count: number,
  _difficulty: string = 'Mixed'
): PracticeQuestion[] {
  validateChapterSlug(chapterSlug);

  const chapter = getChapterBySlug(chapterSlug)!;
  const types: PracticeQuestion['type'][] = ['MCQ', 'Assertion-Reason', 'Case Study', 'Numerical', 'Short Answer'];
  const pool = buildChapterTemplatePool(chapterSlug, types, count);
  const timestamp = Date.now();

  return pool.map((item, i) => ({
    id: `q-${i}-${timestamp}`,
    type: item.type,
    question: item.template.q,
    options: item.template.options,
    correctAnswer: item.template.answer,
    explanation: item.template.expl,
    chapter: chapter.name,
  }));
}

// Generate mock test questions from one or more chapter slugs.
// Each question is drawn from the specified chapters only — never from other subjects.
export function generateMockQuestions(
  chapterSlugs: string[],
  count: number,
  _difficulty: string = 'Mixed'
): MockQuestion[] {
  // Validate all chapter slugs and ensure they all belong to valid chapters
  for (const slug of chapterSlugs) {
    validateChapterSlug(slug);
  }

  const mockTypes: MockQuestion['type'][] = ['MCQ', 'Assertion-Reason', 'Numerical', 'Short Answer'];
  const timestamp = Date.now();

  // For each chapter, build a pool from its question bank
  const allPools: { type: MockQuestion['type']; template: QuestionTemplate; slug: string }[] = [];
  for (const slug of chapterSlugs) {
    const bank = chapterQuestionBank[slug];
    if (!bank) continue;

    for (const type of mockTypes) {
      const templates = bank[type];
      if (templates && templates.length > 0) {
        for (const t of templates) {
          allPools.push({ type, template: t, slug });
        }
      }
    }
  }

  if (allPools.length === 0) {
    throw new Error(`No question templates found for the selected chapters.`);
  }

  const shuffled = shuffle(allPools);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // If we need more questions than available, cycle through with reshuffling
  const result: MockQuestion[] = [];
  let cycleIdx = 0;
  while (result.length < count) {
    const item = selected[cycleIdx % selected.length];
    result.push({
      id: `mt-${result.length}-${timestamp}`,
      type: item.type,
      question: item.template.q,
      options: item.template.options,
      correctAnswer: item.template.answer,
      explanation: item.template.expl,
    });
    cycleIdx++;
  }

  return shuffle(result);
}

export function solveDoubt(question: string): string {
  const lowerQ = question.toLowerCase();

  for (const [key, response] of Object.entries(doubtResponses)) {
    if (lowerQ.includes(key)) {
      return response;
    }
  }

  return genericDoubtResponse(question);
}

export function predictBoardScore(actualScore: number, total: number): number {
  const percentage = (actualScore / total) * 100;
  const predicted = Math.round(percentage * 0.95 + Math.random() * 5 - 2.5);
  return Math.max(0, Math.min(100, predicted));
}
