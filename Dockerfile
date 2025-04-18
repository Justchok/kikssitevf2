FROM php:8.1-apache

# Installation des extensions PHP nécessaires
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Activation du module rewrite d'Apache
RUN a2enmod rewrite

# Définition du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers du projet
COPY . /var/www/html/

# Configuration pour servir depuis le dossier public
RUN sed -i 's/\/var\/www\/html/\/var\/www\/html\/public/g' /etc/apache2/sites-available/000-default.conf

# Exposition du port
EXPOSE 80

# Démarrage du serveur Apache
CMD ["apache2-foreground"]
