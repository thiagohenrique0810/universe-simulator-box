/**
 * Sistema de seleção de planetas
 * Gerencia a seleção de planetas por clique e exibição de informações
 */

// Importar dados dos planetas
import { PLANET_DATA } from '../data/planet-data.js';

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
    showDwarfPlanetInfoCallback,
    renderer,
    planets,
    camera_utils
) {
    // Armazenar referências
    selectionScene = scene;
    selectionCamera = camera;
    
    // Armazenar callbacks
    onShowPlanetInfo = showPlanetInfoCallback;
    onShowMoonInfo = showMoonInfoCallback;
    onShowDwarfPlanetInfo = showDwarfPlanetInfoCallback;
    
    // Configurar eventos de mouse com os parâmetros necessários
    if (renderer && planets) {
        setupMouseEvents(camera, scene, renderer, planets, camera_utils);
    } else {
        console.warn('Renderer ou planets não fornecidos ao setupPlanetSelection, eventos de mouse não serão configurados');
    }
    
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
 * Configura os eventos de mouse para detectar cliques nos planetas
 * @param {Object} camera - Câmera ThreeJS
 * @param {Object} scene - Cena ThreeJS
 * @param {Object} renderer - Renderizador ThreeJS
 * @param {Object} planets - Objeto contendo referências a todos os planetas
 * @param {Object} camera_utils - Utilitários de câmera
 * @returns {Function} Função de limpeza para remover os event listeners
 */
export function setupMouseEvents(camera, scene, renderer, planets, camera_utils) {
    console.log('Configurando eventos de mouse para seleção de planetas');
    
    // Variável para raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    // Variável para armazenar o objeto atualmente destacado
    let HIGHLIGHTED_OBJECT = null;
    
    // Lista de objetos selecionáveis
    const selectableObjects = [];
    for (const key in planets) {
        if (key !== 'sol') { // Não queremos selecionar o sol diretamente
            selectableObjects.push(planets[key]);
        }
    }
    
    // Verifica se o planeta é um planeta anão
    const isDwarfPlanet = (name) => {
        if (!PLANET_DATA || !PLANET_DATA.cinturaoKuiper || !PLANET_DATA.cinturaoKuiper.planetasAnoes) {
            return false;
        }
        
        return PLANET_DATA.cinturaoKuiper.planetasAnoes.some(planet => planet.id === name);
    };
    
    // Função para detectar cliques nos planetas
    function onMouseClick(event) {
        // Calcular posição normalizada do mouse
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Configurar o raycaster
        raycaster.setFromCamera(pointer, camera);
        
        // Verificar interseções
        const intersects = raycaster.intersectObjects(selectableObjects, true);
        
        if (intersects.length > 0) {
            // Pegar o primeiro objeto atingido
            const clickedObject = getTopLevelParent(intersects[0].object);
            const objectName = clickedObject.name;
            
            console.log(`Clicou no objeto: ${objectName}`);
            
            // Determinando se é um planeta, lua ou outro objeto celeste
            if (objectName === 'sol') {
                // Mostra informações do sol
                if (onShowPlanetInfo) {
                    onShowPlanetInfo('sol');
                }
            } else if (isDwarfPlanet(objectName)) {
                // É um planeta anão do Cinturão de Kuiper
                console.log(`Planeta anão detectado: ${objectName}`);
                if (onShowDwarfPlanetInfo) {
                    onShowDwarfPlanetInfo(objectName);
                }
            } else if (isMoon(objectName)) {
                // É uma lua
                console.log(`Lua detectada: ${objectName}`);
                const parentPlanet = findParentPlanet(objectName);
                
                if (parentPlanet && onShowMoonInfo) {
                    onShowMoonInfo(objectName, parentPlanet);
                }
            } else {
                // É um planeta
                console.log(`Planeta detectado: ${objectName}`);
                if (onShowPlanetInfo) {
                    onShowPlanetInfo(objectName);
                }
                
                // Destaca o planeta ao clicar
                highlightObject(clickedObject);
                
                // Mover a câmera para o planeta
                moveToObject(clickedObject, camera_utils);
            }
        } else {
            console.log('Nenhum objeto clicado');
            // Se clicar fora, remove qualquer destaque
            if (HIGHLIGHTED_OBJECT) {
                unhighlightObject(HIGHLIGHTED_OBJECT);
                HIGHLIGHTED_OBJECT = null;
            }
        }
    }
    
    // Função para destacar um objeto
    function highlightObject(object) {
        // Remover destaque do objeto anterior
        if (HIGHLIGHTED_OBJECT && HIGHLIGHTED_OBJECT !== object) {
            unhighlightObject(HIGHLIGHTED_OBJECT);
        }
        
        // Destacar o novo objeto
        if (object.material) {
            // Salvar material original
            object.userData.originalEmissive = object.material.emissive ? object.material.emissive.clone() : new THREE.Color(0x000000);
            
            // Aplicar efeito de destaque
            object.material.emissive = new THREE.Color(0x444444);
        }
        
        HIGHLIGHTED_OBJECT = object;
    }
    
    // Função para remover destaque
    function unhighlightObject(object) {
        if (object.material && object.userData.originalEmissive) {
            object.material.emissive = object.userData.originalEmissive;
        }
    }
    
    // Função para obter o objeto pai de nível superior
    function getTopLevelParent(object) {
        let current = object;
        
        // Encontrar o parente que é filho direto da cena
        while (current.parent && current.parent !== scene) {
            current = current.parent;
        }
        
        return current;
    }
    
    // Função para verificar se um objeto é uma lua
    function isMoon(objectName) {
        for (const planetKey in PLANET_DATA) {
            if (planetKey === 'sol' || planetKey === 'cinturaoKuiper') continue;
            
            const planetData = PLANET_DATA[planetKey];
            
            if (planetData.satellites) {
                for (const satellite of planetData.satellites) {
                    if (satellite.name === objectName) {
                        return true;
                    }
                }
            }
        }
        
        // Verificar também nos planetas anões
        if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
            for (const planetaAnao of PLANET_DATA.cinturaoKuiper.planetasAnoes) {
                if (planetaAnao.satellites) {
                    for (const satellite of planetaAnao.satellites) {
                        if (satellite.name === objectName) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    // Função para encontrar o planeta pai de uma lua
    function findParentPlanet(moonName) {
        for (const planetKey in PLANET_DATA) {
            if (planetKey === 'sol' || planetKey === 'cinturaoKuiper') continue;
            
            const planetData = PLANET_DATA[planetKey];
            
            if (planetData.satellites) {
                for (const satellite of planetData.satellites) {
                    if (satellite.name === moonName) {
                        return planetKey;
                    }
                }
            }
        }
        
        // Verificar luas de planetas anões
        if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
            for (const dwarfPlanet of PLANET_DATA.cinturaoKuiper.planetasAnoes) {
                if (dwarfPlanet.satellites) {
                    for (const satellite of dwarfPlanet.satellites) {
                        if (satellite.name === moonName) {
                            return dwarfPlanet.id;
                        }
                    }
                }
            }
        }
        
        return null;
    }
    
    // Função para mover a câmera para o objeto
    function moveToObject(object, camera_utils) {
        if (camera_utils && camera_utils.focusOnObject) {
            camera_utils.focusOnObject(object, true);
        }
    }
    
    // Verificar se o renderer existe e tem a propriedade domElement antes de adicionar o listener
    if (renderer && renderer.domElement) {
        // Adicionar o event listener
        renderer.domElement.addEventListener('click', onMouseClick);
        
        // Retorna uma função de limpeza para remover o event listener
        return function cleanup() {
            renderer.domElement.removeEventListener('click', onMouseClick);
        };
    } else {
        console.error('Renderer inválido ou não possui domElement ao configurar eventos de mouse');
        return function() {}; // Retorna função vazia como fallback
    }
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