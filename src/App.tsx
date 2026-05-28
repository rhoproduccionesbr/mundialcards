import React, { useState, useRef, ChangeEvent } from 'react';
import { Download, RotateCcw, Upload, ChevronDown, ChevronRight, Palette, Image as ImageIcon, Type, Globe, Sparkles, Eye, EyeOff, X, Loader2, RefreshCcw, FlipHorizontal, Trash2, Plus, Save, Folder, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { CardData, INITIAL_CARD_DATA, LayerReflection, LayerReflectionStyle } from './types';
import SVGCard from './components/SVGCard';
import Particles from './components/Particles';
import ColorPickerField from './components/ColorPickerField';
import { generateNoiseTexture } from './utils/noiseTexture';
import './holo-lamina.css';

const cardTemplates = [
  {
    id: 'default',
    name: '⚽ Estándar',
    colors: INITIAL_CARD_DATA.colors,
    effects: INITIAL_CARD_DATA.effects
  },
  {
    id: 'gold',
    name: '🥇 Oro (Gold)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#B8860B',
      inter: '#DAA520',
      dos: '#FFD700',
      seis: '#FFF8DC',
      nombreBg: '#8B6508',
      clubBg: '#B8860B',
      fifaLogo: '#FFFFFF',
      paisStroke: '#FFFFFF'
    },
    effects: { foilType: 'gold', foilOpacity: 65, emboss: false, tiltEnabled: true }
  },
  {
    id: 'totw',
    name: '🖤 TOTW (In Form)',
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
    effects: { foilType: 'chrome', foilOpacity: 55, emboss: false, tiltEnabled: true }
  },
  {
    id: 'icon',
    name: '⭐ Icono',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#FFFFFF',
      inter: '#F0F0F0',
      dos: '#D4AF37',
      seis: '#000000',
      nombreBg: '#FFFFFF',
      clubBg: '#F0F0F0',
      fifaLogo: '#000000',
      paisStroke: '#000000'
    },
    effects: { foilType: 'rainbow', foilOpacity: 35, emboss: false, tiltEnabled: true }
  },
  {
    id: 'heroes',
    name: '🦸 FUT Heroes',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#2D0E4F',
      inter: '#5B1F8A',
      dos: '#8B3CF7',
      seis: '#C084FC',
      nombreBg: '#1A0A30',
      clubBg: '#2D0E4F',
      fifaLogo: '#C084FC',
      paisStroke: '#C084FC'
    },
    effects: { foilType: 'prismatic', foilOpacity: 70, emboss: false, tiltEnabled: true }
  },
  {
    id: 'fut_future',
    name: '⚡ FUT Future',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#001B3D',
      inter: '#0038A8',
      dos: '#00B4FF',
      seis: '#00EEFF',
      nombreBg: '#001530',
      clubBg: '#001B3D',
      fifaLogo: '#00EEFF',
      paisStroke: '#00EEFF'
    },
    effects: { foilType: 'aqua', foilOpacity: 65, emboss: false, tiltEnabled: true }
  },
  {
    id: 'tott',
    name: '🏆 TOTT',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#0A2E1A',
      inter: '#1A5C35',
      dos: '#2ECC71',
      seis: '#A8FF78',
      nombreBg: '#082414',
      clubBg: '#0A2E1A',
      fifaLogo: '#A8FF78',
      paisStroke: '#A8FF78'
    },
    effects: { foilType: 'rainbow', foilOpacity: 55, emboss: false, tiltEnabled: true }
  },
  {
    id: 'silver',
    name: '🥈 Plata (Silver)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#737373',
      inter: '#A3A3A3',
      dos: '#D4D4D4',
      seis: '#F5F5F5',
      nombreBg: '#525252',
      clubBg: '#616161',
      fifaLogo: '#FFFFFF',
      paisStroke: '#FFFFFF'
    },
    effects: { foilType: 'chrome', foilOpacity: 50, emboss: false, tiltEnabled: true }
  },
  {
    id: 'fire',
    name: '🔥 Fuego (Fire)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#7C1010',
      inter: '#C62828',
      dos: '#FF5722',
      seis: '#FFCC02',
      nombreBg: '#5C0000',
      clubBg: '#7C1010',
      fifaLogo: '#FFCC02',
      paisStroke: '#FFCC02'
    },
    effects: { foilType: 'lava', foilOpacity: 75, emboss: false, tiltEnabled: true }
  },
  {
    id: 'ice',
    name: '❄️ Hielo (Ice)',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#E0F2FE',
      inter: '#BAE6FD',
      dos: '#38BDF8',
      seis: '#0EA5E9',
      nombreBg: '#CCEEFF',
      clubBg: '#E0F2FE',
      fifaLogo: '#0C4A6E',
      paisStroke: '#0C4A6E'
    },
    effects: { foilType: 'aqua', foilOpacity: 45, emboss: false, tiltEnabled: true }
  },
  {
    id: 'midnight',
    name: '🌌 Medianoche',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#030712',
      inter: '#0F172A',
      dos: '#06B6D4',
      seis: '#0E7490',
      nombreBg: '#020617',
      clubBg: '#030712',
      fifaLogo: '#06B6D4',
      paisStroke: '#06B6D4'
    },
    effects: { foilType: 'cosmos', foilOpacity: 80, emboss: false, tiltEnabled: true }
  },
  {
    id: 'champions',
    name: '👑 Champions',
    colors: {
      ...INITIAL_CARD_DATA.colors,
      fondo: '#0A1628',
      inter: '#1E3A5F',
      dos: '#C9A84C',
      seis: '#F5D78E',
      nombreBg: '#070F1A',
      clubBg: '#0A1628',
      fifaLogo: '#C9A84C',
      paisStroke: '#C9A84C'
    },
    effects: { foilType: 'gold', foilOpacity: 65, emboss: false, tiltEnabled: true }
  }
];

