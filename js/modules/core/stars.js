/**
 * Sistema de estrelas de fundo
 * Cria e gerencia o campo de estrelas para simular o espaço profundo
 */

// Variável para armazenar o objeto das estrelas
let stars;

/**
 * Cria o campo de estrelas de fundo
 * @param {Object} scene - Cena Three.js
 * @returns {Object} Objeto das estrelas
 */
export function createStars(scene) {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15
    });
    
    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    return stars;
}

/**
 * Controla a visibilidade das estrelas
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleStarsVisibility(visible) {
    if (stars) {
        stars.visible = visible;
    }
}

/**
 * Retorna o objeto das estrelas
 * @returns {Object} Objeto das estrelas
 */
export function getStars() {
    return stars;
} 