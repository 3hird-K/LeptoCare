// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getSavedLanguage } from '@/utils/languageStore';

import en from './locales/en.json';
import cb from './locales/cb.json';
import fi from './locales/fi.json';

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    resources: {
      en: { translation: en },
      cb: { translation: cb },
      fi: { translation: fi },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  export const setLanguageForUser = async (userId: string) => {
    const savedLang = await getSavedLanguage(userId);
    if (savedLang) {
      await i18n.changeLanguage(savedLang);
    }
  };


export default i18n;