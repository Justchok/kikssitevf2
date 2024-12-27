// Globe 3D
let scene, camera, renderer, controls, earth;

function init() {
    // Création de la scène
    scene = new THREE.Scene();

    // Configuration de la caméra
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Configuration du rendu
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const container = document.getElementById('globe-container');
    
    if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Chargeur de texture
        const textureLoader = new THREE.TextureLoader();

        // Création du globe
        const radius = 8; // Augmenter la taille du globe
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        
        // Charger les textures
        const earthTexture = textureLoader.load('assets/images/earth-blue-marble.jpg');
        const bumpTexture = textureLoader.load('assets/images/earth-topology.jpg');
        const specularTexture = textureLoader.load('assets/images/earth-specular.jpg');
        const cloudsTexture = textureLoader.load('assets/images/earth-clouds.png');

        // Matériau principal du globe
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.1,
            specularMap: specularTexture,
            specular: new THREE.Color('#909090'),
            shininess: 10,
            transparent: true
        });

        // Création du globe
        earth = new THREE.Mesh(geometry, material);
        earth.rotation.z = Math.PI * 0.1; // Incliner légèrement le globe
        scene.add(earth);

        // Ajout de la couche de nuages
        const cloudsGeometry = new THREE.SphereGeometry(radius + 0.1, 64, 64);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        scene.add(clouds);

        // Ajout d'une atmosphère
        const atmosphereGeometry = new THREE.SphereGeometry(radius + 0.3, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: '#3ea0c6',
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Ajout des lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
        pointLight1.position.set(20, 20, 20);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x3ea0c6, 1);
        pointLight2.position.set(-20, -20, 20);
        scene.add(pointLight2);

        // Contrôles orbitaux
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.3;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotation des nuages
            clouds.rotation.y += 0.0003;
            
            // Rotation de la Terre
            earth.rotation.y += 0.0005;
            
            controls.update();
            renderer.render(scene, camera);
        }

        // Gestion du redimensionnement
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = containerWidth / containerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerWidth, containerHeight);
        }

        animate();
    }
}

// Initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', init);
