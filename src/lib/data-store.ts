import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Tenant, Page, Section } from "./types.ts";
import { tenantCache } from "./cache.ts";
import { MemoryCache } from "./cache.ts";

const pageCache = new MemoryCache<Page[]>(300);
const DATA_DIR = resolve(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const content = readFileSync(resolve(DATA_DIR, filename), "utf-8");
  return JSON.parse(content) as T;
}

function writeJson<T>(filename: string, data: T): void {
  writeFileSync(resolve(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

export function getAllTenants(): Tenant[] {
  return readJson<Tenant[]>("tenants.json");
}

export function getTenantBySubdomain(subdomain: string): Tenant | null {
  const cached = tenantCache.get(subdomain);
  if (cached) return cached;

  const tenants = getAllTenants();
  const tenant = tenants.find((t) => t.subdomain === subdomain) ?? null;
  if (tenant) tenantCache.set(subdomain, tenant);
  return tenant;
}

export function getPagesByTenantId(tenantId: string): Page[] {
  const cached = pageCache.get(tenantId);
  if (cached) return cached;

  const pages = readJson<Page[]>("pages.json");
  const result = pages.filter((p) => p.tenantId === tenantId);
  pageCache.set(tenantId, result);
  return result;
}

export function getPageBySlug(tenantId: string, slug: string): Page | null {
  const pages = getPagesByTenantId(tenantId);
  return pages.find((p) => p.slug === slug) ?? null;
}

export function updatePage(pageId: string, updates: Partial<Page>): Page | null {
  const pages = readJson<Page[]>("pages.json");
  const index = pages.findIndex((p) => p.id === pageId);
  if (index === -1) return null;

  pages[index] = { ...pages[index], ...updates, updatedAt: new Date().toISOString() };
  writeJson("pages.json", pages);

  // Invalidate page cache for this tenant
  pageCache.invalidate(pages[index].tenantId);
  return pages[index];
}

export function updateSection(pageId: string, sectionId: string, content: Section["content"]): Section | null {
  const pages = readJson<Page[]>("pages.json");
  const pageIndex = pages.findIndex((p) => p.id === pageId);
  if (pageIndex === -1) return null;

  const sectionIndex = pages[pageIndex].sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) return null;

  pages[pageIndex].sections[sectionIndex] = {
    ...pages[pageIndex].sections[sectionIndex],
    content,
  };
  pages[pageIndex].updatedAt = new Date().toISOString();
  writeJson("pages.json", pages);

  pageCache.invalidate(pages[pageIndex].tenantId);
  return pages[pageIndex].sections[sectionIndex];
}

export function invalidateTenantCache(subdomain?: string): void {
  if (subdomain) {
    tenantCache.invalidate(subdomain);
  } else {
    tenantCache.invalidateAll();
    pageCache.invalidateAll();
  }
}
