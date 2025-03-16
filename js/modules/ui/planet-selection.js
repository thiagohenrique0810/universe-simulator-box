/**
 * Sistema de seleção de planetas
 * Gerencia a seleção de planetas por clique e exibição de informações
 */

// Variável para o planeta selecionado atualmente
let selectedPlanet = null;

/**
 * Configura o sistema de seleção de planetas
 * @param {Object} scene - Cena Three.js
 * @param {Object} camera - Câmera Three.js
 * @param {Function} showInfoCallback - Função para mostrar informações do planeta selecionado
 */
export function setupPlanetSelection(scene, camera, showInfoCallback) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Função de clique para seleção de planetas
    window.addEventListener('click', function(event) {
        try {
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
                            foundPlanet = true;
                            break;
                        }
                        
                        // Subir na hierarquia de objetos
                        currentObj = currentObj.parent;
                    }
                }
                
                // Mostrar informações do planeta encontrado
                if (foundPlanet && foundPlanetName) {
                    try {
                        selectedPlanet = foundPlanetName;
                        if (showInfoCallback && typeof showInfoCallback === 'function') {
                            showInfoCallback(foundPlanetName);
                        }
                    } catch (e) {
                        console.error('Erro ao mostrar informações do planeta:', e);
                    }
                } else {
                    // Se nenhum planeta foi clicado, esconder o painel de informações
                    const infoPanel = document.getElementById('planet-info');
                    if (infoPanel) {
                        infoPanel.style.display = 'none';
                    }
                    selectedPlanet = null;
                }
            }
        } catch (error) {
            console.error('Erro no processamento do clique:', error);
        }
    });
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