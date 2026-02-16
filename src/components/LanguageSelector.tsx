import { useI18n } from '../i18n/useI18n';
import { LANGUAGE_OPTIONS } from '../i18n/translations';

export function LanguageSelector() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <span className="text-blue-200/40 text-xs mr-0.5">🌐</span>
      {LANGUAGE_OPTIONS.map(option => (
        <button
          key={option.code}
          onClick={() => setLang(option.code)}
          className={`px-2 py-1 rounded-lg text-sm transition-all ${
            lang === option.code
              ? 'bg-red-600/40 ring-1 ring-red-400 scale-110'
              : 'bg-white/5 hover:bg-white/15'
          }`}
          title={option.label}
        >
          {option.flag}
        </button>
      ))}
    </div>
  );
}
