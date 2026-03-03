import type { APIRoute } from "astro";
import { getAllTenants } from "../../../lib/data-store.ts";

export const GET: APIRoute = () => {
  const tenants = getAllTenants();
  return new Response(JSON.stringify(tenants), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
