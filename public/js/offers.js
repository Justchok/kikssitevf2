document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour ouvrir le popup avec les détails de l'offre
    function openOfferPopup(offerTitle) {
        const today = new Date().toISOString().split('T')[0];
        
        Swal.fire({
            title: 'Réserver cette offre',
            html: `
                <form id="offer-form" class="swal2-form">
                    <div class="form-group">
                        <input type="text" id="name" class="swal2-input" placeholder="Votre nom" required>
                    </div>
                    <div class="form-group">
                        <label for="email" style="text-align: left; display: block; margin-bottom: 5px; font-size: 14px;">Email <span style="color: #6c757d; font-size: 12px;">(Recommandé)</span></label>
                        <input type="email" id="email" class="swal2-input" placeholder="Votre email">
                    </div>
                    <div class="form-group">
                        <input type="tel" id="phone" class="swal2-input" placeholder="Votre téléphone" required>
                    </div>
                    <div class="form-group">
                        <input type="date" id="departureDate" class="swal2-input" min="${today}" required>
                    </div>
                    <div class="form-group">
                        <input type="number" id="passengers" class="swal2-input" placeholder="Nombre de passagers" min="1" required>
                    </div>
                    <div class="form-group">
                        <textarea id="message" class="swal2-textarea" placeholder="Message (optionnel)"></textarea>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Envoyer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#3ea0c6',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const formData = {
                    offerTitle: offerTitle,
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    departureDate: document.getElementById('departureDate').value,
                    passengers: document.getElementById('passengers').value,
                    message: document.getElementById('message').value
                };

                return fetch('http://localhost:8000/api/send-offer.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(result => {
                    if (!result.success) {
                        throw new Error(result.message || 'Une erreur est survenue');
                    }
                    return result;
                });
            }
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Demande envoyée !',
                    text: 'Nous avons bien reçu votre demande et vous contacterons très prochainement.',
                    icon: 'success',
                    confirmButtonColor: '#3ea0c6'
                });
            }
        }).catch(error => {
            Swal.fire({
                title: 'Erreur',
                text: error.message || 'Une erreur est survenue lors de l\'envoi de votre demande.',
                icon: 'error',
                confirmButtonColor: '#3ea0c6'
            });
        });
    }

    // Ajouter des écouteurs d'événements à tous les boutons "Réserver"
    document.querySelectorAll('.reserve-offer-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const offerTitle = this.getAttribute('data-offer-title');
            openOfferPopup(offerTitle);
        });
    });

    // Ajouter du CSS personnalisé pour le formulaire
    const style = document.createElement('style');
    style.textContent = `
        .swal2-form {
            margin: 1em auto;
        }
        .swal2-form .form-group {
            margin-bottom: 1em;
        }
        .swal2-input, .swal2-textarea {
            width: 100% !important;
            margin: 0.5em auto !important;
        }
        .swal2-textarea {
            height: 100px !important;
        }
    `;
    document.head.appendChild(style);
});
