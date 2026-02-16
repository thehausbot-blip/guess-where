import { useState, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { City } from '../types';
import { useI18n } from '../i18n/useI18n';

interface GuessInputProps {
  cities: City[];
  onGuess: (cityName: string) => boolean;
  disabled: boolean;
  guessedCities: string[];
  placeholder?: string;
  entityName?: string;
}

export function GuessInput({ cities, onGuess, disabled, guessedCities, placeholder, entityName }: GuessInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Set up Fuse.js for fuzzy matching on submit
  const fuse = useMemo(() => {
    return new Fuse(cities, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true
    });
  }, [cities]);

  // Filter out already guessed cities
  const guessedSet = useMemo(() => 
    new Set(guessedCities.map(c => c.toLowerCase())), 
    [guessedCities]
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const guess = input.trim();
    if (!guess) return;

    // Normalize: strip accents for comparison
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Try exact match first (accent-insensitive), then startsWith, then fuzzy
    let cityName = guess;
    const guessNorm = normalize(guess);
    const exactMatch = cities.find(c => normalize(c.name) === guessNorm);
    
    if (exactMatch) {
      cityName = exactMatch.name;
    } else {
      // Try startsWith match (accent-insensitive)
      const startsWithMatch = cities.find(c => normalize(c.name).startsWith(guessNorm));
      if (startsWithMatch) {
        cityName = startsWithMatch.name;
      } else {
        // Fuzzy match with tighter threshold
        const results = fuse.search(guess, { limit: 1 });
        if (results.length > 0 && results[0].score && results[0].score < 0.2) {
          cityName = results[0].item.name;
        }
      }
    }

    const success = onGuess(cityName);
    if (success) {
      setInput('');
      setError('');
    } else {
      // Check if it's a duplicate or not found
      if (guessedSet.has(cityName.toLowerCase())) {
        setError(t('game.alreadyGuessed'));
      } else {
        setError(entityName ? `Not found in ${entityName}` : t('game.cityNotFound'));
      }
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {/* Hidden fields to absorb iOS AutoFill Contact */}
      <input type="text" name="fakeUsername" style={{ display: 'none' }} tabIndex={-1} autoComplete="username" />
      <input type="password" name="fakePassword" style={{ display: 'none' }} tabIndex={-1} autoComplete="current-password" />
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              // On iOS, prevent keyboard from scrolling map out of view
              const scrollY = window.scrollY;
              setTimeout(() => window.scrollTo(0, scrollY), 0);
              setTimeout(() => window.scrollTo(0, scrollY), 100);
              setTimeout(() => window.scrollTo(0, scrollY), 300);
            }}
            placeholder={placeholder || (entityName ? `Enter a state or territory...` : t('game.enterCity'))}
            disabled={disabled}
            name="guess-input-field"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            className={`
              w-full px-4 py-3 rounded-lg
              bg-white/10 text-white placeholder-blue-200/40
              border-2 ${error ? 'border-red-500' : 'border-white/20'}
              focus:border-red-400 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors text-lg
            `}
          />
          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-medium">
              {error}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg
            bg-red-600 text-white
            hover:bg-red-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          {t('game.guess')}
        </button>
      </div>
    </form>
  );
}
