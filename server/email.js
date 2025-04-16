const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: '../env.config' });

// Configuration du transporteur SMTP Ionos
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // true pour 465, false pour les autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendBookingConfirmation(bookingData) {
    try {
        console.log('Tentative d\'envoi d\'email via SMTP Ionos...');
        console.log('Données de réservation:', bookingData);

        // Vérifier que les données nécessaires sont présentes
        if (!bookingData || !bookingData.name || !bookingData.email || !bookingData.flightDetails) {
            console.error('Données de réservation incomplètes:', bookingData);
            return { success: false, error: 'Données de réservation incomplètes' };
        }

        const { name, email, phone, flightDetails } = bookingData;
        
        // Email pour le client
        const clientEmailData = {
            from: '"Kiks Travel" <info@kikstravel.com>',
            to: email,
            subject: 'Confirmation de votre demande de réservation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50;">Merci pour votre demande de réservation!</h1>
                    
                    <p>Cher(e) ${name},</p>
                    
                    <p>Nous avons bien reçu votre demande avec les détails suivants :</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Départ:</strong> ${flightDetails.departure}</p>
                        ${flightDetails.layover ? `<p><strong>Escale:</strong> ${flightDetails.layover}</p>` : '<p><strong>Escale:</strong> Aucune</p>'}
                        <p><strong>Destination:</strong> ${flightDetails.destination}</p>
                        <p><strong>Date de départ:</strong> ${flightDetails.departureDate}</p>
                        <p><strong>Date de retour:</strong> ${flightDetails.returnDate || 'Non spécifiée'}</p>
                        <p><strong>Classe:</strong> ${flightDetails.travelClass}</p>
                        <p><strong>Nombre de passagers:</strong> ${flightDetails.passengers || '1'}</p>
                    </div>
                    
                    <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.</p>
                    
                    <p style="margin-top: 30px;">Cordialement,<br>L'équipe Kiks Travel</p>
                </div>
            `
        };

        // Email pour l'agence
        const agencyEmailData = {
            from: '"Kiks Travel" <info@kikstravel.com>',
            to: 'info@kikstravel.com',
            subject: 'Nouvelle réservation de voyage',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50;">Nouvelle réservation de voyage</h1>
                    
                    <h3>Coordonnées:</h3>
                    <ul>
                        <li><strong>Nom:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</li>
                    </ul>

                    <h3>Détails du voyage:</h3>
                    <ul>
                        <li><strong>Départ:</strong> ${flightDetails.departure}</li>
                        <li><strong>Destination:</strong> ${flightDetails.destination}</li>
                        <li><strong>Escale:</strong> ${flightDetails.layover || 'Aucune'}</li>
                        <li><strong>Classe:</strong> ${flightDetails.travelClass}</li>
                        <li><strong>Date de départ:</strong> ${flightDetails.departureDate}</li>
                        <li><strong>Date de retour:</strong> ${flightDetails.returnDate || 'Non renseigné'}</li>
                        <li><strong>Nombre de passagers:</strong> ${flightDetails.passengers || '1'}</li>
                    </ul>
                </div>
            `
        };

        console.log('Envoi de l\'email au client...');
        const clientInfo = await transporter.sendMail(clientEmailData);
        console.log('Email client envoyé avec succès:', clientInfo.messageId);

        console.log('Envoi de l\'email à l\'agence...');
        const agencyInfo = await transporter.sendMail(agencyEmailData);
        console.log('Email agence envoyé avec succès:', agencyInfo.messageId);

        return { 
            success: true, 
            data: {
                client: clientInfo.messageId,
                agency: agencyInfo.messageId
            } 
        };
    } catch (error) {
        console.error('Erreur d\'envoi d\'email:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendBookingConfirmation };
