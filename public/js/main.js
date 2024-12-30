// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    let isAnimating = false;
    
    if (hamburger && navLinks) {
        // Animation du menu
        hamburger.addEventListener('click', function(e) {
            if (isAnimating) return;
            isAnimating = true;
            
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Bloquer/débloquer le scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            // Animation des liens
            if (navLinks.classList.contains('active')) {
                navLinksItems.forEach((link, index) => {
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, 100 * index);
                });
            } else {
                navLinksItems.forEach(link => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(20px)';
                });
            }
            
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        });

        // Fermer le menu au clic sur un lien
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    navLinksItems.forEach(link => {
                        link.style.opacity = '0';
                        link.style.transform = 'translateY(20px)';
                    });
                }
            });
        });

        // Gestion de la hauteur sur mobile
        function updateMobileHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        updateMobileHeight();
        window.addEventListener('resize', () => {
            updateMobileHeight();
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                navLinksItems.forEach(link => {
                    link.style.opacity = '1';
                    link.style.transform = 'none';
                });
            }
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

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Empêcher la fermeture du menu lors du clic à l'intérieur
    navLinks.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
