import paniniLogo from './logo-panini-256.png';

export interface CardData {
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
  };
  effects: {
    foilType: string;
    foilOpacity: number;
    emboss: boolean;
    tiltEnabled: boolean;
  };
}

export const INITIAL_CARD_DATA: CardData = {
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
  },
  layout: {
    padding: 0,
    showWatermark: true,
    paisTransform: {
      x: 4496,
      y: 5250,
      fontSize: 560,
      spacing: 0.9,
      strokeWidth: 21,
    },
  },
  effects: {
    foilType: 'rainbow',
    foilOpacity: 50,
    emboss: true,
    tiltEnabled: true,
  },
};
