import React from 'react';
import { LayerReflection as LayerReflectionType } from '../types';

interface Props {
  config: LayerReflectionType;
  className?: string;
}

/**
 * Overlay de reflejo por capa individual.
 * Se renderiza como un div absoluto encima de cada capa SVG.
 * Los estilos se definen en layer-reflections.css.
 */
const LayerReflectionOverlay: React.FC<Props> = ({ config, className = '' }) => {
  if (!config.enabled || config.style === 'none') return null;

  return (
    <div
      className={`layer-reflection active ${className}`}
      data-lr-style={config.style}
      style={{ '--lr-intensity': config.intensity / 100 } as React.CSSProperties}
    />
  );
};

export default LayerReflectionOverlay;
