import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ClientJS } from "clientjs";
import { languageCode } from "./all";

const client = new ClientJS();
const language = client.getLanguage();

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (cb) => cb(languageCode(language)),
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    resources: {
      kk: {
        translation: require("./locale/kk.json"),
      },
      en: {
        translation: require("./locale/en.json"),
      },
    },
    debug: false,
    keySeparator: false,
    load: "all",
    preload: ["kk", "en"],
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
