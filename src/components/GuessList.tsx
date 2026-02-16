import type { Guess } from '../types';
import { getHexColor, getColorEmoji } from '../utils';
import { convertDistance, type DistanceUnit } from '../hooks/useUnitPref';
import { useI18n } from '../i18n/useI18n';

interface GuessListProps {
  guesses: Guess[];
  unit?: string;
  compact?: boolean;
}

export function GuessList({ guesses, unit = 'mi', compact = false }: GuessListProps) {
  const { t } = useI18n();

  if (guesses.length === 0) {
    return (
      <div className="text-center text-blue-200/50 py-4 text-sm">
        {t('guessList.makeFirst')}
      </div>
    );
  }

  const sortedGuesses = [...guesses].sort((a, b) => {
    if (a.color === 'correct') return -1;
    if (b.color === 'correct') return 1;
    return a.distance - b.distance;
  });

  if (compact) {
    return (
      <div className="space-y-1">
        {sortedGuesses.map((guess) => (
          <div
            key={`${guess.city.name}-${guess.timestamp}`}
            className={`flex items-center justify-between px-2 py-1.5 rounded text-sm border-l-3 ${
              guess.outOfBand ? 'bg-gray-800/30' : 'bg-white/5'
            }`}
            style={{ borderLeftColor: guess.outOfBand ? '#888888' : getHexColor(guess.color), borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">
                {guess.color === 'correct' ? '🟢' : guess.outOfBand ? '⚪' : getColorEmoji(guess.color)}
              </span>
              <span className={`truncate font-medium ${guess.outOfBand ? 'text-gray-400' : guess.color === 'correct' ? 'text-green-400' : 'text-white'}`}>
                {guess.city.name}
              </span>
            </div>
            <span className={`shrink-0 ml-2 text-xs tabular-nums ${guess.outOfBand ? 'text-gray-500' : guess.color === 'correct' ? 'text-green-400' : 'text-blue-200/70'}`}>
              {guess.color === 'correct' ? '✓' : `${convertDistance(guess.distance, unit as DistanceUnit)} ${unit}`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedGuesses.map((guess) => (
        <div
          key={`${guess.city.name}-${guess.timestamp}`}
          className={`
            flex items-center justify-between
            px-4 py-3 rounded-lg
            transition-all duration-300
            ${guess.outOfBand
              ? 'bg-gray-800/50 border-l-4 border-gray-500'
              : 'bg-white/10 border-l-4'
            }
          `}
          style={{ borderLeftColor: guess.outOfBand ? '#888888' : getHexColor(guess.color) }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {guess.outOfBand ? '⚪' : getColorEmoji(guess.color)}
            </span>
            <div>
              <span className={`font-semibold text-lg ${guess.outOfBand ? 'text-gray-400' : 'text-white'}`}>
                {guess.city.name}
              </span>
              {guess.color === 'correct' && (
                <span className="ml-2 text-emerald-400 text-sm font-medium">🎉 {t('guessList.correct')}</span>
              )}
              {guess.outOfBand && (
                <span className="ml-2 text-gray-400 text-xs">
                  ({t('game.pop')}: {guess.city.population.toLocaleString()}) — {t('guessList.outOfPool')}
                </span>
              )}
            </div>
          </div>
          {guess.color !== 'correct' && (
            <div className="text-right">
              <span className={`font-medium text-lg ${guess.outOfBand ? 'text-gray-400' : 'text-blue-100'}`}>
                {convertDistance(guess.distance, unit as DistanceUnit)} {unit}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
