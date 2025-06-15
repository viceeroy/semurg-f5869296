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

  // Fetch user's language preference
  useEffect(() => {
    const fetchLanguagePreference = async () => {
      if (!user?.id) {
        // Default to Uzbek for non-authenticated users
        setLanguageState('uz');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setLanguageState(data.language_preference === 'uzbek' ? 'uz' : 'en');
        } else {
          // Default to Uzbek if no preference found
          setLanguageState('uz');
        }
      } catch (error) {
        console.log('Error fetching language preference:', error);
        // Default to Uzbek on error
        setLanguageState('uz');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguagePreference();
  }, [user?.id]);

  // Update language preference in database
  const setLanguage = async (newLanguage: LanguageCode) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language_preference: newLanguage === 'uz' ? 'uzbek' : 'english',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (!error) {
        setLanguageState(newLanguage);
      }
    } catch (error) {
      console.error('Error updating language preference:', error);
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