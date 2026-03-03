import type { APIRoute } from "astro";
import { updatePage } from "../../../../lib/data-store.ts";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "../../../../lib/types.ts";

function getPageById(pageId: string): Page | null {
  const pages = JSON.parse(readFileSync(resolve(process.cwd(), "data/pages.json"), "utf-8")) as Page[];
  return pages.find((p) => p.id === pageId) ?? null;
}

export const GET: APIRoute = ({ params }) => {
  const page = getPageById(params.pageId!);
  if (!page) {
    return new Response(JSON.stringify({ error: "Página no encontrada" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(page), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json() as Partial<Page>;
  const updated = updatePage(params.pageId!, body);
  if (!updated) {
    return new Response(JSON.stringify({ error: "Página no encontrada" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
};
