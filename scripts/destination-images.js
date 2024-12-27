import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destinations = [
    {
        name: 'paris',
        images: [
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', // Tour Eiffel
            'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b', // Arc de Triomphe
            'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94'  // Notre-Dame
        ]
    },
    {
        name: 'dubai',
        images: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', // Burj Khalifa
            'https://images.unsplash.com/photo-1518684079-3c830dcef090', // Dubai Marina
            'https://images.unsplash.com/photo-1526495124232-a04e1849168c'  // Palm Jumeirah
        ]
    },
    {
        name: 'istanbul',
        images: [
            'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b', // Hagia Sophia
            'https://images.unsplash.com/photo-1527838832700-5059252407fa', // Blue Mosque
            'https://images.unsplash.com/photo-1604941644135-93576f9d435f'  // Grand Bazaar
        ]
    },
    {
        name: 'newyork',
        images: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', // Manhattan
            'https://images.unsplash.com/photo-1522083165195-3424ed129620', // Central Park
            'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7'  // Times Square
        ]
    },
    {
        name: 'bangkok',
        images: [
            'https://images.unsplash.com/photo-1508009603885-50cf7c579365', // Temple
            'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b', // Street Food
            'https://images.unsplash.com/photo-1583491470869-ca0e1a0f8b2e'  // Skyline
        ]
    },
    {
        name: 'dakar',
        images: [
            'https://images.unsplash.com/photo-1597466599360-3b9775841aec', // Monument de la Renaissance
            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99', // Plage
            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99'  // Vue de la ville
        ]
    },
    {
        name: 'casablanca',
        images: [
            'https://images.unsplash.com/photo-1577147443647-81856d5151af', // Mosquée Hassan II
            'https://images.unsplash.com/photo-1577147443647-81856d5151af', // Médina
            'https://images.unsplash.com/photo-1577147443647-81856d5151af'  // Corniche
        ]
    },
    {
        name: 'abidjan',
        images: [
            'https://images.unsplash.com/photo-1590452224879-867e8012a828', // Plateau
            'https://images.unsplash.com/photo-1590452224879-867e8012a828', // Cathédrale
            'https://images.unsplash.com/photo-1590452224879-867e8012a828'  // Cocody
        ]
    }
];

const downloadImage = async (url) => {
    return new Promise((resolve, reject) => {
        https.get(`${url}?w=800&q=80`, (response) => {
            if (response.statusCode === 200) {
                const data = [];
                response.on('data', (chunk) => {
                    data.push(chunk);
                });
                response.on('end', () => {
                    resolve(Buffer.concat(data));
                });
            } else {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
};

const processImage = async (imageBuffer, outputPath) => {
    await sharp(imageBuffer)
        .resize(800, 600, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
};

const main = async () => {
    const outputDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'destinations');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const destination of destinations) {
        console.log(`Processing ${destination.name}...`);
        for (let i = 0; i < destination.images.length; i++) {
            const imageUrl = destination.images[i];
            const outputPath = path.join(outputDir, `${destination.name}${i + 1}.jpg`);
            
            try {
                const imageBuffer = await downloadImage(imageUrl);
                await processImage(imageBuffer, outputPath);
                console.log(`Successfully processed ${outputPath}`);
            } catch (error) {
                console.error(`Error processing ${destination.name} image ${i + 1}:`, error);
            }
        }
    }
};

main().catch(console.error);
