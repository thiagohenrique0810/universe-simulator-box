/**
 * Sistema de Chuvas de Meteoros
 * Simula chuvas de meteoros e eventos astronômicos periódicos
 */

// Dados das principais chuvas de meteoros
const METEOR_SHOWERS = [
    {
        id: 'quadrantidas',
        name: 'Quadrântidas',
        peak: { month: 0, day: 3 }, // Janeiro
        duration: { start: { month: 0, day: 1 }, end: { month: 0, day: 5 } },
        rate: 120, // Meteoros por hora no pico
        radiantPosition: { ra: 15.2, dec: 49.5 }, // Ascensão reta e declinação
        color: 0x77bbff, // Azulado
        speed: 41, // km/s
        meteorSize: { min: 0.05, max: 0.25 }, // Tamanho relativo
        parent: 'Asteroide 2003 EH1'
    },
    {
        id: 'liridas',
        name: 'Líridas',
        peak: { month: 3, day: 22 }, // Abril
        duration: { start: { month: 3, day: 16 }, end: { month: 3, day: 25 } },
        rate: 20,
        radiantPosition: { ra: 18.1, dec: 32.9 },
        color: 0xffffaa, // Amarelado
        speed: 49,
        meteorSize: { min: 0.05, max: 0.2 },
        parent: 'Cometa C/1861 G1 (Thatcher)'
    },
    {
        id: 'eta-aquaridas',
        name: 'Eta Aquáridas',
        peak: { month: 4, day: 6 }, // Maio
        duration: { start: { month: 3, day: 19 }, end: { month: 4, day: 28 } },
        rate: 60,
        radiantPosition: { ra: 22.5, dec: -1.3 },
        color: 0xffaa77, // Alaranjado
        speed: 66,
        meteorSize: { min: 0.05, max: 0.15 },
        parent: 'Cometa 1P/Halley'
    },
    {
        id: 'perseidas',
        name: 'Perseidas',
        peak: { month: 7, day: 12 }, // Agosto
        duration: { start: { month: 6, day: 17 }, end: { month: 7, day: 24 } },
        rate: 100,
        radiantPosition: { ra: 3.2, dec: 58.3 },
        color: 0xaaffbb, // Verde claro
        speed: 59,
        meteorSize: { min: 0.1, max: 0.3 },
        parent: 'Cometa 109P/Swift-Tuttle'
    },
    {
        id: 'orionidas',
        name: 'Oriônidas',
        peak: { month: 9, day: 21 }, // Outubro
        duration: { start: { month: 9, day: 2 }, end: { month: 10, day: 7 } },
        rate: 25,
        radiantPosition: { ra: 6.2, dec: 15.5 },
        color: 0xffff88, // Amarelo
        speed: 66,
        meteorSize: { min: 0.05, max: 0.15 },
        parent: 'Cometa 1P/Halley'
    },
    {
        id: 'leonidas',
        name: 'Leônidas',
        peak: { month: 10, day: 17 }, // Novembro
        duration: { start: { month: 10, day: 6 }, end: { month: 10, day: 30 } },
        rate: 15,
        radiantPosition: { ra: 10.2, dec: 22.2 },
        color: 0xff7744, // Laranja avermelhado
        speed: 71,
        meteorSize: { min: 0.08, max: 0.2 },
        parent: 'Cometa 55P/Tempel-Tuttle'
    },
    {
        id: 'geminidas',
        name: 'Gemínidas',
        peak: { month: 11, day: 14 }, // Dezembro
        duration: { start: { month: 11, day: 7 }, end: { month: 11, day: 17 } },
        rate: 120,
        radiantPosition: { ra: 7.5, dec: 32.2 },
        color: 0x22ffff, // Azul esverdeado
        speed: 35,
        meteorSize: { min: 0.1, max: 0.4 },
        parent: 'Asteroide 3200 Phaethon'
    }
];

