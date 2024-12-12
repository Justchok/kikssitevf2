import mongoose from 'mongoose';
import Offer from './server/models/Offer.js';

// URL MongoDB
const MONGODB_URI = 'mongodb://mongo:4Ek2FHECeE-f2GBh3h6f5FcBg-gEa4aF@monorail.proxy.rlwy.net:38456';

// Données des offres
const offres = [
    {
        title: "Escapade à Paris",
        description: "Découvrez la ville lumière avec notre offre spéciale incluant vol + hôtel",
        price: "450000 XOF",
        image: "/assets/images/paris.jpg"
    },
    {
        title: "Safari au Kenya",
        description: "Vivez une aventure inoubliable dans la savane africaine",
        price: "850000 XOF",
        image: "/assets/images/kenya.jpg"
    },
    {
        title: "Dubaï Luxe",
        description: "Séjour de luxe à Dubaï avec excursions incluses",
        price: "750000 XOF",
        image: "/assets/images/dubai.jpg"
    }
];

async function insertData() {
    try {
        // Connexion à MongoDB
        console.log('Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Suppression des anciennes données
        console.log('Suppression des anciennes offres...');
        await Offer.deleteMany({});
        console.log('Anciennes offres supprimées');

        // Insertion des nouvelles offres
        console.log('Insertion des nouvelles offres...');
        await Offer.insertMany(offres);
        console.log('Offres insérées avec succès');

        // Déconnexion
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

insertData();
