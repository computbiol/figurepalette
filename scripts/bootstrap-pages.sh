#!/usr/bin/env bash
# scripts/bootstrap-pages.sh
# --------------------------------------------------
# Bootstrap GitHub Pages for a Vite + React project
# - Pages mode: GitHub Actions (no gh-pages branch)
# - Optional custom domain via CNAME
# - Fully scriptable, non-interactive
# --------------------------------------------------

set -euo pipefail

# =========================
# Config (EDIT THESE)
# =========================
OWNER="computbiol"
REPO="figurepalette"
BRANCH="main"

# Optional: leave empty ("") to skip all custom-domain steps
DOMAIN=""              # e.g. "biomed.tools" or ""

NODE_VERSION="20"
BUILD_DIR="dist"

# =========================
# Preconditions
# =========================
command -v gh >/dev/null 2>&1 || { echo "gh not found"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "git not found"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm not found"; exit 1; }

# =========================
# 1. Enable GitHub Pages (workflow mode)
# =========================
echo "[1/7] Enabling GitHub Pages (workflow mode)..."
gh api -X POST "repos/${OWNER}/${REPO}/pages" -f build_type=workflow || true

# =========================
# 2. Vite base sanity check
# =========================
echo "[2/7] Checking Vite base config..."
if [ -f vite.config.ts ] || [ -f vite.config.js ]; then
  if [ -n "${DOMAIN}" ]; then
    echo "Custom domain detected; ensure Vite base is '/'."
  else
    echo "No custom domain; Vite base may be '/${REPO}/' or '/'."
  fi
else
  echo "WARNING: vite.config.(ts|js) not found."
fi

# =========================
# 3. Add GitHub Pages workflow
# =========================
echo "[3/7] Writing GitHub Actions workflow..."
mkdir -p .github/workflows
cat > .github/workflows/pages.yml <<EOF
name: Deploy Vite React to GitHub Pages

on:
  push:
    branches: [${BRANCH}]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${NODE_VERSION}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ${BUILD_DIR}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

# =========================
# 4. Optional: Custom domain (CNAME + API)
# =========================
if [ -n "${DOMAIN}" ]; then
  echo "[4/7] Adding CNAME for custom domain: ${DOMAIN}"
  echo "${DOMAIN}" > CNAME
  git add CNAME
else
  echo "[4/7] Skipping custom domain (DOMAIN is empty)."
fi

# =========================
# 5. Commit & push
# =========================
echo "[5/7] Committing changes..."
git add .github/workflows/pages.yml
git commit -m "Bootstrap GitHub Pages (Vite + React, workflow mode)" || true
git push origin "${BRANCH}"

# =========================
# 6. Optional: Bind custom domain via API
# =========================
if [ -n "${DOMAIN}" ]; then
  echo "[6/7] Binding custom domain via GitHub API..."
  gh api -X PUT "repos/${OWNER}/${REPO}/pages" -f cname="${DOMAIN}" || true
else
  echo "[6/7] Skipping Pages domain binding."
fi

# =========================
# 7. Final status
# =========================
echo "[7/7] Pages status:"
gh api "repos/${OWNER}/${REPO}/pages" --jq '{status, build_type, cname, html_url}'

echo "Done."
