/**
 * Section Resolver
 * Maps templateId + sectionType → import path for the Astro component.
 * Falls back to generic components when a template-specific one doesn't exist.
 */

export type TemplateId = "default" | "premium" | "minimal" | "legal" | string;
import type { SectionType } from "./types.ts";

/** Returns the import path for a section component given template + type. */
export function resolveSectionPath(templateId: TemplateId, sectionType: SectionType): string {
  const templateOverrides: Record<string, Record<string, string>> = {
    default: {
      hero: "../../templates/default/sections/HeroSection.astro",
      services: "../../templates/default/sections/ServicesSection.astro",
      footer: "../../templates/default/sections/FooterSection.astro",
    },
    premium: {
      hero: "../../templates/premium/sections/HeroSection.astro",
      about: "../../templates/premium/sections/AboutSection.astro",
      footer: "../../templates/premium/sections/FooterSection.astro",
    },
    minimal: {
      hero: "../../templates/minimal/sections/HeroSection.astro",
      footer: "../../templates/minimal/sections/FooterSection.astro",
    },
    legal: {
      hero: "../../templates/legal/sections/HeroSection.astro",
      services: "../../templates/legal/sections/ServicesSection.astro",
      team: "../../templates/legal/sections/TeamSection.astro",
      testimonials: "../../templates/legal/sections/TestimonialsSection.astro",
      footer: "../../templates/legal/sections/FooterSection.astro",
    },
  };

  return templateOverrides[templateId]?.[sectionType] ?? genericPath(sectionType);
}

function genericPath(sectionType: SectionType): string {
  const map: Record<SectionType, string> = {
    hero: "../../components/sections/HeroSection.astro",
    about: "../../components/sections/AboutSection.astro",
    services: "../../components/sections/ServicesSection.astro",
    team: "../../components/sections/TeamSection.astro",
    testimonials: "../../components/sections/TestimonialsSection.astro",
    gallery: "../../components/sections/GallerySection.astro",
    "contact-form": "../../components/sections/ContactFormSection.astro",
    "cta-banner": "../../components/sections/CtaBannerSection.astro",
    faq: "../../components/sections/FaqSection.astro",
    pricing: "../../components/sections/PricingSection.astro",
    stats: "../../components/sections/StatsSection.astro",
    footer: "../../components/sections/FooterSection.astro",
  };
  return map[sectionType];
}
