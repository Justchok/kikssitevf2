// Your other JavaScript code can go here
document.addEventListener('DOMContentLoaded', function() {
    // Get menu elements
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuLinks = document.querySelectorAll('.nav-links a');
    const navToggleLabel = document.querySelector('.nav-toggle-label');

    // Set initial menu button text
    navToggleLabel.innerHTML = '☰';

    // Handle menu toggle
    navToggle.addEventListener('change', function() {
        navToggleLabel.innerHTML = this.checked ? '×' : '☰';
    });

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navToggle.checked = false;
                navToggleLabel.innerHTML = '☰';
            }
        });
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.checked = false;
            navToggleLabel.innerHTML = '☰';
        }
    });

    // Set active menu item
    const currentPath = window.location.pathname;
    mobileMenuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
