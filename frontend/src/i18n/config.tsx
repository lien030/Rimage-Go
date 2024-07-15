import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tranZh from "./zh.json";
import tranEn from "./en.json";
import tranJa from "./ja.json";


const i18nResources = {
  zh: {
    translation: tranZh,
  },
  en: {
    translation: tranEn,
  },
  ja: {
    translation: tranJa,
  },
};

i18n.use(initReactI18next).init({
  resources: i18nResources,
  lng: localStorage.getItem("language") || "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;