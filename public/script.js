// Gestion du menu burger
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script chargé et prêt');

    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    burgerMenu.addEventListener('click', () => {
        console.log('Menu burger cliqué');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu lors du clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Défilement fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation du header au scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();
        });
    }

    // Gestion du formulaire de réservation
    const form = document.getElementById('reservation-form');
    const addEscaleBtn = document.getElementById('add-escale');
    const escalesList = document.querySelector('.escales-list');

    if (form && addEscaleBtn && escalesList) {
        // Gestion des escales
        addEscaleBtn.addEventListener('click', () => {
            const newEscale = document.createElement('div');
            newEscale.className = 'escale-input';
            newEscale.innerHTML = `
                <input type="text" name="escales[]" placeholder="Ville d'escale (optionnel)">
                <button type="button" class="remove-escale" aria-label="Supprimer l'escale">×</button>
            `;
            
            newEscale.querySelector('.remove-escale').addEventListener('click', () => {
                newEscale.remove();
            });

            escalesList.appendChild(newEscale);
        });

        // Validation des dates
        const dateDepart = document.getElementById('date-depart');
        const dateRetour = document.getElementById('date-retour');

        if (dateDepart && dateRetour) {
            // Fonction pour formater la date en format français
            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            };

            // Définir la date minimum à aujourd'hui
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = today.toISOString().split('T')[0];
            dateDepart.min = todayStr;
            
            // Définir la date maximum à 1 an à partir d'aujourd'hui
            const maxDate = new Date(today);
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            const maxDateStr = maxDate.toISOString().split('T')[0];
            dateDepart.max = maxDateStr;
            dateRetour.max = maxDateStr;

            // Fonction de validation de date
            const validateDate = (date, minDate, maxDate) => {
                const d = new Date(date);
                return d >= minDate && d <= maxDate;
            };

            dateDepart.addEventListener('change', () => {
                const selectedDate = new Date(dateDepart.value);
                selectedDate.setHours(0, 0, 0, 0);

                // Vérifier si la date de départ est valide
                if (!validateDate(selectedDate, today, maxDate)) {
                    if (selectedDate < today) {
                        alert(`La date de départ ne peut pas être dans le passé.\nVeuillez choisir une date à partir du ${formatDate(today)}.`);
                        dateDepart.value = todayStr;
                    } else if (selectedDate > maxDate) {
                        alert(`La date de départ ne peut pas être au-delà du ${formatDate(maxDate)}.\nVeuillez choisir une date plus proche.`);
                        dateDepart.value = maxDateStr;
                    }
                    return;
                }

                // Mettre à jour la date minimum de retour
                dateRetour.min = dateDepart.value;

                // Calculer la date maximum de retour (15 mois après le départ)
                const maxRetour = new Date(dateDepart.value);
                maxRetour.setMonth(maxRetour.getMonth() + 15);
                const maxRetourStr = maxRetour.toISOString().split('T')[0];
                const effectiveMaxRetour = new Date(Math.min(maxRetour.getTime(), maxDate.getTime()));
                dateRetour.max = effectiveMaxRetour.toISOString().split('T')[0];

                // Ajuster la date de retour si nécessaire
                if (dateRetour.value) {
                    const returnDate = new Date(dateRetour.value);
                    if (returnDate < selectedDate) {
                        alert(`La date de retour a été ajustée au ${formatDate(selectedDate)} pour correspondre à la date de départ.`);
                        dateRetour.value = dateDepart.value;
                    } else if (returnDate > effectiveMaxRetour) {
                        alert(`La date de retour a été ajustée au ${formatDate(effectiveMaxRetour)}.\nC'est la date maximale possible pour ce voyage.`);
                        dateRetour.value = effectiveMaxRetour.toISOString().split('T')[0];
                    }
                }
            });

            dateRetour.addEventListener('change', () => {
                const departDate = new Date(dateDepart.value);
                const returnDate = new Date(dateRetour.value);
                const maxRetour = new Date(dateDepart.value);
                maxRetour.setMonth(maxRetour.getMonth() + 15);
                const effectiveMaxRetour = new Date(Math.min(maxRetour.getTime(), maxDate.getTime()));

                if (returnDate < departDate) {
                    alert(`La date de retour doit être égale ou postérieure à la date de départ (${formatDate(departDate)}).`);
                    dateRetour.value = dateDepart.value;
                } else if (returnDate > effectiveMaxRetour) {
                    alert(`La date de retour ne peut pas être après le ${formatDate(effectiveMaxRetour)}.\nC'est la limite maximale pour ce voyage.`);
                    dateRetour.value = effectiveMaxRetour.toISOString().split('T')[0];
                }
            });

            // Initialiser les dates par défaut
            if (!dateDepart.value) {
                dateDepart.value = todayStr;
                dateRetour.min = todayStr;
            }
        }

        // Gestion de la soumission du formulaire
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const escales = Array.from(form.querySelectorAll('input[name="escales[]"]'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== '');

                const formData = {
                    nom: form.nom.value,
                    email: form.email.value,
                    telephone: form.telephone.value,
                    lieuDepart: form.lieuDepart.value,
                    destination: form.destination.value,
                    escales: escales,
                    dateDepart: form.querySelector('#date-depart').value,
                    dateRetour: form.querySelector('#date-retour').value,
                    classe: form.classe.value,
                    message: form.message.value
                };

                console.log('Envoi des données:', formData);

                const API_URL = window.location.origin;
                const response = await fetch(`${API_URL}/api/booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                let responseData;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    throw new Error('Le serveur n\'a pas renvoyé de JSON valide');
                }

                if (!response.ok) {
                    throw new Error(responseData.message || 'Erreur lors de la réservation');
                }

                console.log('Réponse du serveur:', responseData);

                // Afficher le pop-up de confirmation
                const popup = document.getElementById('confirmation-popup');
                if (popup) {
                    popup.style.display = 'flex';
                    // Cacher le popup après 5 secondes
                    setTimeout(() => {
                        popup.style.display = 'none';
                    }, 5000);
                }

                // Réinitialiser le formulaire
                form.reset();

                // Supprimer les champs d'escale supplémentaires
                const escaleInputs = document.querySelectorAll('.escale-input');
                for (let i = 1; i < escaleInputs.length; i++) {
                    escaleInputs[i].remove();
                }
            } catch (error) {
                console.error('Erreur détaillée:', error);
                alert('Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer plus tard.');
            }
        });
    }

    // Gestion du formulaire de réservation de vol
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        console.log('Formulaire de réservation trouvé');

        // Fonction de validation d'email
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Fonction de validation de numéro de téléphone
        const isValidPhone = (phone) => {
            const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{9,}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        };

        // Fonction de validation des champs texte
        const isValidText = (text, minLength = 2) => {
            return text && text.trim().length >= minLength;
        };

        // Validation en temps réel des champs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const departureInput = document.getElementById('departure');
        const destinationInput = document.getElementById('destination');
        const departureDateInput = document.getElementById('departure-date');
        const returnDateInput = document.getElementById('return-date');
        const passengersInput = document.getElementById('passengers');
        const travelClassInput = document.getElementById('travel-class');

        // Fonction pour afficher les erreurs
        const showError = (input, message) => {
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            } else {
                const div = document.createElement('div');
                div.className = 'error-message';
                div.style.color = '#d75534';
                div.style.fontSize = '0.8rem';
                div.style.marginTop = '4px';
                div.textContent = message;
                input.parentNode.insertBefore(div, input.nextSibling);
            }
            input.style.borderColor = '#d75534';
        };

        // Fonction pour cacher les erreurs
        const hideError = (input) => {
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.style.display = 'none';
            }
            input.style.borderColor = '';
        };

        // Validation du nom
        nameInput.addEventListener('input', () => {
            if (!isValidText(nameInput.value)) {
                showError(nameInput, 'Le nom doit contenir au moins 2 caractères');
            } else {
                hideError(nameInput);
            }
        });

        // Validation de l'email
        emailInput.addEventListener('input', () => {
            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Veuillez entrer une adresse email valide');
            } else {
                hideError(emailInput);
            }
        });

        // Validation du téléphone
        phoneInput.addEventListener('input', () => {
            if (!isValidPhone(phoneInput.value)) {
                showError(phoneInput, 'Veuillez entrer un numéro de téléphone valide');
            } else {
                hideError(phoneInput);
            }
        });

        // Validation du nombre de passagers
        passengersInput.addEventListener('input', () => {
            const value = parseInt(passengersInput.value);
            if (isNaN(value) || value < 1 || value > 9) {
                showError(passengersInput, 'Le nombre de passagers doit être entre 1 et 9');
                passengersInput.value = Math.min(Math.max(1, value), 9);
            } else {
                hideError(passengersInput);
            }
        });

        // Empêcher la sélection de la même ville pour le départ et la destination
        destinationInput.addEventListener('change', () => {
            if (destinationInput.value === departureInput.value) {
                showError(destinationInput, 'La destination ne peut pas être identique au départ');
                destinationInput.value = '';
            } else {
                hideError(destinationInput);
            }
        });

        departureInput.addEventListener('change', () => {
            if (departureInput.value === destinationInput.value) {
                showError(departureInput, 'Le départ ne peut pas être identique à la destination');
                departureInput.value = '';
            } else {
                hideError(departureInput);
            }
        });

        // Configuration des dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        
        // Date maximum (1 an à partir d'aujourd'hui)
        const maxDate = new Date(today);
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        const maxDateStr = maxDate.toISOString().split('T')[0];

        // Configuration des champs de date
        departureDateInput.min = todayStr;
        departureDateInput.max = maxDateStr;
        returnDateInput.max = maxDateStr;

        // Fonction pour formater la date en français
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        };

        // Validation de la date de départ
        departureDateInput.addEventListener('input', () => {
            const selectedDate = new Date(departureDateInput.value);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showError(departureDateInput, `La date de départ ne peut pas être dans le passé. Minimum: ${formatDate(today)}`);
                departureDateInput.value = todayStr;
            } else if (selectedDate > maxDate) {
                showError(departureDateInput, `La date de départ ne peut pas être après le ${formatDate(maxDate)}`);
                departureDateInput.value = maxDateStr;
            } else {
                hideError(departureDateInput);

                // Mettre à jour la date minimum de retour
                returnDateInput.min = departureDateInput.value;

                // Calculer la date maximum de retour (15 mois après le départ)
                const maxRetour = new Date(departureDateInput.value);
                maxRetour.setMonth(maxRetour.getMonth() + 15);
                const effectiveMaxRetour = new Date(Math.min(maxRetour.getTime(), maxDate.getTime()));
                returnDateInput.max = effectiveMaxRetour.toISOString().split('T')[0];

                // Ajuster la date de retour si nécessaire
                if (returnDateInput.value) {
                    const returnDate = new Date(returnDateInput.value);
                    if (returnDate < selectedDate) {
                        showError(returnDateInput, `La date de retour a été ajustée au ${formatDate(selectedDate)}`);
                        returnDateInput.value = departureDateInput.value;
                    } else if (returnDate > effectiveMaxRetour) {
                        showError(returnDateInput, `La date de retour a été ajustée au ${formatDate(effectiveMaxRetour)}`);
                        returnDateInput.value = effectiveMaxRetour.toISOString().split('T')[0];
                    }
                }
            }
        });

        // Validation de la date de retour
        returnDateInput.addEventListener('input', () => {
            const returnDate = new Date(returnDateInput.value);
            const departDate = new Date(departureDateInput.value);
            const maxRetour = new Date(departureDateInput.value);
            maxRetour.setMonth(maxRetour.getMonth() + 15);
            const effectiveMaxRetour = new Date(Math.min(maxRetour.getTime(), maxDate.getTime()));

            if (returnDate < departDate) {
                showError(returnDateInput, `La date de retour doit être égale ou postérieure à la date de départ (${formatDate(departDate)})`);
                returnDateInput.value = departureDateInput.value;
            } else if (returnDate > effectiveMaxRetour) {
                showError(returnDateInput, `La date de retour ne peut pas être après le ${formatDate(effectiveMaxRetour)}`);
                returnDateInput.value = effectiveMaxRetour.toISOString().split('T')[0];
            } else {
                hideError(returnDateInput);
            }
        });

        // Validation du formulaire avant soumission
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Vérifier tous les champs obligatoires
            let hasError = false;

            if (!isValidText(nameInput.value)) {
                showError(nameInput, 'Le nom est requis (minimum 2 caractères)');
                hasError = true;
            }

            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Une adresse email valide est requise');
                hasError = true;
            }

            if (phoneInput.value && !isValidPhone(phoneInput.value)) {
                showError(phoneInput, 'Le numéro de téléphone n\'est pas valide');
                hasError = true;
            }

            if (!departureInput.value) {
                showError(departureInput, 'Veuillez sélectionner une ville de départ');
                hasError = true;
            }

            if (!destinationInput.value) {
                showError(destinationInput, 'Veuillez sélectionner une destination');
                hasError = true;
            }

            if (!departureDateInput.value) {
                showError(departureDateInput, 'La date de départ est requise');
                hasError = true;
            }

            const passengers = parseInt(passengersInput.value);
            if (isNaN(passengers) || passengers < 1 || passengers > 9) {
                showError(passengersInput, 'Le nombre de passagers doit être entre 1 et 9');
                hasError = true;
            }

            if (!travelClassInput.value) {
                showError(travelClassInput, 'Veuillez sélectionner une classe de voyage');
                hasError = true;
            }

            if (hasError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de saisie',
                    text: 'Veuillez corriger les erreurs dans le formulaire',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3ea0c6'
                });
                return;
            }

            try {
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    flightDetails: {
                        departure: departureInput.value,
                        destination: destinationInput.value,
                        layover: document.getElementById('layover').value || '',
                        travelClass: travelClassInput.value,
                        departureDate: departureDateInput.value,
                        returnDate: returnDateInput.value || '',
                        passengers: passengersInput.value
                    }
                };

                console.log('Envoi des données:', formData);

                const API_URL = window.location.origin;
                const response = await fetch(`${API_URL}/api/booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({
                        message: 'Erreur lors de la réservation'
                    }));
                    throw new Error(errorData.message || 'Erreur lors de la réservation');
                }

                const responseData = await response.json().catch(() => ({
                    message: 'Réservation enregistrée avec succès'
                }));

                // Afficher le message de succès
                Swal.fire({
                    icon: 'success',
                    title: 'Réservation envoyée !',
                    text: 'Nous avons bien reçu votre demande de réservation. Vous recevrez bientôt un email de confirmation.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3ea0c6'
                });

                // Réinitialiser le formulaire
                bookingForm.reset();
                // Nettoyer tous les messages d'erreur
                document.querySelectorAll('.error-message').forEach(error => {
                    error.style.display = 'none';
                });
                document.querySelectorAll('input, select').forEach(input => {
                    input.style.borderColor = '';
                });

            } catch (error) {
                console.error('Erreur détaillée:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error.message || 'Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer plus tard.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3ea0c6'
                });
            }
        });
    } else {
        console.error('Formulaire de réservation non trouvé');
    }

    // Fonction pour réserver une offre spéciale
    async function reserverOffre(titre, offerId) {
        console.log('Tentative de réservation pour:', titre, 'ID:', offerId);
        const { value: formValues } = await Swal.fire({
            title: 'Réserver ' + titre,
            html: `
                <form id="reservation-form" class="form-vertical">
                    <div class="form-group">
                        <input type="text" id="swal-name" class="swal2-input" placeholder="Votre nom complet" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="swal-email" class="swal2-input" placeholder="Votre email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="swal-phone" class="swal2-input" placeholder="Votre téléphone" required>
                    </div>
                </form>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Réserver',
            cancelButtonText: 'Annuler',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const email = document.getElementById('swal-email').value;
                const phone = document.getElementById('swal-phone').value;

                if (!name || !email || !phone) {
                    Swal.showValidationMessage('Veuillez remplir tous les champs');
                    return false;
                }

                return { nom: name, email, telephone: phone };
            }
        });

        if (formValues) {
            try {
                console.log('Envoi de la réservation:', { ...formValues, offerTitle: titre, offerId });
                const API_URL = window.location.origin;
                const response = await fetch(`${API_URL}/api/public/book-offer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formValues,
                        offerTitle: titre,
                        offerId: offerId
                    })
                });

                let responseData;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    throw new Error('Le serveur n\'a pas renvoyé de JSON valide');
                }

                if (!response.ok) {
                    throw new Error(responseData.message || 'Erreur lors de l\'envoi de la réservation');
                }

                const result = await response.json();
                console.log('Réponse de la réservation:', result);

                Swal.fire({
                    title: 'Réservation envoyée !',
                    text: 'Vous recevrez bientôt un email de confirmation.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Erreur détaillée:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }

    // Remplir les sélecteurs d'aéroports
    const airports = {
        'DSS': 'Dakar (DSS)',
        'CDG': 'Paris (CDG)',
        'DXB': 'Dubai (DXB)',
        'JFK': 'New York (JFK)',
        'LHR': 'Londres (LHR)',
        'IST': 'Istanbul (IST)',
        'CMN': 'Casablanca (CMN)',
        'CAI': 'Le Caire (CAI)',
        'JED': 'Jeddah (JED)',
        'MED': 'Médine (MED)'
    };

    const departureSelect = document.getElementById('departure');
    const destinationSelect = document.getElementById('destination');
    const layoverSelect = document.getElementById('layover');

    // Fonction pour remplir un sélecteur avec les aéroports
    function fillAirportSelect(select) {
        select.innerHTML = '<option value="">Sélectionnez un aéroport</option>';
        Object.entries(airports).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            select.appendChild(option);
        });
    }

    fillAirportSelect(departureSelect);
    fillAirportSelect(destinationSelect);
    fillAirportSelect(layoverSelect);

    // Charger les offres spéciales
    async function loadOffresSpeciales() {
        try {
            console.log('Chargement des offres spéciales...');
            const API_URL = window.location.origin;
            const response = await fetch(`${API_URL}/api/offres-speciales`);
            const offres = await response.json();
            console.log('Offres reçues:', offres);
            
            const offresContainer = document.querySelector('.offres-grid');
            if (!offresContainer) {
                console.error('Container des offres non trouvé');
                return;
            }

            const offresHTML = offres.map(offre => `
                <div class="offre-card">
                    ${offre.image 
                        ? `<img src="${offre.image}" alt="${offre.titre}" onerror="this.src='./assets/images/placeholder.jpg'">`
                        : `<img src="./assets/images/placeholder.jpg" alt="Image non disponible">`
                    }
                    <div class="offre-content">
                        <h3>${offre.titre}</h3>
                        <p>${offre.description}</p>
                        <p class="prix">${offre.prix} ${offre.devise}</p>
                        <button class="reserver-button" onclick="reserverOffre('${offre.titre}', '${offre.id}')">Réserver</button>
                    </div>
                </div>
            `).join('');

            offresContainer.innerHTML = offresHTML;
            console.log('Offres affichées avec succès');

            // Ajouter les gestionnaires d'événements pour les boutons de réservation statiques
            document.querySelectorAll('.reserver-button').forEach(button => {
                if (!button.hasAttribute('onclick')) {
                    const card = button.closest('.offre-card');
                    const title = card.querySelector('h3').textContent;
                    button.addEventListener('click', () => {
                        console.log('Clic sur le bouton réserver pour:', title);
                        reserverOffre(title, 'static-offer');
                    });
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement des offres:', error);
            // Afficher les offres statiques en cas d'erreur
            const offresContainer = document.querySelector('.offres-grid');
            if (offresContainer) {
                const staticOffer = `
                    <div class="offre-card">
                        <img src="./assets/images/paris.jpg" alt="Paris">
                        <div class="offre-content">
                            <h3>Week-end à Paris</h3>
                            <p>Découvrez la ville lumière</p>
                            <p class="prix">299€</p>
                            <button class="reserver-button" onclick="reserverOffre('Week-end à Paris', 'paris-weekend')">Réserver</button>
                        </div>
                    </div>
                `;
                offresContainer.innerHTML = staticOffer;
            }
        }
    }

    // Charger les offres au démarrage
    loadOffresSpeciales();

    console.log('Initialisation terminée');
});

// Animation du globe
function initGlobe() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    // Configuration de base
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,
        alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Création du globe
    const radius = 5;
    const segments = 128;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    
    // Matériau principal du globe
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./assets/images/earth-blue-marble.jpg'),
        bumpMap: new THREE.TextureLoader().load('./assets/images/earth-topology.jpg'),
        bumpScale: 0.15,
        specularMap: new THREE.TextureLoader().load('./assets/images/earth-specular.jpg'),
        specular: new THREE.Color('#909090'),
        shininess: 25,
        transparent: false,
        opacity: 1
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Atmosphère
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.1, segments, segments);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color('#3ea0c6') }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(color, intensity * 0.3);
            }
        `
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Points de destination
    const destinations = [
        { lat: 48.8566, lon: 2.3522 },    // Paris
        { lat: 14.6937, lon: -17.4441 },  // Dakar
        { lat: 35.6762, lon: 139.6503 },  // Tokyo
        { lat: 40.7128, lon: -74.0060 },  // New York
        { lat: -33.8688, lon: 151.2093 }, // Sydney
    ];

    const pointsGroup = new THREE.Group();
    destinations.forEach(dest => {
        const phi = (90 - dest.lat) * (Math.PI / 180);
        const theta = (dest.lon + 180) * (Math.PI / 180);
        
        const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({ 
            color: '#d75534',
            transparent: true,
            opacity: 0.8
        });
        
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.x = radius * Math.sin(phi) * Math.cos(theta);
        point.position.y = radius * Math.cos(phi);
        point.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        pointsGroup.add(point);
    });
    scene.add(pointsGroup);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 15;

    // Rotation automatique
    let rotationSpeed = 0.001;
    let mouseX = 0;
    let targetRotationY = 0;

    // Interaction à la souris
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
        targetRotationY = mouseX;
    });

    // Animation
    function animate(time) {
        requestAnimationFrame(animate);

        // Rotation fluide
        globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05 + rotationSpeed;
        atmosphere.rotation.y = globe.rotation.y;
        pointsGroup.rotation.y = globe.rotation.y;

        // Animation de l'atmosphère
        atmosphereMaterial.uniforms.time.value = time * 0.001;

        // Animation des points
        pointsGroup.children.forEach((point, i) => {
            point.scale.setScalar(1 + 0.1 * Math.sin(time * 0.001 + i));
        });

        renderer.render(scene, camera);
    }

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(0);
}

// Initialiser le globe au chargement de la page
document.addEventListener('DOMContentLoaded', initGlobe);

// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Gestion du menu burger
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script chargé et prêt');

    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (burgerMenu) {
        console.log('Menu burger trouvé');
        burgerMenu.addEventListener('click', () => {
            console.log('Menu burger cliqué');
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Gestion des liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Navigation vers:', link.getAttribute('href'));
            if (burgerMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Animation du carrousel des logos
    const logosSlide = document.querySelector('.logos-slide');
    if (logosSlide) {
        console.log('Carrousel des logos initialisé');
        const logos = document.querySelectorAll('.logos-slide img');
        if (logos.length > 0) {
            const logoWidth = logos[0].clientWidth;
            const gap = 50;
            let currentScroll = 0;
            const maxScroll = (logos.length / 2) * (logoWidth + gap);

            function scrollLogos() {
                currentScroll += 1;
                if (currentScroll >= maxScroll) {
                    currentScroll = 0;
                }
                logosSlide.style.transform = `translateX(-${currentScroll}px)`;
                requestAnimationFrame(scrollLogos);
            }

            scrollLogos();
        }
    }

    // Gestion du formulaire de réservation de vol
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        console.log('Formulaire de réservation trouvé');
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Soumission du formulaire de réservation de vol...');
            
            try {
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    flightDetails: {
                        departure: document.getElementById('departure').value,
                        destination: document.getElementById('destination').value,
                        layover: document.getElementById('layover').value,
                        travelClass: document.getElementById('travel-class').value,
                        departureDate: document.getElementById('departure-date').value,
                        returnDate: document.getElementById('return-date').value,
                        passengers: document.getElementById('passengers').value
                    }
                };

                console.log('Données du formulaire:', formData);

                const API_URL = window.location.origin;
                const response = await fetch(`${API_URL}/api/public/book-flight`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la réservation');
                }

                const result = await response.json();
                console.log('Réponse de la réservation:', result);

                Swal.fire({
                    title: 'Réservation confirmée !',
                    text: 'Vous allez recevoir un email de confirmation.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                
                bookingForm.reset();
            } catch (error) {
                console.error('Erreur lors de la réservation:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    } else {
        console.error('Formulaire de réservation non trouvé');
    }

    // Fonction pour réserver une offre spéciale
    window.reserverOffre = async function(titre, offerId) {
        console.log('Tentative de réservation pour:', titre, 'ID:', offerId);
        const { value: formValues } = await Swal.fire({
            title: 'Réserver ' + titre,
            html: `
                <form id="reservation-form" class="form-vertical">
                    <div class="form-group">
                        <input type="text" id="swal-name" class="swal2-input" placeholder="Votre nom complet" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="swal-email" class="swal2-input" placeholder="Votre email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="swal-phone" class="swal2-input" placeholder="Votre téléphone" required>
                    </div>
                </form>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Réserver',
            cancelButtonText: 'Annuler',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const email = document.getElementById('swal-email').value;
                const phone = document.getElementById('swal-phone').value;

                if (!name || !email || !phone) {
                    Swal.showValidationMessage('Veuillez remplir tous les champs');
                    return false;
                }

                return { nom: name, email, telephone: phone };
            }
        });

        if (formValues) {
            try {
                console.log('Envoi de la réservation:', { ...formValues, offerTitle: titre, offerId });
                const API_URL = window.location.origin;
                const response = await fetch(`${API_URL}/api/public/book-offer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formValues,
                        offerTitle: titre,
                        offerId: offerId
                    })
                });

                let responseData;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    throw new Error('Le serveur n\'a pas renvoyé de JSON valide');
                }

                if (!response.ok) {
                    throw new Error(responseData.message || 'Erreur lors de l\'envoi de la réservation');
                }

                const result = await response.json();
                console.log('Réponse de la réservation:', result);

                Swal.fire({
                    title: 'Réservation envoyée !',
                    text: 'Vous recevrez bientôt un email de confirmation.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Erreur détaillée:', error);
                Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    // Charger les offres spéciales
    async function loadOffresSpeciales() {
        try {
            console.log('Chargement des offres spéciales...');
            const API_URL = window.location.origin;
            const response = await fetch(`${API_URL}/api/offres-speciales`);
            const offres = await response.json();
            console.log('Offres reçues:', offres);
            
            const offresContainer = document.querySelector('.offres-grid');
            if (!offresContainer) {
                console.error('Container des offres non trouvé');
                return;
            }

            const offresHTML = offres.map(offre => `
                <div class="offre-card">
                    ${offre.image 
                        ? `<img src="${offre.image}" alt="${offre.titre}" onerror="this.src='./assets/images/placeholder.jpg'">`
                        : `<img src="./assets/images/placeholder.jpg" alt="Image non disponible">`
                    }
                    <div class="offre-content">
                        <h3>${offre.titre}</h3>
                        <p>${offre.description}</p>
                        <p class="prix">${offre.prix} ${offre.devise}</p>
                        <button class="reserver-button" onclick="reserverOffre('${offre.titre}', '${offre.id}')">Réserver</button>
                    </div>
                </div>
            `).join('');

            offresContainer.innerHTML = offresHTML;
            console.log('Offres affichées avec succès');

            // Ajouter les gestionnaires d'événements pour les boutons de réservation statiques
            document.querySelectorAll('.reserver-button').forEach(button => {
                if (!button.hasAttribute('onclick')) {
                    const card = button.closest('.offre-card');
                    const title = card.querySelector('h3').textContent;
                    button.addEventListener('click', () => {
                        console.log('Clic sur le bouton réserver pour:', title);
                        reserverOffre(title, 'static-offer');
                    });
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement des offres:', error);
            // Afficher les offres statiques en cas d'erreur
            const offresContainer = document.querySelector('.offres-grid');
            if (offresContainer) {
                const staticOffer = `
                    <div class="offre-card">
                        <img src="./assets/images/paris.jpg" alt="Paris">
                        <div class="offre-content">
                            <h3>Week-end à Paris</h3>
                            <p>Découvrez la ville lumière</p>
                            <p class="prix">299€</p>
                            <button class="reserver-button" onclick="reserverOffre('Week-end à Paris', 'paris-weekend')">Réserver</button>
                        </div>
                    </div>
                `;
                offresContainer.innerHTML = staticOffer;
            }
        }
    }

    // Charger les offres au démarrage
    loadOffresSpeciales();

    console.log('Initialisation terminée');
});
