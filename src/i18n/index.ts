import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import de from './locales/de.json'
import fa from './locales/fa.json'

export const supportedLanguages = [
  { code: 'en', label: 'English', dir: 'ltr' as const },
  { code: 'de', label: 'Deutsch', dir: 'ltr' as const },
  { code: 'fa', label: 'فارسی', dir: 'rtl' as const },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fa: { translation: fa },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages.map((language) => language.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'taskpilot-language',
    },
  })

function applyDocumentLanguage(language: string) {
  const matched =
    supportedLanguages.find((item) => item.code === language) ??
    supportedLanguages[0]

  document.documentElement.lang = matched.code
  document.documentElement.dir = matched.dir
}

i18n.on('languageChanged', applyDocumentLanguage)
applyDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)

export default i18n
