# Astro Multi-Tenant SSR

Proyecto completo de sitio web multi-tenant con Astro 5.x, 100% SSR, Tailwind CSS 4.x y TypeScript estricto.

## ¿Qué es este proyecto?

Un sistema donde una sola aplicación Astro sirve múltiples sitios web ("tenants") con diseños y contenidos completamente distintos. Cada tenant se identifica por su subdominio (producción) o por el query param `?tenant=` (desarrollo local).

### Arquitectura

```
Request → Middleware → Extrae subdominio → Busca tenant en cache/DB
       → Resuelve templateId → Renderiza plantilla con datos del tenant
       → Devuelve HTML puro (0 JS) optimizado para SEO
```

## Instalación y uso

```bash
npm install
npm run dev
```

## Probar los 4 tenants en local

Abre el navegador en:

| Tenant       | URL de prueba                                  | Plantilla |
|-------------|------------------------------------------------|-----------|
| cliente1    | http://localhost:4321/?tenant=cliente1         | default   |
| cliente2    | http://localhost:4321/?tenant=cliente2         | premium   |
| cliente3    | http://localhost:4321/?tenant=cliente3         | minimal   |
| bufetemx    | http://localhost:4321/?tenant=bufetemx         | legal     |

## Estructura de carpetas

```
src/
├── env.d.ts                    # Tipos de App.Locals
├── middleware/index.ts         # Extrae tenant, inyecta en locals, headers de cache
├── lib/
│   ├── types.ts                # Interface TenantConfig
│   ├── cache.ts                # MemoryCache con TTL
│   └── tenant.ts               # getTenantBySubdomain + mock data
├── layouts/BaseLayout.astro    # SEO completo: OG, Twitter Card, JSON-LD
├── styles/global.css           # @import "tailwindcss"
├── templates/
│   ├── default/                # Plantilla genérica azul
│   ├── premium/                # Plantilla premium violeta
│   ├── minimal/                # Plantilla minimalista negra
│   └── legal/                  # Plantilla para bufetes jurídicos
└── pages/
    ├── [...slug].astro         # Catch-all → selecciona template según tenant
    └── api/cache/invalidate.ts # POST para invalidar cache
```

## Flujo de una request

1. Request llega a `cliente1.tudominio.com` (o `localhost:4321/?tenant=cliente1`)
2. `src/middleware/index.ts` extrae el subdominio del `Host` header (o del query param en dev)
3. `getTenantBySubdomain()` busca en `MemoryCache` → si miss, consulta la "DB" (mock en dev)
4. El tenant se inyecta en `Astro.locals.tenant`
5. `src/pages/[...slug].astro` resuelve la plantilla según `tenant.templateId`
6. Se renderiza la plantilla con los datos del tenant (HTML puro, 0 JS)
7. El middleware agrega headers `Cache-Control` y `Vary: Host`

## Casos de uso

### Caso A – Cliente con plantilla genérica
Solo requiere un registro en la base de datos con el `subdomain`, `templateId`, colores y contenido. No es necesario hacer deploy de nuevo código.

### Caso B – Cliente con plantilla personalizada
Requiere:
1. Crear una nueva carpeta `src/templates/mi-plantilla/`
2. Registrar el `templateId` en `TEMPLATE_MAP` en `[...slug].astro`
3. Hacer un deploy de la aplicación
4. Registrar el tenant en la DB

## Invalidar cache

```bash
curl -X POST http://localhost:4321/api/cache/invalidate \
  -H "Authorization: Bearer TU_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"subdomain": "cliente1"}'
```

Para invalidar todo el cache, omite `subdomain` del body:

```bash
curl -X POST http://localhost:4321/api/cache/invalidate \
  -H "Authorization: Bearer TU_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Define `ADMIN_API_KEY` en tu archivo `.env`:

```
ADMIN_API_KEY=mi-clave-secreta
```

## Notas para producción

- **Base de datos**: Reemplaza el mock en `src/lib/tenant.ts` con una consulta real a Cosmos DB u otra API
- **Cache distribuido**: Reemplaza `MemoryCache` por Redis para entornos con múltiples instancias
- **CDN**: Con los headers `Cache-Control: s-maxage=60, stale-while-revalidate=300` y `Vary: Host`, un CDN (Cloudflare, Fastly) puede cachear las páginas por subdominio
- **Subdominios en producción**: Configura un wildcard DNS `*.tudominio.com → tu servidor`

## Stack tecnológico

- **Astro 5.x** – SSR mode (`output: "server"`)
- **@astrojs/node** – Adapter standalone
- **Tailwind CSS 4.x** – Vía `@tailwindcss/vite` plugin
- **TypeScript** – Configuración estricta
