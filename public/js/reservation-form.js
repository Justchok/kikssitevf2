import config from './config.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Gestionnaire du formulaire de réservation
    const modal = document.getElementById('reservationModal');
    if (!modal) {
        console.error('Modal de réservation non trouvé');
        return;
    }

    // Gestionnaire du formulaire
    const offerForm = document.getElementById('offerForm');
    if (!offerForm) {
        console.error('Formulaire de réservation non trouvé');
        return;
    }
    
    offerForm.addEventListener('submit', async function(e) {
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
});
