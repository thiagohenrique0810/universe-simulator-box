/**
 * Sistema de colisões para o simulador do sistema solar
 * Implementa detecção de colisões entre corpos celestes e efeitos visuais resultantes
 */

// Importar módulos necessários
import { getPlanets } from './celestial-bodies.js';

// Configurações do sistema de colisões
const COLLISION_SETTINGS = {
    enabled: false,
    debugMode: false,
    elasticity: 0.7, // Coeficiente de restituição (0-1, onde 1 = colisão perfeitamente elástica)
    minImpactVelocity: 0.001, // Velocidade mínima para registrar impacto
    debrisCount: 20, // Número de detritos gerados em uma colisão grande
    explosionDuration: 2000, // Duração da animação de explosão (ms)
    minSizeRatio: 0.1, // Proporção de tamanho mínima para absorver completamente
    collisionCooldown: 2000 // Tempo mínimo entre colisões (ms)
};

// Controle de colisões ocorridas
let activeCollisions = [];
let lastCollisionTime = {};

/**
 * Inicializa o sistema de colisões
 * @param {Object} scene - Cena Three.js
 * @returns {Object} API do sistema de colisões
 */
export function initCollisionSystem(scene) {
    console.log('Inicializando sistema de colisões...');

    // Armazenar referência à cena
    const sceneRef = scene;
    
    /**
     * Verifica colisões entre todos os corpos celestes
     * @param {Object} planetPositions - Posições atuais dos planetas e luas
     * @param {Object} planetVelocities - Velocidades atuais dos planetas e luas
     * @returns {Array} Lista de colisões detectadas
     */
    function detectCollisions(planetPositions, planetVelocities) {
        // Se o sistema de colisões estiver desativado, retornar array vazio
        if (!COLLISION_SETTINGS.enabled) return [];
        
        const planets = getPlanets();
        const detectedCollisions = [];
        
        // Criar lista de todos os objetos para verificar
        const allObjects = [];
        
        // Adicionar planetas
        for (const planetName in planets) {
            const planet = planets[planetName];
            
            // Ignorar o sol para efeitos de colisão
            if (planetName === 'sol') continue;
            
            // Obter a posição atual
            const position = planetPositions[planetName] || planet.position.clone();
            const velocity = planetVelocities[planetName] || new THREE.Vector3();
            
            allObjects.push({
                name: planetName,
                object: planet,
                position: position,
                velocity: velocity,
                radius: planet.userData.radius || 0.1
            });
            
            // Adicionar luas
            if (planet.children) {
                planet.children.forEach(child => {
                    if (child.userData && child.userData.isMoon) {
                        const moonName = child.name;
                        const fullName = `${planetName}_${moonName}`;
                        
                        // Obter posição e velocidade
                        const moonPosition = planetPositions[fullName] || child.getWorldPosition(new THREE.Vector3());
                        const moonVelocity = planetVelocities[fullName] || new THREE.Vector3();
                        
                        allObjects.push({
                            name: fullName,
                            object: child,
                            position: moonPosition,
                            velocity: moonVelocity,
                            radius: child.userData.radius || 0.05,
                            parentName: planetName
                        });
                    }
                });
            }
        }
        
        // Verificar colisões entre todos os pares de objetos
        for (let i = 0; i < allObjects.length; i++) {
            for (let j = i + 1; j < allObjects.length; j++) {
                const obj1 = allObjects[i];
                const obj2 = allObjects[j];
                
                // Verificar se são pai e filho (planeta e sua lua)
                // Nesse caso, ignoramos a colisão para evitar problemas na simulação
                if (obj2.parentName === obj1.name || obj1.parentName === obj2.name) {
                    continue;
                }
                
                // Calcular distância entre os objetos
                const distance = obj1.position.distanceTo(obj2.position);
                
                // Soma dos raios (com uma pequena margem para tornar as colisões mais visíveis)
                const combinedRadii = obj1.radius + obj2.radius;
                
                // Verificar se há colisão
                if (distance <= combinedRadii * 1.1) {
                    // Verificar período de cooldown
                    const collisionId = [obj1.name, obj2.name].sort().join('-');
                    const now = Date.now();
                    
                    if (lastCollisionTime[collisionId] && (now - lastCollisionTime[collisionId] < COLLISION_SETTINGS.collisionCooldown)) {
                        continue; // Ainda em cooldown, ignorar
                    }
                    
                    // Registrar esta colisão
                    lastCollisionTime[collisionId] = now;
                    
                    // Calcular vetor de direção da colisão
                    const normal = new THREE.Vector3().subVectors(obj2.position, obj1.position).normalize();
                    
                    // Calcular velocidade relativa na direção da colisão
                    const relativeVelocity = new THREE.Vector3().subVectors(obj1.velocity, obj2.velocity);
                    const impactSpeed = relativeVelocity.dot(normal);
                    
                    // Ignorar colisões com impacto muito pequeno
                    if (impactSpeed < COLLISION_SETTINGS.minImpactVelocity) {
                        continue;
                    }
                    
                    detectedCollisions.push({
                        object1: obj1,
                        object2: obj2,
                        position: new THREE.Vector3().addVectors(
                            obj1.position.clone().multiplyScalar(obj1.radius),
                            obj2.position.clone().multiplyScalar(obj2.radius)
                        ).divideScalar(obj1.radius + obj2.radius),
                        normal: normal,
                        impactSpeed: impactSpeed,
                        time: now
                    });
                }
            }
        }
        
        return detectedCollisions;
    }
    
    /**
     * Processa e responde às colisões detectadas
     * @param {Array} collisions - Lista de colisões detectadas
     * @param {Object} planetPositions - Posições atuais dos planetas
     * @param {Object} planetVelocities - Velocidades atuais dos planetas
     */
    function handleCollisions(collisions, planetPositions, planetVelocities) {
        if (!collisions.length) return;
        
        collisions.forEach(collision => {
            const { object1, object2, normal, impactSpeed } = collision;
            
            console.log(`Colisão detectada entre ${object1.name} e ${object2.name} com velocidade de impacto: ${impactSpeed.toFixed(4)}`);
            
            // Aplicar respostas físicas à colisão
            applyCollisionResponse(object1, object2, normal, impactSpeed, planetPositions, planetVelocities);
            
            // Criar efeitos visuais de colisão
            createCollisionEffects(collision, sceneRef);
        });
        
        // Adicionar colisões à lista de colisões ativas
        activeCollisions = [...activeCollisions, ...collisions];
        
        // Limpar colisões antigas
        const now = Date.now();
        activeCollisions = activeCollisions.filter(collision => {
            return now - collision.time < COLLISION_SETTINGS.explosionDuration;
        });
    }
    
    /**
     * Aplica resposta física à colisão
     * @param {Object} obj1 - Primeiro objeto da colisão
     * @param {Object} obj2 - Segundo objeto da colisão
     * @param {THREE.Vector3} normal - Vetor normal da colisão
     * @param {Number} impactSpeed - Velocidade de impacto
     * @param {Object} planetPositions - Posições atuais dos planetas
     * @param {Object} planetVelocities - Velocidades atuais dos planetas
     */
    function applyCollisionResponse(obj1, obj2, normal, impactSpeed, planetPositions, planetVelocities) {
        // Verificar se as velocidades estão definidas
        if (!planetVelocities[obj1.name] || !planetVelocities[obj2.name]) {
            console.warn(`Velocidades não definidas para ${obj1.name} ou ${obj2.name}`);
            return;
        }
        
        // Calcular massas (proporcional ao cubo do raio)
        const mass1 = Math.pow(obj1.radius, 3);
        const mass2 = Math.pow(obj2.radius, 3);
        
        // Calcular o impulso (assumindo colisão elástica)
        const e = COLLISION_SETTINGS.elasticity;
        const j = -(1 + e) * impactSpeed / (1/mass1 + 1/mass2);
        
        // Aplicar impulso às velocidades
        const impulse1 = normal.clone().multiplyScalar(-j / mass1);
        const impulse2 = normal.clone().multiplyScalar(j / mass2);
        
        // Atualizar velocidades
        planetVelocities[obj1.name].add(impulse1);
        planetVelocities[obj2.name].add(impulse2);
        
        // Ajustar posições para evitar interpenetração
        const overlap = obj1.radius + obj2.radius - obj1.position.distanceTo(obj2.position);
        
        if (overlap > 0) {
            const correction1 = normal.clone().multiplyScalar(-overlap * mass2/(mass1+mass2));
            const correction2 = normal.clone().multiplyScalar(overlap * mass1/(mass1+mass2));
            
            // Aplicar correções às posições
            planetPositions[obj1.name].add(correction1);
            planetPositions[obj2.name].add(correction2);
        }
    }
    
    /**
     * Cria efeitos visuais para colisões
     * @param {Object} collision - Dados da colisão
     * @param {THREE.Scene} scene - Cena Three.js
     */
    function createCollisionEffects(collision, scene) {
        const { object1, object2, position, impactSpeed } = collision;
        
        // Determinar a intensidade da colisão
        const intensity = Math.min(1.0, impactSpeed * 10);
        
        // Criar sistema de partículas para a explosão
        const particleCount = Math.floor(COLLISION_SETTINGS.debrisCount * intensity);
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });
        
        // Criar posições aleatórias para as partículas
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Posição inicial no ponto de impacto
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            // Velocidade aleatória em direção radial
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(0.01 * impactSpeed);
            
            velocities.push(velocity);
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Criar sistema de partículas e adicionar à cena
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = `explosion_${Date.now()}`;
        scene.add(particles);
        
        // Animar a explosão
        const startTime = Date.now();
        const duration = COLLISION_SETTINGS.explosionDuration;
        
        function animateExplosion() {
            const now = Date.now();
            const elapsedTime = now - startTime;
            const progress = elapsedTime / duration;
            
            if (progress >= 1.0) {
                // Remover partículas quando a animação terminar
                scene.remove(particles);
                return;
            }
            
            // Atualizar posições das partículas
            const positions = particleGeometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                // Mover partículas com base em suas velocidades
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;
                
                // Diminuir a opacidade ao longo do tempo
                particleMaterial.opacity = 1.0 - progress;
            }
            
            particleGeometry.attributes.position.needsUpdate = true;
            
            // Continuar animação
            requestAnimationFrame(animateExplosion);
        }
        
        animateExplosion();
    }
    
    /**
     * Atualiza o sistema de colisões
     * @param {Object} planetPositions - Posições atuais dos planetas
     * @param {Object} planetVelocities - Velocidades atuais dos planetas
     */
    function update(planetPositions, planetVelocities) {
        // Detectar colisões
        const collisions = detectCollisions(planetPositions, planetVelocities);
        
        // Processar colisões detectadas
        handleCollisions(collisions, planetPositions, planetVelocities);
    }
    
    /**
     * Ativa ou desativa o sistema de colisões
     * @param {Boolean} enabled - Estado desejado
     */
    function setEnabled(enabled) {
        COLLISION_SETTINGS.enabled = enabled;
        console.log(`Sistema de colisões ${enabled ? 'ativado' : 'desativado'}`);
    }
    
    /**
     * Ativa ou desativa o modo de depuração
     * @param {Boolean} enabled - Estado desejado
     */
    function setDebugMode(enabled) {
        COLLISION_SETTINGS.debugMode = enabled;
    }
    
    /**
     * Configura os parâmetros do sistema de colisões
     * @param {Object} settings - Configurações a serem aplicadas
     */
    function setSettings(settings) {
        Object.assign(COLLISION_SETTINGS, settings);
    }
    
    // Retornar API pública
    return {
        update,
        setEnabled,
        setDebugMode,
        setSettings,
        getSettings: () => Object.assign({}, COLLISION_SETTINGS)
    };
} 