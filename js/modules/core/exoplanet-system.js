/**
 * Sistema de Exoplanetas
 * Gerencia a criação e visualização de sistemas de exoplanetas
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { EXOPLANET_SYSTEMS, auToSimUnits, earthMassesToSolarMasses } from '../data/exoplanet-data.js';

// Constantes
const EXOPLANET_SCALE = 5.0; // Escalar os exoplanetas para melhor visualização
const STAR_SCALE = 2.5;     // Escalar as estrelas dos sistemas exoplanetários
const MAX_DISTANCE = 10000; // Distância máxima para posicionar sistemas (unidades 3D)
const STAR_COLORS = {
    'O': 0x9bb0ff, // Azul
    'B': 0xaabfff, // Azul-branco
    'A': 0xcad7ff, // Branco-azul
    'F': 0xf8f7ff, // Branco
    'G': 0xfff4ea, // Amarelo-branco (como nosso Sol)
    'K': 0xffd2a1, // Laranja
    'M': 0xffcc6f  // Vermelho
};

// Estado do módulo
let scene;
let activeSystems = {};  // Sistemas ativos na cena
let exoplanetContainer; // Contêiner para todos os sistemas exoplanetários
let orbitLines = {};    // Linhas de órbita
let starTexture;        // Textura para estrelas
let selectedSystem = null; // Sistema atualmente selecionado

/**
 * Inicializa o sistema de exoplanetas
 * @param {THREE.Scene} sceneInstance - A cena Three.js
 * @returns {Object} API do sistema de exoplanetas
 */
export function initExoplanetSystem(sceneInstance) {
    scene = sceneInstance;
    
    // Criar contêiner principal para todos os sistemas exoplanetários
    exoplanetContainer = new THREE.Group();
    exoplanetContainer.name = 'exoplanetContainer';
    exoplanetContainer.visible = true;
    scene.add(exoplanetContainer);
    
    // Posicionar o contêiner em um local distante do sistema solar
    exoplanetContainer.position.set(MAX_DISTANCE, 0, 0);
    
    // Carregar texturas
    const textureLoader = new THREE.TextureLoader();
    starTexture = textureLoader.load('img/star_texture.jpg', texture => {
        // Quando a textura for carregada, criar sistemas
        console.log('Textura da estrela carregada para sistemas exoplanetários');
    });
    
    console.log('Sistema de exoplanetas inicializado');
    
    // Retornar API pública
    return {
        createExoplanetSystem,
        getExoplanetSystems: () => activeSystems,
        selectSystem,
        focusOnSystem,
        focusOnPlanet,
        toggleSystemVisibility,
        toggleAllSystemsVisibility,
        getSelectedSystem: () => selectedSystem,
        getAllSystems: () => EXOPLANET_SYSTEMS
    };
}

/**
 * Cria um sistema exoplanetário na cena
 * @param {string} systemId - ID do sistema a ser criado
 * @returns {Object} O sistema criado, ou null se o ID for inválido
 */
export function createExoplanetSystem(systemId) {
    // Verificar se o sistema já está ativo
    if (activeSystems[systemId]) {
        console.log(`Sistema exoplanetário ${systemId} já está ativo`);
        return activeSystems[systemId];
    }
    
    // Encontrar dados do sistema
    const systemData = EXOPLANET_SYSTEMS.find(system => system.id === systemId);
    if (!systemData) {
        console.error(`Sistema exoplanetário ${systemId} não encontrado`);
        return null;
    }
    
    console.log(`Criando sistema exoplanetário: ${systemData.name}`);
    
    // Criar contêiner para o sistema
    const systemContainer = new THREE.Group();
    systemContainer.name = `exoSystem_${systemId}`;
    exoplanetContainer.add(systemContainer);
    
    // Posicionar o sistema com base em seus dados
    const systemPosition = calculateSystemPosition(systemData);
    systemContainer.position.copy(systemPosition);
    
    // Criar estrela do sistema
    const star = createStar(systemData);
    systemContainer.add(star);
    
    // Criar órbitas e planetas
    const planets = {};
    if (systemData.planets && systemData.planets.length > 0) {
        systemData.planets.forEach(planetData => {
            // Criar órbita
            const orbit = createOrbit(planetData, systemData);
            systemContainer.add(orbit);
            
            // Criar planeta
            const planet = createPlanet(planetData, systemData);
            systemContainer.add(planet);
            
            // Armazenar referência ao planeta
            planets[planetData.id] = {
                object: planet,
                data: planetData,
                orbit: orbit
            };
            
            // Armazenar referência à órbita
            orbitLines[planetData.id] = orbit;
        });
    }
    
    // Armazenar o sistema criado
    activeSystems[systemId] = {
        container: systemContainer,
        star: star,
        planets: planets,
        data: systemData
    };
    
    // Retornar o sistema criado
    return activeSystems[systemId];
}

