import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import nodemailer from 'nodemailer';

// Configuration des chemins pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration du transporteur d'email avec IONOS
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ionos.fr',
    port: 465,
    secure: true, // true pour le port 465 (SSL)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Fonction pour envoyer un email
async function sendEmail(to, subject, html) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER, // Votre adresse email IONOS
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
}

// Middleware pour le logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware CORS et JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

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
  // Permettre l'accès à la page gallery.html
  if (req.path === '/gallery.html') {
    return next();
  }
  
  // Pour les autres routes admin, vérifier l'authentification
  const referer = req.headers.referer;
  if (!referer || !referer.includes(req.headers.host)) {
    return res.status(403).send('Accès non autorisé');
  }
  next();
});

// Routes pour les pages HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/destinations.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'destinations.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/offres.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'offres.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
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
        const { name, email, phone, departure, destination, layover, travelClass, departureDate, returnDate, passengers } = req.body;

        const flightDetails = {
            departure,
            destination,
            layover,
            travelClass,
            departureDate,
            returnDate,
            passengers
        };

        // Envoi de l'email à l'administrateur (email IONOS)
        await sendEmail(
            process.env.SMTP_USER, // L'admin reçoit sur l'email IONOS
            'Nouvelle réservation de vol - Kiks Travel',
            adminEmailTemplate(name, email, phone, flightDetails)
        );

        // Envoi de l'email de confirmation au client (sur son email personnel)
        await sendEmail(
            email, // Le client reçoit sur son email personnel
            'Confirmation de votre demande de réservation - Kiks Travel',
            clientEmailTemplate(name, phone, flightDetails)
        );

        res.json({ 
            success: true, 
            message: 'Réservation reçue avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la réservation. Veuillez réessayer plus tard.',
            error: error.message
        });
    }
});

// Route pour les réservations d'offres
app.post('/api/public/book-offer', async (req, res) => {
    try {
        console.log('Réception d\'une réservation d\'offre:', req.body);
        const { nom: name, email, telephone: phone, offerTitle } = req.body;
        
        // Envoi de l'email à l'administrateur (email IONOS)
        await sendEmail(
            process.env.SMTP_USER, // L'admin reçoit sur l'email IONOS
            'Nouvelle réservation d\'offre - Kiks Travel',
            offerAdminEmailTemplate(name, email, phone, offerTitle)
        );

        // Envoi de l'email de confirmation au client (sur son email personnel)
        await sendEmail(
            email, // Le client reçoit sur son email personnel
            'Confirmation de votre réservation d\'offre - Kiks Travel',
            offerClientEmailTemplate(name, phone, offerTitle)
        );

        res.json({ 
            success: true, 
            message: 'Réservation d\'offre reçue avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la réservation d\'offre:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la réservation. Veuillez réessayer plus tard.',
            error: error.message
        });
    }
});

// Route pour les demandes d'offres
app.post('/api/public/inquire-offer', async (req, res) => {
    try {
        const { name, email, phone, offerTitle } = req.body;

        // Envoi de l'email à l'administrateur
        await sendEmail(
            process.env.SMTP_USER,
            `Nouvelle demande d'offre - ${offerTitle}`,
            offerAdminEmailTemplate(name, email, phone, offerTitle)
        );

        // Envoi de la confirmation au client
        await sendEmail(
            email,
            'Confirmation de votre demande - Kiks Travel',
            offerClientEmailTemplate(name, phone, offerTitle)
        );

        res.json({ 
            success: true, 
            message: 'Demande envoyée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi de la demande:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de la demande. Veuillez réessayer plus tard.',
            error: error.message
        });
    }
});

