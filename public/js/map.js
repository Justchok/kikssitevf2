// Initialisation de la carte
let map;
let currentPopup = null;

function initMap() {
    // Initialisation de la carte avec un style plus moderne
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: false, // On désactive le contrôle de zoom par défaut
        minZoom: 2 // Zoom minimum pour éviter de voir la carte se répéter
    });

    // Ajout du contrôle de zoom dans le coin en haut à droite
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Ajout de la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Destinations avec leurs coordonnées et informations
    const destinations = [
        {
            name: "Paris",
            coords: [48.8566, 2.3522],
            description: "La ville lumière vous attend avec ses monuments emblématiques, sa gastronomie raffinée et son art de vivre unique.",
            image: "/assets/images/destinations/paris.jpg"
        },
        {
            name: "Tokyo",
            coords: [35.6762, 139.6503],
            description: "Découvrez le parfait mélange entre tradition et modernité dans cette métropole fascinante du Japon.",
            image: "/assets/images/destinations/tokyo.jpg"
        },
        {
            name: "New York",
            coords: [40.7128, -74.0060],
            description: "La ville qui ne dort jamais vous invite à explorer ses gratte-ciels, sa culture vibrante et son énergie incomparable.",
            image: "/assets/images/destinations/newyork.jpg"
        },
        {
            name: "Dubai",
            coords: [25.2048, 55.2708],
            description: "Entre désert et modernité, Dubai vous offre une expérience unique au cœur du Moyen-Orient.",
            image: "/assets/images/destinations/dubai.jpg"
        },
        {
            name: "Bangkok",
            coords: [13.7563, 100.5018],
            description: "Immergez-vous dans la culture thaïlandaise, ses temples majestueux et sa cuisine savoureuse.",
            image: "/assets/images/destinations/bangkok.jpg"
        },
        {
            name: "Sydney",
            coords: [-33.8688, 151.2093],
            description: "Entre plages paradisiaques et architecture moderne, Sydney vous promet des moments inoubliables.",
            image: "/assets/images/destinations/sydney.jpg"
        },
        {
            name: "Rio de Janeiro",
            coords: [-22.9068, -43.1729],
            description: "Laissez-vous séduire par les plages de Copacabana, le Corcovado et l'ambiance festive de Rio.",
            image: "/assets/images/destinations/rio.jpg"
        },
        {
            name: "Le Caire",
            coords: [30.0444, 31.2357],
            description: "Explorez les mystères de l'Égypte ancienne et moderne dans cette ville millénaire.",
            image: "/assets/images/destinations/lecaire.jpg"
        }
    ];

    // Création d'une icône personnalisée pour les marqueurs
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Fonction pour créer le contenu de la popup
    function createPopupContent(dest) {
        const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
        const bookNowText = currentLang === 'fr' ? 'Réserver' : 'Book Now';
        
        return `
            <div class="destination-popup">
                <div class="popup-image">
                    <img src="${dest.image}" alt="${dest.name}" onerror="this.src='/assets/images/destinations/default.jpg'">
                </div>
                <div class="popup-content">
                    <h2>${dest.name}</h2>
                    <p>${dest.description}</p>
                    <button onclick="window.location.href='/reservations.html?destination=${encodeURIComponent(dest.name)}'" class="popup-button">
                        ${bookNowText}
                    </button>
                </div>
            </div>
        `;
    }

    // Création des marqueurs pour chaque destination
    destinations.forEach(dest => {
        const marker = L.marker(dest.coords, { icon: customIcon }).addTo(map);
        
        // Création de la popup
        const popup = L.popup({
            maxWidth: 400,
            className: 'custom-popup',
            closeButton: true,
            closeOnClick: false
        }).setContent(() => createPopupContent(dest));

        // Gestionnaire de clic sur le marqueur
        marker.on('click', function(e) {
            // Fermer la popup précédente si elle existe
            if (currentPopup) {
                map.closePopup(currentPopup);
            }
            
            // Ouvrir la nouvelle popup
            popup.setLatLng(e.target.getLatLng());
            popup.openOn(map);
            currentPopup = popup;

            // Centrer la carte sur le marqueur avec animation
            map.flyTo(dest.coords, 5, {
                duration: 1
            });
        });
    });

    // Gestionnaire pour mettre à jour les popups lors du changement de langue
    document.addEventListener('languageChanged', function() {
        if (currentPopup && currentPopup.isOpen()) {
            const dest = destinations.find(d => {
                const popupLatLng = currentPopup.getLatLng();
                return d.coords[0] === popupLatLng.lat && d.coords[1] === popupLatLng.lng;
            });
            if (dest) {
                currentPopup.setContent(createPopupContent(dest));
            }
        }
    });
}

// Initialisation de la carte au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}
