const { sendBookingConfirmation } = require('./server/email.cjs');

// Données de test pour simuler une réservation avec plusieurs passagers
const testBookingData = {
    name: 'Client Test',
    email: 'test@kikstravel.com',
    phone: '+221 77 123 45 67',
    flightDetails: {
        departure: 'Dakar',
        destination: 'Paris',
        layover: 'Casablanca',
        departureDate: '2025-04-15',
        returnDate: '2025-04-30',
        travelClass: 'Économique',
        passengers: 4 // 2 adultes, 1 enfant, 1 bébé
    },
    travelers: [
        {
            type: 'adult',
            firstName: 'Jean',
            lastName: 'Dupont'
        },
        {
            type: 'adult',
            firstName: 'Marie',
            lastName: 'Dupont'
        },
        {
            type: 'child',
            firstName: 'Lucas',
            lastName: 'Dupont'
        },
        {
            type: 'infant',
            firstName: 'Emma',
            lastName: 'Dupont'
        }
    ]
};

// Fonction pour exécuter le test
async function runTest() {
    console.log('Démarrage du test d\'envoi d\'email avec plusieurs passagers...');
    console.log('Données de test:', JSON.stringify(testBookingData, null, 2));
    
    try {
        const result = await sendBookingConfirmation(testBookingData);
        
        if (result.success) {
            console.log('✅ Test réussi! Emails envoyés avec succès.');
            console.log('Email client envoyé à:', testBookingData.email);
            console.log('Email agence envoyé à: info@kikstravel.com');
            console.log('Nombre de passagers:', testBookingData.travelers.length);
            console.log('IDs des messages:', result.data);
        } else {
            console.error('❌ Échec du test:', result.error);
        }
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

// Exécuter le test
runTest();
