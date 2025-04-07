const { sendBookingConfirmation } = require('./server/email.cjs');

// Donnu00e9es de test pour simuler une ru00e9servation d'offre
const testOfferData = {
    name: 'Client Test',
    email: 'test@kikstravel.com',
    phone: '+221 77 123 45 67',
    message: 'Je souhaiterais des informations complu00e9mentaires sur cette offre.',
    offerTitle: 'Hajj 2025'
};

// Pru00e9paration des donnu00e9es pour l'email
const bookingData = {
    name: testOfferData.name,
    email: testOfferData.email,
    phone: testOfferData.phone,
    flightDetails: {
        departure: 'Non applicable',
        destination: testOfferData.offerTitle,
        departureDate: 'À déterminer',
        returnDate: '',
        travelClass: 'Standard',
        passengers: 1
    },
    additionalInfo: testOfferData.message
};

// Fonction pour exu00e9cuter le test
async function runTest() {
    console.log('Du00e9marrage du test de ru00e9servation d\'offre...');
    console.log('Donnu00e9es de test:', JSON.stringify(testOfferData, null, 2));
    
    try {
        const result = await sendBookingConfirmation(bookingData);
        
        if (result.success) {
            console.log('u2705 Test ru00e9ussi! Emails envoyu00e9s avec succu00e8s.');
            console.log('Email client envoyu00e9 u00e0:', testOfferData.email);
            console.log('Email agence envoyu00e9 u00e0: info@kikstravel.com');
            console.log('IDs des messages:', result.data);
        } else {
            console.error('u274c u00c9chec du test:', result.error);
        }
    } catch (error) {
        console.error('u274c Erreur lors du test:', error);
    }
}

// Exu00e9cuter le test
runTest();
