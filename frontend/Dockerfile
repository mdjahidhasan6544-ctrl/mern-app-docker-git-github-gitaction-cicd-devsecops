# ============================================
# BagStore Frontend — Production Dockerfile
# ============================================
# Multi-stage build:
#   Stage 1: Build React app with Vite
#   Stage 2: Serve with Nginx (Alpine)
# ============================================

# ---- Stage 1: Build ----
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# VITE_PUBLIC_API_URL is baked into the build at compile time
# Leave empty for Docker (Nginx proxies /api to backend)
ARG VITE_PUBLIC_API_URL=""
ENV VITE_PUBLIC_API_URL=$VITE_PUBLIC_API_URL

RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:80/ || exit 1

# Nginx runs as non-root by default in Alpine image
CMD ["nginx", "-g", "daemon off;"]
