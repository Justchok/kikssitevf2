document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.classList.toggle('active');
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('show');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // Ajouter une classe au body pour détecter si c'est la page d'accueil
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    document.body.classList.toggle('home-page', isHomePage);

    // Gérer la transparence de la navigation sur la page d'accueil
    if (isHomePage) {
        const nav = document.querySelector('.nav-bar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scroll vers le bas
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                // Scroll vers le haut
                nav.style.background = 'transparent';
            }
            
            lastScrollTop = scrollTop;
        });
    }
});
