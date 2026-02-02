# Multi-stage Dockerfile for Next.js production deployment
# Optimized for size and security

# ===================================
# Stage 1: Install dependencies
# ===================================
FROM oven/bun:1.2-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files
COPY package.json bun.lockb ./

# Install dependencies using bun install --frozen-lockfile for reproducible builds
RUN bun install --frozen-lockfile

# ===================================
# Stage 2: Build application
# ===================================
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Receive build arguments
ARG STRAPI_URL

# Set environment variables for build
ENV STRAPI_URL=$STRAPI_URL

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
# The standalone output will be in .next/standalone
RUN bun run build

# ===================================
# Stage 3: Production runtime
# ===================================
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunjs

# Copy public assets
COPY --from=builder --chown=bunjs:bunjs /app/public ./public

# Copy standalone build output
# Next.js standalone mode includes all necessary files
COPY --from=builder --chown=bunjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=bunjs:bunjs /app/.next/static ./.next/static

# Switch to non-root user
USER bunjs

# Expose port 3000
EXPOSE 3000

# Set environment variables for Next.js server
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js server using bun
CMD ["bun", "server.js"]
