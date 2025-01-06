document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservation-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation des dates
            const departureDate = new Date(document.getElementById('departureDate').value);
            const returnDate = new Date(document.getElementById('returnDate').value);
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
                departureDate: document.getElementById('departureDate').value,
                returnDate: document.getElementById('returnDate').value,
                passengers: document.getElementById('passengers').value,
                message: document.getElementById('message')?.value || ''
            };

            try {
                const response = await fetch('./api/send-email.php', {
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
