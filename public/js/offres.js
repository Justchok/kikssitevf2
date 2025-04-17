import config from './config.js';

const offers = [
    {
        title: 'Hajj 2025',
        description: 'Un voyage spirituel unique à La Mecque. Vivez une expérience inoubliable pendant le pèlerinage du Hajj.',
        image: './assets/images/destinations/hajj.jpg',
        flyerImage: './assets/images/flyers/hajj2025.jpg',
        prices: {
            confort: '5 500 000 FCFA',
            confortPlus: '10 500 000 FCFA'
        },
        destination: 'La Mecque',
        features: [
            'Vol aller-retour',
            'Hébergement en hôtel',
            'Transport sur place',
            'Guide spirituel',
            'Visa Hajj inclus',
            'Pension complète',
            'Navette Hôtel - Haram',
            'Tente à Mina climatisée'
        ]
    }
];

function displayOffers() {
    const offersContainer = document.querySelector('.offers-container') || document.createElement('div');
    offersContainer.className = 'offers-container';
    offersContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    `;

    offersContainer.innerHTML = offers.map(offer => `
        <div class="offer-card" style="
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
            cursor: pointer;
        " data-offer-title="${offer.title}">
            <img src="${offer.image}" alt="${offer.title}" style="
                width: 100%;
                height: 200px;
                object-fit: cover;
            ">
            <div style="padding: 1.5rem;">
                <h3 style="
                    color: #333;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                ">${offer.title}</h3>
                <p style="
                    color: #666;
                    margin-bottom: 1rem;
                    line-height: 1.6;
                ">${offer.description}</p>
                ${offer.prices ? `
                    <div style="margin-bottom: 1rem;">
                        <p style="color: #007bff; font-weight: 600; margin-bottom: 0.5rem;">Prix par personne:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>Formule Confort: ${offer.prices.confort}</li>
                            <li>Formule Confort+: ${offer.prices.confortPlus}</li>
                        </ul>
                    </div>
                ` : ''}
                <button 
                    class="btn-reserve" 
                    data-offer-title="${offer.title}" 
                    data-destination="${offer.destination}"
                    style="
                        background-color: #007bff;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        width: 100%;
                        transition: background-color 0.3s;
                    ">
                    Réserver maintenant
                </button>
            </div>
        </div>
    `).join('');

    // Si le conteneur n'est pas déjà dans le document, l'ajouter
    if (!document.querySelector('.offers-container')) {
        document.querySelector('main').appendChild(offersContainer);
    }
}

function showFullFlyer(offerTitle) {
    const offer = offers.find(o => o.title === offerTitle);
    if (!offer) return;

    Swal.fire({
        title: offer.title,
        html: `
            <div style="text-align: left; margin-bottom: 20px;">
                <p><strong>Destination:</strong> ${offer.destination}</p>
                <p>${offer.description}</p>
                ${offer.prices ? `
                    <p><strong>Prix par personne:</strong></p>
                    <ul style="list-style: none; padding-left: 0;">
                        <li>Formule Confort: ${offer.prices.confort}</li>
                        <li>Formule Confort+: ${offer.prices.confortPlus}</li>
                    </ul>
                ` : ''}
                <p><strong>Inclus dans l'offre:</strong></p>
                <ul style="text-align: left;">
                    ${offer.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `,
        imageUrl: offer.flyerImage,
        imageAlt: offer.title,
        imageHeight: 400,
        confirmButtonText: 'Réserver maintenant',
        confirmButtonColor: '#d45a3d',
        showCancelButton: true,
        cancelButtonText: 'Fermer',
        cancelButtonColor: '#6c757d',
    }).then((result) => {
        if (result.isConfirmed) {
            openReservationModal(offer.title, offer.destination);
        }
    });
}

function showImageFullscreen(imageSrc, title) {
    Swal.fire({
        title: title,
        imageUrl: imageSrc,
        imageAlt: title,
        width: '80%',
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#d45a3d',
    });
}

// Fonction pour ouvrir le modal de réservation
function openReservationModal(title, destination) {
    const modal = document.getElementById('reservationModal');
    const modalTitle = modal.querySelector('h2');
    
    // Définir le titre de l'offre dans le modal
    modalTitle.textContent = `Réserver: ${title}`;
    modalTitle.setAttribute('data-offer-title', title);
    
    // Afficher le modal
    modal.style.display = 'block';
}

// Exporter les fonctions nécessaires
export { displayOffers, showFullFlyer, showImageFullscreen, openReservationModal };

// Rendre les fonctions disponibles globalement
window.showFullFlyer = showFullFlyer;
window.openReservationModal = openReservationModal;
window.showImageFullscreen = showImageFullscreen;

// Appeler la fonction quand le document est chargé
document.addEventListener('DOMContentLoaded', () => {
    displayOffers();
    
    // Ajouter des écouteurs d'événements après que le contenu est chargé
    setTimeout(() => {
        // Pour les cartes d'offres
        document.querySelectorAll('.offer-card').forEach(card => {
            card.addEventListener('click', function() {
                const offerTitle = this.getAttribute('data-offer-title');
                showFullFlyer(offerTitle);
            });
        });
        
        // Pour les boutons de réservation
        document.querySelectorAll('.btn-reserve').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher le déclenchement du click sur la carte
                const offerTitle = this.getAttribute('data-offer-title');
                const destination = this.getAttribute('data-destination');
                openReservationModal(offerTitle, destination);
            });
        });
    }, 100);
});
