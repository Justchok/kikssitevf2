// Your other JavaScript code can go here
document.addEventListener('DOMContentLoaded', function() {
    // Get menu elements
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuLinks = document.querySelectorAll('.nav-links a');

    // Handle menu toggle
    navToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnToggle = event.target.closest('.nav-toggle-label');
            
            if (!isClickInsideMenu && !isClickOnToggle && navToggle.checked) {
                navToggle.checked = false;
                document.body.style.overflow = '';
            }
        }
    });

    // Close mobile menu when clicking links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navToggle.checked = false;
                document.body.style.overflow = '';
            }
        });
    });

    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.checked = false;
            document.body.style.overflow = '';
        }
    });
});
