#!/usr/bin/env bash
# Thin wrapper — prefer the .mjs script via vercel.json
exec node "$(dirname "$0")/vercel-ignore-build.mjs"
