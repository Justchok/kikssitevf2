const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'assets', 'videos', '0114 (2).mp4');
const outputPath = path.join(__dirname, 'public', 'assets', 'videos', '0114-compressed.mp4');

// Compression de la vidéo
ffmpeg(inputPath)
    .outputOptions([
        '-c:v libx264',        // Codec vidéo
        '-crf 28',             // Qualité (18-28 est bon, plus haut = plus compressé)
        '-preset medium',       // Vitesse d'encodage
        '-movflags +faststart', // Démarrage rapide de la lecture
        '-profile:v baseline',  // Profile compatible mobile
        '-level 3.0',          // Niveau de compatibilité
        '-maxrate 2M',         // Bitrate maximum
        '-bufsize 2M',         // Buffer size
        '-vf scale=-2:720',    // Redimensionner à 720p
        '-an'                  // Supprimer l'audio car c'est une vidéo muette
    ])
    .output(outputPath)
    .on('end', () => {
        console.log('Compression terminée !');
    })
    .on('error', (err) => {
        console.error('Erreur lors de la compression:', err);
    })
    .run();
