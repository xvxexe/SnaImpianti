#!/usr/bin/env bash
set -euo pipefail

THEME_NAME="snaimpianti"
BUILD_DIR="build-wordpress"
ZIP_NAME="${THEME_NAME}.zip"

rm -rf "$BUILD_DIR" "$ZIP_NAME"
mkdir -p "$BUILD_DIR/$THEME_NAME"

rsync -a ./ "$BUILD_DIR/$THEME_NAME/" \
  --exclude='.git' \
  --exclude='.github' \
  --exclude="$BUILD_DIR" \
  --exclude="$ZIP_NAME" \
  --exclude='*.md' \
  --exclude='node_modules' \
  --exclude='.DS_Store'

(
  cd "$BUILD_DIR"
  zip -r "../$ZIP_NAME" "$THEME_NAME" -x "*/.DS_Store"
)

echo "Creato: $ZIP_NAME"
echo "Carica questo zip da WordPress oppure carica la cartella $THEME_NAME via FTP in wp-content/themes/."
