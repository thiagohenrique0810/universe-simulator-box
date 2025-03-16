/**
 * Sistema da Nuvem de Oort
 * Simula a nuvem de Oort e cometas de longo período
 */

import { createComet, updateComet } from './comets.js';

// Constantes da Nuvem de Oort
let OORT_INNER_RADIUS = 300; // Borda interna da nuvem de Oort (em UA simuladas)
let OORT_OUTER_RADIUS = 500; // Borda externa da nuvem de Oort (em UA simuladas)
const OORT_PARTICLE_COUNT = 2000; // Número de partículas para representar a nuvem
const ACTIVE_COMETS_MAX = 5; // Máximo de cometas ativos simultaneamente

// Variáveis do módulo
let scene;
let oortCloud;
let oortCloudVisible = false;
let activeComets = [];
let cometsVisible = true;
let cometSystem;
let lastCometTime = 0;
let cometFrequency = 0.1; // Frequência de aparecimento de cometas (0-1)

/**
 * Inicializa o sistema da Nuvem de Oort
 * @param {Object} sceneRef - Referência para a cena Three.js
 * @param {Object} options - Opções de configuração
 * @param {number} options.radius - Raio da Nuvem de Oort
 * @param {Object} options.sun - Referência para o objeto do Sol
 * @returns {Object} Sistema da Nuvem de Oort
 */
export function initOortCloud(sceneRef, options = {}) {
    scene = sceneRef;
    
    // Aplicar opções de configuração
    if (options.radius) {
        OORT_OUTER_RADIUS = options.radius;
        OORT_INNER_RADIUS = options.radius * 0.6;
    }
    
    // Criar a representação visual da Nuvem de Oort
    createOortCloudVisualization();
    
    // Inicializar cometas
    initComets();
    
    // Criar o objeto de controle do sistema
    cometSystem = {
        setOortCloudVisibility: setOortCloudVisibility,
        setCometVisibility: setCometVisibility,
        setCometFrequency: setCometFrequency,
        isOortCloudVisible: () => oortCloudVisible,
        areCometsVisible: () => cometsVisible,
        getCometFrequency: () => cometFrequency,
        triggerComet: createRandomComet,
        getActiveComets: () => activeComets
    };
    
    console.log('Sistema da Nuvem de Oort inicializado');
    return cometSystem;
}

/**
 * Cria a visualização da Nuvem de Oort como uma esfera de partículas
 */
function createOortCloudVisualization() {
    // Gerar partículas para a Nuvem de Oort
    const positions = new Float32Array(OORT_PARTICLE_COUNT * 3);
    const sizes = new Float32Array(OORT_PARTICLE_COUNT);
    const colors = new Float32Array(OORT_PARTICLE_COUNT * 3);
    
    // Criar distribuição esférica
    for (let i = 0; i < OORT_PARTICLE_COUNT; i++) {
        // Distribuição uniforme em uma esfera
        const radius = OORT_INNER_RADIUS + Math.random() * (OORT_OUTER_RADIUS - OORT_INNER_RADIUS);
        const theta = Math.random() * Math.PI * 2; // longitude (0-2π)
        const phi = Math.acos(2 * Math.random() - 1); // latitude (0-π)
        
        // Converter para coordenadas cartesianas
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Tamanho variável das partículas
        sizes[i] = 0.5 + Math.random() * 1.5;
        
        // Cor das partículas (azul claro a branco)
        colors[i * 3] = 0.7 + Math.random() * 0.3;     // R
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B
    }
    
    // Criar a geometria
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Criar textura para partículas
    const particleTexture = createParticleTexture();
    
    // Material para as partículas
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 0.6) * texture2D(pointTexture, gl_PointCoord);
                if (gl_FragColor.a < 0.1) discard;
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Criar o sistema de partículas
    oortCloud = new THREE.Points(geometry, material);
    oortCloud.name = 'oortCloud';
    oortCloud.visible = false;
    scene.add(oortCloud);
    
    console.log('Visualização da Nuvem de Oort criada');
}

/**
 * Cria textura para partículas da Nuvem de Oort
 * @returns {THREE.Texture} Textura para partículas
 */
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, 'rgba(240, 240, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(190, 210, 240, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 30, 0.0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Inicializa o sistema de cometas
 */
function initComets() {
    activeComets = [];
    
    console.log('Sistema de cometas inicializado');
}

