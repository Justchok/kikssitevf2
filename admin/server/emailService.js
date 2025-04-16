require('dotenv').config({ path: '../../.env' });
const nodemailer = require('nodemailer');

// Configuration SMTP IONOS
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // true pour le port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendSpecialOfferEmail(offerDetails, customerDetails) {
    try {
        // Email pour l'agence
        const agencyEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_TO,
            subject: 'Nouvelle réservation d\'offre spéciale',
            html: `
                <h2>Nouvelle réservation d'offre spéciale</h2>
                
                <h3>Coordonnées du client:</h3>
                <ul>
                    <li>Nom: ${customerDetails.name}</li>
                    <li>Email: ${customerDetails.email}</li>
                    <li>Téléphone: ${customerDetails.phone}</li>
                </ul>

                <h3>Détails de l'offre:</h3>
                <ul>
                    <li>Titre: ${offerDetails.title}</li>
                    <li>Description: ${offerDetails.description}</li>
                    <li>Prix: ${offerDetails.price} XOF</li>
                </ul>

                <p>Date de la réservation: ${new Date().toLocaleString()}</p>
            `
        });

        // Email pour le client
        const clientEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: customerDetails.email,
            subject: 'Confirmation de votre réservation - Kiks Travel',
            html: `
                <h2>Cher(e) ${customerDetails.name},</h2>
                
                <p>Nous avons bien reçu votre demande de réservation pour l'offre spéciale suivante :</p>
                
                <h3>Détails de l'offre :</h3>
                <ul>
                    <li>Titre : ${offerDetails.title}</li>
                    <li>Description : ${offerDetails.description}</li>
                    <li>Prix : ${offerDetails.price} XOF</li>
                </ul>

                <p>Notre équipe va étudier votre demande et vous recontactera dans les plus brefs délais pour finaliser votre réservation.</p>

                <p>Cordialement,<br>L'équipe Kiks Travel</p>
            `
        });

        return { success: true, agencyEmailId: agencyEmail.id, clientEmailId: clientEmail.id };

    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        if (error.response) {
            console.error('Détails de l\'erreur:', error.response);
        }
        throw error;
    }
}

async function sendFlightBookingEmail(bookingData) {
    try {
        // Email pour l'agence
        const agencyEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_TO,
            subject: 'Nouvelle réservation de vol',
            html: `
                <h2>Nouvelle réservation de vol</h2>
                
                <h3>Coordonnées du client:</h3>
                <ul>
                    <li>Nom: ${bookingData.name}</li>
                    <li>Email: ${bookingData.email}</li>
                </ul>

                <h3>Détails du vol:</h3>
                <ul>
                    <li>Départ: ${bookingData.flightDetails.departure}</li>
                    <li>Destination: ${bookingData.flightDetails.destination}</li>
                    ${bookingData.flightDetails.layover ? `<li>Escale: ${bookingData.flightDetails.layover}</li>` : ''}
                    <li>Classe: ${bookingData.flightDetails.travelClass}</li>
                    <li>Date de départ: ${bookingData.flightDetails.departureDate}</li>
                    <li>Date de retour: ${bookingData.flightDetails.returnDate}</li>
                    <li>Nombre de passagers: ${bookingData.flightDetails.passengers}</li>
                </ul>

                <p>Date de la réservation: ${new Date().toLocaleString()}</p>
            `
        });

        // Email pour le client
        const clientEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: bookingData.email,
            subject: 'Confirmation de votre réservation de vol - Kiks Travel',
            html: `
                <h2>Cher(e) ${bookingData.name},</h2>
                
                <p>Nous avons bien reçu votre demande de réservation de vol avec les détails suivants :</p>
                
                <h3>Détails du vol :</h3>
                <ul>
                    <li>Départ : ${bookingData.flightDetails.departure}</li>
                    <li>Destination : ${bookingData.flightDetails.destination}</li>
                    ${bookingData.flightDetails.layover ? `<li>Escale : ${bookingData.flightDetails.layover}</li>` : ''}
                    <li>Classe : ${bookingData.flightDetails.travelClass}</li>
                    <li>Date de départ : ${bookingData.flightDetails.departureDate}</li>
                    <li>Date de retour : ${bookingData.flightDetails.returnDate}</li>
                    <li>Nombre de passagers : ${bookingData.flightDetails.passengers}</li>
                </ul>

                <p>Notre équipe va étudier votre demande et vous recontactera dans les plus brefs délais pour finaliser votre réservation.</p>

                <p>Cordialement,<br>L'équipe Kiks Travel</p>
            `
        });

        return { success: true, agencyEmailId: agencyEmail.id, clientEmailId: clientEmail.id };

    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        if (error.response) {
            console.error('Détails de l\'erreur:', error.response);
        }
        throw error;
    }
}

async function sendContactEmail(contactData) {
    try {
        // Email pour l'agence
        const agencyEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.EMAIL_TO,
            subject: `Nouveau message de contact - ${contactData.subject}`,
            html: `
                <h2>Nouveau message de contact</h2>
                
                <h3>Coordonnées de l'expéditeur:</h3>
                <ul>
                    <li>Nom: ${contactData.name}</li>
                    <li>Email: ${contactData.email}</li>
                </ul>

                <h3>Message:</h3>
                <p><strong>Sujet:</strong> ${contactData.subject}</p>
                <p><strong>Message:</strong><br>${contactData.message.replace(/\n/g, '<br>')}</p>

                <p>Date d'envoi: ${new Date().toLocaleString()}</p>
            `
        });

        // Email de confirmation pour l'expéditeur
        const senderEmail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: contactData.email,
            subject: 'Confirmation de réception - Kiks Travel',
            html: `
                <h2>Cher(e) ${contactData.name},</h2>
                
                <p>Nous avons bien reçu votre message concernant "${contactData.subject}".</p>
                
                <p>Notre équipe va étudier votre demande et vous répondra dans les plus brefs délais.</p>

                <p>Pour référence, voici une copie de votre message :</p>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>

                <p>Cordialement,<br>L'équipe Kiks Travel</p>
            `
        });

        return { success: true, agencyEmailId: agencyEmail.messageId, senderEmailId: senderEmail.messageId };

    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails de contact:', error);
        if (error.response) {
            console.error('Détails de l\'erreur:', error.response);
        }
        throw error;
    }
}

module.exports = {
    sendSpecialOfferEmail,
    sendFlightBookingEmail,
    sendContactEmail
};
