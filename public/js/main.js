// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Vérifier si les éléments existent
    if (!menuBtn || !navLinks) {
        console.error('Menu elements not found');
        return;
    }

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        console.log('Toggle menu');
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }

    // Gestionnaire d'événement pour le bouton menu
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(event) {
        const isClickInside = navLinks.contains(event.target) || menuBtn.contains(event.target);
        if (!isClickInside && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Gestion du scroll avec debounce
    let scrollTimeout;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset;
            
            if (!navLinks.classList.contains('active')) {
                if (currentScroll > lastScroll && currentScroll > 80) {
                    // Scroll vers le bas
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scroll vers le haut
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScroll = currentScroll;
        }, 100);
    });
});
