#!/usr/bin/env bash
set -euo pipefail

rm -rf dist && mkdir -p dist

bun build ./generateAnimation.ts --outfile=dist/generateAnimation.js --target=node

bun build ./cli.ts --outfile=dist/cli.js --target=node --external=./generateAnimation.js
chmod +x dist/cli.js

bunx dts-bundle-generator --out-file dist/generateAnimation.d.ts --project tsconfig.json --no-banner --no-check generateAnimation.ts

cat > dist/package.json << EOF
{
  "name": "space-invaders-contributions",
  "version": "$(node -p "require('../../package.json').version")",
  "repository": "$(node -p "require('../../package.json').repository")",
  "bin": { "space-invaders-contributions": "cli.js" },
  "type": "module",
  "main": "./generateAnimation.js",
  "types": "./generateAnimation.d.ts"
}
EOF
