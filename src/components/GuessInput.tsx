import { useState, useRef, useMemo, useCallback } from 'react';
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
  const editorRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const fuse = useMemo(() => {
    return new Fuse(cities, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true
    });
  }, [cities]);

  const guessedSet = useMemo(() => 
    new Set(guessedCities.map(c => c.toLowerCase())), 
    [guessedCities]
  );

  const handleSubmit = useCallback(() => {
    const guess = input.trim();
    if (!guess) return;

    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    let cityName = guess;
    const guessNorm = normalize(guess);
    const exactMatch = cities.find(c => normalize(c.name) === guessNorm);
    
    if (exactMatch) {
      cityName = exactMatch.name;
    } else {
      const startsWithMatch = cities.find(c => normalize(c.name).startsWith(guessNorm));
      if (startsWithMatch) {
        cityName = startsWithMatch.name;
      } else {
        const results = fuse.search(guess, { limit: 1 });
        if (results.length > 0 && results[0].score && results[0].score < 0.2) {
          cityName = results[0].item.name;
        }
      }
    }

    const success = onGuess(cityName);
    if (success) {
      setInput('');
      if (editorRef.current) editorRef.current.textContent = '';
      setError('');
    } else {
      if (guessedSet.has(cityName.toLowerCase())) {
        setError(t('game.alreadyGuessed'));
      } else {
        setError(entityName ? `Not found in ${entityName}` : t('game.cityNotFound'));
      }
      setTimeout(() => setError(''), 2000);
    }
  }, [input, cities, fuse, onGuess, guessedSet, t, entityName]);

  const placeholderText = placeholder || (entityName ? `Enter a state or territory...` : t('game.enterCity'));

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div
            ref={editorRef}
            contentEditable={!disabled}
            role="textbox"
            aria-placeholder={placeholderText}
            onInput={(e) => {
              setInput((e.target as HTMLDivElement).textContent || '');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onFocus={() => {
              const scrollY = window.scrollY;
              setTimeout(() => window.scrollTo(0, scrollY), 0);
              setTimeout(() => window.scrollTo(0, scrollY), 100);
              setTimeout(() => window.scrollTo(0, scrollY), 300);
            }}
            data-placeholder={placeholderText}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-white/10 text-white
              border-2 ${error ? 'border-red-500' : 'border-white/20'}
              focus:border-red-400 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors text-lg
              empty:before:content-[attr(data-placeholder)] empty:before:text-blue-200/40
              min-h-[50px] leading-[26px]
              ${disabled ? 'opacity-50 pointer-events-none' : ''}
            `}
            suppressContentEditableWarning
          />
          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-medium">
              {error}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
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
    </div>
  );
}
