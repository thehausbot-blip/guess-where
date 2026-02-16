import { useState } from 'react';
import type { MapConfig } from '../mapConfigs';

interface HowToPlayProps {
  mapConfig: MapConfig;
  onDismiss: () => void;
  onPractice: () => void;
}

export function HowToPlay({ mapConfig, onDismiss, onPractice }: HowToPlayProps) {
  const [page, setPage] = useState<'menu' | 'instructions'>('menu');

  if (page === 'instructions') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#001a45] border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            📖 How to Play
          </h2>

          <div className="space-y-4 text-blue-100 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <h3 className="text-white font-semibold mb-1">🎯 The Goal</h3>
              <p>Guess the mystery city in <strong>{mapConfig.name}</strong>! Each guess shows you how far away you are.</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <h3 className="text-white font-semibold mb-1">🗺️ Reading the Map</h3>
              <p>After each guess, the city appears on the map color-coded by distance:</p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500 inline-block" /> <strong>Red</strong> — Very close (hot!)</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-500 inline-block" /> <strong>Orange</strong> — Getting warmer</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-500 inline-block" /> <strong>Yellow</strong> — Medium distance</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#CC9966] inline-block" /> <strong>Brown</strong> — Cool, still far</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-300 inline-block" /> <strong>White</strong> — Way off</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-500 inline-block" /> <strong>Green</strong> — Correct! 🎉</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <h3 className="text-white font-semibold mb-1">🏆 Daily Challenge</h3>
              <p>A new challenge every day! Start at <strong>Very Easy</strong> (big cities) and work your way up through 6 difficulty tiers. Each correct guess advances you to harder cities. How far can you get?</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <h3 className="text-white font-semibold mb-1">🎮 Free Play</h3>
              <p>Pick any difficulty and play as many games as you want. Great for practice!</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <h3 className="text-white font-semibold mb-1">💡 Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Use geography clues — rivers, coastline, regions</li>
                <li>The distance shown is in miles as the crow flies</li>
                <li>Hover over guessed cities on the map for details</li>
                <li>You can guess any city, even ones outside your current difficulty band</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setPage('menu')}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20"
            >
              ← Back
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              Let's Go!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#001a45] border border-white/20 rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
        <h2 className="text-white text-2xl font-bold mb-2">
          {mapConfig.emoji} {mapConfig.name} Guesser
        </h2>
        <p className="text-blue-200 mb-6">
          Can you find the mystery city?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setPage('instructions')}
            className="w-full px-6 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 text-lg transition-all"
          >
            📖 How to Play
          </button>
          <button
            onClick={onPractice}
            className="w-full px-6 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg transition-all"
          >
            🎮 Practice Round
          </button>
          <button
            onClick={onDismiss}
            className="w-full px-6 py-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all"
          >
            🏆 Jump into Daily Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