// Variáveis do módulo
let scene;
let activeMeteors = [];
let meteorSystem;
let isActive = false;
let currentShower = null;
let meteorParticles = null;
let clock = new THREE.Clock();
let eventPanel;

/**
 * Inicializa o sistema de chuvas de meteoros
 * @param {Object} sceneRef - Referência para a cena Three.js
 * @returns {Object} Sistema de meteoros com métodos de controle
 */
export function initMeteorShowers(sceneRef) {
    scene = sceneRef;
    createEventPanel();
    
    // Criar o sistema de controle
    meteorSystem = {
        startRandomMeteors: startRandomMeteors,
        stopMeteors: stopMeteors,
        triggerShower: triggerShower,
        showUpcomingEvents: showUpcomingEvents,
        skipToNextEvent: skipToNextEvent,
        getMeteorShowers: () => METEOR_SHOWERS,
        isActive: () => isActive,
        getCurrentShower: () => currentShower
    };
    
    console.log('Sistema de chuvas de meteoros inicializado');
    return meteorSystem;
}

/**
 * Atualiza o sistema de meteoros
 * @param {number} deltaTime - Tempo desde o último frame
 */
export function updateMeteorShowers(deltaTime) {
    if (!isActive) return;
    
    const delta = deltaTime || clock.getDelta();
    
    // Atualizar meteoros existentes
    for (let i = activeMeteors.length - 1; i >= 0; i--) {
        const meteor = activeMeteors[i];
        
        // Mover o meteoro
        meteor.position.addScaledVector(meteor.userData.velocity, delta * meteor.userData.speed);
        
        // Atualizar a cauda (partículas)
        if (meteor.userData.trail) {
            meteor.userData.trail.position.copy(meteor.position);
        }
        
        // Verificar se o meteoro está fora da cena
        if (meteor.position.length() > 350) {
            // Remover meteoro e sua cauda
            if (meteor.userData.trail) {
                scene.remove(meteor.userData.trail);
            }
            scene.remove(meteor);
            activeMeteors.splice(i, 1);
        }
    }
    
    // Criar novos meteoros se necessário
    if (isActive && currentShower) {
        const rate = currentShower.rate / 60; // Taxa por segundo
        const chancePerFrame = rate * delta;
        
        if (Math.random() < chancePerFrame) {
            createMeteor(currentShower);
        }
    }
    
    // Atualizar o sistema de partículas, se existir
    if (meteorParticles && meteorParticles.geometry.attributes.position) {
        meteorParticles.geometry.attributes.position.needsUpdate = true;
        meteorParticles.geometry.attributes.size.needsUpdate = true;
        meteorParticles.geometry.attributes.customOpacity.needsUpdate = true;
    }
}

/**
 * Inicia chuva de meteoros aleatórios
 * @param {number} rate - Taxa de meteoros por minuto
 * @param {Object} options - Opções adicionais
 */
function startRandomMeteors(rate = 10, options = {}) {
    isActive = true;
    currentShower = {
        id: 'random',
        name: 'Meteoros Aleatórios',
        rate: rate,
        color: options.color || 0xffffff,
        speed: options.speed || 50,
        meteorSize: { min: 0.05, max: 0.2 }
    };
    
    console.log(`Iniciando chuva de meteoros aleatórios (${rate}/min)`);
}

/**
 * Para a chuva de meteoros atual
 */
function stopMeteors() {
    isActive = false;
    currentShower = null;
    
    // Remover todos os meteoros ativos
    for (const meteor of activeMeteors) {
        if (meteor.userData.trail) {
            scene.remove(meteor.userData.trail);
        }
        scene.remove(meteor);
    }
    activeMeteors = [];
    
    console.log('Chuva de meteoros interrompida');
}

/**
 * Inicia uma chuva de meteoros específica
 * @param {string} showerId - ID da chuva de meteoros
 */
