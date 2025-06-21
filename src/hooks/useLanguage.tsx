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
  const [language, setLanguageState] = useState<LanguageCode>('uz');
  const [loading, setLoading] = useState(true);

  // Load user's language preference from profile
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('language_preference')
            .eq('id', user.id)
            .single();
          
          if (!error && data?.language_preference) {
            setLanguageState(data.language_preference as LanguageCode);
          }
        } catch (error) {
          console.error('Error loading language preference:', error);
        }
      }
      setLoading(false);
    };

    loadLanguagePreference();
  }, [user]);

  // Save language preference to profile
  const setLanguage = async (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ language_preference: newLanguage })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
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