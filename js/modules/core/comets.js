/**
 * Sistema de Cometas
 * Implementa a criação e comportamento de cometas de longo período
 */

// Constantes para os cometas
const COMET_MIN_SIZE = 0.2;
const COMET_MAX_SIZE = 0.6;
const COMET_TAIL_LENGTH = 20;
const COMET_TAIL_SEGMENTS = 50;

/**
 * Cria um cometa com núcleo e cauda
 * @param {THREE.Vector3} startPosition - Posição inicial do cometa
 * @param {THREE.Vector3} perihelionPosition - Posição de periélio do cometa (ponto mais próximo do Sol)
 * @param {Object} scene - Referência para a cena Three.js
 * @returns {THREE.Object3D} O objeto do cometa
 */
export function createComet(startPosition, perihelionPosition, scene) {
    // Criar o objeto contenedor
    const cometObject = new THREE.Object3D();
    cometObject.name = 'comet';
    cometObject.position.copy(startPosition);
    
    // Tamanho aleatório para o núcleo do cometa
    const cometSize = COMET_MIN_SIZE + Math.random() * (COMET_MAX_SIZE - COMET_MIN_SIZE);
    
    // Criar o núcleo do cometa
    const cometNucleus = createCometNucleus(cometSize);
    cometObject.add(cometNucleus);
    
    // Criar a cauda do cometa
    const cometTail = createCometTail(cometSize);
    cometObject.add(cometTail);
    
    // Adicionar sistemas de partículas para efeitos adicionais
    const cometDust = createCometDustParticles(cometSize);
    cometObject.add(cometDust);
    
    // Configurar a trajetória do cometa
    const perihelionTime = 60 + Math.random() * 120; // Tempo em segundos para chegar ao periélio
    const escapeTime = 60 + Math.random() * 120;     // Tempo em segundos para escapar após o periélio
    
    // Calcular velocidade baseada na distância e tempo
    const startToPerihelionDistance = new THREE.Vector3().subVectors(perihelionPosition, startPosition);
    const perihelionToOutDistance = new THREE.Vector3().subVectors(startPosition.clone().multiplyScalar(-1), perihelionPosition);
    
    // Armazenar dados do cometa
    cometObject.userData = {
        nucleus: cometNucleus,
        tail: cometTail,
        dust: cometDust,
        size: cometSize,
        startPosition: startPosition.clone(),
        perihelionPosition: perihelionPosition.clone(),
        endPosition: startPosition.clone().multiplyScalar(-1), // Oposto da posição inicial
        perihelionTime: perihelionTime,
        escapeTime: escapeTime,
        totalTime: perihelionTime + escapeTime,
        lifeTime: 0,
        maxLifeTime: perihelionTime + escapeTime + 30, // Adicionar tempo extra para garantir saída completa
        inboundVelocity: startToPerihelionDistance.divideScalar(perihelionTime),
        outboundVelocity: perihelionToOutDistance.divideScalar(escapeTime),
        tailPositions: new Array(COMET_TAIL_SEGMENTS).fill().map(() => new THREE.Vector3()),
        tailColors: new Array(COMET_TAIL_SEGMENTS).fill().map(() => new THREE.Color()),
        lastTailUpdateTime: 0,
        // Fase da órbita: 0 = chegando ao periélio, 1 = passando pelo periélio, 2 = deixando o sistema
        phase: 0
    };
    
    // Adicionar o cometa à cena
    scene.add(cometObject);
    
    return cometObject;
}

/**
 * Cria o núcleo de um cometa
 * @param {number} size - Tamanho do núcleo
 * @returns {THREE.Mesh} O núcleo do cometa
 */
function createCometNucleus(size) {
    // Criar geometria para o núcleo do cometa
    const cometGeometry = new THREE.SphereGeometry(size, 16, 16);
    
    // Material com textura icy/rocky para o núcleo
    const cometMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x223344,
        emissiveIntensity: 0.2
    });
    
    // Adicionar ruído à textura
    const noise = new THREE.TextureLoader().load('textures/noise.jpg');
    cometMaterial.bumpMap = noise;
    cometMaterial.bumpScale = 0.05;
    cometMaterial.map = noise;
    
    // Criar o mesh
    const nucleus = new THREE.Mesh(cometGeometry, cometMaterial);
    nucleus.name = 'cometNucleus';
    
    return nucleus;
}

/**
 * Cria a cauda do cometa usando pontos
 * @param {number} size - Tamanho base do cometa
 * @returns {THREE.Line} A cauda do cometa
 */
function createCometTail(size) {
    // Criar geometria para a cauda
    const tailGeometry = new THREE.BufferGeometry();
    
    // Inicializar posições e cores
    const positions = new Float32Array(COMET_TAIL_SEGMENTS * 3);
    const colors = new Float32Array(COMET_TAIL_SEGMENTS * 3);
    
    // Configurar todas as posições inicialmente no centro
    for (let i = 0; i < COMET_TAIL_SEGMENTS; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        
        // Definir cores - branco próximo ao núcleo, azul esverdeado nas pontas
        const t = i / COMET_TAIL_SEGMENTS;
        colors[i * 3] = 1.0 - t * 0.5;     // R: de 1.0 a 0.5
        colors[i * 3 + 1] = 1.0 - t * 0.3; // G: de 1.0 a 0.7
        colors[i * 3 + 2] = 1.0;           // B: sempre 1.0
    }
    
    // Aplicar posições e cores na geometria
    tailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material para a linha
    const tailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    
    // Criar a linha
    const tail = new THREE.Line(tailGeometry, tailMaterial);
    tail.name = 'cometTail';
    
    return tail;
}

/**
 * Cria sistema de partículas para o pó do cometa
 * @param {number} size - Tamanho base do cometa
 * @returns {THREE.Points} Sistema de partículas
 */
function createCometDustParticles(size) {
    // Número de partículas proporcional ao tamanho
    const particleCount = Math.floor(size * 500);
    
    // Geometria para as partículas
    const dustGeometry = new THREE.BufferGeometry();
    
    // Inicializar posições, tamanhos e opacidades
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    
    // Inicializar todas as partículas no núcleo
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        
        // Tamanho aleatório para as partículas
        sizes[i] = 0.1 + Math.random() * 0.3;
        
        // Opacidade inicial
        opacities[i] = 0.7 + Math.random() * 0.3;
    }
    
    // Aplicar atributos na geometria
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    dustGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Criar textura para as partículas
    const particleTexture = createParticleTexture();
    
    // Material para as partículas
    const dustMaterial = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            varying float vOpacity;
            
            void main() {
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vOpacity;
            
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity) * texture2D(pointTexture, gl_PointCoord);
                if (gl_FragColor.a < 0.1) discard;
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Criar o sistema de partículas
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.name = 'cometDust';
    
    // Dados para animação das partículas
    dust.userData = {
        velocities: Array(particleCount).fill().map(() => new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        )),
        lifeTimes: Array(particleCount).fill().map(() => Math.random() * 2)
    };
    
    return dust;
}

/**
 * Cria uma textura para partículas
 * @returns {THREE.Texture} A textura criada
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
    gradient.addColorStop(0.6, 'rgba(220, 220, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 30, 0.0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Atualiza o cometa, movendo-o ao longo de sua trajetória e atualizando efeitos visuais
 * @param {THREE.Object3D} comet - O objeto do cometa
 * @param {number} deltaTime - Tempo desde o último frame em segundos
 */
export function updateComet(comet, deltaTime) {
    if (!comet || !comet.userData) return;
    
    const userData = comet.userData;
    userData.lifeTime += deltaTime;
    
    // Atualizar posição do cometa
    updateCometPosition(comet, deltaTime);
    
    // Atualizar cauda
    updateCometTail(comet, deltaTime);
    
    // Atualizar partículas de poeira
    updateCometDust(comet, deltaTime);
    
    // Rotacionar núcleo lentamente
    if (userData.nucleus) {
        userData.nucleus.rotation.x += deltaTime * 0.1;
        userData.nucleus.rotation.y += deltaTime * 0.2;
    }
}

/**
 * Atualiza a posição do cometa ao longo de sua trajetória
 * @param {THREE.Object3D} comet - O objeto do cometa
 * @param {number} deltaTime - Tempo desde o último frame
 */
function updateCometPosition(comet, deltaTime) {
    const userData = comet.userData;
    
    // Determinar a fase atual do cometa
    if (userData.lifeTime <= userData.perihelionTime) {
        // Fase 0: Chegando ao periélio
        userData.phase = 0;
        
        // Mover em direção ao periélio
        const velocityVector = userData.inboundVelocity.clone().multiplyScalar(deltaTime);
        comet.position.add(velocityVector);
        
        // Verificar se chegamos próximo ao periélio
        const distanceToPerihelion = comet.position.distanceTo(userData.perihelionPosition);
        if (distanceToPerihelion < 1.0) {
            userData.phase = 1; // Entrar na fase de periélio
        }
    } 
    else if (userData.phase === 1 || userData.lifeTime <= userData.perihelionTime + 5) {
        // Fase 1: No periélio (manter posição próxima ao periélio por alguns segundos)
        userData.phase = 1;
        
        // Movimento orbital no periélio
        const perihelionOrbitRadius = 1.0;
        const angle = userData.lifeTime * 0.5;
        
        const orbitX = Math.cos(angle) * perihelionOrbitRadius;
        const orbitZ = Math.sin(angle) * perihelionOrbitRadius;
        
        comet.position.x = userData.perihelionPosition.x + orbitX;
        comet.position.z = userData.perihelionPosition.z + orbitZ;
        
        // Verificar se devemos passar para a fase de saída
        if (userData.lifeTime > userData.perihelionTime + 5) {
            userData.phase = 2;
        }
    } 
    else {
        // Fase 2: Saindo do sistema
        userData.phase = 2;
        
        // Calcular quanto tempo já passou na fase de saída
        const escapeTimeElapsed = userData.lifeTime - (userData.perihelionTime + 5);
        
        // Mover em direção à posição final
        const velocityVector = userData.outboundVelocity.clone().multiplyScalar(deltaTime);
        comet.position.add(velocityVector);
    }
}

