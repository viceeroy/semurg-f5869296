import { useState } from "react";
import { ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇺🇸', shortLabel: 'ENG' },
    { code: 'uz' as const, label: 'O\'zbekcha', flag: '🇺🇿', shortLabel: 'UZ' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8 px-3">
          <Languages className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLanguage.shortLabel}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px] bg-white border border-gray-200 shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
              language === lang.code ? 'bg-emerald-50 text-emerald-700' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.label}</span>
            {language === lang.code && (
              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;