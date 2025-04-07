const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', 'env.config') });

// Configuration du transporteur SMTP Ionos
const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true, // true pour 465, false pour les autres ports
    auth: {
        user: 'info@kikstravel.com',
        pass: process.env.SMTP_PASSWORD || 'Ktravel&tours1!'
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

        const { name, email, phone, flightDetails, travelers, additionalInfo } = bookingData;
        
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
                        ${additionalInfo ? `<p><strong>Message:</strong> ${additionalInfo}</p>` : ''}
                    </div>
                    
                    <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.</p>
                    
                    <p style="margin-top: 30px;">Cordialement,<br>L'équipe Kiks Travel</p>
                </div>
            `
        };

        // Générer la liste des passagers pour l'email de l'agence
        let passengersHtml = '';
        
        if (travelers && travelers.length > 0) {
            passengersHtml = `
                <h3>Liste des passagers:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Type</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Prénom</th>
                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Nom</th>
                    </tr>
            `;
            
            travelers.forEach(traveler => {
                const travelerType = {
                    'adult': 'Adulte',
                    'child': 'Enfant',
                    'infant': 'Bébé'
                }[traveler.type] || traveler.type;
                
                passengersHtml += `
                    <tr>
                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${travelerType}</td>
                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${traveler.firstName}</td>
                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${traveler.lastName}</td>
                    </tr>
                `;
            });
            
            passengersHtml += '</table>';
        } else {
            passengersHtml = '<p>Aucune information sur les passagers n\'a été fournie.</p>';
        }

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
                        <li><strong>Date de retour:</strong> ${flightDetails.returnDate || 'Non spécifiée'}</li>
                        <li><strong>Nombre de passagers:</strong> ${flightDetails.passengers || '1'}</li>
                        ${additionalInfo ? `<li><strong>Message:</strong> ${additionalInfo}</li>` : ''}
                    </ul>
                    
                    ${passengersHtml}
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
