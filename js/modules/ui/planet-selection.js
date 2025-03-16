/**
 * Sistema de seleção de planetas
 * Gerencia a seleção de planetas por clique e exibição de informações
 */

// Variável para o planeta selecionado atualmente
let selectedPlanet = null;
let selectedObject = null;
let controlsTarget = null;
let cameraFocusEnabled = false;
let initialCameraDistance = 0; // Distância inicial entre a câmera e o objeto focado

/**
 * Configura o sistema de seleção de planetas
 * @param {Object} scene - Cena Three.js
 * @param {Object} camera - Câmera Three.js
 * @param {Function} showInfoCallback - Função para mostrar informações do planeta selecionado
 */
export function setupPlanetSelection(scene, camera, showInfoCallback) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastClickTime = 0;
    const doubleClickThreshold = 300; // tempo em ms para considerar duplo clique
    
    // Buscar referência para os controles
    const controls = camera.userData.controls;
    
    // Função de clique para seleção de planetas
    window.addEventListener('click', function(event) {
        try {
            const currentTime = new Date().getTime();
            const isDoubleClick = (currentTime - lastClickTime) < doubleClickThreshold;
            lastClickTime = currentTime;
            
            // Calcular posição normalizada do mouse
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            // Raycasting para identificar objetos clicados
            raycaster.setFromCamera(mouse, camera);
            
            // Obter objetos que intersectam o raio
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            if (intersects.length > 0) {
                // Procurar um planeta entre os objetos intersectados
                let foundPlanet = false;
                let foundPlanetName = null;
                let foundObject = null;
                
                for (let i = 0; i < intersects.length && !foundPlanet; i++) {
                    const object = intersects[i].object;
                    if (!object) continue;
                    
                    // Método mais robusto para encontrar o planeta clicado
                    // Verificar se o objeto ou qualquer um de seus ancestrais é um planeta
                    let currentObj = object;
                    while (currentObj && !foundPlanet) {
                        // Se o objeto tem nome, pode ser um planeta
                        if (currentObj.name) {
                            console.log(`Objeto encontrado: ${currentObj.name}`);
                            foundPlanetName = currentObj.name;
                            foundObject = currentObj;
                            foundPlanet = true;
                            break;
                        }
                        
                        // Subir na hierarquia de objetos
                        currentObj = currentObj.parent;
                    }
                }
                
                // Se não encontrou um planeta nomeado, considere o primeiro objeto clicado
                if (!foundPlanet && intersects.length > 0) {
                    foundObject = intersects[0].object;
                    console.log("Objeto não nomeado clicado");
                }
                
                // Tratar duplo clique para focar no objeto
                if (isDoubleClick && foundObject) {
                    focusOnObject(foundObject, camera);
                    cameraFocusEnabled = true; // Ativar o acompanhamento contínuo
                } else if (isDoubleClick && !foundObject) {
                    // Se deu duplo clique no vazio, desativar o foco
                    cameraFocusEnabled = false;
                    selectedObject = null;
                }
                
                // Mostrar informações do planeta encontrado (apenas para clique normal)
                if (foundPlanet && foundPlanetName && !isDoubleClick) {
                    try {
                        selectedPlanet = foundPlanetName;
                        selectedObject = foundObject;
                        if (showInfoCallback && typeof showInfoCallback === 'function') {
                            showInfoCallback(foundPlanetName);
                        }
                    } catch (e) {
                        console.error('Erro ao mostrar informações do planeta:', e);
                    }
                } else if (!isDoubleClick) {
                    // Se nenhum planeta foi clicado, esconder o painel de informações
                    const infoPanel = document.getElementById('planet-info');
                    if (infoPanel) {
                        infoPanel.style.display = 'none';
                    }
                    selectedPlanet = null;
                    // Não resetamos selectedObject para manter o foco da câmera
                }
            }
        } catch (error) {
            console.error('Erro no processamento do clique:', error);
        }
    });
    
    // Adicionar opção para desligar o foco via tecla Esc
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cameraFocusEnabled = false;
            selectedObject = null;
            console.log('Foco da câmera desativado');
        }
    });
}

/**
 * Foca a câmera em um objeto específico
 * @param {Object} object - Objeto Three.js para focar
 * @param {Object} camera - Câmera Three.js
 */
function focusOnObject(object, camera) {
    // Obter referência para os controles da cena
    const controls = window.orbitControls;
    
    if (!controls) {
        console.error("Controles de órbita não encontrados");
        return;
    }
    
    // Salvar o objeto focado
    selectedObject = object;
    
    // Calcular posição do objeto alvo
    const targetPosition = new THREE.Vector3();
    object.getWorldPosition(targetPosition);
    
    // Configurar target dos controles para o objeto
    // Isso mantém a câmera em sua posição atual, mas faz com que olhe para o objeto
    controls.target.copy(targetPosition);
    
    // Calcular e armazenar a distância inicial entre a câmera e o objeto
    initialCameraDistance = camera.position.distanceTo(targetPosition);
    console.log(`Distância inicial da câmera ao objeto: ${initialCameraDistance.toFixed(2)}`);
    
    // Atualizar controles
    controls.update();
    
    console.log(`Câmera focada no objeto: ${object.name || 'sem nome'}`);
}

/**
 * Atualiza o foco da câmera se estiver seguindo um objeto
 * Esta função deve ser chamada a cada frame da animação
 */
export function updateCameraFocus() {
    if (!cameraFocusEnabled || !selectedObject) return;
    
    const controls = window.orbitControls;
    if (!controls) return;
    
    // Obter a câmera vinculada aos controles
    const camera = controls.object;
    if (!camera) return;
    
    // Calcular a posição atual do objeto no mundo
    const targetPosition = new THREE.Vector3();
    selectedObject.getWorldPosition(targetPosition);
    
    // Capturar a distância atual entre câmera e objeto antes de atualizar
    const currentDistance = camera.position.distanceTo(targetPosition);
    
    // Atualizar o alvo dos controles para acompanhar o objeto em movimento
    controls.target.copy(targetPosition);
    
    // Calcular a direção da câmera para o alvo
    const directionToTarget = new THREE.Vector3().subVectors(camera.position, targetPosition).normalize();
    
    // Calcular a nova posição da câmera mantendo a distância atual
    const newCameraPosition = new THREE.Vector3().copy(targetPosition).add(
        directionToTarget.multiplyScalar(currentDistance)
    );
    
    // Atualizar a posição da câmera
    camera.position.copy(newCameraPosition);
    
    // Atualizar os controles
    controls.update();
}

/**
 * Retorna o planeta selecionado atualmente
 * @returns {String|null} Nome do planeta selecionado ou null
 */
export function getSelectedPlanet() {
    return selectedPlanet;
}

/**
 * Define o planeta selecionado
 * @param {String} planetName - Nome do planeta
 */
export function setSelectedPlanet(planetName) {
    selectedPlanet = planetName;
}

/**
 * Retorna o objeto selecionado atualmente
 * @returns {Object|null} Objeto Three.js selecionado ou null
 */
export function getSelectedObject() {
    return selectedObject;
}

/**
 * Verifica se o foco da câmera está ativado
 * @returns {Boolean} Estado do foco da câmera
 */
export function isCameraFocusEnabled() {
    return cameraFocusEnabled;
} 