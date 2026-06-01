# ============================================
# BagStore Backend — Production Dockerfile
# ============================================
# Lightweight Node.js API server image
# Uses Alpine for minimal attack surface
# ============================================

FROM node:20-alpine AS base

# Security: run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# ---- Dependencies ----
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- Application Source ----
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:5000/api/status || exit 1

# Start the server
CMD ["node", "server.js"]
