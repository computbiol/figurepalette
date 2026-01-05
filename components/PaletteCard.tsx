
import React from 'react';
import { ColorPalette, ViewMode } from '../types';
import ColorSwatch from './ColorSwatch';

interface PaletteCardProps {
  palette: ColorPalette;
  viewMode: ViewMode;
}

const PaletteCard: React.FC<PaletteCardProps> = ({ palette, viewMode }) => {
  if (viewMode === 'compact') {
    return (
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
        <div className="flex -space-x-2">
          {palette.colors.map((color, idx) => (
            <div 
              key={`${palette.id}-${color}-${idx}`}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-[10px] text-gray-400 font-mono">#{palette.id}</span>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
        <div className="text-gray-400 font-mono text-sm min-w-[3rem]">#{palette.id}</div>
        <div className="flex flex-wrap gap-3 flex-1">
          {palette.colors.map((color, idx) => (
            <ColorSwatch key={`${palette.id}-${color}-${idx}`} color={color} size="md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-start">
        <span className="text-xs font-mono text-gray-400">Palette ID {palette.id}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-start">
        {palette.colors.map((color, idx) => (
          <ColorSwatch key={`${palette.id}-${color}-${idx}`} color={color} size="lg" />
        ))}
      </div>

      <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400">{palette.colors.length} Colors</span>
        <button 
          onClick={() => navigator.clipboard.writeText(palette.colors.join(','))}
          className="text-xs font-semibold text-slate-700 hover:text-indigo-600"
        >
          Copy Array
        </button>
      </div>
    </div>
  );
};

export default PaletteCard;
