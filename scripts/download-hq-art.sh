#!/bin/bash
# Download higher-quality AVIF artwork from daggerheart.su
# Domain cards, ancestries, and communities

set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN_DIR="$BASE_DIR/public/images/cards/domains"
ANCESTRY_DIR="$BASE_DIR/public/images/cards/ancestries"
COMMUNITY_DIR="$BASE_DIR/public/images/cards/communities"

DOMAIN_URL="https://daggerheart.su/image/domain/card/small"
ANCESTRY_URL="https://daggerheart.su/image/ancestry/card/small"
COMMUNITY_URL="https://daggerheart.su/image/community/card/small"

TOTAL=0
SUCCESS=0
FAIL=0

download() {
  local url="$1"
  local dest="$2"
  local name
  name=$(basename "$dest")

  if curl -fsSL --max-time 15 -o "$dest" "$url" 2>/dev/null; then
    SUCCESS=$((SUCCESS + 1))
    printf "  ✓ %s\n" "$name"
  else
    FAIL=$((FAIL + 1))
    printf "  ✗ %s\n" "$name"
    rm -f "$dest"  # clean up partial downloads
  fi
  TOTAL=$((TOTAL + 1))
}

# --- Domain Cards (webp → avif) ---
echo "=== Domain Cards ==="
for webp in "$DOMAIN_DIR"/*.webp; do
  stem=$(basename "$webp" .webp)
  dest="$DOMAIN_DIR/$stem.avif"
  # Skip if avif already exists and is non-empty
  if [ -s "$dest" ]; then
    printf "  – %s.avif (exists, skipping)\n" "$stem"
    continue
  fi
  download "$DOMAIN_URL/$stem.avif" "$dest"
done

# --- Ancestries (replace existing avif with higher-res) ---
echo ""
echo "=== Ancestries ==="
for avif in "$ANCESTRY_DIR"/*.avif; do
  stem=$(basename "$avif" .avif)
  # Download to a temp file, then replace if successful
  tmp="$ANCESTRY_DIR/$stem.avif.tmp"
  if curl -fsSL --max-time 15 -o "$tmp" "$ANCESTRY_URL/$stem.avif" 2>/dev/null; then
    mv "$tmp" "$avif"
    SUCCESS=$((SUCCESS + 1))
    printf "  ✓ %s.avif (upgraded)\n" "$stem"
  else
    FAIL=$((FAIL + 1))
    printf "  ✗ %s.avif\n" "$stem"
    rm -f "$tmp"
  fi
  TOTAL=$((TOTAL + 1))
done

# --- Communities (replace existing avif with higher-res) ---
echo ""
echo "=== Communities ==="
for avif in "$COMMUNITY_DIR"/*.avif; do
  stem=$(basename "$avif" .avif)
  tmp="$COMMUNITY_DIR/$stem.avif.tmp"
  if curl -fsSL --max-time 15 -o "$tmp" "$COMMUNITY_URL/$stem.avif" 2>/dev/null; then
    mv "$tmp" "$avif"
    SUCCESS=$((SUCCESS + 1))
    printf "  ✓ %s.avif (upgraded)\n" "$stem"
  else
    FAIL=$((FAIL + 1))
    printf "  ✗ %s.avif\n" "$stem"
    rm -f "$tmp"
  fi
  TOTAL=$((TOTAL + 1))
done

echo ""
echo "=== Done ==="
echo "Total: $TOTAL | Success: $SUCCESS | Failed: $FAIL"
