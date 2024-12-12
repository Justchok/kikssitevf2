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

// Configuration pour Railway
const UPLOAD_PATH = process.env.RAILWAY_ENVIRONMENT 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'public', 'uploads');

// Créer les dossiers nécessaires s'ils n'existent pas
const GALLERY_PATH = path.join(UPLOAD_PATH, 'gallery');
fs.mkdirSync(GALLERY_PATH, { recursive: true });

// Middleware pour protéger le dossier admin
app.use('/admin', (req, res, next) => {
  const referer = req.headers.referer;
  if (!referer || !referer.includes(req.headers.host)) {
    return res.status(403).send('Accès non autorisé');
  }
  next();
});

// Servir les fichiers statiques dans l'ordre correct
app.use('/uploads', express.static(UPLOAD_PATH));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

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
        
        // Logs détaillés
        console.log('Données reçues:');
        console.log('- Nom:', name);
        console.log('- Email:', email);
        console.log('- Téléphone:', phone);
        console.log('- Détails du vol:', JSON.stringify(flightDetails, null, 2));
        
        if (!name || !email || !phone || !flightDetails) {
            throw new Error('Données de réservation incomplètes');
        }

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
        const { nom: name, email, telephone: phone, offerTitle } = req.body;
        
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

app.post('/api/gallery', adminAuth, fileUpload(), async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const image = req.files.image;
        const title = req.body.title;
        const description = req.body.description;

        if (!title || !description) {
            return res.status(400).json({ error: 'Titre et description requis' });
        }

        // Générer un nom de fichier unique
        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join(GALLERY_PATH, fileName);

        // Déplacer l'image
        await image.mv(filePath);

        // Lire le fichier gallery.json
        let gallery = [];
        const galleryJsonPath = path.join(__dirname, 'server', 'data', 'gallery.json');
        
        try {
            gallery = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
        } catch (error) {
            // Si le fichier n'existe pas, on commence avec un tableau vide
        }

        // Ajouter la nouvelle image
        const newImage = {
            id: Date.now(),
            title,
            description,
            image: `/uploads/gallery/${fileName}`
        };

        gallery.push(newImage);

        // Sauvegarder le fichier gallery.json
        fs.writeFileSync(galleryJsonPath, JSON.stringify(gallery, null, 2));

        res.json(newImage);
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
    }
});

// Route pour modifier une offre
app.put('/api/offers/:id', adminAuth, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const image = req.files?.image;
        const offerId = parseInt(req.params.id);

        // Lecture des offres existantes
        let offres = JSON.parse(fs.readFileSync('./server/data/offres.json', 'utf8'));
        
        // Recherche de l'offre à modifier
        const offerIndex = offres.findIndex(offer => offer.id === offerId);
        if (offerIndex === -1) {
            return res.status(404).json({ error: 'Offre non trouvée' });
        }

        // Gestion de l'image si une nouvelle est fournie
        let imagePath = offres[offerIndex].image;
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

        // Mise à jour de l'offre
        offres[offerIndex] = {
            ...offres[offerIndex],
            titre: title || offres[offerIndex].titre,
            description: description || offres[offerIndex].description,
            prix: price || offres[offerIndex].prix,
            image: imagePath
        };

        // Sauvegarde dans le fichier
        fs.writeFileSync('./server/data/offres.json', JSON.stringify(offres, null, 4));

        res.json(offres[offerIndex]);
    } catch (error) {
        console.error('Erreur lors de la modification de l\'offre:', error);
        res.status(500).json({ error: 'Erreur lors de la modification de l\'offre' });
    }
});

// Route pour supprimer une offre
app.delete('/api/offers/:id', adminAuth, async (req, res) => {
    try {
        const offerId = parseInt(req.params.id);

        // Lecture des offres existantes
        let offres = JSON.parse(fs.readFileSync('./server/data/offres.json', 'utf8'));
        
        // Recherche de l'offre à supprimer
        const offerIndex = offres.findIndex(offer => offer.id === offerId);
        if (offerIndex === -1) {
            return res.status(404).json({ error: 'Offre non trouvée' });
        }

        // Suppression de l'offre
        offres.splice(offerIndex, 1);

        // Mise à jour des IDs
        offres = offres.map((offer, index) => ({
            ...offer,
            id: index + 1
        }));

        // Sauvegarde dans le fichier
        fs.writeFileSync('./server/data/offres.json', JSON.stringify(offres, null, 4));

        res.json({ message: 'Offre supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
    }
});

// Route pour récupérer les images de la galerie
app.get('/api/gallery', (req, res) => {
    try {
        const galleryData = JSON.parse(fs.readFileSync('./server/data/gallery.json', 'utf8'));
        res.json(galleryData);
    } catch (error) {
        console.error('Erreur lors de la lecture de la galerie:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture de la galerie' });
    }
});

// Route pour ajouter une image à la galerie
app.post('/api/gallery', adminAuth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.files?.image;

        if (!image) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        if (!title || !description) {
            return res.status(400).json({ error: 'Titre et description requis' });
        }

        // Créer le dossier d'upload s'il n'existe pas
        const uploadDir = './public/uploads/gallery';
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        // Gérer l'image
        const imagePath = `/uploads/gallery/${Date.now()}-${image.name}`;
        await image.mv(`.${imagePath}`);

        // Lire les données existantes
        let galleryData = [];
        try {
            galleryData = JSON.parse(fs.readFileSync('./server/data/gallery.json', 'utf8'));
        } catch (error) {
            console.log('Aucun fichier gallery.json existant, création d\'un nouveau fichier');
        }

        // Créer la nouvelle entrée
        const newEntry = {
            id: galleryData.length + 1,
            title,
            description,
            image: imagePath
        };

        // Ajouter la nouvelle entrée
        galleryData.push(newEntry);

        // Sauvegarder dans le fichier
        fs.writeFileSync('./server/data/gallery.json', JSON.stringify(galleryData, null, 4));

        res.json(newEntry);
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la galerie:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout à la galerie' });
    }
});

// Route pour supprimer une image de la galerie
app.delete('/api/gallery/:id', adminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Lire les données existantes
        let galleryData = JSON.parse(fs.readFileSync('./server/data/gallery.json', 'utf8'));

        // Trouver l'image à supprimer
        const imageToDelete = galleryData.find(item => item.id === id);
        if (!imageToDelete) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        // Supprimer le fichier physique si c'est une image uploadée
        if (imageToDelete.image.startsWith('/uploads/')) {
            const filePath = `.${imageToDelete.image}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Filtrer l'image du tableau
        galleryData = galleryData.filter(item => item.id !== id);

        // Sauvegarder dans le fichier
        fs.writeFileSync('./server/data/gallery.json', JSON.stringify(galleryData, null, 4));

        res.json({ success: true, message: 'Image supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
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
