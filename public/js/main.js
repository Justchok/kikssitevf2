// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        // Toggle du menu
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Fermer le menu au clic en dehors
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Fermer le menu au scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll) {
                navLinks.classList.remove('active');
            }
            lastScroll = currentScroll;
        });
    }

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

    // Empêcher la fermeture du menu lors du clic à l'intérieur
    navLinks.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
