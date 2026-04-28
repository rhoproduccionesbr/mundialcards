/**
 * Genera una textura de ruido/grano real usando Canvas.
 * Los filtros SVG (feTurbulence) NO funcionan como CSS background-image.
 * Este approach genera un PNG base64 real que sí funciona en todos los navegadores.
 */

let cachedNoise: string | null = null;

export function generateNoiseTexture(size = 128): string {
  if (cachedNoise) return cachedNoise;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i]     = v; // R
    data[i + 1] = v; // G
    data[i + 2] = v; // B
    data[i + 3] = 255; // Full alpha — opacity controlled by CSS
  }

  ctx.putImageData(imageData, 0, 0);
  cachedNoise = canvas.toDataURL('image/png');
  return cachedNoise;
}
