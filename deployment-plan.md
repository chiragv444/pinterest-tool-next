# Deployment Plan — pinvideodown.com (Pinterest Tool Next.js)

> **Complete step-by-step deployment guide for the Pinterest Video Downloader.**
> This plan migrates from the old PM2-based `pinterest-tool` (Vite/Fastify) at `/var/www/pinterest-tool` to a Docker-based Next.js deployment at `/var/www/pinterest-tool-next` on port **3002**, domain **pinvideodown.com**.
>
> **Modeled after:** The `saveinstavideo.io` / `Instagram-tool-nextjs` project's Docker + Jenkins CI/CD pipeline.

---

## Table of Contents

1. [Pre-Flight Checks](#1-pre-flight-checks)
2. [Project Files Verification](#2-project-files-verification)
3. [Fix File Ownership & Permissions](#3-fix-file-ownership--permissions)
4. [Add Jenkins User to Docker Group](#4-add-jenkins-user-to-docker-group)
5. [Generate pnpm Lockfile](#5-generate-pnpm-lockfile)
6. [Test Docker Build Locally](#6-test-docker-build-locally)
7. [Stop the Old PM2 Process](#7-stop-the-old-pm2-process)
8. [Start the Docker Container](#8-start-the-docker-container)
9. [Verify the App is Running](#9-verify-the-app-is-running)
10. [Verify Nginx Configuration](#10-verify-nginx-configuration)
11. [Update the Jenkins Job Config](#11-update-the-jenkins-job-config)
12. [Reload Jenkins to Pick Up the New Config](#12-reload-jenkins-to-pick-up-the-new-config)
13. [Test the Jenkins Build](#13-test-the-jenkins-build)
14. [Verify End-to-End via Domain](#14-verify-end-to-end-via-domain)
15. [Clean Up the Old Project](#15-clean-up-the-old-project)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Pre-Flight Checks

Verify all required tools are present on the server.

### 1.1 — Check Node.js version

```bash
node --version
# Expected: v22.x.x (v22.20.0 confirmed on this server)
```

### 1.2 — Check pnpm is installed globally

```bash
pnpm --version
# Expected: 10.30.3 or higher
```

If pnpm is not installed:

```bash
npm install -g pnpm@10
```

### 1.3 — Check Docker is running

```bash
docker --version
# Expected: Docker version 29.x.x

docker ps
# Should list running containers (at least saveinstavideo)
```

### 1.4 — Check Docker Compose is available

```bash
docker compose version
# Expected: Docker Compose version v2.x.x
```

### 1.5 — Check Jenkins is running

```bash
systemctl status jenkins
# Expected: active (running)
```

### 1.6 — Check Nginx is running

```bash
systemctl status nginx
# Expected: active (running)
```

### 1.7 — Check SSL certificates exist

```bash
ls -la /etc/ssl/certs/cloudflare.pem
ls -la /etc/ssl/private/cloudflare.key
# Both files should exist (Cloudflare Origin certificates, shared across all sites)
```

### 1.8 — Check Git SSH keys for Jenkins

```bash
ls -la /var/lib/jenkins/.ssh/
# Should contain: id_ed25519, id_ed25519.pub, id_rsa, id_rsa.pub, known_hosts
```

### 1.9 — Verify the Pinterest project directory exists

```bash
ls -la /var/www/pinterest-tool-next/
# Should contain: Dockerfile, docker-compose.yml, package.json, next.config.js, src/, etc.
```

---

## 2. Project Files Verification

Verify all deployment-related files are in place.

### 2.1 — Check Dockerfile exists

```bash
cat /var/www/pinterest-tool-next/Dockerfile
```

Expected content — multi-stage build with 3 stages (deps → builder → runner):
- Stage 1: Uses `node:22-alpine`, enables corepack/pnpm, runs `pnpm install --frozen-lockfile`
- Stage 2: Copies node_modules, copies all code, runs `pnpm run build`
- Stage 3: Copies `.next/standalone`, `.next/static`, `public`, exposes port 3002

### 2.2 — Check docker-compose.yml exists

```bash
cat /var/www/pinterest-tool-next/docker-compose.yml
```

Expected: service named `pinvideodown`, container_name `pinvideodown`, ports `3002:3002`, env_file `.env`.

### 2.3 — Check .dockerignore exists

```bash
cat /var/www/pinterest-tool-next/.dockerignore
```

Expected: excludes `node_modules`, `.next`, `.git`, `*.md`, `.env*`, `.gitignore`, `.nvmrc`, `.gemini`, `_agents`, `.agents`.

### 2.4 — Check next.config.js has `output: "standalone"`

```bash
grep 'standalone' /var/www/pinterest-tool-next/next.config.js
```

Expected output: `output: "standalone",`

> **CRITICAL:** Without `output: "standalone"`, the Docker build will fail because `next build` won't generate the `standalone/server.js` file that the Dockerfile copies.

### 2.5 — Check .env file

```bash
cat /var/www/pinterest-tool-next/.env
```

Expected variables:
- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=3002`
- `SITE_URL=https://pinvideodown.com/`
- `RAPIDAPI_KEY=...` (Pinterest API key)
- `RAPIDAPI_HOST=pinterest-video-and-image-downloader.p.rapidapi.com`
- `RAPIDAPI_URL=https://pinterest-video-and-image-downloader.p.rapidapi.com`
- `CLOUDFLARE_API_TOKEN=...`
- `CLOUDFLARE_ZONE_ID=2462988f382a11d57d3ecf1aa74d43dd`
- `SUBDOMAIN=pinvideodown.com`

> **Note:** The `.env` should NOT have any stray nano editor artifacts (like `GNU nano 7.2` on line 1). If it does, fix it.

### 2.6 — Check pnpm-lock.yaml exists

```bash
ls -la /var/www/pinterest-tool-next/pnpm-lock.yaml
```

If it doesn't exist, generate it:

```bash
cd /var/www/pinterest-tool-next && pnpm install
```

### 2.7 — Verify .nvmrc file

```bash
cat /var/www/pinterest-tool-next/.nvmrc
# Expected: v22.20.0
```

---

## 3. Fix File Ownership & Permissions

> **This is the most critical step for preventing Jenkins permission errors.**
> Jenkins runs as user `jenkins` (uid=109, gid=112). It needs read/write access to the project directory and the ability to run `git pull` and `docker compose`.

### 3.1 — Change ownership of the project directory to jenkins

```bash
sudo chown -R jenkins:jenkins /var/www/pinterest-tool-next
```

### 3.2 — Verify ownership

```bash
ls -la /var/www/ | grep pinterest-tool-next
# Expected: jenkins jenkins
```

### 3.3 — Verify the .git directory is owned by jenkins

```bash
ls -la /var/www/pinterest-tool-next/.git/
# All files should be owned by jenkins:jenkins
```

### 3.4 — Set proper Git safe.directory (prevents "dubious ownership" error)

```bash
sudo -u jenkins git config --global --add safe.directory /var/www/pinterest-tool-next
```

### 3.5 — Test that jenkins user can do git pull

```bash
sudo -u jenkins git -C /var/www/pinterest-tool-next pull
# Should succeed (or say "Already up to date")
```

### 3.6 — Verify Jenkins sudoers has NOPASSWD:ALL

```bash
grep jenkins /etc/sudoers
# Expected: jenkins ALL=(ALL) NOPASSWD:ALL
```

This is already configured on this server. If not present:

```bash
echo 'jenkins ALL=(ALL) NOPASSWD:ALL' | sudo tee -a /etc/sudoers
```

---

## 4. Add Jenkins User to Docker Group

> **This prevents "permission denied" errors when Jenkins tries to run `docker compose`.**

### 4.1 — Check if jenkins is in the docker group

```bash
groups jenkins
# Current: jenkins : jenkins (docker group is MISSING)
```

### 4.2 — Add jenkins to the docker group

```bash
sudo usermod -aG docker jenkins
```

### 4.3 — Verify the change

```bash
grep docker /etc/group
# Expected: docker:x:988:jenkins
```

### 4.4 — Restart Jenkins to apply group change

```bash
sudo systemctl restart jenkins
```

> **IMPORTANT:** The group change ONLY takes effect after Jenkins restarts. Without this restart, Jenkins builds will still get "permission denied" when running `docker compose`.

### 4.5 — Wait for Jenkins to fully start

```bash
sleep 15
systemctl status jenkins
# Should be: active (running)
```

### 4.6 — Verify jenkins can run docker

```bash
sudo -u jenkins docker ps
# Should list containers without "permission denied"
```

> **Note:** If `sudo -u jenkins docker ps` still fails after restart, try:
> ```bash
> sudo -u jenkins newgrp docker
> # Or reboot the server as a last resort:
> sudo reboot
> ```

---

## 5. Generate pnpm Lockfile

> If `pnpm-lock.yaml` was already generated in step 2.6, skip this step.

### 5.1 — Remove any npm lock file (we're switching to pnpm)

```bash
rm -f /var/www/pinterest-tool-next/package-lock.json
```

### 5.2 — Generate pnpm-lock.yaml

```bash
cd /var/www/pinterest-tool-next && pnpm install
```

### 5.3 — Verify pnpm-lock.yaml was created

```bash
ls -la /var/www/pinterest-tool-next/pnpm-lock.yaml
# Should exist and be non-empty
```

---

## 6. Test Docker Build Locally

> Run the Docker build manually first to catch any errors before involving Jenkins.

### 6.1 — Build the Docker image

```bash
cd /var/www/pinterest-tool-next && docker compose build
```

Expected output:
- Stage 1 (deps): pnpm install succeeds
- Stage 2 (builder): `next build` completes, generates `.next/standalone/`
- Stage 3 (runner): copies standalone files, image is tagged

> **Common errors at this step:**
> - `pnpm-lock.yaml not found`: Run `pnpm install` first (step 5.2)
> - `Cannot find module 'next'`: `pnpm install --frozen-lockfile` failed — check pnpm-lock.yaml is valid
> - `.next/standalone does not exist`: `output: "standalone"` is missing from `next.config.js` (step 2.4)

### 6.2 — Verify the image was created

```bash
docker images | grep pinvideodown
# Should show: pinterest-tool-next-pinvideodown or similar
```

---

## 7. Stop the Old PM2 Process

> The old `pinterest-tool` PM2 process runs from `/var/www/pinterest-tool` on port 3002.
> We need to stop it before starting the Docker container on the same port.

### 7.1 — Check current PM2 processes

```bash
pm2 list
# Should show: pinterest-tool (id 1) — online, port 3002
```

### 7.2 — Stop the old PM2 process

```bash
pm2 stop pinterest-tool
```

### 7.3 — Delete the old PM2 process from PM2's process list

```bash
pm2 delete pinterest-tool
```

### 7.4 — Save PM2 process list (so it doesn't restart on reboot)

```bash
pm2 save
```

### 7.5 — Verify port 3002 is now free

```bash
ss -tlnp | grep 3002
# Should return nothing (port is free)
```

> If port 3002 is still occupied:
> ```bash
> lsof -i :3002
> kill -9 <PID>
> ```

---

## 8. Start the Docker Container

### 8.1 — Start the container in detached mode

```bash
cd /var/www/pinterest-tool-next && docker compose up -d --build
```

### 8.2 — Verify the container is running

```bash
docker compose ps
# Expected: pinvideodown — running, ports 0.0.0.0:3002->3002/tcp
```

### 8.3 — Check container logs for errors

```bash
docker compose logs --tail 20 pinvideodown
# Should show: "▲ Next.js 14.2.5" and "- Local: http://0.0.0.0:3002"
```

---

## 9. Verify the App is Running

### 9.1 — Health check via localhost

```bash
curl -I http://localhost:3002/
# Expected: HTTP/1.1 200 OK
```

### 9.2 — Check response body

```bash
curl -s http://localhost:3002/ | head -20
# Should return HTML content
```

---

## 10. Verify Nginx Configuration

> The Nginx config for `pinvideodown.com` already exists and points to `localhost:3002`.
> No changes needed — just verify it's correct and active.

### 10.1 — Verify the Nginx config file exists

```bash
cat /etc/nginx/sites-available/pinvideodown.com
```

Expected content:
- Main HTTPS block: `server_name pinvideodown.com`, `proxy_pass http://localhost:3002`
- SSL: uses `/etc/ssl/certs/cloudflare.pem` and `/etc/ssl/private/cloudflare.key`
- HTTP → HTTPS redirect for `pinvideodown.com` and `www.pinvideodown.com`
- www → non-www HTTPS redirect

### 10.2 — Verify the symlink in sites-enabled

```bash
ls -la /etc/nginx/sites-enabled/ | grep pinvideodown
```

If it's a regular file (not a symlink), that's also fine — it's currently a copy. But for consistency, you can make it a symlink:

```bash
# Only if it's a regular file and you want to convert to symlink:
sudo rm /etc/nginx/sites-enabled/pinvideodown.com
sudo ln -s /etc/nginx/sites-available/pinvideodown.com /etc/nginx/sites-enabled/pinvideodown.com
```

### 10.3 — Test Nginx configuration

```bash
sudo nginx -t
# Expected: nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 10.4 — Reload Nginx (only if you made changes)

```bash
sudo systemctl reload nginx
```

---

## 11. Update the Jenkins Job Config

> We need to replace the existing `pinvideodown.com` Jenkins job config with the new Docker-based deployment script.
> The old job uses PM2 + NVM; the new one uses `docker compose` (matching the saveinstavideo.io pattern).

### 11.1 — Backup the old Jenkins job config

```bash
cp /var/lib/jenkins/jobs/pinvideodown.com/config.xml /var/lib/jenkins/jobs/pinvideodown.com/config.xml.bak
```

### 11.2 — Copy the new config.xml into place

```bash
sudo cp /var/www/pinterest-tool-next/jenkins-job-config.xml /var/lib/jenkins/jobs/pinvideodown.com/config.xml
```

### 11.3 — Set correct ownership

```bash
sudo chown root:jenkins /var/lib/jenkins/jobs/pinvideodown.com/config.xml
```

### 11.4 — Verify the new config is in place

```bash
cat /var/lib/jenkins/jobs/pinvideodown.com/config.xml | head -5
# Should show the XML header and project tag with description
```

### 11.5 — Verify the build script in the config

```bash
cat /var/lib/jenkins/jobs/pinvideodown.com/config.xml | grep -A5 "PROJECT_DIR"
# Expected: PROJECT_DIR="/var/www/pinterest-tool-next"
```

### 11.6 — Verify the environment variables in the config

```bash
cat /var/lib/jenkins/jobs/pinvideodown.com/config.xml | grep -A15 "propertiesContent"
# Should show: PORT=3002, SITE_URL=https://pinvideodown.com/, SUBDOMAIN=pinvideodown.com
# CLOUDFLARE_ZONE_ID=2462988f382a11d57d3ecf1aa74d43dd
# RAPIDAPI_HOST=pinterest-video-and-image-downloader.p.rapidapi.com
```

---

## 12. Reload Jenkins to Pick Up the New Config

### 12.1 — Reload Jenkins configuration from disk

```bash
# Via Jenkins CLI (if available):
curl -X POST "http://localhost:8080/reload" --user admin:admin 2>/dev/null

# OR restart the entire Jenkins service:
sudo systemctl restart jenkins
```

> **Note:** If the `curl` method requires authentication, use the Jenkins web UI instead:
> Go to `https://deploy.ytmp3.tube/` → **Manage Jenkins** → **Reload Configuration from Disk**

### 12.2 — Wait for Jenkins to restart

```bash
sleep 15
systemctl status jenkins
# Should be: active (running)
```

### 12.3 — Verify the job exists via Jenkins

Visit the Jenkins UI at `https://deploy.ytmp3.tube/` and verify the `pinvideodown.com` job shows the updated description: `pinvideodown.com — Pinterest Video Downloader (Next.js + Docker)`.

---

## 13. Test the Jenkins Build

### 13.1 — Trigger a build via the Jenkins UI

1. Go to `https://deploy.ytmp3.tube/`
2. Click on the **pinvideodown.com** job
3. Click **Build Now**
4. Watch the **Console Output**

### 13.2 — Expected build output

```
>>> Pulling latest code
Already up to date.
>>> Rebuilding & restarting Docker container
 Container pinvideodown  Recreated
 Container pinvideodown  Started
>>> Verifying container is healthy
✅ App is up and responding on :3002
>>> Purging Cloudflare cache for: pinvideodown.com
{"success":true,"errors":[],...}
✅ Deploy complete
Finished: SUCCESS
```

### 13.3 — If the build fails, check the Console Output for these common issues

| Error | Cause | Fix |
|-------|-------|-----|
| `permission denied while trying to connect to the Docker daemon` | Jenkins not in docker group | Step 4 — Add jenkins to docker group and restart Jenkins |
| `fatal: detected dubious ownership` | Git repo owned by different user | Step 3.4 — `git config --global --add safe.directory` |
| `COPY failed: file not found` | `.next/standalone` not generated | Step 2.4 — Ensure `output: "standalone"` in next.config.js |
| `ERR_PNPM_FROZEN_LOCKFILE_WITH_NO_LOCKFILE` | No pnpm-lock.yaml | Step 5 — Run `pnpm install` to generate it |
| `Address already in use :3002` | Old PM2 process still running | Step 7 — Stop and delete the PM2 process |
| `curl: (7) Failed to connect to localhost port 3002` | Container didn't start | Run `docker compose logs pinvideodown` to check |

---

## 14. Verify End-to-End via Domain

### 14.1 — Test via HTTPS

```bash
curl -I https://pinvideodown.com/
# Expected: HTTP/2 200
```

### 14.2 — Test www redirect

```bash
curl -I https://www.pinvideodown.com/
# Expected: HTTP/2 301 → Location: https://pinvideodown.com/
```

### 14.3 — Test HTTP to HTTPS redirect

```bash
curl -I http://pinvideodown.com/
# Expected: HTTP/1.1 301 → Location: https://pinvideodown.com/
```

### 14.4 — Open in browser

Visit [https://pinvideodown.com](https://pinvideodown.com) and verify:
- Page loads correctly
- No SSL errors
- Pinterest download functionality works

---

## 15. Clean Up the Old Project

> Only do this AFTER verifying everything works in steps 13 and 14.

### 15.1 — Verify the old PM2 process is stopped

```bash
pm2 list
# pinterest-tool should not be in the list (or should show "stopped")
```

### 15.2 — (Optional) Remove the old project directory

```bash
# ONLY after confirming the new deployment works:
# sudo rm -rf /var/www/pinterest-tool
```

> **Recommendation:** Keep the old directory for a week as a rollback option, then remove it.

---

## 16. Troubleshooting

### Jenkins Permission Issues (Most Common)

**Problem:** `Got permission denied while trying to connect to the Docker daemon socket`

**Root Cause:** Jenkins user is not in the `docker` group.

**Fix:**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
# Wait 15 seconds, then trigger the build again
```

---

**Problem:** `fatal: detected dubious ownership in repository at '/var/www/pinterest-tool-next'`

**Root Cause:** The Git repository is owned by a different user than who's running the command.

**Fix:**
```bash
sudo chown -R jenkins:jenkins /var/www/pinterest-tool-next
sudo -u jenkins git config --global --add safe.directory /var/www/pinterest-tool-next
```

---

**Problem:** `COPY failed: file not found in build context: .next/standalone`

**Root Cause:** `next.config.js` is missing `output: "standalone"`.

**Fix:**
```bash
grep 'standalone' /var/www/pinterest-tool-next/next.config.js
# If not present, add it:
# output: "standalone",
# Then rebuild: docker compose build
```

---

**Problem:** `ERR_PNPM_FROZEN_LOCKFILE_WITH_NO_LOCKFILE`

**Root Cause:** Dockerfile uses `pnpm install --frozen-lockfile` but `pnpm-lock.yaml` is missing from the build context.

**Fix:**
```bash
cd /var/www/pinterest-tool-next
pnpm install   # Generates pnpm-lock.yaml
# Then commit and push, or rebuild
docker compose build
```

---

**Problem:** Container starts but app doesn't respond on port 3002

**Diagnosis:**
```bash
docker compose logs pinvideodown
# Check for errors
```

**Common causes:**
- Missing environment variables → Check `.env` file
- Wrong port → Check `PORT=3002` in `.env` and `EXPOSE 3002` in Dockerfile
- Build error → Rebuild with `docker compose up -d --build`

---

**Problem:** Nginx returns 502 Bad Gateway

**Diagnosis:**
```bash
curl http://localhost:3002/
# If this fails, the container is not running
docker compose ps
docker compose logs pinvideodown
```

---

### Rolling Back to the Old PM2 Deployment

If you need to roll back:

```bash
# Stop Docker container
cd /var/www/pinterest-tool-next && docker compose down

# Restart old PM2 process
cd /var/www/pinterest-tool && pm2 start ecosystem.config.cjs

# Verify
curl http://localhost:3002/
```

---

## Quick Reference: Commands Summary

```bash
# === ONE-TIME SETUP (run these in order) ===

# 1. Fix ownership
sudo chown -R jenkins:jenkins /var/www/pinterest-tool-next

# 2. Add jenkins to docker group
sudo usermod -aG docker jenkins

# 3. Set git safe directory
sudo -u jenkins git config --global --add safe.directory /var/www/pinterest-tool-next

# 4. Generate lockfile
cd /var/www/pinterest-tool-next && rm -f package-lock.json && pnpm install

# 5. Stop old PM2 process
pm2 stop pinterest-tool && pm2 delete pinterest-tool && pm2 save

# 6. Build and start Docker container
cd /var/www/pinterest-tool-next && docker compose up -d --build

# 7. Verify
curl -I http://localhost:3002/

# 8. Update Jenkins job config
sudo cp /var/www/pinterest-tool-next/jenkins-job-config.xml /var/lib/jenkins/jobs/pinvideodown.com/config.xml
sudo chown root:jenkins /var/lib/jenkins/jobs/pinvideodown.com/config.xml

# 9. Restart Jenkins
sudo systemctl restart jenkins

# 10. Wait and verify
sleep 15 && systemctl status jenkins
```

---

## Architecture Diagram

```
                    ┌─────────────┐
                    │  Cloudflare │
                    │   DNS/CDN   │
                    └──────┬──────┘
                           │ HTTPS (443)
                    ┌──────▼──────┐
                    │    Nginx    │
                    │  SSL Term.  │
                    │ pinvideodown│
                    │    .com     │
                    └──────┬──────┘
                           │ HTTP (3002)
                    ┌──────▼──────┐
                    │   Docker    │
                    │ Container   │
                    │ "pinvideo   │
                    │   down"     │
                    │ Next.js 14  │
                    │ standalone  │
                    └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  Jenkins    │
                    │  CI/CD Job  │
                    │ "pinvideo   │
                    │  down.com"  │
                    └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   GitHub    │
                    │ chiragv444/ │
                    │ pinterest-  │
                    │ tool-next   │
                    └─────────────┘
```

---

## File Inventory

| File | Purpose | Created/Modified |
|------|---------|-----------------|
| `Dockerfile` | Multi-stage Docker build (pnpm + standalone) | Created |
| `docker-compose.yml` | Container orchestration (port 3002) | Created |
| `.dockerignore` | Exclude files from Docker build context | Created |
| `.nvmrc` | Pin Node.js version (v22.20.0) | Created |
| `.env` | Environment variables (fixed formatting) | Modified |
| `next.config.js` | Added `output: "standalone"` | Modified |
| `README.md` | Project documentation | Created |
| `jenkins-job-config.xml` | Jenkins job definition (for manual import) | Created |
| `deployment-plan.md` | This file | Created |
