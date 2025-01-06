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

// Fonction pour afficher/masquer le menu de langues
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Fonction pour changer la langue
function changeLanguage(lang) {
    // Sauvegarder la langue dans localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Mettre à jour l'affichage du bouton
    const currentFlag = document.getElementById('currentFlag');
    const currentLang = document.getElementById('currentLang');
    
    if (lang === 'fr') {
        currentFlag.src = 'assets/images/icons/iconefr.jpeg';
        currentFlag.alt = 'Français';
        currentLang.textContent = 'FR';
    } else {
        currentFlag.src = 'assets/images/icons/iconeeng.jpeg';
        currentFlag.alt = 'English';
        currentLang.textContent = 'EN';
    }
    
    // Mettre à jour le contenu
    updateContent(lang);
    
    // Fermer le menu
    const menu = document.getElementById('languageMenu');
    menu.style.display = 'none';
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
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Charger la langue préférée ou utiliser le français par défaut
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    changeLanguage(preferredLanguage);
    
    // Fermer le menu de langue si on clique en dehors
    document.addEventListener('click', (e) => {
        const languageMenu = document.getElementById('languageMenu');
        const languageBtn = document.querySelector('.language-btn');
        
        if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
            languageMenu.style.display = 'none';
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
                    <img src="/assets/images/icons/iconefr.jpeg" alt="French Flag" id="currentFlag">
                    <span id="currentLang">FR</span>
                </button>
                <div class="language-menu" id="languageMenu">
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
