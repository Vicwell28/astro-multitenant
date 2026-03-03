import type { TenantConfig } from "./types.ts";
import { tenantCache } from "./cache.ts";

const MOCK_TENANTS: TenantConfig[] = [
  {
    id: "1",
    subdomain: "cliente1",
    templateId: "default",
    name: "Cliente Uno S.A.",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    content: {
      hero: {
        title: "Bienvenido a Cliente Uno",
        subtitle: "Soluciones innovadoras para tu negocio",
        cta: "Contáctanos",
      },
      services: [
        { icon: "💼", title: "Consultoría", description: "Asesoría experta para optimizar tu empresa." },
        { icon: "💻", title: "Desarrollo", description: "Soluciones de software a la medida." },
      ],
      footer: { text: "© 2026 Cliente Uno S.A." },
    },
    metadata: {
      title: "Cliente Uno - Inicio",
      description: "Página oficial de Cliente Uno",
    },
  },
  {
    id: "2",
    subdomain: "cliente2",
    templateId: "premium",
    name: "Cliente Premium Corp",
    logo: "/logos/cliente2.svg",
    primaryColor: "#8B5CF6",
    secondaryColor: "#6D28D9",
    content: {
      hero: {
        title: "Cliente Premium Corp",
        subtitle: "Excelencia en cada detalle",
        cta: "Descubre más",
        image: "/images/hero-premium.jpg",
      },
      about: {
        title: "Sobre Nosotros",
        description: "Somos una empresa líder en innovación con más de una década transformando industrias.",
      },
      footer: { text: "© 2026 Cliente Premium Corp" },
    },
    metadata: {
      title: "Premium Corp",
      description: "Excelencia en cada detalle",
    },
  },
  {
    id: "3",
    subdomain: "cliente3",
    templateId: "minimal",
    name: "Minimal Studio",
    primaryColor: "#000000",
    secondaryColor: "#374151",
    content: {
      hero: {
        title: "Minimal Studio",
        subtitle: "Menos es más",
      },
      footer: { text: "© 2026 Minimal Studio" },
    },
    metadata: {
      title: "Minimal Studio",
      description: "Diseño minimalista",
    },
  },
  {
    id: "4",
    subdomain: "bufetemx",
    templateId: "legal",
    name: "Bufete Legal MX",
    logo: "/uploads/bufetemx/logo.svg",
    primaryColor: "#1E3A5F",
    secondaryColor: "#2D5F8B",
    content: {
      hero: {
        title: "Justicia con Experiencia",
        subtitle: "Más de 25 años defendiendo tus derechos con profesionalismo y dedicación",
      },
      about: {
        title: "Sobre el Despacho",
        description: "Fundado en 2001, Bufete Legal MX es un despacho con sólida trayectoria en diversas ramas del derecho mexicano.",
      },
      practiceAreas: [
        { icon: "🏢", title: "Derecho Corporativo", description: "Constitución y asesoría de empresas." },
        { icon: "⚖️", title: "Derecho Laboral", description: "Defensa de trabajadores y empleadores." },
        { icon: "🔒", title: "Derecho Penal", description: "Representación en procesos penales." },
        { icon: "💡", title: "Propiedad Intelectual", description: "Registro y protección de marcas y patentes." },
        { icon: "👨‍👩‍👧", title: "Derecho Familiar", description: "Divorcios, custodia y sucesiones." },
        { icon: "📊", title: "Derecho Fiscal", description: "Planeación y litigios fiscales." },
      ],
      team: [
        { name: "Lic. Roberto García", role: "Socio Fundador", bio: "25 años de experiencia en derecho corporativo y penal." },
        { name: "Lic. María López", role: "Socia", bio: "Especialista en derecho familiar y propiedad intelectual." },
        { name: "Lic. Carlos Mendoza", role: "Asociado Senior", bio: "Experto en derecho fiscal y laboral." },
      ],
      testimonials: [
        { author: "Juan Pérez", role: "Director General, Empresa XYZ", text: "Excelente servicio y resultados excepcionales. Los recomiendo ampliamente." },
        { author: "Ana Martínez", role: "Emprendedora", text: "Gracias a Bufete Legal MX pude proteger mi marca y crecer mi negocio con confianza." },
      ],
      footer: {
        text: "© 2026 Bufete Legal MX - Todos los derechos reservados",
        address: "Av. Reforma 123, Col. Centro, CDMX",
        schedule: "Lun–Vie: 9:00–19:00 | Sáb: 10:00–14:00",
        legal: "Cédula Profesional 1234567",
      },
    },
    metadata: {
      title: "Bufete Legal MX | Abogados de Confianza",
      description: "Despacho de abogados con más de 25 años de experiencia",
    },
  },
];

async function fetchTenantFromDB(subdomain: string): Promise<TenantConfig | null> {
  // In production: query Cosmos DB or backend API
  const tenant = MOCK_TENANTS.find((t) => t.subdomain === subdomain);
  return tenant ?? null;
}

export async function getTenantBySubdomain(subdomain: string): Promise<TenantConfig | null> {
  const cached = tenantCache.get(subdomain);
  if (cached) return cached;

  const tenant = await fetchTenantFromDB(subdomain);
  if (tenant) {
    tenantCache.set(subdomain, tenant);
  }
  return tenant;
}

export function invalidateTenantCache(subdomain?: string): void {
  if (subdomain) {
    tenantCache.invalidate(subdomain);
  } else {
    tenantCache.invalidateAll();
  }
}
