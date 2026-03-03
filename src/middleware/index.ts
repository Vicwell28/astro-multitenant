import { defineMiddleware } from "astro:middleware";
import { getTenantBySubdomain } from "../lib/tenant.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  // Extract subdomain from Host header, fallback to ?tenant= query param in dev
  let subdomain = url.searchParams.get("tenant") ?? "";

  if (!subdomain) {
    const host = request.headers.get("host") ?? "";
    const hostname = host.split(":")[0]; // remove port
    const parts = hostname.split(".");
    // e.g. cliente1.tudominio.com → parts[0] = "cliente1"
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  context.locals.tenant = subdomain ? await getTenantBySubdomain(subdomain) : null;

  const response = await next();

  // Add cache headers
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  response.headers.set("Vary", "Host");

  return response;
});
