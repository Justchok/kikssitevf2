const nodemailer = require('nodemailer');

// Donnu00e9es de test pour simuler un message de contact
const testContactData = {
    name: 'Client Test',
    email: 'test@kikstravel.com',
    subject: 'Test du formulaire de contact',
    message: 'Ceci est un message de test pour vu00e9rifier que les emails du formulaire de contact fonctionnent correctement.'
};

// Fonction pour envoyer un email de test
async function sendContactEmail() {
    try {
        // Configuration du transporteur SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.ionos.fr',
            port: 465,
            secure: true,
            auth: {
                user: 'info@kikstravel.com',
                pass: process.env.SMTP_PASSWORD || 'Ktravel&tours1!'
            }
        });

        // Configuration de l'email pour l'agence
        const emailData = {
            from: '"Kiks Travel" <info@kikstravel.com>',
            to: 'info@kikstravel.com',
            subject: `Nouveau message de contact: ${testContactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50;">Nouveau message de contact</h1>
                    
                    <h3>Coordonnu00e9es:</h3>
                    <ul>
                        <li><strong>Nom:</strong> ${testContactData.name}</li>
                        <li><strong>Email:</strong> ${testContactData.email}</li>
                    </ul>

                    <h3>Message:</h3>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Sujet:</strong> ${testContactData.subject}</p>
                        <p>${testContactData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `
        };

        // Configuration de l'email de confirmation pour le client
        const clientEmailData = {
            from: '"Kiks Travel" <info@kikstravel.com>',
            to: testContactData.email,
            subject: 'Confirmation de ru00e9ception de votre message',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50;">Merci pour votre message!</h1>
                    
                    <p>Cher(e) ${testContactData.name},</p>
                    
                    <p>Nous avons bien reu00e7u votre message concernant "${testContactData.subject}".</p>
                    
                    <p>Notre u00e9quipe va l'examiner et vous ru00e9pondra dans les plus brefs du00e9lais.</p>
                    
                    <p style="margin-top: 30px;">Cordialement,<br>L'u00e9quipe Kiks Travel</p>
                </div>
            `
        };

        console.log('Du00e9marrage du test d\'envoi d\'emails de contact...');
        console.log('Donnu00e9es de test:', JSON.stringify(testContactData, null, 2));

        // Envoi de l'email u00e0 l'agence
        console.log('Envoi de l\'email de contact u00e0 l\'agence...');
        const agencyInfo = await transporter.sendMail(emailData);
        console.log('Email de contact envoyu00e9 avec succu00e8s:', agencyInfo.messageId);

        // Envoi de l'email de confirmation au client
        console.log('Envoi de l\'email de confirmation au client...');
        const clientInfo = await transporter.sendMail(clientEmailData);
        console.log('Email de confirmation client envoyu00e9 avec succu00e8s:', clientInfo.messageId);

        console.log('u2705 Test ru00e9ussi! Tous les emails ont u00e9tu00e9 envoyu00e9s avec succu00e8s.');
        return {
            success: true,
            agencyEmail: agencyInfo.messageId,
            clientEmail: clientInfo.messageId
        };
    } catch (error) {
        console.error('u274c Erreur lors de l\'envoi des emails de contact:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Exu00e9cuter le test
sendContactEmail();
