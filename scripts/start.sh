#!/bin/sh
# scripts/start.sh — Used in Railway production deployment
# Runs database migrations then starts the Next.js server

set -e

echo "🚀 EduFund Portal — Starting production server"
echo "📦 Running database migrations..."

npx prisma migrate deploy

echo "✅ Migrations complete"
echo "🌱 Checking if seed is needed..."

# Only seed if users table is empty (first deploy)
USER_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(c => { console.log(c); prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  echo "🌱 Seeding initial data..."
  npx tsx prisma/seed.ts
  echo "✅ Seed complete"
else
  echo "ℹ️  Database already has $USER_COUNT users — skipping seed"
fi

echo "🎓 Starting EduFund Portal on port ${PORT:-3000}..."
node server.js
