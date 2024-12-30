// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug

    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    console.log('Menu button:', menuBtn); // Debug
    console.log('Nav links:', navLinks); // Debug

    // Vérifier si les éléments existent
    if (!menuBtn || !navLinks) {
        console.error('Menu elements not found');
        return;
    }

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log('Toggling menu'); // Debug
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }

    // Gestionnaire d'événement pour le bouton menu
    menuBtn.addEventListener('click', toggleMenu);

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Link clicked'); // Debug
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(event) {
        const isClickInside = navLinks.contains(event.target) || menuBtn.contains(event.target);
        if (!isClickInside && navLinks.classList.contains('active')) {
            console.log('Clicking outside, closing menu'); // Debug
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
