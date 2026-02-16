import { useState } from 'react';
import type { Guess } from '../types';
import { getHexColor, getColorEmoji } from '../utils';
import { convertDistance, type DistanceUnit } from '../hooks/useUnitPref';
import { useI18n } from '../i18n/useI18n';

interface GuessOverlayProps {
  guesses: Guess[];
  unit?: string;
  totalGuesses?: number;
}

export function GuessOverlay({ guesses, unit = 'mi', totalGuesses }: GuessOverlayProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();

  if (guesses.length === 0) return null;

  const sorted = [...guesses].sort((a, b) => {
    if (a.color === 'correct') return -1;
    if (b.color === 'correct') return 1;
    return a.distance - b.distance;
  });

  return (
    <div
      className={`absolute bottom-2 right-2 z-[1000] transition-all duration-200 ${
        expanded ? 'w-64' : 'w-auto'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Collapsed: just a badge */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#001a45]/90 backdrop-blur border border-white/20 shadow-xl hover:bg-[#001a45] transition-colors"
        >
          <span className="text-white text-sm font-medium">
            📋 {guesses.length}
          </span>
          {/* Show last guess color dot */}
          <span className="text-xs">
            {getColorEmoji(guesses[guesses.length - 1].color)}
          </span>
        </button>
      )}

      {/* Expanded: scrollable guess list */}
      {expanded && (
        <div className="bg-[#001a45]/95 backdrop-blur border border-white/20 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="text-white text-xs font-semibold">
              {t('game.yourGuesses')} ({guesses.length})
              {totalGuesses && totalGuesses > guesses.length ? (
                <span className="text-blue-200/50 ml-1">• {totalGuesses} {t('game.total')}</span>
              ) : null}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className="text-blue-200/40 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
            {sorted.map((guess) => (
              <div
                key={`${guess.city.name}-${guess.timestamp}`}
                className="flex items-center justify-between px-2 py-1 rounded text-xs"
                style={{ borderLeft: `3px solid ${guess.outOfBand ? '#888' : getHexColor(guess.color)}` }}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span className="shrink-0">{guess.color === 'correct' ? '🟢' : guess.outOfBand ? '⚪' : getColorEmoji(guess.color)}</span>
                  <span className={`truncate ${guess.outOfBand ? 'text-gray-400' : guess.color === 'correct' ? 'text-green-400 font-semibold' : 'text-white'}`}>
                    {guess.city.name}
                  </span>
                </div>
                <span className={`shrink-0 ml-2 tabular-nums ${guess.outOfBand ? 'text-gray-500' : guess.color === 'correct' ? 'text-green-400' : 'text-blue-200/60'}`}>
                  {guess.color === 'correct' ? '✓' : `${convertDistance(guess.distance, unit as DistanceUnit)} ${unit}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
