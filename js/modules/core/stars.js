/**
 * Sistema de estrelas de fundo
 * Cria e gerencia o campo de estrelas para simular o espaço profundo
 */

// Variável para armazenar o objeto das estrelas
let stars;
let skybox;

/**
 * Cria o campo de estrelas de fundo
 * @param {Object} scene - Cena Three.js
 * @returns {Object} Objeto das estrelas
 */
export function createStars(scene) {
    // Adicionar o fundo da Via Láctea como skybox
    const textureLoader = new THREE.TextureLoader();
    const skyboxTexture = textureLoader.load('textures/via-lactea.jpg');
    
    // Criar uma esfera grande para o skybox
    const skyboxGeometry = new THREE.SphereGeometry(1000, 60, 40);
    // Inverter as normais para que a textura seja renderizada na parte interna da esfera
    skyboxGeometry.scale(-1, 1, 1);
    
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: skyboxTexture,
        side: THREE.BackSide, // Para renderizar a parte interna da esfera
    });
    
    skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
    
    // Adicionar estrelas como pontos para adicionar mais profundidade
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: 0.7,
    });
    
    const starsVertices = [];
    for (let i = 0; i < 8000; i++) {
        const x = THREE.MathUtils.randFloatSpread(1800);
        const y = THREE.MathUtils.randFloatSpread(1800);
        const z = THREE.MathUtils.randFloatSpread(1800);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    return { stars, skybox };
}

/**
 * Alterna a visibilidade do campo de estrelas
 * @param {Boolean} visible - Se as estrelas devem estar visíveis
 */
export function toggleStarsVisibility(visible) {
    if (stars) {
        stars.visible = visible;
    }
    
    if (skybox) {
        skybox.visible = visible;
    }
}

/**
 * Retorna o objeto das estrelas
 * @returns {Object} Objeto das estrelas
 */
export function getStars() {
    return stars;
} 