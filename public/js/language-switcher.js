// Fonction pour changer la langue active
function switchLanguage(lang) {
    // Sauvegarder la langue sélectionnée
    localStorage.setItem('selectedLanguage', lang);
    
    // Mettre à jour les boutons de langue
    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.classList.remove('active');
        if (button.querySelector(`img[alt="${lang}"]`)) {
            button.classList.add('active');
        }
    });
    
    // Mettre à jour tous les textes
    updateContent(lang);
}

// Fonction pour mettre à jour le contenu dans la langue sélectionnée
function updateContent(lang) {
    // Mettre à jour les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Mettre à jour les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Mettre à jour les titres (title attribute)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (translations[lang] && translations[lang][key]) {
            element.title = translations[lang][key];
        }
    });
}

function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function updatePageTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key] && translations[key][lang]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[key][lang];
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[key][lang];
            } else {
                element.textContent = translations[key][lang];
            }
        }
    });
}

function changeLanguage(lang) {
    // Update current language display
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    document.getElementById('current-flag').src = `/assets/images/icons/icone${lang === 'fr' ? 'fr' : 'eng'}.jpeg`;

    // Hide menu after selection
    document.getElementById('language-menu').style.display = 'none';

    // Update translations on current page
    updatePageTranslations(lang);

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);

    // Update page URLs if needed
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('#')) {
            link.href = href;
        }
    });
}

// Load preferred language on page load
document.addEventListener('DOMContentLoaded', () => {
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    
    // Set initial language
    changeLanguage(preferredLanguage);

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
        const languageSwitcher = document.querySelector('.language-switcher');
        const menu = document.getElementById('language-menu');
        
        if (!languageSwitcher.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // Add language switcher to all pages if not present
    if (!document.querySelector('.language-switcher')) {
        const nav = document.querySelector('.nav-links');
        if (nav) {
            const languageSwitcher = document.createElement('div');
            languageSwitcher.className = 'language-switcher';
            languageSwitcher.innerHTML = `
                <button class="language-btn" onclick="toggleLanguageMenu()">
                    <img src="/assets/images/icons/iconefr.jpeg" alt="French Flag" id="current-flag">
                    <span id="current-lang">FR</span>
                </button>
                <div class="language-menu" id="language-menu">
                    <div class="language-option" onclick="changeLanguage('fr')">
                        <img src="/assets/images/icons/iconefr.jpeg" alt="French Flag">
                        <span>FR</span>
                    </div>
                    <div class="language-option" onclick="changeLanguage('en')">
                        <img src="/assets/images/icons/iconeeng.jpeg" alt="English Flag">
                        <span>EN</span>
                    </div>
                </div>
            `;
            nav.appendChild(languageSwitcher);
        }
    }
});
