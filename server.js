import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { Resend } from 'resend';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';

// Configuration des chemins pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration de l'email vérifié
const VERIFIED_EMAIL = 'onboarding@resend.dev'; // Email de test Resend

// Middleware pour le logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware CORS et JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour gérer les fichiers uploadés
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB max
    },
    abortOnLimit: true
}));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes API
app.get('/api/destinations', (req, res) => {
    try {
        const destinations = JSON.parse(fs.readFileSync('./server/data/destinations.json', 'utf8'));
        res.json(destinations);
    } catch (error) {
        console.error('Erreur lors du chargement des destinations:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des destinations' });
    }
});

app.get('/api/offres-speciales', (req, res) => {
    try {
        const offres = JSON.parse(fs.readFileSync('./server/data/offres.json', 'utf8'));
        res.json(offres);
    } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des offres' });
    }
});

app.get('/api/groupes', (req, res) => {
    try {
        const groupes = JSON.parse(fs.readFileSync('./server/data/groupes.json', 'utf8'));
        res.json(groupes);
    } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des groupes' });
    }
});

// Fonction pour attendre un certain temps
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Email templates
const adminEmailTemplate = (name, email, phone, flightDetails) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2980b9; margin-top: 20px; }
        p { margin: 10px 0; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .highlight { color: #2c3e50; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Nouvelle réservation de vol</h1>
    <div class="details">
        <p><span class="highlight">Nom:</span> ${name}</p>
        <p><span class="highlight">Email:</span> ${email}</p>
        <p><span class="highlight">Téléphone:</span> ${phone}</p>
        
        <h2>Détails du vol:</h2>
        <p><span class="highlight">Départ:</span> ${flightDetails.departure}</p>
        <p><span class="highlight">Destination:</span> ${flightDetails.destination}</p>
        <p><span class="highlight">Escale:</span> ${flightDetails.layover || 'Aucune'}</p>
        <p><span class="highlight">Classe:</span> ${flightDetails.travelClass}</p>
        <p><span class="highlight">Date de départ:</span> ${flightDetails.departureDate}</p>
        <p><span class="highlight">Date de retour:</span> ${flightDetails.returnDate}</p>
        <p><span class="highlight">Nombre de passagers:</span> ${flightDetails.passengers}</p>
    </div>
</body>
</html>
`;

const clientEmailTemplate = (name, phone, flightDetails) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2980b9; margin-top: 20px; }
        p { margin: 10px 0; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .highlight { color: #2c3e50; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-style: italic; }
    </style>
</head>
<body>
    <h1>Confirmation de votre réservation</h1>
    <p>Cher(e) ${name},</p>
    <p>Nous avons bien reçu votre demande de réservation. Notre équipe la traitera dans les plus brefs délais.</p>
    
    <div class="details">
        <h2>Récapitulatif de votre réservation :</h2>
        <p><span class="highlight">Vol :</span> ${flightDetails.departure} → ${flightDetails.destination}</p>
        <p><span class="highlight">Date de départ :</span> ${flightDetails.departureDate}</p>
        <p><span class="highlight">Date de retour :</span> ${flightDetails.returnDate}</p>
        <p><span class="highlight">Classe :</span> ${flightDetails.travelClass}</p>
        <p><span class="highlight">Nombre de passagers :</span> ${flightDetails.passengers}</p>
    </div>
    
    <p>Un membre de notre équipe vous contactera prochainement au ${phone} pour finaliser votre réservation.</p>
    
    <div class="footer">
        <p>Cordialement,<br>
        L'équipe Kiks Travel</p>
    </div>
</body>
</html>
`;

const offerAdminEmailTemplate = (name, email, phone, offerTitle) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2980b9; margin-top: 20px; }
        p { margin: 10px 0; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .highlight { color: #2c3e50; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Nouvelle réservation d'offre spéciale</h1>
    <div class="details">
        <h2>Détails de la réservation</h2>
        <p><span class="highlight">Offre:</span> ${offerTitle}</p>
        <p><span class="highlight">Nom:</span> ${name}</p>
        <p><span class="highlight">Email:</span> ${email}</p>
        <p><span class="highlight">Téléphone:</span> ${phone}</p>
    </div>
</body>
</html>
`;

const offerClientEmailTemplate = (name, phone, offerTitle) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2980b9; margin-top: 20px; }
        p { margin: 10px 0; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .highlight { color: #2c3e50; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-style: italic; }
    </style>
</head>
<body>
    <h1>Confirmation de votre réservation</h1>
    <p>Cher(e) ${name},</p>
    <p>Nous avons bien reçu votre demande de réservation pour l'offre "${offerTitle}". Notre équipe la traitera dans les plus brefs délais.</p>
    
    <div class="details">
        <h2>Récapitulatif de votre réservation :</h2>
        <p><span class="highlight">Offre sélectionnée :</span> ${offerTitle}</p>
    </div>
    
    <p>Un membre de notre équipe vous contactera prochainement au ${phone} pour finaliser votre réservation.</p>
    
    <div class="footer">
        <p>Cordialement,<br>
        L'équipe Kiks Travel</p>
    </div>
</body>
</html>
`;

// Middleware d'authentification admin
const adminAuth = (req, res, next) => {
    console.log('Headers reçus:', req.headers);
    const adminKey = req.headers['admin-key'];
    const expectedKey = process.env.ADMIN_KEY || '6f55675189faca1b946baa26439ca7c6da1600da02c14e54ef560647fc46f8ff';
    console.log('Admin key reçue:', adminKey);
    console.log('Admin key attendue:', expectedKey);
    if (adminKey === expectedKey) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
};

// Route pour les réservations de vols
app.post('/api/public/book-flight', async (req, res) => {
    try {
        console.log('Réception d\'une réservation de vol:', req.body);
        const { name, email, phone, flightDetails } = req.body;
        
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY non configurée');
        }

        console.log('Clé API Resend:', process.env.RESEND_API_KEY);
        console.log('Email admin:', process.env.EMAIL_TO);
        console.log('Email client:', email);

        try {
            console.log('Envoi de l\'email à l\'administrateur...');
            // Email pour l'administrateur
            const adminEmailResult = await resend.emails.send({
                from: VERIFIED_EMAIL,
                to: process.env.EMAIL_TO,
                subject: 'Nouvelle réservation de vol',
                html: adminEmailTemplate(name, email, phone, flightDetails)
            });
            console.log('Résultat email admin:', adminEmailResult);
        } catch (adminError) {
            console.error('Erreur lors de l\'envoi de l\'email admin:', adminError);
            throw adminError;
        }

        // Attendre 1 seconde entre les envois pour respecter la limite de taux
        console.log('Attente de 1 seconde avant d\'envoyer l\'email client...');
        await wait(1000);

        try {
            console.log('Envoi de l\'email de confirmation au client:', email);
            // Email de confirmation pour le client
            const clientEmailResult = await resend.emails.send({
                from: VERIFIED_EMAIL,
                to: email,
                subject: 'Confirmation de votre réservation - Kiks Travel',
                html: clientEmailTemplate(name, phone, flightDetails)
            });
            console.log('Résultat email client:', clientEmailResult);
        } catch (clientError) {
            console.error('Erreur lors de l\'envoi de l\'email client:', clientError);
            throw clientError;
        }

        res.json({ success: true, message: 'Réservation envoyée avec succès' });
    } catch (error) {
        console.error('Erreur détaillée lors de la réservation:', error);
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

        try {
            console.log('Envoi de l\'email à l\'administrateur...');
            // Email pour l'administrateur
            const adminEmailResult = await resend.emails.send({
                from: VERIFIED_EMAIL,
                to: process.env.EMAIL_TO,
                subject: 'Nouvelle réservation d\'offre spéciale',
                html: offerAdminEmailTemplate(name, email, phone, offerTitle)
            });
            console.log('Résultat email admin:', adminEmailResult);
        } catch (adminError) {
            console.error('Erreur lors de l\'envoi de l\'email admin:', adminError);
            throw adminError;
        }

        // Attendre 1 seconde entre les envois pour respecter la limite de taux
        console.log('Attente de 1 seconde avant d\'envoyer l\'email client...');
        await wait(1000);

        try {
            console.log('Envoi de l\'email de confirmation au client:', email);
            // Email de confirmation pour le client
            const clientEmailResult = await resend.emails.send({
                from: VERIFIED_EMAIL,
                to: email,
                subject: 'Confirmation de votre réservation - Kiks Travel',
                html: offerClientEmailTemplate(name, phone, offerTitle)
            });
            console.log('Résultat email client:', clientEmailResult);
        } catch (clientError) {
            console.error('Erreur lors de l\'envoi de l\'email client:', clientError);
            throw clientError;
        }

        res.json({ success: true, message: 'Réservation d\'offre envoyée avec succès' });
    } catch (error) {
        console.error('Erreur détaillée lors de la réservation d\'offre:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de la réservation',
            error: error.message 
        });
    }
});

// Routes d'administration
app.post('/api/offers', adminAuth, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const image = req.files?.image;

        // Lecture des offres existantes
        let offres = [];
        try {
            offres = JSON.parse(fs.readFileSync('./server/data/offres.json', 'utf8'));
        } catch (error) {
            console.log('Aucun fichier offres.json existant, création d\'un nouveau fichier');
        }

        // Gestion de l'image
        let imagePath = '';
        if (image) {
            const uploadDir = path.join(__dirname, 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = Date.now() + '-' + image.name;
            const uploadPath = path.join(uploadDir, fileName);
            await image.mv(uploadPath);
            imagePath = '/uploads/' + fileName;
        }

        // Création de la nouvelle offre
        const newOffer = {
            id: offres.length + 1,
            titre: title,
            description,
            prix: price,
            devise: 'XOF',
            image: imagePath || '/assets/images/default.jpg'
        };

        // Ajout de la nouvelle offre
        offres.push(newOffer);

        // Sauvegarde dans le fichier
        fs.writeFileSync('./server/data/offres.json', JSON.stringify(offres, null, 4));

        res.json(newOffer);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'offre:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'offre' });
    }
});

