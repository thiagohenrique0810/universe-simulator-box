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

// Importação dos módulos de UI
import { setupPlanetSelection, updateCameraFocus, setComparisonMode } from './modules/ui/planet-selection.js';
import { createInfoPanel, showPlanetInfo, showMoonInfo, showDwarfPlanetInfo } from './modules/ui/info-panel.js';
import { createSimulationControls, getSimulationSpeed } from './modules/ui/simulation-controls.js';
import { initPlanetComparison } from './modules/ui/planet-comparison.js';

// Importação do módulo de áudio
import { setupBackgroundMusic } from './modules/audio/background-music.js';

// Importação do módulo de favicon
import { applyFavicon, applyStaticFavicon } from '../img/favicon.js';

// Variáveis globais da aplicação
let scene, camera, renderer, controls;
let planets = {};
let frameCount = 0;
let asteroidBelt, beltRing, stars, skybox;

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
    
    // Configurar o sistema de seleção de planetas, luas e planetas anões
    setupPlanetSelection(
        scene, 
        camera, 
        (planetName) => showPlanetInfo(planetName, PLANET_INFO, PLANET_DATA),
        (moonName, planetName) => showMoonInfo(moonName, planetName, PLANET_DATA),
        (dwarfPlanetName) => showDwarfPlanetInfo(dwarfPlanetName)
    );
    
    // Criar o painel de informações
    createInfoPanel(PLANET_INFO);
    
    // Configurar a música de fundo
    setupBackgroundMusic();
    
    // Configurar controles de visibilidade
    console.log('Configurando controles de visibilidade...');
    createSimulationControls({
        toggleOrbitsVisibility,
        toggleStarsVisibility,
        toggleSkyboxVisibility,
        toggleAsteroidBeltVisibility,
        toggleBeltRingVisibility,
        toggleSaturnRingsVisibility
    });
    
    // Inicializar sistema de comparação de planetas
    console.log('Configurando sistema de comparação de planetas...');
    initPlanetComparison();
    
    // Configurar evento para atualização do modo de comparação
    document.addEventListener('comparison-mode-changed', function(event) {
        const isActive = event.detail.active;
        setComparisonMode(isActive);
    });
    
    // Iniciar a animação
    animate();
    
    // Exibir mensagem de ajuda sobre duplo clique
    const infoElement = document.getElementById('info');
    if (infoElement) {
        const helpText = document.createElement('p');
        helpText.textContent = 'Dê um clique duplo em qualquer objeto para focar a câmera nele';
        infoElement.appendChild(helpText);
    }
}

/**
 * Controla a visibilidade dos anéis de Saturno
 * @param {Boolean} visible - Estado de visibilidade
 */
function toggleSaturnRingsVisibility(visible) {
    const saturno = scene.getObjectByName('saturno');
    if (saturno) {
        const ringsContainer = saturno.children.find(child => 
            child.children.length > 0 && 
            child.children[0].geometry.type === 'RingGeometry'
        );
        
                if (ringsContainer) {
            ringsContainer.visible = visible;
        }
    }
}

/**
 * Loop de animação principal
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Atualizar controles da câmera
    updateControls();
    
    // Obter a velocidade atual da simulação
    const simulationSpeed = getSimulationSpeed();
    
    // Atualizar posições dos planetas
    updatePlanetPositions(planets, simulationSpeed);
    
    // Atualizar cinturão de asteroides
    updateAsteroidBelt(simulationSpeed);
    
    // Atualizar efeito de glow do sol, se existir
    if (planets.sol && planets.sol.userData && planets.sol.userData.updateGlow) {
        planets.sol.userData.updateGlow();
    }
    
    // Atualizar o foco da câmera em um objeto selecionado
    updateCameraFocus();
    
    // Não verificamos mais órbitas a cada frame ou em intervalos
    // A validação é feita apenas na inicialização
    
    // Incrementar contador de frames
    frameCount++;
    
    // Renderizar a cena
    renderScene();
}

// Iniciar o simulador quando a página estiver carregada
window.addEventListener('load', init); 