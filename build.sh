#!/bin/bash
set -e
echo "Building with @cloudflare/next-on-pages..."
npx @cloudflare/next-on-pages
echo "Copying functions/ to output..."
cp -r functions .vercel/output/static/functions
echo "Copying _routes.json to output..."
cp _routes.json .vercel/output/static/_routes.json
echo "Build complete!"
ls -la .vercel/output/static/
