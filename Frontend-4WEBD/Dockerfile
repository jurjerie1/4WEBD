# Étape de build avec Node.js
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape finale avec Nginx
FROM nginx:alpine

# Copier les fichiers de build React
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config personnalisée dans conf.d
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
