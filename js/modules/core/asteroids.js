/**
 * Sistema do cinturão de asteroides
 * Gerencia a criação e atualização dos asteroides
 */

// Variáveis para o cinturão de asteroides
let asteroidBelt;
let beltRing;

/**
 * Cria o cinturão de asteroides
 * @param {Object} scene - Cena Three.js
 * @returns {Object} Objeto com o cinturão de asteroides e seu anel visual
 */
export function createAsteroidBelt(scene) {
    // Definir parâmetros do cinturão
    const beltInnerRadius = 30;  // Entre Marte e Júpiter
    const beltOuterRadius = 40;
    const numAsteroids = 2000;   // Quantidade de asteroides
    
    // Criar um grupo para armazenar todos os asteroides
    asteroidBelt = new THREE.Group();
    
    // Geometria básica para os asteroides (esfera pequena)
    const asteroidGeometry = new THREE.SphereGeometry(0.08, 4, 4);
    
    // Materiais para os asteroides (variação de cores)
    const asteroidMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x8B8B8B, roughness: 0.8 }), // Cinza
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 }), // Marrom
        new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.7 })  // Cinza escuro
    ];
    
    // Criar cada asteroide
    for (let i = 0; i < numAsteroids; i++) {
        // Selecionar material aleatório
        const material = asteroidMaterials[Math.floor(Math.random() * asteroidMaterials.length)];
        
        // Criar o asteroid
        const asteroid = new THREE.Mesh(asteroidGeometry, material);
        
        // Posicionar aleatoriamente no cinturão
        const distance = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
        const angle = Math.random() * Math.PI * 2;
        
        // Altura aleatória (ligeiramente fora do plano da eclíptica)
        const height = (Math.random() - 0.5) * 5;
        
        // Definir posição
        asteroid.position.x = Math.cos(angle) * distance;
        asteroid.position.z = Math.sin(angle) * distance;
        asteroid.position.y = height;
        
        // Escala aleatória para variar tamanho
        const scale = 0.5 + Math.random() * 1.5;
        asteroid.scale.set(scale, scale, scale);
        
        // Rotação aleatória
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        asteroid.rotation.z = Math.random() * Math.PI;
        
        // Dados para animação
        asteroid.userData = {
            angle: angle,
            distance: distance,
            height: height,
            rotationSpeed: 0.005 + Math.random() * 0.01,
            orbitalSpeed: 0.0005 + Math.random() * 0.001
        };
        
        // Adicionar ao grupo
        asteroidBelt.add(asteroid);
    }
    
    // Adicionar o grupo à cena
    scene.add(asteroidBelt);
    
    // Criar um anel visual para mostrar a área do cinturão
    const beltRingGeometry = new THREE.RingGeometry(beltInnerRadius, beltOuterRadius, 64);
    const beltRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x666666, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15
    });
    
    beltRing = new THREE.Mesh(beltRingGeometry, beltRingMaterial);
    beltRing.rotation.x = Math.PI / 2;
    scene.add(beltRing);
    
    return { asteroidBelt, beltRing };
}

/**
 * Atualiza a posição e rotação dos asteroides
 * @param {Number} simulationSpeed - Velocidade da simulação
 */
export function updateAsteroidBelt(simulationSpeed) {
    if (!asteroidBelt) return;
    
    // Iterar sobre cada asteroide
    asteroidBelt.children.forEach(asteroid => {
        const userData = asteroid.userData;
        
        // Atualizar ângulo orbital com fator de velocidade da simulação
        userData.angle += userData.orbitalSpeed * simulationSpeed;
        
        // Atualizar posição
        asteroid.position.x = Math.cos(userData.angle) * userData.distance;
        asteroid.position.z = Math.sin(userData.angle) * userData.distance;
        asteroid.position.y = userData.height;
        
        // Rotação do asteroide
        asteroid.rotation.y += userData.rotationSpeed * simulationSpeed;
        asteroid.rotation.x += userData.rotationSpeed * 0.5 * simulationSpeed;
    });
}

/**
 * Controla a visibilidade do cinturão de asteroides
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleAsteroidBeltVisibility(visible) {
    if (asteroidBelt) {
        asteroidBelt.visible = visible;
    }
}

/**
 * Controla a visibilidade do anel visual do cinturão
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleBeltRingVisibility(visible) {
    if (beltRing) {
        beltRing.visible = visible;
    }
}

/**
 * Retorna os objetos do cinturão de asteroides
 * @returns {Object} Objeto com o cinturão e seu anel
 */
export function getAsteroidBelt() {
    return { asteroidBelt, beltRing };
}