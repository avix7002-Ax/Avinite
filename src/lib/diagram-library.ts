export interface DiagramInfo {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  keywords: string[];
  description: string;
  svg: string;
}

const svgWrap = (inner: string, viewBox: string) => `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:400px;display:block;border-radius:12px;background:transparent">` + inner + `</svg>`;

const label = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start') =>
  `<text x="${x}" y="${y}" font-size="12" font-weight="600" text-anchor="${anchor}" fill="currentColor" opacity="0.85">${text}</text>`;

const arrowMarker = (id: string, color: string) =>
  `<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L0,8 L8,4 z" fill="${color}" opacity="0.6"/></marker></defs>`;

export const DIAGRAM_LIBRARY: DiagramInfo[] = [
  {
    id: 'photosynthesis',
    title: 'Photosynthesis Process',
    subject: 'Biology',
    keywords: ['photosynthesis', 'chlorophyll', 'glucose', 'leaf', 'chloroplast', 'calvin'],
    description: 'How plants convert light energy into chemical energy (glucose).',
    svg: svgWrap(
      `<rect x="80" y="200" width="220" height="100" rx="8" fill="#22c55e" opacity="0.08" stroke="#15803d" strokeWidth="2"/>
      <line x1="250" y1="20" x2="190" y2="200" stroke="#fbbf24" stroke-width="3" marker-end="url(#sunArrow)" opacity="0.5"/>
      <text x="250" y="18" font-size="12" font-weight="600" fill="#f59e0b" opacity="0.7">Sunlight</text>
      <circle cx="190" cy="250" r="40" fill="#22c55e" opacity="0.12" stroke="#15803d" stroke-width="2"/>
      <text x="190" y="255" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">Chloroplast</text>
      <text x="60" y="250" font-size="13" font-weight="600" fill="#3b82f6" opacity="0.7">CO₂ + H₂O</text>
      <line x1="100" y1="255" x2="150" y2="255" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <text x="320" y="250" font-size="13" font-weight="600" fill="#22c55e" opacity="0.7">→ Glucose + O₂</text>
      <line x1="300" y1="255" x2="340" y2="255" stroke="#22c55e" stroke-width="2" opacity="0.5"/>
      <text x="190" y="320" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</text>`,
      '0 0 500 340'
    ),
  },
  {
    id: 'human-heart',
    title: 'Human Heart — Double Circulation',
    subject: 'Biology',
    keywords: ['heart', 'circulation', 'cardiac', 'ventricle', 'atrium', 'blood vessel', 'double circulation', 'artery', 'vein'],
    description: 'Structure of the human heart showing chambers and blood flow.',
    svg: svgWrap(
      `${arrowMarker('hrtArrow', '#ef4444')}
      <path d="M 150 140 Q 120 120 130 180 Q 140 240 190 260 Q 240 240 250 180 Q 260 120 230 140 Q 210 120 190 140 Q 170 120 150 140 Z" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2.5"/>
      <line x1="190" y1="145" x2="190" y2="255" stroke="#b91c1c" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,3"/>
      <line x1="145" y1="190" x2="235" y2="190" stroke="#b91c1c" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,3"/>
      ${label(165, 172, 'RA', 'middle')}
      ${label(215, 172, 'LA', 'middle')}
      ${label(165, 230, 'RV', 'middle')}
      ${label(215, 230, 'LV', 'middle')}
      <path d="M 120 170 L 145 165" stroke="#3b82f6" stroke-width="2.5" opacity="0.5" fill="none"/>
      <text x="90" y="165" font-size="10" font-weight="600" fill="#3b82f6" opacity="0.7">Vena Cava</text>
      <path d="M 260 165 L 235 160" stroke="#ef4444" stroke-width="2.5" opacity="0.5" fill="none"/>
      <text x="265" y="160" font-size="10" font-weight="600" fill="#ef4444" opacity="0.7">Aorta</text>
      <path d="M 255 200 L 230 200" stroke="#3b82f6" stroke-width="2" opacity="0.4" fill="none"/>
      <text x="260" y="205" font-size="9" font-weight="600" fill="#3b82f6" opacity="0.6">Pulmonary A.</text>
      <text x="190" y="295" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Human Heart — 4 Chambers (RA, LA, RV, LV)</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'nephron',
    title: 'Nephron — Excretory System',
    subject: 'Biology',
    keywords: ['nephron', 'kidney', 'excretion', 'urine', 'glomerulus', 'bowman'],
    description: 'Structure of a nephron showing filtration and reabsorption.',
    svg: svgWrap(
      `<circle cx="180" cy="120" r="30" fill="#3b82f6" opacity="0.1" stroke="#1d4ed8" stroke-width="2"/>
      <text x="180" y="125" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Bowman's Capsule</text>
      <path d="M 210 130 Q 280 140 290 200 Q 295 260 260 280 Q 220 270 210 220 Q 200 180 180 150" fill="none" stroke="#22c55e" stroke-width="2.5" opacity="0.5"/>
      <text x="310" y="220" font-size="10" font-weight="600" fill="#22c55e" opacity="0.6">Loop of Henle</text>
      <line x1="180" y1="90" x2="180" y2="60" stroke="#ef4444" stroke-width="2" opacity="0.4"/>
      <text x="150" y="55" font-size="10" font-weight="600" fill="#ef4444" opacity="0.6">Afferent</text>
      <text x="190" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Nephron — Filtration Unit of Kidney</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'neuron',
    title: 'Neuron Structure',
    subject: 'Biology',
    keywords: ['neuron', 'nerve', 'axon', 'dendrite', 'synapse', 'nervous', 'control coordination'],
    description: 'Structure of a neuron with dendrites, axon, and synapse.',
    svg: svgWrap(
      `<circle cx="100" cy="160" r="25" fill="#8b5cf6" opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
      <line x1="75" y1="140" x2="60" y2="120" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>
      <line x1="70" y1="160" x2="45" y2="160" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>
      <line x1="75" y1="180" x2="60" y2="200" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>
      <text x="35" y="110" font-size="10" font-weight="600" fill="#7c3aed" opacity="0.6">Dendrites</text>
      <rect x="125" y="155" width="250" height="10" rx="5" fill="#fbbf24" opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="220" y="145" font-size="10" font-weight="600" fill="#f59e0b" opacity="0.6">Axon</text>
      <ellipse cx="390" cy="160" rx="30" ry="15" fill="#22c55e" opacity="0.1" stroke="#15803d" stroke-width="1.5"/>
      <text x="390" y="164" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Synapse</text>
      <text x="220" y="210" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Neuron — Dendrite → Cell Body → Axon → Synapse</text>`,
      '0 0 500 240'
    ),
  },
  {
    id: 'stomata',
    title: 'Stomata — Gas Exchange',
    subject: 'Biology',
    keywords: ['stomata', 'stoma', 'guard cell', 'transpiration', 'gas exchange', 'leaf'],
    description: 'Open and closed stomata with guard cells.',
    svg: svgWrap(
      `<path d="M 120 140 Q 180 100 240 140" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.5"/>
      <path d="M 120 220 Q 180 260 240 220" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.5"/>
      <ellipse cx="180" cy="180" rx="15" ry="40" fill="currentColor" opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <text x="100" y="135" font-size="10" font-weight="600" fill="#22c55e" opacity="0.6">Open Stoma</text>
      <path d="M 310 150 Q 370 140 430 150" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.5"/>
      <path d="M 310 210 Q 370 220 430 210" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.5"/>
      <ellipse cx="370" cy="180" rx="5" ry="30" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1.5"/>
      <text x="320" y="135" font-size="10" font-weight="600" fill="#22c55e" opacity="0.6">Closed Stoma</text>
      <text x="250" y="280" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Stomata — Open vs Closed (Guard Cells)</text>`,
      '0 0 500 300'
    ),
  },
  {
    id: 'digestive-system',
    title: 'Human Digestive System',
    subject: 'Biology',
    keywords: ['digestive', 'digestion', 'stomach', 'intestine', 'esophagus', 'liver', 'pancreas'],
    description: 'Major organs of the human digestive system.',
    svg: svgWrap(
      `<line x1="200" y1="30" x2="200" y2="130" stroke="#f59e0b" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
      <text x="210" y="80" font-size="10" font-weight="600" fill="#f59e0b" opacity="0.6">Esophagus</text>
      <ellipse cx="200" cy="150" rx="40" ry="30" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2"/>
      <text x="200" y="155" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Stomach</text>
      <path d="M 170 180 Q 200 200 170 230 Q 140 260 190 270 Q 260 260 280 220 Q 300 180 260 170" fill="none" stroke="#f97316" stroke-width="3" opacity="0.5"/>
      <text x="280" y="240" font-size="10" font-weight="600" fill="#f97316" opacity="0.6">Small Intestine</text>
      <path d="M 140 280 Q 100 300 120 320 Q 160 335 200 320" fill="none" stroke="#a855f7" stroke-width="3" opacity="0.4"/>
      <text x="100" y="310" font-size="9" font-weight="600" fill="#a855f7" opacity="0.5">Large Intestine</text>
      <ellipse cx="260" cy="120" rx="25" ry="18" fill="#8b5cf6" opacity="0.1" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="260" y="124" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Liver</text>
      <text x="200" y="360" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Human Digestive System</text>`,
      '0 0 500 380'
    ),
  },
  {
    id: 'convex-lens',
    title: 'Convex Lens — Ray Diagram',
    subject: 'Physics',
    keywords: ['convex lens', 'lens', 'ray diagram', 'refraction', 'focal point', 'converging lens', 'image formation'],
    description: 'Ray diagram for a convex lens showing image formation.',
    svg: svgWrap(
      `${arrowMarker('cArrow1', '#ef4444')}
      <line x1="20" y1="170" x2="480" y2="170" stroke="currentColor" stroke-width="1" stroke-dasharray="6,4" opacity="0.3"/>
      <ellipse cx="250" cy="170" rx="14" ry="100" fill="#3b82f6" opacity="0.08" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="180" cy="170" r="3.5" fill="#ef4444"/>
      <circle cx="320" cy="170" r="3.5" fill="#ef4444"/>
      ${label(180, 190, 'F', 'middle')}
      ${label(320, 190, 'F', 'middle')}
      <circle cx="110" cy="170" r="3.5" fill="#6b7280"/>
      <circle cx="390" cy="170" r="3.5" fill="#6b7280"/>
      ${label(110, 190, '2F', 'middle')}
      ${label(390, 190, '2F', 'middle')}
      <line x1="130" y1="170" x2="130" y2="100" stroke="#22c55e" stroke-width="2.5" marker-end="url(#cArrow1)"/>
      ${label(120, 95, 'O', 'end')}
      <line x1="130" y1="100" x2="250" y2="100" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="100" x2="430" y2="240" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="130" y1="100" x2="430" y2="240" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
      <line x1="370" y1="170" x2="370" y2="240" stroke="#ef4444" stroke-width="2.5" marker-end="url(#cArrow1)"/>
      ${label(380, 250, 'I', 'start')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Convex Lens — Object beyond 2F (Real, Inverted, Diminished)</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'concave-mirror',
    title: 'Concave Mirror — Ray Diagram',
    subject: 'Physics',
    keywords: ['concave mirror', 'mirror', 'ray diagram', 'reflection', 'focal point', 'converging mirror'],
    description: 'Ray diagram for a concave mirror showing image formation.',
    svg: svgWrap(
      `${arrowMarker('mArrow1', '#ef4444')}
      <line x1="20" y1="150" x2="480" y2="150" stroke="currentColor" stroke-width="1" stroke-dasharray="6,4" opacity="0.3"/>
      <path d="M 250 60 Q 280 150 250 240" fill="none" stroke="#1d4ed8" stroke-width="3"/>
      <g opacity="0.2">` + [60,80,100,120,140,160,180,200,220,240].map(y => `<line x1="250" y1="${y+8}" x2="262" y2="${y}" stroke="currentColor" stroke-width="0.8"/>`).join('') + `</g>
      <circle cx="200" cy="150" r="3.5" fill="#ef4444"/>
      <circle cx="140" cy="150" r="3.5" fill="#6b7280"/>
      ${label(200, 170, 'F', 'middle')}
      ${label(140, 170, 'C', 'middle')}
      <line x1="140" y1="150" x2="140" y2="80" stroke="#22c55e" stroke-width="2.5" marker-end="url(#mArrow1)"/>
      ${label(130, 75, 'O', 'end')}
      <line x1="140" y1="80" x2="250" y2="80" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="80" x2="50" y2="220" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="140" y1="80" x2="250" y2="105" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="105" x2="50" y2="150" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
      <line x1="140" y1="150" x2="140" y2="220" stroke="#ef4444" stroke-width="2.5" marker-end="url(#mArrow1)"/>
      ${label(130, 235, 'I', 'end')}
      <text x="250" y="285" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Concave Mirror — Object at C (Real, Inverted, Same Size)</text>`,
      '0 0 500 300'
    ),
  },
  {
    id: 'prism-dispersion',
    title: 'Prism — Dispersion of Light',
    subject: 'Physics',
    keywords: ['prism', 'dispersion', 'vibgyor', 'spectrum', 'rainbow', 'refraction', 'white light'],
    description: 'White light splitting into VIBGYOR colours through a prism.',
    svg: svgWrap(
      `<line x1="30" y1="110" x2="210" y2="160" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
      ${label(35, 100, 'White Light', 'start')}
      <polygon points="250,60 200,220 300,220" fill="currentColor" opacity="0.06" stroke="#6b7280" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="90" stroke="#ef4444" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="110" stroke="#f97316" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="130" stroke="#eab308" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="150" stroke="#22c55e" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="170" stroke="#3b82f6" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="190" stroke="#6366f1" stroke-width="2"/>
      <line x1="210" y1="160" x2="480" y2="210" stroke="#a855f7" stroke-width="2"/>
      <text x="485" y="93" font-size="10" font-weight="600" fill="#ef4444">Red</text>
      <text x="485" y="113" font-size="10" font-weight="600" fill="#f97316">Orange</text>
      <text x="485" y="133" font-size="10" font-weight="600" fill="#eab308">Yellow</text>
      <text x="485" y="153" font-size="10" font-weight="600" fill="#22c55e">Green</text>
      <text x="485" y="173" font-size="10" font-weight="600" fill="#3b82f6">Blue</text>
      <text x="485" y="193" font-size="10" font-weight="600" fill="#6366f1">Indigo</text>
      <text x="485" y="213" font-size="10" font-weight="600" fill="#a855f7">Violet</text>
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Prism — Dispersion of White Light into VIBGYOR</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'human-eye',
    title: 'Human Eye Structure',
    subject: 'Physics',
    keywords: ['human eye', 'eye', 'retina', 'cornea', 'lens', 'pupil', 'iris', 'myopia', 'hypermetropia'],
    description: 'Cross-section of the human eye showing major parts.',
    svg: svgWrap(
      `${arrowMarker('eyeArrow', '#3b82f6')}
      <circle cx="280" cy="160" r="90" fill="currentColor" opacity="0.05" stroke="#6b7280" stroke-width="2.5"/>
      <path d="M 195 130 Q 185 160 195 190" fill="currentColor" opacity="0.06" stroke="#6b7280" stroke-width="1.5"/>
      <ellipse cx="215" cy="160" rx="9" ry="26" fill="#fbbf24" opacity="0.1" stroke="#92400e" stroke-width="1.5"/>
      <path d="M 340 85 Q 365 160 340 235" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      ${label(365, 160, 'Retina', 'start')}
      <line x1="40" y1="130" x2="195" y2="142" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="40" y1="160" x2="195" y2="160" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="40" y1="190" x2="195" y2="178" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      ${label(45, 120, 'Light', 'start')}
      ${label(200, 120, 'Cornea', 'middle')}
      ${label(215, 200, 'Lens', 'middle')}
      <text x="280" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Human Eye — Cornea, Lens, Retina</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'electric-circuit',
    title: "Electric Circuit — Ohm's Law",
    subject: 'Physics',
    keywords: ['electric circuit', 'circuit', 'ohms law', 'ammeter', 'voltmeter', 'resistor', 'battery', 'current'],
    description: 'Simple electric circuit with battery, ammeter, voltmeter, and resistor.',
    svg: svgWrap(
      `${arrowMarker('cArrow2', '#ef4444')}
      <line x1="70" y1="90" x2="70" y2="210" stroke="currentColor" stroke-width="2"/>
      <line x1="55" y1="110" x2="85" y2="110" stroke="currentColor" stroke-width="4"/>
      <line x1="62" y1="125" x2="78" y2="125" stroke="currentColor" stroke-width="2"/>
      <line x1="55" y1="145" x2="85" y2="145" stroke="currentColor" stroke-width="4"/>
      ${label(40, 230, 'Battery', 'middle')}
      <line x1="70" y1="90" x2="210" y2="90" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <line x1="70" y1="210" x2="210" y2="210" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <circle cx="230" cy="90" r="20" fill="#fbbf24" opacity="0.06" stroke="#92400e" stroke-width="2"/>
      <text x="230" y="95" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">A</text>
      <line x1="250" y1="90" x2="330" y2="90" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <polyline points="330,90 348,80 360,100 372,80 384,100 396,80 404,90" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      ${label(370, 70, 'R', 'middle')}
      <circle cx="372" cy="165" r="18" fill="#3b82f6" opacity="0.06" stroke="#1d4ed8" stroke-width="2"/>
      <text x="372" y="170" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">V</text>
      ${label(372, 195, 'Voltmeter', 'middle')}
      <text x="250" y="285" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Electric Circuit — Battery, Ammeter, Voltmeter, Resistor</text>`,
      '0 0 500 300'
    ),
  },
  {
    id: 'magnetic-field',
    title: 'Magnetic Field — Solenoid',
    subject: 'Physics',
    keywords: ['magnetic field', 'solenoid', 'bar magnet', 'field lines', 'electromagnet', 'magnetic effect'],
    description: 'Magnetic field lines around a solenoid, resembling a bar magnet.',
    svg: svgWrap(
      `${arrowMarker('sArrow', '#3b82f6')}
      ` + [120,145,170,195,220,245,270,295,320,345].map(x => `<ellipse cx="${x}" cy="150" rx="12" ry="45" fill="none" stroke="#92400e" stroke-width="1.5" opacity="0.4"/>`).join('') + `
      <line x1="100" y1="125" x2="365" y2="125" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#sArrow)" opacity="0.5"/>
      <line x1="100" y1="150" x2="365" y2="150" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#sArrow)" opacity="0.5"/>
      <line x1="100" y1="175" x2="365" y2="175" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#sArrow)" opacity="0.5"/>
      <rect x="100" y="135" width="20" height="30" rx="3" fill="#ef4444" opacity="0.12" stroke="#b91c1c" stroke-width="1.5"/>
      <text x="110" y="155" font-size="14" text-anchor="middle" fill="#b91c1c" opacity="0.7" font-weight="700">S</text>
      <rect x="365" y="135" width="20" height="30" rx="3" fill="#3b82f6" opacity="0.12" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="375" y="155" font-size="14" text-anchor="middle" fill="#1d4ed8" opacity="0.7" font-weight="700">N</text>
      <text x="250" y="280" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Solenoid — Uniform Magnetic Field (Like a Bar Magnet)</text>`,
      '0 0 500 300'
    ),
  },
  {
    id: 'atomic-structure',
    title: 'Atomic Structure',
    subject: 'Chemistry',
    keywords: ['atomic structure', 'atom', 'nucleus', 'electron', 'proton', 'neutron', 'shell', 'bohr'],
    description: 'Bohr model of an atom showing nucleus and electron shells.',
    svg: svgWrap(
      `<circle cx="250" cy="160" r="60" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.35"/>
      <circle cx="250" cy="160" r="100" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.3"/>
      <circle cx="250" cy="160" r="140" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.25"/>
      <circle cx="250" cy="160" r="32" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="2"/>
      <text x="250" y="157" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="600">Nucleus</text>
      <text x="250" y="170" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.6">p⁺ + n⁰</text>
      <circle cx="250" cy="100" r="6" fill="#3b82f6" opacity="0.6"/>
      <circle cx="250" cy="220" r="6" fill="#3b82f6" opacity="0.6"/>
      ` + [[250,60],[310,100],[340,160],[310,220],[250,260],[190,220],[160,160],[190,100]].map(([cx,cy]) => `<circle cx="${cx}" cy="${cy}" r="6" fill="#3b82f6" opacity="0.6"/>`).join('') + `
      ${label(250, 48, 'K shell (2e⁻)', 'middle')}
      ${label(350, 90, 'L shell (8e⁻)', 'start')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Atomic Structure — Nucleus and Electron Shells</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'electrolysis',
    title: 'Electrolysis of Brine (Chlor-Alkali)',
    subject: 'Chemistry',
    keywords: ['electrolysis', 'brine', 'chlor-alkali', 'cathode', 'anode', 'nacl', 'electrolytic cell'],
    description: 'Electrolysis of brine showing chlorine, hydrogen, and NaOH production.',
    svg: svgWrap(
      `<path d="M 140 90 L 140 270 Q 140 290 160 290 L 340 290 Q 360 290 360 270 L 360 90" fill="#3b82f6" opacity="0.06" stroke="#6b7280" stroke-width="2"/>
      <rect x="175" y="90" width="10" height="160" fill="#3b82f6" opacity="0.15" stroke="#1d4ed8" stroke-width="1.5"/>
      ${label(180, 80, 'Cathode (−)', 'middle')}
      <rect x="315" y="90" width="10" height="160" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="1.5"/>
      ${label(320, 80, 'Anode (+)', 'middle')}
      <text x="250" y="275" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.5">Brine (NaCl)</text>
      <text x="155" y="220" font-size="10" fill="#22c55e" opacity="0.6" font-weight="600">H₂↑</text>
      <text x="340" y="220" font-size="10" fill="#fbbf24" opacity="0.6" font-weight="600">Cl₂↑</text>
      <text x="250" y="180" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.4">NaOH</text>
      <text x="250" y="320" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Chlor-Alkali Process — Electrolysis of Brine</text>`,
      '0 0 500 340'
    ),
  },
  {
    id: 'soap-micelle',
    title: 'Soap Micelle Structure',
    subject: 'Chemistry',
    keywords: ['micelle', 'soap', 'detergent', 'hydrophilic', 'hydrophobic', 'emulsion', 'cleansing'],
    description: 'Soap micelle showing hydrophilic heads and hydrophobic tails trapping oil.',
    svg: svgWrap(
      `<circle cx="250" cy="170" r="95" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4,3" opacity="0.2"/>
      <circle cx="250" cy="170" r="28" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="250" y="173" font-size="10" text-anchor="middle" fill="#92400e" opacity="0.7" font-weight="600">Oil</text>
      ` + Array.from({length:18},(_,i)=>{const a=(i*20*Math.PI)/180;const x=250+88*Math.cos(a);const y=170+88*Math.sin(a);return `<circle cx="${x}" cy="${y}" r="7" fill="#3b82f6" opacity="0.25" stroke="#1d4ed8" stroke-width="1.2"/>`}).join('') + `
      ` + Array.from({length:18},(_,i)=>{const a=(i*20*Math.PI)/180;const x1=250+80*Math.cos(a);const y1=170+80*Math.sin(a);const x2=250+32*Math.cos(a);const y2=170+32*Math.sin(a);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#92400e" stroke-width="1.5" opacity="0.35"/>`}).join('') + `
      ${label(380, 90, 'Hydrophilic Head', 'start')}
      <text x="380" y="102" font-size="9" fill="currentColor" opacity="0.5">(water-loving)</text>
      ${label(380, 230, 'Hydrophobic Tail', 'start')}
      <text x="380" y="242" font-size="9" fill="currentColor" opacity="0.5">(oil-loving)</text>
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Soap Micelle — Heads Out, Tails Trap Oil</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'carbon-allotropes',
    title: 'Carbon Allotropes',
    subject: 'Chemistry',
    keywords: ['allotrope', 'diamond', 'graphite', 'fullerene', 'carbon', 'c60'],
    description: 'Diamond (tetrahedral), Graphite (layered), and Fullerene (C₆₀) structures.',
    svg: svgWrap(
      `<g transform="translate(120,130)">
      <line x1="0" y1="0" x2="35" y2="-35" stroke="#3b82f6" stroke-width="1.8" opacity="0.5"/>
      <line x1="0" y1="0" x2="-35" y2="-35" stroke="#3b82f6" stroke-width="1.8" opacity="0.5"/>
      <line x1="0" y1="0" x2="35" y2="35" stroke="#3b82f6" stroke-width="1.8" opacity="0.5"/>
      <line x1="0" y1="0" x2="-35" y2="35" stroke="#3b82f6" stroke-width="1.8" opacity="0.5"/>
      <circle cx="0" cy="0" r="7" fill="#3b82f6" opacity="0.3"/>
      ${label(0, 70, 'Diamond', 'middle')}
      <text x="0" y="83" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">(Tetrahedral)</text>
      </g>
      <g transform="translate(320,130)">
      <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" fill="#22c55e" opacity="0.06" stroke="#15803d" stroke-width="1.5"/>
      ${label(0, 105, 'Graphite', 'middle')}
      <text x="0" y="118" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">(Layered)</text>
      </g>
      <g transform="translate(250,260)">
      <circle cx="0" cy="0" r="22" fill="#fbbf24" opacity="0.06" stroke="#92400e" stroke-width="1.5"/>
      <text x="0" y="3" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">C₆₀</text>
      <text x="0" y="38" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">Fullerene</text>
      </g>
      <text x="250" y="315" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Carbon Allotropes — Diamond, Graphite, Fullerene</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'ethanol-structure',
    title: 'Ethanol (C₂H₅OH) Structure',
    subject: 'Chemistry',
    keywords: ['ethanol', 'alcohol', 'c2h5oh', 'hydroxyl', 'functional group', 'carbon compound'],
    description: 'Structural formula of ethanol showing C-C-O-H bonds.',
    svg: svgWrap(
      `<circle cx="140" cy="110" r="16" fill="#3b82f6" opacity="0.3" stroke="#1d4ed8" stroke-width="1.8"/>
      <text x="140" y="114" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">C</text>
      <line x1="156" y1="110" x2="224" y2="110" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <circle cx="240" cy="110" r="16" fill="#3b82f6" opacity="0.3" stroke="#1d4ed8" stroke-width="1.8"/>
      <text x="240" y="114" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">C</text>
      <line x1="256" y1="110" x2="294" y2="110" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <circle cx="310" cy="110" r="16" fill="#ef4444" opacity="0.3" stroke="#b91c1c" stroke-width="1.8"/>
      <text x="310" y="114" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">O</text>
      <line x1="326" y1="110" x2="364" y2="110" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <text x="374" y="114" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">H</text>
      <text x="140" y="195" font-size="10" text-anchor="middle" fill="#3b82f6" opacity="0.6" font-weight="600">CH₃</text>
      <text x="240" y="195" font-size="10" text-anchor="middle" fill="#3b82f6" opacity="0.6" font-weight="600">CH₂</text>
      <text x="310" y="195" font-size="10" text-anchor="middle" fill="#ef4444" opacity="0.6" font-weight="600">OH</text>
      <text x="250" y="215" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Ethanol (C₂H₅OH) — Structural Formula</text>`,
      '0 0 500 220'
    ),
  },
  {
    id: 'reflex-arc',
    title: 'Reflex Arc',
    subject: 'Biology',
    keywords: ['reflex arc', 'reflex', 'spinal cord', 'reflex action', 'stimulus', 'response'],
    description: 'Pathway of a reflex arc from stimulus to response.',
    svg: svgWrap(
      `${arrowMarker('rArrow', '#3b82f6')}
      <circle cx="80" cy="160" r="15" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="2"/>
      <text x="80" y="164" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Stimulus</text>
      <line x1="95" y1="160" x2="160" y2="160" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <circle cx="180" cy="160" r="18" fill="#8b5cf6" opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
      <text x="180" y="163" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Sensory<br/>Neuron</text>
      <line x1="198" y1="160" x2="260" y2="120" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <ellipse cx="300" cy="110" rx="35" ry="20" fill="#fbbf24" opacity="0.1" stroke="#f59e0b" stroke-width="2"/>
      <text x="300" y="114" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Spinal Cord</text>
      <line x1="260" y1="110" x2="200" y2="110" stroke="#f59e0b" stroke-width="2" opacity="0.4"/>
      <line x1="200" y1="110" x2="200" y2="160" stroke="#f59e0b" stroke-width="2" opacity="0.4"/>
      <ellipse cx="360" cy="160" rx="18" ry="15" fill="#22c55e" opacity="0.12" stroke="#15803d" stroke-width="2"/>
      <text x="360" y="163" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Motor<br/>Neuron</text>
      <line x1="300" y1="115" x2="345" y2="150" stroke="#22c55e" stroke-width="2" opacity="0.5"/>
      <circle cx="420" cy="160" r="15" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="2"/>
      <text x="420" y="164" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Response</text>
      <line x1="378" y1="160" x2="405" y2="160" stroke="#22c55e" stroke-width="2" opacity="0.5"/>
      <text x="250" y="220" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Reflex Arc — Stimulus → Sensory → Spinal Cord → Motor → Response</text>`,
      '0 0 500 240'
    ),
  },
  {
    id: 'respiratory-system',
    title: 'Human Respiratory System',
    subject: 'Biology',
    keywords: ['respiratory', 'lung', 'breathing', 'trachea', 'alveoli', 'bronchi', 'respiration'],
    description: 'Major organs of the human respiratory system.',
    svg: svgWrap(
      `<line x1="200" y1="30" x2="200" y2="120" stroke="#3b82f6" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
      <text x="210" y="75" font-size="10" font-weight="600" fill="#3b82f6" opacity="0.6">Trachea</text>
      <line x1="200" y1="120" x2="160" y2="160" stroke="#3b82f6" stroke-width="3" opacity="0.5"/>
      <line x1="200" y1="120" x2="240" y2="160" stroke="#3b82f6" stroke-width="3" opacity="0.5"/>
      <ellipse cx="150" cy="220" rx="50" ry="70" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2"/>
      <ellipse cx="250" cy="220" rx="50" ry="70" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2"/>
      <text x="150" y="225" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Lung</text>
      <text x="250" y="225" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Lung</text>
      <text x="200" y="320" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Human Respiratory System</text>`,
      '0 0 500 340'
    ),
  },
  {
    id: 'concave-lens',
    title: 'Concave Lens — Ray Diagram',
    subject: 'Physics',
    keywords: ['concave lens', 'diverging lens', 'concave lens ray', 'negative lens'],
    description: 'Ray diagram for a concave lens showing virtual, erect, diminished image.',
    svg: svgWrap(
      `${arrowMarker('ccArrow', '#ef4444')}
      <line x1="20" y1="170" x2="480" y2="170" stroke="currentColor" stroke-width="1" stroke-dasharray="6,4" opacity="0.3"/>
      <ellipse cx="250" cy="170" rx="14" ry="100" fill="#3b82f6" opacity="0.08" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="180" cy="170" r="3.5" fill="#ef4444"/>
      <circle cx="320" cy="170" r="3.5" fill="#ef4444"/>
      ${label(180, 190, 'F', 'middle')}
      ${label(320, 190, 'F', 'middle')}
      <line x1="130" y1="170" x2="130" y2="100" stroke="#22c55e" stroke-width="2.5" marker-end="url(#ccArrow)"/>
      ${label(120, 95, 'O', 'end')}
      <line x1="130" y1="100" x2="250" y2="100" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="100" x2="130" y2="100" stroke="#f59e0b" stroke-width="1.5" opacity="0.4" stroke-dasharray="4,3"/>
      <line x1="250" y1="100" x2="480" y2="240" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="130" y1="100" x2="480" y2="240" stroke="#f59e0b" stroke-width="1.5" opacity="0.4"/>
      <line x1="130" y1="100" x2="130" y2="170" stroke="#ef4444" stroke-width="2" opacity="0.4" stroke-dasharray="4,3"/>
      ${label(115, 140, 'I', 'end')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Concave Lens — Virtual, Erect, Diminished Image</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'convex-mirror',
    title: 'Convex Mirror — Ray Diagram',
    subject: 'Physics',
    keywords: ['convex mirror', 'diverging mirror', 'convex mirror ray', 'rear view', 'side mirror'],
    description: 'Ray diagram for a convex mirror showing virtual, erect, diminished image.',
    svg: svgWrap(
      `${arrowMarker('cvArrow', '#ef4444')}
      <line x1="20" y1="150" x2="480" y2="150" stroke="currentColor" stroke-width="1" stroke-dasharray="6,4" opacity="0.3"/>
      <path d="M 250 60 Q 220 150 250 240" fill="none" stroke="#1d4ed8" stroke-width="3"/>
      <g opacity="0.2">` + [60,80,100,120,140,160,180,200,220,240].map(y => `<line x1="250" y1="${y}" x2="238" y2="${y-8}" stroke="currentColor" stroke-width="0.8"/>`).join('') + `</g>
      <circle cx="200" cy="150" r="3.5" fill="#ef4444"/>
      <circle cx="140" cy="150" r="3.5" fill="#6b7280"/>
      ${label(200, 170, 'F', 'middle')}
      ${label(140, 170, 'C', 'middle')}
      <line x1="140" y1="150" x2="140" y2="80" stroke="#22c55e" stroke-width="2.5" marker-end="url(#cvArrow)"/>
      ${label(130, 75, 'O', 'end')}
      <line x1="140" y1="80" x2="250" y2="80" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="80" x2="200" y2="150" stroke="#3b82f6" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,3"/>
      <line x1="200" y1="150" x2="140" y2="80" stroke="#f59e0b" stroke-width="1.5" opacity="0.4" stroke-dasharray="4,3"/>
      <line x1="140" y1="80" x2="250" y2="105" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
      <line x1="250" y1="105" x2="200" y2="150" stroke="#f59e0b" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,3"/>
      <line x1="140" y1="150" x2="140" y2="120" stroke="#ef4444" stroke-width="2" opacity="0.4" stroke-dasharray="4,3"/>
      ${label(115, 125, 'I', 'end')}
      <text x="250" y="285" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Convex Mirror — Virtual, Erect, Diminished (Used in Rear-View Mirrors)</text>`,
      '0 0 500 300'
    ),
  },
  {
    id: 'myopia',
    title: 'Myopia (Near-Sightedness) Correction',
    subject: 'Physics',
    keywords: ['myopia', 'near sighted', 'nearsighted', 'short sight', 'concave lens correction', 'myopia correction'],
    description: 'Myopia defect and correction using a concave lens.',
    svg: svgWrap(
      `${arrowMarker('myArrow', '#3b82f6')}
      <text x="120" y="25" font-size="11" font-weight="600" fill="#ef4444" opacity="0.7">Myopic Eye (image forms before retina)</text>
      <ellipse cx="280" cy="100" rx="60" ry="40" fill="currentColor" opacity="0.04" stroke="#6b7280" stroke-width="2"/>
      <circle cx="280" cy="100" r="8" fill="#fbbf24" opacity="0.15" stroke="#92400e" stroke-width="1.5"/>
      <line x1="160" y1="80" x2="272" y2="97" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="160" y1="100" x2="272" y2="100" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="160" y1="120" x2="272" y2="103" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <circle cx="220" cy="100" r="4" fill="#ef4444"/>
      ${label(220, 115, 'Focus (before retina)', 'middle')}
      <line x1="272" y1="97" x2="340" y2="120" stroke="#3b82f6" stroke-width="1.5" opacity="0.4"/>
      <line x1="272" y1="103" x2="340" y2="80" stroke="#3b82f6" stroke-width="1.5" opacity="0.4"/>
      ${label(345, 100, 'Retina', 'start')}
      <text x="120" y="180" font-size="11" font-weight="600" fill="#22c55e" opacity="0.7">Correction with Concave Lens</text>
      <ellipse cx="180" cy="250" rx="10" ry="30" fill="#3b82f6" opacity="0.1" stroke="#1d4ed8" stroke-width="2"/>
      <ellipse cx="300" cy="250" rx="60" ry="40" fill="currentColor" opacity="0.04" stroke="#6b7280" stroke-width="2"/>
      <circle cx="300" cy="250" r="8" fill="#fbbf24" opacity="0.15" stroke="#92400e" stroke-width="1.5"/>
      <line x1="120" y1="230" x2="170" y2="247" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="120" y1="250" x2="170" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="120" y1="270" x2="170" y2="253" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="190" y1="247" x2="292" y2="247" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="190" y1="250" x2="292" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="190" y1="253" x2="292" y2="253" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <circle cx="340" cy="250" r="4" fill="#22c55e"/>
      ${label(340, 265, 'On Retina', 'middle')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Myopia — Corrected with Concave Lens (Diverges light before eye)</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'hypermetropia',
    title: 'Hypermetropia (Far-Sightedness) Correction',
    subject: 'Physics',
    keywords: ['hypermetropia', 'hyperopia', 'far sighted', 'farsighted', 'long sight', 'convex lens correction', 'hypermetropia correction'],
    description: 'Hypermetropia defect and correction using a convex lens.',
    svg: svgWrap(
      `${arrowMarker('hyArrow', '#3b82f6')}
      <text x="120" y="25" font-size="11" font-weight="600" fill="#ef4444" opacity="0.7">Hypermetropic Eye (image forms behind retina)</text>
      <ellipse cx="280" cy="100" rx="60" ry="40" fill="currentColor" opacity="0.04" stroke="#6b7280" stroke-width="2"/>
      <circle cx="280" cy="100" r="8" fill="#fbbf24" opacity="0.15" stroke="#92400e" stroke-width="1.5"/>
      <line x1="160" y1="80" x2="272" y2="95" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="160" y1="100" x2="272" y2="100" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="160" y1="120" x2="272" y2="105" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="272" y1="95" x2="340" y2="80" stroke="#3b82f6" stroke-width="1.5" opacity="0.4"/>
      <line x1="272" y1="105" x2="340" y2="120" stroke="#3b82f6" stroke-width="1.5" opacity="0.4"/>
      <circle cx="360" cy="100" r="4" fill="#ef4444"/>
      ${label(365, 100, 'Focus (behind retina)', 'start')}
      ${label(345, 130, 'Retina', 'start')}
      <text x="120" y="180" font-size="11" font-weight="600" fill="#22c55e" opacity="0.7">Correction with Convex Lens</text>
      <ellipse cx="180" cy="250" rx="10" ry="30" fill="#3b82f6" opacity="0.1" stroke="#1d4ed8" stroke-width="2"/>
      <ellipse cx="300" cy="250" rx="60" ry="40" fill="currentColor" opacity="0.04" stroke="#6b7280" stroke-width="2"/>
      <circle cx="300" cy="250" r="8" fill="#fbbf24" opacity="0.15" stroke="#92400e" stroke-width="1.5"/>
      <line x1="120" y1="230" x2="170" y2="245" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="120" y1="250" x2="170" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="120" y1="270" x2="170" y2="255" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="190" y1="245" x2="292" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="190" y1="250" x2="292" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <line x1="190" y1="255" x2="292" y2="250" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
      <circle cx="340" cy="250" r="4" fill="#22c55e"/>
      ${label(345, 265, 'On Retina', 'middle')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Hypermetropia — Corrected with Convex Lens (Converges light before eye)</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'electric-motor',
    title: 'Electric Motor (DC Motor)',
    subject: 'Physics',
    keywords: ['electric motor', 'dc motor', 'motor', 'armature', 'commutator', 'split ring', 'brush', 'motor principle'],
    description: 'Working of a DC electric motor showing armature, split-ring commutator, and brushes.',
    svg: svgWrap(
      `${arrowMarker('mArrow2', '#3b82f6')}
      <rect x="150" y="100" width="200" height="120" rx="8" fill="none" stroke="#6b7280" stroke-width="2.5" opacity="0.4"/>
      <circle cx="250" cy="160" r="50" fill="#fbbf24" opacity="0.06" stroke="#92400e" stroke-width="2"/>
      <rect x="210" y="130" width="80" height="60" rx="4" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2"/>
      ${label(250, 162, 'Armature (N-S)', 'middle')}
      <line x1="250" y1="100" x2="250" y2="80" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="220" x2="250" y2="240" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <rect x="235" y="70" width="30" height="12" fill="#6b7280" opacity="0.2" stroke="#6b7280" stroke-width="1.5"/>
      <rect x="235" y="238" width="30" height="12" fill="#6b7280" opacity="0.2" stroke="#6b7280" stroke-width="1.5"/>
      ${label(285, 78, 'Split Ring', 'start')}
      <rect x="225" y="55" width="12" height="20" fill="#92400e" opacity="0.2" stroke="#92400e" stroke-width="1.5"/>
      <rect x="263" y="55" width="12" height="20" fill="#92400e" opacity="0.2" stroke="#92400e" stroke-width="1.5"/>
      ${label(225, 48, 'Brushes', 'middle')}
      <line x1="231" y1="55" x2="180" y2="30" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <line x1="269" y1="55" x2="320" y2="30" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      ${label(175, 25, '+', 'end')}
      ${label(325, 25, '−', 'start')}
      <text x="100" y="160" font-size="20" fill="#ef4444" opacity="0.3" font-weight="700">N</text>
      <text x="390" y="160" font-size="20" fill="#3b82f6" opacity="0.3" font-weight="700">S</text>
      <path d="M 120 160 L 150 160" stroke="#6b7280" stroke-width="1.5" opacity="0.3"/>
      <path d="M 350 160 L 380 160" stroke="#6b7280" stroke-width="1.5" opacity="0.3"/>
      <text x="250" y="265" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">DC Motor — Armature in Magnetic Field with Split-Ring Commutator</text>`,
      '0 0 500 280'
    ),
  },
  {
    id: 'ac-generator',
    title: 'AC Generator',
    subject: 'Physics',
    keywords: ['ac generator', 'generator', 'alternator', 'slip rings', 'electromagnetic induction', 'dynamo'],
    description: 'Working of an AC generator showing slip rings and induced current.',
    svg: svgWrap(
      `${arrowMarker('gArrow', '#3b82f6')}
      <rect x="150" y="100" width="200" height="120" rx="8" fill="none" stroke="#6b7280" stroke-width="2.5" opacity="0.4"/>
      <circle cx="250" cy="160" r="50" fill="#22c55e" opacity="0.06" stroke="#15803d" stroke-width="2"/>
      <rect x="210" y="130" width="80" height="60" rx="4" fill="#ef4444" opacity="0.1" stroke="#b91c1c" stroke-width="2"/>
      ${label(250, 162, 'Armature (N-S)', 'middle')}
      <line x1="250" y1="100" x2="250" y2="80" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="220" x2="250" y2="240" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      <circle cx="250" cy="72" r="10" fill="none" stroke="#6b7280" stroke-width="2" opacity="0.3"/>
      <circle cx="250" cy="228" r="10" fill="none" stroke="#6b7280" stroke-width="2" opacity="0.3"/>
      ${label(275, 75, 'Slip Rings', 'start')}
      <rect x="225" y="55" width="12" height="20" fill="#92400e" opacity="0.2" stroke="#92400e" stroke-width="1.5"/>
      <rect x="263" y="55" width="12" height="20" fill="#92400e" opacity="0.2" stroke="#92400e" stroke-width="1.5"/>
      ${label(225, 48, 'Brushes', 'middle')}
      <line x1="231" y1="55" x2="180" y2="30" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <line x1="269" y1="55" x2="320" y2="30" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
      ${label(175, 25, 'I~', 'end')}
      ${label(325, 25, 'AC', 'start')}
      <text x="100" y="160" font-size="20" fill="#ef4444" opacity="0.3" font-weight="700">N</text>
      <text x="390" y="160" font-size="20" fill="#3b82f6" opacity="0.3" font-weight="700">S</text>
      <path d="M 120 160 L 150 160" stroke="#6b7280" stroke-width="1.5" opacity="0.3"/>
      <path d="M 350 160 L 380 160" stroke="#6b7280" stroke-width="1.5" opacity="0.3"/>
      <text x="250" y="265" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">AC Generator — Armature Rotation Induces Alternating Current</text>`,
      '0 0 500 280'
    ),
  },
  {
    id: 'respiration',
    title: 'Respiration — Aerobic vs Anaerobic',
    subject: 'Biology',
    keywords: ['respiration', 'aerobic', 'anaerobic', 'atp', 'energy release', 'glucose breakdown', 'fermentation', 'lactic acid'],
    description: 'Comparison of aerobic and anaerobic respiration pathways.',
    svg: svgWrap(
      `<rect x="20" y="40" width="200" height="250" rx="10" fill="#22c55e" opacity="0.06" stroke="#15803d" stroke-width="2"/>
      <text x="120" y="65" font-size="12" text-anchor="middle" fill="#15803d" opacity="0.7" font-weight="700">Aerobic Respiration</text>
      <text x="120" y="95" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.6">Glucose + O₂</text>
      <line x1="120" y1="105" x2="120" y2="135" stroke="#22c55e" stroke-width="2" opacity="0.5" marker-end="url(#aeArrow)"/>
      <text x="120" y="160" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.6">CO₂ + H₂O + Energy</text>
      <text x="120" y="190" font-size="10" text-anchor="middle" fill="#22c55e" opacity="0.6">38 ATP</text>
      <text x="120" y="220" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.5">In mitochondria</text>
      <text x="120" y="250" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.5">Complete breakdown</text>
      <rect x="270" y="40" width="200" height="250" rx="10" fill="#f97316" opacity="0.06" stroke="#c2410c" stroke-width="2"/>
      <text x="370" y="65" font-size="12" text-anchor="middle" fill="#c2410c" opacity="0.7" font-weight="700">Anaerobic Respiration</text>
      <text x="370" y="95" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.6">Glucose (no O₂)</text>
      <line x1="370" y1="105" x2="370" y2="135" stroke="#f97316" stroke-width="2" opacity="0.5" marker-end="url(#anArrow)"/>
      <text x="370" y="155" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6">In muscles:</text>
      <text x="370" y="170" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6">Lactic acid + Energy</text>
      <text x="370" y="195" font-size="10" text-anchor="middle" fill="#f97316" opacity="0.6">2 ATP</text>
      <text x="370" y="220" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6">In yeast:</text>
      <text x="370" y="235" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6">Ethanol + CO₂ + Energy</text>
      <text x="370" y="265" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.5">Incomplete breakdown</text>
      ${arrowMarker('aeArrow', '#22c55e')}
      ${arrowMarker('anArrow', '#f97316')}
      <text x="250" y="310" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Aerobic vs Anaerobic Respiration — Energy from Glucose</text>`,
      '0 0 500 320'
    ),
  },
  {
    id: 'food-chain',
    title: 'Food Chain & Energy Flow',
    subject: 'Biology',
    keywords: ['food chain', 'trophic level', 'energy flow', 'ecosystem', 'producer consumer', 'apex predator', 'food web'],
    description: 'Energy flow through trophic levels in a food chain.',
    svg: svgWrap(
      `${arrowMarker('fcArrow', '#22c55e')}
      <rect x="50" y="50" width="120" height="50" rx="8" fill="#22c55e" opacity="0.12" stroke="#15803d" stroke-width="2"/>
      ${label(110, 78, 'Producer (Grass)', 'middle')}
      <line x1="110" y1="100" x2="110" y2="130" stroke="#22c55e" stroke-width="2" opacity="0.5" marker-end="url(#fcArrow)"/>
      <text x="125" y="120" font-size="9" fill="#22c55e" opacity="0.5">10%</text>
      <rect x="50" y="135" width="120" height="50" rx="8" fill="#fbbf24" opacity="0.12" stroke="#92400e" stroke-width="2"/>
      ${label(110, 163, 'Primary Consumer (Grasshopper)', 'middle')}
      <line x1="110" y1="185" x2="110" y2="215" stroke="#fbbf24" stroke-width="2" opacity="0.5" marker-end="url(#fcArrow)"/>
      <text x="125" y="205" font-size="9" fill="#fbbf24" opacity="0.5">10%</text>
      <rect x="50" y="220" width="120" height="50" rx="8" fill="#f97316" opacity="0.12" stroke="#c2410c" stroke-width="2"/>
      ${label(110, 248, 'Secondary Consumer (Frog)', 'middle')}
      <line x1="110" y1="270" x2="110" y2="300" stroke="#f97316" stroke-width="2" opacity="0.5" marker-end="url(#fcArrow)"/>
      <text x="125" y="290" font-size="9" fill="#f97316" opacity="0.5">10%</text>
      <rect x="50" y="305" width="120" height="50" rx="8" fill="#ef4444" opacity="0.12" stroke="#b91c1c" stroke-width="2"/>
      ${label(110, 333, 'Tertiary Consumer (Snake)', 'middle')}
      <text x="300" y="80" font-size="11" font-weight="600" fill="currentColor" opacity="0.6">Energy Flow</text>
      <text x="300" y="100" font-size="10" fill="currentColor" opacity="0.5">• Only ~10% energy</text>
      <text x="300" y="115" font-size="10" fill="currentColor" opacity="0.5">  passes to next level</text>
      <text x="300" y="140" font-size="10" fill="currentColor" opacity="0.5">• 90% lost as heat</text>
      <text x="300" y="170" font-size="10" fill="currentColor" opacity="0.5">• Producers get energy</text>
      <text x="300" y="185" font-size="10" fill="currentColor" opacity="0.5">  from sunlight</text>
      <text x="250" y="380" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Food Chain — Energy Decreases at Each Trophic Level (10% Rule)</text>`,
      '0 0 500 400'
    ),
  },
  {
    id: 'flower-structure',
    title: 'Flower Structure (Reproduction)',
    subject: 'Biology',
    keywords: ['flower', 'reproduction', 'stamen', 'pistil', 'pollination', 'petal', 'sepal', 'ovary', 'anther', 'carpel'],
    description: 'Structure of a flower showing reproductive parts.',
    svg: svgWrap(
      `<line x1="250" y1="320" x2="250" y2="280" stroke="#22c55e" stroke-width="3" opacity="0.5"/>
      <text x="260" y="310" font-size="10" font-weight="600" fill="#22c55e" opacity="0.6">Stem</text>
      <ellipse cx="250" cy="270" rx="60" ry="25" fill="#22c55e" opacity="0.1" stroke="#15803d" stroke-width="2"/>
      <text x="250" y="275" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Ovary</text>
      <line x1="250" y1="245" x2="250" y2="180" stroke="#22c55e" stroke-width="2" opacity="0.5"/>
      <text x="260" y="220" font-size="9" font-weight="600" fill="#22c55e" opacity="0.6">Style</text>
      <circle cx="250" cy="170" r="12" fill="#fbbf24" opacity="0.2" stroke="#92400e" stroke-width="2"/>
      <text x="250" y="174" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">Stigma</text>
      <text x="270" y="170" font-size="9" font-weight="600" fill="#22c55e" opacity="0.6">← Pistil (female)</text>
      <line x1="200" y1="245" x2="180" y2="180" stroke="#ef4444" stroke-width="2" opacity="0.4"/>
      <line x1="300" y1="245" x2="320" y2="180" stroke="#ef4444" stroke-width="2" opacity="0.4"/>
      <ellipse cx="180" cy="170" rx="10" ry="8" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="1.5"/>
      <ellipse cx="320" cy="170" rx="10" ry="8" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="1.5"/>
      <text x="180" y="173" font-size="7" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Anther</text>
      <text x="320" y="173" font-size="7" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Anther</text>
      <text x="155" y="160" font-size="9" font-weight="600" fill="#ef4444" opacity="0.6">Stamen (male) →</text>
      <path d="M 150 140 Q 250 80 350 140" fill="#ec4899" opacity="0.08" stroke="#be185d" stroke-width="2"/>
      <path d="M 160 145 Q 250 95 340 145" fill="#ec4899" opacity="0.06" stroke="#be185d" stroke-width="1.5"/>
      <text x="250" y="120" font-size="9" text-anchor="middle" fill="#be185d" opacity="0.5" font-weight="600">Petals</text>
      <text x="250" y="360" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Flower — Stamen (male) & Pistil (female) Reproductive Parts</text>`,
      '0 0 500 380'
    ),
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table — Groups & Periods',
    subject: 'Chemistry',
    keywords: ['periodic table', 'periodic classification', 'groups', 'periods', 'metalloid', 'alkali metal', 'halogen', 'noble gas', 'group 1', 'group 17', 'group 18'],
    description: 'Simplified periodic table showing groups and periods.',
    svg: svgWrap(
      `<rect x="30" y="30" width="40" height="40" rx="4" fill="#ef4444" opacity="0.15" stroke="#b91c1c" stroke-width="1.5"/>
      <text x="50" y="55" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">1</text>
      <text x="50" y="85" font-size="7" text-anchor="middle" fill="#ef4444" opacity="0.5">Group 1</text>
      <text x="50" y="93" font-size="6" text-anchor="middle" fill="#ef4444" opacity="0.4">Alkali</text>
      <rect x="430" y="30" width="40" height="40" rx="4" fill="#3b82f6" opacity="0.15" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="450" y="55" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">18</text>
      <text x="450" y="85" font-size="7" text-anchor="middle" fill="#3b82f6" opacity="0.5">Group 18</text>
      <text x="450" y="93" font-size="6" text-anchor="middle" fill="#3b82f6" opacity="0.4">Noble Gas</text>
      <rect x="370" y="30" width="40" height="40" rx="4" fill="#22c55e" opacity="0.15" stroke="#15803d" stroke-width="1.5"/>
      <text x="390" y="55" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">17</text>
      <text x="390" y="85" font-size="7" text-anchor="middle" fill="#22c55e" opacity="0.5">Group 17</text>
      <text x="390" y="93" font-size="6" text-anchor="middle" fill="#22c55e" opacity="0.4">Halogens</text>
      ` + [100,170,240,310,380].map((x,i) => `<rect x="${x}" y="30" width="40" height="40" rx="4" fill="#fbbf24" opacity="${0.08+i*0.02}" stroke="#92400e" stroke-width="1"/><text x="${x+20}" y="55" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">${i+2}</text>`).join('') + `
      ` + [30,100,170,240,310,370,430].map((x) => `<rect x="${x}" y="90" width="40" height="40" rx="4" fill="#6b7280" opacity="0.08" stroke="#6b7280" stroke-width="1"/>`).join('') + `
      ` + [30,100,170,240,310,370,430].map((x) => `<rect x="${x}" y="140" width="40" height="40" rx="4" fill="#6b7280" opacity="0.08" stroke="#6b7280" stroke-width="1"/>`).join('') + `
      <text x="250" y="20" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.4">← Periods (rows) →</text>
      <text x="15" y="105" font-size="7" fill="currentColor" opacity="0.4" transform="rotate(-90 15 105)">Period 2</text>
      <text x="15" y="155" font-size="7" fill="currentColor" opacity="0.4" transform="rotate(-90 15 155)">Period 3</text>
      <rect x="150" y="90" width="40" height="40" rx="4" fill="#a855f7" opacity="0.15" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="170" y="113" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">B</text>
      <text x="170" y="123" font-size="6" text-anchor="middle" fill="#a855f7" opacity="0.4">Metalloid</text>
      <rect x="310" y="90" width="40" height="40" rx="4" fill="#f97316" opacity="0.12" stroke="#c2410c" stroke-width="1.5"/>
      <text x="330" y="113" font-size="8" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Si</text>
      <text x="330" y="123" font-size="6" text-anchor="middle" fill="#f97316" opacity="0.4">Metalloid</text>
      <text x="250" y="210" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Periodic Table — Groups (columns) & Periods (rows)</text>`,
      '0 0 500 220'
    ),
  },
  {
    id: 'ph-scale',
    title: 'pH Scale — Acids & Bases',
    subject: 'Chemistry',
    keywords: ['ph scale', 'ph', 'acid', 'base', 'neutral', 'alkaline', 'ph indicator', 'litmus', 'h+ ion'],
    description: 'pH scale showing acidic, neutral, and basic ranges with examples.',
    svg: svgWrap(
      `<rect x="50" y="80" width="400" height="30" rx="4" fill="none" stroke="#6b7280" stroke-width="2"/>
      ` + [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((ph,i) => {
        const x = 50 + (i * 400/14);
        const colors = ['#dc2626','#ea580c','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#0ea5e9','#3b82f6','#6366f1','#8b5cf6','#a855f7','#c026d3'];
        return `<rect x="${x}" y="80" width="${400/14}" height="30" fill="${colors[i]}" opacity="0.15"/>`;
      }).join('') + `
      <text x="60" y="72" font-size="9" fill="#dc2626" opacity="0.6" font-weight="600">0</text>
      <text x="250" y="72" font-size="9" text-anchor="middle" fill="#10b981" opacity="0.6" font-weight="600">7 (Neutral)</text>
      <text x="440" y="72" font-size="9" fill="#c026d3" opacity="0.6" font-weight="600">14</text>
      <text x="100" y="130" font-size="9" fill="#dc2626" opacity="0.5">← Acidic</text>
      <text x="400" y="130" font-size="9" fill="#c026d3" opacity="0.5">Basic →</text>
      <text x="90" y="165" font-size="9" fill="currentColor" opacity="0.5">pH 1: HCl</text>
      <text x="180" y="165" font-size="9" fill="currentColor" opacity="0.5">pH 3: Lemon</text>
      <text x="270" y="165" font-size="9" fill="currentColor" opacity="0.5">pH 7: Water</text>
      <text x="360" y="165" font-size="9" fill="currentColor" opacity="0.5">pH 14: NaOH</text>
      <text x="250" y="200" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">pH Scale — 0-6 Acidic, 7 Neutral, 8-14 Basic</text>`,
      '0 0 500 210'
    ),
  },
  {
    id: 'exothermic-endothermic',
    title: 'Exothermic vs Endothermic Reactions',
    subject: 'Chemistry',
    keywords: ['exothermic', 'endothermic', 'energy change', 'enthalpy', 'heat release', 'heat absorb', 'reaction energy'],
    description: 'Energy diagrams for exothermic and endothermic reactions.',
    svg: svgWrap(
      `${arrowMarker('exArrow', '#ef4444')}
      ${arrowMarker('enArrow', '#3b82f6')}
      <text x="120" y="30" font-size="11" text-anchor="middle" fill="#ef4444" opacity="0.7" font-weight="700">Exothermic</text>
      <line x1="40" y1="80" x2="220" y2="80" stroke="#6b7280" stroke-width="1.5" opacity="0.4"/>
      <text x="30" y="85" font-size="9" fill="currentColor" opacity="0.5">Reactants</text>
      <path d="M 80 80 Q 120 140 160 80" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.5"/>
      <text x="120" y="135" font-size="8" text-anchor="middle" fill="#f59e0b" opacity="0.5">Activation Energy</text>
      <line x1="40" y1="130" x2="220" y2="130" stroke="#ef4444" stroke-width="1.5" opacity="0.4"/>
      <text x="30" y="135" font-size="9" fill="currentColor" opacity="0.5">Products</text>
      <line x1="200" y1="80" x2="200" y2="130" stroke="#ef4444" stroke-width="2" marker-end="url(#exArrow)" opacity="0.5"/>
      <text x="210" y="110" font-size="8" fill="#ef4444" opacity="0.5">ΔH &lt; 0</text>
      <text x="120" y="170" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">Heat released</text>
      <text x="370" y="30" font-size="11" text-anchor="middle" fill="#3b82f6" opacity="0.7" font-weight="700">Endothermic</text>
      <line x1="290" y1="130" x2="470" y2="130" stroke="#6b7280" stroke-width="1.5" opacity="0.4"/>
      <text x="280" y="135" font-size="9" fill="currentColor" opacity="0.5">Reactants</text>
      <path d="M 330 130 Q 370 80 410 130" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.5"/>
      <text x="370" y="75" font-size="8" text-anchor="middle" fill="#f59e0b" opacity="0.5">Activation Energy</text>
      <line x1="290" y1="80" x2="470" y2="80" stroke="#3b82f6" stroke-width="1.5" opacity="0.4"/>
      <text x="280" y="85" font-size="9" fill="currentColor" opacity="0.5">Products</text>
      <line x1="450" y1="80" x2="450" y2="130" stroke="#3b82f6" stroke-width="2" marker-end="url(#enArrow)" opacity="0.5"/>
      <text x="430" y="110" font-size="8" fill="#3b82f6" opacity="0.5">ΔH &gt; 0</text>
      <text x="370" y="170" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">Heat absorbed</text>
      <text x="250" y="200" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Exothermic (ΔH&lt;0, heat released) vs Endothermic (ΔH&gt;0, heat absorbed)</text>`,
      '0 0 500 210'
    ),
  },
  {
    id: 'methane-structure',
    title: 'Methane (CH₄) — Tetrahedral Structure',
    subject: 'Chemistry',
    keywords: ['methane', 'ch4', 'tetrahedral', 'sp3', 'bond angle', 'alkane', 'covalent bond'],
    description: 'Tetrahedral structure of methane showing 109.5° bond angles.',
    svg: svgWrap(
      `<circle cx="250" cy="170" r="20" fill="#3b82f6" opacity="0.3" stroke="#1d4ed8" stroke-width="2"/>
      <text x="250" y="175" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.8" font-weight="700">C</text>
      <line x1="250" y1="170" x2="180" y2="120" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="170" x2="320" y2="120" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="170" x2="200" y2="240" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="170" x2="300" y2="240" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <circle cx="180" cy="120" r="14" fill="#22c55e" opacity="0.2" stroke="#15803d" stroke-width="1.5"/>
      <text x="180" y="124" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">H</text>
      <circle cx="320" cy="120" r="14" fill="#22c55e" opacity="0.2" stroke="#15803d" stroke-width="1.5"/>
      <text x="320" y="124" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">H</text>
      <circle cx="200" cy="240" r="14" fill="#22c55e" opacity="0.2" stroke="#15803d" stroke-width="1.5"/>
      <text x="200" y="244" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">H</text>
      <circle cx="300" cy="240" r="14" fill="#22c55e" opacity="0.2" stroke="#15803d" stroke-width="1.5"/>
      <text x="300" y="244" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7" font-weight="600">H</text>
      <text x="135" y="145" font-size="9" fill="#f59e0b" opacity="0.5">109.5°</text>
      <text x="250" y="290" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Methane (CH₄) — Tetrahedral, 4 C-H Bonds, 109.5° Angles</text>`,
      '0 0 500 310'
    ),
  },
  {
    id: 'water-cycle',
    title: 'Water Cycle',
    subject: 'Biology',
    keywords: ['water cycle', 'evaporation', 'condensation', 'precipitation', 'rain', 'hydrological cycle', 'transpiration'],
    description: 'The water cycle showing evaporation, condensation, and precipitation.',
    svg: svgWrap(
      `${arrowMarker('wcArrow', '#3b82f6')}
      <text x="100" y="40" font-size="11" font-weight="600" fill="#3b82f6" opacity="0.5">Condensation</text>
      <path d="M 60 50 Q 100 40 140 50 Q 180 40 220 50" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.4"/>
      <path d="M 260 50 Q 300 40 340 50 Q 380 40 420 50" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.4"/>
      <ellipse cx="150" cy="55" rx="30" ry="12" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" stroke-width="1.5" opacity="0.3"/>
      <ellipse cx="330" cy="55" rx="30" ry="12" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" stroke-width="1.5" opacity="0.3"/>
      <line x1="150" y1="70" x2="150" y2="160" stroke="#3b82f6" stroke-width="2" marker-end="url(#wcArrow)" opacity="0.4"/>
      <text x="160" y="120" font-size="9" fill="#3b82f6" opacity="0.5">Precipitation</text>
      <line x1="330" y1="70" x2="330" y2="160" stroke="#3b82f6" stroke-width="2" marker-end="url(#wcArrow)" opacity="0.4"/>
      <path d="M 0 200 L 500 200" stroke="#22c55e" stroke-width="3" opacity="0.3"/>
      <text x="100" y="220" font-size="10" fill="#22c55e" opacity="0.5">Land</text>
      <path d="M 300 200 Q 340 210 380 200" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.4"/>
      <text x="350" y="235" font-size="9" fill="#3b82f6" opacity="0.5">Run-off</text>
      <line x1="80" y1="200" x2="80" y2="120" stroke="#f59e0b" stroke-width="2" marker-end="url(#wcArrow)" opacity="0.4"/>
      <text x="30" y="160" font-size="9" fill="#f59e0b" opacity="0.5">Evaporation</text>
      <line x1="420" y1="200" x2="420" y2="140" stroke="#22c55e" stroke-width="2" marker-end="url(#wcArrow)" opacity="0.3"/>
      <text x="430" y="170" font-size="9" fill="#22c55e" opacity="0.5">Transpiration</text>
      <text x="250" y="270" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Water Cycle — Evaporation → Condensation → Precipitation</text>`,
      '0 0 500 280'
    ),
  },
  {
    id: 'dna-structure',
    title: 'DNA Double Helix Structure',
    subject: 'Biology',
    keywords: ['dna', 'double helix', 'nucleotide', 'base pair', 'adenine', 'thymine', 'guanine', 'cytosine', 'genetic material', 'heredity'],
    description: 'DNA double helix showing base pairs (A-T, G-C).',
    svg: svgWrap(
      `<path d="M 150 40 Q 250 80 350 40 Q 250 120 150 80 Q 250 160 350 120 Q 250 200 150 160 Q 250 240 350 200" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.4"/>
      <path d="M 350 40 Q 250 80 150 40 Q 250 120 350 80 Q 250 160 150 120 Q 250 200 350 160 Q 250 240 150 200" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.4"/>
      <line x1="180" y1="55" x2="320" y2="55" stroke="#22c55e" stroke-width="1.5" opacity="0.3"/>
      <text x="190" y="52" font-size="7" fill="#22c55e" opacity="0.5">A-T</text>
      <line x1="180" y1="95" x2="320" y2="95" stroke="#fbbf24" stroke-width="1.5" opacity="0.3"/>
      <text x="190" y="92" font-size="7" fill="#fbbf24" opacity="0.5">G-C</text>
      <line x1="180" y1="135" x2="320" y2="135" stroke="#22c55e" stroke-width="1.5" opacity="0.3"/>
      <text x="190" y="132" font-size="7" fill="#22c55e" opacity="0.5">A-T</text>
      <line x1="180" y1="175" x2="320" y2="175" stroke="#fbbf24" stroke-width="1.5" opacity="0.3"/>
      <text x="190" y="172" font-size="7" fill="#fbbf24" opacity="0.5">G-C</text>
      <text x="250" y="260" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">DNA Double Helix — Base Pairs: A-T (2 bonds) & G-C (3 bonds)</text>`,
      '0 0 500 270'
    ),
  },
  {
    id: 'ohms-law-circuit',
    title: "Ohm's Law — V=IR Relationship",
    subject: 'Physics',
    keywords: ['ohms law', 'v=ir', 'voltage', 'resistance', 'current relationship', 'ohm law'],
    description: "Ohm's law showing the relationship between voltage, current, and resistance.",
    svg: svgWrap(
      `${arrowMarker('olArrow', '#ef4444')}
      <line x1="50" y1="100" x2="450" y2="100" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="50" y1="200" x2="450" y2="200" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="50" y1="100" x2="50" y2="200" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="450" y1="100" x2="450" y2="200" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="55" y1="110" x2="55" y2="130" stroke="currentColor" stroke-width="4"/>
      <line x1="45" y1="130" x2="65" y2="130" stroke="currentColor" stroke-width="4"/>
      <line x1="55" y1="140" x2="55" y2="160" stroke="currentColor" stroke-width="4"/>
      <line x1="45" y1="160" x2="65" y2="160" stroke="currentColor" stroke-width="4"/>
      <text x="30" y="155" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.6" font-weight="600">V</text>
      <line x1="50" y1="100" x2="200" y2="100" stroke="#ef4444" stroke-width="2.5" opacity="0.5"/>
      <text x="120" y="90" font-size="10" fill="#ef4444" opacity="0.5">I (Current) →</text>
      <polyline points="200,100 220,90 240,110 260,90 280,110 300,90 320,100" fill="none" stroke="#f59e0b" stroke-width="2.5" opacity="0.5"/>
      <text x="260" y="80" font-size="10" text-anchor="middle" fill="#f59e0b" opacity="0.5" font-weight="600">R (Resistance)</text>
      <line x1="320" y1="100" x2="450" y2="100" stroke="#ef4444" stroke-width="2.5" opacity="0.5"/>
      <line x1="450" y1="100" x2="450" y2="200" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <line x1="50" y1="200" x2="450" y2="200" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <rect x="170" y="220" width="160" height="50" rx="8" fill="#3b82f6" opacity="0.08" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="250" y="245" font-size="14" text-anchor="middle" fill="#3b82f6" opacity="0.7" font-weight="700">V = I × R</text>
      <text x="250" y="290" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5" font-weight="600">Ohm's Law — Voltage = Current × Resistance</text>`,
      '0 0 500 300'
    ),
  },
];

export function findDiagram(message: string): DiagramInfo | null {
  const lower = message.toLowerCase();

  // Score-based matching: count keyword hits per diagram
  let bestMatch: DiagramInfo | null = null;
  let bestScore = 0;

  for (const diagram of DIAGRAM_LIBRARY) {
    let score = 0;
    for (const keyword of diagram.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // Longer keywords = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = diagram;
    }
  }

  return bestMatch;
}
