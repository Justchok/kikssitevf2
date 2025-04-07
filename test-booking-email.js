const { sendBookingConfirmation } = require('./server/email');

// Données de test pour simuler une réservation
const testBookingData = {
    name: 'Client Test',
    email: 'info@kikstravel.com', // Utiliser l'email de l'agence pour le test
    phone: '+221 77 123 45 67',
    flightDetails: {
        departure: 'Dakar',
        destination: 'Paris',
        layover: 'Casablanca',
        departureDate: '2025-04-15',
        returnDate: '2025-04-30',
        travelClass: 'Économique',
        passengers: 2
    }
};

// Fonction pour exécuter le test
async function runTest() {
    console.log('Démarrage du test d\'envoi d\'email de réservation...');
    console.log('Données de test:', JSON.stringify(testBookingData, null, 2));
    
    try {
        const result = await sendBookingConfirmation(testBookingData);
        
        if (result.success) {
            console.log('✅ Test réussi! Emails envoyés avec succès.');
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
