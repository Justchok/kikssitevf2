require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));

// Routes API
app.get('/api/destinations', (req, res) => {
    const destinations = require('./server/data/destinations.json');
    res.json(destinations);
});

app.get('/api/offres-speciales', (req, res) => {
    const offres = require('./server/data/offres.json');
    res.json(offres);
});

app.get('/api/groupes', (req, res) => {
    const groupes = require('./server/data/groupes.json');
    res.json(groupes);
});

app.get('/api/vols', (req, res) => {
    const vols = require('./server/data/vols.json');
    res.json(vols);
});

// Route pour les réservations
app.post('/api/public/book-flight', async (req, res) => {
    try {
        const { name, email, flightDetails } = req.body;
        
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
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la réservation' });
    }
});

// Route pour les réservations d'offres spéciales
app.post('/api/public/book-offer', async (req, res) => {
    try {
        const { name, email, phone, offerTitle } = req.body;
        
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
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la réservation' });
    }
});

// Route par défaut pour le frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
