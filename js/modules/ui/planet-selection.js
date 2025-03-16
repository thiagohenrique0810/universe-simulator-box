/**
 * Sistema de seleção de planetas
 * Gerencia a seleção de planetas por clique e exibição de informações
 */

// Variável para o planeta selecionado atualmente
let selectedPlanet = null;
let selectedObject = null;
let controlsTarget = null;

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
                    selectedObject = null;
                }
            }
        } catch (error) {
            console.error('Erro no processamento do clique:', error);
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
    
    // Atualizar controles
    controls.update();
    
    console.log(`Câmera focada no objeto: ${object.name || 'sem nome'}`);
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