/**
 * Atualiza o sistema da Nuvem de Oort e os cometas
 * @param {Object} cometSystem - Sistema de cometas
 * @param {number} deltaTime - Tempo desde o último frame
 * @param {number} simulationSpeed - Velocidade atual da simulação
 */
export function updateOortCloud(cometSystem, deltaTime = 0.016, simulationSpeed = 1) {
    if (!cometSystem) return;

    // Atualizar cometas existentes
    for (let i = activeComets.length - 1; i >= 0; i--) {
        const comet = activeComets[i];
        
        // Atualizar o cometa
        updateComet(comet, deltaTime * simulationSpeed);
        
        // Verificar se o cometa completou sua trajetória e deve ser removido
        if (comet.userData.lifeTime > comet.userData.maxLifeTime || 
            comet.position.length() > OORT_OUTER_RADIUS * 2) {
            scene.remove(comet);
            activeComets.splice(i, 1);
            console.log('Cometa removido, restantes:', activeComets.length);
        }
    }
    
    // Verificar se devemos criar um novo cometa
    const currentTime = Date.now();
    if (cometsVisible && 
        activeComets.length < ACTIVE_COMETS_MAX && 
        currentTime - lastCometTime > getRandomCometInterval()) {
        createRandomComet();
        lastCometTime = currentTime;
    }
}

/**
 * Gera um intervalo aleatório entre o aparecimento de cometas
 * @returns {number} Intervalo em milissegundos
 */
function getRandomCometInterval() {
    // Ajusta o intervalo com base na frequência definida pelo usuário (mais alto = mais frequente)
    const baseInterval = 120000; // 2 minutos como base
    const minInterval = 10000;   // 10 segundos no mínimo
    
    // Quanto maior a frequência (0-1), menor o intervalo
    return baseInterval - (baseInterval - minInterval) * cometFrequency;
}

/**
 * Cria um cometa aleatório vindo da Nuvem de Oort
 * @returns {Object} O cometa criado
 */
function createRandomComet() {
    if (activeComets.length >= ACTIVE_COMETS_MAX || !cometsVisible) {
        return null;
    }
    
    // Gerar posição inicial na borda da Nuvem de Oort
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const startPosition = new THREE.Vector3(
        OORT_OUTER_RADIUS * Math.sin(phi) * Math.cos(theta),
        OORT_OUTER_RADIUS * Math.sin(phi) * Math.sin(theta),
        OORT_OUTER_RADIUS * Math.cos(phi)
    );
    
    // Determinar ponto de periélio (ponto mais próximo do Sol)
    // Gerar uma posição aleatória dentro do sistema solar interno
    const perihelionDistance = 20 + Math.random() * 60; // 20-80 UA simuladas
    
    // Ângulo para a posição de periélio
    const perihelionTheta = Math.random() * Math.PI * 2;
    const perihelionPhi = Math.acos(2 * Math.random() - 1);
    
    const perihelionPosition = new THREE.Vector3(
        perihelionDistance * Math.sin(perihelionPhi) * Math.cos(perihelionTheta),
        perihelionDistance * Math.sin(perihelionPhi) * Math.sin(perihelionTheta),
        perihelionDistance * Math.cos(perihelionPhi)
    );
    
    // Criar o cometa
    const comet = createComet(startPosition, perihelionPosition, scene);
    
    // Adicionar à lista de cometas ativos
    activeComets.push(comet);
    
    console.log('Novo cometa criado, total:', activeComets.length);
    return comet;
}

/**
 * Define a visibilidade da Nuvem de Oort
 * @param {boolean} visible - Estado de visibilidade
 */
function setOortCloudVisibility(visible) {
    oortCloudVisible = visible;
    if (oortCloud) {
        oortCloud.visible = visible;
    }
}

/**
 * Define a visibilidade dos cometas
 * @param {boolean} visible - Estado de visibilidade
 */
function setCometVisibility(visible) {
    cometsVisible = visible;
    
    // Atualizar visibilidade dos cometas existentes
    for (const comet of activeComets) {
        comet.visible = visible;
    }
    
    // Se estamos ativando os cometas e não há nenhum, criar pelo menos um
    if (visible && activeComets.length === 0) {
        createRandomComet();
    }
}

/**
 * Define a frequência de aparecimento de cometas
 * @param {number} frequency - Frequência (0-1)
 */
function setCometFrequency(frequency) {
    cometFrequency = Math.max(0, Math.min(1, frequency));
} 