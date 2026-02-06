import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, LANGUAGES } from '@/i18n/translations';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('es');

  // Load language from profile or localStorage
  useEffect(() => {
    const loadLanguage = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data?.preferred_language && data.preferred_language in LANGUAGES) {
          setLanguageState(data.preferred_language as Language);
          return;
        }
      }
      
      // Fallback to localStorage
      const stored = localStorage.getItem('preferred_language');
      if (stored && stored in LANGUAGES) {
        setLanguageState(stored as Language);
      }
    };
    
    loadLanguage();
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
    
    // Save to profile if logged in
    if (user) {
      await supabase
        .from('profiles')
        .update({ preferred_language: lang })
        .eq('id', user.id);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['es'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
