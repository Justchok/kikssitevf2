document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupération des valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                // Envoi des données au serveur
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    })
                });

                if (response.ok) {
                    // Message de succès
                    const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
                    const successTitle = currentLang === 'fr' ? 'Message Envoyé !' : 'Message Sent!';
                    const successText = currentLang === 'fr' 
                        ? 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
                        : 'Your message has been sent successfully. We will respond to you as soon as possible.';
                    const confirmButton = currentLang === 'fr' ? 'Fermer' : 'Close';

                    await Swal.fire({
                        icon: 'success',
                        title: successTitle,
                        text: successText,
                        confirmButtonText: confirmButton,
                        confirmButtonColor: '#d75534',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Réinitialisation du formulaire
                    form.reset();
                } else {
                    // Message d'erreur
                    const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
                    const errorTitle = currentLang === 'fr' ? 'Erreur' : 'Error';
                    const errorText = currentLang === 'fr'
                        ? 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
                        : 'An error occurred while sending the message. Please try again.';
                    const confirmButton = currentLang === 'fr' ? 'Fermer' : 'Close';

                    await Swal.fire({
                        icon: 'error',
                        title: errorTitle,
                        text: errorText,
                        confirmButtonText: confirmButton,
                        confirmButtonColor: '#d75534'
                    });
                }
            } catch (error) {
                // Message d'erreur en cas de problème réseau
                const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
                const errorTitle = currentLang === 'fr' ? 'Erreur de Connexion' : 'Connection Error';
                const errorText = currentLang === 'fr'
                    ? 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.'
                    : 'Unable to connect to the server. Please check your internet connection.';
                const confirmButton = currentLang === 'fr' ? 'Fermer' : 'Close';

                await Swal.fire({
                    icon: 'error',
                    title: errorTitle,
                    text: errorText,
                    confirmButtonText: confirmButton,
                    confirmButtonColor: '#d75534'
                });
            }
        });
    }
});
