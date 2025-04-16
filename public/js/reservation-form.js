import config from './config.js';

// Gestionnaire du modal
const modal = document.getElementById('reservationModal');
const closeBtn = document.querySelector('.close-modal');

// Fermer le modal quand on clique sur le X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Fermer le modal quand on clique en dehors
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Gestionnaire du formulaire
document.getElementById('offerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const reservationData = Object.fromEntries(formData.entries());
    
    // Ajouter le titre de l'offre sélectionnée
    reservationData.offerTitle = document.querySelector('#reservationModal h2').getAttribute('data-offer-title') || 'Offre spéciale';
    
    try {
        const response = await fetch(`${config.apiUrl}${config.endpoints.bookOffer}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: 'Réservation envoyée !',
                text: 'Votre demande de réservation a été envoyée avec succès ! Vous recevrez un email de confirmation.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d45a3d'
            });
            modal.style.display = "none";
            this.reset();
        } else {
            Swal.fire({
                title: 'Erreur',
                text: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d45a3d'
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d45a3d'
        });
    }
});
