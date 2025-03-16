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

// Variáveis globais para cena e câmera
let selectionScene = null;
let selectionCamera = null;

// Callbacks para mostrar informações
let onShowPlanetInfo = null;
let onShowMoonInfo = null;
let onShowDwarfPlanetInfo = null;

// Adicionar variável de estado para o modo de comparação
let comparisonMode = false;

/**
 * Configura o sistema de seleção de planetas
 * @param {Object} scene - Cena Three.js
 * @param {Object} camera - Câmera Three.js
 * @param {Function} showPlanetInfoCallback - Callback para exibir informações do planeta
 * @param {Function} showMoonInfoCallback - Callback para exibir informações da lua
 * @param {Function} showDwarfPlanetInfoCallback - Callback para exibir informações do planeta anão
 */
export function setupPlanetSelection(
    scene, 
    camera, 
    showPlanetInfoCallback, 
    showMoonInfoCallback,
    showDwarfPlanetInfoCallback
) {
    // Armazenar referências
    selectionScene = scene;
    selectionCamera = camera;
    
    // Armazenar callbacks
    onShowPlanetInfo = showPlanetInfoCallback;
    onShowMoonInfo = showMoonInfoCallback;
    onShowDwarfPlanetInfo = showDwarfPlanetInfoCallback;
    
    // Configurar eventos de mouse
    setupMouseEvents();
    
    // Configurar evento personalizado para foco via busca
    setupCustomEvents();
}

/**
 * Configura eventos personalizados para interação
 */
