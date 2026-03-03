import { defineMiddleware } from "astro:middleware";
import { getTenantBySubdomain, getPageBySlug } from "../lib/data-store.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  // Extract subdomain from ?tenant= query param (dev) or Host header (prod)
  let subdomain = url.searchParams.get("tenant") ?? "";

  if (!subdomain) {
    const host = request.headers.get("host") ?? "";
    const hostname = host.split(":")[0];
    const parts = hostname.split(".");
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  context.locals.tenant = subdomain ? getTenantBySubdomain(subdomain) : null;

  // Load page by slug if tenant was found
  if (context.locals.tenant) {
    const pathname = url.pathname.replace(/^\//, "");
    // Strip ?tenant= from slug matching
    const slug = pathname === "" ? "" : pathname;
    context.locals.page = getPageBySlug(context.locals.tenant.id, slug);
  } else {
    context.locals.page = null;
  }

  const response = await next();

  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  response.headers.set("Vary", "Host");

  return response;
});
