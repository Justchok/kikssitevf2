const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: './env.config' });

const app = express();
const port = process.env.PORT || 3000;

// Configuration de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
            departure: depart,
            destination,
            layover: escale,
            travelClass: classe,
            departureDate: dateDepart,
            returnDate: dateRetour,
            passengers: passagers
        } = req.body;

        if (!nom || !email) {
            return res.status(400).json({
                message: 'Données de réservation invalides',
                error: 'Les champs nom et email sont requis'
            });
        }

        // Email pour l'agence
        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
            to: process.env.EMAIL_TO,
            subject: 'Nouvelle réservation de voyage',
            html: `
                <h2>Nouvelle réservation de voyage</h2>
                
                <h3>Coordonnées:</h3>
                <ul>
                    <li>Nom: ${nom}</li>
                    <li>Email: ${email}</li>
                </ul>

                <h3>Détails du voyage:</h3>
                <ul>
                    <li>Départ: ${depart}</li>
                    <li>Destination: ${destination}</li>
                    <li>Escale: ${escale || 'Aucune'}</li>
                    <li>Date de départ: ${dateDepart}</li>
                    <li>Date de retour: ${dateRetour}</li>
                    <li>Classe: ${classe}</li>
                    <li>Nombre de passagers: ${passagers}</li>
                </ul>
            `
        });

        // Email pour le client
        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
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
                    <li>Date de retour: ${dateRetour}</li>
                    <li>Classe: ${classe}</li>
                    <li>Nombre de passagers: ${passagers}</li>
                </ul>

                <p>Notre équipe va traiter votre demande et vous recontactera dans les plus brefs délais.</p>

                <p>Cordialement,<br>L'équipe Kiks Travel</p>
            `
        });

        res.status(200).json({ message: 'Réservation enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la réservation',
            error: error.message 
        });
    }
});

// Route pour les offres spéciales
app.post('/api/public/book-offer', async (req, res) => {
    console.log('Réception d\'une nouvelle réservation d\'offre spéciale:', req.body);
    try {
        const {
            nom,
            email,
            telephone,
            offerTitle
        } = req.body;

        if (!nom || !email || !offerTitle) {
            return res.status(400).json({
                message: 'Données de réservation invalides',
                error: 'Les champs nom, email et titre de l\'offre sont requis'
            });
        }

        // Email pour l'agence
        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
            to: process.env.EMAIL_TO,
            subject: 'Nouvelle réservation d\'offre spéciale',
            html: `
                <h2>Nouvelle réservation d'offre spéciale</h2>
                
                <h3>Coordonnées:</h3>
                <ul>
                    <li>Nom: ${nom}</li>
                    <li>Email: ${email}</li>
                    <li>Téléphone: ${telephone || 'Non spécifié'}</li>
                </ul>

                <h3>Détails de l'offre:</h3>
                <ul>
                    <li>Offre: ${offerTitle}</li>
                </ul>
            `
        });

        // Email pour le client
        await resend.emails.send({
            from: 'Kiks Travel <onboarding@resend.dev>',
            to: email,
            subject: 'Confirmation de votre réservation d\'offre spéciale',
            html: `
                <h2>Cher(e) ${nom},</h2>
                
                <p>Nous avons bien reçu votre demande de réservation pour l'offre "${offerTitle}".</p>
                
                <p>Notre équipe va traiter votre demande et vous recontactera dans les plus brefs délais avec tous les détails.</p>

                <p>Cordialement,<br>L'équipe Kiks Travel</p>
            `
        });

        res.status(200).json({ message: 'Réservation d\'offre spéciale enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation d\'offre spéciale:', error);
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

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