/**
 * Cria a estrela de um sistema exoplanetário
 * @param {Object} systemData - Dados do sistema
 * @returns {THREE.Mesh} Objeto 3D da estrela
 */
function createStar(systemData) {
    // Determinar cor da estrela com base no tipo
    let starColor = 0xfff4ea; // Padrão: tipo G (como o Sol)
    if (systemData.starType) {
        const starType = systemData.starType.charAt(0).toUpperCase();
        if (STAR_COLORS[starType]) {
            starColor = STAR_COLORS[starType];
        }
    }
    
    // Determinar tamanho da estrela
    const starRadius = systemData.starRadius || 1;
    const scaledRadius = starRadius * STAR_SCALE;
    
    // Criar geometria e material
    const starGeometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({
        color: starColor,
        map: starTexture
    });
    
    // Criar objeto
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.name = `star_${systemData.id}`;
    
    // Adicionar efeito de glow
    addStarGlow(star, starColor, scaledRadius * 1.2);
    
    return star;
}

/**
 * Adiciona efeito de glow à estrela
 * @param {THREE.Mesh} star - Objeto da estrela
 * @param {number} color - Cor do glow
 * @param {number} size - Tamanho do glow
 */
function addStarGlow(star, color, size) {
    // Criar sprite para o glow
    const spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('img/glow.png'),
        color: color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size * 3, size * 3, 1.0);
    star.add(sprite);
    
    // Adicionar função de atualização do glow
    star.userData.updateGlow = function() {
        const time = Date.now() * 0.001;
        const pulseScale = 1.0 + 0.05 * Math.sin(time * 2.0);
        sprite.scale.set(size * 3 * pulseScale, size * 3 * pulseScale, 1.0);
    };
}

/**
 * Cria um planeta exoplanetário
 * @param {Object} planetData - Dados do planeta
 * @param {Object} systemData - Dados do sistema
 * @returns {THREE.Mesh} Objeto 3D do planeta
 */
function createPlanet(planetData, systemData) {
    // Determinar tamanho do planeta
    const earthRadius = 1; // Valor base para escala
    const planetRadius = (planetData.radius || 1) * earthRadius * EXOPLANET_SCALE * 0.1;
    
    // Criar geometria e material
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 24, 24);
    
    // Textura e cor baseadas no tipo de planeta
    let planetColor = planetData.color || 0x88aacc; // Cor padrão azul-acinzentado
    
    // Material básico para o planeta
    const planetMaterial = new THREE.MeshLambertMaterial({
        color: planetColor,
        emissive: new THREE.Color(planetColor).multiplyScalar(0.1)
    });
    
    // Criar objeto
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.name = `planet_${planetData.id}`;
    
    // Se for um planeta habitável, adicionar um efeito de glow sutil
    if (planetData.habitable) {
        const glowColor = 0x00ffff; // Ciano para planetas habitáveis
        const glowSize = planetRadius * 1.2;
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load('img/glow.png'),
            color: glowColor,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.3
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(glowSize * 2, glowSize * 2, 1.0);
        planet.add(sprite);
    }
    
    // Posicionar planeta em sua órbita inicial
    updatePlanetPosition(planet, planetData, systemData, 0);
    
    // Armazenar dados no objeto para uso futuro
    planet.userData.planetData = planetData;
    planet.userData.systemData = systemData;
    
    return planet;
}

