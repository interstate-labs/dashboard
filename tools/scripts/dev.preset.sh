#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: yarn dev:preset <preset_name>"
  exit 1
fi

preset_name="$1"
config_file="./configs/envs/.env.${preset_name}"
secrets_file="./configs/envs/.env.secrets"

if [ ! -f "$config_file" ]; then
    echo "Error: File '$config_file' not found."
    exit 1
fi

# download assets for the running instance
dotenv \
  -e $config_file \
  -- bash -c './deploy/scripts/download_assets.sh ./public/assets/configs'

yarn svg:build-sprite
echo ""

# generate envs.js file and run the app
GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "no-tag")

dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$GIT_COMMIT_SHA \
  -v NEXT_PUBLIC_GIT_TAG=$GIT_TAG \
  -e $config_file \
  -e $secrets_file \
  -- bash -c './deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty