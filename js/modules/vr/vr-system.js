/**
 * Sistema de Realidade Virtual para o Simulador do Sistema Solar
 * Permite a visualização e interação com o sistema solar em dispositivos VR
 * utilizando a API WebXR
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { VRButton } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/XRControllerModelFactory.js';
import { initVRInstructions, detectVRDevice, createVRNotification } from './vr-instructions.js';

// Configurações do sistema VR
const VR_SETTINGS = {
    scaleMultiplier: 0.01,      // Multiplicador de escala para VR (reduz o tamanho do sistema solar)
    controllerRayLength: 100,   // Comprimento do raio do controle para interação
    movementSpeed: 5,           // Velocidade de movimento no espaço
    rotationSpeed: 0.05,        // Velocidade de rotação
    teleportDistance: 50,       // Distância máxima para teleporte
    grabDistance: 5,            // Distância para agarrar objetos
    hapticFeedbackIntensity: 1.0, // Intensidade do feedback háptico
    interactableLayers: ['planets', 'moons', 'spacecraft'] // Camadas com as quais o usuário pode interagir
};

// Estado do sistema VR
let vrActive = false;           // Se o modo VR está ativo
let scene;                      // Referência à cena
let renderer;                   // Referência ao renderer
let camera;                     // Referência à câmera
let controls;                   // Referência aos controles OrbitControls
let vrControllers = [];         // Controladores VR
let controllerGrips = [];       // Modelos 3D dos controladores
let raycaster;                  // Raycaster para interação
let vrButton;                   // Botão para entrar no modo VR
let originalScaleFactors = {};  // Armazena os fatores de escala originais dos objetos
let teleportMarker;             // Marcador visual para teleporte
let vrSessionActive = false;    // Se uma sessão VR está ativa
let lastSelectedObject = null;  // Último objeto selecionado
let intersectedObjects = [];    // Objetos com os quais o raio intersecta

/**
 * Inicializa o sistema de VR
 * @param {THREE.Scene} sceneInstance - Instância da cena
 * @param {THREE.WebGLRenderer} rendererInstance - Instância do renderer
 * @param {THREE.PerspectiveCamera} cameraInstance - Instância da câmera
 * @param {Object} orbitControls - Controles de órbita
 * @param {Object} celestialBodies - Objetos celestiais da simulação
 * @returns {Object} API do sistema VR
 */
export function initVRSystem(sceneInstance, rendererInstance, cameraInstance, orbitControls, celestialBodies) {
    // Verificar se o navegador suporta WebXR
    if (!navigator.xr) {
        console.warn('WebXR não suportado neste navegador. O modo VR não estará disponível.');
        return {
            isVRSupported: false,
            isVRActive: () => false,
            toggleVR: () => console.warn('VR não suportado')
        };
    }

    // Armazenar referências
    scene = sceneInstance;
    renderer = rendererInstance;
    camera = cameraInstance;
    controls = orbitControls;

    // Configurar o renderer para WebXR
    renderer.xr.enabled = true;

    // Criar botão VR e adicioná-lo ao documento
    vrButton = VRButton.createButton(renderer);
    vrButton.style.display = 'none'; // Ocultar inicialmente
    document.body.appendChild(vrButton);

    // Inicializar raycaster para interação
    raycaster = new THREE.Raycaster();

    // Criar controladores VR
    initVRControllers();

    // Criar marcador de teleporte
    createTeleportMarker();

    // Configurar listeners de eventos para sessão VR
    setupVRSessionListeners();

    // Criar painel de controle VR
    createVRControlPanel();
    
    // Inicializar sistema de instruções VR
    const vrInstructions = initVRInstructions();
    
    // Detectar dispositivo VR e mostrar notificação
    detectVRDevice().then(deviceInfo => {
        if (deviceInfo.supported) {
            createVRNotification(true, deviceInfo.device);
        }
    });
    
    // Adicionar listener para quando as instruções forem concluídas
    window.addEventListener('vr-instructions-complete', enterVR);

    console.log('Sistema VR inicializado com sucesso');

    // Retornar API pública
    return {
        isVRSupported: true,
        isVRActive: () => vrActive,
        toggleVR: toggleVR,
        enterVR: enterVR,
        exitVR: exitVR,
        adjustScaleForVR: () => adjustScaleForVR(celestialBodies),
        restoreOriginalScale: () => restoreOriginalScale(celestialBodies),
        getVRButton: () => vrButton,
        showInstructions: vrInstructions.showInstructions
    };
}

/**
 * Inicializa os controladores VR
 */
