/**
 * Simulador do Sistema Solar
 * Aplicação principal que coordena todos os módulos
 */

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

// Variáveis globais para o sistema de exoplanetas
let exoplanetSystem;
let exoplanetPanel;

/**
 * Inicializa o sistema solar
 */
function init() {
    console.log('Inicializando o simulador do sistema solar');
    
    // Inicializar o sistema de renderização
    const renderSystem = initRenderer();
    scene = renderSystem.scene;
    camera = renderSystem.camera;
    renderer = renderSystem.renderer;
    controls = renderSystem.controls;
    
    // Aplicar o favicon
    try {
        // Tentar usar a versão dinâmica do favicon
        applyFavicon();
    } catch (error) {
        // Se falhar, usar a versão estática como fallback
        console.warn('Erro ao aplicar favicon dinâmico, usando versão estática:', error);
        applyStaticFavicon();
    }
    
    // Ajustar velocidades dos planetas de acordo com a Terceira Lei de Kepler
    ajustarVelocidadesKeplerianas(PLANET_DATA);
    
    // Criar o campo de estrelas
    console.log('Criando campo de estrelas e skybox...');
    const starsSystem = createStars(scene);
    stars = starsSystem.stars;
    skybox = starsSystem.skybox;
    console.log('Skybox criado:', skybox);
    
    // Criar planetas, sol e luas
    planets = createCelestialBodies(scene, PLANET_DATA);
    
    // Criar cinturão de asteroides
    const asteroidSystem = createAsteroidBelt(scene);
    asteroidBelt = asteroidSystem.asteroidBelt;
    beltRing = asteroidSystem.beltRing;
    
    // Realizar uma validação inicial de órbitas para garantir posicionamento correto
    validatePlanetOrbits(planets, getOrbits());
    
    // Aplicar efeitos atmosféricos aos planetas
    console.log('Aplicando efeitos atmosféricos...');
    toggleAtmosphericEffects(planets, true);
    
    // Inicializar o sistema de colisões
    console.log('Inicializando sistema de colisões...');
    collisionSystem = initCollisionSystem(scene);
    
    // Pré-carregar texturas para o sistema climático
    preloadClimateTextures().then(() => {
        // Aplicar sistema climático aos planetas que têm atmosfera
        console.log('Aplicando sistemas climáticos aos planetas...');
        applyClimateSystem(planets.terra, 'terra');
        applyClimateSystem(planets.venus, 'venus');
        applyClimateSystem(planets.jupiter, 'jupiter');
        applyClimateSystem(planets.saturno, 'saturno');
        applyClimateSystem(planets.urano, 'urano');
        applyClimateSystem(planets.netuno, 'netuno');
        
        // Marcar o sistema climático como inicializado
        climateInitialized = true;
    }).catch(error => {
        console.error('Erro ao carregar texturas para o sistema climático:', error);
    });
    
    // Configurar iluminação realista
    console.log('Inicializando sistema de iluminação realista...');
    lightingSystem = initRealisticLighting(scene, planets.sol);
    
    // Configurar objetos para projetar e receber sombras
    console.log('Configurando objetos para sombras...');
    for (const planetName in planets) {
        if (planetName !== 'sol') { // O sol não deve projetar sombras, apenas emitir luz
            setupObjectForShadows(planets[planetName], true, true);
        }
    }
    
    // Configurar o renderer para sombras
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Criar objeto com utilidades de câmera
    const camera_utils = {
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
    };
    
    // Configurar o sistema de seleção de planetas, luas e planetas anões
    setupPlanetSelection(
        scene, 
        camera, 
        (planetName) => showPlanetInfo(planetName, PLANET_INFO, PLANET_DATA),
        (moonName, planetName) => showMoonInfo(moonName, planetName, PLANET_DATA),
        (dwarfPlanetName) => showDwarfPlanetInfo(dwarfPlanetName),
        renderer,
        planets,
        camera_utils,
        (objectName) => showKuiperObjectInfo(objectName)
    );
    
    // Criar o painel de informações
    createInfoPanel(PLANET_INFO);
    
    // Configurar a música de fundo
    setupBackgroundMusic();
    
    // Configurar controles de visibilidade
    console.log('Configurando controles de visibilidade...');
    createSimulationControls();
    
    // Inicializar sistema de comparação de planetas
    console.log('Configurando sistema de comparação de planetas...');
    initPlanetComparison();
    
    // Inicializar sistema de tour guiado
    console.log('Configurando sistema de tour guiado...');
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
    
    // Inicializar sistema de chuvas de meteoros
    console.log('Configurando sistema de chuvas de meteoros...');
    meteorSystem = initMeteorShowers(scene, {
        sunPosition: new THREE.Vector3(0, 0, 0),
        planets: planets
    });
    
    // Expor função para acesso global (necessário para os botões no painel de eventos)
    window.meteorSystem = meteorSystem;
    
    // Configurar evento para atualização do modo de comparação
    document.addEventListener('comparison-mode-changed', function(event) {
        const isActive = event.detail.active;
        setComparisonMode(isActive);
    });
    
    // Inicializar a física avançada
    initGravityPhysics(planets, PLANET_DATA);
    
    // Configurar eventos dos controles
    setupControlEvents();
    
    // Criar o painel de controle principal se não existir
    if (!document.querySelector('.control-panel')) {
        console.log('Criando painel de controle principal...');
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';
        document.body.appendChild(controlPanel);
    }
    
    // Iniciar a Nuvem de Oort
    console.log('Inicializando a Nuvem de Oort e sistema de cometas...');
    oortCloudSystem = initOortCloud(scene, {
        radius: 10000,
        sun: planets.sol
    });
    
    // Inicializar controles da Nuvem de Oort
    initOortCloudControls(oortCloudSystem);
    
    // Inicializar a ferramenta de medição
    console.log('Inicializando a ferramenta de medição de distâncias...');
    measurementTool = initMeasurementTool(scene, camera, controls, planets);
    
    // Inicializar o simulador de missões espaciais
    console.log('Inicializando o simulador de missões espaciais...');
    missionsSystem = initSpaceMissions(scene, planets);
    
    // Inicializar o painel de controle de missões
    initMissionsPanel(missionsSystem);
    
    // Adicionar listener para controle de visibilidade das missões espaciais
    document.addEventListener('toggle-space-missions', function(event) {
        const visible = event.detail.visible;
        if (missionsSystem && missionsSystem.setAllMissionsVisible) {
            missionsSystem.setAllMissionsVisible(visible);
        }
    });
    
    // Inicializar o sistema VR
    vrSystem = initVRSystem(scene, renderer, camera, controls, planets);
    if (vrSystem.isVRSupported) {
        console.log('Sistema VR inicializado com sucesso');
    } else {
        console.warn('WebXR não suportado neste navegador. O modo VR não estará disponível.');
    }
    
    // Inicializar sistema de exoplanetas
    exoplanetSystem = initExoplanetSystem(scene);
    if (exoplanetSystem) {
        console.log('Sistema de exoplanetas inicializado');
        
        // Inicializar painel de controle de exoplanetas
        exoplanetPanel = initExoplanetPanel(exoplanetSystem, camera, controls);
    }
    
    // Iniciar a animação
    animate();
    
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
                const orbit = orbits[planetName];
                if (orbit) {
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

// Iniciar o simulador quando a página estiver carregada
window.addEventListener('load', init);

// Adicionar função para abrir o painel de exoplanetas
export function openExoplanetPanel() {
    if (exoplanetPanel) {
        exoplanetPanel.showPanel();
    }
} 