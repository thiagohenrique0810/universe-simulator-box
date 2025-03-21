/**
 * Simulador do Sistema Solar
 * Aplicação principal que coordena todos os módulos
 */

// Importação do sistema de carregamento
import { initLoadingScreen, updateProgress, updateStatus, completeLoading } from './modules/ui/loading-screen.js';

// Importação dos módulos de dados
import { PLANET_DATA } from './modules/data/planet-data.js';
import { PLANET_INFO } from './modules/data/planet-info.js';

// Importação dos módulos principais
import { initRenderer, updateControls, renderScene } from './modules/core/renderer.js';
import { createCelestialBodies, getPlanets } from './modules/core/celestial-bodies.js';
import { 
    ajustarVelocidadesKeplerianas, 
    updatePlanetPositions, 
    validatePlanetOrbits, 
    toggleOrbitsVisibility,
    getOrbits
} from './modules/core/orbits.js';
import { 
    createAsteroidBelt, 
    updateAsteroidBelt, 
    toggleAsteroidBeltVisibility, 
    toggleBeltRingVisibility
} from './modules/core/asteroids.js';
import { createStars, toggleStarsVisibility, toggleSkyboxVisibility } from './modules/core/stars.js';
import {
    initGravityPhysics,
    updateGravityPhysics,
    setPhysicsEnabled,
    isPhysicsEnabled,
    setGravitationalStrength,
    resetOrbits
} from './modules/core/gravity-physics.js';
import { initCollisionSystem } from './modules/core/collisions.js';
import { 
    preloadClimateTextures, 
    applyClimateSystem, 
    updateClimateSystems, 
    toggleClimateSystems 
} from './modules/core/climate.js';
import {
    initRealisticLighting,
    updateLighting,
    setupObjectForShadows
} from './modules/core/lighting.js';
import { initMeteorShowers, updateMeteorShowers } from './modules/core/meteor-showers.js';

// Importação dos módulos de UI
import { setupPlanetSelection, updateCameraFocus, setComparisonMode } from './modules/ui/planet-selection.js';
import { createInfoPanel, showPlanetInfo, showMoonInfo, showDwarfPlanetInfo, showKuiperObjectInfo } from './modules/ui/info-panel.js';
import { createSimulationControls, getSimulationSpeed } from './modules/ui/simulation-controls.js';
import { initPlanetComparison } from './modules/ui/planet-comparison.js';
import { initTourGuide } from './modules/ui/tour-guide.js';
import { initOortCloud, updateOortCloud } from './modules/core/oort-cloud.js';
import { initOortCloudControls } from './modules/ui/oort-cloud-controls.js';
import { initMeasurementTool } from './modules/ui/measurement-tool.js';
import { initSpaceMissions, updateMissions } from './modules/core/space-missions.js';
import { initMissionsPanel } from './modules/ui/space-missions-panel.js';
import { initVRSystem, updateVRSystem } from './modules/vr/vr-system.js';

// Importação do módulo de áudio
import { setupBackgroundMusic } from './modules/audio/background-music.js';

// Importação do módulo de favicon
import { applyFavicon, applyStaticFavicon } from '../img/favicon.js';

// Importação do módulo de atmosfera
import { applyAtmosphericEffect, removeAtmosphericEffect, toggleAtmosphericEffects } from './modules/core/atmosphere.js';

// Importar módulos de exoplanetas
import { initExoplanetSystem, updateExoplanetSystems } from './modules/core/exoplanet-system.js';
import { initExoplanetPanel } from './modules/ui/exoplanet-panel.js';

// Variáveis globais da aplicação
let scene, camera, renderer, controls;
let stats, gui;
let planets = {};
let frameCount = 0;
let asteroidBelt, beltRing, stars, skybox;
let lastTime = 0;
let collisionSystem; // Sistema de colisões
let climateInitialized = false; // Controle para o sistema climático
let lightingSystem; // Sistema de iluminação realista
let meteorSystem;
let tourGuideSystem;
let oortCloudSystem;
let measurementTool;
let missionsSystem;
let vrSystem;
let objectsWithShaders = []; // Objetos que utilizam shaders personalizados

// Variáveis globais para o sistema de exoplanetas
let exoplanetSystem;
let exoplanetPanel;

// Variáveis dos controladores
let weatherIntensity = 0.5;

// Variável para o sistema de carregamento
let loadingSystem;

/**
 * Inicia o processo de carregamento
 */
function startLoading() {
    // Esconder a tela inicial
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    
    // Mostrar a tela de carregamento
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    
    // Inicialização do sistema de carregamento
    loadingSystem = initLoadingScreen(18); // Número total de etapas de carregamento
    
    // Iniciar o simulador
    init();
}

/**
 * Função principal para inicializar o simulador
 */
async function init() {
    // Inicializar o sistema Three.js
    updateStatus("Inicializando o sistema de renderização 3D...");
    const rendererSetup = initRenderer();
    renderer = rendererSetup.renderer;
    scene = rendererSetup.scene;
    camera = rendererSetup.camera;
    controls = rendererSetup.controls;
    updateProgress();
    
    updateStatus("Configurando ambiente do sistema solar...");
    // Aplicar o favicon
    try {
        // Tentar usar a versão dinâmica do favicon
        applyFavicon();
    } catch (error) {
        // Se falhar, usar a versão estática como fallback
        console.warn('Erro ao aplicar favicon dinâmico, usando versão estática:', error);
        applyStaticFavicon();
    }
    
    updateStatus("Criando corpos celestes...");
    // Criar os planetas, luas e outros corpos celestes
    const celestialSetup = createCelestialBodies(scene, PLANET_DATA);
    
    // Verificar se o setup foi bem-sucedido
    if (celestialSetup && celestialSetup.planets) {
        planets = celestialSetup.planets;
        console.log("Planetas criados com sucesso:", Object.keys(planets).length, "planetas");
    } else {
        console.error("Falha ao criar planetas");
        // Criar um objeto planets vazio para evitar erros futuros
        planets = {};
    }
    
    // Verificar e obter objectsWithShaders se disponível
    if (celestialSetup && celestialSetup.objectsWithShaders) {
        objectsWithShaders = celestialSetup.objectsWithShaders;
    } else {
        objectsWithShaders = [];
    }
    
    updateProgress();
    
    updateStatus("Calculando órbitas planetárias...");
    // Inicializar as órbitas
    ajustarVelocidadesKeplerianas(PLANET_DATA);
    // Validar as órbitas dos planetas
    validatePlanetOrbits(planets, PLANET_DATA);
    updateProgress();
    
    updateStatus("Configurando efeitos de iluminação...");
    // Configurar iluminação realista
    console.log("Objeto planets:", planets); // Diagnóstico
    if (planets && planets['sol']) {
        initRealisticLighting(scene, planets['sol']);
    } else {
        console.warn("Objeto sol não encontrado, inicializando iluminação apenas com a cena");
        initRealisticLighting(scene);
    }
    // Configurar cada planeta para sombras
    if (planets) {
        console.log("Configurando sombras para os planetas:", Object.keys(planets).length, "planetas encontrados");
        setupObjectForShadows(planets);
    } else {
        console.warn("Objeto planets está vazio ou indefinido, impossível configurar sombras");
    }
    updateProgress();
    
    updateStatus("Criando cinturão de asteroides...");
    // Criar cinturão de asteroides
    const asteroidSystem = createAsteroidBelt(scene);
    asteroidBelt = asteroidSystem.asteroidBelt;
    beltRing = asteroidSystem.beltRing;
    updateProgress();
    
    updateStatus("Posicionando estrelas de fundo...");
    // Criar estrelas de fundo e Via Láctea
    const starsSystem = createStars(scene);
    stars = starsSystem.stars;
    skybox = starsSystem.skybox;
    updateProgress();
    
    updateStatus("Aplicando efeitos atmosféricos...");
    // Aplicar efeitos atmosféricos aos planetas
    if (planets && Object.keys(planets).length > 0) {
        console.log("Aplicando efeitos atmosféricos aos planetas");
        toggleAtmosphericEffects(planets, true);
    } else {
        console.warn("Não foi possível aplicar efeitos atmosféricos: objeto planets não inicializado corretamente");
    }
    updateProgress();
    
    updateStatus("Inicializando sistema de colisões...");
    // Inicializar o sistema de colisões
    collisionSystem = initCollisionSystem(scene);
    updateProgress();
    
    updateStatus("Aplicando sistemas climáticos aos planetas...");
    // Pré-carregar texturas para o sistema climático
    preloadClimateTextures().then(() => {
        // Verificar se os planetas existem antes de aplicar o sistema climático
        if (planets) {
            // Aplicar sistema climático aos planetas que têm atmosfera, apenas se existirem
            if (planets.terra) applyClimateSystem(planets.terra, 'terra');
            if (planets.venus) applyClimateSystem(planets.venus, 'venus');
            if (planets.jupiter) applyClimateSystem(planets.jupiter, 'jupiter');
            if (planets.saturno) applyClimateSystem(planets.saturno, 'saturno');
            if (planets.urano) applyClimateSystem(planets.urano, 'urano');
            if (planets.netuno) applyClimateSystem(planets.netuno, 'netuno');
            
            console.log("Sistemas climáticos aplicados com sucesso aos planetas existentes");
        } else {
            console.warn("Não foi possível aplicar sistemas climáticos: objeto planets não inicializado");
        }
        
        // Marcar o sistema climático como inicializado
        climateInitialized = true;
    }).catch(error => {
        console.error('Erro ao carregar texturas para o sistema climático:', error);
    });
    updateProgress();
    
    updateStatus("Inicializando sistema de iluminação realista...");
    // Configurar objetos para projetar e receber sombras
    for (const planetName in planets) {
        if (planetName !== 'sol') { // O sol não deve projetar sombras, apenas emitir luz
            setupObjectForShadows(planets[planetName], true, true);
        }
    }
    
    // Configurar o renderer para sombras
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    updateProgress();
    
    updateStatus("Configurando sistema de comparação de planetas...");
    // Verificar se o container de controles existe
    if (!document.getElementById('controls-container')) {
        console.log("Criando container de controles para o sistema de comparação de planetas");
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-container';
        document.body.appendChild(controlsContainer);
    }
    
    // Inicializar sistema de comparação de planetas
    initPlanetComparison();
    updateProgress();
    
    updateStatus("Configurando sistema de tour guiado...");
    // Inicializar sistema de tour guiado
    tourGuideSystem = initTourGuide(scene, camera, controls, planets, {
        positionCamera: (position, target) => {
            gsap.to(camera.position, {
                duration: 2,
                x: position.x,
                y: position.y, 
                z: position.z,
                onUpdate: () => {
                    controls.target.copy(target);
                }
            });
        }
    });
    updateProgress();
    
    updateStatus("Configurando sistema de chuvas de meteoros...");
    // Inicializar sistema de chuvas de meteoros
    meteorSystem = initMeteorShowers(scene, {
        sunPosition: new THREE.Vector3(0, 0, 0),
        planets: planets
    });
    updateProgress();
    
    updateStatus("Inicializando a Nuvem de Oort e sistema de cometas...");
    // Verificar se o sol existe antes de inicializar a Nuvem de Oort
    const sunObject = planets && planets.sol ? planets.sol : null;
    // Iniciar a Nuvem de Oort
    oortCloudSystem = initOortCloud(scene, {
        radius: 10000,
        sun: sunObject
    });
    updateProgress();
    
    updateStatus("Inicializando a ferramenta de medição de distâncias...");
    // Verificar se o container de controles existe, criando-o se necessário
    if (!document.getElementById('controls-container')) {
        console.log('Criando container de controles para a ferramenta de medição...');
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-container';
        document.body.appendChild(controlsContainer);
    }
    
    // Inicializar a ferramenta de medição
    measurementTool = initMeasurementTool(scene, camera, controls, planets);
    updateProgress();
    
    updateStatus("Inicializando o simulador de missões espaciais...");
    // Inicializar o simulador de missões espaciais
    missionsSystem = initSpaceMissions(scene, planets);
    updateProgress();
    
    updateStatus("Inicializando o painel de controle de missões...");
    // Inicializar o painel de controle de missões
    initMissionsPanel(missionsSystem);
    updateProgress();
    
    updateStatus("Inicializando o sistema VR...");
    // Inicializar o sistema VR
    vrSystem = initVRSystem(scene, renderer, camera, controls, planets);
    if (vrSystem.isVRSupported) {
        console.log('Sistema VR inicializado com sucesso');
    } else {
        console.warn('WebXR não suportado neste navegador. O modo VR não estará disponível.');
    }
    updateProgress();
    
    updateStatus("Inicializando o sistema de exoplanetas...");
    // Inicializar sistema de exoplanetas
    exoplanetSystem = initExoplanetSystem(scene);
    if (exoplanetSystem) {
        console.log('Sistema de exoplanetas inicializado');
        
        // Inicializar painel de controle de exoplanetas
        exoplanetPanel = initExoplanetPanel(exoplanetSystem, camera, controls);
    }
    updateProgress();
    
    updateStatus("Finalizando configurações...");
    updateProgress();
    
    // Adicionar ao final da função init() antes de completeLoading()
    updateStatus("Configurando controles da interface...");
    
    // Configurar eventos dos controles
    setupControlEvents();
    
    // Configurar o sistema de seleção de planetas
    setupPlanetSelection(
        scene, 
        camera, 
        (planetName) => showPlanetInfo(planetName, PLANET_INFO, PLANET_DATA),
        (moonName, planetName) => showMoonInfo(moonName, planetName, PLANET_DATA),
        (dwarfPlanetName) => showDwarfPlanetInfo(dwarfPlanetName),
        renderer,
        planets,
        {
            focusOnObject: (object, animate = true) => {
                if (!object) return;
                
                // Obter a posição do objeto
                const position = object.position.clone();
                
                // Definir a posição alvo da câmera
                // Adicionar offset para não ficar exatamente sobre o objeto
                const offset = new THREE.Vector3(5, 3, 5);
                const targetPosition = position.clone().add(offset);
                
                if (animate) {
                    // Animação suave
                    const startPosition = camera.position.clone();
                    const startTarget = controls.target.clone();
                    const duration = 1000; // 1 segundo
                    const startTime = Date.now();
                    
                    function animateCamera() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3); // Easing out cubic
                        
                        // Interpolar posição
                        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
                        
                        // Interpolar alvo
                        controls.target.lerpVectors(startTarget, position, easeProgress);
                        controls.update();
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCamera);
                        }
                    }
                    
                    animateCamera();
                } else {
                    // Mudança imediata
                    camera.position.copy(targetPosition);
                    controls.target.copy(position);
                    controls.update();
                }
            }
        },
        (objectName) => showKuiperObjectInfo(objectName)
    );
    
    // Criar o painel de informações
    createInfoPanel(PLANET_INFO);
    
    // Configurar a música de fundo
    setupBackgroundMusic();
    
    // Configurar painel de controles de simulação
    createSimulationControls();
    
    // Inicializar controles da Nuvem de Oort
    initOortCloudControls(oortCloudSystem);
    
    // Inicializar a física avançada
    initGravityPhysics(planets, PLANET_DATA);
    
    // Configurar evento para atualização do modo de comparação
    document.addEventListener('comparison-mode-changed', function(event) {
        const isActive = event.detail.active;
        setComparisonMode(isActive);
    });
    
    // Adicionar listener para controle de visibilidade das missões espaciais
    document.addEventListener('toggle-space-missions', function(event) {
        const visible = event.detail.visible;
        if (missionsSystem && missionsSystem.setAllMissionsVisible) {
            missionsSystem.setAllMissionsVisible(visible);
        }
    });
    
    // Expor função para acesso global (necessário para os botões no painel de eventos)
    window.meteorSystem = meteorSystem;
    
    // Exibir mensagem de ajuda sobre duplo clique
    const infoElement = document.getElementById('info');
    if (infoElement) {
        const helpText = document.createElement('p');
        helpText.textContent = 'Dica: Dê dois cliques em um planeta para focar nele, ou use o campo de busca.';
        helpText.className = 'help-tip';
        infoElement.appendChild(helpText);
        
        // Remover a dica após 10 segundos
        setTimeout(() => {
            helpText.style.opacity = '0';
            setTimeout(() => helpText.remove(), 1000);
        }, 10000);
    }
    
    updateProgress();
    
    // Completar o carregamento e esconder a tela
    setTimeout(() => {
        completeLoading();
        // Iniciar a animação somente depois que a tela de carregamento sumir
        animate();
    }, 1000);
}

