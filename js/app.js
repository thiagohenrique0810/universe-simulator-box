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
import { createStars, toggleStarsVisibility } from './modules/core/stars.js';

// Importação dos módulos de UI
import { setupPlanetSelection } from './modules/ui/planet-selection.js';
import { createInfoPanel, showPlanetInfo } from './modules/ui/info-panel.js';
import { createSimulationControls, getSimulationSpeed } from './modules/ui/simulation-controls.js';

// Importação do módulo de áudio
import { setupBackgroundMusic } from './modules/audio/background-music.js';

// Variáveis globais da aplicação
let scene, camera, renderer, controls;
let planets = {};
let frameCount = 0;
let asteroidBelt, beltRing, stars;

/**
 * Inicializa o sistema solar
 */
function init() {
    // Inicializar o sistema de renderização
    const renderSystem = initRenderer();
    scene = renderSystem.scene;
    camera = renderSystem.camera;
    renderer = renderSystem.renderer;
    controls = renderSystem.controls;
    
    // Ajustar velocidades dos planetas de acordo com a Terceira Lei de Kepler
    ajustarVelocidadesKeplerianas(PLANET_DATA);
    
    // Criar o campo de estrelas
    stars = createStars(scene);
    
    // Criar planetas, sol e luas
    planets = createCelestialBodies(scene, PLANET_DATA);
    
    // Criar cinturão de asteroides
    const asteroidSystem = createAsteroidBelt(scene);
    asteroidBelt = asteroidSystem.asteroidBelt;
    beltRing = asteroidSystem.beltRing;
    
    // Realizar uma validação inicial de órbitas para garantir posicionamento correto
    validatePlanetOrbits(planets, getOrbits());
    
    // Configurar o sistema de seleção de planetas
    setupPlanetSelection(scene, camera, (planetName) => {
        showPlanetInfo(planetName, PLANET_INFO, PLANET_DATA);
    });
    
    // Criar o painel de informações
    createInfoPanel(PLANET_INFO);
    
    // Configurar a música de fundo
    setupBackgroundMusic();
    
    // Configurar controles de visibilidade
    createSimulationControls({
        toggleOrbitsVisibility,
        toggleStarsVisibility,
        toggleAsteroidBeltVisibility,
        toggleBeltRingVisibility,
        toggleSaturnRingsVisibility
    });
    
    // Iniciar a animação
    animate();
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
    
    // Não verificamos mais órbitas a cada frame ou em intervalos
    // A validação é feita apenas na inicialização
    
    // Incrementar contador de frames
    frameCount++;
    
    // Renderizar a cena
    renderScene();
}

// Iniciar o simulador quando a página estiver carregada
window.addEventListener('load', init); 