function setupCustomEvents() {
    // Escutar evento 'focus-object' disparado pelo sistema de busca
    document.addEventListener('focus-object', function(event) {
        const { objectKey, objectName, isMoon, isDwarfPlanet } = event.detail;
        
        // Localizar o objeto na cena
        let targetObject;
        
        if (isMoon) {
            // Buscar planeta pai
            const parentPlanet = selectionScene.getObjectByName(objectKey);
            if (parentPlanet) {
                // Buscar a lua dentro do planeta
                parentPlanet.traverse(child => {
                    if (child.name && child.name.toLowerCase() === objectName.toLowerCase()) {
                        targetObject = child;
                    }
                });
                
                // Se não encontrou pelo nome, tenta pelo ID da lua
                if (!targetObject) {
                    const moonId = objectName.toLowerCase().replace(/\s+/g, '-');
                    parentPlanet.traverse(child => {
                        if (child.name && child.name.toLowerCase() === moonId) {
                            targetObject = child;
                        }
                    });
                }
                
                // Se ainda não encontrou, busca em userData.id
                if (!targetObject) {
                    parentPlanet.traverse(child => {
                        if (child.userData && child.userData.id && 
                            child.userData.id.toLowerCase() === objectName.toLowerCase()) {
                            targetObject = child;
                        }
                    });
                }
                
                // Se encontrou a lua, mostrar informações
                if (targetObject) {
                    focusOnObject(targetObject, selectionCamera);
                    if (onShowMoonInfo) {
                        onShowMoonInfo(objectName, parentPlanet.name);
                    }
                }
            }
        } else if (isDwarfPlanet) {
            // Buscar diretamente pelo nome
            targetObject = selectionScene.getObjectByName(objectName.toLowerCase());
            
            // Se não encontrou pelo nome, tenta pelo ID
            if (!targetObject) {
                const dwarfId = objectName.toLowerCase().replace(/\s+/g, '-');
                targetObject = selectionScene.getObjectByName(dwarfId);
            }
            
            // Se encontrou o planeta anão, mostrar informações
            if (targetObject) {
                focusOnObject(targetObject, selectionCamera);
                if (onShowDwarfPlanetInfo) {
                    onShowDwarfPlanetInfo(objectName);
                }
            }
        } else {
            // Buscar planeta pelo key
            targetObject = selectionScene.getObjectByName(objectKey);
            
            // Se encontrou o planeta, mostrar informações
            if (targetObject) {
                focusOnObject(targetObject, selectionCamera);
                if (onShowPlanetInfo) {
                    onShowPlanetInfo(objectKey);
                }
            }
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

/**
 * Define se o modo de comparação está ativo
 * @param {Boolean} active - Se o modo de comparação está ativo
 */
export function setComparisonMode(active) {
    comparisonMode = active;
}

/**
 * Verifica se o modo de comparação está ativo
 * @returns {Boolean} Estado do modo de comparação
 */
export function isComparisonMode() {
    return comparisonMode;
}

/**
 * Configura eventos de mouse e toque para interação
 */
function setupMouseEvents() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastClickTime = 0;
    const doubleClickThreshold = 300; // tempo em ms para considerar duplo clique
    
    // Buscar referência para os controles
    const controls = selectionCamera.userData.controls;
    
    // Função de clique para seleção de planetas e luas
    window.addEventListener('click', function(event) {
        try {
            const currentTime = new Date().getTime();
            const isDoubleClick = (currentTime - lastClickTime) < doubleClickThreshold;
            lastClickTime = currentTime;
            
            // Calcular posição normalizada do mouse
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            // Raycasting para identificar objetos clicados
            raycaster.setFromCamera(mouse, selectionCamera);
            
            // Obter objetos que intersectam o raio
            const intersects = raycaster.intersectObjects(selectionScene.children, true);
            
            if (intersects.length > 0) {
                // Procurar um planeta, lua ou planeta anão entre os objetos intersectados
                let foundObject = null;
                let foundObjectName = null;
                let foundObjectType = null; // 'planet', 'moon' ou 'dwarfPlanet'
                let parentPlanet = null; // Para luas, armazenar o planeta pai
                
                for (let i = 0; i < intersects.length && !foundObject; i++) {
                    const object = intersects[i].object;
                    if (!object) continue;
                    
                    // Método mais robusto para encontrar o objeto clicado
                    // Verificar se o objeto ou qualquer um de seus ancestrais é um planeta, lua ou planeta anão
                    let currentObj = object;
                    let possibleParent = null;
                    
                    while (currentObj) {
                        // Se o objeto tem nome, pode ser um planeta, lua ou planeta anão
                        if (currentObj.name) {
                            console.log(`Objeto encontrado: ${currentObj.name}, Parent: ${currentObj.parent ? currentObj.parent.name : 'none'}, userData: ${JSON.stringify(currentObj.userData || {})}`);
                            
                            // Verificar se é um planeta anão
                            const dwarfPlanetNames = ['ceres', 'eris', 'makemake', 'haumea', 'moon'];
                            if (dwarfPlanetNames.includes(currentObj.name) || 
                                (currentObj.userData && currentObj.userData.isDwarfPlanet)) {
                                console.log(`Planeta anão detectado: ${currentObj.name}`);
                                foundObjectType = 'dwarfPlanet';
                                foundObjectName = currentObj.name;
                                foundObject = currentObj;
                                break;
                            }
                            // Verificar se é uma lua usando a propriedade userData.isMoon
                            else if (currentObj.userData && currentObj.userData.isMoon) {
                                console.log(`Lua detectada via userData: ${currentObj.name} do planeta ${currentObj.userData.planetParent}`);
                                foundObjectType = 'moon';
                                foundObjectName = currentObj.name;
                                foundObject = currentObj;
                                parentPlanet = currentObj.parent;
                                break;
                            }
                            // Verificar se é uma lua pela hierarquia (método alternativo)
                            else if (currentObj.parent && currentObj.parent.name && 
                                ['sol', 'mercurio', 'venus', 'terra', 'marte', 'jupiter', 'saturno', 'urano', 'netuno'].includes(currentObj.parent.name) &&
                                !['sol', 'mercurio', 'venus', 'terra', 'marte', 'jupiter', 'saturno', 'urano', 'netuno'].includes(currentObj.name)) {
                                
                                console.log(`Lua detectada pela hierarquia: ${currentObj.name} do planeta ${currentObj.parent.name}`);
                                foundObjectType = 'moon';
                                foundObjectName = currentObj.name;
                                foundObject = currentObj;
                                parentPlanet = currentObj.parent;
                                break;
                            } 
                            // Verificar se é um planeta
                            else if (['sol', 'mercurio', 'venus', 'terra', 'marte', 'jupiter', 'saturno', 'urano', 'netuno'].includes(currentObj.name)) {
                                console.log(`Planeta detectado: ${currentObj.name}`);
                                foundObjectType = 'planet';
                                foundObjectName = currentObj.name;
                                foundObject = currentObj;
                                break;
                            }
                            // Se não é nem planeta nem lua, continuar procurando
                            else {
                                possibleParent = currentObj;
                            }
                        }
                        
                        // Subir na hierarquia de objetos
                        currentObj = currentObj.parent;
                    }
                    
                    // Se não encontrou um objeto específico, usar o possível pai
                    if (!foundObject && possibleParent) {
                        foundObject = possibleParent;
                        foundObjectName = possibleParent.name;
                    }
                }
                
                // Se não encontrou um objeto nomeado, considere o primeiro objeto clicado
                if (!foundObject && intersects.length > 0) {
                    foundObject = intersects[0].object;
                    console.log("Objeto não nomeado clicado");
                }
                
                // Tratar duplo clique para focar no objeto
                if (isDoubleClick && foundObject) {
                    focusOnObject(foundObject, selectionCamera);
                    cameraFocusEnabled = true; // Ativar o acompanhamento contínuo
                } else if (isDoubleClick && !foundObject) {
                    // Se deu duplo clique no vazio, desativar o foco
                    cameraFocusEnabled = false;
                    selectedObject = null;
                }
                
                // Verificar se está no modo de comparação
                if (comparisonMode && foundObject && foundObjectName) {
                    // Adicionar objeto à comparação se o clique não for duplo clique
                    if (!isDoubleClick) {
                        // Criar objeto de dados para a comparação
                        const comparisonObject = {
                            name: getDisplayName(foundObjectName),
                            key: foundObjectName.toLowerCase(),
                            type: getDisplayType(foundObjectType),
                            parentKey: parentPlanet ? parentPlanet.name.toLowerCase() : null
                        };
                        
                        // Disparar evento de seleção para comparação
                        document.dispatchEvent(new CustomEvent('select-for-comparison', {
                            detail: { object: comparisonObject }
                        }));
                    }
                }
                // Mostrar informações do objeto encontrado (apenas para clique normal fora do modo comparação)
                else if (foundObject && foundObjectName && !isDoubleClick) {
                    try {
                        selectedObject = foundObject;
                        
                        if (foundObjectType === 'planet') {
                            selectedPlanet = foundObjectName;
                            if (onShowPlanetInfo && typeof onShowPlanetInfo === 'function') {
                                onShowPlanetInfo(foundObjectName);
                            }
                        } else if (foundObjectType === 'moon' && parentPlanet) {
                            if (onShowMoonInfo && typeof onShowMoonInfo === 'function') {
                                onShowMoonInfo(foundObjectName, parentPlanet.name);
                            }
                        } else if (foundObjectType === 'dwarfPlanet') {
                            if (onShowDwarfPlanetInfo && typeof onShowDwarfPlanetInfo === 'function') {
                                onShowDwarfPlanetInfo(foundObjectName);
                            }
                        }
                    } catch (e) {
                        console.error('Erro ao mostrar informações do objeto:', e);
                    }
                } else if (!isDoubleClick && !comparisonMode) {
                    // Se nenhum objeto foi clicado, esconder o painel de informações
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
 * Obtém o nome de exibição para um objeto
 * @param {String} name - Nome interno do objeto
 * @returns {String} Nome formatado para exibição
 */
function getDisplayName(name) {
    // Nomes específicos
    const nameMap = {
        'sol': 'Sol',
        'mercurio': 'Mercúrio',
        'venus': 'Vênus',
        'terra': 'Terra',
        'marte': 'Marte',
        'jupiter': 'Júpiter',
        'saturno': 'Saturno',
        'urano': 'Urano',
        'netuno': 'Netuno',
        'moon': 'Lua'
    };
    
    // Se existe no mapa, retornar o nome formatado
    if (nameMap[name.toLowerCase()]) {
        return nameMap[name.toLowerCase()];
    }
    
    // Caso contrário, capitalizar a primeira letra
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Obtém o tipo de exibição para um objeto
 * @param {String} type - Tipo interno do objeto
 * @returns {String} Tipo formatado para exibição
 */
function getDisplayType(type) {
    const typeMap = {
        'planet': 'Planeta',
        'moon': 'Lua',
        'dwarfPlanet': 'Planeta Anão'
    };
    
    return typeMap[type] || 'Objeto';
} 