/**
 * Configura os eventos dos controles da simulação
 */
function setupControlEvents() {
    // Eventos de controle de velocidade
    document.addEventListener('set-simulation-speed', function(event) {
        console.log(`Velocidade da simulação ajustada para: ${event.detail.speed}`);
    });
    
    // Eventos de visibilidade
    document.addEventListener('toggle-orbits', function(event) {
        const visible = event.detail.visible;
        toggleOrbitsVisibility(visible);
    });
    
    document.addEventListener('toggle-stars', function(event) {
        const visible = event.detail.visible;
        toggleStarsVisibility(visible);
    });
    
    document.addEventListener('toggle-skybox', function(event) {
        const visible = event.detail.visible;
        toggleSkyboxVisibility(visible);
    });
    
    document.addEventListener('toggle-asteroid-belt', function(event) {
        const visible = event.detail.visible;
        toggleAsteroidBeltVisibility(visible);
    });
    
    document.addEventListener('toggle-belt-ring', function(event) {
        const visible = event.detail.visible;
        toggleBeltRingVisibility(visible);
    });
    
    document.addEventListener('toggle-saturn-rings', function(event) {
        const visible = event.detail.visible;
        if (planets.saturno) {
            const saturnRings = planets.saturno.children.find(child => child.name === 'aneisSaturnoContainer');
            if (saturnRings) {
                saturnRings.visible = visible;
            }
        }
    });
    
    // Eventos para os anéis de Urano
    document.addEventListener('toggle-uranus-rings', function(event) {
        const visible = event.detail.visible;
        if (planets.urano) {
            const uranusRings = planets.urano.children.find(child => child.name === 'aneisurano' || child.name === 'aneisurano' || child.name === 'aneisurano' || child.name === 'aneisurarnoContainer');
            if (uranusRings) {
                uranusRings.visible = visible;
            }
        }
    });
    
    // Eventos para os anéis de Netuno
    document.addEventListener('toggle-neptune-rings', function(event) {
        const visible = event.detail.visible;
        if (planets.netuno) {
            const neptuneRings = planets.netuno.children.find(child => child.name === 'aneisnetuno' || child.name === 'aneisnetunoContainer');
            if (neptuneRings) {
                neptuneRings.visible = visible;
            }
        }
    });
    
    // Eventos para efeitos atmosféricos
    document.addEventListener('toggle-atmosphere', function(event) {
        const visible = event.detail.visible;
        toggleAtmosphericEffects(planets, visible);
    });
    
    // Eventos para sistema climático
    document.addEventListener('toggle-climate', function(event) {
        const visible = event.detail.visible;
        toggleClimateSystems(planets, visible);
    });
    
    // Eventos para física avançada
    document.addEventListener('toggle-advanced-physics', function(event) {
        const enabled = event.detail.enabled;
        setPhysicsEnabled(enabled);
    });
    
    document.addEventListener('reset-orbits', function() {
        resetOrbits(planets, PLANET_DATA);
    });
    
    document.addEventListener('set-gravity-strength', function(event) {
        const strength = event.detail.strength;
        setGravitationalStrength(strength);
    });
    
    // Eventos para o sistema de colisões
    document.addEventListener('toggle-collisions', function(event) {
        const enabled = event.detail.enabled;
        if (collisionSystem) {
            collisionSystem.setEnabled(enabled);
            console.log(`Sistema de colisões ${enabled ? 'ativado' : 'desativado'}`);
        }
    });
    
    document.addEventListener('set-collision-elasticity', function(event) {
        const value = event.detail.value;
        if (collisionSystem) {
            collisionSystem.setSettings({ elasticity: value });
            console.log(`Elasticidade das colisões ajustada para: ${value.toFixed(1)}`);
        }
    });
    
    document.addEventListener('set-explosion-intensity', function(event) {
        const value = event.detail.value;
        if (collisionSystem) {
            collisionSystem.setSettings({ 
                debrisCount: Math.floor(20 * value),
                explosionDuration: Math.floor(2000 * value)
            });
            console.log(`Intensidade das explosões ajustada para: ${value.toFixed(1)}x`);
        }
    });
    
    // Eventos para o sistema de iluminação realista
    document.addEventListener('toggle-shadows', function(event) {
        const enabled = event.detail.enabled;
        if (lightingSystem) {
            lightingSystem.setShadowsEnabled(enabled);
            console.log(`Sombras ${enabled ? 'ativadas' : 'desativadas'}`);
        }
    });
    
    document.addEventListener('toggle-eclipses', function(event) {
        const enabled = event.detail.enabled;
        if (lightingSystem) {
            lightingSystem.setEclipsesEnabled(enabled);
            console.log(`Detecção de eclipses ${enabled ? 'ativada' : 'desativada'}`);
        }
    });
    
    document.addEventListener('set-sun-intensity', function(event) {
        const intensity = event.detail.intensity;
        if (lightingSystem) {
            lightingSystem.setIntensity(intensity);
            console.log(`Intensidade solar ajustada para: ${intensity.toFixed(1)}`);
        }
    });

    // Eventos para o Cinturão de Kuiper
    document.addEventListener('toggle-kuiper-belt', function(event) {
        const visible = event.detail.visible;
        // Ocultar/mostrar os planetas anões principais (Plutão, Eris, etc.)
        for (const planetName in planets) {
            const planet = planets[planetName];
            if (planet.userData && planet.userData.isDwarfPlanet) {
                planet.visible = visible;
                // Também ajustar visibilidade das órbitas
                const orbitsObj = getOrbits(); // Obter o objeto orbits usando a função importada
                const orbit = orbitsObj[planetName];
                if (orbit) {
                    const orbitLinesVisible = document.querySelector('#toggle-orbits')?.checked || false;
                    orbit.visible = visible && orbitLinesVisible;
                }
            }
        }
        console.log(`Cinturão de Kuiper ${visible ? 'visível' : 'oculto'}`);
    });

    document.addEventListener('toggle-kuiper-small-objects', function(event) {
        const visible = event.detail.visible;
        // Ocultar/mostrar objetos menores do Cinturão de Kuiper
        for (const objectName in planets) {
            if (objectName.startsWith('kuiperBelt_')) {
                const container = planets[objectName];
                if (container) {
                    container.visible = visible;
                }
            }
        }
        console.log(`Objetos menores do Cinturão de Kuiper ${visible ? 'visíveis' : 'ocultos'}`);
    });
}

