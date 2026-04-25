import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  // Nav
  "nav.home": { en: "Home", ar: "Beit" },
  "nav.products": { en: "What We Offer", ar: "Khidmatna" },
  "nav.apply": { en: "Apply for Loan", ar: "Talab Gurud" },
  "nav.about": { en: "About", ar: "An Aduar" },
  "nav.contact": { en: "Contact", ar: "Itasil Bina" },

  // Hero
  "hero.tag": { en: "Microfinance & Community Development Bank", ar: "Bank al-shaab" },
  "hero.title": {
    en: "Investing in the resilience of South Sudan's Entrepreneurs.",
    ar: "Nestasmir fi sumuud ashab al-mashari'i fi Janub al-Sudan.",
  },
  "hero.subtitle": {
    en: "Collateral-free loans for rural farmers, market women, and small business owners, built on trust, not paperwork.",
    ar: "Gurud bidun damaan le al-mazariin wa nisuwan al-suuk wa ashab al-mashari'i al-saghira — mabniyya ala al-thiqa.",
  },
  "hero.cta1": { en: "Need a Loan?", ar: "Awzin Gurud?" },
  "hero.cta2": { en: "Partner With Us", ar: "Ishtarik Maana" },

  // Differentiators
  "diff.title": { en: "How We Are Different", ar: "Ihna Mukhtalifin" },
  "diff.1.title": { en: "Collateral-Free", ar: "Bidun Damaan" },
  "diff.1.desc": {
    en: "We lend based on character and community trust, no land titles, no bank statements required.",
    ar: "Naqarid asas al-akhlaaq wa al-thiqa — bidun awraaq al-ardh.",
  },
  "diff.2.title": { en: "Focus on Rural Areas", ar: "Turkiz fi al-Aryaaf" },
  "diff.2.desc": {
    en: "Field officers travel to villages where traditional banks won't go, reaching the most vulnerable.",
    ar: "Mawazafiina yamshu fi al-qura le yusliu kul wahid.",
  },
  "diff.3.title": { en: "Community-Driven", ar: "Asas al-Mujtama'" },
  "diff.3.desc": {
    en: "Every loan strengthens local economies. We invest in people, not just transactions.",
    ar: "Kul gurud byibniy al-iqtisaad al-mahalli.",
  },

  // Impact
  "impact.title": { en: "Real Stories. Real Resilience.", ar: "Qisas Haqiqiya" },
  "impact.subtitle": {
    en: "Meet some of the entrepreneurs growing their dreams with Aduar Bank.",
    ar: "Ta'aaraf ala ashab al-mashari'i",
  },

  // Field officers
  "officers.title": { en: "Find Our Field Officers", ar: "Mawazafiina fi al-Maydan" },
  "officers.subtitle": {
    en: "Reach a real person in your region.",
    ar: "Itasil bi insaan haqiqi fi mantiqitak.",
  },

  // Products
  "products.title": { en: "Loan Products Built for You", ar: "Gurud Maamuula Leek" },
  "products.subtitle": {
    en: "Collateral-free loans built around how you really earn. Flexible terms for every market",
    ar: "Shuruut basiita wa as'aar adila.",
  },
  "products.calc.title": { en: "Quick Loan Calculator", ar: "Hasaab al-Gurud" },
  "products.calc.amount": { en: "I want to borrow", ar: "Ana awzin agriid" },
  "products.calc.months": { en: "Pay back over (months)", ar: "Adfaa fi shuhuur" },
  "products.calc.monthly": { en: "Monthly payment", ar: "Daf'a kul shahr" },
  "products.calc.total": { en: "Total to repay", ar: "Al-mablagh al-kulli" },
  "products.calc.note": {
    en: "Estimate only — service fee 2% per month, flat. Final terms set by your field officer.",
    ar: "Taqdiir faqat.",
  },

  // Apply
  "apply.title": { en: "Apply for a Loan", ar: "Talab Gurud" },
  "apply.subtitle": {
    en: "Four short steps. No documents needed today.",
    ar: "Arba'a khutuwaat basiita.",
  },

  // Contact
  "contact.title": { en: "Get in Touch", ar: "Itasil Bina" },
  "contact.subtitle": {
    en: "Questions, partnerships, or media? we'll respond within 2 working days.",
    ar: "Bnaridd fi yumeen amal.",
  },

  // Footer
  "footer.about": {
    en: "Aduar Bank is a microfinance and community development institution serving rural South Sudan with collateral-free loans and grassroots support.",
    ar: "Aduar Bank byikhdim al-shaab fi al-aryaaf.",
  },
  "footer.quick": { en: "Quick Links", ar: "Rawabit Sariia" },
  "footer.connect": { en: "Connect With Us", ar: "Itasil Bina" },
  "footer.built": { en: "Designed & built by", ar: "Tasmiim wa baniya" },
  "footer.rights": { en: "All rights reserved.", ar: "Kul al-huquq mahfuuza." },
  "footer.protection": {
    en: "Unauthorized use of our ideas, branding, or content is prohibited.",
    ar: "",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? (localStorage.getItem("aduar-lang") as Lang | null) : null;
    if (stored === "en" || stored === "ar") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("aduar-lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
