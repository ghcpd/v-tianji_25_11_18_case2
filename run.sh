#!/usr/bin/env bash
set -euo pipefail
npm install
npm run dev -- --host 0.0.0.0 --open
