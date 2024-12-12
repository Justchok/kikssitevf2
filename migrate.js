import fetch from 'node-fetch';

// Configuration
const ADMIN_KEY = '6f55675189faca1b946baa26439ca7c6da1600da02c14e54ef560647fc46f8ff'; 
const API_URL = 'https://kikssitevf2-production.up.railway.app'; 

async function migrateData() {
    try {
        console.log('Début de la migration...');
        
        const response = await fetch(`${API_URL}/api/admin/migrate`, {
            method: 'POST',
            headers: {
                'admin-key': ADMIN_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Réponse du serveur:', text);
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Migration réussie :', result.message);
    } catch (error) {
        console.error('Erreur :', error.message);
    }
}

migrateData();
