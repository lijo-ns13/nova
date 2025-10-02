# ================================
# Stage 1: Build Stage
# ================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (reproducible builds)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# ================================
# Stage 2: Production Stage
# ================================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only production dependencies
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built files
COPY --from=build /app/dist ./dist

# Optional: Copy environment file
# COPY .env .env

# Expose application port
EXPOSE 3000

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

# Use PM2 cluster mode for multi-core utilization (optional, highly recommended for production)
# CMD ["npx", "pm2-runtime", "dist/server.js", "--instances", "max"]

# Start application (single instance)
CMD ["node", "dist/server.js"]