export default function App() {
  const [gallery, setGallery] = useState<CardData[]>(() => {
    try {
      const saved = localStorage.getItem('paninicardmaker_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({
          ...INITIAL_CARD_DATA,
          ...p,
          colors: { ...INITIAL_CARD_DATA.colors, ...(p.colors || {}) },
          texts: { ...INITIAL_CARD_DATA.texts, ...(p.texts || {}) },
          images: { ...INITIAL_CARD_DATA.images, ...(p.images || {}) },
          layout: { ...INITIAL_CARD_DATA.layout, ...(p.layout || {}) },
          visibleLayers: { ...INITIAL_CARD_DATA.visibleLayers, ...(p.visibleLayers || {}) },
          effects: { ...INITIAL_CARD_DATA.effects, ...(p.effects || {}) },
        }));
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return [INITIAL_CARD_DATA];
  });

  const [data, setData] = useState<CardData>(() => gallery[0] || INITIAL_CARD_DATA);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layers' | 'gallery' | 'settings'>('layers');
  const svgRef = useRef<SVGSVGElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [enable3D, setEnable3D] = useState(true);

  // GPU-first: DOM refs for tilt wrappers and foil overlays
  const cardWrapperMainRef = useRef<HTMLDivElement>(null);
  const cardWrapperPreviewRef = useRef<HTMLDivElement>(null);
  const foilMainRef = useRef<HTMLDivElement>(null);
  const foilPreviewRef = useRef<HTMLDivElement>(null);
  const tiltEnabledRef = useRef(data.effects.tiltEnabled);
  const rafRef = useRef<number>(0);

  const [isHovering, setIsHovering] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const spinRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastSpinRef = useRef({ x: 0, y: 0 });
  
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Auto-update the active card in the gallery list
  React.useEffect(() => {
    setGallery(prev => prev.map(p => p.id === data.id ? data : p));
  }, [data]);

  // Sync gallery to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('paninicardmaker_gallery', JSON.stringify(gallery));
    } catch (e) {
      console.warn('LocalStorage error (quota exceeded likely)', e);
    }
  }, [gallery]);

  const loadProject = (id: string) => {
    const proj = gallery.find(p => p.id === id);
    if (proj) setData(proj);
  };

  const createNewProject = () => {
    const newProj = { ...INITIAL_CARD_DATA, id: Date.now().toString(), name: `Tarjeta ${gallery.length + 1}` };
    setGallery(prev => [newProj, ...prev]);
    setData(newProj);
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGallery(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const nextGallery = filtered.length === 0 ? [INITIAL_CARD_DATA] : filtered;
      if (data.id === id) setData(nextGallery[0]);
      return nextGallery;
    });
  };

  // ── Lerp system for smooth tilt and light response ──
  const lerpTargetRef = useRef({ x: 50, y: 50 });
  const lerpCurrentRef = useRef({ x: 50, y: 50 });
  const lerpActiveRef = useRef(false);
  const gyroActiveRef = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const startLerpLoop = () => {
    if (lerpActiveRef.current) return;
    lerpActiveRef.current = true;

    const loop = () => {
      if (!lerpActiveRef.current) return;

      const speed = 0.12; // buttery smooth
      const cur = lerpCurrentRef.current;
      const tgt = lerpTargetRef.current;

      cur.x = lerp(cur.x, tgt.x, speed);
      cur.y = lerp(cur.y, tgt.y, speed);

      applyEffectsRaw(cur.x, cur.y);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLerpLoop = () => {
    lerpActiveRef.current = false;
    cancelAnimationFrame(rafRef.current);
  };

  // ── Raw effect application ──
  const applyEffectsRaw = (x: number, y: number) => {
    try {
      const mx = `${x}%`;
      const my = `${y}%`;
      
      const setVars = (el: HTMLElement) => {
        el.style.setProperty('--mx', mx);
        el.style.setProperty('--my', my);
        el.style.setProperty('--pointer-x', mx);
        el.style.setProperty('--pointer-y', my);
        el.style.setProperty('--holo-opacity', '1');
        const fromCenter = Math.min(Math.sqrt((y-50)**2 + (x-50)**2) / 50, 1);
        el.style.setProperty('--pointer-from-center', `${fromCenter}`);
        el.style.setProperty('--pointer-from-top', `${y / 100}`);
        el.style.setProperty('--pointer-from-left', `${x / 100}`);
      };

      if (cardContainerRef.current) setVars(cardContainerRef.current);
      if (foilPreviewRef.current) setVars(foilPreviewRef.current);

      // Light coordinates for the dynamic card-shadow displacement
      const sx = -(x - 50) * 0.4;
      const sy = -(y - 50) * 0.4;
      document.querySelectorAll('.card-shadow-3d').forEach(shadow => {
        (shadow as HTMLElement).style.transform = `translate3d(${sx}px, ${sy}px, -45px)`;
      });

      // Update 3D Light Source for SVG Specular Materials
      if (isFinite(x) && isFinite(y)) {
        const lights = document.querySelectorAll('.svg-light');
        const lx = Math.max(0, Math.min(5020, x * 50.20));
        const ly = Math.max(0, Math.min(6758, y * 67.58));
        lights.forEach(light => {
          light.setAttribute('x', String(lx));
          light.setAttribute('y', String(ly));
        });
      }

      if (tiltEnabledRef.current && !isDraggingRef.current) {
        const tx = (50 - y) / 2.8; // pronounced tilt
        const ty = -(50 - x) / 2.8;
        const finalX = isFinite(spinRef.current.x + tx) ? spinRef.current.x + tx : 0;
        const finalY = isFinite(spinRef.current.y + ty) ? spinRef.current.y + ty : 0;
        
        const t = `translate3d(0,0,0) rotateX(${finalX}deg) rotateY(${finalY}deg)`;
        if (cardWrapperMainRef.current) cardWrapperMainRef.current.style.transform = t;
        if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.style.transform = t;
      }
    } catch (err) {
      console.error("Renderer Error:", err);
    }
  };

  const applyEffects = (x: number, y: number, isDrag = false) => {
    if (isDrag) {
      cancelAnimationFrame(rafRef.current);
      requestAnimationFrame(() => {
        applyEffectsRaw(x, y);
        if (tiltEnabledRef.current || isDrag) {
          const finalX = spinRef.current.x;
          const finalY = spinRef.current.y;
          const t = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
          if (cardWrapperMainRef.current) cardWrapperMainRef.current.style.transform = t;
          if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.style.transform = t;
        }
      });
    } else {
      lerpTargetRef.current = { x, y };
      startLerpLoop();
    }
  };

  const resetEffects = () => {
    stopLerpLoop();
    lerpTargetRef.current = { x: 50, y: 50 };
    lerpCurrentRef.current = { x: 50, y: 50 };
    requestAnimationFrame(() => {
      const t = `rotateX(${spinRef.current.x}deg) rotateY(${spinRef.current.y}deg)`;
      if (cardWrapperMainRef.current) cardWrapperMainRef.current.style.transform = t;
      if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.style.transform = t;
      
      document.querySelectorAll('.card-shadow-3d').forEach(shadow => {
        (shadow as HTMLElement).style.transform = 'translate3d(0px, 0px, -45px)';
      });
    });
  };

  // Gyroscope orientation
  React.useEffect(() => {
    if (!isMobile) return;

    let permissionGranted = false;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!tiltEnabledRef.current) return;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      const y = Math.max(0, Math.min(100, ((beta - 20) / 60) * 100));
      const x = Math.max(0, Math.min(100, ((gamma + 45) / 90) * 100));
      lerpTargetRef.current = { x, y };
      if (!gyroActiveRef.current) {
        gyroActiveRef.current = true;
        startLerpLoop();
      }
    };

    const requestPermission = async () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const perm = await (window.DeviceOrientationEvent as any).requestPermission();
          if (perm === 'granted') {
            permissionGranted = true;
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        } catch (err) {
          console.warn('Gyro permission denied:', err);
        }
      } else {
        permissionGranted = true;
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
      const touchHandler = () => {
        requestPermission();
        document.removeEventListener('touchstart', touchHandler);
      };
      document.addEventListener('touchstart', touchHandler, { once: true });
    } else {
      requestPermission();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      gyroActiveRef.current = false;
      stopLerpLoop();
    };
  }, [data.effects.tiltEnabled]);

  React.useEffect(() => {
    tiltEnabledRef.current = data.effects.tiltEnabled;
    if (!data.effects.tiltEnabled) {
      const reset = 'rotateX(0deg) rotateY(0deg)';
      if (cardWrapperMainRef.current) cardWrapperMainRef.current.style.transform = reset;
      if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.style.transform = reset;
    }
  }, [data.effects.tiltEnabled]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    stopLerpLoop();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastSpinRef.current = { x: spinRef.current.x, y: spinRef.current.y };
    setIsHovering(true);
    
    if (cardWrapperMainRef.current) cardWrapperMainRef.current.classList.add('is-dragging');
    if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.classList.add('is-dragging');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      spinRef.current.y = lastSpinRef.current.y + deltaX * 0.5;
      spinRef.current.x = lastSpinRef.current.x - deltaY * 0.5;
      
      applyEffects(x, y, true);
    } else {
      applyEffects(x, y);
    }
  };

  const snapToFace = () => {
    const targetY = Math.round(spinRef.current.y / 180) * 180;
    spinRef.current.y = targetY;
    spinRef.current.x = 0; 
    
    const isBackFace = (Math.abs(targetY / 180) % 2) === 1;
    if (isFlipped !== isBackFace) setIsFlipped(isBackFace);
    
    resetEffects();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
      
      if (cardWrapperMainRef.current) cardWrapperMainRef.current.classList.remove('is-dragging');
      if (cardWrapperPreviewRef.current) cardWrapperPreviewRef.current.classList.remove('is-dragging');
      
      snapToFace();
    }
    setIsHovering(false);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      setIsHovering(false);
      if (!gyroActiveRef.current) {
        resetEffects();
        const hideHolo = (el: HTMLElement | null) => el?.style.setProperty('--holo-opacity', '0');
        hideHolo(cardContainerRef.current);
        hideHolo(foilPreviewRef.current);
      }
    }
  };

  const handleFlipButton = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    spinRef.current.y = nextFlipped ? 180 : 0;
    spinRef.current.x = 0;
    resetEffects();
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

  const handleTransformChange = (key: 'playerTransform' | 'flagTransform' | 'paniniTransform' | 'backCardTransform', field: 'scale' | 'rotate' | 'x' | 'y', value: number) => {
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

  // ── Helper for per-layer reflections ──
  const handleReflectionChange = (
    layer: 'reflectionFrame' | 'reflectionBg' | 'reflectionVectors' | 'reflectionFifa',
    field: keyof LayerReflection,
    value: boolean | string | number
  ) => {
    setData(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [layer]: { ...prev.effects[layer], [field]: value }
      }
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
      const targetWidth = 2400;
      const scale = targetWidth / element.clientWidth;
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: Math.max(scale, 4),
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

  // ── Layers control logic ──
  const toggleLayerVisibility = (layerId: string) => {
    setData(prev => {
      const visibleLayers = prev.visibleLayers ? { ...prev.visibleLayers } : {
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
        particles: true,
        brandHologram: true
      };
      
      const key = layerId as keyof typeof visibleLayers;
      visibleLayers[key] = !visibleLayers[key];
      
      // Sync frame check with its effects logic
      let frameEnabled = prev.effects.frameEnabled;
      if (layerId === 'frame') {
        frameEnabled = visibleLayers.frame;
      }

      // Sync brand hologram toggle check with its enabled property
      let brandHologram = prev.brandHologram ? { ...prev.brandHologram } : undefined;
      if (layerId === 'brandHologram' && brandHologram) {
        brandHologram.enabled = visibleLayers.brandHologram !== false;
      }

      return {
        ...prev,
        visibleLayers,
        effects: {
          ...prev.effects,
          frameEnabled
        },
        brandHologram
      };
    });
  };

  const isLayerVisible = (layerId: string) => {
    if (!data.visibleLayers) return true;
    const key = layerId as keyof typeof data.visibleLayers;
    return data.visibleLayers[key] !== false;
  };

  const handleElementSelect = (id: string | null) => {
    let mapped = id;
    if (id === 'canvas') mapped = 'background';
    else if (id === 'shapes') mapped = 'vectors';
    else if (id === 'branding') mapped = 'fifa';
    else if (id === 'brandHologram') mapped = 'brandHologram';
    else if (id === 'pais') mapped = 'country';
    setSelectedElement(mapped);
    setActiveTab('layers'); // focus layers tab when clicking card components
  };

  const layersList = [
    { id: 'hologram', name: 'Reflejo / Lámina', icon: Sparkles },
    { id: 'particles', name: 'Partículas 3D', icon: Sparkles },
    { id: 'watermark', name: 'Marca de Agua', icon: Eye },
    { id: 'panini', name: 'Logo Panini', icon: ImageIcon },
    { id: 'texts', name: 'Textos del Jugador', icon: Type },
    { id: 'flag', name: 'Bandera del País', icon: Globe },
    { id: 'country', name: 'Código ISO vertical', icon: Type },
    { id: 'fifa', name: 'Logo FIFA', icon: Palette },
    { id: 'banners', name: 'Franja Nombre y Club', icon: Palette },
    { id: 'player', name: 'Foto del Jugador', icon: ImageIcon },
    { id: 'vectors', name: 'Vectores Gráficos', icon: Palette },
    { id: 'brandHologram', name: 'Holograma de Marca', icon: Sparkles },
    { id: 'background', name: 'Fondo de Tarjeta', icon: Palette },
    { id: 'frame', name: 'Marco / Borde', icon: Palette }
  ];

  const layerReflectionStyles: { value: LayerReflectionStyle; label: string }[] = [
    { value: 'none', label: '🚫 Sin reflejo' },
    { value: 'glossy', label: '✨ Brillante Liso' },
    { value: 'chrome', label: '🪞 Espejo Cromado' },
    { value: 'metallic-gold', label: '🥇 Dorado Metálico' },
    { value: 'metallic-silver', label: '🥈 Plateado Metálico' },
    { value: 'rough-gold', label: '🔶 Dorado Rugoso' },
    { value: 'rough-silver', label: '⚙️ Plateado Rugoso' },
    { value: 'pearl', label: '🦪 Perla Nacarada' },
    { value: 'obsidian', label: '🖤 Obsidiana Oscura' },
  ];

  const ReflectionControl: React.FC<{
    label: string;
    layer: 'reflectionFrame' | 'reflectionBg' | 'reflectionVectors' | 'reflectionFifa';
    styles?: { value: LayerReflectionStyle; label: string }[];
  }> = ({ label, layer, styles }) => {
    const config = data.effects[layer];
    const options = styles || layerReflectionStyles;
    return (
      <div className="mt-3 pt-3 border-t border-neutral-800/60">
        <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 cursor-pointer">
          <input
            type="checkbox"
            checked={config?.enabled ?? false}
            onChange={(e) => handleReflectionChange(layer, 'enabled', e.target.checked)}
            className="accent-cyan-500"
          />
          ✨ {label}
        </label>
        {config?.enabled && (
          <div className="mt-2 space-y-2">
            <select
              value={config.style}
              onChange={(e) => handleReflectionChange(layer, 'style', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white"
            >
              {options.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <SliderField
                label="Intensidad"
                value={config.intensity ?? 50}
                min={0}
                max={100}
                step={5}
                onChange={(v) => handleReflectionChange(layer, 'intensity', v)}
              />
              <SliderField
                label="Rugosidad"
                value={config.roughness ?? 10}
                min={0}
                max={100}
                step={1}
                onChange={(v) => handleReflectionChange(layer, 'roughness', v)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLayerProperties = () => {
    switch (selectedElement) {
      case 'background':
        return (
          <>
            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5 block">Plantilla Preset</label>
              <select 
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-500/50 transition-colors"
                onChange={(e) => applyTemplate(e.target.value)}
                defaultValue="default"
              >
                {cardTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Color Fondo" value={data.colors.fondo} onChange={(v) => handleColorChange('fondo', v)} id="fondo" />
              <ColorField label="Color Inter" value={data.colors.inter} onChange={(v) => handleColorChange('inter', v)} id="inter" />
            </div>
            <SliderField label="Padding del Margen" value={data.layout.padding} min={0} max={1000} step={10} onChange={handlePaddingChange} />
            <ReflectionControl label="Reflejo del Fondo" layer="reflectionBg" />
          </>
        );
      case 'vectors':
        return (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              <ColorField label="DOS" value={data.colors.dos} onChange={(v) => handleColorChange('dos', v)} id="dos" />
              <ColorField label="SEIS" value={data.colors.seis} onChange={(v) => handleColorChange('seis', v)} id="seis" />
              <ColorField label="INTER" value={data.colors.inter} onChange={(v) => handleColorChange('inter', v)} id="inter" />
            </div>
            <ReflectionControl label="Reflejo Vectores" layer="reflectionVectors" />
          </>
        );
      case 'player':
        return (
          <>
            <MediaField label="Fotografía de Jugador" hasImage={!!data.images.player} onUpload={(e) => handleImageUpload('player', e)} />
            <div className="grid grid-cols-2 gap-3.5 mt-2">
              <SliderField label="Escala" value={data.images.playerTransform.scale} min={0.1} max={5} step={0.05} onChange={(v) => handleTransformChange('playerTransform', 'scale', v)} />
              <SliderField label="Rotación" value={data.images.playerTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('playerTransform', 'rotate', v)} />
              <SliderField label="Posición X" value={data.images.playerTransform.x} min={-1000} max={1000} step={5} onChange={(v) => handleTransformChange('playerTransform', 'x', v)} />
              <SliderField label="Posición Y" value={data.images.playerTransform.y} min={-1000} max={1000} step={5} onChange={(v) => handleTransformChange('playerTransform', 'y', v)} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 mt-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Relieve 3D Jugador</label>
              <input type="checkbox" checked={data.effects.playerRelief ?? false} onChange={(e) => handleEffectChange('playerRelief', e.target.checked)} className="accent-cyan-500" />
            </div>
          </>
        );
      case 'banners':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Fondo Nombre" value={data.colors.nombreBg} onChange={(v) => handleColorChange('nombreBg', v)} id="nombreBg" />
              <ColorField label="Fondo Club" value={data.colors.clubBg} onChange={(v) => handleColorChange('clubBg', v)} id="clubBg" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 mt-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Efecto Hueco/Relieve (Emboss)</label>
              <input type="checkbox" checked={data.effects.emboss} onChange={(e) => handleEffectChange('emboss', e.target.checked)} className="accent-cyan-500" />
            </div>
          </>
        );
      case 'fifa':
        return (
          <>
            <ColorField label="Color Logo FIFA" value={data.colors.fifaLogo} onChange={(v) => handleColorChange('fifaLogo', v)} id="fifaLogo" />
            <ReflectionControl label="Reflejo Logo FIFA" layer="reflectionFifa" />
          </>
        );
      case 'flag':
        return (
          <>
            <MediaField label="Imagen de Bandera" hasImage={!!data.images.flag} onUpload={(e) => handleImageUpload('flag', e)} />
            <div className="grid grid-cols-2 gap-3.5 mt-2">
              <SliderField label="Escala" value={data.images.flagTransform.scale} min={0.1} max={5} step={0.05} onChange={(v) => handleTransformChange('flagTransform', 'scale', v)} />
              <SliderField label="Rotación" value={data.images.flagTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('flagTransform', 'rotate', v)} />
              <SliderField label="Posición X" value={data.images.flagTransform.x} min={-500} max={500} step={5} onChange={(v) => handleTransformChange('flagTransform', 'x', v)} />
              <SliderField label="Posición Y" value={data.images.flagTransform.y} min={-500} max={500} step={5} onChange={(v) => handleTransformChange('flagTransform', 'y', v)} />
            </div>
          </>
        );
      case 'country':
        return (
          <>
            <TextField label="Código de País (ISO)" value={data.texts.paisName} onChange={(v) => handleTextChange('paisName', v)} />
            <div className="grid grid-cols-2 gap-3.5 mt-3">
              <SliderField label="Posición X" value={data.layout.paisTransform.x} min={3000} max={6000} step={10} onChange={(v) => handlePaisTransformChange('x', v)} />
              <SliderField label="Posición Y" value={data.layout.paisTransform.y} min={3000} max={6000} step={10} onChange={(v) => handlePaisTransformChange('y', v)} />
              <SliderField label="Tamaño Letra" value={data.layout.paisTransform.fontSize} min={100} max={600} step={5} onChange={(v) => handlePaisTransformChange('fontSize', v)} />
              <SliderField label="Espaciado" value={data.layout.paisTransform.spacing} min={0.5} max={2.0} step={0.05} onChange={(v) => handlePaisTransformChange('spacing', v)} />
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-3 items-center pt-3 border-t border-neutral-800/60 mt-3">
               <ColorField label="Color Borde" value={data.colors.paisStroke} onChange={(v) => handleColorChange('paisStroke', v)} id="paisStroke" />
               <SliderField label="Grosor de Borde" value={data.layout.paisTransform.strokeWidth} min={1} max={50} step={1} onChange={(v) => handlePaisTransformChange('strokeWidth', v)} />
            </div>
          </>
        );
      case 'texts':
        return (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            <div className="border-b border-neutral-800 pb-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2">Nombre</span>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <TextField label="Nombre" value={data.texts.firstName} onChange={(v) => handleTextChange('firstName', v)} />
                <TextField label="Apellido" value={data.texts.lastName} onChange={(v) => handleTextChange('lastName', v)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SliderField label="Pos X" value={data.layout.nameTransform?.x ?? 2025.74} min={1000} max={3000} step={5} onChange={(v) => handleNameTransformChange('x', v)} />
                <SliderField label="Pos Y" value={data.layout.nameTransform?.y ?? 5960.33} min={5000} max={6800} step={5} onChange={(v) => handleNameTransformChange('y', v)} />
                <SliderField label="Tamaño" value={data.layout.nameTransform?.fontSize ?? 236.57} min={50} max={400} step={2} onChange={(v) => handleNameTransformChange('fontSize', v)} />
              </div>
            </div>

            <div className="border-b border-neutral-800 pb-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2">Estadísticas</span>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <TextField label="Nacimiento" value={data.texts.birthDate} onChange={(v) => handleTextChange('birthDate', v)} />
                <TextField label="Altura" value={data.texts.height} onChange={(v) => handleTextChange('height', v)} />
                <TextField label="Peso" value={data.texts.weight} onChange={(v) => handleTextChange('weight', v)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SliderField label="Pos X" value={data.layout.dataTransform?.x ?? 2025.74} min={1000} max={3000} step={5} onChange={(v) => handleDataTransformChange('x', v)} />
                <SliderField label="Pos Y" value={data.layout.dataTransform?.y ?? 6268.24} min={5000} max={6800} step={5} onChange={(v) => handleDataTransformChange('y', v)} />
                <SliderField label="Tamaño" value={data.layout.dataTransform?.fontSize ?? 200} min={50} max={400} step={2} onChange={(v) => handleDataTransformChange('fontSize', v)} />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2">Club</span>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <TextField label="Nombre Club" value={data.texts.clubName} onChange={(v) => handleTextChange('clubName', v)} />
                <TextField label="Abrev. Club" value={data.texts.clubAbbreviation} onChange={(v) => handleTextChange('clubAbbreviation', v)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SliderField label="Pos X" value={data.layout.clubTransform?.x ?? 1750} min={1000} max={3000} step={5} onChange={(v) => handleClubTransformChange('x', v)} />
                <SliderField label="Pos Y" value={data.layout.clubTransform?.y ?? 6600} min={5000} max={7000} step={5} onChange={(v) => handleClubTransformChange('y', v)} />
                <SliderField label="Tamaño" value={data.layout.clubTransform?.fontSize ?? 170} min={50} max={300} step={2} onChange={(v) => handleClubTransformChange('fontSize', v)} />
              </div>
            </div>
          </div>
        );
      case 'panini':
        return (
          <>
            <MediaField label="Logo de Panini" hasImage={!!data.images.panini} onUpload={(e) => handleImageUpload('panini', e)} />
            <div className="grid grid-cols-2 gap-3.5 mt-2">
              <SliderField label="Escala" value={data.images.paniniTransform.scale} min={0.1} max={5} step={0.05} onChange={(v) => handleTransformChange('paniniTransform', 'scale', v)} />
              <SliderField label="Rotación" value={data.images.paniniTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('paniniTransform', 'rotate', v)} />
              <SliderField label="Posición X" value={data.images.paniniTransform.x} min={-500} max={1500} step={5} onChange={(v) => handleTransformChange('paniniTransform', 'x', v)} />
              <SliderField label="Posición Y" value={data.images.paniniTransform.y} min={-500} max={1500} step={5} onChange={(v) => handleTransformChange('paniniTransform', 'y', v)} />
            </div>
          </>
        );
      case 'watermark':
        return (
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Mostrar Leyenda (FanasEdition)</label>
            <input 
              type="checkbox" 
              checked={data.layout.showWatermark ?? true} 
              onChange={(e) => setData(prev => ({ ...prev, layout: { ...prev.layout, showWatermark: e.target.checked } }))} 
              className="accent-cyan-500" 
            />
          </div>
        );
      case 'hologram':
        return (
          <>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800/60">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Rotación 3D (Tilt)</label>
              <input type="checkbox" checked={data.effects.tiltEnabled} onChange={(e) => handleEffectChange('tiltEnabled', e.target.checked)} className="accent-cyan-500" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Estilo de Reflejo</label>
                <select 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                  value={data.effects.foilType}
                  onChange={(e) => handleEffectChange('foilType', e.target.value)}
                >
                  <option value="none">✨ Sin Brillo Especial</option>
                  <option value="glossy">⚪ Reflejo Brillante Liso</option>
                  <option value="rainbow">🌈 Holograma Arcoíris</option>
                  <option value="gold">🥇 Dorado Metálico</option>
                  <option value="chrome">🪞 Espejo Cromado</option>
                  <option value="cosmos">🌌 Cosmos Galáctico</option>
                  <option value="lava">🔥 Fuego de Lava</option>
                  <option value="aqua">🌊 Agua / Hielo</option>
                </select>
              </div>
              {data.effects.foilType !== 'none' && (
                <SliderField label="Opacidad del Reflejo" value={data.effects.foilOpacity} min={10} max={100} step={5} onChange={(v) => handleEffectChange('foilOpacity', v)} />
              )}
            </div>
          </>
        );
      case 'particles':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Tipo de Partícula</label>
              <select 
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                value={data.effects.particles || 'none'}
                onChange={(e) => handleEffectChange('particles', e.target.value)}
              >
                <option value="none">Desactivadas</option>
                <option value="snow">❄️ Nieve (Snow)</option>
                <option value="sparks">✨ Chispas (Sparks)</option>
                <option value="confetti">🎉 Confeti (Confetti)</option>
                <option value="glimmers">🌟 Destellos (Glimmers)</option>
              </select>
            </div>
            {data.effects.particles && data.effects.particles !== 'none' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950/65 rounded border border-neutral-800/80">
                <SliderField label="Densidad" value={data.effects.particleDensity ?? 50} min={10} max={100} step={5} onChange={(v) => handleEffectChange('particleDensity', v)} />
                <SliderField label="Velocidad" value={data.effects.particleSpeed ?? 1} min={0.1} max={3} step={0.1} onChange={(v) => handleEffectChange('particleSpeed', v)} />
              </div>
            )}
          </div>
        );
      case 'frame':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Activar Marco / Borde</label>
              <input type="checkbox" checked={data.effects.frameEnabled ?? false} onChange={(e) => handleEffectChange('frameEnabled', e.target.checked)} className="accent-cyan-500" />
            </div>
            {data.effects.frameEnabled && (
              <div className="grid grid-cols-2 gap-3 mt-2 p-3 bg-neutral-950/60 border border-neutral-800 rounded">
                <ColorField label="Color de Marco" value={data.effects.frameColor ?? '#D4AF37'} onChange={(v) => handleEffectChange('frameColor', v)} id="frameColor" />
                <SliderField label="Grosor (px)" value={data.effects.frameWidth ?? 8} min={2} max={30} step={1} onChange={(v) => handleEffectChange('frameWidth', v)} />
              </div>
            )}
            <ReflectionControl label="Reflejo del Marco" layer="reflectionFrame" />
          </>
        );
      case 'brandHologram':
        return (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Activar Holograma</label>
              <input 
                type="checkbox" 
                checked={data.brandHologram?.enabled ?? false} 
                onChange={(e) => {
                  const val = e.target.checked;
                  setData(prev => {
                    const visibleLayers = prev.visibleLayers ? { ...prev.visibleLayers, brandHologram: val } : { brandHologram: val };
                    return {
                      ...prev,
                      visibleLayers,
                      brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), enabled: val }
                    };
                  });
                }} 
                className="accent-cyan-500" 
              />
            </div>

            {(data.brandHologram?.enabled ?? false) && (
              <>
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-900">
                  <div className="col-span-2">
                    <label className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block mb-1">Tipo de Color</label>
                    <select
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white"
                      value={data.brandHologram?.colorMode ?? 'solid'}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), colorMode: e.target.value as any }
                      }))}
                    >
                      <option value="solid">Color Sólido</option>
                      <option value="linear">Gradiente Lineal</option>
                      <option value="radial">Gradiente Radial</option>
                    </select>
                  </div>
                  
                  <ColorField 
                    label={data.brandHologram?.colorMode !== 'solid' ? "Color Inicio" : "Color del Holograma"} 
                    value={data.brandHologram?.color ?? '#00FFFF'} 
                    onChange={(v) => setData(prev => ({
                      ...prev,
                      brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), color: v }
                    }))} 
                    id="hologramColor" 
                  />
                  {data.brandHologram?.colorMode !== 'solid' && (
                    <ColorField 
                      label="Color Fin" 
                      value={data.brandHologram?.color2 ?? '#FF00FF'} 
                      onChange={(v) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), color2: v }
                      }))} 
                      id="hologramColor2" 
                    />
                  )}
                  <div className={data.brandHologram?.colorMode !== 'solid' ? 'col-span-2' : ''}>
                    <label className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block mb-1">Modo de Fusión</label>
                    <select
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white"
                      value={data.brandHologram?.blendMode ?? 'screen'}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), blendMode: e.target.value as any }
                      }))}
                    >
                      <option value="normal">Normal</option>
                      <option value="multiply">Multiplicar</option>
                      <option value="screen">Trama (Screen)</option>
                      <option value="overlay">Superponer (Overlay)</option>
                      <option value="color-dodge">Sobreexposición</option>
                      <option value="color">Color</option>
                      <option value="luminosity">Luminosidad</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pb-3 border-b border-neutral-900">
                  <SliderField 
                    label="Densidad (Tamaño del Mosaico)" 
                    value={data.brandHologram?.density ?? 150} 
                    min={50} 
                    max={2500} 
                    step={25} 
                    onChange={(v) => setData(prev => ({
                      ...prev,
                      brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), density: v }
                    }))} 
                  />
                  <SliderField 
                    label="Rotación (Grados)" 
                    value={data.brandHologram?.rotation ?? 0} 
                    min={0} 
                    max={360} 
                    step={5} 
                    onChange={(v) => setData(prev => ({
                      ...prev,
                      brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), rotation: v }
                    }))} 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <SliderField 
                      label="Posición X" 
                      value={data.brandHologram?.xOffset ?? 0} 
                      min={-500} 
                      max={500} 
                      step={5} 
                      onChange={(v) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), xOffset: v }
                      }))} 
                    />
                    <SliderField 
                      label="Posición Y" 
                      value={data.brandHologram?.yOffset ?? 0} 
                      min={-500} 
                      max={500} 
                      step={5} 
                      onChange={(v) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), yOffset: v }
                      }))} 
                    />
                  </div>
                  <SliderField 
                    label="Opacidad / Transparencia" 
                    value={data.brandHologram?.opacity ?? 50} 
                    min={0} 
                    max={100} 
                    step={5} 
                    onChange={(v) => setData(prev => ({
                      ...prev,
                      brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), opacity: v }
                    }))} 
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.brandHologram?.reflectionEnabled ?? false}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), reflectionEnabled: e.target.checked }
                      }))}
                      className="accent-cyan-500"
                    />
                    ✨ Reflejo del Holograma
                  </label>
                  
                  {data.brandHologram?.reflectionEnabled && (
                    <div className="mt-2 space-y-3 p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl">
                      <div>
                        <label className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block mb-1.5">Material de Reflejo</label>
                        <select
                          value={data.brandHologram?.reflectionStyle ?? 'none'}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), reflectionStyle: e.target.value as any }
                          }))}
                          className="w-full bg-neutral-900 border border-neutral-850 rounded px-2.5 py-1.5 text-xs text-white"
                        >
                          {layerReflectionStyles.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <SliderField
                          label="Intensidad"
                          value={data.brandHologram?.reflectionIntensity ?? 50}
                          min={0}
                          max={100}
                          step={5}
                          onChange={(v) => setData(prev => ({
                            ...prev,
                            brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), reflectionIntensity: v }
                          }))}
                        />
                        <SliderField
                          label="Rugosidad"
                          value={data.brandHologram?.reflectionRoughness ?? 10}
                          min={0}
                          max={100}
                          step={1}
                          onChange={(v) => setData(prev => ({
                            ...prev,
                            brandHologram: { ...(prev.brandHologram || INITIAL_CARD_DATA.brandHologram!), reflectionRoughness: v }
                          }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      default:
        return (
          <div className="text-center py-6 text-neutral-500 text-xs">
            Selecciona una capa arriba para configurar sus propiedades específicas.
          </div>
        );
    }
  };

  const cardAspect = `${5020 + 2 * (data.layout.padding || 0)} / ${6758 + 2 * (data.layout.padding || 0)}`;

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">
      {/* Full-Screen Preview Overlay */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          >
            <button 
              onClick={() => setIsPreviewMode(false)}
              className="absolute top-6 right-6 p-4 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-full transition-colors z-[60]"
              title="Cerrar Vista Previa"
            >
              <X size={24} />
            </button>
            <div 
              className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-8"
              style={{ perspective: '1500px' }}
            >
              <div 
                ref={cardWrapperPreviewRef}
                className="card-3d-wrapper relative w-full h-auto md:w-auto md:h-full max-w-full max-h-full mx-auto shrink-0"
                style={{ aspectRatio: cardAspect }}
              >
                {data.effects.tiltEnabled && <div className="card-shadow-3d"></div>}
                <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 block m-auto" style={{ transform: 'translateZ(-50px)' }}></div>
                <div 
                  ref={foilPreviewRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onPointerLeave={handlePointerLeave}
                  className="relative group w-full h-full card-touch-area"
                >
                  <div 
                    className="card-face card-front relative z-10 bg-white/5 backdrop-blur-sm overflow-hidden"
                    style={{ 
                      transform: data.effects.tiltEnabled ? 'rotateY(0deg) translateZ(2px)' : 'rotateY(0deg)',
                      backfaceVisibility: 'hidden',
                      border: data.effects.frameEnabled && data.visibleLayers?.frame !== false ? `${data.effects.frameWidth ?? 8}px solid ${data.effects.frameColor ?? '#D4AF37'}` : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="w-full h-full rounded-[2.5%] overflow-hidden relative">
                      <SVGCard data={data} svgRef={svgRef} />
                    </div>
                    {/* Glare reflection overlay */}
                    {data.visibleLayers?.hologram !== false && (
                      <div 
                        className="card-glare" 
                        data-glare-style={data.effects.foilType !== 'none' ? data.effects.foilType : 'glossy'} 
                        style={{ '--glare-opacity': (data.effects.foilOpacity ?? 50) / 100 } as React.CSSProperties}
                      />
                    )}
                    {data.visibleLayers?.particles !== false && data.effects.particles !== 'none' && (
                      <Particles type={data.effects.particles} density={data.effects.particleDensity} speed={data.effects.particleSpeed} />
                    )}
                  </div>
                  
                  {/* Thickness edges */}
                  {data.effects.tiltEnabled && !isMobile && [-0.6, -0.3, 0, 0.3, 0.6].map((z, i) => (
                    <div key={i} className="card-face bg-neutral-800" style={{ transform: `translateZ(${z}px)` }}></div>
                  ))}

                  {/* Back face */}
                  <div 
                    className="card-face card-back absolute inset-0 z-0 bg-neutral-900 shadow-2xl border border-white/10 overflow-hidden"
                    style={{ 
                      transform: data.effects.tiltEnabled ? 'rotateY(180deg) translateZ(2px)' : 'rotateY(180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                     <div className="w-full h-full rounded-[2.5%] overflow-hidden relative bg-black">
                       {data.images.backCard ? (
                          <div style={{
                            width: '100%', height: '100%',
                            transform: `translate(${data.images.backCardTransform.x}px, ${data.images.backCardTransform.y}px) scale(${data.images.backCardTransform.scale}) rotate(${data.images.backCardTransform.rotate}deg)`
                          }}>
                            <img src={data.images.backCard} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="Dorso" />
                          </div>
                       ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 bg-neutral-900 gap-4">
                            <ImageIcon size={48} opacity={0.5} />
                          </div>
                       )}
                     </div>
                     {data.visibleLayers?.hologram !== false && (
                       <div 
                         className="card-glare" 
                         data-glare-style={data.effects.foilType !== 'none' ? data.effects.foilType : 'glossy'} 
                         style={{ '--glare-opacity': (data.effects.foilOpacity ?? 50) / 100 } as React.CSSProperties}
                       />
                     )}
                     {data.visibleLayers?.particles !== false && data.effects.particles !== 'none' && (
                       <Particles type={data.effects.particles} density={data.effects.particleDensity} speed={data.effects.particleSpeed} />
                     )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 border-b border-neutral-900 flex items-center justify-between px-4 sm:px-6 bg-neutral-950/70 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-black tracking-widest flex items-center gap-2 text-white">
            <span className="text-cyan-500 animate-pulse">⚽</span> MUNDIAL CARDS
          </h1>
          <div className="hidden sm:flex h-4 w-px bg-neutral-800"></div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">3D Reflejos Activos</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setEnable3D(!enable3D)} 
            className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${enable3D ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'bg-neutral-900 text-neutral-500 border border-neutral-800'}`}
          >
            3D {enable3D ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => { if(window.confirm("¿Borrar todo y reiniciar?")) { localStorage.clear(); window.location.reload(); } }} className="p-2 text-neutral-500 hover:text-red-400 transition-colors" title="Borrar datos"><Trash2 size={16} /></button>
          <button 
            onClick={reset}
            className="p-2 hover:bg-neutral-900 rounded-lg transition-colors text-neutral-400"
            title="Resetear tarjeta"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={handleFlipButton}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-neutral-850"
          >
            <RefreshCcw size={12} />
            <span>Girar</span>
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-neutral-850"
          >
            <Eye size={12} />
            <span>Previa</span>
          </button>
          <button 
            onClick={exportSVG}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-neutral-850"
          >
            <Download size={12} />
            <span>SVG</span>
          </button>
          <button 
            onClick={exportPNG}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-950/20"
          >
            {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            <span>{isExporting ? '...' : 'PNG'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative w-full flex-col md:flex-row">
        
        {/* LEFT SIDEBAR (Tabs workspace) */}
        <aside 
          className="hidden md:flex flex-col bg-neutral-950 border-r border-neutral-900 z-40 transition-all duration-[400ms] shadow-2xl shrink-0 w-96 h-full overflow-hidden" 
        >
          {/* Tabs header */}
          <div className="flex p-3 gap-1 bg-neutral-950 border-b border-neutral-900">
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 border ${activeTab === 'layers' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent border-transparent'}`}
            >
              <Save size={12} /> Capas
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 border ${activeTab === 'gallery' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent border-transparent'}`}
            >
              <Folder size={12} /> Galería
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 border ${activeTab === 'settings' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent border-transparent'}`}
            >
              <Settings size={12} /> Ajustes
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            {activeTab === 'layers' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Orden de Capas</h3>
                  <div className="bg-neutral-900/40 rounded-xl p-2.5 border border-neutral-900/80 space-y-1">
                    {layersList.map((layer) => {
                      const isSel = selectedElement === layer.id;
                      const isVis = isLayerVisible(layer.id);
                      return (
                        <div 
                          key={layer.id}
                          onClick={() => setSelectedElement(layer.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer layer-row ${isSel ? 'is-active' : 'border-transparent bg-transparent'}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                              }}
                              className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                              title={isVis ? "Ocultar capa" : "Mostrar capa"}
                            >
                              {isVis ? <Eye size={13} className="text-cyan-400" /> : <EyeOff size={13} className="text-neutral-650" />}
                            </button>
                            <layer.icon size={12} className={isSel ? 'text-cyan-400' : 'text-neutral-450'} />
                            <span className={`text-[11px] tracking-wide truncate ${isSel ? 'text-cyan-300 font-bold' : 'text-neutral-300'}`}>
                              {layer.name}
                            </span>
                          </div>
                          <ChevronRight size={11} className={`text-neutral-600 transition-transform ${isSel ? 'rotate-90 text-cyan-500' : ''}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Layer Properties */}
                <div className="mt-5 border-t border-neutral-900 pt-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
                      {selectedElement ? 'Propiedades de Capa' : 'Ajustes'}
                    </h4>
                    {selectedElement && (
                      <button 
                        onClick={() => setSelectedElement(null)} 
                        className="text-[9px] font-black uppercase text-neutral-550 hover:text-neutral-350"
                      >
                        Deseleccionar
                      </button>
                    )}
                  </div>
                  <div className="bg-neutral-900/25 p-4 rounded-xl border border-neutral-900/60">
                    {renderLayerProperties()}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Nombre de la Tarjeta</label>
                  <input 
                    type="text" 
                    value={data.name || ''} 
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Ej: Ronaldo FUT Heroes"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Mis Diseños Guardados</label>
                  <div className="bg-neutral-900/40 rounded-xl p-2.5 border border-neutral-900 max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                    {gallery.map(proj => (
                      <div 
                        key={proj.id} 
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${proj.id === data.id ? 'bg-cyan-500/5 border-cyan-500/20 text-white font-bold' : 'border-transparent text-neutral-400 hover:bg-neutral-900/60'}`}
                        onClick={() => loadProject(proj.id)}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="text-xs truncate">{proj.name || 'Tarjeta sin nombre'}</span>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-wide">{proj.texts.lastName || 'Desconocido'}</span>
                        </div>
                        <button 
                          onClick={(e) => deleteProject(proj.id, e)}
                          className="p-1.5 text-neutral-600 hover:text-red-400 hover:bg-neutral-850 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={createNewProject}
                  className="w-full py-2.5 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-850 text-cyan-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-neutral-850"
                >
                  <Plus size={12} /> Crear Nueva Tarjeta
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">General & Layout</h3>
                  <div className="bg-neutral-900/35 p-4 rounded-xl border border-neutral-900/80 space-y-4">
                    <SliderField label="Margen Exterior (Padding)" value={data.layout.padding} min={0} max={1000} step={10} onChange={handlePaddingChange} />
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Marca de Agua (FanasEdition)</label>
                      <input 
                        type="checkbox" 
                        checked={data.layout.showWatermark ?? true} 
                        onChange={(e) => setData(prev => ({ ...prev, layout: { ...prev.layout, showWatermark: e.target.checked } }))} 
                        className="accent-cyan-500" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Imagen de Dorso</h3>
                  <div className="bg-neutral-900/35 p-4 rounded-xl border border-neutral-900/80 space-y-4">
                    <MediaField label="Imagen Trasera (Back Card)" hasImage={!!data.images.backCard} onUpload={(e) => handleImageUpload('backCard', e)} />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <SliderField label="Zoom" value={data.images.backCardTransform.scale} min={0.1} max={5} step={0.05} onChange={(v) => handleTransformChange('backCardTransform', 'scale', v)} />
                      <SliderField label="Rotación" value={data.images.backCardTransform.rotate} min={-180} max={180} step={1} onChange={(v) => handleTransformChange('backCardTransform', 'rotate', v)} />
                      <SliderField label="Posición X" value={data.images.backCardTransform.x} min={-2000} max={2000} step={10} onChange={(v) => handleTransformChange('backCardTransform', 'x', v)} />
                      <SliderField label="Posición Y" value={data.images.backCardTransform.y} min={-2000} max={2000} step={10} onChange={(v) => handleTransformChange('backCardTransform', 'y', v)} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Herramientas de Exportación</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      onClick={exportSVG}
                      className="py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 rounded-lg text-[10px] font-black uppercase tracking-widest border border-neutral-850 flex items-center justify-center gap-1.5"
                    >
                      <Download size={12} /> SVG Vectorial
                    </button>
                    <button 
                      onClick={exportPNG}
                      disabled={isExporting}
                      className="py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                    >
                      {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      {isExporting ? 'Procesando' : 'PNG de Alta Res'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* MAIN DISPLAY CANVAS */}
        <main className="flex-1 relative flex items-center justify-center transition-all duration-[400ms] bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.06)_0%,rgba(0,0,0,1)_100%)] p-4 md:p-8" style={{ perspective: '1500px' }}>
            <div 
              ref={cardWrapperMainRef}
              className="card-3d-wrapper relative w-full h-auto md:w-auto md:h-full max-h-[82vh] max-w-full active:scale-[0.98] mx-auto flex items-center justify-center shrink-0"
              style={{ aspectRatio: cardAspect }}
            >
              {/* Hardware Accelerated 3D cast shadow */}
              {data.effects.tiltEnabled && (
                <div className="card-shadow-3d"></div>
              )}
              
              {/* Dynamic decorative backdrop glow */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 block m-auto" style={{ transform: 'translateZ(-50px)' }}></div>
              
              <div 
                ref={cardContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                className="relative group w-full h-full card-touch-area"
              >
                <div 
                  className="card-face card-front bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center"
                  style={{ 
                    boxShadow: data.effects.emboss ? 'inset 0 0 10px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)' : 'none',
                    transform: data.effects.tiltEnabled ? 'rotateY(0deg) translateZ(2px)' : 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',
                    border: data.effects.frameEnabled && data.visibleLayers?.frame !== false ? `${data.effects.frameWidth ?? 8}px solid ${data.effects.frameColor ?? '#D4AF37'}` : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <SVGCard 
                    data={data} 
                    svgRef={svgRef} 
                    selectedElement={selectedElement}
                    onSelect={handleElementSelect}
                  />
                  
                  {/* Dynamic CSS reflection glare */}
                  {data.visibleLayers?.hologram !== false && (
                    <div 
                      className="card-glare" 
                      data-glare-style={data.effects.foilType !== 'none' ? data.effects.foilType : 'glossy'} 
                      style={{ '--glare-opacity': (data.effects.foilOpacity ?? 50) / 100 } as React.CSSProperties}
                    />
                  )}

                  {/* GPU-focused particle overlay */}
                  {data.visibleLayers?.particles !== false && data.effects.particles !== 'none' && (
                    <Particles 
                      type={data.effects.particles || 'none'} 
                      density={data.effects.particleDensity}
                      speed={data.effects.particleSpeed}
                    />
                  )}
                </div>

                {/* 3D Thickness side edges */}
                {data.effects.tiltEnabled && !isMobile && [-0.6, -0.3, 0, 0.3, 0.6].map((z, i) => (
                  <div key={i} className="card-face bg-neutral-800" style={{ transform: `translateZ(${z}px)` }}></div>
                ))}

                {/* Back card face */}
                <div 
                  className="card-face card-back p-1 bg-neutral-900 shadow-2xl border border-white/10 overflow-hidden flex items-center justify-center"
                  style={{ 
                    boxShadow: data.effects.emboss ? 'inset 0 0 10px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)' : 'none',
                    transform: data.effects.tiltEnabled ? 'rotateY(180deg) translateZ(2px)' : 'rotateY(180deg)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                   <div className="w-full h-full rounded-[2.5%] overflow-hidden relative bg-black">
                     {data.images.backCard ? (
                        <div style={{
                          width: '100%', height: '100%',
                          transform: `translate(${data.images.backCardTransform.x}px, ${data.images.backCardTransform.y}px) scale(${data.images.backCardTransform.scale}) rotate(${data.images.backCardTransform.rotate}deg)`
                        }}>
                          <img src={data.images.backCard} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="Dorso" />
                        </div>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 bg-neutral-900 gap-4">
                          <ImageIcon size={48} opacity={0.5} />
                          <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">Sin Dorso</span>
                        </div>
                     )}
                   </div>
                   {data.visibleLayers?.hologram !== false && (
                     <div 
                       className="card-glare" 
                       data-glare-style={data.effects.foilType !== 'none' ? data.effects.foilType : 'glossy'} 
                       style={{ '--glare-opacity': (data.effects.foilOpacity ?? 50) / 100 } as React.CSSProperties}
                     />
                   )}
                   {data.visibleLayers?.particles !== false && data.effects.particles !== 'none' && (
                     <Particles type={data.effects.particles} density={data.effects.particleDensity} speed={data.effects.particleSpeed} />
                   )}
                </div>
              </div>
            </div>
          
          {/* Background deselect trigger */}
          <button
             className="absolute inset-0 z-0 w-full h-full cursor-default focus:outline-none bg-transparent"
             onClick={() => setSelectedElement(null)}
             tabIndex={-1}
          />

          {/* Floating deselect overlay button */}
          <AnimatePresence>
            {selectedElement && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedElement(null)}
                className="absolute top-6 right-6 p-4 bg-neutral-900/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-white border border-neutral-800 shadow-2xl z-30 hidden md:block"
                title="Deseleccionar capa"
              >
                <RotateCcw size={20} className="rotate-45" />
              </motion.button>
            )}
          </AnimatePresence>
        </main>

        {/* MOBILE WORKSPACE PANEL (bottom drawer) */}
        <aside 
          className="md:hidden w-full bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 z-50 flex flex-col shrink-0 h-[55vh] bottom-sheet"
        >
          {/* Mobile Tabs Header */}
          <div className="flex p-2 gap-2 border-b border-white/5 bg-transparent justify-around">
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 modern-tab-button ${activeTab === 'layers' ? 'active bg-cyan-500/15 border border-cyan-500/30' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Save size={12} /> Capas
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 modern-tab-button ${activeTab === 'gallery' ? 'active bg-cyan-500/15 border border-cyan-500/30' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Folder size={12} /> Galería
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 modern-tab-button ${activeTab === 'settings' ? 'active bg-cyan-500/15 border border-cyan-500/30' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Settings size={12} /> Ajustes
            </button>
          </div>
          
          <div className="px-4 py-3 border-b border-neutral-900/60 flex justify-between items-center bg-neutral-905">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
               {selectedElement ? `Ajustes: ${layersList.find(l => l.id === selectedElement)?.name}` : 'Estructura de Capas'}
             </h2>
             {selectedElement && (
                <button 
                  onClick={() => setSelectedElement(null)}
                  className="bg-neutral-900 hover:bg-neutral-850 text-neutral-300 p-1 px-2 rounded-lg transition-colors flex items-center gap-1 border border-neutral-850"
                >
                   <RotateCcw size={10} className="rotate-45" />
                   <span className="text-[9px] uppercase font-black">Cerrar</span>
                </button>
             )}
          </div>
          
          <div className="p-4 overflow-y-auto scrollbar-hide flex-1 space-y-4">
            {activeTab === 'layers' && (
              <div className="space-y-4">
                {!selectedElement ? (
                  <div className="bg-neutral-900/40 rounded-xl p-2 border border-neutral-900 space-y-1">
                    {layersList.map((layer) => (
                      <div 
                        key={layer.id}
                        onClick={() => setSelectedElement(layer.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${selectedElement === layer.id ? 'is-active' : 'border-transparent bg-transparent'}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            className="p-1 text-neutral-500 hover:text-white"
                          >
                            {isLayerVisible(layer.id) ? <Eye size={12} className="text-cyan-400" /> : <EyeOff size={12} className="text-neutral-600" />}
                          </button>
                          <layer.icon size={11} className="text-neutral-400" />
                          <span className="text-[10px] tracking-wide truncate text-neutral-300">{layer.name}</span>
                        </div>
                        <ChevronRight size={10} className="text-neutral-650" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-900/25 p-3 rounded-xl border border-neutral-900/60">
                    {renderLayerProperties()}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-1.5">Nombre de la Tarjeta</label>
                  <input 
                    type="text" 
                    value={data.name || ''} 
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="Ej: Messi TOTS"
                  />
                </div>
                <div className="bg-neutral-900/40 rounded-xl p-2 border border-neutral-900 max-h-40 overflow-y-auto space-y-1">
                  {gallery.map(proj => (
                    <div 
                      key={proj.id} 
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${proj.id === data.id ? 'bg-cyan-500/5 text-white font-bold' : 'text-neutral-400'}`}
                      onClick={() => loadProject(proj.id)}
                    >
                      <span className="text-xs truncate">{proj.name || 'Sin nombre'}</span>
                      <button onClick={(e) => deleteProject(proj.id, e)} className="p-1 text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={createNewProject} className="w-full py-2 bg-neutral-900 text-cyan-400 rounded-lg text-[9px] font-black uppercase border border-neutral-850 flex items-center justify-center gap-1"><Plus size={12} /> Crear Nueva</button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <SliderField label="Margen Exterior (Padding)" value={data.layout.padding} min={0} max={1000} step={10} onChange={handlePaddingChange} />
                <div className="flex items-center justify-between py-2 border-t border-neutral-900">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Marca de Agua</label>
                  <input type="checkbox" checked={data.layout.showWatermark ?? true} onChange={(e) => setData(prev => ({ ...prev, layout: { ...prev.layout, showWatermark: e.target.checked } }))} className="accent-cyan-500" />
                </div>
                <div className="pt-3 border-t border-neutral-900 space-y-3">
                  <MediaField label="Imagen Trasera (Dorso)" hasImage={!!data.images.backCard} onUpload={(e) => handleImageUpload('backCard', e)} />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900">
                  <button onClick={exportSVG} className="py-2 bg-neutral-900 text-neutral-200 rounded-lg text-[9px] font-black uppercase border border-neutral-850 flex items-center justify-center gap-1"><Download size={12} /> SVG</button>
                  <button onClick={exportPNG} className="py-2 bg-cyan-600 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1">{isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} PNG</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void; id: string }> = ({ label, value, onChange, id }) => (
  <div className="space-y-1">
    <span className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block">{label}</span>
    <label htmlFor={id} className="flex gap-2 items-center bg-neutral-950 p-2 rounded-lg border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer">
      <div 
        className="w-3.5 h-3.5 rounded border border-black/20" 
        style={{ backgroundColor: value }}
      />
      <span className="text-[9px] font-mono text-neutral-300 font-bold">{value.toUpperCase()}</span>
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
  <div className="space-y-1">
    <span className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block">{label}</span>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500/40 transition-colors"
    />
  </div>
);

const MediaField: React.FC<{ label: string; hasImage: boolean; onUpload: (e: ChangeEvent<HTMLInputElement>) => void }> = ({ label, hasImage, onUpload }) => (
  <div className="space-y-1">
    <span className="text-[9px] text-neutral-450 font-bold uppercase tracking-wider block">{label}</span>
    <label className="flex items-center justify-between bg-neutral-950 p-2 rounded-lg border border-neutral-900 hover:border-cyan-500/25 transition-all cursor-pointer">
      <div className="flex items-center gap-2 truncate pr-2">
        <div className={`w-7 h-7 rounded-lg ${hasImage ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'bg-neutral-900 text-neutral-600'} flex items-center justify-center text-xs transition-colors shrink-0`}>
          {hasImage ? <ImageIcon size={12} /> : '👤'}
        </div>
        <span className="text-[10px] text-neutral-350 truncate w-32">{hasImage ? 'Cargado con éxito' : 'Sin imagen...'}</span>
      </div>
      <span className="text-[9px] text-cyan-500 font-black uppercase tracking-wider border border-cyan-500/20 bg-cyan-500/5 px-2 py-1 rounded-md hover:bg-cyan-500/10 transition-colors shrink-0">
        {hasImage ? 'Cambiar' : 'Subir'}
      </span>
      <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
    </label>
  </div>
);

const SliderField: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }> = ({ label, value, min, max, step, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-neutral-450">
      <span>{label}</span>
      <span className="font-mono text-cyan-400 font-bold">{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);
