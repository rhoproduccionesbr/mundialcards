import React, { useState, useRef, ChangeEvent } from 'react';
import { Download, RotateCcw, Upload, ChevronDown, ChevronRight, Palette, Image as ImageIcon, Type, Globe, Sparkles, Eye, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { CardData, INITIAL_CARD_DATA } from './types';
import SVGCard from './components/SVGCard';

const cardTemplates = [
  {
    id: 'default',
    name: 'Estándar',
    colors: INITIAL_CARD_DATA.colors,
    effects: INITIAL_CARD_DATA.effects
  },
  {
    id: 'gold',
    name: 'Oro (Gold)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#B8860B', // Dark goldenrod
      inter: '#DAA520', // Goldenrod
      dos: '#FFD700', // Gold
      seis: '#FFF8DC', // Cornsilk
      nombreBg: '#8B6508',
      clubBg: '#B8860B',
      fifaLogo: '#FFFFFF',
      paisStroke: '#FFFFFF'
    },
    effects: {
      foilType: 'gold',
      foilOpacity: 60,
      emboss: true,
      tiltEnabled: true
    }
  },
  {
    id: 'totw',
    name: 'TOTW (In Form)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#111111',
      inter: '#FFD700',
      dos: '#333333',
      seis: '#FFFFFF',
      nombreBg: '#000000',
      clubBg: '#222222',
      fifaLogo: '#FFFFFF',
      paisStroke: '#000000'
    },
    effects: {
      foilType: 'chrome',
      foilOpacity: 50,
      emboss: true,
      tiltEnabled: true
    }
  },
  {
    id: 'icon',
    name: 'Icono',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#FFFFFF',
      inter: '#F0F0F0',
      dos: '#D4AF37', // Gold metallic
      seis: '#000000',
      nombreBg: '#FFFFFF',
      clubBg: '#F0F0F0',
      fifaLogo: '#000000',
      paisStroke: '#000000'
    },
    effects: {
      foilType: 'rainbow',
      foilOpacity: 30,
      emboss: true,
      tiltEnabled: true
    }
  }
];

