# Guide d'intu00e9gration de la navigation mobile

Ce guide explique comment intu00e9grer la nouvelle navigation mobile sur toutes les pages du site Kiks Travel.

## u00c9tapes d'intu00e9gration

### 1. Ajouter les fichiers CSS et JavaScript

Dans la section `<head>` de chaque page, ajoutez les liens suivants :

```html
<link rel="stylesheet" href="css/mobile-fix.css">
<script src="js/mobile-menu.js" defer></script>
```

### 2. Mettre u00e0 jour la structure du menu hamburger

Dans la balise `<nav>` de chaque page, remplacez le bouton hamburger existant par :

```html
<!-- Hamburger menu -->
<div class="hamburger">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
</div>
```

### 3. Mettre u00e0 jour la structure du menu de navigation

Dans la balise `<nav>` de chaque page, mettez u00e0 jour la structure du menu de navigation :

```html
<div class="nav-links">
    <div class="mobile-logo">
        <img src="assets/images/kikslogo.png" alt="Kiks Travel Logo">
    </div>
    <a href="index.html" data-i18n="menuHome">Accueil</a>
    <a href="destinations.html" data-i18n="menuDestinations">Destinations</a>
    <a href="offres.html" data-i18n="menuOffers">Offres</a>
    <a href="reservations.html" data-i18n="menuReservation">Ru00e9servation</a>
    <a href="apropos.html" data-i18n="menuAbout">u00c0 propos</a>
    <a href="contact.html" data-i18n="menuContact">Contact</a>
</div>
```

### 4. Ajouter la barre de navigation mobile en bas de page

Juste avant la balise de fermeture `</body>` de chaque page, ajoutez :

```html
<!-- Navigation mobile par onglets -->
<div class="mobile-tab-nav">
    <a href="index.html">
        <i class="fas fa-home"></i>
        <span data-i18n="menuHome">Accueil</span>
    </a>
    <a href="destinations.html">
        <i class="fas fa-globe-americas"></i>
        <span data-i18n="menuDestinations">Destinations</span>
    </a>
    <a href="offres.html">
        <i class="fas fa-tag"></i>
        <span data-i18n="menuOffers">Offres</span>
    </a>
    <a href="reservations.html">
        <i class="fas fa-calendar-check"></i>
        <span data-i18n="menuReservation">Ru00e9servation</span>
    </a>
    <a href="apropos.html">
        <i class="fas fa-info-circle"></i>
        <span data-i18n="menuAbout">u00c0 propos</span>
    </a>
</div>
```

## Alternative : Utiliser le template

Un template HTML a u00e9tu00e9 cru00e9u00e9 pour faciliter l'intu00e9gration. Vous pouvez copier les u00e9lu00e9ments depuis le fichier :
`/templates/mobile-navigation.html`

## Compatibilitu00e9 avec le su00e9lecteur de langue

Cette navigation mobile est compatible avec le su00e9lecteur de langue standardisu00e9 du00e9ju00e0 en place sur le site. Le su00e9lecteur de langue reste accessible et cohu00e9rent avec le design global.

## Personnalisation

Vous pouvez personnaliser les icu00f4nes de la barre de navigation mobile en modifiant les classes Font Awesome. Par exemple, remplacez `fa-home` par une autre icu00f4ne de la bibliothu00e8que Font Awesome.

## Test

Apru00e8s l'intu00e9gration, testez le site sur diffu00e9rents appareils mobiles pour vu00e9rifier que :

1. Le menu hamburger s'ouvre et se ferme correctement
2. La barre de navigation en bas de page est visible et fonctionnelle
3. Le su00e9lecteur de langue fonctionne correctement
4. La page active est correctement mise en u00e9vidence dans les deux menus
