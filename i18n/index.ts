import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Import translations
import enTranslation from "./locales/en.json"
import esTranslation from "./locales/es.json"

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