/**
 * Cria a linha de órbita para um planeta
 * @param {Object} planetData - Dados do planeta
 * @param {Object} systemData - Dados do sistema
 * @returns {THREE.Line} Objeto 3D da órbita
 */
function createOrbit(planetData, systemData) {
    const semiMajorAxis = auToSimUnits(planetData.semiMajorAxis);
    const eccentricity = planetData.eccentricity || 0;
    
    // Criar pontos da órbita elíptica
    const orbitPoints = [];
    const segments = 128;
    
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        
        // Equação da elipse em coordenadas polares
        const radius = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
        
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    
    // Criar geometria e material da órbita
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444466,
        transparent: true,
        opacity: 0.3,
        linewidth: 1
    });
    
    // Criar objeto
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.name = `orbit_${planetData.id}`;
    orbit.rotation.x = Math.PI / 2; // Alinhar com o plano eclíptico
    
    // Aplicar inclinação orbital, se definida
    if (planetData.inclination) {
        orbit.rotation.z = planetData.inclination * Math.PI / 180;
    }
    
    return orbit;
}

/**
 * Calcula a posição para um sistema exoplanetário
 * @param {Object} systemData - Dados do sistema
 * @returns {THREE.Vector3} Posição do sistema
 */
function calculateSystemPosition(systemData) {
    // Posicionar sistemas ao longo de uma forma hemisférica
    // para evitar sobreposição e facilitar visualização
    
    // Usar o ID do sistema para valor hash
    const hash = hashString(systemData.id);
    
    // Posição no hemisfério
    const phi = Math.acos(2 * ((hash % 1000) / 1000) - 1);
    const theta = 2 * Math.PI * ((hash % 500) / 500);
    
    // Distância radial baseada na distância em anos-luz
    // Sistemas mais próximos da Terra estão mais próximos do centro
    const radialDistance = 50 + (Math.min(systemData.distance || 100, 1000) / 1000) * 50;
    
    const x = radialDistance * Math.sin(phi) * Math.cos(theta);
    const y = radialDistance * Math.sin(phi) * Math.sin(theta);
    const z = radialDistance * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
}

/**
 * Gera um valor hash simples para uma string
 * @param {string} str - String para hash
 * @returns {number} Valor hash
 */
function hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converter para inteiro de 32 bits
    }
    
    return Math.abs(hash);
}

/**
 * Atualiza a posição de um planeta em sua órbita
 * @param {THREE.Object3D} planet - Objeto 3D do planeta
 * @param {Object} planetData - Dados do planeta
 * @param {Object} systemData - Dados do sistema
 * @param {number} time - Tempo atual da simulação
 */
function updatePlanetPosition(planet, planetData, systemData, time) {
    // Calcular a posição orbital do planeta com base no tempo
    const semiMajorAxis = auToSimUnits(planetData.semiMajorAxis);
    const eccentricity = planetData.eccentricity || 0;
    const orbitalPeriod = planetData.orbitalPeriod || 365; // Dias
    
    // Converter período orbital para tempo de simulação
    const timeScale = 0.01; // Escala para tornar o movimento visível
    const scaledTime = time * timeScale;
    
    // Ângulo orbital baseado no tempo
    const meanAnomaly = (scaledTime / orbitalPeriod) * Math.PI * 2;
    
    // Resolver a equação de Kepler para órbitas elípticas
    let E = meanAnomaly;
    if (eccentricity > 0) {
        // Método iterativo para resolver a equação de Kepler: E - e*sin(E) = M
        for (let i = 0; i < 10; i++) { // 10 iterações geralmente são suficientes
            E = meanAnomaly + eccentricity * Math.sin(E);
        }
    }
    
    // Converter anomalia excêntrica para coordenadas cartesianas
    const x = semiMajorAxis * (Math.cos(E) - eccentricity);
    const z = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E);
    
    // Aplicar posição ao planeta
    planet.position.set(x, 0, z);
    
    // Aplicar inclinação orbital, se definida
    if (planetData.inclination) {
        const inclination = planetData.inclination * Math.PI / 180;
        planet.position.y = z * Math.sin(inclination);
        planet.position.z = z * Math.cos(inclination);
    }
    
    // Rotação do planeta (simplificada)
    planet.rotation.y = time * 0.5;
}

