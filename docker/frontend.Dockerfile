# --------------------------------------------------------
# 🐳 frontend.Dockerfile — Angular 17 Standalone + Tailwind
# Emplacement : ebanking-2.0/docker/frontend.Dockerfile
# --------------------------------------------------------

# Étape 1 : Builder Angular en image temporaire
FROM node:18-alpine AS builder

WORKDIR /app

# Copier le projet Angular (assume que le projet est dans ./frontend)
COPY ./frontend /app

# Installer les dépendances
RUN npm install

# Compiler l'application Angular en production
RUN npm run build

# Étape 2 : Image finale avec Nginx pour servir l'app
FROM nginx:1.25-alpine

# Supprimer les fichiers par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier la build Angular dans le dossier de Nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html

# Copier une configuration personnalisée (optionnel)
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Exposer le port 4200 ou 80 selon le besoin
EXPOSE 80

# Commande de démarrage par défaut
CMD ["nginx", "-g", "daemon off;"]