function triggerShower(showerId) {
    // Encontrar a chuva de meteoros pelo ID
    const shower = METEOR_SHOWERS.find(s => s.id === showerId);
    if (!shower) return false;
    
    // Parar qualquer chuva atual
    stopMeteors();
    
    // Configurar a nova chuva
    isActive = true;
    currentShower = shower;
    
    // Atualizar o painel de eventos
    updateEventPanel(`Chuva de Meteoros: ${shower.name}`, 
        `Observando a chuva de meteoros ${shower.name}.<br>
        Taxa: ~${shower.rate} meteoros/hora<br>
        Origem: ${shower.parent}<br>
        Velocidade: ${shower.speed} km/s`);
    
    console.log(`Iniciando chuva de meteoros: ${shower.name}`);
    return true;
}

/**
 * Cria um meteoro baseado nas configurações da chuva
 * @param {Object} shower - Chuva de meteoros atual
 */
function createMeteor(shower) {
    // Determinar tamanho do meteoro
    const size = THREE.MathUtils.lerp(
        shower.meteorSize.min, 
        shower.meteorSize.max, 
        Math.random()
    );
    
    // Criar geometria do meteoro
    const meteorGeometry = new THREE.SphereGeometry(size, 8, 8);
    
    // Material brilhante para o meteoro
    const meteorMaterial = new THREE.MeshBasicMaterial({
        color: shower.color,
        emissive: shower.color,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });
    
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
    
    // Determinar posição inicial e direção
    // Para chuvas conhecidas, usar a radiante; para aleatórias, usar direção aleatória
    let direction;
    if (shower.radiantPosition) {
        // Converter coordenadas equatoriais para cartesianas 
        // (simplificado, para fins de visualização)
        const ra = shower.radiantPosition.ra / 24 * Math.PI * 2;
        const dec = shower.radiantPosition.dec / 90 * Math.PI / 2;
        
        // Adicionar aleatoriedade para não parecer que todos vêm do mesmo ponto
        const spread = 0.3; // radianos
        const raSpread = ra + (Math.random() - 0.5) * spread;
        const decSpread = dec + (Math.random() - 0.5) * spread;
        
        direction = new THREE.Vector3(
            -Math.cos(decSpread) * Math.sin(raSpread),
            Math.sin(decSpread),
            -Math.cos(decSpread) * Math.cos(raSpread)
        );
    } else {
        // Direção aleatória para meteoros esporádicos
        direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();
    }
    
    // Posicionar meteoro no céu
    const distance = 300; // Distância inicial da origem
    meteor.position.copy(direction).multiplyScalar(-distance);
    
    // Adicionar desvio aleatório à posição inicial
    const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    );
    meteor.position.add(offset);
    
    // Ajustar a direção para apontar para a origem (com um desvio)
    direction = new THREE.Vector3().subVectors(
        new THREE.Vector3(0, 0, 0),
        meteor.position
    ).normalize();
    
    // Adicionar desvio à direção
    const deviation = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
    );
    direction.add(deviation).normalize();
    
    // Definir velocidade
    const baseSpeed = shower.speed || 50;
    const speedVariation = baseSpeed * 0.2; // 20% de variação
    const speed = baseSpeed + (Math.random() - 0.5) * speedVariation;
    
    // Armazenar dados do meteoro
    meteor.userData = {
        velocity: direction,
        speed: speed,
        createTime: Date.now()
    };
    
    // Criar cauda do meteoro (sistema de partículas)
    createMeteorTrail(meteor, shower.color, size);
    
    // Adicionar à cena e ao array de meteoros ativos
    scene.add(meteor);
    activeMeteors.push(meteor);
    
    return meteor;
}

/**
 * Cria uma cauda para o meteoro usando sistema de partículas
 * @param {Object} meteor - Meteoro
 * @param {number} color - Cor da cauda
 * @param {number} size - Tamanho base do meteoro
 */
function createMeteorTrail(meteor, color, size) {
    // Número de partículas com base no tamanho
    const particleCount = Math.floor(size * 100);
    
    // Geometria das partículas
    const trailGeometry = new THREE.BufferGeometry();
    
    // Posições iniciais das partículas (todas no centro do meteoro)
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    
    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
        // Iniciar todas as partículas na posição do meteoro
        positions[i * 3] = meteor.position.x;
        positions[i * 3 + 1] = meteor.position.y;
        positions[i * 3 + 2] = meteor.position.z;
        
        // Tamanho das partículas diminui ao longo da cauda
        sizes[i] = size * 0.8 * (1 - i / particleCount);
        
        // Opacidade diminui ao longo da cauda
        opacities[i] = 1.0 - (i / particleCount);
    }
    
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    trailGeometry.setAttribute('customOpacity', new THREE.BufferAttribute(opacities, 1));
    
    // Criar textura para partículas
    const particleTexture = createParticleTexture();
    
    // Material das partículas
    const trailMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(color) },
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            attribute float customOpacity;
            varying float vOpacity;
            
            void main() {
                vOpacity = customOpacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform sampler2D pointTexture;
            varying float vOpacity;
            
            void main() {
                gl_FragColor = vec4(color, vOpacity) * texture2D(pointTexture, gl_PointCoord);
                if (gl_FragColor.a < 0.1) discard;
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trail);
    
    // Guardar referência à cauda
    meteor.userData.trail = trail;
    meteor.userData.trailPositions = positions;
    meteor.userData.trailOpacities = opacities;
    meteor.userData.lastTrailUpdate = Date.now();
    
    // Configurar atualização da cauda
    const updateTrail = () => {
        if (!meteor.userData || !meteor.userData.trail) return;
        
        const now = Date.now();
        const timeDelta = now - meteor.userData.lastTrailUpdate;
        
        if (timeDelta > 30) { // Atualizar a cada 30ms
            // Mover cada partícula um passo para trás na cauda
            for (let i = particleCount - 1; i > 0; i--) {
                positions[i * 3] = positions[(i - 1) * 3];
                positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
            }
            
            // A primeira partícula sempre segue o meteoro
            positions[0] = meteor.position.x;
            positions[1] = meteor.position.y;
            positions[2] = meteor.position.z;
            
            meteor.userData.lastTrailUpdate = now;
            
            // Atualizar a geometria
            trailGeometry.attributes.position.needsUpdate = true;
        }
        
        // Continuar atualizando enquanto o meteoro existir
        if (meteor.parent) {
            requestAnimationFrame(updateTrail);
        }
    };
    
    updateTrail();
    
    return trail;
}

/**
 * Cria uma textura para as partículas
 * @returns {THREE.Texture} Textura para as partículas
 */
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    
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
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 220, 220, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Cria o painel de informações sobre eventos astronômicos
 */
