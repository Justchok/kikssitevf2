const offers = [
    {
        title: 'Hajj 2025',
        description: 'Un voyage spirituel unique à La Mecque. Vivez une expérience inoubliable pendant le pèlerinage du Hajj.',
        image: '/assets/images/destinations/hajj.jpg',
        flyerImage: '/assets/images/flyers/hajj2025.jpg',
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
        " onclick="showFullFlyer('${offer.title}')">
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
                <button onclick="event.stopPropagation(); openReservationModal('${offer.title}', '${offer.destination}')" 
                    class="btn-reserve" 
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
            <div style="max-width: 100%; margin: 0 auto;">
                <img src="${offer.flyerImage || offer.image}" 
                    style="width: 100%; max-height: 85vh; object-fit: contain; margin-bottom: 1rem; cursor: zoom-in;" 
                    alt="${offer.title}"
                    onclick="showImageFullscreen('${offer.flyerImage || offer.image}', '${offer.title}')"
                >
                <div style="text-align: left; padding: 1rem;">
                    <h3 style="color: #333; margin-bottom: 1rem;">Description</h3>
                    <p style="color: #666; margin-bottom: 1rem;">${offer.description}</p>
                    
                    <h3 style="color: #333; margin-bottom: 1rem;">Ce qui est inclus</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 1rem;">
                        ${offer.features.map(feature => `
                            <li style="margin-bottom: 0.5rem;">
                                <span style="color: #007bff; margin-right: 0.5rem;">✓</span>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    
                    ${offer.prices ? `
                        <h3 style="color: #333; margin-bottom: 1rem;">Prix par personne</h3>
                        <ul style="list-style: none; padding: 0; margin-bottom: 1rem;">
                            <li style="margin-bottom: 0.5rem; font-weight: bold;">Formule Confort: ${offer.prices.confort}</li>
                            <li style="margin-bottom: 0.5rem; font-weight: bold;">Formule Confort+: ${offer.prices.confortPlus}</li>
                        </ul>
                    ` : ''}
                </div>
            </div>
        `,
        width: '90%',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            container: 'full-flyer-modal'
        }
    });
}

function showImageFullscreen(imageSrc, title) {
    Swal.fire({
        title: title,
        html: `
            <div style="max-width: 100vw; max-height: 90vh; overflow: hidden;">
                <img src="${imageSrc}" 
                    style="width: 100%; height: 100%; object-fit: contain;" 
                    alt="${title}"
                >
            </div>
        `,
        width: '100%',
        padding: 0,
        showCloseButton: true,
        showConfirmButton: false,
        background: '#000',
        customClass: {
            container: 'fullscreen-image-modal',
            title: 'fullscreen-image-title'
        }
    });
}

// Appeler la fonction quand le document est chargé
document.addEventListener('DOMContentLoaded', displayOffers);
