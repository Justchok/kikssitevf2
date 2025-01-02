const destinations = [
    {
        name: 'Paris',
        description: 'La ville de l\'amour et de la lumière',
        image: '/assets/images/destinations/paris.jpeg',
        price: '850 000 FCFA'
    },
    {
        name: 'Dubai',
        description: 'La perle du Moyen-Orient',
        image: '/assets/images/destinations/dubai.jpg',
        price: '1 250 000 FCFA'
    },
    {
        name: 'Istanbul',
        description: 'Le carrefour des civilisations',
        image: '/assets/images/destinations/istanbul.jpg',
        price: '950 000 FCFA'
    }
    // Add more destinations as needed
];

let currentDestinationIndex = 0;

function updateDestinationDisplay() {
    const destination = destinations[currentDestinationIndex];
    const destinationDisplay = document.getElementById('destination-display');
    
    destinationDisplay.innerHTML = `
        <div class="destination-card">
            <img src="${destination.image}" alt="${destination.name}" class="destination-image">
            <div class="destination-info">
                <h2>${destination.name}</h2>
                <p>${destination.description}</p>
                <p class="price">${destination.price}</p>
                <button onclick="redirectToReservation('${destination.name}')" class="btn-primary">Réserver maintenant</button>
            </div>
        </div>
    `;
}

function nextDestination() {
    currentDestinationIndex = (currentDestinationIndex + 1) % destinations.length;
    updateDestinationDisplay();
}

function previousDestination() {
    currentDestinationIndex = (currentDestinationIndex - 1 + destinations.length) % destinations.length;
    updateDestinationDisplay();
}

function redirectToReservation(destination) {
    window.location.href = `/reservations.html?destination=${encodeURIComponent(destination)}`;
}

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDestinationDisplay();
});
