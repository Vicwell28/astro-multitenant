// ─── Section Types ────────────────────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "team"
  | "testimonials"
  | "gallery"
  | "contact-form"
  | "cta-banner"
  | "faq"
  | "pricing"
  | "stats"
  | "footer";

// ─── Section Content interfaces ───────────────────────────────────────────────

export interface HeroContent {
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface AboutContent {
  heading: string;
  description: string;
  image?: string;
  imagePosition?: "left" | "right";
}

export interface ServicesContent {
  heading: string;
  subtitle?: string;
  items: Array<{ id: string; icon?: string; title: string; description: string }>;
}

export interface TeamContent {
  heading: string;
  subtitle?: string;
  members: Array<{ id: string; name: string; role: string; image?: string; bio?: string }>;
}

export interface TestimonialsContent {
  heading: string;
  items: Array<{ id: string; quote: string; author: string; role?: string; avatar?: string; rating?: number }>;
}

export interface GalleryContent {
  heading: string;
  images: Array<{ id: string; url: string; alt: string; caption?: string }>;
}

export interface ContactFormContent {
  heading: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  fields?: Array<{ id: string; label: string; type: string; required: boolean }>;
}

export interface CtaBannerContent {
  heading: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor?: string;
}

export interface FaqContent {
  heading: string;
  items: Array<{ id: string; question: string; answer: string }>;
}

export interface PricingContent {
  heading: string;
  subtitle?: string;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    period?: string;
    features: string[];
    ctaText: string;
    ctaUrl: string;
    highlighted?: boolean;
  }>;
}

export interface StatsContent {
  heading?: string;
  items: Array<{ id: string; value: string; label: string; icon?: string }>;
}

export interface FooterContent {
  text?: string;
  columns?: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export type SectionContent =
  | HeroContent
  | AboutContent
  | ServicesContent
  | TeamContent
  | TestimonialsContent
  | GalleryContent
  | ContactFormContent
  | CtaBannerContent
  | FaqContent
  | PricingContent
  | StatsContent
  | FooterContent;

// ─── Section ─────────────────────────────────────────────────────────────────

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  content: SectionContent;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export interface Page {
  id: string;
  tenantId: string;
  templateId: string;
  slug: string;
  title: string;
  isPublished: boolean;
  sections: Section[];
  metadata: { title: string; description: string; ogImage?: string };
  createdAt: string;
  updatedAt: string;
}

// ─── Tenant ───────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  logo?: string;
  favicon?: string;
  status: "active" | "inactive";
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading?: string;
    fontBody?: string;
    borderRadius?: string;
    customCss?: string;
  };
  metadata: {
    title: string;
    description: string;
    ogImage?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Legacy aliases (kept for backward compatibility) ────────────────────────

/** @deprecated Use Tenant instead */
export type TenantConfig = Tenant;

/** @deprecated Use SectionContent instead */
export type TenantContent = Record<string, unknown>;