function initVRControllers() {
    // Fábrica para criar modelos de controladores
    const controllerModelFactory = new XRControllerModelFactory();

    // Criar controladores para as duas mãos
    for (let i = 0; i < 2; i++) {
        // Criar grupo para controlador
        const controller = renderer.xr.getController(i);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        controller.addEventListener('squeezestart', onSqueezeStart);
        controller.addEventListener('squeezeend', onSqueezeEnd);
        controller.addEventListener('connected', function(event) {
            this.add(buildController(event.data));
        });
        controller.addEventListener('disconnected', function() {
            this.remove(this.children[0]);
        });
        scene.add(controller);
        vrControllers.push(controller);

        // Criar raio de apontamento
        const controllerRay = new THREE.Group();
        
        // Linha do raio
        const rayGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -VR_SETTINGS.controllerRayLength)
        ]);
        const rayMaterial = new THREE.LineBasicMaterial({
            color: 0x0088ff,
            transparent: true,
            opacity: 0.7
        });
        const ray = new THREE.Line(rayGeometry, rayMaterial);
        ray.name = 'ray';
        ray.scale.z = 1;
        controllerRay.add(ray);
        
        // Ponto do raio
        const rayEndGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const rayEndMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff
        });
        const rayEnd = new THREE.Mesh(rayEndGeometry, rayEndMaterial);
        rayEnd.position.z = -VR_SETTINGS.controllerRayLength;
        rayEnd.visible = false;
        rayEnd.name = 'rayEnd';
        controllerRay.add(rayEnd);
        
        controller.add(controllerRay);
        
        // Modelo do controle
        const grip = renderer.xr.getControllerGrip(i);
        grip.add(controllerModelFactory.createControllerModel(grip));
        scene.add(grip);
        controllerGrips.push(grip);
    }
}

/**
 * Constrói um controlador visual baseado no tipo de controle
 * @param {Object} data - Dados do controlador
 * @returns {THREE.Object3D} Objeto 3D representando o controlador
 */
function buildController(data) {
    let geometry, material;
    
    switch (data.targetRayMode) {
        case 'tracked-pointer':
            // Controlador com 6 graus de liberdade (6DOF)
            geometry = new THREE.CylinderGeometry(0.005, 0.01, 0.02, 12);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });
            return new THREE.Mesh(geometry, material);
            
        case 'gaze':
            // Controlador tipo "gaze" (para headsets sem controladores)
            geometry = new THREE.RingGeometry(0.02, 0.03, 32);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                opacity: 0.3,
                transparent: true
            });
            return new THREE.Mesh(geometry, material);
    }
}

/**
 * Cria o marcador de teleporte
 */
function createTeleportMarker() {
    // Criar geometria do marcador
    const markerGeometry = new THREE.CircleGeometry(0.5, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.5
    });
    teleportMarker = new THREE.Mesh(markerGeometry, markerMaterial);
    teleportMarker.rotation.x = -Math.PI / 2; // Rotacionar para ser paralelo ao chão
    teleportMarker.visible = false; // Inicialmente invisível
    scene.add(teleportMarker);
}

/**
 * Configura listeners para eventos de sessão VR
 */
function setupVRSessionListeners() {
    renderer.xr.addEventListener('sessionstart', () => {
        console.log('Sessão VR iniciada');
        vrSessionActive = true;
        vrActive = true;
        
        // Ajustar escala dos objetos para VR
        adjustScaleForVR();
        
        // Desativar OrbitControls em VR
        if (controls) {
            controls.enabled = false;
        }
        
        // Eventos específicos de VR
        window.dispatchEvent(new CustomEvent('vr-session-started'));
    });
    
    renderer.xr.addEventListener('sessionend', () => {
        console.log('Sessão VR encerrada');
        vrSessionActive = false;
        vrActive = false;
        
        // Restaurar escala original
        restoreOriginalScale();
        
        // Reativar OrbitControls
        if (controls) {
            controls.enabled = true;
        }
        
        // Eventos específicos de VR
        window.dispatchEvent(new CustomEvent('vr-session-ended'));
    });
}

/**
 * Cria o painel de controle para VR
 */
function createVRControlPanel() {
    // Encontrar o painel de controle principal
    const controlPanel = document.querySelector('.control-panel');
    if (!controlPanel) {
        console.error('Painel de controle principal não encontrado');
        return;
    }
    
    // Criar o fieldset para os controles VR
    const vrFieldset = document.createElement('fieldset');
    vrFieldset.className = 'controls-section';
    
    // Criar a legenda do fieldset
    const legend = document.createElement('legend');
    legend.textContent = 'Realidade Virtual';
    vrFieldset.appendChild(legend);
    
    // Adicionar botão para entrar/sair do modo VR
    const vrToggleContainer = document.createElement('div');
    vrToggleContainer.className = 'control-item';
    
    const vrToggleBtn = document.createElement('button');
    vrToggleBtn.id = 'vr-toggle-btn';
    vrToggleBtn.className = 'control-btn';
    vrToggleBtn.textContent = 'Entrar no Modo VR';
    vrToggleBtn.addEventListener('click', () => {
        if (!localStorage.getItem('vrInstructionsShown')) {
            // Se for a primeira vez, mostrar instruções
            const vrInstructions = initVRInstructions();
            vrInstructions.showInstructions();
        } else {
            // Se já viu as instruções, entrar direto
            toggleVR();
        }
    });
    
    // Verificar suporte VR e desabilitar botão se não suportado
    if (!navigator.xr) {
        vrToggleBtn.disabled = true;
        vrToggleBtn.textContent = 'VR Não Suportado';
    }
    
    vrToggleContainer.appendChild(vrToggleBtn);
    vrFieldset.appendChild(vrToggleContainer);
    
    // Adicionar controle de escala
    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'control-item';
    
    const scaleLabel = document.createElement('label');
    scaleLabel.textContent = 'Escala em VR:';
    scaleLabel.htmlFor = 'vr-scale-slider';
    
    const scaleSlider = document.createElement('input');
    scaleSlider.type = 'range';
    scaleSlider.id = 'vr-scale-slider';
    scaleSlider.min = '0.001';
    scaleSlider.max = '0.1';
    scaleSlider.step = '0.001';
    scaleSlider.value = VR_SETTINGS.scaleMultiplier;
    scaleSlider.addEventListener('input', (e) => {
        VR_SETTINGS.scaleMultiplier = parseFloat(e.target.value);
        if (vrActive) {
            adjustScaleForVR();
        }
    });
    
    scaleContainer.appendChild(scaleLabel);
    scaleContainer.appendChild(scaleSlider);
    vrFieldset.appendChild(scaleContainer);
    
    // Adicionar controle de velocidade de movimento
    const speedContainer = document.createElement('div');
    speedContainer.className = 'control-item';
    
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Velocidade de Movimento:';
    speedLabel.htmlFor = 'vr-speed-slider';
    
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.id = 'vr-speed-slider';
    speedSlider.min = '1';
    speedSlider.max = '20';
    speedSlider.step = '1';
    speedSlider.value = VR_SETTINGS.movementSpeed;
    speedSlider.addEventListener('input', (e) => {
        VR_SETTINGS.movementSpeed = parseFloat(e.target.value);
    });
    
    speedContainer.appendChild(speedLabel);
    speedContainer.appendChild(speedSlider);
    vrFieldset.appendChild(speedContainer);
    
    // Adicionar informação sobre VR
    const vrInfoContainer = document.createElement('div');
    vrInfoContainer.className = 'control-item info-text';
    vrInfoContainer.innerHTML = 
        '<p>Instruções para VR:</p>' +
        '<ul>' +
        '<li>Use os controladores para apontar e interagir</li>' +
        '<li>Botão gatilho: Selecionar/Teleportar</li>' +
        '<li>Botão lateral: Agarrar objetos</li>' +
        '<li>Joystick: Movimentação</li>' +
        '</ul>';
    vrFieldset.appendChild(vrInfoContainer);
    
    // Adicionar o fieldset ao painel de controle
    controlPanel.appendChild(vrFieldset);
}

/**
 * Alterna o modo VR (entrar/sair)
 */
function toggleVR() {
    if (vrActive) {
        exitVR();
    } else {
        enterVR();
    }
}

/**
 * Entra no modo VR
 */
function enterVR() {
    if (vrButton) {
        vrButton.click(); // Simula o clique no botão VR oficial
    }
}

/**
 * Sai do modo VR
 */
function exitVR() {
    if (renderer.xr.isPresenting) {
        renderer.xr.getSession().end();
    }
}

/**
 * Ajusta a escala dos objetos para VR
 * @param {Object} celestialBodies - Objetos celestiais da simulação
 */
function adjustScaleForVR(celestialBodies) {
    if (!celestialBodies) return;
    
    // Armazenar escalas originais caso ainda não tenham sido armazenadas
    if (Object.keys(originalScaleFactors).length === 0) {
        Object.keys(celestialBodies).forEach(key => {
            const body = celestialBodies[key];
            if (body && body.object) {
                originalScaleFactors[key] = {
                    x: body.object.scale.x,
                    y: body.object.scale.y,
                    z: body.object.scale.z
                };
            }
        });
    }
    
    // Aplicar escala VR
    Object.keys(celestialBodies).forEach(key => {
        const body = celestialBodies[key];
        if (body && body.object && originalScaleFactors[key]) {
            body.object.scale.set(
                originalScaleFactors[key].x * VR_SETTINGS.scaleMultiplier,
                originalScaleFactors[key].y * VR_SETTINGS.scaleMultiplier,
                originalScaleFactors[key].z * VR_SETTINGS.scaleMultiplier
            );
            
            // Ajustar também a posição orbital
            if (body.orbit) {
                body.orbit.scale.set(
                    VR_SETTINGS.scaleMultiplier,
                    VR_SETTINGS.scaleMultiplier,
                    VR_SETTINGS.scaleMultiplier
                );
            }
        }
    });
}

/**
 * Restaura a escala original dos objetos
 * @param {Object} celestialBodies - Objetos celestiais da simulação
 */
function restoreOriginalScale(celestialBodies) {
    if (!celestialBodies) return;
    
    Object.keys(celestialBodies).forEach(key => {
        const body = celestialBodies[key];
        if (body && body.object && originalScaleFactors[key]) {
            body.object.scale.set(
                originalScaleFactors[key].x,
                originalScaleFactors[key].y,
                originalScaleFactors[key].z
            );
            
            // Restaurar também a posição orbital
            if (body.orbit) {
                body.orbit.scale.set(1, 1, 1);
            }
        }
    });
}

/**
 * Evento quando o botão de seleção é pressionado
 */
function onSelectStart(event) {
    const controller = event.target;
    
    // Encontrar intersecções do raio com objetos na cena
    const intersections = findIntersections(controller);
    
    if (intersections.length > 0) {
        // Se encontrou algum objeto, salvar o primeiro
        lastSelectedObject = intersections[0].object;
        
        // Ativar feedback háptico
        if (controller.gamepad) {
            controller.gamepad.hapticActuators.forEach(actuator => {
                if (actuator) {
                    actuator.pulse(VR_SETTINGS.hapticFeedbackIntensity, 100);
                }
            });
        }
        
        // Emitir evento de seleção
        window.dispatchEvent(new CustomEvent('vr-object-selected', {
            detail: {
                object: lastSelectedObject,
                controller: controller
            }
        }));
    } else {
        // Se não encontrou objetos, tentar teleporte
        teleport(controller);
    }
}

/**
 * Evento quando o botão de seleção é liberado
 */
function onSelectEnd(event) {
    lastSelectedObject = null;
}

/**
 * Evento quando o botão de apertar é pressionado (para agarrar objetos)
 */
function onSqueezeStart(event) {
    const controller = event.target;
    
    // Encontrar intersecções do raio com objetos na cena
    const intersections = findIntersections(controller);
    
    if (intersections.length > 0) {
        // Verificar se o objeto está próximo o suficiente para agarrar
        if (intersections[0].distance <= VR_SETTINGS.grabDistance) {
            const object = intersections[0].object;
            
            // Adicionar o objeto como filho do controlador
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();
            object.getWorldPosition(worldPosition);
            object.getWorldQuaternion(worldQuaternion);
            
            // Guardar o pai original
            object.userData.originalParent = object.parent;
            object.userData.originalPosition = object.position.clone();
            object.userData.originalQuaternion = object.quaternion.clone();
            
            // Adicionar ao controlador
            controller.attach(object);
            
            // Ajustar posição relativa ao controlador
            object.position.set(0, 0, -0.1);
            
            // Ativar feedback háptico
            if (controller.gamepad) {
                controller.gamepad.hapticActuators.forEach(actuator => {
                    if (actuator) {
                        actuator.pulse(VR_SETTINGS.hapticFeedbackIntensity, 200);
                    }
                });
            }
        }
    }
}

/**
 * Evento quando o botão de apertar é liberado
 */
function onSqueezeEnd(event) {
    const controller = event.target;
    
    // Procurar por objetos que estejam como filhos diretos do controlador
    controller.children.forEach(child => {
        if (child.userData && child.userData.originalParent) {
            // Retornar o objeto ao seu pai original
            child.userData.originalParent.attach(child);
            
            // Restaurar posição e rotação originais
            child.position.copy(child.userData.originalPosition);
            child.quaternion.copy(child.userData.originalQuaternion);
            
            // Limpar dados temporários
            delete child.userData.originalParent;
            delete child.userData.originalPosition;
            delete child.userData.originalQuaternion;
        }
    });
}

