FROM php:8.1-apache

# Installation des extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd mysqli pdo pdo_mysql

# Activation des modules Apache nécessaires
RUN a2enmod rewrite headers

# Définition du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers du projet
COPY . /var/www/html/

# Création d'un fichier de vérification d'état simple
RUN echo '<?php header("Content-Type: application/json"); echo json_encode(["status" => "ok", "timestamp" => time()]); ?>' > /var/www/html/public/health-check.php

# Configuration pour servir depuis le dossier public
RUN sed -i 's/\/var\/www\/html/\/var\/www\/html\/public/g' /etc/apache2/sites-available/000-default.conf

# Exposition du port
EXPOSE 80

# Démarrage du serveur Apache
CMD ["apache2-foreground"]
