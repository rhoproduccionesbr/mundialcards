import React, { useState, useEffect } from 'react';
import { CardData } from '../types';

interface SVGCardProps {
  data: CardData;
  svgRef?: React.RefObject<SVGSVGElement>;
  selectedElement?: string | null;
  onSelect?: (id: string) => void;
}

const SVGCard: React.FC<SVGCardProps> = ({ data, svgRef, selectedElement, onSelect }) => {
  const [fontBase64, setFontBase64] = useState<string | null>(null);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const response = await fetch('/fifa-26.otf');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setFontBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading font:', err);
      }
    };
    loadFont();
  }, []);
  const getHighlightProps = (id: string) => ({
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(id);
    },
    className: `cursor-pointer transition-all duration-300 ${
      selectedElement === id ? 'drop-shadow-[0_0_80px_rgba(34,211,238,0.8)] brightness-125 saturate-150' : 'hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]'
    }`,
  });

  // Calculate dynamic font sizes based on text character length
  const MAX_NAME_CHARS = 16;
  const currentNameLength = data.texts.firstName.length + data.texts.lastName.length + 1;
  const nameScale = currentNameLength > MAX_NAME_CHARS ? MAX_NAME_CHARS / currentNameLength : 1;
  const nameFontSize = (data.layout.nameTransform?.fontSize || 236.57) * nameScale;

  const MAX_CLUB_CHARS = 20;
  const currentClubLength = data.texts.clubName.length + data.texts.clubAbbreviation.length + 3;
  const clubScale = currentClubLength > MAX_CLUB_CHARS ? Math.max(0.4, MAX_CLUB_CHARS / currentClubLength) : 1;
  const clubFontSize = (data.layout.clubTransform?.fontSize || 170) * clubScale;

  return (
    <svg
      id="card-svg"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox={`${-data.layout.padding} ${-data.layout.padding} ${5020 + 2 * data.layout.padding} ${6758 + 2 * data.layout.padding}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="w-full h-auto block rounded-xl overflow-hidden drop-shadow-2xl"
      onClick={() => onSelect?.('canvas')}
    >
      <defs>
        <filter id="emboss-effect" x="-10%" y="-10%" width="120%" height="120%">
          {/* Sombra interior (efecto de hueco) */}
          <feOffset dx="15" dy="25" in="SourceAlpha" result="offsetAlpha" />
          <feGaussianBlur stdDeviation="20" in="offsetAlpha" result="blurAlpha" />
          <feComposite operator="out" in="SourceAlpha" in2="blurAlpha" result="inverseAlpha" />
          <feFlood floodColor="#000" floodOpacity="0.5" result="shadowColor" />
          <feComposite operator="in" in="shadowColor" in2="inverseAlpha" result="innerShadow" />
          
          {/* Brillo interior opuesto (efecto metálico en el borde del hueco) */}
          <feOffset dx="-10" dy="-15" in="SourceAlpha" result="offsetAlphaHighlight" />
          <feGaussianBlur stdDeviation="15" in="offsetAlphaHighlight" result="blurAlphaHighlight" />
          <feComposite operator="out" in="SourceAlpha" in2="blurAlphaHighlight" result="inverseAlphaHighlight" />
          <feFlood floodColor="#fff" floodOpacity="0.3" result="highlightColor" />
          <feComposite operator="in" in="highlightColor" in2="inverseAlphaHighlight" result="innerHighlight" />
          
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerShadow" />
            <feMergeNode in="innerHighlight" />
          </feMerge>
        </filter>
        <filter id="inner-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.4" result="glow" />
          <feComposite in="glow" in2="blur" operator="in" result="glowIn" />
          <feComposite in="SourceGraphic" in2="glowIn" operator="over" />
        </filter>
        <clipPath id="clip-flag">
          <path d="M4396.03 3838.47c201.5,0 366.35,164.85 366.35,366.34l0 366.35 -366.35 0c-201.49,0 -366.34,-164.85 -366.34,-366.34l0 -0.01c0,-201.49 164.85,-366.34 366.34,-366.34z" />
        </clipPath>
        <clipPath id="clip-player">
          <path d="M169.93 17.55l3895.97 0 0 5493.65c0,57.35 -46.91,104.26 -104.26,104.26l-2767.68 0c-508.22,0 -924.03,-415.8 -924.03,-924.03l0 -4673.88z" />
        </clipPath>
        {/* ── Material Filters Generator ── */}
        {(['reflectionBg', 'reflectionVectors', 'reflectionFifa', 'reflectionFrame'] as const).map((layerId) => {
          const config = data.effects[layerId];
          if (!config || !config.enabled || config.style === 'none') return null;

          const intensity = config.intensity / 100;
          const roughness = config.roughness / 100;
          const filterId = `filter-mat-${layerId}`;

          let lightingColor = '#ffffff';
          let specularConstant = intensity * 1.5;
          let specularExponent = 30 + (1 - roughness) * 70; // 30 (rough) to 100 (smooth)
          let surfaceScale = 2;
          
          if (config.style === 'metallic-gold' || config.style === 'rough-gold') {
            lightingColor = '#FFD700';
            specularConstant = intensity * 2.5;
          } else if (config.style === 'metallic-silver' || config.style === 'rough-silver') {
            lightingColor = '#E0E0E0';
            specularConstant = intensity * 2;
          } else if (config.style === 'chrome') {
            specularConstant = intensity * 4;
            specularExponent = 120 - roughness * 60; // Very sharp reflection
            surfaceScale = 1;
          } else if (config.style === 'obsidian') {
            lightingColor = '#333333';
            specularConstant = intensity * 1.5;
            specularExponent = 15;
          } else if (config.style === 'pearl') {
            lightingColor = '#FFB6C1'; // Light pinkish iridescence base
            specularConstant = intensity * 2;
            specularExponent = 40;
          }

          const isRough = config.style.includes('rough');

          return (
            <filter key={filterId} id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              {isRough ? (
                <>
                  <feTurbulence type="fractalNoise" baseFrequency={0.01 + roughness * 0.05} numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   1 0 0 0 0" in="noise" result="noiseAlpha" />
                  <feComposite operator="in" in="noiseAlpha" in2="SourceAlpha" result="bumpMap" />
                </>
              ) : (
                <feComponentTransfer in="SourceAlpha" result="bumpMap">
                  <feFuncA type="linear" slope="1" />
                </feComponentTransfer>
              )}

              <feSpecularLighting in="bumpMap" surfaceScale={isRough ? surfaceScale + roughness * 5 : surfaceScale} specularConstant={specularConstant} specularExponent={specularExponent} lightingColor={lightingColor} result="specular">
                <fePointLight className="svg-light" x="2500" y="3000" z="400" />
              </feSpecularLighting>

              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
              <feComposite in="SourceGraphic" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          );
        })}

        {/* 3D Depth Map Relief Filter for Player */}
        <filter id="player-relief" x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" result="bumpMap" />
          <feSpecularLighting in="bumpMap" surfaceScale="7" specularConstant="1.2" specularExponent="30" lightingColor="#ffffff" result="specular">
            <fePointLight id="player-light" x="2500" y="3000" z="200" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
          <feComposite in="SourceGraphic" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        {/* Brand Hologram Pattern */}
        {data.brandHologram?.enabled && (
          <pattern
            id="brand-hologram-pattern"
            width={data.brandHologram.density}
            height={data.brandHologram.density}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${data.brandHologram.rotation}) translate(${data.brandHologram.xOffset}, ${data.brandHologram.yOffset})`}
          >
            <image
              href="/holograf.svg"
              x="0"
              y="0"
              width={data.brandHologram.density}
              height={data.brandHologram.density}
            />
          </pattern>
        )}

        {/* Hologram Gradients and Mask */}
        {data.brandHologram?.enabled && (
          <>
            <filter id="mask-to-white">
              <feFlood floodColor="white" result="flood" />
              <feComposite in="flood" in2="SourceGraphic" operator="in" />
            </filter>
            <mask id="brand-hologram-mask">
              <rect 
                x={-data.layout.padding} 
                y={-data.layout.padding} 
                width={5020 + 2 * data.layout.padding} 
                height={6758 + 2 * data.layout.padding} 
                fill="url(#brand-hologram-pattern)" 
                filter="url(#mask-to-white)"
              />
            </mask>
            <linearGradient id="hologram-gradient-linear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={data.brandHologram.color} />
              <stop offset="100%" stopColor={data.brandHologram.color2} />
            </linearGradient>
            <radialGradient id="hologram-gradient-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={data.brandHologram.color} />
              <stop offset="100%" stopColor={data.brandHologram.color2} />
            </radialGradient>
          </>
        )}

        {/* Brand Hologram Reflection Filter */}
        {data.brandHologram?.enabled && data.brandHologram.reflectionEnabled && data.brandHologram.reflectionStyle !== 'none' && (() => {
          const config = data.brandHologram;
          const intensity = config.reflectionIntensity / 100;
          const roughness = config.reflectionRoughness / 100;
          const filterId = 'filter-mat-reflectionHologram';

          let lightingColor = '#ffffff';
          let specularConstant = intensity * 1.5;
          let specularExponent = 30 + (1 - roughness) * 70;
          let surfaceScale = 2;
          
          if (config.reflectionStyle === 'metallic-gold' || config.reflectionStyle === 'rough-gold') {
            lightingColor = '#FFD700';
            specularConstant = intensity * 2.5;
          } else if (config.reflectionStyle === 'metallic-silver' || config.reflectionStyle === 'rough-silver') {
            lightingColor = '#E0E0E0';
            specularConstant = intensity * 2;
          } else if (config.reflectionStyle === 'chrome') {
            specularConstant = intensity * 4;
            specularExponent = 120 - roughness * 60;
            surfaceScale = 1;
          } else if (config.reflectionStyle === 'obsidian') {
            lightingColor = '#333333';
            specularConstant = intensity * 1.5;
            specularExponent = 15;
          } else if (config.reflectionStyle === 'pearl') {
            lightingColor = '#FFB6C1';
            specularConstant = intensity * 2;
            specularExponent = 40;
          }

          const isRough = config.reflectionStyle.includes('rough');

          return (
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              {isRough ? (
                <>
                  <feTurbulence type="fractalNoise" baseFrequency={0.01 + roughness * 0.05} numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   1 0 0 0 0" in="noise" result="noiseAlpha" />
                  <feComposite operator="in" in="noiseAlpha" in2="SourceAlpha" result="bumpMap" />
                </>
              ) : (
                <feComponentTransfer in="SourceAlpha" result="bumpMap">
                  <feFuncA type="linear" slope="1" />
                </feComponentTransfer>
              )}

              <feSpecularLighting in="bumpMap" surfaceScale={isRough ? surfaceScale + roughness * 5 : surfaceScale} specularConstant={specularConstant} specularExponent={specularExponent} lightingColor={lightingColor} result="specular">
                <fePointLight className="svg-light" x="2500" y="3000" z="400" />
              </feSpecularLighting>

              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
              <feComposite in="SourceGraphic" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          );
        })()}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@400;800&display=swap');
          @font-face {
            font-family: 'FIFA26';
            src: url('${fontBase64 || `${typeof window !== "undefined" ? window.location.origin : ""}/fifa-26.otf`}');
            font-weight: normal;
            font-style: normal;
          }
          .fnt-name { font-weight: bold; font-family: 'Bebas Neue', sans-serif; }
          .fnt-data { font-family: 'Barlow Condensed', sans-serif; }
          .fnt-fifa { font-family: 'FIFA26', sans-serif; }
        `}</style>
      </defs>

      {/* ═══════════════════════════════════════════════════
          CAPA 1: FONDO (Background)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.background !== false && (
        <g id="LAYER_1_FONDO" filter={data.effects.reflectionBg?.enabled && data.effects.reflectionBg.style !== 'none' ? 'url(#filter-mat-reflectionBg)' : undefined}>
          <rect 
            id="FONDO" 
            x={-data.layout.padding} 
            y={-data.layout.padding} 
            width={5020 + 2 * data.layout.padding} 
            height={6758 + 2 * data.layout.padding} 
            fill={data.colors.fondo}
            {...getHighlightProps('canvas')}
          />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 1.5: HOLOGRAMA DE MARCA (Brand Hologram)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.brandHologram !== false && data.brandHologram?.enabled && (
        <g 
          id="LAYER_BRAND_HOLOGRAM" 
          filter={
            data.brandHologram.reflectionEnabled && data.brandHologram.reflectionStyle !== 'none' ? 'url(#filter-mat-reflectionHologram)' : undefined
          }
          style={{
            mixBlendMode: data.brandHologram.blendMode as any,
            opacity: data.brandHologram.opacity / 100,
          }}
        >
          <rect 
            id="BRAND_HOLOGRAM" 
            x={-data.layout.padding} 
            y={-data.layout.padding} 
            width={5020 + 2 * data.layout.padding} 
            height={6758 + 2 * data.layout.padding} 
            fill={
              data.brandHologram.colorMode === 'linear' ? 'url(#hologram-gradient-linear)' : 
              data.brandHologram.colorMode === 'radial' ? 'url(#hologram-gradient-radial)' : 
              data.brandHologram.color
            }
            mask="url(#brand-hologram-mask)"
            {...getHighlightProps('brandHologram')}
          />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 2: VECTORES (DOS, SEIS, _26) — Reflejo propio
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.vectors !== false && (
        <g id="LAYER_2_VECTORES" {...getHighlightProps('shapes')} filter={data.effects.emboss ? 'url(#emboss-effect)' : undefined}>
          <g filter={data.effects.reflectionVectors?.enabled && data.effects.reflectionVectors.style !== 'none' ? 'url(#filter-mat-reflectionVectors)' : undefined}>
            <path 
              id="DOS" 
              d="M215.28 2776.42l0 -869.53c0,-481.73 485.19,-869.54 1083.04,-869.54l-1083.04 0c0,-481.72 485.19,-869.53 1083.04,-869.53l1083.02 0c600.01,0 1083.04,389.55 1083.04,869.53 0,479.99 -485.19,869.54 -1083.04,869.54l1083.04 0 0 869.53 -3249.1 0z" 
              fill={data.colors.dos}
            />
            <path 
              id="SEIS" 
              d="M2658.62 4214.85c-585.19,0 -1060.1,-389.55 -1060.1,-869.54l0 -869.53c0,-481.73 474.91,-869.54 1060.1,-869.54l1060.1 0c587.3,0 1060.11,389.55 1060.11,869.54l-1060.11 0c587.3,0 1060.11,389.54 1060.11,869.53 0,479.99 -474.93,869.54 -1060.11,869.54l-1060.1 0z" 
              fill={data.colors.seis}
            />
            <path 
              id="_2INTER" 
              d="M1598.52 2776.42l0 -300.64c0,-481.73 474.91,-869.54 1060.1,-869.54l541.61 0c-198.63,184.11 -491.9,300.65 -818.89,300.65l1083.04 0 0 869.53 -1865.86 0z" 
              fill={data.colors.inter}
            />
          </g>
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 3: JUGADOR (Player photo + relief)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.player !== false && (
        <g id="LAYER_3_JUGADOR" clipPath="url(#clip-player)" {...getHighlightProps('player')}>
          {data.images.player ? (
            <g id="PLAYER_GROUP" transform={`translate(${2326.47 + data.images.playerTransform.x}, ${2886.56 + data.images.playerTransform.y}) scale(${data.images.playerTransform.scale}) rotate(${data.images.playerTransform.rotate}) translate(-2326.47, -2886.56)`}>
              <image 
                id="JUGADOR" 
                x="-467.16" y="157.66" width="5587.26" height="5457.8" 
                href={data.images.player} 
                filter={data.effects.playerRelief ? 'url(#player-relief)' : undefined}
              />
            </g>
          ) : (
            <rect width="5020" height="6758" fill="#00000022" />
          )}
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 4: CONTENEDORES (Franja nombre + Franja club)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.banners !== false && (
        <g id="LAYER_4_CONTENEDORES" filter={data.effects.emboss ? 'url(#emboss-effect)' : undefined}>
          <path 
            id="NOMBRE_Y_FECHA" 
            d="M501.84 5694.79l3047.79 0c180.58,0 328.31,147.74 328.31,328.31l0 328.32 -3376.1 0c-180.57,0 -328.3,-147.73 -328.3,-328.31l0 -0.01c0,-180.57 147.73,-328.31 328.3,-328.31z" 
            fill={data.colors.nombreBg}
          />
          <path 
            id="CLUB_BAR" 
            d="M325.52 6407.7l2891.75 0c83.59,0 151.98,68.39 151.98,151.99l0 151.99 -3043.73 0c-83.59,0 -151.98,-68.4 -151.98,-151.98l0 -0.01c0,-83.6 68.39,-151.99 151.98,-151.99z" 
            fill={data.colors.clubBg}
          />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 5: LOGO FIFA
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.fifa !== false && (
        <g id="LAYER_5_LOGO_FIFA" {...getHighlightProps('branding')} filter={data.effects.reflectionFifa?.enabled && data.effects.reflectionFifa.style !== 'none' ? 'url(#filter-mat-reflectionFifa)' : undefined}>
          <path 
            id="LOGO_FI" 
            d="M4194.25 1572.63c-159.83,0 -289.55,-99.08 -289.55,-221.18l0 -221.18c0,-122.53 129.72,-221.17 289.55,-221.17l119.31 0 -56.22 0.2 2.91 39.76c-0.37,6.62 -0.93,13.61 -0.23,20.01 0.76,6.68 3.38,11.35 3.81,17.67 0.86,12.55 -5.1,22.92 -7.14,35.02 -1.09,6.38 -2.51,11.69 -3.83,17.75 -1.16,5.39 -1.64,12.94 -3.39,18.13 -2.23,6.62 -5.63,7.21 -8.31,13.18 -6.21,13.84 0.61,11.14 -13.24,29.74 -4.07,5.47 -8.3,20.92 -12.76,30.28 -6.91,14.49 -13.71,7.53 -18.42,46.34 -1.91,1.36 -10.16,2.27 -4.69,13.25 7.95,2.38 187.96,0.98 212.51,0.98 13.85,0 62.07,2.16 70.51,-1.63 0.99,-3.42 1.98,-6.53 -0.56,-9.7 -4.58,-5.75 -2.14,1.58 -2.95,-7.31l-10.65 -23.93c-1.77,-3.51 -2.98,-4.06 -4.54,-7.6 -13.64,-30.92 -15.34,-25.8 -21.84,-38 -1.61,-3.03 -3.56,-5.17 -4.55,-7.66 -1.81,-4.52 -3.06,-13.37 -4.53,-18.76 -3.42,-12.42 -4.52,-6.38 -10.85,-13.48 -16.37,-18.4 -17.45,-46.5 -19,-75.93 -1.06,-20.07 -6.44,-20.9 -0.81,-42.55 1.79,-6.83 2.34,-12.12 4.67,-18.72 2.13,-6 4.89,-11.75 6.75,-17.04l77.64 0c160.41,0 289.55,99.08 289.55,221.17l-289.55 0c160.41,0 289.55,99.09 289.55,221.18 0,122.1 -129.72,221.18 -289.55,221.18l-289.6 0zm233.48 -327.54l-36.92 107.64 33.14 -0.03 5.2 -15.32 35.35 -0.11 5.42 15.48 32.94 0.07c-1.09,-7.29 -6.4,-19.73 -9.05,-27.44 -3.15,-9.17 -6.07,-17.92 -9.37,-27.1 -3.22,-9.01 -6.44,-18.48 -9.37,-27.04 -1.07,-3.09 -7.2,-25.34 -10.65,-26.23l-36.69 0.08zm9.05 70.77c1.24,-6.09 7.62,-24.85 10.25,-29.91l10.05 29.86 -20.3 0.05zm-111.8 -70.89l0.13 107.78 33.84 0.08 0.39 -38.66 24.79 -0.18 7.91 -23.39 -33.05 -0.44 -0.03 -21.49 40.19 0.02 8.18 -23.67 -82.35 -0.05zm-56.97 0.07l0.2 107.71 33.79 0.08 -0.08 -107.82 -33.91 0.03zm-58.87 107.74l-0.03 -38.59 24.82 -0.05c1.74,-3.43 7.67,-19.48 8.11,-23.59l-32.89 0 0.05 -21.89 40.16 -0.01 8.2 -23.61 -82.33 -0.1 0.19 107.81 33.72 0.03zm-304.44 -474.93l0 -221.18c0,-122.53 129.72,-221.18 289.55,-221.18l-289.55 0c0,-122.54 129.72,-221.17 289.55,-221.17l289.6 0c160.41,0 289.55,99.08 289.55,221.17 0,122.09 -129.72,221.18 -289.55,221.18l289.55 0 0 221.18 -358.12 0 19.08 -56.1 7.98 -38.89 26.59 -83.56c3.96,-12.16 3.35,-19.68 5.54,-31.96 3.68,-20.67 7.53,-13.81 9.3,-45.56 0.33,-5.91 8.41,-43.3 2.05,-50.42 -3.47,-3.87 -10.43,0.16 -13.85,-4.86 -2.5,-3.64 -1.82,-35.57 -26.4,-66.12 -12.56,-15.59 -20.42,-24.8 -39,-35.85 -34.5,-20.52 -77.81,-27.14 -120.53,-10.81 -34.25,13.09 -61.72,40.32 -76.12,72.55 -20.93,46.88 -6.63,69.46 -8.03,75.29 -1.29,5.27 -6.97,4.73 -8.56,10.11 -3.73,12.54 8.49,48.05 11.63,62.01 2.06,9.31 8.78,17.18 11.65,25.66 3.27,9.66 2.4,42.73 7.55,67.27 2.22,10.5 4.43,19.12 6.21,30.16 0.93,5.93 3.03,8.73 4.24,14.58 1.1,5.36 1.18,10.51 3.06,15.64 5.21,14.38 27.04,32.02 20.39,48.61 -0.68,1.7 -0.5,1.74 -1.22,2.25l-352.14 0z" 
            fill={data.colors.fifaLogo}
          />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 6: BANDERA + PAÍS VERTICAL
          ═══════════════════════════════════════════════════ */}
      <g id="LAYER_6_FLAG_PAIS">
        {/* Flag clip */}
        {data.visibleLayers?.flag !== false && (
          <>
            <g clipPath="url(#clip-flag)" {...getHighlightProps('flag')}>
              {data.images.flag ? (
                <g id="FLAG_GROUP" transform={`translate(${4452.11 + data.images.flagTransform.x}, ${4204.82 + data.images.flagTransform.y}) scale(${data.images.flagTransform.scale}) rotate(${data.images.flagTransform.rotate}) translate(-4452.11, -4204.82)`}>
                  <image 
                    id="BANDRA" 
                    x="3898.83" y="3835.68" width="1106.56" height="738.28" 
                    href={data.images.flag} 
                  />
                </g>
              ) : (
                <rect x="4030" y="3838" width="732" height="732" fill="#00000022" />
              )}
            </g>

            {/* Flag outline */}
            <path 
              d="M4396.03 3838.47c201.5,0 366.35,164.85 366.35,366.34l0 366.35 -366.35 0c-201.49,0 -366.34,-164.85 -366.34,-366.34l0 -0.01c0,-201.49 164.85,-366.34 366.34,-366.34z" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="21"
              pointerEvents="none"
              filter={data.effects.emboss ? 'url(#emboss-effect)' : undefined}
            />
          </>
        )}

        {/* País vertical */}
        {data.visibleLayers?.country !== false && (
          <text 
            id="PAIS_VERTICAL" 
            x={data.layout.paisTransform.x} 
            y={data.layout.paisTransform.y} 
            fill="none"
            stroke={data.colors.paisStroke}
            strokeWidth={data.layout.paisTransform.strokeWidth}
            className="fnt-fifa"
            style={{ fontFamily: '"FIFA26", sans-serif' }}
            fontSize={data.layout.paisTransform.fontSize}
            fontWeight="normal"
            textAnchor="middle"
            {...getHighlightProps('pais')}
          >
            {data.texts.paisName.split('').map((char, index) => (
              <tspan key={index} x={data.layout.paisTransform.x} dy={index === 0 ? 0 : `${data.layout.paisTransform.spacing}em`}>
                {char.toUpperCase()}
              </tspan>
            ))}
          </text>
        )}
      </g>

      {/* ═══════════════════════════════════════════════════
          CAPA 7: TEXTOS (nombre, datos, club)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.texts !== false && (
        <g id="LAYER_7_TEXTOS" {...getHighlightProps('texts')}>
          <text 
            x={data.layout.nameTransform?.x || 2025.74} 
            y={data.layout.nameTransform?.y || 5960.33} 
            id="PLAYER_NAME" 
            fill="white" 
            className="fnt-name" 
            fontSize={nameFontSize} 
            textAnchor="middle" 
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "2px" }}
          >
            <tspan fontWeight="400">{data.texts.firstName}</tspan> <tspan fontWeight="900" style={{ textTransform: "uppercase" }}>{data.texts.lastName}</tspan>
          </text>
          <text 
            x={data.layout.dataTransform?.x || 2025.74} 
            y={data.layout.dataTransform?.y || 6268.24} 
            id="PLAYER_DATA" 
            fill="white" 
            className="fnt-data" 
            fontSize={data.layout.dataTransform?.fontSize || 200} 
            textAnchor="middle" 
            style={{ fontFamily: "'Montserrat', sans-serif", opacity: 0.8, letterSpacing: "5px" }}
          >
            <tspan fontWeight="400">{data.texts.birthDate}  |  {data.texts.height}  |  {data.texts.weight}</tspan>
          </text>
          <text 
            x={data.layout.clubTransform?.x || 1750} 
            y={data.layout.clubTransform?.y || 6600} 
            id="CLUB_NAME" 
            fill="white" 
            className="fnt-data" 
            fontSize={clubFontSize} 
            textAnchor="middle" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <tspan fontWeight="800" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>{data.texts.clubName}</tspan> <tspan fontWeight="400" style={{ opacity: 0.9 }}>({data.texts.clubAbbreviation})</tspan>
          </text>
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 8: BRANDING (Panini logo)
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.panini !== false && (
        <g id="LAYER_8_BRANDING" {...getHighlightProps('panini')} filter={data.effects.emboss ? 'url(#emboss-effect)' : undefined}>
          {data.images.panini ? (
            <g id="PANINI_GROUP" transform={`translate(${4400 + data.images.paniniTransform.x}, ${6500 + data.images.paniniTransform.y}) scale(${data.images.paniniTransform.scale}) rotate(${data.images.paniniTransform.rotate}) translate(-4400, -6500)`}>
              <image 
                x="3900" y="6250" width="1000" height="500" 
                preserveAspectRatio="xMidYMid meet"
                href={data.images.panini} 
              />
            </g>
          ) : (
            <g transform={`translate(${4400 + data.images.paniniTransform.x}, ${6500 + data.images.paniniTransform.y}) scale(${data.images.paniniTransform.scale}) rotate(${data.images.paniniTransform.rotate}) translate(-4400, -6500)`}>
              <rect x="3900" y="6350" width="1000" height="300" fill="#00000022" rx="40"/>
              <text x="4400" y="6540" fill="white" className="fnt-data" fontSize="150" textAnchor="middle" style={{ opacity: 0.5 }}>ADD PANINI</text>
            </g>
          )}
        </g>
      )}

      {/* ═══════════════════════════════════════════════════
          CAPA 9: WATERMARK
          ═══════════════════════════════════════════════════ */}
      {data.visibleLayers?.watermark !== false && data.layout.showWatermark !== false && (
        <g id="LAYER_9_WATERMARK">
          <text
            x={150}
            y={6000}
            transform="rotate(-90, 150, 6000)"
            fill="#ffffff"
            opacity="0.1"
            fontSize="240"
            fontWeight="bold"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "30px", pointerEvents: "none" }}
            textAnchor="start"
            filter={data.effects.emboss ? 'url(#inner-glow)' : undefined}
          >
            FANAS EDITION
          </text>
        </g>
      )}

    </svg>
  );
};

export default SVGCard;
