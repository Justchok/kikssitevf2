import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages(directory) {
    try {
        const files = await fs.readdir(directory);
        
        for (const file of files) {
            try {
                const filePath = path.join(directory, file);
                const stat = await fs.stat(filePath);
                
                if (stat.isDirectory()) {
                    await optimizeImages(filePath);
                } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
                    console.log(`Optimizing: ${filePath}`);
                    
                    try {
                        const image = sharp(filePath);
                        const metadata = await image.metadata();
                        
                        if (!metadata) {
                            console.log(`Skipping ${filePath}: Unsupported format or corrupted file`);
                            continue;
                        }
                        
                        // Optimize JPG/JPEG
                        if (/\.(jpg|jpeg)$/i.test(file)) {
                            const outputPath = filePath.replace(/\.(jpg|jpeg)$/i, '.opt.$1');
                            await image
                                .jpeg({ quality: 80, progressive: true })
                                .toFile(outputPath);
                            console.log(`Created optimized JPEG: ${outputPath}`);
                        }
                        
                        // Optimize PNG
                        if (/\.png$/i.test(file)) {
                            const outputPath = filePath.replace(/\.png$/i, '.opt.png');
                            await image
                                .png({ quality: 80, progressive: true })
                                .toFile(outputPath);
                            console.log(`Created optimized PNG: ${outputPath}`);
                        }
                        
                        // Create WebP version
                        const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                        await image
                            .webp({ quality: 80 })
                            .toFile(webpPath);
                        console.log(`Created WebP: ${webpPath}`);
                        
                    } catch (imageError) {
                        console.log(`Skipping ${filePath}: ${imageError.message}`);
                        continue;
                    }
                }
            } catch (fileError) {
                console.log(`Error processing ${file}: ${fileError.message}`);
                continue;
            }
        }
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

// Optimize images in assets directory
console.log('Starting image optimization...');
optimizeImages('./public/assets/images')
    .then(() => console.log('Image optimization completed'))
    .catch(error => console.error('Failed to optimize images:', error));
