"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import { detectUserLanguage, type Language } from "./detect-language";

export type { Language };

export interface LanguageMeta {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: ReadonlyArray<LanguageMeta> = [
  { code: "es", name: "Español", flag: "ES" },
  { code: "en", name: "English", flag: "GB" },
  { code: "pt", name: "Português", flag: "BR" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "it", name: "Italiano", flag: "IT" },
];

const translations: Record<Language, any> = { es, en, pt, de, fr, it };

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>("es");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initLanguage() {
      const detected = await detectUserLanguage();
      setLangState(detected);
      setIsReady(true);
    }
    initLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("powerchat.lang", lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current = translations[language];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to Spanish if translation is missing
        let fallback = translations["es"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // return key if both fail
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
