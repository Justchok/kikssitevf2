console.log('Language switcher script loaded');

// Stockage global des traductions
let translations = {
    fr: {
        "menuHome": "Accueil",
        "menuDestinations": "Destinations",
        "menuOffers": "Offres",
        "menuReservation": "Réservation",
        "menuContact": "Contact",
        "menuAbout": "À propos",
        "homeTitle": "Voyagez avec Kiks Travel",
        "homeSubtitle": "Découvrez des destinations exceptionnelles",
        "bookNow": "Réserver maintenant",
        "offersTitle": "Nos Offres Spéciales",
        "offersDescription": "Découvrez nos meilleures offres pour des voyages inoubliables",
        "contactUs": "Contactez-nous",
        "firstName": "Prénom",
        "lastName": "Nom",
        "email": "Email",
        "phone": "Téléphone",
        "message": "Message",
        "send": "Envoyer",
        "aboutTitle": "À propos de nous",
        "aboutDesc": "Kiks Travel est une agence de voyage basée à Dakar, Sénégal, spécialisée dans les voyages sur mesure et les services de billetterie. Notre équipe expérimentée vous accompagne dans la planification de vos voyages d'affaires ou de loisirs avec un service personnalisé et des prix compétitifs.",
        "aboutMission": "Notre mission est de vous offrir des expériences de voyage inoubliables, en prenant soin de chaque détail pour que vous puissiez profiter pleinement de votre séjour.",
        "companyDesc": "Votre partenaire de confiance pour des voyages inoubliables.",
        "contactTitle": "Contact",
        "address": "Adresse",
        "followUs": "Suivez-nous",
        "servicesTitle": "Nos Services",
        "servicesDesc": "Nous offrons une gamme complète de services de voyage, y compris la réservation de billets d'avion, d'hôtels, de transferts, et l'organisation de circuits touristiques personnalisés.",
        "visionTitle": "Notre Vision",
        "visionDesc": "Devenir l'agence de voyage de référence en Afrique de l'Ouest, reconnue pour son excellence, son professionnalisme et son engagement envers la satisfaction client.",
        "valuesTitle": "Nos Valeurs",
        "valuesDesc": "Intégrité, excellence, innovation et passion sont les valeurs qui guident chacune de nos actions pour vous offrir un service de qualité supérieure.",
        "teamTitle": "Notre Équipe",
        "teamDesc": "Rencontrez les experts passionnés qui travaillent pour rendre vos voyages inoubliables.",
        "founderCEO": "Fondateur & PDG",
        "travelConsultant": "Conseillère en Voyage",
        "marketingManager": "Responsable Marketing",
        "customerService": "Service Client",
        "about.title": "À propos - Kiks Travel Tours",
        "about.header": "À propos de Kiks Travel Tours",
        "about.description": "Votre partenaire de confiance pour des voyages d'exception. Depuis notre création, nous nous efforçons de créer des expériences de voyage uniques et mémorables pour nos clients.",
        "mission.title": "Notre Mission",
        "mission.description": "Offrir des services de voyage exceptionnels et personnalisés, en mettant l'accent sur la qualité, la sécurité et la satisfaction de nos clients.",
        "values.title": "Nos Valeurs",
        "values.description": "Excellence, intégrité, professionnalisme et attention personnalisée sont au cœur de tout ce que nous faisons.",
        "commitment.title": "Notre Engagement",
        "commitment.description": "Nous nous engageons à créer des moments inoubliables et à accompagner nos clients à chaque étape de leur voyage.",
        "team.title": "Notre Équipe",
        "team.description": "Découvrez les personnes passionnées qui font de vos rêves de voyage une réalité."
    },
    en: {
        "menuHome": "Home",
        "menuDestinations": "Destinations",
        "menuOffers": "Offers",
        "menuReservation": "Booking",
        "menuContact": "Contact",
        "menuAbout": "About",
        "homeTitle": "Travel with Kiks Travel",
        "homeSubtitle": "Discover exceptional destinations",
        "bookNow": "Book Now",
        "offersTitle": "Our Special Offers",
        "offersDescription": "Discover our best deals for unforgettable trips",
        "contactUs": "Contact Us",
        "firstName": "First Name",
        "lastName": "Last Name",
        "email": "Email",
        "phone": "Phone",
        "message": "Message",
        "send": "Send",
        "aboutTitle": "About Us",
        "aboutDesc": "Kiks Travel is a travel agency based in Dakar, Senegal, specializing in tailor-made trips and ticketing services. Our experienced team accompanies you in planning your business or leisure trips with personalized service and competitive prices.",
        "aboutMission": "Our mission is to offer you unforgettable travel experiences, taking care of every detail so that you can fully enjoy your stay.",
        "companyDesc": "Your trusted partner for unforgettable journeys.",
        "contactTitle": "Contact",
        "address": "Address",
        "followUs": "Follow Us",
        "servicesTitle": "Our Services",
        "servicesDesc": "We offer a complete range of travel services, including airline tickets, hotel bookings, transfers, and custom tour organization.",
        "visionTitle": "Our Vision",
        "visionDesc": "To become the reference travel agency in West Africa, recognized for its excellence, professionalism and commitment to customer satisfaction.",
        "valuesTitle": "Our Values",
        "valuesDesc": "Integrity, excellence, innovation and passion are the values that guide each of our actions to offer you superior service.",
        "teamTitle": "Our Team",
        "teamDesc": "Meet the passionate experts who work to make your travels unforgettable.",
        "founderCEO": "Founder & CEO",
        "travelConsultant": "Travel Consultant",
        "marketingManager": "Marketing Manager",
        "customerService": "Customer Service",
        "about.title": "About - Kiks Travel Tours",
        "about.header": "About Kiks Travel Tours",
        "about.description": "Your trusted partner for exceptional travel experiences. Since our inception, we have strived to create unique and memorable travel experiences for our clients.",
        "mission.title": "Our Mission",
        "mission.description": "To provide exceptional and personalized travel services, with an emphasis on quality, safety, and customer satisfaction.",
        "values.title": "Our Values",
        "values.description": "Excellence, integrity, professionalism, and personalized attention are at the heart of everything we do.",
        "commitment.title": "Our Commitment",
        "commitment.description": "We are committed to creating unforgettable moments and accompanying our clients at every stage of their journey.",
        "team.title": "Our Team",
        "team.description": "Discover the passionate people who make your travel dreams a reality."
    }
};

