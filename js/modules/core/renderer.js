/**
 * Configuração do sistema de renderização Three.js
 * Inclui cena, câmera, renderer e controles
 */

// Variáveis de renderização
let scene, camera, renderer, controls;
let frameCount = 0;

/**
 * Inicializa o sistema de renderização
 * @returns {Object} Objeto contendo scene, camera, renderer e controls
 */
export function initRenderer() {
    // Criar a cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Definir cor de fundo como preto
    
    // Configurar a câmera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 2000);
    camera.position.set(0, 80, 120);
    
    // Configurar o renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1); // Definir cor de limpeza como preto
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Adicionar controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    
    // Expor os controles globalmente para acesso de outros módulos
    window.orbitControls = controls;
    
    // Armazenar uma referência para os controles na câmera para facilitar acesso
    camera.userData.controls = controls;
    
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
        // A cada 100 frames, verificar se o skybox está visível
        if (frameCount % 100 === 0) {
            const skybox = scene.children.find(child => 
                child.geometry && 
                child.geometry.type === 'SphereGeometry' && 
                child.geometry.parameters.radius === 1000
            );
            
            if (skybox) {
                console.log('Status do skybox (frame ' + frameCount + '):', 
                    'visível:', skybox.visible, 
                    'material:', skybox.material ? 'sim' : 'não',
                    'textura:', skybox.material && skybox.material.map ? 'sim' : 'não'
                );
            } else {
                console.log('Skybox não encontrado na cena (frame ' + frameCount + ')');
            }
        }
        
        renderer.render(scene, camera);
        frameCount++;
    }
} 