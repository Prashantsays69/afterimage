import { ColorSwatch, ImageMetadata } from '../types';
import { createColorSwatch } from '../utils/color';

export interface SampleImage {
  id: string;
  title: string;
  category: string;
  metadata: ImageMetadata;
  palette: ColorSwatch[];
}

// Generate an SVG data URI for architectural brutalist composition
const architecturalSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#E5DDD0"/>
  <!-- Brutalist concrete facades and geometric shadow planes -->
  <polygon points="0,150 480,80 440,600 0,600" fill="#49535B"/>
  <polygon points="480,80 800,180 800,600 440,600" fill="#1E2328"/>
  <polygon points="120,240 380,200 360,540 100,560" fill="#C59B27"/>
  <polygon points="380,200 560,260 540,580 360,540" fill="#D96B43"/>
  <!-- Slit windows and horizontal louvers -->
  <rect x="160" y="270" width="40" height="180" fill="#1E2328"/>
  <rect x="230" y="260" width="40" height="180" fill="#1E2328"/>
  <rect x="300" y="250" width="40" height="180" fill="#1E2328"/>
  <rect x="420" y="320" width="80" height="24" fill="#E5DDD0"/>
  <rect x="420" y="360" width="80" height="24" fill="#E5DDD0"/>
  <rect x="420" y="400" width="80" height="24" fill="#E5DDD0"/>
  <polygon points="0,0 800,0 800,180 0,150" fill="#6B7564" opacity="0.45"/>
</svg>
`)}`;

const cyanotypeSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#1C355E"/>
  <!-- Botanical cyanotype fronds and organic textures -->
  <circle cx="400" cy="300" r="240" fill="#3D70B2" opacity="0.4"/>
  <path d="M 400 550 Q 380 320 350 150 Q 420 280 400 550" fill="#EFECE6" opacity="0.9"/>
  <path d="M 370 380 Q 250 320 180 310 Q 280 360 370 380" fill="#EFECE6" opacity="0.85"/>
  <path d="M 380 300 Q 270 230 200 200 Q 290 260 380 300" fill="#EFECE6" opacity="0.85"/>
  <path d="M 360 210 Q 280 140 230 110 Q 310 170 360 210" fill="#EFECE6" opacity="0.85"/>
  <path d="M 385 350 Q 520 290 590 280 Q 500 340 385 350" fill="#7A9A8B" opacity="0.8"/>
  <path d="M 375 270 Q 500 190 560 160 Q 480 230 375 270" fill="#7A9A8B" opacity="0.8"/>
  <rect x="40" y="40" width="720" height="520" fill="none" stroke="#EFECE6" stroke-width="2" opacity="0.3"/>
</svg>
`)}`;

const dunesSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Sky -->
  <rect width="800" height="300" fill="#4E6E82"/>
  <circle cx="580" cy="190" r="90" fill="#F3ECE1"/>
  <!-- Dunes -->
  <path d="M 0 280 Q 280 340 500 250 T 800 270 L 800 600 L 0 600 Z" fill="#D47A37"/>
  <path d="M 0 350 Q 320 260 620 380 T 800 360 L 800 600 L 0 600 Z" fill="#E8BA82"/>
  <path d="M 120 420 Q 420 540 800 410 L 800 600 L 0 600 Z" fill="#7C3F2B"/>
  <path d="M 0 490 Q 340 450 800 520 L 800 600 L 0 600 Z" fill="#876978"/>
</svg>
`)}`;

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-brutalist',
    title: 'Barbican Study No. 4',
    category: 'Architecture',
    metadata: {
      name: 'barbican-study-04.svg',
      width: 800,
      height: 600,
      size: 48200,
      aspectRatio: 800 / 600,
      dataUrl: architecturalSvg,
    },
    palette: [
      createColorSwatch('#1E2328', 's-1-1', 28),
      createColorSwatch('#49535B', 's-1-2', 24),
      createColorSwatch('#C59B27', 's-1-3', 18),
      createColorSwatch('#D96B43', 's-1-4', 14),
      createColorSwatch('#E5DDD0', 's-1-5', 10),
      createColorSwatch('#6B7564', 's-1-6', 6),
    ],
  },
  {
    id: 'sample-cyanotype',
    title: 'Herbarium Cyanotype',
    category: 'Botanical',
    metadata: {
      name: 'herbarium-cyanotype.svg',
      width: 800,
      height: 600,
      size: 39500,
      aspectRatio: 800 / 600,
      dataUrl: cyanotypeSvg,
    },
    palette: [
      createColorSwatch('#1C355E', 's-2-1', 35),
      createColorSwatch('#3D70B2', 's-2-2', 25),
      createColorSwatch('#7A9A8B', 's-2-3', 18),
      createColorSwatch('#456358', 's-2-4', 11),
      createColorSwatch('#EFECE6', 's-2-5', 8),
      createColorSwatch('#20272F', 's-2-6', 3),
    ],
  },
  {
    id: 'sample-dunes',
    title: 'Dusk at Namib Dunes',
    category: 'Landscape',
    metadata: {
      name: 'namib-dunes-dusk.svg',
      width: 800,
      height: 600,
      size: 34100,
      aspectRatio: 800 / 600,
      dataUrl: dunesSvg,
    },
    palette: [
      createColorSwatch('#4E6E82', 's-3-1', 26),
      createColorSwatch('#D47A37', 's-3-2', 22),
      createColorSwatch('#E8BA82', 's-3-3', 20),
      createColorSwatch('#7C3F2B', 's-3-4', 16),
      createColorSwatch('#876978', 's-3-5', 10),
      createColorSwatch('#F3ECE1', 's-3-6', 6),
    ],
  },
];
