# 1. Build stage
FROM node:18 AS builder

WORKDIR /app

# Kopiera package.json & lock först (cache-friendly)
COPY package*.json ./

# Installera dependencies
RUN npm install

# Kopiera resten av frontendkoden
COPY . .

# Bygg frontend
RUN npm run build


# 2. Nginx stage (production web server)
FROM nginx:alpine

# Ta bort default index.html
RUN rm -rf /usr/share/nginx/html/*

# Kopiera build output från Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]