// Fonction pour changer la langue
function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    // Sauvegarder la préférence de langue
    localStorage.setItem('preferredLanguage', lang);
    
    // Mettre à jour l'interface du sélecteur
    updateLanguageSelector(lang);
    
    // Appliquer les traductions
    applyLanguage(lang);
    
    console.log('Language changed successfully to:', lang);
}

// Fonction pour appliquer les traductions selon la langue
function applyLanguage(lang) {
    console.log('Applying language:', lang);
    
    // Charger le fichier de traduction approprié
    fetch(`translations/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            return response.json();
        })
        .then(translations => {
            console.log('Translations loaded:', Object.keys(translations).length, 'keys');
            
            // Appliquer les traductions à tous les éléments avec l'attribut data-i18n
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[key]) {
                    // Si l'élément est un input avec un placeholder
                    if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                        element.placeholder = translations[key];
                    } 
                    // Si l'élément est un bouton ou a une valeur
                    else if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
                        if (element.hasAttribute('value')) {
                            element.value = translations[key];
                        } else {
                            element.textContent = translations[key];
                        }
                    } 
                    // Pour tous les autres éléments
                    else {
                        element.textContent = translations[key];
                    }
                    console.log(`Translated ${key} to: ${translations[key]}`);
                } else {
                    console.warn(`Translation key not found: ${key}`);
                }
            });
            
            // Mettre à jour les attributs title et alt qui ont data-i18n-attr
            document.querySelectorAll('[data-i18n-attr]').forEach(element => {
                const keyValue = element.getAttribute('data-i18n-attr').split(':');
                if (keyValue.length === 2) {
                    const [attr, key] = keyValue;
                    if (translations[key]) {
                        element.setAttribute(attr, translations[key]);
                        console.log(`Translated attribute ${attr} with key ${key} to: ${translations[key]}`);
                    }
                }
            });
            
            console.log('Translation complete');
        })
        .catch(error => {
            console.error('Error applying translations:', error);
        });
}

// Fonction pour mettre à jour l'interface du sélecteur de langue
function updateLanguageSelector(lang) {
    console.log('Updating language selector:', lang);
    // Mettre à jour le drapeau et le texte dans le sélecteur
    const currentFlag = document.getElementById('current-language-flag');
    const currentName = document.getElementById('current-language-name');
    
    if (currentFlag) {
        currentFlag.src = `assets/images/icons/icone${lang}.jpeg`;
        currentFlag.alt = lang === 'fr' ? 'Français' : 'English';
        console.log('Updated flag image:', currentFlag.src);
    } else {
        console.error('Current flag image not found!');
    }
    
    if (currentName) {
        currentName.textContent = lang === 'fr' ? 'Français' : 'English';
    }
}

// Fonction pour basculer le menu des langues
function toggleLanguageMenu() {
    console.log('Toggle language menu clicked');
    const options = document.querySelector('.language-options');
    if (options) {
        options.classList.toggle('show');
        console.log('Menu visibility toggled');
    } else {
        console.error('Language options not found!');
    }
}

// Gestionnaire de clic sur le document pour fermer le menu
document.addEventListener('click', (event) => {
    const options = document.querySelector('.language-options');
    const selectedLang = document.querySelector('.selected-language');
    
    if (options && options.classList.contains('show') && 
        !options.contains(event.target) && 
        !selectedLang.contains(event.target)) {
        options.classList.remove('show');
        console.log('Menu closed by outside click');
    }
});

// Ajouter le script à toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Charger le script de changement de langue
    if (!document.querySelector('script[src="js/language-switcher.js"]')) {
        const script = document.createElement('script');
        script.src = 'js/language-switcher.js';
        document.head.appendChild(script);
    }
    
    // Initialiser le sélecteur de langue
    console.log('DOM Content Loaded - Initializing language switcher');
    
    // Forcer le français comme langue par défaut si aucune préférence n'est sauvegardée
    if (!localStorage.getItem('preferredLanguage')) {
        localStorage.setItem('preferredLanguage', 'fr');
    }
    
    // Appliquer la langue sauvegardée ou par défaut
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    console.log('Initial language:', savedLang);
    
    // Appliquer la langue sauvegardée
    applyLanguage(savedLang);
    updateLanguageSelector(savedLang);
    
    // Ajouter l'écouteur pour le bouton de langue
    const selectedLanguage = document.querySelector('.selected-language');
    if (selectedLanguage) {
        console.log('Selected language element found, adding click listener');
        selectedLanguage.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLanguageMenu();
        });
    } else {
        console.error('Selected language element not found!');
    }
    
    // Ajouter les écouteurs d'événements pour le changement de langue
    const langOptions = document.querySelectorAll('.lang-option');
    console.log('Found language options:', langOptions.length);
    
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            console.log('Language option clicked:', lang);
            changeLanguage(lang);
            const options = document.querySelector('.language-options');
            if (options) options.classList.remove('show');
        });
    });
});
