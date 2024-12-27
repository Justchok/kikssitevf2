// Destinations populaires
const destinations = [
    { 
        name: 'Paris',
        country: 'France',
        lat: 48.8566,
        lon: 2.3522,
        images: [
            './assets/images/destinations/paris1.jpg',
            './assets/images/destinations/paris2.jpg',
            './assets/images/destinations/paris3.jpg'
        ],
        description: 'La ville lumière, célèbre pour la Tour Eiffel et son art de vivre. Découvrez ses musées mondialement connus, sa gastronomie raffinée et son architecture unique.'
    },
    { 
        name: 'Dubai',
        country: 'Émirats arabes unis',
        lat: 25.2048,
        lon: 55.2708,
        images: [
            './assets/images/destinations/dubai1.jpg',
            './assets/images/destinations/dubai2.jpg',
            './assets/images/destinations/dubai3.jpg'
        ],
        description: 'Une ville futuriste au cœur du désert, mêlant luxe et tradition. Des gratte-ciels impressionnants aux souks traditionnels, Dubai ne cesse d\'émerveiller.'
    },
    { 
        name: 'Istanbul',
        country: 'Turquie',
        lat: 41.0082,
        lon: 28.9784,
        images: [
            './assets/images/destinations/istanbul1.jpg',
            './assets/images/destinations/istanbul2.jpg',
            './assets/images/destinations/istanbul3.jpg'
        ],
        description: 'Le pont entre l\'Europe et l\'Asie, riche en histoire et en culture. Visitez la majestueuse Sainte-Sophie, le Grand Bazar et savourez la cuisine turque.'
    },
    { 
        name: 'New York',
        country: 'États-Unis',
        lat: 40.7128,
        lon: -74.0060,
        images: [
            './assets/images/destinations/newyork1.jpg',
            './assets/images/destinations/newyork2.jpg',
            './assets/images/destinations/newyork3.jpg'
        ],
        description: 'La ville qui ne dort jamais, capitale mondiale du divertissement. De Times Square à Central Park, chaque quartier raconte une histoire unique.'
    },
    { 
        name: 'Bangkok',
        country: 'Thaïlande',
        lat: 13.7563,
        lon: 100.5018,
        images: [
            './assets/images/destinations/bangkok1.jpg',
            './assets/images/destinations/bangkok2.jpg',
            './assets/images/destinations/bangkok3.jpg'
        ],
        description: 'Une métropole vibrante aux temples dorés et à la cuisine exquise. Explorez ses marchés animés et ses sanctuaires paisibles.'
    },
    { 
        name: 'Dakar',
        country: 'Sénégal',
        lat: 14.7167,
        lon: -17.4677,
        images: [
            './assets/images/destinations/dakar1.jpg',
            './assets/images/destinations/dakar2.jpg',
            './assets/images/destinations/dakar3.jpg'
        ],
        description: 'La capitale dynamique du Sénégal, entre océan et culture. Découvrez ses plages magnifiques, ses marchés colorés et sa scène artistique vibrante.'
    },
    { 
        name: 'Casablanca',
        country: 'Maroc',
        lat: 33.5731,
        lon: -7.5898,
        images: [
            './assets/images/destinations/casablanca1.jpg',
            './assets/images/destinations/casablanca2.jpg',
            './assets/images/destinations/casablanca3.jpg'
        ],
        description: 'Le cœur économique du Maroc, mêlant modernité et tradition. Visitez la magnifique mosquée Hassan II et promenez-vous dans la médina historique.'
    },
    { 
        name: 'Abidjan',
        country: 'Côte d\'Ivoire',
        lat: 5.3600,
        lon: -4.0083,
        images: [
            './assets/images/destinations/abidjan1.jpg',
            './assets/images/destinations/abidjan2.jpg',
            './assets/images/destinations/abidjan3.jpg'
        ],
        description: 'La perle des lagunes, capitale économique de la Côte d\'Ivoire. Découvrez son architecture moderne, ses marchés animés et sa vie nocturne dynamique.'
    }
];

// Initialiser la carte
let map = null;
let markers = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateDestinations();
});

function initMap() {
    map = L.map('map').setView([14.7167, -17.4677], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    destinations.forEach(dest => {
        const marker = L.marker([dest.lat, dest.lon])
            .bindPopup(createPopupContent(dest))
            .addTo(map);
        markers.push(marker);
    });
}

function createPopupContent(destination) {
    const popupContent = document.createElement('div');
    popupContent.className = 'custom-popup';
    popupContent.innerHTML = `
        <div class="popup-image">
            <img src="${destination.images[0]}" alt="${destination.name}" 
                 onerror="this.src='./assets/images/destinations/default.jpg'">
            <div class="image-navigation">
                <button onclick="changeImage('${destination.name}', 'prev')" class="nav-btn prev">❮</button>
                <button onclick="changeImage('${destination.name}', 'next')" class="nav-btn next">❯</button>
            </div>
        </div>
        <div class="popup-content">
            <h3>${destination.name}</h3>
            <h4>${destination.country}</h4>
            <p>${destination.description}</p>
            <button onclick="redirectToBooking('${destination.name}')" class="popup-button">
                Réserver maintenant
            </button>
        </div>
    `;
    return popupContent;
}

function changeImage(destinationName, direction) {
    const destination = destinations.find(d => d.name === destinationName);
    const currentPopup = document.querySelector('.custom-popup');
    if (!currentPopup) return;

    const img = currentPopup.querySelector('.popup-image img');
    let index = destination.images.indexOf(img.src.split('/').pop());
    
    if (direction === 'next') {
        index = (index + 1) % destination.images.length;
    } else {
        index = (index - 1 + destination.images.length) % destination.images.length;
    }
    
    img.src = destination.images[index];
}

function populateDestinations() {
    const grid = document.getElementById('destinations-grid');
    grid.innerHTML = '';
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="destination-image">
                <img src="${dest.images[0]}" alt="${dest.name}" 
                     onerror="this.src='./assets/images/destinations/default.jpg'">
            </div>
            <div class="destination-info">
                <h4>${dest.name}</h4>
                <p>${dest.country}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            map.setView([dest.lat, dest.lon], 6);
            markers.find(marker => 
                marker.getLatLng().lat === dest.lat && 
                marker.getLatLng().lng === dest.lon
            ).openPopup();
        });
        grid.appendChild(card);
    });
}

function redirectToBooking(destination) {
    const reservationSection = document.querySelector('#reservation');
    reservationSection.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        const destinationInput = document.querySelector('#destination');
        if (destinationInput) {
            destinationInput.value = destination;
            destinationInput.dispatchEvent(new Event('input'));
        }
    }, 1000); 
}
