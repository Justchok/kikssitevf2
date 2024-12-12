require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware pour le logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware CORS et JSON
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.get('/api/destinations', (req, res) => {
    try {
        const destinations = require('./server/data/destinations.json');
        res.json(destinations);
    } catch (error) {
        console.error('Erreur lors du chargement des destinations:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des destinations' });
    }
});

app.get('/api/offres-speciales', (req, res) => {
    try {
        const offres = require('./server/data/offres.json');
        res.json(offres);
    } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des offres' });
    }
});

app.get('/api/groupes', (req, res) => {
    try {
        const groupes = require('./server/data/groupes.json');
        res.json(groupes);
    } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des groupes' });
    }
});

// Route pour les réservations de vols
app.post('/api/public/book-flight', async (req, res) => {
    try {
        console.log('Réception d\'une réservation de vol:', req.body);
        const { name, email, flightDetails } = req.body;
        
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY non configurée');
        }

        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
            to: process.env.EMAIL_TO || 'votre-email@example.com',
            subject: 'Nouvelle réservation de vol',
            html: `
                <h1>Nouvelle réservation de vol</h1>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <h2>Détails du vol:</h2>
                <p><strong>Départ:</strong> ${flightDetails.departure}</p>
                <p><strong>Destination:</strong> ${flightDetails.destination}</p>
                <p><strong>Escale:</strong> ${flightDetails.layover || 'Aucune'}</p>
                <p><strong>Classe:</strong> ${flightDetails.travelClass}</p>
                <p><strong>Date de départ:</strong> ${flightDetails.departureDate}</p>
                <p><strong>Date de retour:</strong> ${flightDetails.returnDate}</p>
                <p><strong>Nombre de passagers:</strong> ${flightDetails.passengers}</p>
            `
        });

        res.json({ success: true, message: 'Réservation envoyée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de la réservation',
            error: error.message 
        });
    }
});

// Route pour les réservations d'offres
app.post('/api/public/book-offer', async (req, res) => {
    try {
        console.log('Réception d\'une réservation d\'offre:', req.body);
        const { name, email, phone, offerTitle } = req.body;
        
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY non configurée');
        }

        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
            to: process.env.EMAIL_TO || 'votre-email@example.com',
            subject: 'Nouvelle réservation d\'offre spéciale',
            html: `
                <h1>Nouvelle réservation d'offre spéciale</h1>
                <p><strong>Offre:</strong> ${offerTitle}</p>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${phone}</p>
            `
        });

        res.json({ success: true, message: 'Réservation d\'offre envoyée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation d\'offre:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de la réservation',
            error: error.message 
        });
    }
});

// Route par défaut pour le frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log('Variables d\'environnement:');
    console.log('- RESEND_API_KEY configurée:', !!process.env.RESEND_API_KEY);
    console.log('- EMAIL_TO configuré:', !!process.env.EMAIL_TO);
});
