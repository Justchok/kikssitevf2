const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: './env.config' });

const app = express();
const port = process.env.PORT || 3000;

// Configuration de Resend et des emails
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_CONFIG = {
    from: 'Kiks Travel <onboarding@resend.dev>',
    to: process.env.EMAIL_TO
};

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

// Route pour obtenir les offres spéciales
app.get('/api/offres-speciales', async (req, res) => {
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
        const {
            name: nom,
            email,
            phone: telephone,
            flightDetails: {
                departure: depart,
                destination,
                layover: escale,
                travelClass: classe,
                departureDate: dateDepart,
                returnDate: dateRetour,
                passengers: passagers
            }
        } = req.body;

        if (!nom || !email || !depart || !destination || !dateDepart) {
            return res.status(400).json({
                message: 'Données de réservation invalides',
                error: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        // Email pour l'agence
        try {
            console.log('Envoi de l\'email à l\'agence...');
            const agencyEmailResult = await resend.emails.send({
                from: EMAIL_CONFIG.from,
                to: EMAIL_CONFIG.to,
                subject: 'Nouvelle réservation de voyage',
                html: `
                    <h2>Nouvelle réservation de voyage</h2>
                    
                    <h3>Coordonnées:</h3>
                    <ul>
                        <li>Nom: ${nom}</li>
                        <li>Email: ${email}</li>
                        <li>Téléphone: ${telephone || 'Non renseigné'}</li>
                    </ul>

                    <h3>Détails du voyage:</h3>
                    <ul>
                        <li>Départ: ${depart}</li>
                        <li>Destination: ${destination}</li>
                        <li>Escale: ${escale || 'Aucune'}</li>
                        <li>Classe: ${classe}</li>
                        <li>Date de départ: ${dateDepart}</li>
                        <li>Date de retour: ${dateRetour || 'Non renseigné'}</li>
                        <li>Nombre de passagers: ${passagers}</li>
                    </ul>
                `
            });
            console.log('Email agence envoyé avec succès:', agencyEmailResult);
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email à l\'agence:', emailError);
            throw emailError;
        }

        // Email pour le client
        try {
            console.log('Envoi de l\'email au client...', email);
            const clientEmailResult = await resend.emails.send({
                from: EMAIL_CONFIG.from,
                to: email,
                subject: 'Confirmation de votre demande de réservation',
                html: `
                    <h2>Cher(e) ${nom},</h2>
                    
                    <p>Nous avons bien reçu votre demande de réservation de voyage.</p>
                    
                    <h3>Récapitulatif de votre voyage :</h3>
                    <ul>
                        <li>Départ: ${depart}</li>
                        <li>Destination: ${destination}</li>
                        <li>Escale: ${escale || 'Aucune'}</li>
                        <li>Date de départ: ${dateDepart}</li>
                        <li>Date de retour: ${dateRetour || 'Non renseigné'}</li>
                        <li>Classe: ${classe}</li>
                        <li>Nombre de passagers: ${passagers}</li>
                    </ul>

                    <p>Notre équipe va traiter votre demande et vous recontactera dans les plus brefs délais.</p>

                    <p>Cordialement,<br>L'équipe Kiks Travel</p>
                `
            });
            console.log('Email client envoyé avec succès:', clientEmailResult);
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email au client:', emailError);
            throw emailError;
        }

        res.status(200).json({ message: 'Réservation enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la réservation',
            error: error.message 
        });
    }
});

// Gérer toutes les autres routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        message: 'Route non trouvée',
        path: req.path
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
