document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la carte
    const map = L.map('map').setView([14.7167, -17.4677], 3);

    // Ajouter le fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Données des destinations
    const destinations = [
        {
            name: "Paris",
            country: "France",
            coordinates: [48.8566, 2.3522],
            image: "assets/images/destinations/paris.jpg",
            description: "Découvrez la ville lumière, ses monuments emblématiques et sa gastronomie raffinée."
        },
        {
            name: "Dakar",
            country: "Sénégal",
            coordinates: [14.7167, -17.4677],
            image: "assets/images/destinations/dakar.jpg",
            description: "Vivez l'authenticité de l'Afrique de l'Ouest dans cette ville dynamique au bord de l'océan."
        },
        {
            name: "Bangkok",
            country: "Thaïlande",
            coordinates: [13.7563, 100.5018],
            image: "assets/images/destinations/bangkok.jpg",
            description: "Immergez-vous dans la culture thaïlandaise, entre temples ancestraux et cuisine épicée."
        },
        {
            name: "New York",
            country: "États-Unis",
            coordinates: [40.7128, -74.0060],
            image: "assets/images/destinations/newyork.jpg",
            description: "La ville qui ne dort jamais vous attend pour une expérience urbaine unique."
        }
    ];

    // Fonction pour créer un marqueur personnalisé
    function createCustomMarker() {
        return L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-pin"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    // Fonction pour créer le contenu d'une popup
    function createPopupContent(destination) {
        return `
            <div class="destination-popup">
                <div class="popup-image">
                    <img src="${destination.image}" alt="${destination.name}">
                </div>
                <div class="popup-content">
                    <h2>${destination.name}, ${destination.country}</h2>
                    <p>${destination.description}</p>
                    <a href="reservations.html?destination=${encodeURIComponent(destination.name)}" class="popup-button">Réserver</a>
                </div>
            </div>
        `;
    }

    // Ajouter les marqueurs pour chaque destination
    destinations.forEach(destination => {
        const marker = L.marker(destination.coordinates, {
            icon: createCustomMarker()
        }).addTo(map);

        // Au lieu d'une popup, rediriger directement vers la page de réservation
        marker.on('click', () => {
            window.location.href = `reservations.html?destination=${encodeURIComponent(destination.name)}`;
        });
    });
});
