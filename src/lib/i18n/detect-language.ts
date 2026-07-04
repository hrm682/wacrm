export type Language = "es" | "en" | "pt" | "de" | "fr" | "it";

export async function detectUserLanguage(): Promise<Language> {
  // 1. Check local storage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("powerchat.lang");
    if (saved && ["es", "en", "pt", "de", "fr", "it"].includes(saved)) {
      return saved as Language;
    }
  }

  // 2. IP detection via ipapi.co
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      const country = data.country_code?.toUpperCase();

      // Mapping countries to language
      const spanishCountries = [
        "EC", "CO", "MX", "AR", "PE", "CL", "VE", "ES", "UY", "PY", "BO",
        "HN", "GT", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "GQ"
      ];
      const PortugueseCountries = ["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"];
      const GermanCountries = ["DE", "AT", "CH", "LI"];
      const FrenchCountries = ["FR", "BE", "CA", "MC", "LU", "CH"];
      const ItalianCountries = ["IT", "CH", "SM", "VA"];

      if (spanishCountries.includes(country)) return "es";
      if (PortugueseCountries.includes(country)) return "pt";
      if (GermanCountries.includes(country)) return "de";
      if (FrenchCountries.includes(country)) return "fr";
      if (ItalianCountries.includes(country)) return "it";
      return "en";
    }
  } catch (err) {
    console.warn("IP-based language detection failed:", err);
  }

  // 3. Fallback: Browser language settings
  if (typeof navigator !== "undefined") {
    const navLang = navigator.language?.split("-")[0];
    if (["es", "en", "pt", "de", "fr", "it"].includes(navLang)) {
      return navLang as Language;
    }
  }

  // 4. Default to Spanish
  return "es";
}
