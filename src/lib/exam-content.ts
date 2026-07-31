export interface ExamMeta {
  expectedMarks: { '1M': number; '2M': number; '3M': number; '5M': number };
  pyqFrequency: 'Very High' | 'High' | 'Medium' | 'Low';
  highPriorityTopics: { topic: string; priority: number; reason: string }[];
  boardKeywords: string[];
  importantTables: { title: string; headers: string[]; rows: string[][] }[];
}

export interface LastMinuteShot {
  rapidRevision: string[];
  formulaRevision: string[];
  importantDefinitions: string[];
  commonMistakes: string[];
  examTricks: string[];
  frequentlyConfused: { pair: string; difference: string }[];
  oneLookRevision: string[];
  doNotForget: string[];
  examChecklist: string[];
}

export const examContent: Record<string, { examMeta: ExamMeta; lastMinuteShot: LastMinuteShot }> = {
  'chemical-reactions': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Balancing chemical equations', priority: 5, reason: 'Asked almost every year in 1M or 2M format' },
        { topic: 'Types of reactions (combination, decomposition, displacement, double displacement, redox)', priority: 5, reason: 'Core concept — appears in MCQs and short answers' },
        { topic: 'Oxidation-reduction identification in given reactions', priority: 5, reason: 'Frequent 3M question — identify oxidised/reduced substances' },
        { topic: 'Corrosion and rancidity with prevention methods', priority: 4, reason: 'Common 3M question — real-life application' },
      ],
      boardKeywords: ['balanced equation', 'oxidation', 'reduction', 'redox', 'corrosion', 'rancidity', 'exothermic', 'endothermic', 'precipitation', 'displacement'],
      importantTables: [
        {
          title: 'Types of Chemical Reactions',
          headers: ['Type', 'Definition', 'Example'],
          rows: [
            ['Combination', 'Two or more reactants form one product', 'CaO + H₂O → Ca(OH)₂'],
            ['Decomposition', 'One reactant breaks into two or more products', 'CaCO₃ → CaO + CO₂'],
            ['Displacement', 'More reactive element displaces less reactive one', 'Fe + CuSO₄ → FeSO₄ + Cu'],
            ['Double Displacement', 'Exchange of ions between two compounds', 'AgNO₃ + NaCl → AgCl + NaNO₃'],
            ['Redox', 'Oxidation and reduction occur simultaneously', 'CuO + H₂ → Cu + H₂O'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        '5 reaction types: Combination, Decomposition, Displacement, Double Displacement, Redox',
        'Oxidation = gain of O / loss of electrons; Reduction = loss of O / gain of electrons',
        'OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons)',
        'Corrosion: Fe → Fe₂O₃·xH₂O (rust); Rancidity: oxidation of fats/oils',
        'Exothermic releases heat (respiration, combustion); Endothermic absorbs heat (photosynthesis, electrolysis)',
        'Always balance equations — start with the most complex compound',
      ],
      formulaRevision: [
        '4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O (rusting)',
        '2AgCl → 2Ag + Cl₂ (photodecomposition)',
        'Fe₂O₃ + 2Al → 2Fe + Al₂O₃ (thermite reaction)',
        'CaCO₃ → CaO + CO₂ (decomposition of limestone)',
      ],
      importantDefinitions: [
        'Oxidation: gain of oxygen or loss of electrons by a substance',
        'Reduction: loss of oxygen or gain of electrons by a substance',
      ],
      commonMistakes: [
        'Confusing oxidising agent with reducing agent — oxidising agent gets reduced, reducing agent gets oxidised',
        'Forgetting to balance equations — always count atoms on both sides',
      ],
      examTricks: [
        'Use OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons)',
        'For redox ID: substance gaining O is oxidised (reducing agent); substance losing O is reduced (oxidising agent)',
      ],
      frequentlyConfused: [
        { pair: 'Oxidation vs Reduction', difference: 'Oxidation = gain of O/loss of electrons; Reduction = loss of O/gain of electrons' },
      ],
      oneLookRevision: [
        '5 reaction types: Combination, Decomposition, Displacement, Double Displacement, Redox',
        'Exothermic releases heat (respiration); Endothermic absorbs heat (photosynthesis)',
        'Rust = Fe₂O₃·xH₂O; prevent by painting, galvanising, oiling',
      ],
      doNotForget: [
        'Add physical states: (s), (l), (g), (aq) and arrows ↑ (gas) and ↓ (precipitate)',
        'Oxidising agent gets reduced; Reducing agent gets oxidised',
        'Respiration is exothermic; Photosynthesis is endothermic',
        'Silver chloride turns grey in sunlight — photodecomposition (used in B&W photography)',
      ],
      examChecklist: [
        'Practise balancing at least 5 equations',
        'Memorise thermite reaction and its welding application',
        'Know 2 methods each to prevent corrosion and rancidity',
        'Be able to identify oxidised/reduced substances in any given reaction',
      ],
    },
  },

  'acids-bases-salts': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'pH scale and its everyday applications', priority: 5, reason: 'Asked nearly every year — stomach, soil, tooth decay' },
        { topic: 'Important salts (NaHCO₃, Na₂CO₃, CaOCl₂, CaSO₄·½H₂O) — formulas and uses', priority: 5, reason: 'Frequent 3M and 5M questions' },
        { topic: 'Chlor-alkali process', priority: 4, reason: 'Commonly asked 3M question with equations' },
        { topic: 'Acid-base indicators and colour changes', priority: 4, reason: 'Regular MCQ topic' },
      ],
      boardKeywords: ['pH scale', 'hydronium ion', 'indicator', 'neutralisation', 'strong acid', 'weak acid', 'Plaster of Paris', 'chlor-alkali process', 'bleaching powder', 'baking soda'],
      importantTables: [
        {
          title: 'Important Salts — Formula and Uses',
          headers: ['Salt', 'Chemical Formula', 'Common Use'],
          rows: [
            ['Baking Soda', 'NaHCO₃', 'Baking (releases CO₂), antacid'],
            ['Washing Soda', 'Na₂CO₃·10H₂O', 'Glass, soap, paper making'],
            ['Bleaching Powder', 'CaOCl₂', 'Bleaching cotton/linen, disinfectant'],
            ['Plaster of Paris', 'CaSO₄·½H₂O', 'Casts for fractures, statues'],
            ['Common Salt', 'NaCl', 'Food, raw material for chlor-alkali'],
          ],
        },
        {
          title: 'Indicator Colour Changes',
          headers: ['Indicator', 'In Acid', 'In Base'],
          rows: [
            ['Blue Litmus', 'Turns Red', 'Stays Blue'],
            ['Red Litmus', 'Stays Red', 'Turns Blue'],
            ['Phenolphthalein', 'Colourless', 'Pink'],
            ['Methyl Orange', 'Red/Pink', 'Yellow'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Acids release H⁺ (H₃O⁺) ions; Bases release OH⁻ ions in water',
        'pH 7 = neutral, <7 = acidic, >7 = basic. pH = −log[H⁺]',
        'Strong acids/bases ionise completely; weak ones partially',
        'Acid + Metal → Salt + H₂↑ (pop test for hydrogen)',
        'Acid + Metal carbonate → Salt + H₂O + CO₂↑ (limewater turns milky)',
        'Neutralisation: Acid + Base → Salt + Water',
      ],
      formulaRevision: [
        'pH = −log[H⁺]',
        '2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑ (chlor-alkali process)',
        'CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (PoP setting)',
        'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
      ],
      importantDefinitions: [
        'pH: negative logarithm of H⁺ ion concentration; measures acidity (0-14 scale)',
        'Neutralisation: reaction of acid with base to form salt and water',
      ],
      commonMistakes: [
        'Confusing strong/weak with concentrated/dilute — strength = degree of ionisation, not concentration',
        'Writing H⁺ instead of H₃O⁺ in aqueous solutions',
      ],
      examTricks: [
        'pH memory: 7 = heaven (neutral), <7 = hell (acidic), >7 = high (basic)',
        'Salt formulas: Baking = NaHCO₃ (1H), Washing = Na₂CO₃·10H₂O (10H), PoP = CaSO₄·½H₂O (½H)',
      ],
      frequentlyConfused: [
        { pair: 'Baking Soda vs Washing Soda', difference: 'Baking soda = NaHCO₃ (used in baking, antacid); Washing soda = Na₂CO₃·10H₂O (used in glass, soap making)' },
      ],
      oneLookRevision: [
        'Acids release H⁺; Bases release OH⁻; pH 7 = neutral',
        'Chlor-alkali: 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂ (3 products)',
        'PoP = CaSO₄·½H₂O, stored in moisture-proof container',
      ],
      doNotForget: [
        'Baking soda = NaHCO₃ (1H); Washing soda = Na₂CO₃·10H₂O (10H); PoP = CaSO₄·½H₂O (½H)',
        'Plaster of Paris must be stored in a moisture-proof container',
        'Bleaching powder = CaOCl₂ (not CaCl₂) — releases chlorine',
        'HNO₃ does not produce H₂ with metals (it is an oxidising acid)',
        'Tooth decay starts at pH < 5.5 — toothpastes are basic',
      ],
      examChecklist: [
        'Memorise all 5 salt formulas with common names and uses',
        'Know the chlor-alkali process equation and 3 products',
        'Be able to draw/read the pH colour scale',
        'Know indicator colour changes for litmus, phenolphthalein, methyl orange',
      ],
    },
  },

  'metals-non-metals': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Reactivity series and displacement reactions', priority: 5, reason: 'Frequent MCQ and 3M question' },
        { topic: 'Extraction of metals (calcination, roasting, electrolytic reduction)', priority: 5, reason: 'Common 5M question on metallurgical steps' },
        { topic: 'Properties of ionic compounds', priority: 4, reason: 'Regular 3M question' },
        { topic: 'Corrosion (rusting) and galvanisation', priority: 4, reason: 'Real-life application — 2M or 3M' },
      ],
      boardKeywords: ['reactivity series', 'ionic compound', 'galvanisation', 'calcination', 'roasting', 'amphoteric', 'alloy', 'aqua regia', 'thermite reaction'],
      importantTables: [
        {
          title: 'Reactivity Series (High to Low)',
          headers: ['Reactivity', 'Metals'],
          rows: [
            ['Very High', 'K, Na, Ca, Mg'],
            ['High', 'Al, Zn, Fe, Pb'],
            ['Moderate', 'Cu, Hg, Ag, Au'],
            ['Extracted by', 'Electrolysis (top) → Carbon reduction (middle) → Self-reduction (bottom)'],
          ],
        },
        {
          title: 'Properties of Ionic vs Covalent Compounds',
          headers: ['Property', 'Ionic', 'Covalent'],
          rows: [
            ['Melting point', 'High', 'Low'],
            ['Solubility', 'Soluble in water', 'Insoluble in water'],
            ['Conductivity', 'Conducts in molten/aqueous state', 'Does not conduct'],
            ['Physical state', 'Solid crystals', 'Solid, liquid, or gas'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au',
        'Metal + Acid → Salt + H₂↑; Metal + Base (amphoteric) → Salt + H₂↑',
        'Ionic compounds: high MP, soluble in water, conduct in molten/aqueous state',
        'Extraction steps: Mining → Enrichment → Roasting/Calcination → Reduction → Refining',
        'Galvanisation = coating iron with zinc (sacrificial protection)',
        'Alloys: Brass = Cu+Zn, Bronze = Cu+Sn, Solder = Pb+Sn',
      ],
      formulaRevision: [
        'Fe₂O₃ + 2Al → 2Fe + Al₂O₃ (thermite reaction)',
        'Zn + 2HCl → ZnCl₂ + H₂↑',
        'Fe + CuSO₄ → FeSO₄ + Cu (displacement)',
        'Cu + 2H₂SO₄(conc) → CuSO₄ + SO₂↑ + 2H₂O',
      ],
      importantDefinitions: [
        'Reactivity series: arrangement of metals in order of decreasing reactivity (K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au)',
        'Galvanisation: coating iron with zinc to prevent rusting (sacrificial protection)',
      ],
      commonMistakes: [
        'Confusing roasting (with O₂, for sulphide ores) with calcination (without O₂, for carbonate ores)',
        'Thinking carbon can reduce all metals — highly reactive metals (Na, K, Ca, Al) need electrolysis',
      ],
      examTricks: [
        'Reactivity series mnemonic: K Na Ca Mg Al Zn Fe Pb Cu Ag Au',
        'Alloys: Brass = Cu+Zn, Bronze = Cu+Sn, Solder = Pb+Sn',
      ],
      frequentlyConfused: [
        { pair: 'Roasting vs Calcination', difference: 'Roasting = heating with O₂ (sulphide ores → oxides); Calcination = heating without O₂ (carbonate ores → oxides)' },
      ],
      oneLookRevision: [
        'Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > Cu > Ag > Au',
        'Ionic compounds: high MP, soluble in water, conduct in molten/aqueous state',
        'Aqua regia = conc. HCl + conc. HNO₃ (3:1) — dissolves gold',
      ],
      doNotForget: [
        'Sodium is stored in kerosene — reacts violently with air and water',
        'Aqua regia = conc. HCl + conc. HNO₃ (3:1) — dissolves gold and platinum',
        'Aluminium is amphoteric — reacts with both acids and bases',
        'Carbon cannot reduce highly reactive metals (Na, K, Ca, Al) — need electrolysis',
        'Roasting (with O₂, for sulphide ores) vs Calcination (without O₂, for carbonate ores)',
      ],
      examChecklist: [
        'Memorise the reactivity series in order',
        'Know extraction method for each reactivity level',
        'Be able to write thermite reaction and explain welding application',
        'Differentiate roasting vs calcination vs electrolytic reduction',
      ],
    },
  },

  'carbon-compounds': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Functional groups and IUPAC naming', priority: 5, reason: 'Frequent MCQ — identify functional group in a given compound' },
        { topic: 'Homologous series and general formulas (alkanes, alkenes, alkynes)', priority: 5, reason: 'Regular 2M and 3M questions' },
        { topic: 'Esterification and saponification reactions', priority: 5, reason: 'Common 3M or 5M question with equations' },
        { topic: 'Soaps and detergents — micelle formation, hard water', priority: 4, reason: 'Frequent 3M question' },
        { topic: 'Hydrogenation of oils', priority: 4, reason: 'Industrial application — 2M or 3M' },
      ],
      boardKeywords: ['covalent bond', 'catenation', 'functional group', 'homologous series', 'esterification', 'saponification', 'micelle', 'hydrogenation', 'unsaturated', 'isomers'],
      importantTables: [
        {
          title: 'Hydrocarbon Families',
          headers: ['Family', 'General Formula', 'Bond Type', 'Example'],
          rows: [
            ['Alkanes', 'CₙH₂ₙ₊₂', 'Single (C-C)', 'Methane CH₄'],
            ['Alkenes', 'CₙH₂ₙ', 'Double (C=C)', 'Ethene C₂H₄'],
            ['Alkynes', 'CₙH₂ₙ₋₂', 'Triple (C≡C)', 'Ethyne C₂H₂'],
          ],
        },
        {
          title: 'Functional Groups',
          headers: ['Group', 'Suffix', 'Example'],
          rows: [
            ['Alcohol (-OH)', '-ol', 'Ethanol C₂H₅OH'],
            ['Aldehyde (-CHO)', '-al', 'Ethanal CH₃CHO'],
            ['Ketone (C=O)', '-one', 'Propanone CH₃COCH₃'],
            ['Carboxylic acid (-COOH)', '-oic acid', 'Ethanoic acid CH₃COOH'],
            ['Halogen (-X)', 'halo-', 'Chloroethane C₂H₅Cl'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Carbon forms 4 covalent bonds (tetravalent); catenation = self-linking ability',
        'Alkanes = CₙH₂ₙ₊₂ (single); Alkenes = CₙH₂ₙ (double); Alkynes = CₙH₂ₙ₋₂ (triple)',
        'Functional groups determine chemical properties: -OH, -CHO, C=O, -COOH, -X',
        'Ethanol reacts with Na → sodium ethanoate + H₂ (shows acidic nature of alcohol)',
        'Esterification: CH₃COOH + C₂H₅OH →(H₂SO₄)→ CH₃COOC₂H₅ + H₂O (sweet smell)',
        'Saponification: Ester + NaOH → Soap (sodium salt of fatty acid) + Glycerol',
        'Soaps ineffective in hard water (Ca²⁺/Mg²⁺ form scum); detergents work',
      ],
      formulaRevision: [
        'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O (esterification)',
        'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH (saponification)',
        'C₂H₄ + H₂ →(Ni)→ C₂H₆ (hydrogenation)',
        '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑',
        'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑ (test for acid)',
      ],
      importantDefinitions: [
        'Functional group: an atom or group of atoms that determines the chemical properties of an organic compound',
        'Esterification: reaction between a carboxylic acid and an alcohol in presence of conc. H₂SO₄ to form an ester',
      ],
      commonMistakes: [
        'Confusing alkanes (CₙH₂ₙ₊₂, single) with alkenes (CₙH₂ₙ, double) and alkynes (CₙH₂ₙ₋₂, triple)',
        'Forgetting that soaps fail in hard water due to scum formation with Ca²⁺/Mg²⁺ ions',
      ],
      examTricks: [
        'Homologous series: each member differs by CH₂ unit; general formula stays the same',
        'Hydrogenation: C=C + H₂ →(Ni, 200°C)→ C-C (liquid oil → solid fat)',
      ],
      frequentlyConfused: [
        { pair: 'Soaps vs Detergents', difference: 'Soaps form scum in hard water (Ca/Mg salts); detergents work in hard water (sulphonate head does not precipitate)' },
      ],
      oneLookRevision: [
        'Alkanes CₙH₂ₙ₊₂, Alkenes CₙH₂ₙ, Alkynes CₙH₂ₙ₋₂',
        'Esterification: CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O (sweet smell)',
        'Carbon is tetravalent — forms 4 covalent bonds; catenation = self-linking',
      ],
      doNotForget: [
        'Carbon cannot gain or lose 4 electrons — shares them (covalent bonds)',
        'Ethanol is used in medicines and as fuel; ethanoic acid = vinegar (5-8%)',
        'Hydrogenation converts liquid vegetable oil to solid fat (vanaspati ghee) using Ni catalyst',
        'Micelle: hydrophilic head (carboxylate) + hydrophobic tail (hydrocarbon chain)',
        'Ethanoic acid turns blue litmus red; ethanol does not change litmus',
        'Soap molecules form micelles around oil/dirt; emulsion washes away',
      ],
      examChecklist: [
        'Memorise all 5 functional groups with examples',
        'Know alkane/alkene/alkyne general formulas',
        'Be able to write esterification and saponification equations',
        'Explain why soaps fail in hard water but detergents work',
        'Know hydrogenation: catalyst, equation, and application',
      ],
    },
  },

  'periodic-classification': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'High',
      highPriorityTopics: [
        { topic: 'Modern periodic table — groups, periods, atomic number basis', priority: 5, reason: 'Core concept — frequent MCQ and 3M questions' },
        { topic: 'Trends: atomic size, metallic/non-metallic character across periods and groups', priority: 5, reason: 'Regular 3M question with reasoning' },
        { topic: 'Mendeleev vs Modern periodic table — merits and limitations', priority: 4, reason: 'Common 3M comparison question' },
      ],
      boardKeywords: ['atomic number', 'periodic law', 'group', 'period', 'valency', 'metallic character', 'non-metallic character', 'metalloid', 'noble gases', 'Mendeleev'],
      importantTables: [
        {
          title: 'Mendeleev vs Modern Periodic Table',
          headers: ['Feature', 'Mendeleev', 'Modern'],
          rows: [
            ['Basis', 'Atomic mass', 'Atomic number'],
            ['Groups', '8', '18'],
            ['Periods', '7', '7'],
            ['Isotopes', 'No fixed position', 'Same position'],
            ['Anomalies', 'Co before Ni, Ar before K', 'Resolved'],
          ],
        },
        {
          title: 'Trends in the Modern Periodic Table',
          headers: ['Property', 'Across Period (→)', 'Down Group (↓)'],
          rows: [
            ['Atomic size', 'Decreases', 'Increases'],
            ['Metallic character', 'Decreases', 'Increases'],
            ['Non-metallic character', 'Increases', 'Decreases'],
            ['Valency (groups 1-2)', 'Same (1, 2)', 'Same'],
            ['Valency (across period)', '1→4→1 (then 0)', '—'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Modern periodic law: Properties are periodic functions of atomic number (Moseley)',
        '18 groups (vertical), 7 periods (horizontal); Group = valence electrons, Period = shells',
        'Across a period: atomic size ↓, metallic character ↓, non-metallic character ↑',
        'Down a group: atomic size ↑, metallic character ↑, non-metallic character ↓',
        'Group 1 = alkali metals, Group 2 = alkaline earth metals, Group 17 = halogens, Group 18 = noble gases',
        'Mendeleev left gaps for undiscovered elements (eka-silicon = Ge, eka-aluminium = Ga)',
      ],
      formulaRevision: [
        'Groups 1-2: valence electrons = group number',
        'Groups 13-18: valence electrons = group number − 10',
        'Period number = number of electron shells',
        'Valency across period 3: Na(1) → Mg(2) → Al(3) → Si(4) → P(3) → S(2) → Cl(1) → Ar(0)',
      ],
      importantDefinitions: [
        'Modern periodic law: properties of elements are periodic functions of their atomic number (Moseley)',
        'Group: vertical column in periodic table; elements in same group have same number of valence electrons',
      ],
      commonMistakes: [
        'Confusing Mendeleev (atomic mass) with Modern (atomic number) as the basis',
        'Forgetting that atomic size decreases across a period (more nuclear charge, same shells)',
      ],
      examTricks: [
        'Group = valence electrons; Period = number of shells',
        'Metalloids (Si, Ge, As, Sb, Te) form a zig-zag line separating metals from non-metals',
      ],
      frequentlyConfused: [
        { pair: 'Mendeleev vs Modern Periodic Table', difference: 'Mendeleev: based on atomic mass, 8 groups, isotopes not placed; Modern: based on atomic number, 18 groups, isotopes in same position' },
      ],
      oneLookRevision: [
        'Modern: 18 groups, 7 periods; based on atomic number',
        'Across period: size ↓, metallic ↓; Down group: size ↑, metallic ↑',
        'Group 1 = alkali metals, Group 17 = halogens, Group 18 = noble gases',
      ],
      doNotForget: [
        'Mendeleev based his table on atomic mass; Moseley corrected it to atomic number',
        'Isotopes have same atomic number → same position in modern table (Mendeleev could not place them)',
        'Noble gases (Group 18) have completely filled outer shells — chemically inert',
        'Metalloids (Si, Ge, As, Sb, Te) separate metals from non-metals in a zig-zag line',
        'Larger atoms (more shells) = easier to lose electrons = more metallic',
      ],
      examChecklist: [
        'Know the 2 periodic laws (Mendeleev and Moseley) and their difference',
        'Be able to predict period and group from electronic configuration',
        'Memorise atomic size and metallic character trends with reasoning',
        'Know limitations of Mendeleev\'s table and how modern table fixed them',
      ],
    },
  },

  'life-processes': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 2, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Photosynthesis equation and factors affecting it', priority: 5, reason: 'Almost guaranteed every year — 3M or 5M' },
        { topic: 'Human heart structure and double circulation', priority: 5, reason: 'Frequent 5M diagram-based question' },
        { topic: 'Aerobic vs anaerobic respiration comparison', priority: 5, reason: 'Common 3M question with table' },
        { topic: 'Nephron structure and function', priority: 5, reason: 'Regular 3M or 5M question' },
        { topic: 'Digestive system and enzyme action', priority: 4, reason: 'Frequent 3M question' },
        { topic: 'Xylem vs phloem transport', priority: 4, reason: 'Common 2M or 3M comparison' },
      ],
      boardKeywords: ['autotrophic nutrition', 'photosynthesis', 'chlorophyll', 'aerobic respiration', 'anaerobic respiration', 'ATP', 'double circulation', 'nephron', 'transpiration', 'translocation', 'peristalsis', 'villi'],
      importantTables: [
        {
          title: 'Aerobic vs Anaerobic Respiration',
          headers: ['Feature', 'Aerobic', 'Anaerobic'],
          rows: [
            ['Oxygen', 'Required', 'Not required'],
            ['Site', 'Mitochondria', 'Cytoplasm'],
            ['Products', 'CO₂ + H₂O + 38 ATP', 'Lactic acid (muscles) or Ethanol + CO₂ (yeast) + 2 ATP'],
            ['Energy', 'High (38 ATP)', 'Low (2 ATP)'],
            ['Organisms', 'Most animals and plants', 'Yeast, muscle cells during heavy exercise'],
          ],
        },
        {
          title: 'Xylem vs Phloem',
          headers: ['Feature', 'Xylem', 'Phloem'],
          rows: [
            ['Transports', 'Water and minerals', 'Food (sucrose)'],
            ['Direction', 'Upward (roots → leaves)', 'Bidirectional'],
            ['Energy', 'Not required', 'ATP required'],
            ['Conducting cells', 'Tracheids, vessels', 'Sieve tubes, companion cells'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Photosynthesis: 6CO₂ + 6H₂O →(sunlight, chlorophyll)→ C₆H₁₂O₆ + 6O₂',
        'Aerobic: 38 ATP in mitochondria; Anaerobic: 2 ATP in cytoplasm (lactic acid / ethanol+CO₂)',
        'Heart: right = deoxygenated, left = oxygenated; double circulation = pulmonary + systemic',
        'Arteries: thick walls, carry blood away from heart; Veins: thin walls + valves, carry blood to heart',
        'Nephron: filtration (Bowman\'s capsule) → reabsorption → secretion → urine',
        'Digestive enzymes: salivary amylase (mouth → starch to maltose), pepsin (stomach → proteins), bile (liver → emulsifies fats)',
        'Xylem = water up (no energy); Phloem = food both ways (uses ATP)',
      ],
      formulaRevision: [
        '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (photosynthesis)',
        'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP (aerobic respiration)',
        'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + 2 ATP (anaerobic, yeast)',
        'C₆H₁₂O₆ → 2C₃H₆O₃ + 2 ATP (anaerobic, muscles — lactic acid)',
        'Cardiac output = Heart rate × Stroke volume',
      ],
      importantDefinitions: [
        'Photosynthesis: process by which green plants make food from CO₂ and water using sunlight and chlorophyll',
        'Double circulation: blood passes through the heart twice in one complete cycle (pulmonary + systemic)',
      ],
      commonMistakes: [
        'Confusing aerobic (38 ATP, mitochondria) with anaerobic (2 ATP, cytoplasm) respiration',
        'Forgetting that the right side of the heart carries deoxygenated blood',
      ],
      examTricks: [
        'Arteries Away (from heart), Veins Towards (heart) — AAVT',
        'Nephron steps: FRSU — Filtration, Reabsorption, Secretion, Urine',
      ],
      frequentlyConfused: [
        { pair: 'Aerobic vs Anaerobic Respiration', difference: 'Aerobic: with O₂, mitochondria, 38 ATP, CO₂+H₂O; Anaerobic: without O₂, cytoplasm, 2 ATP, lactic acid or ethanol+CO₂' },
      ],
      oneLookRevision: [
        'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (sunlight, chlorophyll)',
        'Heart: right = deoxygenated, left = oxygenated; double circulation',
        'Xylem = water up (no energy); Phloem = food both ways (uses ATP)',
      ],
      doNotForget: [
        'Bile is NOT an enzyme — it emulsifies fats (breaks large globules into smaller ones)',
        'Right side of heart = deoxygenated blood; Left side = oxygenated blood',
        'Villi in small intestine increase surface area for absorption',
        'Stomata open/close via guard cells; also site of transpiration',
        'Cramps during heavy exercise = lactic acid from anaerobic respiration in muscles',
        'Insulin regulates blood sugar (produced by pancreas); deficiency = diabetes',
      ],
      examChecklist: [
        'Write full balanced photosynthesis and respiration equations with conditions',
        'Be able to explain double circulation and its significance',
        'Draw/label the nephron: glomerulus, Bowman\'s capsule, tubule, collecting duct',
        'Know all digestive enzymes, their location, and substrate',
        'Compare xylem vs phloem in a table',
      ],
    },
  },

  'control-coordination': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Reflex action and reflex arc pathway', priority: 5, reason: 'Almost guaranteed — 3M or 5M question' },
        { topic: 'Structure of neuron and synapse', priority: 5, reason: 'Frequent 3M diagram-based question' },
        { topic: 'Parts of the brain and their functions', priority: 5, reason: 'Regular 3M question' },
        { topic: 'Plant hormones and tropisms', priority: 5, reason: 'Common 3M or 5M question' },
        { topic: 'Endocrine glands and their hormones', priority: 4, reason: 'Frequent MCQ and 2M' },
      ],
      boardKeywords: ['neuron', 'synapse', 'reflex action', 'reflex arc', 'cerebrum', 'cerebellum', 'medulla', 'auxin', 'phototropism', 'geotropism', 'adrenaline', 'thyroxine', 'insulin', 'goitre'],
      importantTables: [
        {
          title: 'Parts of the Brain',
          headers: ['Part', 'Function'],
          rows: [
            ['Cerebrum', 'Thinking, memory, reasoning, voluntary actions, speech'],
            ['Cerebellum', 'Balance, posture, coordination of voluntary movements'],
            ['Medulla', 'Involuntary functions: breathing, heart rate, blood pressure'],
            ['Pons', 'Regulates breathing and facial expressions'],
          ],
        },
        {
          title: 'Plant Hormones and Functions',
          headers: ['Hormone', 'Function'],
          rows: [
            ['Auxin', 'Cell elongation, phototropism'],
            ['Gibberellin', 'Stem growth, seed germination'],
            ['Cytokinin', 'Cell division, delays leaf ageing'],
            ['Abscisic acid', 'Inhibits growth, closes stomata in drought'],
            ['Ethylene', 'Fruit ripening, flower wilting'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Neuron = dendrites (receive) + cell body + axon (transmit) + nerve endings',
        'Synapse = gap between neurons; crossed by neurotransmitters (chemical signals)',
        'Reflex arc: Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector (brain bypassed)',
        'Brain: Cerebrum (thinking), Cerebellum (balance), Medulla (involuntary), Pons (breathing)',
        'Nervous control = fast + short-lived; Hormonal control = slow + long-lasting',
        'Auxin migrates to shaded side → faster elongation → shoot bends toward light (phototropism)',
        'Iodine deficiency → goitre (low thyroxine); Insulin deficiency → diabetes',
      ],
      formulaRevision: [
        'Reflex arc: Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector',
        'Nervous pathway: Stimulus → Receptor → Sensory neuron → CNS → Motor neuron → Effector',
        'Adrenaline → ↑ heart rate, ↑ breathing, ↑ blood to muscles (fight-or-flight)',
      ],
      importantDefinitions: [
        'Reflex action: involuntary, rapid response to a stimulus that does not involve the brain',
        'Synapse: junction between two neurons where electrical signals are converted to chemical signals (neurotransmitters)',
      ],
      commonMistakes: [
        'Confusing cerebrum (thinking) with cerebellum (balance) — they are different!',
        'Thinking reflex actions involve the brain — they do NOT, they bypass it via spinal cord',
      ],
      examTricks: [
        'Brain: CCM — Cerebrum (Cognition), Cerebellum (Coordination), Medulla (Maintenance)',
        'Plant hormones: All Good Children Are Eating — Auxin, Gibberellin, Cytokinin, Abscisic acid, Ethylene',
      ],
      frequentlyConfused: [
        { pair: 'Cerebrum vs Cerebellum', difference: 'Cerebrum = thinking, memory, voluntary actions; Cerebellum = balance, posture, coordination of movement' },
      ],
      oneLookRevision: [
        'Reflex arc: Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector',
        'Brain: Cerebrum (thinking), Cerebellum (balance), Medulla (involuntary)',
        'Nervous = fast + short; Hormonal = slow + long',
      ],
      doNotForget: [
        'Reflex actions do NOT involve the brain — spinal cord only (faster response)',
        'Synapse is a gap, not a physical connection — neurotransmitters cross it',
        'Cerebrum = thinking/memory; Cerebellum = balance/posture (do not mix up)',
        'Plant tropisms: photo (light), geo (gravity), hydro (water), chemo (chemicals)',
        'Tropism = directional growth; Nastic movement = non-directional (e.g., Mimosa touch)',
        'Iodised salt prevents goitre — iodine needed for thyroxine synthesis',
      ],
      examChecklist: [
        'Be able to draw and label a neuron (dendrites, cell body, axon, myelin sheath)',
        'Trace the reflex arc pathway and explain why it is faster than voluntary response',
        'Memorise all 5 plant hormones and their functions',
        'Know all endocrine glands: pituitary, thyroid, pancreas, adrenal, gonads',
      ],
    },
  },

  'reproduction': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'High',
      highPriorityTopics: [
        { topic: 'Human reproductive system — male and female', priority: 5, reason: 'Frequent 5M diagram-based question' },
        { topic: 'Pollination and fertilisation in plants', priority: 4, reason: 'Common 3M question' },
        { topic: 'Menstrual cycle and reproductive health', priority: 4, reason: 'Regular 3M question' },
        { topic: 'Asexual reproduction methods', priority: 4, reason: 'MCQ and 2M favourite' },
      ],
      boardKeywords: ['pollination', 'fertilisation', 'stamen', 'pistil', 'ovulation', 'menstruation', 'puberty', 'binary fission', 'budding', 'regeneration', 'vegetative propagation', 'placenta', 'zygote'],
      importantTables: [
        {
          title: 'Asexual Reproduction Methods',
          headers: ['Method', 'Organism', 'Description'],
          rows: [
            ['Binary fission', 'Amoeba, bacteria', 'Parent divides into two equal daughter cells'],
            ['Multiple fission', 'Plasmodium', 'Parent divides into many daughter cells'],
            ['Budding', 'Hydra, yeast', 'Outgrowth (bud) grows and detaches'],
            ['Fragmentation', 'Spirogyra', 'Body breaks into fragments, each regrows'],
            ['Spore formation', 'Fungi, ferns', 'Spores germinate into new organisms under favourable conditions'],
          ],
        },
        {
          title: 'Flower Parts',
          headers: ['Part', 'Components', 'Function'],
          rows: [
            ['Stamen (male)', 'Anther + Filament', 'Anther produces pollen (male gamete)'],
            ['Pistil (female)', 'Stigma + Style + Ovary', 'Ovary contains ovules (female gamete)'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Asexual: one parent, no variation, fast (binary fission, budding, fragmentation, spores)',
        'Sexual: two parents, variations, slower (pollination + fertilisation in plants)',
        'Flower male = stamen (anther + filament); Female = pistil (stigma + style + ovary)',
        'Pollination: transfer of pollen from anther to stigma (self or cross)',
        'Fertilisation in plants: pollen tube grows → male gamete fuses with egg in ovule → zygote',
        'Human fertilisation occurs in fallopian tube; zygote implants in uterus',
        'Menstrual cycle ~28 days: ovulation (day 14) → if no fertilisation, endometrium sheds (menstruation)',
        'Placenta: provides nutrition and oxygen to foetus; also removes waste',
      ],
      formulaRevision: [
        'Bacterial growth: if 1 bacterium divides every 30 min → 2ⁿ bacteria after n divisions',
        'If bacterium divides every 30 min, in 3 hours (6 divisions): 2⁶ = 64 bacteria',
      ],
      importantDefinitions: [
        'Pollination: transfer of pollen from anther to stigma (self or cross)',
        'Fertilisation: fusion of male and female gametes to form a zygote',
      ],
      commonMistakes: [
        'Confusing self-pollination (same flower) with cross-pollination (different flowers)',
        'Forgetting that fertilisation occurs in the fallopian tube, not the uterus',
      ],
      examTricks: [
        'Asexual methods: BBF SV — Budding, Binary fission, Fragmentation, Spore, Vegetative',
        'Flower: Stamen = male (anther + filament); Pistil = female (stigma + style + ovary)',
      ],
      frequentlyConfused: [
        { pair: 'Self-pollination vs Cross-pollination', difference: 'Self = pollen to same flower (no variation); Cross = pollen to different flower (creates variation)' },
      ],
      oneLookRevision: [
        'Asexual: 1 parent, no variation, fast; Sexual: 2 parents, variation, slower',
        'Fertilisation in fallopian tube; implantation in uterus; placenta = nutrient exchange',
        'Menstrual cycle ~28 days; ovulation ~day 14; no fertilisation → menstruation',
      ],
      doNotForget: [
        'Fertilisation occurs in the fallopian tube (oviduct), not the uterus',
        'Placenta is the life-support organ for the foetus — nutrient + gas exchange',
        'Cross-pollination creates more variation than self-pollination',
        'Vegetative propagation = asexual (cutting, grafting, layering, tissue culture)',
        'DNA copying with slight variations is the basis of evolution',
        'Condoms also protect against STIs, not just prevent pregnancy',
      ],
      examChecklist: [
        'Be able to label male and female reproductive systems',
        'Know the path of sperm and the path of egg to fertilisation site',
        'Memorise the menstrual cycle phases',
        'Know 4 asexual reproduction methods with examples',
      ],
    },
  },

  'heredity-evolution': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'High',
      highPriorityTopics: [
        { topic: 'Mendel\'s monohybrid and dihybrid crosses with ratios', priority: 5, reason: 'Frequent 3M or 5M question with Punnett square' },
        { topic: 'Homologous vs analogous organs', priority: 5, reason: 'Regular 3M comparison question' },
        { topic: 'Evidence of evolution: fossils, homologous organs', priority: 4, reason: 'Common 3M question' },
        { topic: 'Speciation and factors causing it', priority: 4, reason: 'Frequent 3M question' },
      ],
      boardKeywords: ['heredity', 'variation', 'dominant', 'recessive', 'genotype', 'phenotype', 'homologous organs', 'analogous organs', 'fossils', 'natural selection', 'speciation', 'monohybrid', 'dihybrid'],
      importantTables: [
        {
          title: 'Mendel\'s Cross Ratios',
          headers: ['Cross', 'F₂ Phenotypic Ratio', 'Genotypic Ratio'],
          rows: [
            ['Monohybrid (Tt × Tt)', '3:1 (tall:short)', '1:2:1 (TT:Tt:tt)'],
            ['Dihybrid (RrYy × RrYy)', '9:3:3:1', '1:2:1:2:4:2:1:2:1'],
          ],
        },
        {
          title: 'Homologous vs Analogous Organs',
          headers: ['Feature', 'Homologous', 'Analogous'],
          rows: [
            ['Structure', 'Same', 'Different'],
            ['Function', 'Different', 'Same'],
            ['Ancestry', 'Common ancestor', 'No common ancestor'],
            ['Evolution type', 'Divergent', 'Convergent'],
            ['Example', 'Forelimbs of human & frog', 'Wings of butterfly & bird'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Mendel monohybrid F₂: 3:1 phenotypic, 1:2:1 genotypic',
        'Mendel dihybrid F₂: 9:3:3:1 phenotypic ratio',
        'Gametes are haploid (23 chromosomes in humans); body cells are diploid (46)',
        'Sex chromosomes: XX = female, XY = male; father determines sex of child',
        'Homologous = same structure, different function, common ancestor (divergent evolution)',
        'Analogous = different structure, same function, no common ancestor (convergent evolution)',
        'Fossils: preserved remains; age determined by dating rock layers',
        'Speciation: geographical isolation + genetic variation + natural selection',
        'Acquired traits (somatic) are NOT inherited; only germ cell DNA changes pass on',
      ],
      formulaRevision: [
        'Monohybrid cross: TT × tt → all Tt (tall) → Tt × Tt → 3 tall : 1 short',
        'Dihybrid cross: RrYy × RrYy → 9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green',
        'Human gamete: 23 chromosomes; Human somatic cell: 46 chromosomes (23 pairs)',
      ],
      importantDefinitions: [
        'Heredity: transmission of traits from parents to offspring through genes',
        'Speciation: formation of a new species from an existing one due to isolation and variation',
      ],
      commonMistakes: [
        'Confusing homologous (same structure, different function) with analogous (different structure, same function)',
        'Thinking acquired traits are inherited — only germ cell DNA changes pass on',
      ],
      examTricks: [
        'Mendel ratios: monohybrid 3:1, dihybrid 9:3:3:1',
        'Sex: XX = female, XY = male; father determines sex (provides X or Y)',
      ],
      frequentlyConfused: [
        { pair: 'Homologous vs Analogous Organs', difference: 'Homologous = same structure, different function, common ancestor (divergent); Analogous = different structure, same function, no common ancestor (convergent)' },
      ],
      oneLookRevision: [
        'Monohybrid F₂: 3:1; Dihybrid F₂: 9:3:3:1',
        'Homologous = forelimbs of human & frog; Analogous = wings of butterfly & bird',
        'Acquired traits NOT inherited; only germ cell DNA changes pass on',
      ],
      doNotForget: [
        'Dominant trait masks recessive in heterozygous condition (Tt = tall)',
        'Mendel used pea plants (Pisum sativum) — chose 7 contrasting traits',
        'Darwin proposed natural selection ("On the Origin of Species", 1859)',
        'Acquired traits are not inherited — only germ cell (reproductive) DNA changes are',
        'Evolution is progressive but not goal-directed — variations are random',
        'Wings of bat and bird = homologous (same bone structure); wings of insect and bird = analogous',
      ],
      examChecklist: [
        'Be able to draw a Punnett square for monohybrid and dihybrid crosses',
        'Know the difference between homologous and analogous organs with examples',
        'Explain speciation and list factors: isolation, variation, selection, time',
        'Know Mendel\'s laws: dominance, segregation, independent assortment',
      ],
    },
  },

  'light-reflection-refraction': {
    examMeta: {
      expectedMarks: { '1M': 3, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Mirror and lens formula numericals', priority: 5, reason: 'Almost guaranteed numerical — 3M or 5M' },
        { topic: 'Image formation by concave/convex mirrors and lenses', priority: 5, reason: 'Frequent 5M ray diagram question' },
        { topic: 'Sign convention and magnification', priority: 5, reason: 'Essential for numericals — 2M or 3M' },
        { topic: 'Refractive index and speed of light calculations', priority: 4, reason: 'Regular numerical — 2M or 3M' },
        { topic: 'Power of a lens', priority: 4, reason: 'Common 1M or 2M numerical' },
      ],
      boardKeywords: ['concave mirror', 'convex mirror', 'focal length', 'radius of curvature', 'refractive index', 'Snell\'s law', 'power of lens', 'magnification', 'real image', 'virtual image', 'total internal reflection'],
      importantTables: [
        {
          title: 'Image Formation by Concave Mirror',
          headers: ['Object Position', 'Image Nature', 'Image Size'],
          rows: [
            ['At infinity', 'Real, inverted at F', 'Point-sized'],
            ['Beyond C', 'Real, inverted between F and C', 'Diminished'],
            ['At C', 'Real, inverted at C', 'Same size'],
            ['Between F and C', 'Real, inverted beyond C', 'Magnified'],
            ['Between F and P', 'Virtual, erect behind mirror', 'Magnified'],
          ],
        },
        {
          title: 'Image Formation by Convex Lens',
          headers: ['Object Position', 'Image Nature', 'Image Size'],
          rows: [
            ['At infinity', 'Real, inverted at F', 'Point-sized'],
            ['Beyond 2F', 'Real, inverted between F and 2F', 'Diminished'],
            ['At 2F', 'Real, inverted at 2F', 'Same size'],
            ['Between F and 2F', 'Real, inverted beyond 2F', 'Magnified'],
            ['Between F and lens', 'Virtual, erect on same side', 'Magnified'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Mirror formula: 1/v + 1/u = 1/f (New Cartesian: u negative, f negative for concave)',
        'Lens formula: 1/v − 1/u = 1/f (v positive for real image)',
        'Magnification: m = −v/u (mirror); m = v/u (lens); m = h\'/h',
        'R = 2f (radius of curvature = 2 × focal length)',
        'Power of lens: P = 1/f(metres) in dioptres (D); convex = +, concave = −',
        'Refractive index: n = c/v = sin i / sin r',
        'Convex mirror: always virtual, erect, diminished; used as rear-view mirror',
        'Concave mirror: shaving/dentist mirror (object within f → virtual magnified)',
      ],
      formulaRevision: [
        '1/v + 1/u = 1/f (mirror formula)',
        '1/v − 1/u = 1/f (lens formula)',
        'm = −v/u (mirror magnification)',
        'm = v/u = h\'/h (lens magnification)',
        'P = 1/f (metres), unit = dioptre (D)',
        'n = c/v (refractive index)',
        'R = 2f',
      ],
      importantDefinitions: [
        'Magnification: ratio of image height to object height (m = h′/h = −v/u for mirrors)',
        'Power of a lens: reciprocal of focal length in metres (P = 1/f, unit = dioptre D)',
      ],
      commonMistakes: [
        'Using wrong sign convention — New Cartesian: u is negative, f is negative for concave',
        'Forgetting to convert cm to m when calculating power of a lens',
      ],
      examTricks: [
        'Mirror: 1/v + 1/u = 1/f; Lens: 1/v − 1/u = 1/f (mirror plus, lens minus)',
        'Convex lens = converging (+P); Concave lens = diverging (−P)',
      ],
      frequentlyConfused: [
        { pair: 'Mirror Formula vs Lens Formula', difference: 'Mirror: 1/v + 1/u = 1/f (plus sign); Lens: 1/v − 1/u = 1/f (minus sign)' },
      ],
      oneLookRevision: [
        'Mirror: 1/v + 1/u = 1/f; Lens: 1/v − 1/u = 1/f',
        'R = 2f; P = 1/f(m) in dioptres; convex = +, concave = −',
        'Convex mirror = rear-view (wide view); Concave mirror = shaving/dentist (magnified)',
      ],
      doNotForget: [
        'Sign convention: all distances measured from the pole/optical centre',
        'Distances against incident light = negative; along incident light = positive',
        'Convex lens: converging, positive power; Concave lens: diverging, negative power',
        'Convex mirror always forms virtual image; concave can form real or virtual',
        'Refractive index is relative: n₂₁ = v₁/v₂; higher n = denser medium = slower light',
        '1 D = 1 m⁻¹; if f is in cm, convert to metres before calculating power',
      ],
      examChecklist: [
        'Practise at least 5 mirror formula and 5 lens formula numericals',
        'Be able to draw ray diagrams for all 5 concave mirror positions',
        'Know sign convention perfectly — most numerical mistakes are sign errors',
        'Memorise: convex mirror = rear-view; concave mirror = shaving/dentist/torch',
        'Practise power of lens and refractive index calculations',
      ],
    },
  },

  'human-eye': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Defects of vision: myopia and hypermetropia — causes and correction', priority: 5, reason: 'Almost guaranteed — 3M question with ray diagram' },
        { topic: 'Accommodation and working of the human eye', priority: 5, reason: 'Frequent 3M question' },
        { topic: 'Scattering of light and Tyndall effect', priority: 4, reason: 'Regular 2M or 3M question' },
        { topic: 'Dispersion and rainbow formation', priority: 4, reason: 'Common 3M question' },
      ],
      boardKeywords: ['accommodation', 'ciliary muscles', 'retina', 'cornea', 'iris', 'pupil', 'myopia', 'hypermetropia', 'presbyopia', 'scattering', 'Tyndall effect', 'dispersion', 'VIBGYOR'],
      importantTables: [
        {
          title: 'Defects of Vision',
          headers: ['Defect', 'Cause', 'Image Forms', 'Correction'],
          rows: [
            ['Myopia (short-sight)', 'Elongated eyeball / excessive curvature', 'In front of retina', 'Concave lens (−)'],
            ['Hypermetropia (long-sight)', 'Shortened eyeball / low curvature', 'Behind retina', 'Convex lens (+)'],
            ['Presbyopia', 'Ageing — ciliary muscles weaken', 'Both near and far affected', 'Bifocal lens'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Eye parts: cornea (refraction) → iris/pupil (light control) → lens (focusing) → retina (image)',
        'Accommodation: ciliary muscles change lens curvature to focus at different distances',
        'Myopia: image in front of retina → concave lens (diverging) corrects it',
        'Hypermetropia: image behind retina → convex lens (converging) corrects it',
        'Power of corrective lens: P = 1/f (metres); myopia uses negative f',
        'Scattering: blue scattered most (1/λ⁴) → sky is blue; sunset is red (long wavelengths pass through)',
        'Tyndall effect: scattering by colloidal particles makes light path visible',
        'Dispersion: white light splits into VIBGYOR by a prism (violet bends most)',
      ],
      formulaRevision: [
        'P = 1/f (metres) — power of corrective lens in dioptres',
        'Far point of normal eye = infinity; Near point = 25 cm',
        'Scattering intensity ∝ 1/λ⁴ (Rayleigh scattering)',
        'n_violet > n_red (violet bends more in prism)',
      ],
      importantDefinitions: [
        'Accommodation: ability of the eye to change its focal length using ciliary muscles to focus at different distances',
        'Dispersion: splitting of white light into its constituent colours (VIBGYOR) by a prism',
      ],
      commonMistakes: [
        'Confusing myopia (short-sight, concave lens) with hypermetropia (long-sight, convex lens)',
        'Forgetting that the sky appears blue due to scattering (1/λ⁴), not absorption',
      ],
      examTricks: [
        'Myopia = Minus (concave lens); Hypermetropia = Hifi (convex lens)',
        'VIBGYOR: Violet bends most (shortest λ, highest n); Red bends least',
      ],
      frequentlyConfused: [
        { pair: 'Myopia vs Hypermetropia', difference: 'Myopia = image in front of retina, concave lens; Hypermetropia = image behind retina, convex lens' },
      ],
      oneLookRevision: [
        'Myopia = concave lens; Hypermetropia = convex lens; Presbyopia = bifocal',
        'Sky blue = scattering (1/λ⁴); Tyndall = scattering by colloidal particles',
        'Accommodation: ciliary muscles change lens curvature; near = thick, far = thin',
      ],
      doNotForget: [
        'Retina has two receptors: rods (dim light, no colour) and cones (bright light, colour)',
        'Myopia = minus (concave); Hypermetropia = plus (convex) — "Myopia = Minus"',
        'Stars twinkle (point sources, atmospheric refraction); planets don\'t (extended discs)',
        'Rainbow: sunlight dispersed by water droplets — total internal reflection + dispersion',
        'The sky appears blue because air scatters blue more than red (shorter wavelength)',
        'Presbyopia = ageing defect; corrected with bifocal lenses (convex + concave)',
      ],
      examChecklist: [
        'Be able to draw ray diagrams showing myopia and its correction with concave lens',
        'Be able to draw ray diagrams showing hypermetropia and its correction with convex lens',
        'Know all parts of the eye and their functions',
        'Explain why the sky is blue and why sunsets are red (scattering)',
        'Know the Tyndall effect with one example',
      ],
    },
  },

  'electricity': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 2, '5M': 1 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Ohm\'s law and circuit numericals', priority: 5, reason: 'Almost guaranteed numerical — 3M or 5M' },
        { topic: 'Series and parallel combination calculations', priority: 5, reason: 'Frequent 5M numerical question' },
        { topic: 'Electric power and energy (kWh calculations)', priority: 5, reason: 'Common 3M numerical with electricity bill' },
        { topic: 'Resistance depends on length, area, material, temperature', priority: 4, reason: 'Regular 2M or 3M question' },
      ],
      boardKeywords: ['Ohm\'s law', 'resistance', 'resistivity', 'series circuit', 'parallel circuit', 'electric power', 'kilowatt-hour', 'heating effect', 'fuse', 'Nichrome'],
      importantTables: [
        {
          title: 'Series vs Parallel Circuits',
          headers: ['Feature', 'Series', 'Parallel'],
          rows: [
            ['Current', 'Same at all points', 'Splits across branches'],
            ['Voltage', 'Splits across components', 'Same across all branches'],
            ['Equivalent resistance', 'R = R₁ + R₂ + R₃', '1/R = 1/R₁ + 1/R₂ + 1/R₃'],
            ['If one bulb fails', 'All go off', 'Others stay on'],
            ['Used in', 'Festive lights', 'Household wiring'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Ohm\'s law: V = IR (V in volts, I in amperes, R in ohms)',
        'R = ρL/A — resistance depends on length (↑), area (↓), material (ρ), temperature (↑)',
        'Series: R = R₁ + R₂ + ...; same current, voltage splits',
        'Parallel: 1/R = 1/R₁ + 1/R₂ + ...; same voltage, current splits',
        'Power: P = VI = I²R = V²/R (in watts)',
        'Energy: E = P × t (in joules); 1 kWh = 3.6 × 10⁶ J = 1 unit',
        'Heating effect: H = I²Rt (Joule\'s law of heating)',
        '1 A = 1 C/s; 1 V = 1 J/C; 1 W = 1 J/s',
      ],
      formulaRevision: [
        'V = IR (Ohm\'s law)',
        'R = ρL/A (resistance formula)',
        'P = VI = I²R = V²/R (power)',
        'H = I²Rt (heating, Joule\'s law)',
        '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J',
        'Series: R = R₁ + R₂ + R₃',
        'Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃',
      ],
      importantDefinitions: [
        'Ohm\'s law: current is directly proportional to voltage at constant temperature (V = IR)',
        '1 kWh: energy consumed when 1000 W appliance runs for 1 hour (= 3.6 × 10⁶ J = 1 unit)',
      ],
      commonMistakes: [
        'Forgetting that in parallel, equivalent resistance is LESS than the smallest individual resistor',
        'Not converting units — cm to m for resistivity, W to kW for energy calculations',
      ],
      examTricks: [
        'Series: same current, voltage splits; Parallel: same voltage, current splits',
        'Power formulas: P = VI = I²R = V²/R — choose based on what you know',
      ],
      frequentlyConfused: [
        { pair: 'Series vs Parallel Circuits', difference: 'Series: R = R₁+R₂+R₃, same current, voltage splits; Parallel: 1/R = 1/R₁+1/R₂+1/R₃, same voltage, current splits' },
      ],
      oneLookRevision: [
        'V = IR; P = VI = I²R = V²/R; 1 kWh = 3.6×10⁶ J',
        'Series: R adds, same I; Parallel: reciprocals add, same V',
        'Nichrome used in heaters (high resistivity, high MP, no oxidation)',
      ],
      doNotForget: [
        'Resistivity (ρ) is a material property — does not depend on L or A',
        'In parallel, equivalent resistance is LESS than the smallest individual resistor',
        'Alloys (Nichrome) have high resistivity and high melting point → used in heaters',
        '1 unit of electricity = 1 kWh; electricity bills are in units',
        'Fuse: melts and breaks circuit when current exceeds safe value (overloading)',
        'Live wire = red/brown; Neutral = black/blue; Earth = green/yellow',
        'Short circuit: live wire touches neutral wire directly → very high current',
      ],
      examChecklist: [
        'Practise at least 5 series/parallel combination numericals',
        'Know all 3 power formulas and when to use each',
        'Be able to calculate electricity bill from power rating and hours used',
        'Understand why heating elements use alloys, not pure metals',
        'Memorise: series = same current; parallel = same voltage',
      ],
    },
  },

  'magnetic-effects': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 1 },
      pyqFrequency: 'High',
      highPriorityTopics: [
        { topic: 'Magnetic field lines — properties and patterns', priority: 5, reason: 'Frequent 3M question with diagrams' },
        { topic: 'Electric motor principle and working', priority: 5, reason: 'Common 5M question' },
        { topic: 'Electromagnetic induction and generator', priority: 5, reason: 'Regular 3M or 5M question' },
        { topic: 'Fleming\'s left-hand and right-hand rules', priority: 4, reason: 'Frequent MCQ and 2M' },
        { topic: 'Domestic electric circuits and safety', priority: 4, reason: 'Common 3M question' },
      ],
      boardKeywords: ['magnetic field', 'field lines', 'solenoid', 'right-hand thumb rule', 'Fleming\'s left-hand rule', 'Fleming\'s right-hand rule', 'electric motor', 'electromagnetic induction', 'AC generator', 'earth wire', 'short circuit', 'overloading'],
      importantTables: [
        {
          title: 'Fleming\'s Rules',
          headers: ['Rule', 'Hand', 'Used For'],
          rows: [
            ['Left-hand rule', 'Left', 'Motor (force on current-carrying conductor)'],
            ['Right-hand rule', 'Right', 'Generator (induced current direction)'],
          ],
        },
        {
          title: 'Electric Motor vs Generator',
          headers: ['Feature', 'Motor', 'Generator'],
          rows: [
            ['Energy conversion', 'Electrical → Mechanical', 'Mechanical → Electrical'],
            ['Principle', 'Force on current in magnetic field', 'Electromagnetic induction'],
            ['Rule', 'Fleming\'s left-hand', 'Fleming\'s right-hand'],
            ['Input/Output', 'Input: current; Output: rotation', 'Input: rotation; Output: current'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Magnetic field lines: closed loops, never cross, denser = stronger field',
        'Straight wire: concentric circles (right-hand thumb rule gives direction)',
        'Solenoid: uniform field inside (like bar magnet); used as electromagnet',
        'Motor: electrical → mechanical; uses Fleming\'s LEFT hand rule',
        'Generator: mechanical → electrical; uses Fleming\'s RIGHT hand rule',
        'EMF = −N × ΔΦ/Δt (Faraday\'s law); direction by Lenz\'s law (opposes change)',
        'Domestic circuits: live (red, 220V), neutral (black, 0V), earth (green, safety)',
        'Fuse: melts on overload/short circuit; earth wire prevents shock',
      ],
      formulaRevision: [
        'F = BIL (force on current-carrying conductor)',
        'EMF = −N × ΔΦ/Δt (Faraday\'s law of induction)',
        'Left hand: Forefinger = Field, Middle = Current, Thumb = Force/Motion',
        'Right hand: Forefinger = Field, Thumb = Motion, Middle = Induced Current',
      ],
      importantDefinitions: [
        'Electromagnetic induction: production of EMF when magnetic flux through a coil changes (Faraday)',
        'Solenoid: a coil of insulated wire that produces a uniform magnetic field inside (like a bar magnet)',
      ],
      commonMistakes: [
        'Confusing Fleming\'s left-hand (motor) with right-hand (generator) rule',
        'Forgetting that magnetic field lines never intersect',
      ],
      examTricks: [
        'Left hand = Motor (MOTor = MOTion); Right hand = Generator (GENerator = GENerates current)',
        'Wire colours: Red = Live, Black = Neutral, Green = Earth',
      ],
      frequentlyConfused: [
        { pair: 'Electric Motor vs Generator', difference: 'Motor: electrical → mechanical, left-hand rule; Generator: mechanical → electrical, right-hand rule' },
      ],
      oneLookRevision: [
        'Motor = electrical → mechanical (left hand); Generator = mechanical → electrical (right hand)',
        'Field lines: closed loops, never intersect, denser = stronger',
        'Domestic: Live (red, 220V), Neutral (black, 0V), Earth (green, safety)',
      ],
      doNotForget: [
        'Left hand = Motor (MOTor = MOTion); Right hand = Generator (GENerator = GENerates current)',
        'Magnetic field lines never intersect each other',
        'AC reverses direction periodically; DC flows in one direction',
        'In India, AC frequency = 50 Hz (changes direction 100 times per second)',
        'Earth wire connects metal body to ground — prevents electric shock on fault',
        'Short circuit = live touches neutral directly; Overloading = too many appliances on one circuit',
      ],
      examChecklist: [
        'Be able to draw field lines around a bar magnet, straight wire, and solenoid',
        'Know the difference between motor and generator (energy, principle, rule)',
        'Explain domestic circuit: live, neutral, earth wire colours and functions',
        'Practise Fleming\'s left-hand and right-hand rule applications',
      ],
    },
  },

  'sources-of-energy': {
    examMeta: {
      expectedMarks: { '1M': 1, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'Medium',
      highPriorityTopics: [
        { topic: 'Conventional vs non-conventional energy sources', priority: 4, reason: 'Common 3M comparison question' },
        { topic: 'Solar, wind, and nuclear energy', priority: 4, reason: 'Frequent 2M or 3M' },
        { topic: 'Biogas plant and its advantages', priority: 4, reason: 'Regular 3M question' },
        { topic: 'Greenhouse effect and fossil fuels', priority: 3, reason: 'Common 2M question' },
      ],
      boardKeywords: ['renewable', 'non-renewable', 'fossil fuels', 'solar energy', 'wind energy', 'biogas', 'nuclear fission', 'greenhouse effect', 'chain reaction', 'renewable energy'],
      importantTables: [
        {
          title: 'Conventional vs Non-conventional Energy',
          headers: ['Feature', 'Conventional', 'Non-conventional'],
          rows: [
            ['Examples', 'Coal, petroleum, natural gas', 'Solar, wind, nuclear, biogas'],
            ['Availability', 'Limited (non-renewable)', 'Unlimited (renewable, except nuclear)'],
            ['Pollution', 'High (CO₂, SO₂)', 'Low to none'],
            ['Sustainability', 'Not sustainable', 'Sustainable'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Renewable: solar, wind, hydro, geothermal, tidal, biomass',
        'Non-renewable: coal, petroleum, natural gas (fossil fuels)',
        'Biogas: 60-70% methane (CH₄) from anaerobic decomposition of dung/waste',
        'Nuclear fission: U-235 splits → enormous energy + chain reaction',
        'Solar energy: clean, renewable; photovoltaic cells convert sunlight to electricity',
        'Greenhouse gases: CO₂, CH₄, water vapour — trap heat in atmosphere',
        'Fossil fuels: formed over millions of years → non-renewable; burning causes pollution',
      ],
      formulaRevision: [
        'Energy = Power × Time (E = P × t)',
        '1 kWh = 1000 W × 1 h = 3.6 × 10⁶ J',
        'Biogas: ~60-70% CH₄ + 30-40% CO₂',
        'Nuclear fission: ²³⁵U + ¹n → Ba + Kr + 3¹n + energy',
      ],
      importantDefinitions: [
        'Renewable energy: energy from sources that can be replenished naturally (solar, wind, hydro)',
        'Greenhouse effect: trapping of heat by certain gases in the atmosphere (CO₂, CH₄)',
      ],
      commonMistakes: [
        'Confusing renewable (solar, wind) with non-renewable (coal, petroleum)',
        'Forgetting that nuclear energy produces radioactive waste despite being clean',
      ],
      examTricks: [
        'Biogas = 60-70% methane (CH₄) from anaerobic decomposition',
        'Solar is cleanest: no pollution, no waste, renewable',
      ],
      frequentlyConfused: [
        { pair: 'Renewable vs Non-renewable Energy', difference: 'Renewable = solar, wind, hydro (replenishable); Non-renewable = coal, petroleum, natural gas (finite, millions of years to form)' },
      ],
      oneLookRevision: [
        'Renewable: solar, wind, hydro, geothermal, biomass',
        'Biogas: 60-70% CH₄; slurry = organic manure',
        'Nuclear fission: U-235 splits → huge energy + chain reaction',
      ],
      doNotForget: [
        'Biogas slurry is excellent organic manure (by-product)',
        'Nuclear energy: no CO₂ but radioactive waste is hazardous',
        'Solar energy is the cleanest — no pollution, no waste',
        'Hydroelectric dams: renewable but displace people and affect ecosystems',
        'Wind energy: clean but requires consistent wind and large area',
      ],
      examChecklist: [
        'Be able to compare renewable vs non-renewable sources in a table',
        'Know biogas composition, production process, and advantages',
        'Understand nuclear fission: chain reaction, U-235 fuel, controlled vs uncontrolled',
        'Know greenhouse gases and their effect on climate',
      ],
    },
  },

  'our-environment': {
    examMeta: {
      expectedMarks: { '1M': 2, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'Very High',
      highPriorityTopics: [
        { topic: 'Food chain, food web, and trophic levels', priority: 5, reason: 'Almost guaranteed — 3M question' },
        { topic: '10% law of energy transfer', priority: 5, reason: 'Frequent numerical 3M question' },
        { topic: 'Ozone layer formation and depletion by CFCs', priority: 5, reason: 'Regular 3M question' },
        { topic: 'Biodegradable vs non-biodegradable waste', priority: 4, reason: 'Common 2M or 3M' },
        { topic: 'Biological magnification', priority: 4, reason: 'Frequent 3M question with example' },
      ],
      boardKeywords: ['ecosystem', 'producer', 'consumer', 'decomposer', 'trophic level', 'food chain', 'food web', '10% law', 'biodegradable', 'non-biodegradable', 'ozone layer', 'CFCs', 'biological magnification', 'Montreal Protocol'],
      importantTables: [
        {
          title: 'Trophic Levels',
          headers: ['Level', 'Organism Type', 'Example'],
          rows: [
            ['T1 (Producer)', 'Autotrophs (plants)', 'Grass, algae'],
            ['T2 (Primary consumer)', 'Herbivores', 'Grasshopper, deer'],
            ['T3 (Secondary consumer)', 'Small carnivores', 'Frog, snake'],
            ['T4 (Tertiary consumer)', 'Top carnivores', 'Hawk, lion'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Ecosystem = biotic (living) + abiotic (non-living) components',
        'Food chain: linear energy flow; Food web: interconnected chains',
        '10% law: only 10% energy transfers to next trophic level; rest lost as heat',
        'Energy flow is unidirectional (sun → producers → consumers → heat)',
        'Biodegradable: vegetable peels, paper, cloth; Non-biodegradable: plastic, glass, metal',
        'Ozone (O₃) in stratosphere absorbs UV radiation; CFCs deplete it (Cl + O₃ → ClO + O₂)',
        'Biological magnification: toxins concentrate at higher trophic levels (e.g., DDT)',
        'Montreal Protocol (1987): phased out CFCs to protect ozone layer',
      ],
      formulaRevision: [
        'Energy at T(n+1) = 10% of energy at T(n)',
        'Ozone formation: O₂ + O → O₃ (UV-driven, stratosphere)',
        'Ozone depletion: Cl + O₃ → ClO + O₂ (CFCs release chlorine)',
        'Example: Grass (10000 J) → Grasshopper (1000 J) → Frog (100 J) → Snake (10 J)',
      ],
      importantDefinitions: [
        'Ecosystem: self-contained unit of biotic (living) and abiotic (non-living) components interacting together',
        'Biological magnification: accumulation of non-biodegradable toxins in increasing concentrations at higher trophic levels',
      ],
      commonMistakes: [
        'Confusing energy flow (unidirectional) with nutrient cycling (circular)',
        'Thinking CFCs form ozone — they DEPLETE it; ozone forms naturally from O₂ + O',
      ],
      examTricks: [
        '10% law: only 10% energy transfers to next trophic level; rest lost as heat',
        'Ozone: O₃ saves from UV; CFC kills O₃ (Cl + O₃ → ClO + O₂)',
      ],
      frequentlyConfused: [
        { pair: 'Food Chain vs Food Web', difference: 'Food chain = linear sequence of energy flow; Food web = interconnected network of all food chains' },
      ],
      oneLookRevision: [
        '10% law: energy at T(n+1) = 10% of T(n); energy flow is unidirectional',
        'Ozone: O₂ + O → O₃ (formation); Cl + O₃ → ClO + O₂ (depletion by CFCs)',
        'Biodegradable = can rot (peels, paper); Non-biodegradable = cannot rot (plastic, glass)',
      ],
      doNotForget: [
        'Energy flow is unidirectional — does NOT cycle back; only nutrients cycle',
        'Decomposers are NOT a trophic level — they break down all levels',
        'Ozone forms naturally (O₂ + O); CFCs DEPLETE ozone, they do not form it',
        'Biological magnification affects only non-biodegradable toxins (e.g., DDT, mercury)',
        'Top predators have highest toxin concentration (humans, hawks)',
        'CFCs were used in refrigerants and aerosols — now banned by Montreal Protocol',
      ],
      examChecklist: [
        'Be able to draw a food chain and label trophic levels',
        'Practise 10% law numericals (energy at each level)',
        'Explain ozone formation and depletion with equations',
        'Know biological magnification with a specific DDT example',
        'Differentiate biodegradable vs non-biodegradable with examples',
      ],
    },
  },

  'sustainable-management': {
    examMeta: {
      expectedMarks: { '1M': 1, '2M': 1, '3M': 1, '5M': 0 },
      pyqFrequency: 'Medium',
      highPriorityTopics: [
        { topic: '3Rs — Reduce, Reuse, Recycle', priority: 4, reason: 'Frequent 2M or 3M question' },
        { topic: 'Water conservation and rainwater harvesting', priority: 4, reason: 'Common 3M question' },
        { topic: 'Forest conservation (Chipko, Amrita Devi Bishnoi)', priority: 3, reason: 'Regular 2M or 3M' },
        { topic: 'Fossil fuels and their environmental impact', priority: 3, reason: 'Common 2M' },
      ],
      boardKeywords: ['sustainable development', '3Rs', 'rainwater harvesting', 'drip irrigation', 'Chipko Movement', 'Amrita Devi Bishnoi', 'Ganga Action Plan', 'non-renewable', 'fossil fuels', 'coal', 'petroleum'],
      importantTables: [
        {
          title: '3Rs of Waste Management',
          headers: ['R', 'Action', 'Example'],
          rows: [
            ['Reduce', 'Use less', 'Use less electricity, water, paper'],
            ['Reuse', 'Use again instead of discarding', 'Reuse bottles, bags, containers'],
            ['Recycle', 'Process waste into new products', 'Recycle paper, plastic, metal'],
          ],
        },
      ],
    },
    lastMinuteShot: {
      rapidRevision: [
        'Sustainable development: meet present needs without compromising future generations',
        '3Rs priority order: Reduce > Reuse > Recycle (reduce is most important)',
        '5Rs: Refuse, Reduce, Reuse, Recycle, Repurpose',
        'Water conservation: rainwater harvesting, drip irrigation, fixing leaks',
        'Forests: maintain biodiversity, water cycle, soil, climate',
        'Chipko Movement: villagers hugged trees to prevent felling (Uttarakhand)',
        'Amrita Devi Bishnoi: sacrificed life to protect Khejri trees (Rajasthan, 363 people)',
        'Ganga Action Plan (1985): treat domestic and industrial waste before entering river',
        'Fossil fuels: coal, petroleum, natural gas — non-renewable, cause pollution',
      ],
      formulaRevision: [
        '3Rs priority: Reduce > Reuse > Recycle',
        'Water saved = % supplied by harvesting × total usage',
        'Coal: C + O₂ → CO₂ + heat (greenhouse gas)',
        'Acid rain: S + O₂ → SO₂ → H₂SO₄ (with water)',
      ],
      importantDefinitions: [
        'Sustainable development: meeting present needs without compromising future generations\' ability to meet theirs',
        'Rainwater harvesting: collecting and storing rainwater for reuse or groundwater recharge',
      ],
      commonMistakes: [
        'Confusing the 3Rs order — Reduce is first (most important), then Reuse, then Recycle',
        'Forgetting that coal and petroleum take millions of years to form (non-renewable)',
      ],
      examTricks: [
        '3Rs: Reduce before you Reuse, Reuse before you Recycle',
        'India: 16% of world population, only 4% of water resources',
      ],
      frequentlyConfused: [
        { pair: 'Reduce vs Reuse vs Recycle', difference: 'Reduce = use less; Reuse = use again; Recycle = process into new product. Priority: Reduce > Reuse > Recycle' },
      ],
      oneLookRevision: [
        '3Rs priority: Reduce > Reuse > Recycle',
        'Water: rainwater harvesting, drip irrigation, fix leaks',
        'Chipko = hug trees (Bahuguna); Bishnoi = protect Khejri (363 sacrificed)',
      ],
      doNotForget: [
        'India has 16% of world population but only 4% of water resources',
        'Drip irrigation: water delivered drop by drop at roots — minimal wastage',
        'Reduce is higher priority than Reuse; Reuse is higher than Recycle',
        'Fossil fuels take millions of years to form — cannot be replenished',
        'Burning coal releases CO₂ (greenhouse) and SO₂ (acid rain)',
        'Quote: "We have not inherited the Earth from our ancestors; we have borrowed it from our children"',
      ],
      examChecklist: [
        'Know the 3Rs in priority order with examples',
        'Be able to explain rainwater harvesting and its advantages',
        'Know Chipko Movement and Amrita Devi Bishnoi sacrifice',
        'Understand why fossil fuels are non-renewable and their environmental impact',
      ],
    },
  },
};
