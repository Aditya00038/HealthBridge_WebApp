import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    hi: 'हिंदी',
    mr: 'मराठी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    bn: 'বাংলা',
    gu: 'ગુજરાતી',
    pa: 'ਪੰਜਾਬੀ'
  };

  const languageFlags = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    hi: '🇮🇳',
    mr: '🇮🇳',
    ta: '🇮🇳',
    te: '🇮🇳',
    bn: '🇮🇳',
    gu: '🇮🇳',
    pa: '🇮🇳'
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:block">
          {languageFlags[currentLanguage]} {languageNames[currentLanguage]}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-2">
            {availableLanguages.map((langCode) => (
              <Menu.Item key={langCode}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(langCode)}
                    className={`${
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    } ${
                      currentLanguage === langCode ? 'bg-blue-100 text-blue-800' : ''
                    } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors`}
                  >
                    <span className="text-lg">{languageFlags[langCode]}</span>
                    <span className="font-medium">{languageNames[langCode]}</span>
                    {currentLanguage === langCode && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;