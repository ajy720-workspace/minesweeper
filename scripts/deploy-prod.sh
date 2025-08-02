#!/bin/bash

# Production Environment Docker Deployment Script
# Usage: ./scripts/deploy-prod.sh

set -e

echo "🚀 Starting Docker-based production deployment..."

# Check if required environment variables are set
if [[ -z "${NEXT_PUBLIC_SUPABASE_URL}" || -z "${NEXT_PUBLIC_SUPABASE_ANON_KEY}" || -z "${SESSION_SECRET}" ]]; then
    echo "❌ Error: Missing required environment variables"
    echo "   Please set: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SESSION_SECRET"
    exit 1
fi

# Run linting first
echo "🔍 Running linting..."
yarn lint

# Create deployment directory
DEPLOY_DIR="$HOME/deployments/minesweeper-prod"
echo "📁 Setting up deployment directory: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Build Docker image
echo "🐳 Building Docker image..."
IMAGE_TAG="minesweeper-prod:$(date +%Y%m%d_%H%M%S)"
docker build -t "$IMAGE_TAG" "$OLDPWD"

# Also tag as latest
docker tag "$IMAGE_TAG" "minesweeper-prod:latest"

# Create environment file
echo "⚙️ Creating environment file..."
cat > .env.prod << EOF
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
SESSION_SECRET=${SESSION_SECRET}
EOF

# Set image name for docker-compose
export IMAGE_NAME_WITH_TAG="$IMAGE_TAG"

# Stop existing container
echo "⏹️ Stopping existing container..."
docker compose -f "$OLDPWD/docker-compose.prod.yml" down || true

# Start new container
echo "🚀 Starting new container..."
docker compose -f "$OLDPWD/docker-compose.prod.yml" up -d

# Clean up old images (keep last 5 for production)
echo "🧹 Cleaning up old images..."
docker images minesweeper-prod --format "table {{.Tag}}\t{{.ID}}" | grep -v "latest" | tail -n +6 | cut -f2 | xargs -r docker rmi || true

echo "🎉 Docker-based production deployment completed!"
echo "   URL: https://mine.ajy720.me"
echo "   Container: minesweeper-prod"
echo "   Image: $IMAGE_TAG"