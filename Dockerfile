# Multi-stage Dockerfile for Next.js production deployment
# Optimized for size and security

# ===================================
# Stage 1: Install dependencies
# ===================================
# ===================================
# Stage 1: Install dependencies
# ===================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files
COPY package.json package-lock.json ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci

# ===================================
# Stage 2: Build application
# ===================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Receive build arguments
ARG STRAPI_URL
ARG NEXT_PUBLIC_STRAPI_URL

# Set environment variables for build
ENV STRAPI_URL=$STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
# The standalone output will be in .next/standalone
RUN npm run build

# ===================================
# Stage 3: Production runtime
# ===================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Copy standalone build output
# Next.js standalone mode includes all necessary files
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables for Next.js server
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js server using node
CMD ["node", "server.js"]
