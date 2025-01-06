const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const port = 3001; // Utilisons un port différent pour le test

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true, // true pour 465, false pour les autres ports
    auth: {
        user: 'info@kikstravel.com',
        pass: 'Ktravel&tours1!'
    },
    debug: true // Active le mode debug
});

// Route de test
app.get('/test-email', async (req, res) => {
    try {
        // Envoi de l'email de test
        const info = await transporter.sendMail({
            from: '"Kiks Travel" <info@kikstravel.com>',
            to: 'info@kikstravel.com',
            subject: 'Test Email IONOS SMTP - ' + new Date().toLocaleString(),
            html: `
                <h2>Test d'envoi d'email via SMTP IONOS</h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
                    <p>Ceci est un email de test envoyé le ${new Date().toLocaleString()}</p>
                    <p>Configuration utilisée :</p>
                    <ul>
                        <li>Serveur SMTP : smtp.ionos.fr</li>
                        <li>Port : 465</li>
                        <li>Sécurité : SMTPS (SSL)</li>
                        <li>Authentification : Oui</li>
                        <li>Compte : info@kikstravel.com</li>
                    </ul>
                    <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement.</p>
                </div>
            `
        });

        res.send(`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;">
                <h1 style="color: green;">Email envoyé avec succès !</h1>
                <p>Vérifiez la boîte de réception de info@kikstravel.com</p>
                <p><strong>Détails techniques :</strong></p>
                <pre style="background: #f9f9f9; padding: 10px;">
ID du message : ${info.messageId}
Réponse : ${info.response}
                </pre>
            </div>
        `);
    } catch (error) {
        console.error('Erreur:', error);
        res.send(`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;">
                <h1 style="color: red;">Erreur lors de l'envoi de l'email</h1>
                <p>Message d'erreur : ${error.message}</p>
                <pre style="background: #f9f9f9; padding: 10px;">
${error.stack}
                </pre>
            </div>
        `);
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur de test démarré sur http://localhost:${port}/test-email`);
});
