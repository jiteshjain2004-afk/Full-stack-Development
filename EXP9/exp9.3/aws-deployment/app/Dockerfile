# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# Stage 2: Production Nginx
FROM nginx:1.25-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
