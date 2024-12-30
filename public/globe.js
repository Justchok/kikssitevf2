// Globe 3D
let scene, camera, renderer, controls, earth;

function init() {
    // Création de la scène
    scene = new THREE.Scene();

    // Configuration de la caméra
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Configuration du rendu avec des paramètres optimisés
    renderer = new THREE.WebGLRenderer({ 
        antialias: window.devicePixelRatio < 2, // Désactiver l'antialiasing sur les appareils haute résolution
        alpha: true,
        powerPreference: "high-performance"
    });
    
    const container = document.getElementById('globe-container');
    
    if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limiter le pixel ratio pour les performances
        container.appendChild(renderer.domElement);

        // Gestionnaire de ressources pour le chargement optimisé
        const loadManager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(loadManager);

        // Précharger toutes les textures
        const textures = {
            earth: 'assets/images/earth-blue-marble.jpg',
            bump: 'assets/images/earth-topology.jpg',
            specular: 'assets/images/earth-specular.jpg',
            clouds: 'assets/images/earth-clouds.png'
        };

        const loadedTextures = {};

        // Charger les textures de manière asynchrone
        Promise.all(
            Object.entries(textures).map(([key, url]) => 
                new Promise((resolve) => {
                    textureLoader.load(url, (texture) => {
                        loadedTextures[key] = texture;
                        resolve();
                    });
                })
            )
        ).then(() => {
            const radius = 8;
            const geometry = new THREE.SphereGeometry(radius, 48, 48); // Réduire légèrement la résolution

            const material = new THREE.MeshPhongMaterial({
                map: loadedTextures.earth,
                bumpMap: loadedTextures.bump,
                bumpScale: 0.1,
                specularMap: loadedTextures.specular,
                specular: new THREE.Color('#909090'),
                shininess: 10,
                transparent: true
            });

            earth = new THREE.Mesh(geometry, material);
            earth.rotation.z = Math.PI * 0.1;
            scene.add(earth);

            // Optimiser les lumières
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(5, 3, 5);
            scene.add(light);

            animate();
        });

        // Gestion optimisée du redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const width = container.clientWidth;
                const height = container.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }, 250);
        });
    }
}

// Fonction d'animation optimisée
function animate() {
    requestAnimationFrame(animate);
    if (earth) {
        earth.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
}

// Initialiser uniquement si l'élément container existe
if (document.getElementById('globe-container')) {
    document.addEventListener('DOMContentLoaded', init);
}
