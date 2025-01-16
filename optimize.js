import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages(directory) {
    try {
        const files = await fs.readdir(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await optimizeImages(filePath);
            } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
                const image = sharp(filePath);
                const metadata = await image.metadata();
                
                // Optimize JPG/JPEG
                if (/\.(jpg|jpeg)$/i.test(file)) {
                    await image
                        .jpeg({ quality: 80, progressive: true })
                        .toFile(filePath.replace(/\.(jpg|jpeg)$/i, '.opt.$1'));
                }
                
                // Optimize PNG
                if (/\.png$/i.test(file)) {
                    await image
                        .png({ quality: 80, progressive: true })
                        .toFile(filePath.replace(/\.png$/i, '.opt.png'));
                }
                
                // Create WebP version
                await image
                    .webp({ quality: 80 })
                    .toFile(filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
            }
        }
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

// Optimize images in assets directory
optimizeImages('./public/assets/images');
