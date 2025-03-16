/**
 * Configuração do sistema de renderização Three.js
 * Inclui cena, câmera, renderer e controles
 */

// Variáveis de renderização
let scene, camera, renderer, controls;

/**
 * Inicializa o sistema de renderização
 * @returns {Object} Objeto contendo scene, camera, renderer e controls
 */
export function initRenderer() {
    // Criar a cena
    scene = new THREE.Scene();
    
    // Configurar a câmera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 2000);
    camera.position.set(0, 80, 120);
    
    // Configurar o renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Adicionar controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    
    // Adicionar iluminação ambiente
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Eventos de redimensionamento
    window.addEventListener('resize', onWindowResize);
    
    return { scene, camera, renderer, controls };
}

/**
 * Ajustar o tamanho do renderer quando a janela é redimensionada
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Atualiza os controles da câmera
 */
export function updateControls() {
    if (controls) {
        controls.update();
    }
}

/**
 * Renderiza a cena
 */
export function renderScene() {
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
} 