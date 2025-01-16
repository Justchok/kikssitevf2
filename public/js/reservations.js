document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les dates minimales
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departure-date').min = today;
    document.getElementById('return-date').min = today;

    const form = document.getElementById('booking-form');
    
    // Fonction pour mettre à jour les champs des voyageurs
    function updateTravelersFields() {
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const children = parseInt(document.getElementById('children').value) || 0;
        const infants = parseInt(document.getElementById('infants').value) || 0;
        
        const totalTravelers = adults + children + infants;
        const container = document.getElementById('travelers-container');
        const detailsSection = document.getElementById('travelers-details');
        
        // Réinitialiser le conteneur
        container.innerHTML = '';
        
        if (totalTravelers > 1) {
            detailsSection.style.display = 'block';
            
            // Commencer à 2 car le premier voyageur est déjà dans le formulaire principal
            for (let i = 2; i <= totalTravelers; i++) {
                const travelerType = i <= adults ? 'adult' : 
                                   i <= (adults + children) ? 'child' : 'infant';
                
                const card = document.createElement('div');
                card.className = 'traveler-card';
                
                const typeLabel = travelerType === 'adult' ? 'Adulte' :
                                travelerType === 'child' ? 'Enfant' : 'Bébé';
                
                card.innerHTML = `
                    <h4>${typeLabel} ${i}</h4>
                    <div class="traveler-inputs">
                        <div class="form-group">
                            <label for="traveler-${i}-firstname">Prénom</label>
                            <input type="text" id="traveler-${i}-firstname" name="traveler-${i}-firstname" required>
                        </div>
                        <div class="form-group">
                            <label for="traveler-${i}-lastname">Nom</label>
                            <input type="text" id="traveler-${i}-lastname" name="traveler-${i}-lastname" required>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            }
        } else {
            detailsSection.style.display = 'none';
        }
    }

    // Ajouter les écouteurs d'événements pour les champs de nombre de voyageurs
    document.getElementById('adults').addEventListener('change', updateTravelersFields);
    document.getElementById('children').addEventListener('change', updateTravelersFields);
    document.getElementById('infants').addEventListener('change', updateTravelersFields);
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation des dates
            const departureDate = new Date(document.getElementById('departure-date').value);
            const returnDate = new Date(document.getElementById('return-date').value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (departureDate < today) {
                Swal.fire({
                    title: 'Erreur',
                    text: 'La date de départ ne peut pas être dans le passé',
                    icon: 'error',
                    confirmButtonColor: '#3ea0c6'
                });
                return;
            }

            if (returnDate <= departureDate) {
                Swal.fire({
                    title: 'Erreur',
                    text: 'La date de retour doit être après la date de départ',
                    icon: 'error',
                    confirmButtonColor: '#3ea0c6'
                });
                return;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                departure: document.getElementById('departure').value,
                destination: document.getElementById('destination').value,
                departureDate: document.getElementById('departure-date').value,
                returnDate: document.getElementById('return-date').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value,
                infants: document.getElementById('infants').value,
                cabin: document.getElementById('cabin').value,
                airline: document.getElementById('airline').value || '',
                message: document.getElementById('message')?.value || '',
                additionalTravelers: []
            };

            // Récupérer les détails des voyageurs supplémentaires
            const totalTravelers = parseInt(formData.adults) + parseInt(formData.children) + parseInt(formData.infants);
            
            // Commencer à 2 car le premier voyageur est déjà dans le formulaire principal
            for (let i = 2; i <= totalTravelers; i++) {
                const firstname = document.getElementById(`traveler-${i}-firstname`)?.value;
                const lastname = document.getElementById(`traveler-${i}-lastname`)?.value;
                
                // Déterminer le type de voyageur
                const type = i <= parseInt(formData.adults) ? 'adult' : 
                           i <= (parseInt(formData.adults) + parseInt(formData.children)) ? 'child' : 'infant';
                
                if (firstname && lastname) {
                    formData.additionalTravelers.push({
                        firstname,
                        lastname,
                        type
                    });
                }
            }

            try {
                const response = await fetch('/api/public/book-flight', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        title: 'Réservation envoyée !',
                        text: 'Votre demande de réservation a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.',
                        icon: 'success',
                        confirmButtonColor: '#3ea0c6'
                    });
                    form.reset();
                } else {
                    throw new Error(result.message || 'Une erreur est survenue');
                }
            } catch (error) {
                console.error('Booking error:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer plus tard.',
                    icon: 'error',
                    confirmButtonColor: '#3ea0c6'
                });
            }
        });
    }
});