/**
 * Atualiza todos os sistemas exoplanetários ativos
 * @param {number} time - Tempo atual da simulação
 * @param {number} deltaTime - Tempo desde o último frame
 * @param {number} speedFactor - Fator de velocidade da simulação
 */
export function updateExoplanetSystems(time, deltaTime, speedFactor = 1) {
    // Atualizar cada sistema ativo
    for (const systemId in activeSystems) {
        const system = activeSystems[systemId];
        
        // Atualizar estrela (efeito de glow)
        if (system.star.userData.updateGlow) {
            system.star.userData.updateGlow();
        }
        
        // Atualizar cada planeta no sistema
        for (const planetId in system.planets) {
            const planet = system.planets[planetId].object;
            const planetData = system.planets[planetId].data;
            updatePlanetPosition(planet, planetData, system.data, time * speedFactor);
        }
    }
}

/**
 * Seleciona um sistema exoplanetário
 * @param {string} systemId - ID do sistema a ser selecionado
 * @returns {Object} Sistema selecionado ou null
 */
export function selectSystem(systemId) {
    // Verificar se o sistema existe
    if (!activeSystems[systemId]) {
        // Tentar criar o sistema se não estiver ativo
        const system = createExoplanetSystem(systemId);
        if (!system) {
            console.error(`Sistema exoplanetário ${systemId} não encontrado`);
            return null;
        }
    }
    
    // Desmarcar o sistema atualmente selecionado
    if (selectedSystem) {
        // Restaurar aparência normal
        const prevSystem = activeSystems[selectedSystem];
        if (prevSystem && prevSystem.container) {
            // Remover marcador visual, se existir
            const selectionIndicator = prevSystem.container.getObjectByName('selection_indicator');
            if (selectionIndicator) {
                prevSystem.container.remove(selectionIndicator);
            }
        }
    }
    
    // Atualizar sistema selecionado
    selectedSystem = systemId;
    
    // Destacar o sistema selecionado
    const system = activeSystems[systemId];
    if (system && system.container) {
        // Adicionar marcador visual
        const geometry = new THREE.RingGeometry(5, 5.2, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const selectionIndicator = new THREE.Mesh(geometry, material);
        selectionIndicator.name = 'selection_indicator';
        selectionIndicator.rotation.x = Math.PI / 2;
        system.container.add(selectionIndicator);
    }
    
    return system;
}

/**
 * Foca a câmera em um sistema exoplanetário
 * @param {string} systemId - ID do sistema
 * @param {Object} camera - Câmera Three.js
 * @param {Object} controls - Controles OrbitControls
 * @param {Function} onComplete - Callback ao completar a animação
 */
export function focusOnSystem(systemId, camera, controls, onComplete) {
    // Verificar se o sistema existe e está ativo
    if (!activeSystems[systemId]) {
        // Tentar criar o sistema
        const system = createExoplanetSystem(systemId);
        if (!system) {
            console.error(`Sistema exoplanetário ${systemId} não pôde ser criado`);
            return;
        }
    }
    
    // Obter posição do sistema
    const system = activeSystems[systemId];
    const worldPosition = new THREE.Vector3();
    system.container.getWorldPosition(worldPosition);
    
    // Calcular posição para a câmera
    const offset = new THREE.Vector3(15, 10, 15);
    const targetPosition = worldPosition.clone().add(offset);
    
    // Animar a câmera
    animateCamera(camera, controls, targetPosition, worldPosition, 2.0, onComplete);
    
    // Selecionar o sistema
    selectSystem(systemId);
}

/**
 * Foca a câmera em um planeta específico
 * @param {string} systemId - ID do sistema
 * @param {string} planetId - ID do planeta
 * @param {Object} camera - Câmera Three.js
 * @param {Object} controls - Controles OrbitControls
 * @param {Function} onComplete - Callback ao completar a animação
 */
export function focusOnPlanet(systemId, planetId, camera, controls, onComplete) {
    // Verificar se o sistema existe
    if (!activeSystems[systemId]) {
        console.error(`Sistema exoplanetário ${systemId} não está ativo`);
        return;
    }
    
    // Verificar se o planeta existe
    const system = activeSystems[systemId];
    if (!system.planets[planetId]) {
        console.error(`Planeta ${planetId} não encontrado no sistema ${systemId}`);
        return;
    }
    
    // Obter posição do planeta
    const planet = system.planets[planetId].object;
    const worldPosition = new THREE.Vector3();
    planet.getWorldPosition(worldPosition);
    
    // Calcular posição para a câmera, ajustada pelo tamanho do planeta
    const planetData = system.planets[planetId].data;
    const planetSize = (planetData.radius || 1) * EXOPLANET_SCALE * 0.1;
    const distance = planetSize * 20; // Distância proporcional ao tamanho
    
    const offset = new THREE.Vector3(distance, distance * 0.5, distance);
    const targetPosition = worldPosition.clone().add(offset);
    
    // Animar a câmera
    animateCamera(camera, controls, targetPosition, worldPosition, 1.5, onComplete);
}

/**
 * Anima a câmera para uma nova posição
 * @param {THREE.Camera} camera - Câmera
 * @param {THREE.OrbitControls} controls - Controles da órbita
 * @param {THREE.Vector3} targetPosition - Posição alvo para a câmera
 * @param {THREE.Vector3} lookAt - Ponto para onde a câmera olhará
 * @param {number} duration - Duração da animação em segundos
 * @param {Function} onComplete - Callback ao completar a animação
 */
function animateCamera(camera, controls, targetPosition, lookAt, duration, onComplete) {
    // Posições e alvos iniciais
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    
    // Tempo inicial
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    // Função de animação
    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1.0);
        
        // Função de easing (suavização)
        const easeOutCubic = function(t) {
            return 1 - Math.pow(1 - t, 3);
        };
        
        const easedProgress = easeOutCubic(progress);
        
        // Interpolar posição da câmera
        camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
        
        // Interpolar alvo dos controles
        controls.target.lerpVectors(startTarget, lookAt, easedProgress);
        controls.update();
        
        // Continuar animação se não estiver completa
        if (progress < 1.0) {
            requestAnimationFrame(animate);
        } else if (onComplete) {
            onComplete();
        }
    }
    
    // Iniciar animação
    animate();
}

