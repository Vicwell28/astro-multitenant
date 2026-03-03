/// <reference types="astro/client" />

import type { Tenant, Page } from "./lib/types.ts";

declare namespace App {
  interface Locals {
    tenant: Tenant | null;
    page: Page | null;
  }
}
