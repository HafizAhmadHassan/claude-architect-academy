#!/bin/bash
set -euo pipefail

REPO_URL="https://github.com/HafizAhmadHassan/claude-academy-deploy-target.git"
REPO_URL="https://github.com/HafizAhmadHassan/claude-architect-academy.git"

DEPLOY_TARGET=github-pages npm run build

COMMIT_SHA=$(git -C .. rev-parse --short HEAD)
COMMIT_MSG=$(git -C .. log -1 --pretty=%B | head -1)

cd out
touch .nojekyll

if [ ! -d .git ]; then
  git init -b gh-pages -q
fi
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git config user.name "Hafiz Ahmad Hassan"
git config user.email "ahmadhassan061@gmail.com"
git add -A
git commit -q -m "Deploy ${COMMIT_SHA}: ${COMMIT_MSG}" || echo "no changes to deploy"
git push -f origin gh-pages

echo "Deployed to https://hafizahmadhassan.github.io/claude-architect-academy/"
