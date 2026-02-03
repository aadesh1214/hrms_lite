#!/usr/bin/env bash

# Build script for Render static site deployment
echo "Building Angular application..."
npm install
npm run build

echo "Build complete! Files are in dist/hrms-lite/"
