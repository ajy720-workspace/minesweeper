# Docker-Based Deployment Setup Guide

This guide covers the Docker-based deployment setup for the Minesweeper application using GitHub Actions with self-hosted runners.

## Architecture

- **Production**: `mine.ajy720.me` (master branch) → Docker container on port 5000:3000
- **Test**: `mine-test.ajy720.me` (PR with `deploy:test` label) → Docker container on port 5001:3000
- **Development**: Local environment (feature branches)

## GitHub Secrets Setup

Add the following secrets to your GitHub repository settings:

### Required Secrets

1. `NEXT_PUBLIC_SUPABASE_URL`
   - Your Supabase project URL
   - Example: `https://your-project.supabase.co`

2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Your Supabase anonymous/public key
   - Found in Supabase Dashboard → Settings → API

3. `SESSION_SECRET`
   - Random secret for JWT session signing
   - Generate with: `openssl rand -base64 32`

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact name and value

## GitHub Labels Setup

Create the following label in your repository:

### Required Label

1. `deploy:test`
   - **Description**: "Deploy this PR to test environment"
   - **Color**: `#0969da` (blue)

### Creating the Label

1. Go to your GitHub repository
2. Navigate to Issues → Labels
3. Click "New label"
4. Name: `deploy:test`
5. Description: `Deploy this PR to test environment`
6. Color: `#0969da`
7. Click "Create label"

## Self-Hosted Runner Setup

### 1. Install Runner

Follow GitHub's documentation to install the self-hosted runner on your server.

### 2. Install Dependencies

```bash
# Install Docker and Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Node.js 20 (for linting in workflows)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn
```

### 3. Set Up Docker Environment

No systemd services needed - Docker containers will be managed by docker-compose:

```bash
# Create deployment directories
mkdir -p ~/deployments/minesweeper-prod
mkdir -p ~/deployments/minesweeper-test

# Verify Docker installation
docker --version
docker compose --version
```

### 4. Set Up Web Server

Configure your reverse proxy (nginx/apache) to serve:

- `mine.ajy720.me` → `http://localhost:5000` (production)
- `mine-test.ajy720.me` → `http://localhost:5001` (test)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name mine.ajy720.me;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name mine-test.ajy720.me;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deployment Workflows

### Test Deployment (PR-Label Based + Docker)

- **Trigger**: When PR has `deploy:test` label (against master branch)
- **Target**: `mine-test.ajy720.me` (Docker container on port 5001:3000)
- **Features**:
  - Only deploys PRs with `deploy:test` label
  - Builds and pushes Docker image to GHCR
  - Comments on PR with deployment info
  - Automatic deployment on PR updates (if labeled)
  - Notifies when label is removed
  - Container-based isolation and easy rollbacks

#### How Docker Deployment Works:

1. **Build**: Creates Docker image with commit SHA tag
2. **Push**: Uploads to GitHub Container Registry (GHCR)
3. **Deploy**: Pulls image on server and starts container
4. **Cleanup**: Removes old images (keeps last 3)

#### How to Use:

1. **Enable Deployment**: Add the `deploy:test` label to your PR
2. **Automatic Updates**: Any new commits will rebuild and redeploy container
3. **Disable Deployment**: Remove the `deploy:test` label
4. **Manual Deploy**: Use workflow_dispatch in GitHub Actions

#### Example Workflow:

```
1. Create feature branch: `feat/new-feature`
2. Make changes and push
3. Create PR to master
4. Add `deploy:test` label to PR
5. 🐳 Docker image built and pushed to GHCR
6. 🚀 Container deployed to mine-test.ajy720.me
7. Test your changes
8. Make more commits → automatic container rebuild/redeploy
9. Ready for production? Merge PR
10. 🚀 Production container deployed to mine.ajy720.me
```

### Production Deployment (Docker)

- **Trigger**: Push to master branch
- **Target**: `mine.ajy720.me` (Docker container on port 5000:3000)
- **Features**:
  - Runs linting before building Docker image
  - Builds and pushes to GHCR with prod tags
  - Zero-downtime deployment with container replacement
  - Automatic cleanup (keeps last 5 images)

## Manual Deployment

You can also deploy manually using the provided Docker-based scripts:

```bash
# Deploy to test environment (Docker)
./scripts/deploy-test.sh

# Deploy to production (Docker)
./scripts/deploy-prod.sh
```

Make sure environment variables are set in your terminal:

```bash
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
export SESSION_SECRET="your-session-secret"
```

### Container Management

Useful Docker commands for managing deployments:

```bash
# View running containers
docker ps

# View container logs
docker logs minesweeper-prod
docker logs minesweeper-test

# Stop containers
docker stop minesweeper-prod minesweeper-test

# Remove containers
docker rm minesweeper-prod minesweeper-test

# View images
docker images | grep minesweeper

# Clean up unused images
docker image prune -f
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure the runner user has sudo access
   - Check file permissions in deployment directories

2. **Service Not Found**
   - Install and enable systemd services
   - Check service status: `sudo systemctl status minesweeper-prod`

3. **Build Failures**
   - Check Node.js version (should be 20)
   - Verify all dependencies are installed
   - Check environment variables are set

### Logs

Check deployment logs:

```bash
# GitHub Actions logs
# Available in your repository's Actions tab

# System service logs
sudo journalctl -u minesweeper-prod -f
sudo journalctl -u minesweeper-test -f

# Application logs (if using PM2)
pm2 logs minesweeper-prod
pm2 logs minesweeper-test
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to the repository
2. **File Permissions**: Ensure proper ownership and permissions
3. **Firewall**: Only expose necessary ports (80/443)
4. **Updates**: Keep the runner and dependencies updated
5. **Backup**: Regular backups are created automatically during deployment

## Monitoring

Consider setting up monitoring for:

- Application uptime
- Deployment success/failure notifications
- Error tracking
- Performance monitoring
