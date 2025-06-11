'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang: 'en' | 'ru' | 'es') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {language === 'en' ? t('language.english') : language === 'ru' ? t('language.russian') : t('language.spanish')}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => changeLanguage('en')}
              className={`${
                language === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              role="menuitem"
            >
              {t('language.english')}
            </button>
            <button
              onClick={() => changeLanguage('ru')}
              className={`${
                language === 'ru' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              role="menuitem"
            >
              {t('language.russian')}
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`${
                language === 'es' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              role="menuitem"
            >
              {t('language.spanish')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
