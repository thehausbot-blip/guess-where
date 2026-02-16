import { useState, useRef, useEffect } from 'react';
import { WorldGlobe } from './WorldGlobe';
import { useWorldGame, type WorldGuess, getWorldColorHex } from '../hooks/useWorldGame';
import { fuzzyMatchCountries, type WorldCountry } from '../worldGameData';
import { getDayNumber } from '../utils';
import { useUnitPref } from '../hooks/useUnitPref';
import { ShareModal } from './ShareModal';

interface WorldGameViewProps {
  onBackToLanding: () => void;
}

function WorldGuessInput({ onGuess, disabled, guessedIsos }: {
  onGuess: (name: string) => boolean;
  disabled: boolean;
  guessedIsos: Set<string>;
}) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<WorldCountry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const matches = fuzzyMatchCountries(input).filter(c => !guessedIsos.has(c.iso));
      setSuggestions(matches);
      setSelectedIdx(-1);
    } else {
      setSuggestions([]);
    }
  }, [input, guessedIsos]);

  const submit = (name: string) => {
    const success = onGuess(name);
    if (success) {
      setInput('');
      setSuggestions([]);
      setError('');
    } else {
      setError('Not found or already guessed');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        submit(suggestions[selectedIdx].name);
      } else if (input.trim()) {
        submit(input.trim());
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a country name..."
            disabled={disabled}
            autoComplete="off"
            className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-blue-200/40 border-2 ${error ? 'border-red-500' : 'border-white/20'} focus:border-red-400 focus:outline-none disabled:opacity-50 transition-colors text-lg`}
          />
          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-medium">{error}</span>
          )}
          {suggestions.length > 0 && (
            <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-[#0a1e4a] border border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
              {suggestions.map((country, i) => (
                <button
                  key={country.iso}
                  onMouseDown={(e) => { e.preventDefault(); submit(country.name); }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors ${i === selectedIdx ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'}`}
                >
                  <span className="text-lg">{country.emoji}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => { if (input.trim()) submit(input.trim()); }}
          disabled={disabled || !input.trim()}
          className="px-6 py-3 rounded-lg font-bold text-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
        >
          Guess
        </button>
      </div>
    </div>
  );
}

function GuessRow({ guess, unit }: { guess: WorldGuess; unit: 'mi' | 'km' }) {
  const bgColor = getWorldColorHex(guess.color);
  const dist = unit === 'mi' ? Math.round(guess.distance * 0.621371) : guess.distance;
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10"
      style={{ backgroundColor: bgColor + '22' }}
    >
      <span className="text-xl">{guess.country.emoji}</span>
      <span className="text-white font-medium flex-1">{guess.country.name}</span>
      <span className="text-blue-200 text-sm font-mono">{dist.toLocaleString()} {unit}</span>
      <span className="text-xl">{guess.direction}</span>
    </div>
  );
}

