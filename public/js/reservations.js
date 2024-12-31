document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                departure: document.getElementById('departure').value,
                destination: document.getElementById('destination').value,
                layover: document.getElementById('layover').value,
                travelClass: document.getElementById('travel-class').value,
                departureDate: document.getElementById('departure-date').value,
                returnDate: document.getElementById('return-date').value,
                passengers: document.getElementById('passengers').value
            };

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
                        title: 'Demande envoyée !',
                        text: 'Votre demande a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3ea0c6'
                    });
                    bookingForm.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Booking error:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer plus tard.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3ea0c6'
                });
            }
        });
    }
});
