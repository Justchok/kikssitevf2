const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: './env.config' });

// Importer la fonction d'envoi d'emails
const { sendBookingConfirmation } = require('./email');

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
            flightDetails
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
                flightDetails
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
