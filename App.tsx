
import React, { useState, useMemo, useEffect } from 'react';
import { RAW_PALETTES } from './constants';
import { ColorPalette, ViewMode } from './types';
import PaletteCard from './components/PaletteCard';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'id' | 'count'>('id');

  // Parse raw palettes from constants
  const allPalettes = useMemo(() => {
    return RAW_PALETTES.trim()
      .split('\n')
      .map((line, index) => {
        const colors = line
          .split(',')
          .map(c => c.trim())
          .filter(c => c.startsWith('#'));
        
        return {
          id: (index + 1).toString().padStart(3, '0'),
          colors
        } as ColorPalette;
      })
      .filter(p => p.colors.length > 0);
  }, []);

  const filteredPalettes = useMemo(() => {
    let result = allPalettes.filter(p => 
      p.id.includes(searchTerm) || 
      p.colors.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortBy === 'count') {
      result = [...result].sort((a, b) => b.colors.length - a.colors.length);
    } else {
      result = [...result].sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [allPalettes, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-2 sm:py-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L10 17.657" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">FigurePalette</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest">Digital Swatch Collection</p>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Hex or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl px-12 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm outline-none"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 rounded-xl p-1 flex gap-1">
              {(['grid', 'compact', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg capitalize text-xs font-semibold transition-all ${
                    viewMode === mode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gallery</h2>
            <p className="text-sm text-slate-500">Found {filteredPalettes.length} unique color collections</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase">Sort By</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="id">Original Order</option>
              <option value="count">Color Count</option>
            </select>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className={`
          ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
          ${viewMode === 'compact' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : ''}
          ${viewMode === 'list' ? 'flex flex-col gap-4' : ''}
        `}>
          {filteredPalettes.map((p) => (
            <PaletteCard key={p.id} palette={p} viewMode={viewMode} />
          ))}
          {filteredPalettes.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700">No matching palettes</h3>
              <p className="text-slate-400">Try searching for a specific hex code like #FF0000</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400 font-medium">FigurePalette &copy; {new Date().getFullYear()}</p>
          <div className="mt-4 flex justify-center">
            <span className="text-[10px] text-slate-300 font-mono">Parsed from text manifest</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
