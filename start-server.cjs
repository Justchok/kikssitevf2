// Script de du00e9marrage du serveur
const path = require('path');
const { spawn } = require('child_process');

console.log('Du00e9marrage du serveur Kiks Travel...');

// Du00e9marrer le serveur
const server = spawn('node', [path.join(__dirname, 'server', 'server.cjs')], {
    stdio: 'inherit'
});

server.on('error', (error) => {
    console.error('Erreur lors du du00e9marrage du serveur:', error);
});

server.on('close', (code) => {
    if (code !== 0) {
        console.log(`Le serveur s'est arru00eatu00e9 avec le code: ${code}`);
    } else {
        console.log('Le serveur s\'est arru00eatu00e9 normalement.');
    }
});

console.log('Serveur en cours d\'exu00e9cution...');
console.log('Appuyez sur Ctrl+C pour arru00eater le serveur.');