/**
 * Encontra intersecções do raio do controlador com objetos na cena
 * @param {THREE.Group} controller - Controlador VR
 * @returns {Array} Array de objetos intersectados
 */
function findIntersections(controller) {
    // Direção do raio a partir do controlador
    const ray = controller.getObjectByName('ray');
    if (!ray) return [];
    
    // Direção e origem do raio
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    // Encontrar intersecções com objetos interagíveis
    return raycaster.intersectObjects(getInteractableObjects(), true);
}

// Matriz temporária para cálculos
const tempMatrix = new THREE.Matrix4();

/**
 * Retorna os objetos com os quais o usuário pode interagir
 * @returns {Array} Array de objetos interagíveis
 */
function getInteractableObjects() {
    // Esta função deve ser adaptada para retornar os objetos relevantes da sua cena
    // Por exemplo, planetas, luas, etc.
    // Para este exemplo, vamos retornar um array vazio
    return [];
}

/**
 * Realiza o teleporte do usuário para o ponto indicado pelo controlador
 * @param {THREE.Group} controller - Controlador VR
 */
function teleport(controller) {
    // Implementação do teleporte
    // Esta é uma implementação simplificada
    
    // Direção do raio a partir do controlador
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    // Verificar se o raio intersecta com alguma "superfície de teleporte"
    // Para simplificar, vamos apenas mover na direção do raio
    const cameraGroup = renderer.xr.getCamera().parent;
    if (cameraGroup) {
        const moveDistance = Math.min(VR_SETTINGS.teleportDistance, 10);
        cameraGroup.position.add(raycaster.ray.direction.multiplyScalar(moveDistance));
    }
}

/**
 * Atualiza o sistema VR a cada frame
 * @param {Number} time - Tempo atual
 * @param {Number} delta - Tempo desde o último frame
 */
export function updateVRSystem(time, delta) {
    if (!vrActive) return;
    
    // Atualizar raios dos controladores
    vrControllers.forEach(controller => {
        const ray = controller.getObjectByName('ray');
        const rayEnd = controller.getObjectByName('rayEnd');
        
        if (ray && rayEnd) {
            // Encontrar intersecções do raio com objetos na cena
            tempMatrix.identity().extractRotation(controller.matrixWorld);
            raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
            raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
            
            const intersections = raycaster.intersectObjects(getInteractableObjects(), true);
            
            if (intersections.length > 0) {
                // Se encontrou algum objeto, ajustar comprimento do raio para a distância
                const distance = intersections[0].distance;
                ray.scale.z = distance;
                rayEnd.position.z = -distance;
                rayEnd.visible = true;
            } else {
                // Se não encontrou, restaurar comprimento padrão
                ray.scale.z = 1;
                rayEnd.position.z = -VR_SETTINGS.controllerRayLength;
                rayEnd.visible = false;
            }
        }
    });
    
    // Gerenciar entrada do usuário para movimento
    handleVRMovement(delta);
}

/**
 * Gerencia o movimento do usuário no modo VR
 * @param {Number} delta - Tempo desde o último frame
 */
function handleVRMovement(delta) {
    // Obter grupo da câmera VR
    const cameraGroup = renderer.xr.getCamera().parent;
    if (!cameraGroup) return;
    
    // Verificar entrada do gamepad
    vrControllers.forEach(controller => {
        if (controller.gamepad) {
            const axes = controller.gamepad.axes;
            
            // Movimento pelo joystick (axes 2 e 3 normalmente são para o joystick direito)
            if (axes.length >= 4) {
                // Movimento para frente/trás com joystick vertical
                const moveZ = -axes[3] * VR_SETTINGS.movementSpeed * delta;
                
                // Movimento lateral com joystick horizontal
                const moveX = axes[2] * VR_SETTINGS.movementSpeed * delta;
                
                if (Math.abs(moveZ) > 0.01 || Math.abs(moveX) > 0.01) {
                    // Direção para frente baseada na orientação da câmera
                    const camera = renderer.xr.getCamera();
                    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
                    direction.y = 0; // Manter movimento no plano horizontal
                    direction.normalize();
                    
                    // Direção para a direita baseada na orientação da câmera
                    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
                    right.y = 0; // Manter movimento no plano horizontal
                    right.normalize();
                    
                    // Aplicar movimento
                    cameraGroup.position.add(direction.multiplyScalar(moveZ));
                    cameraGroup.position.add(right.multiplyScalar(moveX));
                }
            }
        }
    });
} 