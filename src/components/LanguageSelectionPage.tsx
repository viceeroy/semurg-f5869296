import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface LanguageSelectionPageProps {
  onLanguageSelected: (language: 'en' | 'uz') => void;
}

const LanguageSelectionPage = ({ onLanguageSelected }: LanguageSelectionPageProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'uz' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const languages = [
    {
      code: 'en' as const,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'Use English for the app interface and AI responses'
    },
    {
      code: 'uz' as const,
      name: 'Uzbek',
      nativeName: 'O\'zbek tili',
      flag: '🇺🇿',
      description: 'Ilova interfeysi va AI javoblari uchun o\'zbek tilini ishlatish'
    }
  ];

  const handleLanguageSelect = (languageCode: 'en' | 'uz') => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = async () => {
    if (!selectedLanguage || !user) return;

    setIsLoading(true);
    try {
      // Convert language code to the format stored in database
      const dbLanguage = selectedLanguage === 'uz' ? 'uzbek' : 'english';
      
      // Update user's language preference in the database
      const { error } = await supabase
        .from('profiles')
        .update({ language_preference: dbLanguage })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating language preference:', error);
        toast.error('Failed to save language preference');
        return;
      }

      // Call the callback to update the app language
      onLanguageSelected(selectedLanguage);
      toast.success(selectedLanguage === 'uz' ? 'Til muvaffaqiyatli saqlandi!' : 'Language saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language</h1>
          <p className="text-gray-600">Tilingizni tanlang</p>
          <p className="text-sm text-gray-500 mt-2">Select your preferred language for the app interface and AI responses</p>
        </div>

        {/* Language Options */}
        <div className="space-y-4 mb-8">
          {languages.map((language) => (
            <Card
              key={language.code}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedLanguage === language.code
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{language.flag}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{language.name}</h3>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{language.nativeName}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{language.description}</p>
                </div>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedLanguage || isLoading}
          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{selectedLanguage === 'uz' ? 'Saqlanmoqda...' : 'Saving...'}</span>
            </div>
          ) : (
            selectedLanguage === 'uz' ? 'Davom etish' : 'Continue'
          )}
        </Button>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={() => onLanguageSelected('en')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now (English will be used)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionPage;