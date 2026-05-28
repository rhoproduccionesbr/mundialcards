import paniniLogo from './logo-panini-256.png';
import backCardImg from './backcard.png';

export interface BrandHologramSettings {
  enabled: boolean;
  density: number;          // tile size in pixels (e.g. 50 to 500, default 150)
  rotation: number;         // rotation in degrees (0-360)
  xOffset: number;          // position offset X in pixels
  yOffset: number;          // position offset Y in pixels
  opacity: number;          // opacity percentage (0-100)
  colorMode: 'solid' | 'linear' | 'radial';
  color: string;            // hex tint color (or start color for gradient)
  color2: string;           // end color for gradient
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'color-dodge' | 'color' | 'luminosity';
  reflectionEnabled: boolean;
  reflectionStyle: LayerReflectionStyle;
  reflectionIntensity: number;
  reflectionRoughness: number;
}

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
  visibleLayers?: {
    frame: boolean;
    background: boolean;
    vectors: boolean;
    player: boolean;
    banners: boolean;
    texts: boolean;
    flag: boolean;
    country: boolean;
    fifa: boolean;
    panini: boolean;
    watermark: boolean;
    hologram: boolean;
    particles: boolean;
    brandHologram?: boolean;
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
  brandHologram?: BrandHologramSettings;
}

// Materiales de superficie por capa (usan filtros SVG nativos: feSpecularLighting + fePointLight)
export type LayerReflectionStyle =
  | 'none'
  | 'glossy'            // Brillante liso
  | 'chrome'            // Espejo cromado
  | 'metallic-gold'     // Dorado metálico
  | 'metallic-silver'   // Plateado metálico
  | 'rough-gold'        // Dorado rugoso
  | 'rough-silver'      // Plateado rugoso
  | 'pearl'             // Perla nacarada
  | 'obsidian';         // Obsidiana oscura

export interface LayerReflection {
  enabled: boolean;
  style: LayerReflectionStyle;
  intensity: number;   // 0-100 (how visible the effect is)
  roughness: number;   // 0-100 (surface texture, 0=smooth)
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
  visibleLayers: {
    frame: true,
    background: true,
    vectors: true,
    player: true,
    banners: true,
    texts: true,
    flag: true,
    country: true,
    fifa: true,
    panini: true,
    watermark: true,
    hologram: true,
    particles: false,
    brandHologram: false,
  },
  effects: {
    frameEnabled: false,
    frameColor: '#D4AF37',
    frameWidth: 8,
    emboss: false,
    playerRelief: false,
    reflectionFrame: { enabled: false, style: 'none', intensity: 50, roughness: 10 },
    reflectionBg: { enabled: false, style: 'none', intensity: 50, roughness: 10 },
    reflectionVectors: { enabled: false, style: 'none', intensity: 50, roughness: 10 },
    reflectionFifa: { enabled: false, style: 'none', intensity: 50, roughness: 10 },
    foilType: 'none',
    foilOpacity: 50,
    grainOpacity: 15,
    particles: 'none',
    particleDensity: 50,
    particleSpeed: 1.0,
    tiltEnabled: true,
  },
  brandHologram: {
    enabled: false,
    density: 150,
    rotation: 0,
    xOffset: 0,
    yOffset: 0,
    opacity: 50,
    colorMode: 'solid',
    color: '#00FFFF',
    color2: '#FF00FF',
    blendMode: 'screen',
    reflectionEnabled: false,
    reflectionStyle: 'none',
    reflectionIntensity: 50,
    reflectionRoughness: 10,
  },
};
