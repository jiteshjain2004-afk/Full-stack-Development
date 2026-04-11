FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY 40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
