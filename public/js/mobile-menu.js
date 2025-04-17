/**
 * Script de gestion du menu mobile pour Kiks Travel
 * Ce script gère l'ouverture et la fermeture du menu hamburger
 * ainsi que la navigation mobile entre les différentes pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileTabNav = document.querySelector('.mobile-tab-nav');
    
    // Vérifier si les éléments existent
    if (!hamburger || !navLinks) {
        console.error('Éléments du menu non trouvés');
        return;
    }
    
    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Ajouter l'écouteur d'événement au bouton hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu();
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(e) {
        const isMenuOpen = navLinks.classList.contains('active');
        const isClickInsideMenu = navLinks.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);
        
        if (isMenuOpen && !isClickInsideMenu && !isClickOnHamburger) {
            toggleMenu();
        }
    });
    
    // Marquer le lien actif dans la navigation
    function setActiveNavLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Marquer le lien actif dans le menu hamburger
        navLinks.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Marquer le lien actif dans la barre de navigation mobile
        if (mobileTabNav) {
            mobileTabNav.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    
    // Appliquer la classe active au chargement de la page
    setActiveNavLinks();
    
    // Assurer que le hamburger est visible
    hamburger.style.display = 'flex';
    
    // Ajuster le padding-bottom du body pour éviter que la barre de navigation mobile ne cache du contenu
    if (mobileTabNav && window.innerWidth <= 768) {
        document.body.style.paddingBottom = (mobileTabNav.offsetHeight + 10) + 'px';
    }
    
    // Ajuster le padding-bottom lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (mobileTabNav && window.innerWidth <= 768) {
            document.body.style.paddingBottom = (mobileTabNav.offsetHeight + 10) + 'px';
        } else {
            document.body.style.paddingBottom = '0';
        }
    });
});
