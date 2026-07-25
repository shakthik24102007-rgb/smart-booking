import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_OPTIONS, ThemeId } from '../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, activeThemeOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-[#e8e8df] hover:bg-[#d9d9cf] text-[#5a5a40] text-xs font-semibold transition-colors"
        title="Select Theme"
      >
        <Palette className="w-3.5 h-3.5 text-[#5a5a40]" />
        <span className="hidden md:inline">{activeThemeOption.name}</span>
        <div className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: activeThemeOption.previewPrimary }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#e8e8df] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[10px] font-bold text-[#8a8a70] uppercase tracking-wider flex items-center justify-between border-b border-[#e8e8df] pb-2 mb-2">
            <span className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-[#5a5a40]" />
              Select Visual Theme
            </span>
            <span className="text-[10px] font-mono text-[#5a5a40] bg-[#5a5a401a] px-2 py-0.5 rounded-full">
              5 Themes
            </span>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map(opt => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#5a5a401a] text-[#5a5a40] font-bold border border-[#5a5a4033]'
                      : 'hover:bg-[#fdfaf6] text-[#2d2d2a]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {/* Theme color preview chips */}
                    <div className="flex -space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: opt.previewBg }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs z-10"
                        style={{ backgroundColor: opt.previewPrimary }}
                      />
                    </div>

                    <div>
                      <div className="font-semibold">{opt.name}</div>
                      <div className="text-[10px] text-[#8a8a70] font-normal leading-tight">
                        {opt.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#5a5a40] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
