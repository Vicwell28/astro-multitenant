export interface TenantContent {
  hero?: {
    title?: string;
    subtitle?: string;
    cta?: string;
    image?: string;
  };
  about?: {
    title?: string;
    description?: string;
  };
  services?: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  practiceAreas?: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  team?: Array<{
    name: string;
    role: string;
    bio?: string;
    photo?: string;
  }>;
  testimonials?: Array<{
    author: string;
    role?: string;
    text: string;
  }>;
  footer?: {
    text?: string;
    address?: string;
    schedule?: string;
    legal?: string;
  };
  [key: string]: unknown;
}

export interface TenantConfig {
  id: string;
  subdomain: string;
  templateId: "default" | "premium" | "minimal" | "legal" | string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  content: TenantContent;
  customCss?: string;
  metadata: {
    title: string;
    description: string;
    ogImage?: string;
  };
}
