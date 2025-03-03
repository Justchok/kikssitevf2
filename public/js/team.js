document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal when clicking read more
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking close button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    });
});

// Structure des membres de l'équipe
const teamMembers = [
    {
        name: "Raki Hawa KANE",
        position: "Directrice",
        description: "En tant que Directrice, je coordonne l'ensemble des activités de l'agence pour assurer une expérience de voyage exceptionnelle à nos clients.",
        photo: "assets/images/team/default-avatar.jpg"
    },
    {
        name: "Maimouna Mounira KANE",
        position: "Chef de comptoir - Aide comptable",
        description: "Responsable de la gestion du portefeuille client et des opérations financières de l'entreprise. Je veille à la bonne gestion de la caisse et des transactions bancaires.",
        photo: "assets/images/team/default-avatar.jpg"
    },
    {
        name: "Adama Diallo FATY",
        position: "Chauffeur - Responsable transfert",
        description: "En charge des transferts clients, je m'assure que chaque déplacement soit confortable, sécurisé et ponctuel pour une expérience de voyage optimale.",
        photo: "assets/images/team/default-avatar.jpg"
    },
    {
        name: "SALL",
        position: "Agent de voyage",
        description: "Spécialiste en billetterie et réservations, je vous accompagne dans tous vos besoins : billets d'avion, assurances voyage et auto, réservations d'hôtel et plus encore.",
        photo: "assets/images/team/default-avatar.jpg"
    },
    {
        name: "EMILIENNE CHADIA BAMPOKI",
        position: "RESPONSABLE TOURISME",
        description: "Experte en création de produits touristiques, je conçois des expériences de voyage uniques et mémorables. Mon expertise comprend la sélection minutieuse des destinations, l'organisation d'activités enrichissantes, la négociation avec les meilleurs hébergements et l'optimisation des solutions de transport pour garantir des voyages inoubliables à nos clients.",
        photo: "assets/images/team/default-avatar.jpg"
    }
];

// Fonction pour afficher les membres de l'équipe
function updateTeamDisplay() {
    const teamGrid = document.getElementById('team-members');
    if (!teamGrid) return;

    teamGrid.innerHTML = teamMembers.map((member, index) => `
        <div class="team-member">
            <div class="member-image-container">
                <img src="${member.photo}" alt="${member.name}" class="member-image">
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="position">${member.position}</p>
                <p class="description" id="description-${index}">${member.description}</p>
                <button class="read-more-btn" onclick="toggleDescription(${index})">Voir plus</button>
            </div>
        </div>
    `).join('');
}

// Fonction pour basculer l'affichage de la description
function toggleDescription(index) {
    const description = document.getElementById(`description-${index}`);
    const button = description.nextElementSibling;
    
    if (description.classList.contains('expanded')) {
        description.classList.remove('expanded');
        button.textContent = 'Voir plus';
    } else {
        description.classList.add('expanded');
        button.textContent = 'Voir moins';
    }
}

// Initialiser l'affichage quand le document est chargé
document.addEventListener('DOMContentLoaded', updateTeamDisplay);
