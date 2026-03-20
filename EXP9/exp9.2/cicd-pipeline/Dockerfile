# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
ARG REACT_APP_ENV=production
ARG REACT_APP_VERSION=latest
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_VERSION=$REACT_APP_VERSION
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:1.25-alpine AS production
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
