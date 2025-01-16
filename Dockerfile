FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers du projet
COPY . .

# Construction du projet
RUN npm run build

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["node", "server.js"]
