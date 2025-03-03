// Données des destinations
const destinations = [
    {
        name: "Dakar, Sénégal",
        nameEn: "Dakar, Senegal",
        lat: 14.7167,
        lng: -17.4677,
        description: "Capitale du Sénégal, Dakar est une ville vibrante avec une riche culture et de magnifiques plages.",
        descriptionEn: "Capital of Senegal, Dakar is a vibrant city with a rich culture and beautiful beaches.",
        image: "assets/images/destinations/dakar1.jpg",
        category: "ville"
    },
    {
        name: "Paris, France",
        nameEn: "Paris, France",
        lat: 48.8566,
        lng: 2.3522,
        description: "La ville de l'amour avec ses monuments emblématiques comme la Tour Eiffel et le Louvre.",
        descriptionEn: "The city of love with iconic monuments like the Eiffel Tower and the Louvre.",
        image: "assets/images/destinations/paris1.jpg",
        category: "ville"
    },
    {
        name: "Istanbul, Turquie",
        nameEn: "Istanbul, Turkey",
        lat: 41.0082,
        lng: 28.9784,
        description: "Carrefour entre l'Europe et l'Asie, Istanbul offre un riche patrimoine historique et culturel.",
        descriptionEn: "At the crossroads of Europe and Asia, Istanbul offers a rich historical and cultural heritage.",
        image: "assets/images/destinations/istanbul1.jpg",
        category: "ville"
    },
    {
        name: "New York, États-Unis",
        nameEn: "New York, United States",
        lat: 40.7128,
        lng: -74.0060,
        description: "La ville qui ne dort jamais, avec ses gratte-ciels emblématiques et sa diversité culturelle.",
        descriptionEn: "The city that never sleeps, with its iconic skyscrapers and cultural diversity.",
        image: "assets/images/destinations/newyork1.jpg",
        category: "ville"
    },
    {
        name: "Dubaï, Émirats Arabes Unis",
        nameEn: "Dubai, United Arab Emirates",
        lat: 25.2048,
        lng: 55.2708,
        description: "Ville futuriste connue pour ses gratte-ciels impressionnants et son luxe incomparable.",
        descriptionEn: "Futuristic city known for its impressive skyscrapers and unparalleled luxury.",
        image: "assets/images/destinations/dubai1.jpg",
        category: "ville"
    },
    {
        name: "Bangkok, Thaïlande",
        nameEn: "Bangkok, Thailand",
        lat: 13.7563,
        lng: 100.5018,
        description: "Capitale de la Thaïlande, Bangkok est connue pour ses temples, sa cuisine et sa vie nocturne animée.",
        descriptionEn: "Capital of Thailand, Bangkok is known for its temples, cuisine, and vibrant nightlife.",
        image: "assets/images/destinations/bangkok1.jpg",
        category: "ville"
    },
    {
        name: "Casablanca, Maroc",
        nameEn: "Casablanca, Morocco",
        lat: 33.5731,
        lng: -7.5898,
        description: "Plus grande ville du Maroc, Casablanca mélange architecture moderne et traditions marocaines.",
        descriptionEn: "Largest city in Morocco, Casablanca blends modern architecture with Moroccan traditions.",
        image: "assets/images/destinations/casablanca1.jpg",
        category: "ville"
    },
    {
        name: "Abidjan, Côte d'Ivoire",
        nameEn: "Abidjan, Ivory Coast",
        lat: 5.3600,
        lng: -4.0083,
        description: "Centre économique de la Côte d'Ivoire, Abidjan est une métropole dynamique d'Afrique de l'Ouest.",
        descriptionEn: "Economic center of Ivory Coast, Abidjan is a dynamic metropolis in West Africa.",
        image: "assets/images/destinations/abidjan1.jpg",
        category: "ville"
    },
    {
        name: "La Mecque, Arabie Saoudite",
        nameEn: "Mecca, Saudi Arabia",
        lat: 21.4225,
        lng: 39.8262,
        description: "Lieu saint de l'Islam, La Mecque accueille chaque année des millions de pèlerins pour le Hajj.",
        descriptionEn: "Holy site of Islam, Mecca welcomes millions of pilgrims each year for the Hajj.",
        image: "assets/images/destinations/mecque.jpg",
        category: "religieux"
    },
    {
        name: "Kenya, Safari",
        nameEn: "Kenya, Safari",
        lat: -1.2921,
        lng: 36.8219,
        description: "Découvrez la faune africaine dans son habitat naturel lors d'un safari inoubliable au Kenya.",
        descriptionEn: "Discover African wildlife in its natural habitat during an unforgettable safari in Kenya.",
        image: "assets/images/destinations/kenya.jpg",
        category: "nature"
    },
    {
        name: "Maldives",
        nameEn: "Maldives",
        lat: 3.2028,
        lng: 73.2207,
        description: "Paradis tropical avec des plages de sable blanc et des eaux cristallines, idéal pour la détente.",
        descriptionEn: "Tropical paradise with white sandy beaches and crystal-clear waters, perfect for relaxation.",
        image: "assets/images/destinations/maldives.jpg",
        category: "plage"
    },
    {
        name: "Marrakech, Maroc",
        nameEn: "Marrakech, Morocco",
        lat: 31.6295,
        lng: -7.9811,
        description: "Connue pour ses médinas et ses souks colorés, Marrakech est une destination incontournable au Maroc.",
        descriptionEn: "Known for its medinas and colorful souks, Marrakech is a must-visit destination in Morocco.",
        image: "assets/images/destinations/maroc.jpg",
        category: "ville"
    }
];

