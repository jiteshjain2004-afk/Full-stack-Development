# ─────────────────────────────────────────────────────────────
# STAGE 1: Build Stage
# Uses full Node.js image to install deps and build React app
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (layer caching — only reinstall if deps changed)
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Pass build-time environment variables
ARG REACT_APP_ENV=production
ARG REACT_APP_VERSION=1.0.0
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_VERSION=$REACT_APP_VERSION

# Build the production React app
RUN npm run build

# ─────────────────────────────────────────────────────────────
# STAGE 2: Production Stage
# Uses tiny Nginx alpine image — only copies the build output
# Result: image under 100MB (typically ~25-30MB)
# ─────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the built React files from the builder stage
# The full node_modules (~300MB) are NOT included!
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Start Nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
