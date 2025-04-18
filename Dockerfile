FROM php:8.1-apache

# Installation des extensions PHP essentielles
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Activation des modules Apache nécessaires
RUN a2enmod rewrite headers

# Définition du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers du projet
COPY . /var/www/html/

# Créer un fichier index.php simple dans le dossier racine pour le health check
RUN echo '<?php echo "OK"; ?>' > /var/www/html/index.php

# Permissions
RUN chown -R www-data:www-data /var/www/html

# Configuration pour servir depuis le dossier racine (pas public)
# Nous utiliserons un lien symbolique pour rediriger vers public
RUN ln -sf /var/www/html/public/* /var/www/html/

# Exposition du port
EXPOSE 80

# Démarrage du serveur Apache
CMD ["apache2-foreground"]
