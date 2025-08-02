#!/bin/bash

# Test Environment Docker Deployment Script
# Usage: ./scripts/deploy-test.sh

set -e

echo "🚀 Starting Docker-based test deployment..."

# Check if required environment variables are set
if [[ -z "${NEXT_PUBLIC_SUPABASE_URL}" || -z "${NEXT_PUBLIC_SUPABASE_ANON_KEY}" || -z "${SESSION_SECRET}" ]]; then
    echo "❌ Error: Missing required environment variables"
    echo "   Please set: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SESSION_SECRET"
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="$HOME/deployments/minesweeper-test"
echo "📁 Setting up deployment directory: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Build Docker image
echo "🐳 Building Docker image..."
IMAGE_TAG="minesweeper-test:$(date +%Y%m%d_%H%M%S)"
docker build -t "$IMAGE_TAG" "$OLDPWD"

# Create environment file
echo "⚙️ Creating environment file..."
cat > .env.test << EOF
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
SESSION_SECRET=${SESSION_SECRET}
EOF

# Set image name for docker-compose
export IMAGE_NAME_WITH_TAG="$IMAGE_TAG"

# Stop existing container
echo "⏹️ Stopping existing container..."
docker compose -f "$OLDPWD/docker-compose.test.yml" down || true

# Start new container
echo "🚀 Starting new container..."
docker compose -f "$OLDPWD/docker-compose.test.yml" up -d

# Clean up old images (keep last 3)
echo "🧹 Cleaning up old images..."
docker images minesweeper-test --format "table {{.Tag}}\t{{.ID}}" | tail -n +4 | cut -f2 | xargs -r docker rmi || true

echo "🎉 Docker-based test deployment completed!"
echo "   URL: https://mine-test.ajy720.me"
echo "   Container: minesweeper-test"
echo "   Image: $IMAGE_TAG"