// Menu mobile simple
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Gestion du scroll avec debounce
    let lastScroll = 0;
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

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Empêcher la fermeture du menu lors du clic à l'intérieur
    navLinks.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
