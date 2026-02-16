import type { Difficulty } from '../types';
import { TIER_LABELS } from '../types';
import { useI18n } from '../i18n/useI18n';

interface DifficultySelectorProps {
  current: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  cityCounts: Record<Difficulty, number>;
  disabled?: boolean;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  veryEasy: 'bg-blue-500 hover:bg-blue-400',
  easy: 'bg-green-600 hover:bg-green-500',
  hard: 'bg-orange-600 hover:bg-orange-500',
  insane: 'bg-purple-600 hover:bg-purple-500',
};

const DIFF_I18N_KEYS: Record<Difficulty, string> = {
  veryEasy: 'diff.veryEasy',
  easy: 'diff.easy',
  hard: 'diff.hard',
  insane: 'diff.insane',
};

export function DifficultySelector({ 
  current, 
  onChange, 
  cityCounts,
  disabled = false 
}: DifficultySelectorProps) {
  const { t } = useI18n();
  const difficulties: Difficulty[] = ['veryEasy', 'easy', 'hard', 'insane'];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {difficulties.map(diff => {
        const info = TIER_LABELS[diff];
        const isActive = current === diff;
        const count = cityCounts[diff] || 0;

        return (
          <button
            key={diff}
            onClick={() => onChange(diff)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive 
                ? `${DIFFICULTY_COLORS[diff]} text-white ring-2 ring-white ring-offset-2 ring-offset-blue-950` 
                : 'bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={`${count} ${t('game.cities')}`}
          >
            <span className="mr-1">{info.emoji}</span>
            {t(DIFF_I18N_KEYS[diff])}
          </button>
        );
      })}
    </div>
  );
}
