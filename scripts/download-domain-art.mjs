#!/usr/bin/env node
/**
 * Downloads domain card artwork from the Daggerheart card creator CDN.
 * URL pattern: https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains/{domain}/{card-name}.webp
 *
 * Usage: node scripts/download-domain-art.mjs [--dry-run]
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const CDN_BASE =
  "https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images/domains";
const OUT_DIR = "public/images/cards/domains";
const SRD_PATH = "daggerheart-srd-main/.build/json/abilities.json";

const dryRun = process.argv.includes("--dry-run");

function toKebab(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const raw = readFileSync(SRD_PATH, "utf-8").replace(/^\uFEFF/, "");
  const abilities = JSON.parse(raw);

  // Filter to domain cards only (they have a domain field)
  const domainCards = abilities.filter((a) => a.domain);

  mkdirSync(OUT_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const card of domainCards) {
    const domain = toKebab(card.domain);
    const cardName = toKebab(card.name);
    const url = `${CDN_BASE}/${domain}/${cardName}.webp`;
    const outPath = join(OUT_DIR, `${cardName}.webp`);

    // Skip if already exists (any format)
    const existingFormats = [".webp", ".avif", ".png", ".jpg"];
    const alreadyExists = existingFormats.some((ext) =>
      existsSync(join(OUT_DIR, `${cardName}${ext}`))
    );

    if (alreadyExists) {
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] ${url} → ${outPath}`);
      downloaded++;
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`  MISS  ${card.name} (${res.status}) — ${url}`);
        failed++;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(outPath, buf);
      console.log(`  OK    ${card.name} → ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      downloaded++;
    } catch (err) {
      console.log(`  ERR   ${card.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone: ${downloaded} downloaded, ${skipped} skipped (exist), ${failed} failed`
  );
}

main();
