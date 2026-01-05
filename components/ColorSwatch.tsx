
import React, { useState } from 'react';

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showHex?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, size = 'md', showHex = true }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  // Determine text color based on brightness (simple heuristic)
  const isLight = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <div 
      className="group relative flex flex-col items-center gap-1 cursor-pointer"
      onClick={copyToClipboard}
    >
      <div 
        className={`${sizeClasses[size]} rounded-lg shadow-sm border border-black/5 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center`}
        style={{ backgroundColor: color }}
      >
        {copied && (
          <span className={`text-[10px] font-bold ${isLight(color) ? 'text-black/70' : 'text-white/70'}`}>
            COPIED!
          </span>
        )}
      </div>
      {showHex && (
        <span className="text-[10px] font-mono text-gray-500 group-hover:text-gray-900 transition-colors uppercase">
          {color}
        </span>
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        Click to Copy
      </div>
    </div>
  );
};

export default ColorSwatch;