export function WorldGameView({ onBackToLanding }: WorldGameViewProps) {
  const { gameState, makeGuess, giveUp, newGame, generateShareText } = useWorldGame();
  const [shareText, setShareText] = useState<string | null>(null);
  const dayNumber = getDayNumber();

  const [distUnit, toggleUnit] = useUnitPref();
  const guessedIsos = new Set(gameState.guesses.map(g => g.country.iso));
  const won = gameState.isComplete && !gameState.gaveUp;
  const isDaily = gameState.mode === 'daily';

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-2">
          <div className="flex items-center justify-between mb-0.5">
            <button onClick={onBackToLanding} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-xs sm:text-sm border border-white/10 transition-colors shrink-0">
              ← Maps
            </button>
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-white whitespace-nowrap truncate mx-2">
              🌍 <span className="text-red-500">World</span> Guesser
            </h1>
            <button
              onClick={toggleUnit}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-xs sm:text-sm border border-white/10 transition-colors shrink-0"
            >
              📏 {distUnit}
            </button>
          </div>
          {isDaily && <p className="text-blue-200 text-sm sm:text-lg">Day #{dayNumber}</p>}
        </header>

        {/* Mode toggle */}
        <div className="flex justify-center gap-2 mb-3">
          <button
            onClick={() => { if (!isDaily) { window.location.reload(); } }}
            className={`px-4 py-2 rounded-lg font-medium text-sm border transition-colors ${
              isDaily ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-white/10 border-white/20 text-blue-200 hover:bg-white/20'
            }`}
          >
            🏆 Daily Challenge
          </button>
          <button
            onClick={() => { if (isDaily) newGame(); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm border transition-colors ${
              !isDaily ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 border-white/20 text-blue-200 hover:bg-white/20'
            }`}
          >
            🎲 Free Play
          </button>
        </div>

        {/* Daily status bar */}
        {isDaily && !gameState.isComplete && (
          <div className="text-center mb-2">
            <p className="text-blue-200/60 text-xs">
              {gameState.guesses.length > 0
                ? `${gameState.guesses.length} guess${gameState.guesses.length !== 1 ? 'es' : ''} so far`
                : 'Guess the mystery country! 🌍'}
            </p>
          </div>
        )}

        {/* Globe */}
        <div className="mb-4">
          <WorldGlobe
            guesses={gameState.guesses}
            targetFound={won}
            targetCountryIso={gameState.target?.iso}
          />
        </div>

        {/* Complete state */}
        {gameState.isComplete && (
          <div className={`mb-6 p-4 rounded-xl text-center ${won ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
            {won ? (
              <>
                <p className="text-3xl mb-2">🎉 You got it!</p>
                <p className="text-white text-lg">
                  {gameState.target?.emoji} <strong>{gameState.target?.name}</strong>
                </p>
                <p className="text-blue-200/70 text-sm mt-1">
                  {gameState.guesses.length} {gameState.guesses.length === 1 ? 'guess' : 'guesses'}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl mb-2">😔 Game Over</p>
                <p className="text-white text-lg">
                  The answer was {gameState.target?.emoji} <strong>{gameState.target?.name}</strong>
                </p>
              </>
            )}
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <button onClick={() => setShareText(generateShareText())} className="px-6 py-2 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-medium transition-colors">
                📤 Share
              </button>
              {isDaily ? (
                <button onClick={newGame} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors">
                  🎲 Free Play
                </button>
              ) : (
                <button onClick={newGame} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors">
                  🔄 New Game
                </button>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        {!gameState.isComplete && (
          <div className="mb-6">
            <WorldGuessInput onGuess={makeGuess} disabled={gameState.isComplete} guessedIsos={guessedIsos} />
            <div className="flex items-center justify-center gap-4 mt-3">
              <button onClick={giveUp} className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded font-medium border border-white/20 transition-colors">
                🏳️ Give Up
              </button>
            </div>
          </div>
        )}

        {/* Guess list */}
        {gameState.guesses.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg mb-3">Guesses ({gameState.guesses.length})</h2>
            <div className="space-y-2">
              {gameState.guesses.map(guess => (
                <GuessRow key={guess.country.iso} guess={guess} unit={distUnit} />
              ))}
            </div>
          </div>
        )}

        {/* How to Play */}
        <div className="text-center mt-4 mb-2">
          <details className="inline-block text-left max-w-md w-full">
            <summary className="cursor-pointer text-blue-200/50 hover:text-blue-200 text-sm text-center transition-colors">
              📖 How to Play
            </summary>
            <div className="mt-3 space-y-2 text-blue-100 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <p><strong>🎯 Goal:</strong> Guess the mystery country!</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p><strong>🧭 Arrows:</strong> Each guess shows a directional arrow pointing toward the target.</p>
                <p className="text-xs text-blue-200/60 mt-1">⬆️N ↗️NE ➡️E ↘️SE ⬇️S ↙️SW ⬅️W ↖️NW</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p><strong>🌈 Colors:</strong> Distance from the target:</p>
                <div className="mt-1 space-y-1 text-xs">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> &lt; 1,000 km (hot!)</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500 inline-block" /> &lt; 3,000 km</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500 inline-block" /> &lt; 6,000 km</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> &gt; 6,000 km (cold)</div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Footer */}
        <footer className="text-center text-blue-200/40 text-sm mt-4">
          <p>Made in Texas 🤠</p>
        </footer>
      </div>

      {shareText && <ShareModal text={shareText} onClose={() => setShareText(null)} />}
    </div>
  );
}