function createEventPanel() {
    eventPanel = document.createElement('div');
    eventPanel.id = 'event-panel';
    eventPanel.classList.add('event-panel', 'hidden');
    
    eventPanel.innerHTML = `
        <div class="event-header">
            <h3 id="event-title">Eventos Astronômicos</h3>
            <button id="event-close" class="event-close-btn">×</button>
        </div>
        <div class="event-content">
            <div id="event-description"></div>
        </div>
        <div class="event-footer">
            <button id="show-upcoming-btn" class="event-btn">Próximos Eventos</button>
            <button id="trigger-shower-btn" class="event-btn">Iniciar Chuva</button>
            <button id="stop-shower-btn" class="event-btn">Parar</button>
        </div>
    `;
    
    document.body.appendChild(eventPanel);
    
    // Adicionar estilos CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .event-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background-color: rgba(15, 15, 35, 0.85);
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(100, 100, 255, 0.5);
            z-index: 1000;
            padding: 15px;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
        }
        
        .event-panel.hidden {
            transform: translateX(350px);
            opacity: 0;
            pointer-events: none;
        }
        
        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .event-header h3 {
            margin: 0;
            color: #4fc3f7;
            font-size: 16px;
        }
        
        .event-close-btn {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        }
        
        .event-content {
            margin-bottom: 15px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .event-content ul {
            padding-left: 20px;
            margin: 10px 0;
        }
        
        .event-footer {
            display: flex;
            justify-content: space-between;
        }
        
        .event-btn {
            background-color: #2196f3;
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        
        .event-btn:hover {
            background-color: #0d8aee;
        }
        
        .event-shower-item {
            padding: 8px;
            margin: 5px 0;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .event-shower-item:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .event-shower-name {
            font-weight: bold;
            color: #4fc3f7;
        }
        
        .event-shower-date {
            font-size: 12px;
            color: #aaa;
        }
        
        .event-shower-info {
            font-size: 12px;
            margin-top: 5px;
        }
    `;
    
    document.head.appendChild(styleEl);
    
    // Adicionar evento para o botão de fechar
    document.getElementById('event-close').addEventListener('click', () => {
        eventPanel.classList.add('hidden');
    });
    
    // Adicionar evento para o botão de próximos eventos
    document.getElementById('show-upcoming-btn').addEventListener('click', showUpcomingEvents);
    
    // Adicionar evento para o botão de iniciar chuva
    document.getElementById('trigger-shower-btn').addEventListener('click', () => {
        if (currentShower) {
            stopMeteors();
        } else {
            showShowerSelection();
        }
    });
    
    // Adicionar evento para o botão de parar chuva
    document.getElementById('stop-shower-btn').addEventListener('click', stopMeteors);
    
    // Adicionar botão ao painel de controles
    const meteorButton = document.createElement('button');
    meteorButton.id = 'meteor-shower-btn';
    meteorButton.className = 'control-button';
    meteorButton.textContent = 'Chuvas de Meteoros';
    meteorButton.addEventListener('click', () => {
        eventPanel.classList.remove('hidden');
        showUpcomingEvents();
    });
    
    // Adicionar o botão ao painel de controles
    const controlPanel = document.querySelector('.control-panel') || document.body;
    controlPanel.appendChild(meteorButton);
}

/**
 * Atualiza o conteúdo do painel de eventos
 * @param {string} title - Título do evento
 * @param {string} content - Conteúdo HTML para o painel
 */
function updateEventPanel(title, content) {
    const titleElement = document.getElementById('event-title');
    const contentElement = document.getElementById('event-description');
    
    if (titleElement && contentElement) {
        titleElement.textContent = title;
        contentElement.innerHTML = content;
        
        // Mostrar o painel
        eventPanel.classList.remove('hidden');
    }
}

/**
 * Mostra os próximos eventos de chuvas de meteoros
 */
function showUpcomingEvents() {
    // Obter data atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    
    // Ordenar chuvas por proximidade da data atual
    const sortedShowers = [...METEOR_SHOWERS].sort((a, b) => {
        const aDistance = getDateDistance(currentMonth, currentDay, a.peak.month, a.peak.day);
        const bDistance = getDateDistance(currentMonth, currentDay, b.peak.month, b.peak.day);
        return aDistance - bDistance;
    });
    
    // Criar conteúdo HTML
    let html = '<h4>Próximas Chuvas de Meteoros</h4>';
    html += '<div class="event-showers-list">';
    
    sortedShowers.forEach(shower => {
        const distance = getDateDistance(currentMonth, currentDay, shower.peak.month, shower.peak.day);
        const date = new Date(now.getFullYear(), shower.peak.month, shower.peak.day);
        
        let status = '';
        if (distance === 0) {
            status = '<span style="color:#ff5722">Hoje!</span>';
        } else if (distance < 7) {
            status = `Em ${distance} dias`;
        } else {
            status = `${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`;
        }
        
        html += `
            <div class="event-shower-item" data-shower="${shower.id}">
                <div class="event-shower-name">${shower.name}</div>
                <div class="event-shower-date">${status}</div>
                <div class="event-shower-info">
                    Taxa: ${shower.rate} meteoros/hora | Origem: ${shower.parent}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Atualizar o painel
    updateEventPanel('Eventos Astronômicos', html);
    
    // Adicionar eventos para os itens da lista
    document.querySelectorAll('.event-shower-item').forEach(item => {
        item.addEventListener('click', () => {
            const showerId = item.getAttribute('data-shower');
            triggerShower(showerId);
        });
    });
}

/**
 * Mostra o seletor de chuvas de meteoros
 */
function showShowerSelection() {
    let html = '<h4>Selecione uma Chuva de Meteoros</h4>';
    html += '<div class="event-showers-list">';
    
    METEOR_SHOWERS.forEach(shower => {
        html += `
            <div class="event-shower-item" data-shower="${shower.id}">
                <div class="event-shower-name">${shower.name}</div>
                <div class="event-shower-info">
                    Taxa: ${shower.rate} meteoros/hora | Velocidade: ${shower.speed} km/s
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '<div class="event-shower-item" data-shower="random">';
    html += '<div class="event-shower-name">Meteoros Aleatórios</div>';
    html += '<div class="event-shower-info">Meteoros esporádicos em direções aleatórias</div>';
    html += '</div>';
    
    // Atualizar o painel
    updateEventPanel('Selecionar Chuva de Meteoros', html);
    
    // Adicionar eventos para os itens da lista
    document.querySelectorAll('.event-shower-item').forEach(item => {
        item.addEventListener('click', () => {
            const showerId = item.getAttribute('data-shower');
            if (showerId === 'random') {
                startRandomMeteors(20);
            } else {
                triggerShower(showerId);
            }
        });
    });
}

/**
 * Calcula a distância entre duas datas no mesmo ano
 * @param {number} currentMonth - Mês atual (0-11)
 * @param {number} currentDay - Dia atual
 * @param {number} targetMonth - Mês alvo (0-11)
 * @param {number} targetDay - Dia alvo
 * @returns {number} Distância em dias
 */
function getDateDistance(currentMonth, currentDay, targetMonth, targetDay) {
    const now = new Date();
    const year = now.getFullYear();
    
    const current = new Date(year, currentMonth, currentDay);
    let target = new Date(year, targetMonth, targetDay);
    
    // Se a data alvo já passou este ano, considerar para o próximo ano
    if (target < current) {
        target = new Date(year + 1, targetMonth, targetDay);
    }
    
    // Diferença em milissegundos
    const diffTime = target - current;
    
    // Converter para dias (arredondando para baixo)
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Avança o tempo para o próximo evento de chuva de meteoros
 */
function skipToNextEvent() {
    // Obter data atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    
    // Encontrar a próxima chuva de meteoros
    let nextShower = null;
    let minDistance = Infinity;
    
    for (const shower of METEOR_SHOWERS) {
        const distance = getDateDistance(currentMonth, currentDay, shower.peak.month, shower.peak.day);
        if (distance > 0 && distance < minDistance) {
            minDistance = distance;
            nextShower = shower;
        }
    }
    
    if (nextShower) {
        // Iniciar a chuva de meteoros
        triggerShower(nextShower.id);
        
        // Mensagem informativa
        const date = new Date(now.getFullYear(), nextShower.peak.month, nextShower.peak.day);
        const dateStr = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        
        updateEventPanel(`Chuva de Meteoros: ${nextShower.name}`, 
            `Simulando a chuva de meteoros ${nextShower.name} que ocorre em ${dateStr}.<br>
            Taxa: ~${nextShower.rate} meteoros/hora<br>
            Origem: ${nextShower.parent}<br>
            Velocidade: ${nextShower.speed} km/s<br><br>
            <em>Nota: A visualização foi acelerada para fins de demonstração.</em>`);
        
        return nextShower;
    }
    
    return null;
} 