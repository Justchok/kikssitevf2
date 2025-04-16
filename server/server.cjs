const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'env.config') });
const nodemailer = require('nodemailer');

// Importer la fonction d'envoi d'emails
const { sendBookingConfirmation } = require('./email.cjs');

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5002',
        'https://kikssitevf2.vercel.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public')); // Servir les fichiers du dossier public
app.use('/admin', express.static('admin')); // Servir les fichiers du dossier admin

// Route pour obtenir les vols disponibles
app.get('/api/vols', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'vols.json'), 'utf8');
        const vols = JSON.parse(data);
        res.json(vols);
    } catch (error) {
        console.error('Erreur lors de la lecture des vols:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des vols',
            error: error.message 
        });
    }
});

// Route pour obtenir les offres disponibles
app.get('/api/offres', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'offres.json'), 'utf8');
        const offres = JSON.parse(data);
        res.json(offres);
    } catch (error) {
        console.error('Erreur lors de la lecture des offres:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des offres',
            error: error.message 
        });
    }
});

// Route pour la réservation (booking)
app.post('/api/booking', async (req, res) => {
    console.log('Réception d\'une nouvelle réservation:', req.body);
    
    try {
        // Vérification et validation des données reçues
        if (!req.body || !req.body.name || !req.body.email || !req.body.flightDetails) {
            return res.status(400).json({
                message: 'Données de réservation incomplètes',
                error: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        const {
            name,
            email,
            phone,
            flightDetails,
            travelers
        } = req.body;

        // Vérification des détails du vol
        if (!flightDetails.departure || !flightDetails.destination || !flightDetails.departureDate) {
            return res.status(400).json({
                message: 'Détails du vol incomplets',
                error: 'Les informations de vol sont incomplètes'
            });
        }

        // Envoi de l'email de confirmation
        try {
            const emailResult = await sendBookingConfirmation({
                name,
                email,
                phone,
                flightDetails,
                travelers
            });
            
            if (!emailResult.success) {
                console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
            } else {
                console.log('Emails envoyés avec succès');
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
            // Ne pas arrêter le processus si l'email échoue
        }

        res.status(200).json({ 
            success: true,
            message: 'Réservation enregistrée avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'enregistrement de la réservation',
            error: error.message 
        });
    }
});

// Route pour la réservation d'offres
app.post('/api/public/book-offer', async (req, res) => {
    console.log('Réception d\'une nouvelle réservation d\'offre:', req.body);
    
    try {
        // Vérification et validation des données reçues
        if (!req.body || !req.body.name || !req.body.email) {
            return res.status(400).json({
                message: 'Données de réservation incomplètes',
                error: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        const {
            name,
            email,
            phone,
            message,
            offerTitle
        } = req.body;

        // Préparation des données pour l'email
        const flightDetails = {
            departure: 'Non applicable',
            destination: offerTitle || 'Offre spéciale',
            departureDate: 'À déterminer',
            returnDate: '',
            travelClass: 'Standard',
            passengers: 1
        };

        // Envoi de l'email de confirmation
        try {
            const emailResult = await sendBookingConfirmation({
                name,
                email,
                phone,
                flightDetails,
                additionalInfo: message
            });
            
            if (!emailResult.success) {
                console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
            } else {
                console.log('Emails envoyés avec succès');
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
            // Ne pas arrêter le processus si l'email échoue
        }

        res.status(200).json({ 
            success: true,
            message: 'Réservation d\'offre enregistrée avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de la réservation d\'offre:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'enregistrement de la réservation d\'offre',
            error: error.message 
        });
    }
});

// Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
    console.log('Réception d\'un nouveau message de contact:', req.body);
    
    try {
        // Vérification et validation des données reçues
        if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
            return res.status(400).json({
                message: 'Données du formulaire de contact incomplètes',
                error: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        const { name, email, subject, message } = req.body;

        // Envoi d'email pour le formulaire de contact
        try {
            // Configuration de l'email
            const emailData = {
                from: '"Kiks Travel" <info@kikstravel.com>',
                to: 'info@kikstravel.com',
                subject: `Nouveau message de contact: ${subject || 'Sans sujet'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2c3e50;">Nouveau message de contact</h1>
                        
                        <h3>Coordonnées:</h3>
                        <ul>
                            <li><strong>Nom:</strong> ${name}</li>
                            <li><strong>Email:</strong> ${email}</li>
                        </ul>

                        <h3>Message:</h3>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Sujet:</strong> ${subject || 'Sans sujet'}</p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                `
            };

            // Envoi de l'email
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            console.log('Envoi de l\'email de contact...');
            const info = await transporter.sendMail(emailData);
            console.log('Email de contact envoyé avec succès:', info.messageId);

            // Envoi d'un email de confirmation au client
            const clientEmailData = {
                from: '"Kiks Travel" <info@kikstravel.com>',
                to: email,
                subject: 'Confirmation de réception de votre message',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2c3e50;">Merci pour votre message!</h1>
                        
                        <p>Cher(e) ${name},</p>
                        
                        <p>Nous avons bien reçu votre message concernant "${subject || 'votre demande'}".</p>
                        
                        <p>Notre équipe va l'examiner et vous répondra dans les plus brefs délais.</p>
                        
                        <p style="margin-top: 30px;">Cordialement,<br>L'équipe Kiks Travel</p>
                    </div>
                `
            };

            console.log('Envoi de l\'email de confirmation au client...');
            const clientInfo = await transporter.sendMail(clientEmailData);
            console.log('Email de confirmation client envoyé avec succès:', clientInfo.messageId);

        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de contact:', emailError);
            // Ne pas arrêter le processus si l'email échoue
        }

        res.status(200).json({ 
            success: true,
            message: 'Message envoyé avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message de contact:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'envoi du message',
            error: error.message 
        });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