// Route pour les offres spéciales
app.post('/api/public/special-offer', async (req, res) => {
    try {
        console.log('Réception d\'une demande d\'offre spéciale:', req.body);
        const { name, email, phone, offerTitle, offerPrice } = req.body;

        // Validation des données
        if (!name || !email || !phone || !offerTitle) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir toutes les informations requises'
            });
        }

        // Email à l'administrateur
        const adminEmailContent = `
            <h2>Nouvelle demande de réservation d'offre spéciale</h2>
            <p><strong>Offre:</strong> ${offerTitle}</p>
            <p><strong>Prix:</strong> ${offerPrice}</p>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${phone}</p>
            <p>Veuillez contacter le client dans les plus brefs délais pour finaliser la réservation.</p>
        `;

        await sendEmail(
            process.env.ADMIN_EMAIL || 'contact@kikstravel.com',
            `Nouvelle réservation - ${offerTitle}`,
            adminEmailContent
        );

        // Email de confirmation au client
        const clientEmailContent = `
            <h2>Confirmation de votre demande de réservation</h2>
            <p>Cher(e) ${name},</p>
            <p>Nous avons bien reçu votre demande de réservation pour l'offre suivante :</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <h3 style="color: #3ea0c6; margin-bottom: 10px;">${offerTitle}</h3>
                <p><strong>Prix:</strong> ${offerPrice}</p>
            </div>
            <p>Notre équipe vous contactera très prochainement pour finaliser les détails de votre réservation.</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
            <ul>
                <li>Email: contact@kikstravel.com</li>
                <li>Téléphone: +221 338244246</li>
            </ul>
            <p>Merci de votre confiance!</p>
            <p>L'équipe Kiks Travel</p>
        `;

        await sendEmail(
            email,
            'Confirmation de votre demande de réservation - Kiks Travel',
            clientEmailContent
        );

        res.json({
            success: true,
            message: 'Votre demande a été envoyée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors du traitement de l\'offre spéciale:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors du traitement de votre demande'
        });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create transport
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to ourselves
            subject: `Nouveau message de contact de ${name}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message envoyé avec succès!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
    }
});

// Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Envoi de l'email à l'administrateur
        await sendEmail(
            process.env.SMTP_USER,
            `Nouveau message de contact - ${subject}`,
            `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            `
        );

        // Envoi de la confirmation au client
        await sendEmail(
            email,
            'Confirmation de votre message - Kiks Travel',
            `
            <h2>Confirmation de réception</h2>
            <p>Cher(e) ${name},</p>
            <p>Nous avons bien reçu votre message concernant "${subject}".</p>
            <p>Notre équipe vous répondra dans les plus brefs délais.</p>
            <br>
            <p>Cordialement,</p>
            <p>L'équipe Kiks Travel</p>
            `
        );

        res.json({ 
            success: true, 
            message: 'Message envoyé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.',
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

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Titre et description requis' });
        }

        const image = req.files.image;
        
        // Sauvegarder l'image
        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join(GALLERY_PATH, fileName);
        await image.mv(filePath);

        // Créer la nouvelle entrée de galerie
        const newGallery = {
            id: Date.now(),
            title,
            description,
            image: `/uploads/gallery/${fileName}`
        };

        // Lire et mettre à jour le fichier gallery.json
        const galleryJsonPath = path.join(__dirname, 'server', 'data', 'gallery.json');
        let gallery = [];
        try {
            gallery = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
        } catch (error) {
            // Si le fichier n'existe pas, on commence avec un tableau vide
        }

        gallery.push(newGallery);
        fs.writeFileSync(galleryJsonPath, JSON.stringify(gallery, null, 2));

        res.json(newGallery);
    } catch (error) {
        console.error('Erreur lors de la création de la galerie:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la galerie' });
    }
});

app.post('/api/gallery/:id/images', adminAuth, fileUpload(), async (req, res) => {
    try {
        if (!req.files || !req.files.images) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const galleryId = parseInt(req.params.id);
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        
        // Lire le fichier gallery.json
        const galleryJsonPath = path.join(__dirname, 'server', 'data', 'gallery.json');
        let gallery = [];
        try {
            gallery = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la lecture de la galerie' });
        }

        // Trouver la galerie à mettre à jour
        const galleryEntry = gallery.find(entry => entry.id === galleryId);
        if (!galleryEntry) {
            return res.status(404).json({ error: 'Galerie non trouvée' });
        }

        // Sauvegarder chaque image
        const uploadedImages = [];
        for (const image of images) {
            const fileName = `${Date.now()}-${image.name}`;
            const filePath = path.join(GALLERY_PATH, fileName);
            await image.mv(filePath);
            uploadedImages.push(`/uploads/gallery/${fileName}`);
        }

        // Ajouter les nouvelles images à la galerie
        if (!galleryEntry.images) galleryEntry.images = [];
        galleryEntry.images.push(...uploadedImages);

        // Sauvegarder les changements
        fs.writeFileSync(galleryJsonPath, JSON.stringify(gallery, null, 2));

        res.json({ success: true, images: uploadedImages });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({ error: 'Erreur lors de l\'upload des images' });
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

// Route pour supprimer une image d'une galerie
app.delete('/api/gallery/:galleryId/images/:imageIndex', adminAuth, (req, res) => {
    try {
        const galleryId = parseInt(req.params.galleryId);
        const imageIndex = parseInt(req.params.imageIndex);

        const galleryJsonPath = path.join(__dirname, 'server', 'data', 'gallery.json');
        let gallery = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));

        const galleryEntry = gallery.find(entry => entry.id === galleryId);
        if (!galleryEntry) {
            return res.status(404).json({ error: 'Galerie non trouvée' });
        }

        if (!galleryEntry.images || imageIndex >= galleryEntry.images.length) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        // Supprimer l'image du système de fichiers
        const imagePath = galleryEntry.images[imageIndex];
        const fullPath = path.join(__dirname, 'public', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        // Supprimer l'image de la galerie
        galleryEntry.images.splice(imageIndex, 1);

        // Si la galerie n'a plus d'images, la supprimer complètement
        if (galleryEntry.images.length === 0) {
            gallery = gallery.filter(entry => entry.id !== galleryId);
        }

        fs.writeFileSync(galleryJsonPath, JSON.stringify(gallery, null, 2));
        res.json({ success: true });
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

// Route de test pour l'envoi d'emails
app.get('/api/test-email', async (req, res) => {
    try {
        // Test d'envoi d'email
        await sendEmail(
            process.env.SMTP_USER, // On envoie à notre propre adresse pour le test
            'Test d\'envoi d\'email - Kiks Travel',
            `
            <h1>Test d'envoi d'email</h1>
            <p>Si vous recevez cet email, la configuration SMTP est correcte !</p>
            <p>Email envoyé le : ${new Date().toLocaleString()}</p>
            `
        );

        res.json({ 
            success: true, 
            message: 'Email de test envoyé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors du test d\'envoi d\'email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de l\'email de test',
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