/**
 * Alterna a visibilidade de um sistema exoplanetário
 * @param {string} systemId - ID do sistema
 * @param {boolean} visible - Se o sistema deve estar visível
 * @returns {boolean} Se a operação foi bem-sucedida
 */
export function toggleSystemVisibility(systemId, visible) {
    // Verificar se o sistema está ativo
    if (!activeSystems[systemId]) {
        return false;
    }
    
    // Atualizar visibilidade
    const system = activeSystems[systemId];
    system.container.visible = visible;
    
    return true;
}

/**
 * Alterna a visibilidade de todos os sistemas exoplanetários
 * @param {boolean} visible - Se os sistemas devem estar visíveis
 */
export function toggleAllSystemsVisibility(visible) {
    exoplanetContainer.visible = visible;
}

/**
 * Retorna informações sobre um sistema exoplanetário específico
 * @param {string} systemId - ID do sistema
 * @returns {Object} Dados do sistema ou null se não encontrado
 */
export function getExoplanetSystemInfo(systemId) {
    return EXOPLANET_SYSTEMS.find(system => system.id === systemId) || null;
}

/**
 * Retorna informações sobre um planeta específico
 * @param {string} systemId - ID do sistema
 * @param {string} planetId - ID do planeta
 * @returns {Object} Dados do planeta ou null se não encontrado
 */
export function getExoplanetInfo(systemId, planetId) {
    const system = EXOPLANET_SYSTEMS.find(system => system.id === systemId);
    if (!system || !system.planets) return null;
    
    return system.planets.find(planet => planet.id === planetId) || null;
} 