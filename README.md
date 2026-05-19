# Pinterest Video Downloader — pinvideodown.com

A Next.js web application for downloading Pinterest videos and images. Built with Next.js 14, React 18, and Tailwind CSS.

## 🌐 Live URL

**Production:** [https://pinvideodown.com](https://pinvideodown.com)

## 🏗️ Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | [Next.js 14](https://nextjs.org/) (Pages Router)             |
| UI             | React 18, Tailwind CSS 3                                      |
| Runtime        | Node.js 22 (Alpine, via Docker)                               |
| Container      | Docker + Docker Compose                                       |
| Reverse Proxy  | Nginx (SSL termination via Cloudflare Origin certs)           |
| CI/CD          | Jenkins (Freestyle job, Docker-based deploy)                  |
| Process Mgmt   | Docker `restart: unless-stopped` (replaces PM2)               |
| CDN / DNS      | Cloudflare (Full SSL, cache purge on deploy)                  |

## 📁 Project Structure

```
pinterest-tool-next/
├── src/
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and API helpers
│   ├── pages/            # Next.js Pages Router pages
│   │   ├── api/          # API routes (robots, sitemap, pinterest)
│   │   ├── [lang]/       # i18n dynamic routes
│   │   ├── about-us/
│   │   ├── contact-us/
│   │   ├── privacy-policy/
│   │   ├── pinterest-image-downloader/
│   │   └── terms-of-service/
│   └── styles/           # Global CSS and Tailwind config
├── locales/              # i18n translation files
├── public/               # Static assets
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Docker Compose orchestration
├── next.config.js        # Next.js config (standalone output)
├── .env                  # Environment variables (not committed)
└── jenkins-job-config.xml # Jenkins CI/CD job definition
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- Docker & Docker Compose (for production)

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3002
```

### Production Build (Docker)

```bash
# Build and start the container
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f pinvideodown

# Stop
docker compose down
```

## 🔧 Environment Variables

| Variable               | Description                            | Example                                                    |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `NODE_ENV`             | Environment mode                       | `production`                                               |
| `HOST`                 | Bind address                           | `0.0.0.0`                                                  |
| `PORT`                 | Application port                       | `3002`                                                     |
| `SITE_URL`             | Canonical site URL                     | `https://pinvideodown.com/`                                |
| `RAPIDAPI_KEY`         | RapidAPI key for Pinterest API         | `96313c...`                                                |
| `RAPIDAPI_HOST`        | RapidAPI host                          | `pinterest-video-and-image-downloader.p.rapidapi.com`      |
| `RAPIDAPI_URL`         | RapidAPI base URL                      | `https://pinterest-video-and-image-downloader.p.rapidapi.com` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token for cache purge   | `uRdwa...`                                                 |
| `CLOUDFLARE_ZONE_ID`   | Cloudflare zone ID                     | `24629...`                                                 |
| `SUBDOMAIN`            | Domain for Cloudflare cache purge      | `pinvideodown.com`                                         |

## 🔄 CI/CD Pipeline (Jenkins)

The project uses a Jenkins freestyle job (`pinvideodown.com`) that:

1. **Pulls** latest code from `main` branch via `git pull`
2. **Builds** a Docker image using multi-stage Dockerfile
3. **Deploys** via `docker compose up -d --build`
4. **Health-checks** the app at `http://localhost:3002/`
5. **Purges** Cloudflare cache for `pinvideodown.com`

Jenkins runs as the `jenkins` user with `NOPASSWD` sudo access.
The Jenkins job injects environment variables via the EnvInject plugin.

## 🌐 Nginx Configuration

Nginx handles SSL termination and reverse-proxying:

- **SSL:** Cloudflare Origin certificates at `/etc/ssl/certs/cloudflare.pem` and `/etc/ssl/private/cloudflare.key`
- **Proxy:** `localhost:3002` → `pinvideodown.com`
- **Redirects:** HTTP → HTTPS, www → non-www
- **Config file:** `/etc/nginx/sites-available/pinvideodown.com`

## 📋 Useful Commands

```bash
# Check if the app is running
curl -I http://localhost:3002/

# View Docker container logs
docker compose logs -f pinvideodown

# Restart the container
docker compose restart

# Rebuild from scratch
docker compose down && docker compose up -d --build

# Check Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 📝 License

Private project. All rights reserved.
