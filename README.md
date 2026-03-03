# Astro Multi-Tenant SSR

Proyecto completo de sitio web multi-tenant con Astro 5.x, 100% SSR, Tailwind CSS 4.x, TypeScript estricto y **arquitectura de secciones dinámicas** con persistencia local en JSON.

## ¿Qué es este proyecto?

Un sistema donde una sola aplicación Astro sirve múltiples sitios web ("tenants") con diseños y contenidos completamente distintos. Cada página se compone de **secciones ordenadas** (hero, services, team, etc.) que se resuelven dinámicamente según el template del tenant.

Cada tenant se identifica por su subdominio (producción) o por el query param `?tenant=` (desarrollo local).

## Instalación y uso

```bash
npm install && npm run dev
```

La aplicación estará disponible en `http://localhost:4321`.

## Probar los 4 tenants en local

Abre el navegador en:

| Tenant    | URL de prueba                          | Plantilla | Descripción                       |
|-----------|----------------------------------------|-----------|-----------------------------------|
| cliente1  | http://localhost:4321/?tenant=cliente1 | default   | Azul moderno con servicios y stats |
| cliente2  | http://localhost:4321/?tenant=cliente2 | premium   | Violeta elegante con about         |
| cliente3  | http://localhost:4321/?tenant=cliente3 | minimal   | Blanco y negro ultra limpio        |
| bufetemx  | http://localhost:4321/?tenant=bufetemx | legal     | Azul oscuro con oro, bufete legal  |

### Página adicional de bufetemx

| URL                                          | Descripción        |
|----------------------------------------------|--------------------|
| http://localhost:4321/about?tenant=bufetemx  | Página "Nosotros"  |

## Arquitectura

```
Request → Middleware → Extrae subdominio → Carga tenant desde data/tenants.json
       → Carga página por slug desde data/pages.json → Inyecta en locals
       → [...slug].astro → Filtra secciones visibles → Section Resolver
       → Renderiza cada sección con el componente correcto (template o genérico)
       → HTML puro con SEO completo
```

### Section Resolver

El `section-resolver.ts` mapea `templateId + sectionType → componente Astro`:

```
templateId: "legal", sectionType: "services"
  → templates/legal/sections/ServicesSection.astro  (específico)
  
templateId: "legal", sectionType: "faq"
  → components/sections/FaqSection.astro  (genérico, fallback)
```

## Estructura de carpetas

```
├── data/
│   ├── tenants.json              # 4 tenants con configuración y theme
│   └── pages.json                # 5 páginas con secciones completas
├── src/
│   ├── env.d.ts                  # App.Locals: { tenant, page }
│   ├── middleware/index.ts       # Extrae tenant+página, cache headers
│   ├── lib/
│   │   ├── types.ts              # Tenant, Page, Section, SectionType, contenidos
│   │   ├── cache.ts              # MemoryCache<T> con TTL (300s)
│   │   ├── data-store.ts         # Lectura/escritura JSON + cache
│   │   └── section-resolver.ts  # Mapeo templateId+type → import path
│   ├── layouts/BaseLayout.astro  # SEO: title, meta, OG, Twitter, JSON-LD, favicon
│   ├── styles/global.css         # @import "tailwindcss"
│   ├── components/sections/      # 12 componentes genéricos (fallback)
│   │   ├── HeroSection.astro
│   │   ├── AboutSection.astro
│   │   ├── ServicesSection.astro
│   │   ├── TeamSection.astro
│   │   ├── TestimonialsSection.astro
│   │   ├── GallerySection.astro
│   │   ├── ContactFormSection.astro
│   │   ├── CtaBannerSection.astro
│   │   ├── FaqSection.astro
│   │   ├── PricingSection.astro
│   │   ├── StatsSection.astro
│   │   └── FooterSection.astro
│   ├── templates/
│   │   ├── default/sections/     # Hero (gradiente azul), Services (cards), Footer
│   │   ├── premium/sections/     # Hero (púrpura con blobs), About, Footer
│   │   ├── minimal/sections/     # Hero (b&w tipográfico), Footer (una línea)
│   │   └── legal/sections/       # Hero (azul oscuro+oro), Services, Team, Testimonials, Footer
│   └── pages/
│       ├── [...slug].astro       # Catch-all con section-resolver
│       └── api/
│           ├── tenants/index.ts
│           ├── pages/[pageId]/
│           │   ├── index.ts                      # GET + PUT
│           │   └── sections/[sectionId].ts       # PATCH
│           └── cache/invalidate.ts               # POST
```

