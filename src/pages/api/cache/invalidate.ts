import type { APIRoute } from "astro";
import { invalidateTenantCache } from "../../../lib/data-store.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { subdomain?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { subdomain } = body;
  invalidateTenantCache(subdomain);

  return new Response(
    JSON.stringify({
      ok: true,
      message: subdomain
        ? `Cache invalidado para "${subdomain}"`
        : "Todo el caché invalidado",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