/**
 * Atualiza a cauda do cometa
 * @param {THREE.Object3D} comet - O objeto do cometa
 * @param {number} deltaTime - Tempo desde o último frame
 */
function updateCometTail(comet, deltaTime) {
    const userData = comet.userData;
    
    // Obter referências
    const tail = userData.tail;
    const positions = tail.geometry.attributes.position.array;
    
    // Vetor apontando na direção do Sol
    const directionToSun = new THREE.Vector3(0, 0, 0).sub(comet.position).normalize();
    
    // Mover cada segmento da cauda
    for (let i = COMET_TAIL_SEGMENTS - 1; i > 0; i--) {
        // Mover cada ponto um passo à frente na cauda
        positions[i * 3] = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
    }
    
    // O primeiro ponto da cauda está sempre no núcleo
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    
    // Estender a cauda na direção oposta ao Sol
    // Quanto mais próximo do Sol, mais longa a cauda
    const distanceToSun = comet.position.length();
    const tailScaleFactor = Math.max(0.5, Math.min(10, 500 / distanceToSun));
    
    for (let i = 1; i < COMET_TAIL_SEGMENTS; i++) {
        const segmentLength = (i / COMET_TAIL_SEGMENTS) * COMET_TAIL_LENGTH * tailScaleFactor * userData.size;
        
        // Adicionar um pouco de variação aleatória para aparência mais natural
        const jitter = Math.sin(userData.lifeTime * 2 + i * 0.2) * 0.1;
        
        // Apenas jitter nos eixos perpendiculares à direção principal
        const perpVector1 = new THREE.Vector3(1, 0, 0);
        if (Math.abs(directionToSun.dot(perpVector1)) > 0.9) {
            perpVector1.set(0, 1, 0);
        }
        const perpVector2 = new THREE.Vector3().crossVectors(directionToSun, perpVector1).normalize();
        perpVector1.crossVectors(perpVector2, directionToSun).normalize();
        
        // Posição base
        const basePosition = directionToSun.clone().multiplyScalar(-segmentLength);
        
        // Adicionar jitter
        basePosition.add(
            perpVector1.clone().multiplyScalar(jitter * segmentLength * 0.2)
        );
        basePosition.add(
            perpVector2.clone().multiplyScalar(jitter * segmentLength * 0.2)
        );
        
        // Aplicar à geometria (considerando que os índices já foram ajustados)
        positions[i * 3] = basePosition.x;
        positions[i * 3 + 1] = basePosition.y;
        positions[i * 3 + 2] = basePosition.z;
    }
    
    // Marcar geometria para atualização
    tail.geometry.attributes.position.needsUpdate = true;
}

/**
 * Atualiza as partículas de poeira do cometa
 * @param {THREE.Object3D} comet - O objeto do cometa
 * @param {number} deltaTime - Tempo desde o último frame
 */
function updateCometDust(comet, deltaTime) {
    const userData = comet.userData;
    const dust = userData.dust;
    
    if (!dust || !dust.geometry) return;
    
    const positions = dust.geometry.attributes.position.array;
    const opacities = dust.geometry.attributes.opacity.array;
    const velocities = dust.userData.velocities;
    const lifeTimes = dust.userData.lifeTimes;
    
    // Vetor apontando para longe do Sol
    const directionFromSun = comet.position.clone().normalize();
    
    // Taxa de emissão depende da distância ao Sol
    const distanceToSun = comet.position.length();
    const emissionRate = Math.max(0.1, Math.min(1.0, 100 / distanceToSun)) * 0.5;
    
    // Atualizar cada partícula
    for (let i = 0; i < positions.length / 3; i++) {
        // Atualizar tempo de vida
        lifeTimes[i] -= deltaTime;
        
        if (lifeTimes[i] <= 0) {
            // Reiniciar partícula
            positions[i * 3] = (Math.random() - 0.5) * userData.size * 0.5;
            positions[i * 3 + 1] = (Math.random() - 0.5) * userData.size * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * userData.size * 0.5;
            
            // Nova velocidade influenciada pela direção do Sol
            const randomDir = new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            
            // Combinar direção aleatória com direção do Sol
            velocities[i] = directionFromSun.clone()
                .multiplyScalar(0.1 * emissionRate)
                .add(randomDir)
                .multiplyScalar(0.1);
            
            // Restaurar opacidade
            opacities[i] = 0.7 + Math.random() * 0.3;
            
            // Novo tempo de vida
            lifeTimes[i] = 1 + Math.random() * 3;
        } else {
            // Mover partícula
            positions[i * 3] += velocities[i].x * deltaTime * 10;
            positions[i * 3 + 1] += velocities[i].y * deltaTime * 10;
            positions[i * 3 + 2] += velocities[i].z * deltaTime * 10;
            
            // Diminuir opacidade gradualmente
            opacities[i] *= 0.99;
        }
    }
    
    // Marcar geometria para atualização
    dust.geometry.attributes.position.needsUpdate = true;
    dust.geometry.attributes.opacity.needsUpdate = true;
} 