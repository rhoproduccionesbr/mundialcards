import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker, HexColorInput } from 'react-colorful';

// ── Persistent color history (localStorage) ──
const HISTORY_KEY = 'mundialcards_color_history';
const MAX_HISTORY = 24;

const loadHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveHistory = (colors: string[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(colors.slice(0, MAX_HISTORY)));
};

const addToHistory = (color: string): string[] => {
  const history = loadHistory();
  const normalized = color.toUpperCase();
  const filtered = history.filter(c => c !== normalized);
  const updated = [normalized, ...filtered].slice(0, MAX_HISTORY);
  saveHistory(updated);
  return updated;
};

// ── Component ──
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  id?: string;
}

const ColorPickerField: React.FC<ColorPickerProps> = ({ label, value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(loadHistory);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside (portal)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // Save to history on close
        const updated = addToHistory(value);
        setHistory(updated);
      }
    };
    // Use setTimeout to avoid catching the same click that opened it
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [isOpen, value]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        const updated = addToHistory(value);
        setHistory(updated);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, value]);

  const handleChange = useCallback((color: string) => {
    onChange(color);
  }, [onChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    const updated = addToHistory(value);
    setHistory(updated);
  }, [value]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  return (
    <div className="relative" id={id}>
      <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">{label}</label>
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => {
          if (!isOpen) setHistory(loadHistory());
          setIsOpen(!isOpen);
        }}
      >
        <div
          className="w-7 h-7 rounded-md border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors shadow-inner"
          style={{ backgroundColor: value }}
        />
        <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors uppercase">{value}</span>
      </div>

      {/* Portal — centered on screen */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div
            ref={popoverRef}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95"
            style={{ width: '260px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-neutral-600" style={{ backgroundColor: value }} />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">{label}</span>
              </div>
              <button
                onClick={handleClose}
                className="text-neutral-500 hover:text-white transition-colors text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>

            {/* Color picker */}
            <HexColorPicker color={value} onChange={handleChange} style={{ width: '100%', height: '180px' }} />

            {/* Hex input */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 font-mono">#</span>
              <HexColorInput
                color={value}
                onChange={handleChange}
                prefixed={false}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white font-mono uppercase outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-[10px] bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-bold transition-colors"
              >
                OK
              </button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-3 border-t border-neutral-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">🎨 Recientes</span>
                  <button
                    onClick={clearHistory}
                    className="text-[9px] text-neutral-600 hover:text-red-400 transition-colors uppercase font-bold"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {history.map((c, i) => (
                    <button
                      key={`${c}-${i}`}
                      className="w-6 h-6 rounded-md border border-neutral-700 hover:border-white hover:scale-110 transition-all cursor-pointer shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                      onClick={() => handleChange(c)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ColorPickerField;