const Section: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left mb-4 group"
      >
        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest cursor-pointer group-hover:text-cyan-500 transition-colors flex items-center gap-2">
          <Icon size={12} />
          {title}
        </label>
        {isOpen ? <ChevronDown size={14} className="text-neutral-600" /> : <ChevronRight size={14} className="text-neutral-600" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default function App() {
  const [data, setData] = useState<CardData>(() => {
    try {
      const saved = localStorage.getItem('paninicardmaker_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial data to ensure all new fields (like effects) exist
        return {
          ...INITIAL_CARD_DATA,
          ...parsed,
          effects: parsed.effects || INITIAL_CARD_DATA.effects,
          colors: { ...INITIAL_CARD_DATA.colors, ...parsed.colors },
          texts: { ...INITIAL_CARD_DATA.texts, ...parsed.texts },
          images: { ...INITIAL_CARD_DATA.images, ...parsed.images },
          layout: { ...INITIAL_CARD_DATA.layout, ...parsed.layout }
        };
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return INITIAL_CARD_DATA;
  });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem('paninicardmaker_data', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage error (quota exceeded likely)', e);
    }
  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const applyTemplate = (templateId: string) => {
    const template = cardTemplates.find(t => t.id === templateId);
    if (template) {
      setData(prev => ({ ...prev, colors: template.colors, effects: template.effects || prev.effects }));
    }
  };

  const handleColorChange = (key: keyof CardData['colors'], value: string) => {
    setData(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const handleTextChange = (key: keyof CardData['texts'], value: string) => {
    setData(prev => ({
      ...prev,
      texts: { ...prev.texts, [key]: value }
    }));
  };

  const handleImageUpload = (key: keyof CardData['images'], e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setData(prev => ({
          ...prev,
          images: { ...prev.images, [key]: event.target?.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransformChange = (key: 'playerTransform' | 'flagTransform' | 'paniniTransform', field: 'scale' | 'rotate' | 'x' | 'y', value: number) => {
    setData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: { ...prev.images[key], [field]: value }
      }
    }));
  };

  const handlePaddingChange = (value: number) => {
    setData(prev => ({
      ...prev,
      layout: { ...prev.layout, padding: value }
    }));
  };

  const handleEffectChange = (key: keyof CardData['effects'], value: string | number | boolean) => {
    setData(prev => ({
      ...prev,
      effects: { ...prev.effects, [key]: value }
    }));
  };

  const handlePaisTransformChange = (field: keyof CardData['layout']['paisTransform'], value: number) => {
    setData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        paisTransform: { ...prev.layout.paisTransform, [field]: value }
      }
    }));
  };

  const handleNameTransformChange = (field: keyof CardData['layout']['nameTransform'], value: number) => {
    setData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        nameTransform: { ...(prev.layout.nameTransform || INITIAL_CARD_DATA.layout.nameTransform), [field]: value }
      }
    }));
  };

  const handleDataTransformChange = (field: keyof CardData['layout']['dataTransform'], value: number) => {
    setData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        dataTransform: { ...(prev.layout.dataTransform || INITIAL_CARD_DATA.layout.dataTransform), [field]: value }
      }
    }));
  };

  const handleClubTransformChange = (field: keyof CardData['layout']['clubTransform'], value: number) => {
    setData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        clubTransform: { ...(prev.layout.clubTransform || INITIAL_CARD_DATA.layout.clubTransform), [field]: value }
      }
    }));
  };

  const exportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(data.texts.firstName + '_' + data.texts.lastName).replace(/\s+/g, '_')}_Card.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPNG = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    
    try {
      const element = svgRef.current;
      
      // La resolución nativa del SVG es 5020x6758. Calculamos un pixel ratio para obtener
      // un PNG de muy alta calidad (aprox 2400px de ancho).
      const targetWidth = 2400;
      const scale = targetWidth / element.clientWidth;
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: scale > 0 ? scale : 3,
        skipFonts: false,
      });
      
      const link = document.createElement('a');
      link.download = `${(data.texts.firstName + '_' + data.texts.lastName).replace(/\s+/g, '_')}_Card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      alert('Hubo un error al generar el PNG. Intente exportar en SVG.');
    } finally {
      setIsExporting(false);
    }
  };

  const reset = () => {
    setData(INITIAL_CARD_DATA);
    setSelectedElement(null);
  };

  const renderAllControls = () => {
    return (
      <div className="space-y-4 pb-12">
        <Section title="Background & Layout" icon={Palette} defaultOpen={selectedElement === 'canvas' || selectedElement === null}>
          <div className="mb-4">
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1 block">Plantilla Visual</label>
            <select 
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors appearance-none"
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue="default"
            >
              {cardTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ColorField label="FONDO" value={data.colors.fondo} onChange={(v) => handleColorChange('fondo', v)} id="fondo" />
            <ColorField label="INTER" value={data.colors.inter} onChange={(v) => handleColorChange('inter', v)} id="inter" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Marca de Agua (FanasEdition)</label>
            <input 
              type="checkbox" 
              checked={data.layout.showWatermark ?? true} 
              onChange={(e) => setData(prev => ({ ...prev, layout: { ...prev.layout, showWatermark: e.target.checked } }))} 
              className="accent-cyan-500" 
            />
          </div>
          <SliderField label="Margin / Padding" value={data.layout.padding} min={0} max={1000} step={10} onChange={handlePaddingChange} />
        </Section>

        <Section title="Efectos & Holograma" icon={Sparkles} defaultOpen={selectedElement === 'effects'}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Activar Relieve (Emboss)</label>
              <input type="checkbox" checked={data.effects.emboss} onChange={(e) => handleEffectChange('emboss', e.target.checked)} className="accent-cyan-500" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Movimiento 3D (Tilt)</label>
              <input type="checkbox" checked={data.effects.tiltEnabled} onChange={(e) => handleEffectChange('tiltEnabled', e.target.checked)} className="accent-cyan-500" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Estilo Holográfico</label>
              <select 
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors appearance-none"
                value={data.effects.foilType}
                onChange={(e) => handleEffectChange('foilType', e.target.value)}
              >
                <option value="none">Sin brillo</option>
                <option value="rainbow">Arcoíris (Rainbow)</option>
                <option value="gold">Dorado (Gold)</option>
                <option value="chrome">Plateado (Chrome)</option>
                <option value="cosmos">Cosmos / Galaxia</option>
              </select>
            </div>
            {data.effects.foilType !== 'none' && (
              <SliderField label="Intensidad del Brillo (%)" value={data.effects.foilOpacity} min={0} max={100} step={5} onChange={(v) => handleEffectChange('foilOpacity', v)} />
            )}
          </div>
        </Section>

        <Section title="Graphic Shapes" icon={Palette} defaultOpen={selectedElement === 'shapes'}>
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="DOS" value={data.colors.dos} onChange={(v) => handleColorChange('dos', v)} id="dos" />
            <ColorField label="SEIS" value={data.colors.seis} onChange={(v) => handleColorChange('seis', v)} id="seis" />
            <ColorField label="INTER" value={data.colors.inter} onChange={(v) => handleColorChange('inter', v)} id="inter" />
          </div>
        </Section>

        <Section title="Player Image" icon={ImageIcon} defaultOpen={selectedElement === 'player'}>
          <div className="mb-4 text-xs">
            <MediaField label="Portrait" hasImage={!!data.images.player} onUpload={(e) => handleImageUpload('player', e)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SliderField label="Zoom" value={data.images.playerTransform.scale} min={0.1} max={5} step={0.1} onChange={(v) => handleTransformChange('playerTransform', 'scale', v)} />
            <SliderField label="Rotation" value={data.images.playerTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('playerTransform', 'rotate', v)} />
            <SliderField label="Pos X" value={data.images.playerTransform.x} min={-1000} max={1000} step={10} onChange={(v) => handleTransformChange('playerTransform', 'x', v)} />
            <SliderField label="Pos Y" value={data.images.playerTransform.y} min={-1000} max={1000} step={10} onChange={(v) => handleTransformChange('playerTransform', 'y', v)} />
          </div>
        </Section>

        <Section title="Flag / Region" icon={Globe} defaultOpen={selectedElement === 'flag'}>
          <div className="mb-4 text-xs">
            <MediaField label="Flag Image" hasImage={!!data.images.flag} onUpload={(e) => handleImageUpload('flag', e)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SliderField label="Zoom" value={data.images.flagTransform.scale} min={0.1} max={5} step={0.1} onChange={(v) => handleTransformChange('flagTransform', 'scale', v)} />
            <SliderField label="Rotation" value={data.images.flagTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('flagTransform', 'rotate', v)} />
            <SliderField label="Pos X" value={data.images.flagTransform.x} min={-500} max={500} step={5} onChange={(v) => handleTransformChange('flagTransform', 'x', v)} />
            <SliderField label="Pos Y" value={data.images.flagTransform.y} min={-500} max={500} step={5} onChange={(v) => handleTransformChange('flagTransform', 'y', v)} />
          </div>
        </Section>

        <Section title="Panini Logo" icon={ImageIcon} defaultOpen={selectedElement === 'panini'}>
          <div className="mb-4 text-xs">
            <MediaField label="Panini Image" hasImage={!!data.images.panini} onUpload={(e) => handleImageUpload('panini', e)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SliderField label="Zoom" value={data.images.paniniTransform.scale} min={0.1} max={5} step={0.1} onChange={(v) => handleTransformChange('paniniTransform', 'scale', v)} />
            <SliderField label="Rotation" value={data.images.paniniTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('paniniTransform', 'rotate', v)} />
            <SliderField label="Pos X" value={data.images.paniniTransform.x} min={-500} max={1500} step={5} onChange={(v) => handleTransformChange('paniniTransform', 'x', v)} />
            <SliderField label="Pos Y" value={data.images.paniniTransform.y} min={-500} max={1500} step={5} onChange={(v) => handleTransformChange('paniniTransform', 'y', v)} />
          </div>
        </Section>

        <Section title="Player Information" icon={Type} defaultOpen={selectedElement === 'texts'}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <TextField label="Name" value={data.texts.firstName} onChange={(v) => handleTextChange('firstName', v)} />
            <TextField label="Last Name" value={data.texts.lastName} onChange={(v) => handleTextChange('lastName', v)} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4 bg-black/20 p-2 rounded">
            <SliderField label="Name X" value={data.layout.nameTransform?.x ?? 2025.74} min={1000} max={3000} step={10} onChange={(v) => handleNameTransformChange('x', v)} />
            <SliderField label="Name Y" value={data.layout.nameTransform?.y ?? 5960.33} min={5000} max={6800} step={10} onChange={(v) => handleNameTransformChange('y', v)} />
            <SliderField label="Name Size" value={data.layout.nameTransform?.fontSize ?? 236.57} min={50} max={400} step={5} onChange={(v) => handleNameTransformChange('fontSize', v)} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <TextField label="Birth" value={data.texts.birthDate} onChange={(v) => handleTextChange('birthDate', v)} />
            <TextField label="Height" value={data.texts.height} onChange={(v) => handleTextChange('height', v)} />
            <TextField label="Weight" value={data.texts.weight} onChange={(v) => handleTextChange('weight', v)} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4 bg-black/20 p-2 rounded">
            <SliderField label="Data X" value={data.layout.dataTransform?.x ?? 2025.74} min={1000} max={3000} step={10} onChange={(v) => handleDataTransformChange('x', v)} />
            <SliderField label="Data Y" value={data.layout.dataTransform?.y ?? 6268.24} min={5000} max={6800} step={10} onChange={(v) => handleDataTransformChange('y', v)} />
            <SliderField label="Data Size" value={data.layout.dataTransform?.fontSize ?? 200} min={50} max={400} step={5} onChange={(v) => handleDataTransformChange('fontSize', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <TextField label="Club" value={data.texts.clubName} onChange={(v) => handleTextChange('clubName', v)} />
            <TextField label="Abbr." value={data.texts.clubAbbreviation} onChange={(v) => handleTextChange('clubAbbreviation', v)} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4 bg-black/20 p-2 rounded">
            <SliderField label="Club X" value={data.layout.clubTransform?.x ?? 1750} min={1000} max={3000} step={10} onChange={(v) => handleClubTransformChange('x', v)} />
            <SliderField label="Club Y" value={data.layout.clubTransform?.y ?? 6600} min={5000} max={7000} step={10} onChange={(v) => handleClubTransformChange('y', v)} />
            <SliderField label="Club Size" value={data.layout.clubTransform?.fontSize ?? 170} min={50} max={300} step={5} onChange={(v) => handleClubTransformChange('fontSize', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <ColorField label="Name Ribbon" value={data.colors.nombreBg} onChange={(v) => handleColorChange('nombreBg', v)} id="nombreBg" />
            <ColorField label="Club Ribbon" value={data.colors.clubBg} onChange={(v) => handleColorChange('clubBg', v)} id="clubBg" />
          </div>
        </Section>

        <Section title="ISO / Vertical Text" icon={Type} defaultOpen={selectedElement === 'pais'}>
          <div className="mb-4">
            <TextField label="ISO Code" value={data.texts.paisName} onChange={(v) => handleTextChange('paisName', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <SliderField label="Pos X" value={data.layout.paisTransform.x} min={3000} max={6000} step={10} onChange={(v) => handlePaisTransformChange('x', v)} />
            <SliderField label="Pos Y" value={data.layout.paisTransform.y} min={3000} max={6000} step={10} onChange={(v) => handlePaisTransformChange('y', v)} />
            <SliderField label="Size" value={data.layout.paisTransform.fontSize} min={100} max={600} step={5} onChange={(v) => handlePaisTransformChange('fontSize', v)} />
            <SliderField label="Spacing" value={data.layout.paisTransform.spacing} min={0.5} max={2.0} step={0.05} onChange={(v) => handlePaisTransformChange('spacing', v)} />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
             <ColorField label="Stroke Color" value={data.colors.paisStroke} onChange={(v) => handleColorChange('paisStroke', v)} id="paisStroke" />
             <SliderField label="Stroke Width" value={data.layout.paisTransform.strokeWidth} min={1} max={50} step={1} onChange={(v) => handlePaisTransformChange('strokeWidth', v)} />
          </div>
        </Section>

        <Section title="FIFA Branding" icon={Palette} defaultOpen={selectedElement === 'branding'}>
          <ColorField label="FIFA Logo Color" value={data.colors.fifaLogo} onChange={(v) => handleColorChange('fifaLogo', v)} id="fifaLogo" />
        </Section>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">
      {/* Full-Screen Preview Overlay */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <button 
              onClick={() => setIsPreviewMode(false)}
              className="absolute top-6 right-6 p-4 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-full transition-colors z-[60]"
              title="Cerrar Vista Previa"
            >
              <X size={24} />
            </button>
            <div 
              className="relative w-full max-w-5xl h-[90vh] flex items-center justify-center p-8"
              style={{ perspective: '1500px' }}
            >
              <div 
                className="relative h-full w-auto aspect-[5020/6758]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: data.effects.tiltEnabled && isHovering 
                    ? `rotateX(${(50 - mousePos.y) / 4}deg) rotateY(${-(50 - mousePos.x) / 4}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                  transition: isHovering ? 'none' : 'transform 0.5s ease'
                }}
              >
                <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 block m-auto" style={{ transform: 'translateZ(-50px)' }}></div>
                <div 
                  ref={cardContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 50, y: 50 }); }}
                  className="relative group p-1 bg-white/5 backdrop-blur-sm shadow-2xl border border-white/10 overflow-hidden w-full h-full flex items-center justify-center rounded-[3%]"
                  style={{
                    boxShadow: data.effects.emboss ? 'inset 0 0 10px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  <SVGCard 
                    data={data} 
                    svgRef={svgRef} 
                  />
                  {/* Foil Holographic Overlay */}
                  {data.effects.foilType !== 'none' && (
                    <div 
                      className={`absolute inset-0 pointer-events-none rounded-[3%] mix-blend-color-dodge transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        opacity: isHovering ? data.effects.foilOpacity / 100 : 0,
                        backgroundImage: data.effects.foilType === 'rainbow' ? `
                          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%), 
                          linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.5) 30%, rgba(255,0,128,0.5) 50%, rgba(0,255,255,0.5) 70%, transparent 80%)
                        ` : data.effects.foilType === 'gold' ? `
                          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,215,0,0.9) 0%, rgba(184,134,11,0.5) 30%, transparent 70%),
                          linear-gradient(115deg, transparent 20%, rgba(255,248,220,0.4) 40%, rgba(218,165,32,0.6) 60%, transparent 80%)
                        ` : data.effects.foilType === 'chrome' ? `
                          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.5) 30%, transparent 70%),
                          linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.6) 40%, rgba(150,150,150,0.4) 60%, transparent 80%)
                        ` : data.effects.foilType === 'cosmos' ? `
                          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9) 0%, rgba(255,0,255,0.3) 20%, rgba(0,255,255,0.3) 40%, transparent 70%),
                          url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDIiIGhlaWdodD0iNDAyIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjMwMCIgcj0iMSIvPjwvZz48L3N2Zz4=')
                        ` : 'none',
                        backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                        backgroundSize: data.effects.foilType === 'cosmos' ? '100% 100%, 200px 200px' : '200% 200%',
                        mixBlendMode: data.effects.foilType === 'cosmos' ? 'screen' : 'color-dodge',
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 border-b border-neutral-900 flex items-center justify-between px-4 sm:px-6 bg-neutral-900/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-black tracking-tighter flex items-center gap-2">
            <span className="text-cyan-500">⚽</span> EA FC26
          </h1>
          <div className="hidden sm:flex h-4 w-px bg-neutral-800"></div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Live Engine</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={reset}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"
            title="Reset All"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Previa</span>
          </button>
          <button 
            onClick={exportSVG}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">SVG</span>
          </button>
          <button 
            onClick={exportPNG}
            disabled={isExporting}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span className="hidden sm:inline">{isExporting ? 'Procesando...' : 'PNG HQ'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative w-full flex-col md:flex-row">
        
        {/* Desktop Sidebar (Web) fixed on the left */}
        <aside 
          className="hidden md:flex flex-col bg-neutral-900 border-r border-cyan-500/20 z-40 transition-all duration-[400ms] shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 w-96 h-full" 
        >
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
             <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-500">Editor Controls</h2>
          </div>
          <div className="px-6 py-4 overflow-y-auto scrollbar-hide flex-1">
            {renderAllControls()}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.05)_0%,rgba(0,0,0,1)_100%)] p-4 md:p-8" style={{ perspective: '1500px' }}>
          <div 
            className="relative h-full max-h-[85vh] w-auto aspect-[5020/6758] transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.98] mx-auto flex items-center justify-center shrink-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: data.effects.tiltEnabled && isHovering 
                ? `rotateX(${(50 - mousePos.y) / 4}deg) rotateY(${-(50 - mousePos.x) / 4}deg)` 
                : 'rotateX(0deg) rotateY(0deg)',
              transition: isHovering ? 'none' : 'transform 0.5s ease'
            }}
          >
            {/* Decorative glows focused on card */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 block m-auto" style={{ transform: 'translateZ(-50px)' }}></div>
            
            <div 
              ref={cardContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 50, y: 50 }); }}
              className="relative group p-1 bg-white/5 backdrop-blur-sm shadow-2xl border border-white/10 overflow-hidden w-full h-full flex items-center justify-center rounded-[3%]"
              style={{
                boxShadow: data.effects.emboss ? 'inset 0 0 10px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              <SVGCard 
                data={data} 
                svgRef={svgRef} 
                selectedElement={selectedElement}
                onSelect={setSelectedElement}
              />
              
              {/* Foil Holographic Overlay */}
              {data.effects.foilType !== 'none' && (
                <div 
                  className={`absolute inset-0 pointer-events-none rounded-[3%] mix-blend-color-dodge transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    opacity: isHovering ? data.effects.foilOpacity / 100 : 0,
                    backgroundImage: data.effects.foilType === 'rainbow' ? `
                      radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%), 
                      linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.5) 30%, rgba(255,0,128,0.5) 50%, rgba(0,255,255,0.5) 70%, transparent 80%)
                    ` : data.effects.foilType === 'gold' ? `
                      radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,215,0,0.9) 0%, rgba(184,134,11,0.5) 30%, transparent 70%),
                      linear-gradient(115deg, transparent 20%, rgba(255,248,220,0.4) 40%, rgba(218,165,32,0.6) 60%, transparent 80%)
                    ` : data.effects.foilType === 'chrome' ? `
                      radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.5) 30%, transparent 70%),
                      linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.6) 40%, rgba(150,150,150,0.4) 60%, transparent 80%)
                    ` : data.effects.foilType === 'cosmos' ? `
                      radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9) 0%, rgba(255,0,255,0.3) 20%, rgba(0,255,255,0.3) 40%, transparent 70%),
                      url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDIiIGhlaWdodD0iNDAyIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjMwMCIgcj0iMSIvPjwvZz48L3N2Zz4=')
                    ` : 'none',
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: data.effects.foilType === 'cosmos' ? '100% 100%, 200px 200px' : '200% 200%',
                    mixBlendMode: data.effects.foilType === 'cosmos' ? 'screen' : 'color-dodge',
                  }}
                ></div>
              )}
            </div>
          </div>
          
          <button
             className="absolute inset-0 z-0 w-full h-full cursor-default focus:outline-none"
             onClick={() => setSelectedElement(null)}
             tabIndex={-1}
          />

          {/* Floating deselect button */}
          <AnimatePresence>
            {selectedElement && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedElement(null)}
                className="absolute top-6 right-6 p-4 bg-neutral-900/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-white border border-neutral-800 shadow-2xl z-30 hidden md:block"
                title="Deselect Element"
              >
                <RotateCcw size={20} className="rotate-45" />
              </motion.button>
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Contextual Bottom Sheet */}
        <motion.aside 
          initial={false}
          animate={{ 
            y: selectedElement ? 0 : '100%',
            opacity: selectedElement ? 1 : 0
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`md:hidden absolute bottom-0 left-0 right-0 w-full mx-auto bg-neutral-900 border-t border-cyan-500/20 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-40 overflow-hidden flex flex-col h-[50vh] ${selectedElement ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Handle for drag feel */}
          <div 
            className="h-1.5 w-10 bg-neutral-700 rounded-full mx-auto my-3 cursor-pointer"
            onClick={() => selectedElement && setSelectedElement(null)}
          />
          
          <div className="px-6 pb-8 overflow-y-auto scrollbar-hide flex-1 space-y-4">
            {renderAllControls()}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void; id: string }> = ({ label, value, onChange, id }) => (
  <div className="space-y-1.5">
    <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-tight">{label}</span>
    <label htmlFor={id} className="flex gap-2 items-center bg-neutral-800 p-2 rounded border border-neutral-700 group hover:border-neutral-600 transition-all cursor-pointer">
      <div 
        className="w-4 h-4 rounded-sm border border-black/20" 
        style={{ backgroundColor: value }}
      />
      <span className="text-[10px] font-mono text-neutral-300">{value.toUpperCase()}</span>
      <input 
        type="color" 
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </label>
  </div>
);

const TextField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">{label}</span>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
    />
  </div>
);

const MediaField: React.FC<{ label: string; hasImage: boolean; onUpload: (e: ChangeEvent<HTMLInputElement>) => void }> = ({ label, hasImage, onUpload }) => (
  <div className="space-y-1.5">
    <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">{label}</span>
    <label className="flex items-center justify-between bg-neutral-800 p-3 rounded border border-neutral-700 group hover:border-cyan-500/30 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded ${hasImage ? 'bg-cyan-900/30 text-cyan-500' : 'bg-neutral-700 text-neutral-500'} flex items-center justify-center text-xs transition-colors`}>
          {hasImage ? <ImageIcon size={14} /> : '👤'}
        </div>
        <span className="text-xs text-neutral-300 truncate w-32">{hasImage ? 'Resource Loaded' : 'No Data...'}</span>
      </div>
      <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest group-hover:opacity-100 opacity-60 transition-opacity">
        {hasImage ? 'Replace' : 'Upload'}
      </span>
      <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
    </label>
  </div>
);

const SliderField: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }> = ({ label, value, min, max, step, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-neutral-500">
      <span>{label}</span>
      <span className="font-mono text-cyan-500">{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);