// Configuration de la carte Leaflet 
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la carte
    const map = L.map('map').setView([14.7167, -17.4677], 3); // Centré sur Dakar, Sénégal

    // Ajout du fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Récupérer la langue actuelle
    const currentLang = localStorage.getItem('language') || 'fr';

    // Textes traduits pour les boutons
    const buttonText = {
        fr: "Réserver maintenant",
        en: "Book now"
    };

    // Ajout des marqueurs sur la carte
    destinations.forEach(destination => {
        // Création du marqueur personnalisé
        const marker = L.marker([destination.lat, destination.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div class="marker-pin"></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            })
        }).addTo(map);
        
        // Déterminer le nom et la description en fonction de la langue
        const destName = currentLang === 'fr' ? destination.name : destination.nameEn;
        const destDesc = currentLang === 'fr' ? destination.description : destination.descriptionEn;
        const bookButtonText = buttonText[currentLang];
        
        // Création du contenu du popup
        const popupContent = `
            <div class="destination-popup">
                <div class="popup-image">
                    <img src="${destination.image}" alt="${destName}">
                </div>
                <div class="popup-content">
                    <h2>${destName}</h2>
                    <p>${destDesc}</p>
                    <button class="popup-button" onclick="window.location.href='reservations.html'">${bookButtonText}</button>
                </div>
            </div>
        `;
        
        // Ajout du popup au marqueur
        marker.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 350
        });
    });

    // Mettre à jour les popups lors du changement de langue
    window.addEventListener('languageChanged', function(e) {
        // Fermer tous les popups ouverts
        map.closePopup();
        
        // Supprimer tous les marqueurs existants
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        // Récréer les marqueurs avec la nouvelle langue
        const newLang = e.detail.language;
        
        destinations.forEach(destination => {
            // Création du marqueur personnalisé
            const marker = L.marker([destination.lat, destination.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div class="marker-pin"></div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                })
            }).addTo(map);
            
            // Déterminer le nom et la description en fonction de la langue
            const destName = newLang === 'fr' ? destination.name : destination.nameEn;
            const destDesc = newLang === 'fr' ? destination.description : destination.descriptionEn;
            const bookButtonText = buttonText[newLang];
            
            // Création du contenu du popup
            const popupContent = `
                <div class="destination-popup">
                    <div class="popup-image">
                        <img src="${destination.image}" alt="${destName}">
                    </div>
                    <div class="popup-content">
                        <h2>${destName}</h2>
                        <p>${destDesc}</p>
                        <button class="popup-button" onclick="window.location.href='reservations.html'">${bookButtonText}</button>
                    </div>
                </div>
            `;
            
            // Ajout du popup au marqueur
            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                maxWidth: 350
            });
        });
    });
});
