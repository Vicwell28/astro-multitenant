import type { APIRoute } from "astro";
import { updateSection } from "../../../../../lib/data-store.ts";
import type { SectionContent } from "../../../../../lib/types.ts";

export const PATCH: APIRoute = async ({ params, request }) => {
  const body = await request.json() as { content: SectionContent };
  const updated = updateSection(params.pageId!, params.sectionId!, body.content);
  if (!updated) {
    return new Response(JSON.stringify({ error: "Sección no encontrada" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
