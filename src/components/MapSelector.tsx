import { useState } from 'react';
import { MAP_CONFIGS } from '../mapConfigs';
import type { MapConfig } from '../mapConfigs';

interface MapSelectorProps {
  currentMap: MapConfig;
  onChange: (mapId: string) => void;
}

export function MapSelector({ currentMap, onChange }: MapSelectorProps) {
  const [open, setOpen] = useState(false);
  const maps = Object.values(MAP_CONFIGS);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
      >
        <span className="text-xl">{currentMap.emoji}</span>
        <span className="text-white font-medium">{currentMap.name}</span>
        <svg className={`w-4 h-4 text-blue-200 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-[#001a45] border border-white/20 rounded-xl p-2 shadow-2xl min-w-[200px]">
            <p className="text-blue-200/60 text-xs px-3 py-1 font-medium uppercase tracking-wider">Select Map</p>
            {maps.map(map => (
              <button
                key={map.id}
                onClick={() => {
                  onChange(map.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentMap.id === map.id
                    ? 'bg-red-600/30 ring-1 ring-red-400'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{map.emoji}</span>
                <div className="text-left">
                  <div className="text-white font-medium">{map.name}</div>
                </div>
                {currentMap.id === map.id && (
                  <span className="ml-auto text-red-400">✓</span>
                )}
              </button>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 px-3 py-1">
              <p className="text-blue-200/40 text-xs italic">More maps coming soon...</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