app.post('/api/gallery', adminAuth, async (req, res) => {
    try {
        const { title } = req.body;
        const images = req.files?.images;

        if (!images) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        // Créer le dossier d'upload s'il n'existe pas
        const uploadDir = './public/uploads/gallery';
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        // Gérer les images
        let imagePaths = [];
        if (Array.isArray(images)) {
            // Plusieurs images
            for (const image of images) {
                const imagePath = `/uploads/gallery/${Date.now()}-${image.name}`;
                await image.mv(`.${imagePath}`);
                imagePaths.push(imagePath);
            }
        } else {
            // Une seule image
            const imagePath = `/uploads/gallery/${Date.now()}-${images.name}`;
            await images.mv(`.${imagePath}`);
            imagePaths.push(imagePath);
        }

        // Créer la nouvelle galerie dans MongoDB
        const newGallery = {
            title,
            images: imagePaths
        };

        res.json(newGallery);
    } catch (error) {
        console.error('Erreur lors de la création de la galerie:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la galerie' });
    }
});

// Route de migration
app.post('/api/admin/migrate', adminAuth, async (req, res) => {
    try {
        console.log('Début de la migration...');
        
        // Migration des offres
        const offres = JSON.parse(fs.readFileSync('./server/data/offres.json', 'utf8'));
        console.log('Migration des offres terminée');
        
        // Migration de la galerie
        const galerie = JSON.parse(fs.readFileSync('./server/data/galerie.json', 'utf8'));
        console.log('Migration de la galerie terminée');
        
        res.json({ message: 'Migration réussie' });
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
        res.status(500).json({ error: 'Erreur lors de la migration' });
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
