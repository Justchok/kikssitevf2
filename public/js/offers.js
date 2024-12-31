document.addEventListener('DOMContentLoaded', function() {
    // Handle booking buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.offer-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const description = card.querySelector('p[data-i18n^="offer"]').textContent;
            
            showOfferForm(title, description, price);
        });
    });
});

function showOfferForm(title, description, price) {
    Swal.fire({
        title: 'Réserver cette offre',
        html: `
            <div class="offer-details">
                <h4>${title}</h4>
                <p>${description}</p>
                <p class="price-highlight">${price}</p>
            </div>
            <form id="offerForm" class="offer-form">
                <div class="form-group">
                    <label for="name">Nom complet</label>
                    <input type="text" id="name" name="name" required class="swal2-input" placeholder="Votre nom">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required class="swal2-input" placeholder="votre@email.com">
                </div>
                <div class="form-group">
                    <label for="phone">Téléphone</label>
                    <input type="tel" id="phone" name="phone" required class="swal2-input" placeholder="Votre numéro de téléphone">
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Réserver',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3ea0c6',
        cancelButtonColor: '#6c757d',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const form = document.getElementById('offerForm');
            const formData = {
                name: form.querySelector('#name').value,
                email: form.querySelector('#email').value,
                phone: form.querySelector('#phone').value,
                offerTitle: title,
                offerPrice: price
            };

            return submitSpecialOffer(formData);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Réservation envoyée !',
                text: 'Votre demande de réservation a été envoyée avec succès. Notre équipe vous contactera très prochainement pour finaliser les détails.',
                icon: 'success',
                confirmButtonColor: '#3ea0c6'
            });
        }
    });
}

async function submitSpecialOffer(formData) {
    try {
        const response = await fetch('/api/public/special-offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Une erreur est survenue');
        }

        return result;
    } catch (error) {
        Swal.showValidationMessage(`Erreur: ${error.message}`);
    }
}
