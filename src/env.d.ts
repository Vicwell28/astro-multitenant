/// <reference types="astro/client" />

import type { TenantConfig } from "./lib/types.ts";

declare namespace App {
  interface Locals {
    tenant: TenantConfig | null;
  }
}
