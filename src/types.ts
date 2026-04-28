import paniniLogo from './logo-panini-256.png';
import backCardImg from './backcard.png';

export interface CardData {
  id: string;
  name: string;
  colors: {
    fondo: string;
    dos: string;
    seis: string;
    inter: string;
    nombreBg: string;
    clubBg: string;
    fifaLogo: string;
    paisStroke: string;
  };
  texts: {
    firstName: string;
    lastName: string;
    birthDate: string;
    height: string;
    weight: string;
    clubName: string;
    clubAbbreviation: string;
    paisName: string;
  };
  images: {
    player: string | null;
    playerTransform: {
      scale: number;
      rotate: number;
      x: number;
      y: number;
    };
    flag: string | null;
    flagTransform: {
      scale: number;
      rotate: number;
      x: number;
      y: number;
    };
    panini: string | null;
    paniniTransform: {
      scale: number;
      rotate: number;
      x: number;
      y: number;
    };
    backCard: string | null;
    backCardTransform: {
      scale: number;
      rotate: number;
      x: number;
      y: number;
    };
  };
  layout: {
    padding: number;
    showWatermark?: boolean;
    paisTransform: {
      x: number;
      y: number;
      fontSize: number;
      spacing: number;
      strokeWidth: number;
    };
    nameTransform: {
      x: number;
      y: number;
      fontSize: number;
    };
    dataTransform: {
      x: number;
      y: number;
      fontSize: number;
    };
    clubTransform: {
      x: number;
      y: number;
      fontSize: number;
    };
  };
  effects: {
    // ── Capa 0: Marco (Frame / Border) ──
    frameEnabled: boolean;
    frameColor: string;
    frameWidth: number;
    // ── Capa 1: Fondo ──
    emboss: boolean;
    // ── Capa 2: Vectores (DOS, SEIS, _26) — reflejo propio ──
    // ── Capa 3: Jugador ──
    playerRelief: boolean;
    // ── Capa 4: Contenedores (franja nombre, franja club) ──
    // ── Capa 5: Logo FIFA ──
    // ── Capa 6: Bandera + País vertical ──
    // ── Capa 7: Textos (nombre, datos, club) ──
    // ── Capa 8: Branding (Panini) ──
    // ── Capa 9: Watermark ──
    // ── Reflejos individuales por capa ──
    reflectionFrame: LayerReflection;
    reflectionBg: LayerReflection;     // incluye estilo 'fog' (neblina)
    reflectionVectors: LayerReflection;
    reflectionFifa: LayerReflection;
    // ── Capa 10: Holograma global (siempre encima de todo) ──
    foilType: string;
    foilOpacity: number;
    grainOpacity: number;
    // ── Capa 11: Partículas ──
    particles: 'none' | 'snow' | 'sparks' | 'confetti' | 'glimmers';
    particleDensity: number;
    particleSpeed: number;
    // ── Motor 3D ──
    tiltEnabled: boolean;
  };
}

// Estilos de reflejo por capa (DISTINTOS de los estilos de lámina holográfica global)
export type LayerReflectionStyle =
  | 'none'
  | 'metallic-gold'     // Dorado metálico cálido
  | 'metallic-silver'   // Plateado metálico frío
  | 'brushed-steel'     // Acero cepillado direccional
  | 'copper-glow'       // Cobre con brillo cálido
  | 'emerald-shine'     // Verde esmeralda brillante
  | 'ruby-gloss'        // Rojo rubí brillante
  | 'pearl'             // Perla nacarada iridiscente
  | 'obsidian'          // Negro obsidiana con brillo sutil
  | 'fog';              // Neblina animada (solo disponible para fondo)

export interface LayerReflection {
  enabled: boolean;
  style: LayerReflectionStyle;
  intensity: number; // 0-100
}

export const INITIAL_CARD_DATA: CardData = {
  id: 'default',
  name: 'Nueva Tarjeta',
  colors: {
    fondo: '#42C4C6',
    dos: '#21774E',
    seis: '#D93620',
    inter: '#51A04C',
    nombreBg: '#1D878C',
    clubBg: '#1D878C',
    fifaLogo: '#FFFFFF',
    paisStroke: '#FFFFFF',
  },
  texts: {
    firstName: 'CRISTIANO',
    lastName: 'RONALDO',
    birthDate: '05-02-1985',
    height: '1,87m',
    weight: '83kg',
    clubName: 'Al Nassr Fc',
    clubAbbreviation: 'NFC',
    paisName: 'POR',
  },
  images: {
    player: null,
    playerTransform: { scale: 1, rotate: 0, x: 0, y: 0 },
    flag: null,
    flagTransform: { scale: 1, rotate: 0, x: 0, y: 0 },
    panini: paniniLogo,
    paniniTransform: { scale: 2.5, rotate: 0, x: -195, y: 35 },
    backCard: backCardImg,
    backCardTransform: { scale: 1, rotate: 0, x: 0, y: 0 },
  },
  layout: {
    padding: 70,
    showWatermark: true,
    paisTransform: {
      x: 4496,
      y: 5250,
      fontSize: 560,
      spacing: 0.9,
      strokeWidth: 21,
    },
    nameTransform: {
      x: 2025.74,
      y: 5960.33,
      fontSize: 236.57,
    },
    dataTransform: {
      x: 2025.74,
      y: 6268.24,
      fontSize: 200,
    },
    clubTransform: {
      x: 1750,
      y: 6600,
      fontSize: 170,
    },
  },
  effects: {
    frameEnabled: false,
    frameColor: '#D4AF37',
    frameWidth: 8,
    emboss: false,
    playerRelief: false,
    reflectionFrame: { enabled: false, style: 'none', intensity: 50 },
    reflectionBg: { enabled: false, style: 'none', intensity: 50 },
    reflectionVectors: { enabled: false, style: 'none', intensity: 50 },
    reflectionFifa: { enabled: false, style: 'none', intensity: 50 },
    foilType: 'none',
    foilOpacity: 50,
    grainOpacity: 15,
    particles: 'none',
    particleDensity: 50,
    particleSpeed: 1.0,
    tiltEnabled: true,
  },
};