## Modelo de datos

### Tenant (data/tenants.json)

```typescript
interface Tenant {
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
  metadata: { title: string; description: string; ogImage?: string; keywords?: string[] };
  createdAt: string;
  updatedAt: string;
}
```

### Page (data/pages.json)

```typescript
interface Page {
  id: string;
  tenantId: string;
  templateId: string;
  slug: string;      // "" para inicio, "about" para /about
  title: string;
  isPublished: boolean;
  sections: Section[];
  metadata: { title: string; description: string; ogImage?: string };
}

interface Section {
  id: string;
  type: SectionType;  // "hero" | "services" | "team" | ...
  order: number;
  visible: boolean;
  content: SectionContent;
}
```

### Tipos de sección soportados

`hero` · `about` · `services` · `team` · `testimonials` · `gallery` · `contact-form` · `cta-banner` · `faq` · `pricing` · `stats` · `footer`

## API Endpoints

### GET /api/tenants
Devuelve todos los tenants de `data/tenants.json`.

```bash
curl http://localhost:4321/api/tenants
```

### GET /api/pages/:pageId
Devuelve una página con todas sus secciones.

```bash
curl http://localhost:4321/api/pages/page-1
```

### PUT /api/pages/:pageId
Actualiza una página completa. Escribe en `data/pages.json`.

```bash
curl -X PUT http://localhost:4321/api/pages/page-1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva página"}'
```

### PATCH /api/pages/:pageId/sections/:sectionId
Actualiza el contenido de una sección específica.

```bash
curl -X PATCH http://localhost:4321/api/pages/page-1/sections/sec-1-1 \
  -H "Content-Type: application/json" \
  -d '{"content":{"heading":"Nuevo título","subheading":"Nuevo subtítulo","ctaText":"CTA","ctaUrl":"#"}}'
```

### POST /api/cache/invalidate
Invalida el cache de un tenant específico o todo el cache.

```bash
# Invalidar un tenant
curl -X POST http://localhost:4321/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{"subdomain": "cliente1"}'

# Invalidar todo
curl -X POST http://localhost:4321/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Agregar un nuevo tenant

1. Agrega el tenant a `data/tenants.json`:
```json
{
  "id": "tenant-5",
  "subdomain": "micliente",
  "name": "Mi Cliente",
  "status": "active",
  "theme": { "primaryColor": "#...", "secondaryColor": "#...", "accentColor": "#..." },
  "metadata": { "title": "Mi Cliente", "description": "..." },
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

2. Agrega su página a `data/pages.json` con las secciones deseadas.
3. Prueba en `http://localhost:4321/?tenant=micliente`.

## Agregar un nuevo template

1. Crea `src/templates/mi-template/sections/` con los componentes que quieras sobrescribir.
2. Agrega el mapeo en `[...slug].astro` en el `componentMap`.
3. Registra los tenants que usarán `templateId: "mi-template"`.

## Notas para producción

- **Persistencia**: Los archivos `data/tenants.json` y `data/pages.json` actúan como base de datos local. En producción, reemplaza `data-store.ts` con consultas a una BD real.
- **Cache distribuido**: Reemplaza `MemoryCache` por Redis para entornos multi-instancia.
- **CDN**: Los headers `Cache-Control: s-maxage=60, stale-while-revalidate=300` y `Vary: Host` permiten cacheo por subdominio en Cloudflare/Fastly.
- **Subdominios**: Configura un wildcard DNS `*.tudominio.com → tu servidor`.

## Stack tecnológico

- **Astro 5.x** – SSR mode (`output: "server"`)
- **@astrojs/node** – Adapter standalone
- **Tailwind CSS 4.x** – Vía `@tailwindcss/vite` plugin
- **TypeScript** – Configuración estricta (`astro/tsconfigs/strict`)
- **vite** – En devDependencies explícitamente (requerido para resolución de módulos)

