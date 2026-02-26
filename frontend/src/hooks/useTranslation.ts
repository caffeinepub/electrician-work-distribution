import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, Language } from '../i18n/translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: string, key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = sessionStorage.getItem('app-language');
    return (stored as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    sessionStorage.setItem('app-language', lang);
  }, []);

  const t = useCallback(
    (section: string, key: string): string => {
      const langData = translations[language] as Record<string, Record<string, string>>;
      const sectionData = langData[section];
      if (!sectionData) {
        const enData = translations['en'] as Record<string, Record<string, string>>;
        return enData[section]?.[key] || key;
      }
      return sectionData[key] || (translations['en'] as Record<string, Record<string, string>>)[section]?.[key] || key;
    },
    [language]
  );

  return React.createElement(
    TranslationContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return ctx;
}
