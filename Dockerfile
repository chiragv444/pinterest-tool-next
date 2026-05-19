# ── Stage 1: Install dependencies ──
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build the application ──
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ── Stage 3: Production runner ──
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone server + static assets + public files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
