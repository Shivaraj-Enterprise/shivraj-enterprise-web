/**
 * Automated sitemap coverage check.
 *
 * Compares the <Route path="..."> entries in src/App.tsx against the
 * <loc> entries in public/sitemap.xml and flags any PUBLIC route that
 * is missing from the sitemap.
 *
 * Routes are considered non-indexable and skipped when they:
 *   - are the catch-all "*"
 *   - contain a dynamic segment (":param")
 *   - start with an EXCLUDED_PREFIX (admin, internal, etc.)
 *
 * Exit code 1 on missing routes so this can gate CI.
 *
 * Run:  bunx tsx scripts/check-sitemap.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const EXCLUDED_PREFIXES = ["/admin"];
const APP_FILE = resolve("src/App.tsx");
const SITEMAP_FILE = resolve("public/sitemap.xml");

function extractRoutes(source: string): string[] {
  const re = /<Route\s+[^>]*path=["']([^"']+)["']/g;
  const paths = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) paths.add(m[1]);
  return [...paths];
}

function isIndexable(path: string): boolean {
  if (path === "*" || path.includes(":")) return false;
  return !EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

function extractSitemapPaths(xml: string): string[] {
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  const paths = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    try {
      const u = new URL(m[1]);
      paths.add(u.pathname.replace(/\/$/, "") || "/");
    } catch {
      paths.add(m[1]);
    }
  }
  return [...paths];
}

const appSource = readFileSync(APP_FILE, "utf8");
const sitemapSource = readFileSync(SITEMAP_FILE, "utf8");

const allRoutes = extractRoutes(appSource);
const publicRoutes = allRoutes.filter(isIndexable);
const sitemapPaths = new Set(extractSitemapPaths(sitemapSource));

const missing = publicRoutes.filter((p) => {
  const norm = p.replace(/\/$/, "") || "/";
  return !sitemapPaths.has(norm);
});
const excluded = allRoutes.filter((p) => !isIndexable(p) && p !== "*");

console.log(`Routes discovered:  ${allRoutes.length}`);
console.log(`Public/indexable:   ${publicRoutes.length}`);
console.log(`Sitemap entries:    ${sitemapPaths.size}`);
console.log(`Excluded (dynamic/admin): ${excluded.length}`);
if (excluded.length) console.log(`  ${excluded.join(", ")}`);

if (missing.length) {
  console.error("\n❌ Missing public routes in sitemap.xml:");
  for (const p of missing) console.error(`   - ${p}`);
  console.error("\nAdd these to public/sitemap.xml (or the sitemap generator).");
  process.exit(1);
}

console.log("\n✅ Sitemap covers every public route.");
