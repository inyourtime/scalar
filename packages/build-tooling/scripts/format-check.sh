#!/bin/bash
set -e

pnpm biome format
pnpm prettier --check . --ignore-path ../../.prettierignore
