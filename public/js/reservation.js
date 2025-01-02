// Fonction pour récupérer les paramètres de l'URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fonction pour pré-remplir le formulaire avec la destination
function fillDestinationForm() {
    const destination = getUrlParameter('destination');
    if (destination) {
        const input = document.getElementById('destination');
        if (input) {
            // Décode l'URL et met à jour la valeur
            input.value = decodeURIComponent(destination);
            // Déclenche l'événement change pour mettre à jour tout composant dépendant
            input.dispatchEvent(new Event('change'));
        }
    }
}

// Exécute le remplissage au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillDestinationForm);
} else {
    fillDestinationForm();
}
