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

        const result = await response.json();
        
        if (response.ok) {
            console.log('Migration réussie :', result.message);
        } else {
            console.error('Erreur lors de la migration :', result.error);
        }
    } catch (error) {
        console.error('Erreur :', error.message);
    }
}

migrateData();
