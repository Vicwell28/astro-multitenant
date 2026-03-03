import type { APIRoute } from "astro";
import { invalidateTenantCache } from "../../../lib/tenant.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const adminApiKey = import.meta.env.ADMIN_API_KEY;

  // Validate Bearer token
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!adminApiKey || token !== adminApiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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
        ? `Cache invalidated for "${subdomain}"`
        : "All tenant cache invalidated",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
