import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language } from './translations';

const LANG_KEY = 'guesser-language';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && saved in translations) return saved as Language;
    // Auto-detect from browser
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang in translations) return browserLang;
    return 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const dict = translations[lang] || translations.en;
    let text = (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
