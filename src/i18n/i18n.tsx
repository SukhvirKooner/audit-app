import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './english.json';
import hi from './hindi.json';

// Import translation files
const resources = {
  en: en,
  hi: hi,
};

i18n.use(initReactI18next).init({
  // compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
