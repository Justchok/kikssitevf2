import config from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone')?.value || '',
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.contact}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        title: 'Message envoyé !',
                        text: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3ea0c6'
                    });
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Une erreur est survenue');
                }
            } catch (error) {
                console.error('Contact error:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3ea0c6'
                });
            }
        });
    }
});
