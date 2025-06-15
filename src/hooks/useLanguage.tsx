import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getTranslations, type LanguageCode, type Translations } from '@/lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  t: Translations;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [loading, setLoading] = useState(true);

  // Set loading to false immediately since we're not fetching language preference
  useEffect(() => {
    setLoading(false);
  }, []);

  // Simplified setLanguage function (kept for compatibility)
  const setLanguage = async (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
  };

  const translations = getTranslations(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations,
        setLanguage,
        loading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};