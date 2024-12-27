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

// Charger la langue sauvegardée ou utiliser le français par défaut
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'fr';
    switchLanguage(savedLanguage);
});
