'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const changeLanguage = (lang: 'en' | 'ru' | 'es') => {
    setLanguage(lang);
  };

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {language === 'en' ? t('language.english') : language === 'ru' ? t('language.russian') : t('language.spanish')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLanguage('en')}>
              {t('language.english')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('ru')}>
              {t('language.russian')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('es')}>
              {t('language.spanish')}
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
