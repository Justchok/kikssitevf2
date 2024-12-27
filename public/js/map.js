// Initialisation de la carte
function initMap() {
    const map = L.map('map').setView([20, 0], 2);

    // Ajout de la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Destinations avec leurs coordonnées et informations
    const destinations = [
        {
            name: "Paris",
            coords: [48.8566, 2.3522],
            descriptionKey: "parisDesc",
            image: "assets/images/destinations/paris.jpg"
        },
        {
            name: "Tokyo",
            coords: [35.6762, 139.6503],
            descriptionKey: "tokyoDesc",
            image: "assets/images/destinations/tokyo.jpg"
        },
        {
            name: "New York",
            coords: [40.7128, -74.0060],
            descriptionKey: "newyorkDesc",
            image: "assets/images/destinations/newyork.jpg"
        },
        {
            name: "Dubai",
            coords: [25.2048, 55.2708],
            descriptionKey: "dubaiDesc",
            image: "assets/images/destinations/dubai.jpg"
        },
        {
            name: "Bangkok",
            coords: [13.7563, 100.5018],
            descriptionKey: "bangkokDesc",
            image: "assets/images/destinations/bangkok.jpg"
        },
        {
            name: "Sydney",
            coords: [-33.8688, 151.2093],
            descriptionKey: "sydneyDesc",
            image: "assets/images/destinations/sydney.jpg"
        },
        {
            name: "Rio de Janeiro",
            coords: [-22.9068, -43.1729],
            descriptionKey: "rioDesc",
            image: "assets/images/destinations/rio.jpg"
        },
        {
            name: "Le Caire",
            coords: [30.0444, 31.2357],
            descriptionKey: "cairoDesc",
            image: "assets/images/destinations/lecaire.jpg"
        }
    ];

    // Fonction pour créer le contenu de la popup avec la langue actuelle
    function createPopupContent(dest) {
        const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
        const description = translations[currentLang][dest.descriptionKey] || dest.name;
        const bookNowText = translations[currentLang].bookNow || 'Réserver';
        
        return `
            <div class="map-popup">
                <div class="popup-image">
                    <img src="${dest.image}" alt="${dest.name}">
                </div>
                <h3>${dest.name}</h3>
                <p>${description}</p>
                <a href="/reservations.html?destination=${dest.name}" class="popup-button">${bookNowText}</a>
            </div>
        `;
    }

    // Création des marqueurs pour chaque destination
    const markers = destinations.map(dest => {
        const marker = L.marker(dest.coords).addTo(map);
        
        // Popup personnalisée avec style et image
        marker.bindPopup(() => createPopupContent(dest), {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        // Animation au survol
        marker.on('mouseover', function (e) {
            this.openPopup();
        });

        return marker;
    });

    // Ajout de l'effet de zoom fluide
    map.on('popupopen', function(e) {
        const px = map.project(e.target._popup._latlng);
        px.y -= e.target._popup._container.clientHeight/2;
        map.panTo(map.unproject(px), {animate: true});
    });

    // Mettre à jour les popups quand la langue change
    document.addEventListener('languageChanged', function(e) {
        markers.forEach(marker => {
            if (marker.isPopupOpen()) {
                marker.getPopup().setContent(createPopupContent(
                    destinations.find(d => d.coords[0] === marker.getLatLng().lat && d.coords[1] === marker.getLatLng().lng)
                ));
            }
        });
    });
}

// Initialisation de la carte au chargement de la page
document.addEventListener('DOMContentLoaded', initMap);