/**
 * Calcula o intervalo de tempo desde o último frame
 * @param {Number} timestamp - Timestamp atual
 * @returns {Number} - Intervalo de tempo em segundos
 */
function calculateDeltaTime(timestamp) {
    // Se é o primeiro frame, retornar um valor padrão
    if (lastTime === 0) {
        lastTime = timestamp;
        return 1/60; // ~16.7ms (60fps)
    }
    
    // Calcular diferença de tempo em segundos
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Limitar delta para evitar saltos muito grandes (por exemplo, após aba inativa)
    return Math.min(deltaTime, 0.1);
}

/**
 * Loop de animação principal
 * @param {Number} timestamp - Timestamp atual do navegador
 */
function animate(timestamp) {
    // Calcular diferença de tempo desde o último frame
    const deltaTime = calculateDeltaTime(timestamp);
    
    // Solicitar próximo frame de animação
    requestAnimationFrame(animate);
    
    // Atualizar controles da câmera
    updateControls();
    
    // Obter a velocidade atual da simulação
    const simulationSpeed = getSimulationSpeed();
    
    // Obter posições e velocidades dos planetas
    let planetPositions = {};
    let planetVelocities = {};
    
    // Atualizar posições dos planetas
    if (isPhysicsEnabled()) {
        // Usar modelo de física avançada com gravidade real
        const physicsData = updateGravityPhysics(planets, deltaTime, simulationSpeed);
        
        // Atualizar referências para o sistema de colisões
        planetPositions = physicsData.positions;
        planetVelocities = physicsData.velocities;
        
        // Atualizar o sistema de colisões
        if (collisionSystem) {
            collisionSystem.update(planetPositions, planetVelocities);
        }
    } else {
        // Usar modelo de órbitas predefinidas
        updatePlanetPositions(planets, simulationSpeed);
    }
    
    // Atualizar cinturão de asteroides
    updateAsteroidBelt(simulationSpeed);
    
    // Atualizar chuvas de meteoros
    updateMeteorShowers(simulationSpeed * deltaTime);
    
    // Atualizar sistema climático, se inicializado
    if (climateInitialized) {
        updateClimateSystems(deltaTime, simulationSpeed);
    }
    
    // Atualizar sistema de iluminação realista
    if (lightingSystem) {
        lightingSystem.updateLighting(planets, camera);
    }
    
    // Atualizar efeito de glow do sol, se existir
    if (planets.sol && planets.sol.userData && planets.sol.userData.updateGlow) {
        planets.sol.userData.updateGlow();
    }
    
    // Atualizar o foco da câmera em um objeto selecionado
    updateCameraFocus();
    
    // Atualizar a ferramenta de medição (se necessário)
    if (measurementTool && measurementTool.isActive()) {
        measurementTool.updateMeasurementVisuals();
    }
    
    // Incrementar contador de frames
    frameCount++;
    
    // Atualizar a Nuvem de Oort
    if (oortCloudSystem) {
        updateOortCloud(oortCloudSystem, deltaTime, getSimulationSpeed());
    }
    
    // Atualizar sistema de meteoros
    if (meteorSystem) {
        updateMeteorShowers(meteorSystem);
    }
    
    // Atualizar o simulador de missões espaciais
    if (missionsSystem) {
        updateMissions(missionsSystem, deltaTime, getSimulationSpeed());
    }
    
    // Atualizar o sistema VR
    if (vrSystem && vrSystem.isVRSupported) {
        updateVRSystem(timestamp, deltaTime);
    }
    
    // Atualizar sistema de exoplanetas
    if (exoplanetSystem) {
        updateExoplanetSystems(timestamp, deltaTime, getSimulationSpeed());
    }
    
    // Renderizar a cena
    renderScene();
}

// Configurar o botão de início quando a página carregar
window.addEventListener('load', function() {
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', startLoading);
    } else {
        console.error('Botão de início não encontrado!');
        // Fallback: iniciar diretamente se o botão não for encontrado
        startLoading();
    }
});

// Adicionar função para abrir o painel de exoplanetas
export function openExoplanetPanel() {
    if (exoplanetPanel) {
        exoplanetPanel.showPanel();
    }
} 