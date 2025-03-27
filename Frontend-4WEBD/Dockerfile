# Utiliser une image de base Node.js pour construire l'application
FROM node:20 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install


# Copier le reste des fichiers de l'application
COPY . .


# Construire l'application React
RUN npm run build

# Utiliser une image Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers de build de l'application React dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]