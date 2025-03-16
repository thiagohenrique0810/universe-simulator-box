/**
 * Simulador de Missões Espaciais
 * Simula trajetórias de missões espaciais históricas e planejadas
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// Variáveis do módulo
let scene;
let missionsContainer;
let activeMissions = [];
let planetsRef = {};

// Constantes do módulo
const MISSION_LINE_SEGMENTS = 100;  // Número de segmentos para cada trajetória

/**
 * Inicializa o simulador de missões espaciais
 * @param {THREE.Scene} sceneRef - Referência para a cena Three.js
 * @param {Object} planets - Referência para os planetas da cena
 * @returns {Object} API do simulador de missões
 */
export function initSpaceMissions(sceneRef, planets) {
    scene = sceneRef;
    planetsRef = planets;
    
    // Criar contêiner para todas as missões
    missionsContainer = new THREE.Group();
    missionsContainer.name = 'missionsContainer';
    scene.add(missionsContainer);
    
    // Carregar o catálogo de missões
    const missions = loadMissionsCatalog();
    
    console.log('Simulador de missões espaciais inicializado');
    
    // Retornar a API pública
    return {
        createMission: createMission,
        activateMission: activateMission,
        deactivateMission: deactivateMission,
        getActiveMissions: () => activeMissions,
        updateMissions: updateMissions,
        getAllMissions: () => missions,
        getMissionById: (id) => missions.find(m => m.id === id),
        setAllMissionsVisible: setAllMissionsVisible
    };
}

/**
 * Carrega o catálogo de missões espaciais
 * @returns {Array} Catálogo de missões espaciais
 */
function loadMissionsCatalog() {
    return [
        {
            id: 'voyager1',
            name: 'Voyager 1',
            startDate: '1977-09-05',
            status: 'ativa',
            description: 'Lançada em 1977, é a sonda espacial mais distante da Terra e o único objeto artificial que atingiu o espaço interestelar. Após visitar Júpiter e Saturno, continua sua viagem para fora do Sistema Solar.',
            type: 'historica',
            trajectory: [
                { origin: 'terra', destination: 'jupiter', duration: 546 }, // Terra a Júpiter: 546 dias
                { origin: 'jupiter', destination: 'saturno', duration: 319 }, // Júpiter a Saturno: 319 dias
                { origin: 'saturno', destination: 'heliopausa', duration: 12410 } // Saturno a heliopausa: 34 anos
            ],
            color: 0x00ffff,
            speed: 17,  // km/s
            launchVehicle: 'Titan IIIE',
            objectives: [
                'Estudo detalhado de Júpiter e Saturno',
                'Observação das luas dos planetas gigantes',
                'Análise da heliosfera',
                'Exploração do espaço interestelar'
            ],
            achievements: [
                'Primeira espaçonave a atingir o espaço interestelar (2012)',
                'Descoberta de novos detalhes sobre os anéis de Saturno',
                'Imagens detalhadas das luas de Júpiter'
            ],
            link: 'https://voyager.jpl.nasa.gov/'
        },
        {
            id: 'voyager2',
            name: 'Voyager 2',
            startDate: '1977-08-20',
            status: 'ativa',
            description: 'Lançada 16 dias antes da Voyager 1, seguiu uma trajetória diferente que a permitiu visitar Urano e Netuno, sendo a única sonda a visitar estes planetas. Continua em operação enviando dados do espaço interestelar.',
            type: 'historica',
            trajectory: [
                { origin: 'terra', destination: 'jupiter', duration: 688 }, // Terra a Júpiter
                { origin: 'jupiter', destination: 'saturno', duration: 279 }, // Júpiter a Saturno
                { origin: 'saturno', destination: 'urano', duration: 1232 }, // Saturno a Urano
                { origin: 'urano', destination: 'netuno', duration: 1153 } // Urano a Netuno
            ],
            color: 0x00ccff,
            speed: 15.4,  // km/s
            launchVehicle: 'Titan IIIE',
            objectives: [
                'Grand Tour dos planetas exteriores',
                'Primeiro encontro com Urano e Netuno',
                'Estudo dos campos magnéticos planetários',
                'Análise da composição atmosférica'
            ],
            achievements: [
                'Única sonda a visitar todos os quatro planetas gigantes',
                'Descoberta de 10 novas luas de Urano',
                'Imagens detalhadas de Netuno e Tritão'
            ],
            link: 'https://voyager.jpl.nasa.gov/'
        },
        {
            id: 'pioneer10',
            name: 'Pioneer 10',
            startDate: '1972-03-02',
            status: 'inativa',
            description: 'Primeira sonda a atravessar o cinturão de asteroides e observar Júpiter de perto. Carrega uma placa com informações sobre a humanidade e a Terra, projetada para possível comunicação com vida extraterrestre.',
            type: 'historica',
            trajectory: [
                { origin: 'terra', destination: 'jupiter', duration: 641 }, // Terra a Júpiter
                { origin: 'jupiter', destination: 'exteriorSolar', duration: 0 } // Segue para fora do sistema solar
            ],
            color: 0xff9900,
            speed: 11.4,  // km/s
            launchVehicle: 'Atlas-Centaur',
            objectives: [
                'Primeiro sobrevoo de Júpiter',
                'Análise do cinturão de asteroides',
                'Estudo da radiação solar distante'
            ],
            achievements: [
                'Primeira sonda a atravessar o cinturão de asteroides',
                'Primeiras imagens de perto de Júpiter',
                'Descobertas sobre a atmosfera e magnetosfera de Júpiter'
            ],
            link: 'https://www.nasa.gov/mission_pages/pioneer/'
        },
        {
            id: 'newhorizons',
            name: 'New Horizons',
            startDate: '2006-01-19',
            status: 'ativa',
            description: 'Missão para explorar Plutão e o Cinturão de Kuiper. Foi a primeira sonda a fornecer imagens detalhadas de Plutão e continua explorando objetos no Cinturão de Kuiper.',
            type: 'historica',
            trajectory: [
                { origin: 'terra', destination: 'jupiter', duration: 405 }, // Terra a Júpiter (sobrevoo gravitacional)
                { origin: 'jupiter', destination: 'plutao', duration: 3064 }, // Júpiter a Plutão
                { origin: 'plutao', destination: 'arrokoth', duration: 1299 } // Plutão ao objeto do Cinturão de Kuiper (486958) Arrokoth
            ],
            color: 0x0066ff,
            speed: 16.26,  // km/s
            launchVehicle: 'Atlas V',
            objectives: [
                'Exploração detalhada de Plutão e suas luas',
                'Estudo da composição e atmosfera de Plutão',
                'Investigação de objetos do Cinturão de Kuiper'
            ],
            achievements: [
                'Primeiras imagens de alta resolução de Plutão',
                'Descoberta de montanhas de gelo de água em Plutão',
                'Primeiro encontro com um objeto do Cinturão de Kuiper (Arrokoth)'
            ],
            link: 'https://www.nasa.gov/mission_pages/newhorizons/main/index.html'
        },
        {
            id: 'cassini',
            name: 'Cassini-Huygens',
            startDate: '1997-10-15',
            status: 'concluída',
            description: 'Uma missão conjunta NASA-ESA-ASI para estudar Saturno, seus anéis e suas luas. A sonda Huygens pousou em Titã, enquanto Cassini orbitou Saturno por 13 anos antes de ser deliberadamente desintegrada na atmosfera do planeta.',
            type: 'historica',
            trajectory: [
                { origin: 'terra', destination: 'venus', duration: 116 }, // Terra a Vênus (primeiro sobrevoo)
                { origin: 'venus', destination: 'terra', duration: 355 }, // Vênus de volta à Terra (sobrevoo gravitacional)
                { origin: 'terra', destination: 'jupiter', duration: 677 }, // Terra a Júpiter (sobrevoo gravitacional)
                { origin: 'jupiter', destination: 'saturno', duration: 699 }, // Júpiter a Saturno
                { origin: 'saturno', destination: 'saturno', duration: 4759 } // Órbita de Saturno por 13 anos
            ],
            color: 0xffcc00,
            speed: 5.8,  // km/s em órbita de Saturno
            launchVehicle: 'Titan IVB/Centaur',
            objectives: [
                'Estudo detalhado de Saturno, seus anéis e magnetosfera',
                'Exploração das luas de Saturno, especialmente Titã e Encélado',
                'Pouso da sonda Huygens em Titã'
            ],
            achievements: [
                'Descoberta de oceanos subterrâneos em Encélado com ingredientes para vida',
                'Pouso bem-sucedido em Titã, revelando rios e lagos de metano',
                'Dados detalhados sobre a estrutura dos anéis de Saturno'
            ],
            link: 'https://solarsystem.nasa.gov/missions/cassini/overview/'
        },
        {
            id: 'juno',
            name: 'Juno',
            startDate: '2011-08-05',
            status: 'ativa',
            description: 'Sonda orbital estudando a composição, campo gravitacional e campo magnético de Júpiter. Utiliza painéis solares em vez de geradores termoelétricos de radioisótopos, sendo a espaçonave movida a energia solar mais distante do Sol.',
            type: 'ativa',
            trajectory: [
                { origin: 'terra', destination: 'terra', duration: 712 }, // Terra e volta (sobrevoo gravitacional)
                { origin: 'terra', destination: 'jupiter', duration: 967 } // Terra a Júpiter
            ],
            color: 0x0099cc,
            speed: 0.15,  // km/s em órbita de Júpiter
            launchVehicle: 'Atlas V',
            objectives: [
                'Estudo da composição e estrutura interna de Júpiter',
                'Análise do campo magnético e auroras',
                'Mapeamento detalhado da atmosfera'
            ],
            achievements: [
                'Descoberta de que a atmosfera de Júpiter é muito mais complexa e turbulenta que o esperado',
                'Dados precisos sobre a massa do núcleo do planeta',
                'Imagens espetaculares dos polos de Júpiter'
            ],
            link: 'https://www.nasa.gov/mission_pages/juno/main/index.html'
        },
        {
            id: 'parker',
            name: 'Parker Solar Probe',
            startDate: '2018-08-12',
            status: 'ativa',
            description: 'Missão para estudar a coroa solar de perto. Projetada para voar através da atmosfera exterior do Sol, chegando a aproximadamente 6,9 milhões de km da superfície solar - mais perto do que qualquer espaçonave anterior.',
            type: 'ativa',
            trajectory: [
                { origin: 'terra', destination: 'venus', duration: 52 }, // Terra a Vênus (primeiro sobrevoo)
                { origin: 'venus', destination: 'sol', duration: 95 }, // Primeiro periélio
                { origin: 'sol', destination: 'venus', duration: 98 }, // Segundo sobrevoo de Vênus
                // (Vários outros sobrevoos de Vênus e aproximações do Sol continuam)
            ],
            color: 0xff3300,
            speed: 430,  // km/s no periélio (máximo)
            launchVehicle: 'Delta IV Heavy',
            objectives: [
                'Investigar como a coroa solar é aquecida',
                'Determinar a estrutura e dinâmica dos campos magnéticos na fonte do vento solar',
                'Explorar mecanismos que aceleram partículas energéticas'
            ],
            achievements: [
                'Espaçonave mais rápida já construída',
                'Primeiro veículo a "tocar" o Sol',
                'Descobertas sobre estruturas magnéticas na coroa solar'
            ],
            link: 'https://www.nasa.gov/content/goddard/parker-solar-probe'
        },
        {
            id: 'artemis',
            name: 'Artemis',
            startDate: '2022-11-16',
            status: 'em andamento',
            description: 'Programa que visa levar a primeira mulher e o próximo homem à Lua até 2025. Artemis estabelecerá presença humana sustentável na Lua como preparação para futuras missões a Marte.',
            type: 'planejada',
            trajectory: [
                { origin: 'terra', destination: 'lua', duration: 6 }, // Terra à Lua (Artemis I - sem tripulação)
                { origin: 'lua', destination: 'terra', duration: 20 } // Lua à Terra
                // As próximas fases (Artemis II, III, etc.) serão adicionadas conforme forem definidas
            ],
            color: 0xff0066,
            speed: 39.5,  // km/s no retorno à Terra
            launchVehicle: 'Space Launch System (SLS)',
            objectives: [
                'Pouso de humanos no polo sul lunar',
                'Estabelecimento de base lunar sustentável',
                'Preparação para futuras missões a Marte',
                'Teste de novas tecnologias e habitação lunar'
            ],
            achievements: [
                'Artemis I: voo de teste bem-sucedido da cápsula Orion ao redor da Lua',
                'Desenvolvimento do Sistema de Lançamento Espacial (SLS), o foguete mais poderoso já construído',
                'Colaborações internacionais para exploração lunar sustentável'
            ],
            link: 'https://www.nasa.gov/specials/artemis/'
        },
        {
            id: 'mars2020',
            name: 'Mars 2020 (Perseverance)',
            startDate: '2020-07-30',
            status: 'ativa',
            description: 'Missão para buscar sinais de vida microbiana antiga em Marte, coletar amostras e testando tecnologias para uso humano futuro. Inclui o helicóptero Ingenuity, o primeiro veículo a voar em outro planeta.',
            type: 'ativa',
            trajectory: [
                { origin: 'terra', destination: 'marte', duration: 203 } // Terra a Marte
            ],
            color: 0xff3300,
            speed: 5.4,  // km/s
            launchVehicle: 'Atlas V-541',
            objectives: [
                'Busca por sinais de vida microbiana passada',
                'Coleta de amostras para retorno futuro à Terra',
                'Teste de tecnologia para produção de oxigênio a partir da atmosfera marciana',
                'Voos do helicóptero Ingenuity'
            ],
            achievements: [
                'Pouso bem-sucedido na Cratera Jezero',
                'Voos bem-sucedidos do helicóptero Ingenuity',
                'Primeira coleta e armazenamento de amostras marcianas para retorno futuro',
                'Produção de oxigênio a partir da atmosfera marciana'
            ],
            link: 'https://mars.nasa.gov/mars2020/'
        },
        {
            id: 'jwst',
            name: 'James Webb Space Telescope',
            startDate: '2021-12-25',
            status: 'ativa',
            description: 'O maior e mais poderoso telescópio espacial já lançado, projetado para observar objetos extremamente distantes no universo e estudar a formação das primeiras galáxias.',
            type: 'ativa',
            trajectory: [
                { origin: 'terra', destination: 'l2', duration: 29 } // Terra ao ponto Lagrange 2
            ],
            color: 0xffcc00,
            speed: 0.0,  // Em órbita estável no ponto L2
            launchVehicle: 'Ariane 5',
            objectives: [
                'Observação das primeiras galáxias formadas após o Big Bang',
                'Estudo da formação e evolução de galáxias',
                'Investigação da formação de estrelas e sistemas planetários',
                'Estudo de exoplanetas e busca por bioassinaturas'
            ],
            achievements: [
                'Implantação bem-sucedida do complexo sistema de proteção solar',
                'Imagens sem precedentes do universo primitivo',
                'Análise da atmosfera de exoplanetas',
                'Imagens detalhadas da nebulosa de Carina e outros objetos cósmicos'
            ],
            link: 'https://www.jwst.nasa.gov/'
        }
    ];
}

/**
 * Cria uma nova missão espacial
 * @param {Object} missionData - Dados da missão
 * @returns {Object} A missão criada
 */
function createMission(missionData) {
    // Criar contêiner para a missão
    const missionContainer = new THREE.Group();
    missionContainer.name = `mission-${missionData.id}`;
    
    // Criar trajetória
    createTrajectoryLine(missionContainer, missionData);
    
    // Criar modelo da nave (representado por um pequeno ponto brilhante)
    createSpacecraftModel(missionContainer, missionData);
    
    // Adicionar metadados
    missionContainer.userData = {
        missionId: missionData.id,
        name: missionData.name,
        startDate: missionData.startDate,
        type: missionData.type,
        description: missionData.description,
        status: missionData.status,
        progress: 0 // 0-1 para animação
    };
    
    // Adicionar à cena (invisível inicialmente)
    missionContainer.visible = false;
    missionsContainer.add(missionContainer);
    
    return missionContainer;
}

/**
 * Cria a linha de trajetória para uma missão
 * @param {THREE.Group} missionContainer - Contêiner da missão
 * @param {Object} missionData - Dados da missão
 */
function createTrajectoryLine(missionContainer, missionData) {
    // Gerar pontos da trajetória
    const trajectoryPoints = calculateTrajectoryPoints(missionData);
    
    // Criar a geometria
    const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    
    // Criar o material (usar linha tracejada para missões planejadas)
    const trajectoryMaterial = new THREE.LineBasicMaterial({
        color: missionData.color || 0xffffff,
        opacity: missionData.type === 'planejada' ? 0.7 : 0.9,
        transparent: true,
        linewidth: 2
    });
    
    // Criar a linha
    const trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
    trajectoryLine.name = 'trajectoryLine';
    
    // Adicionar ao contêiner da missão
    missionContainer.add(trajectoryLine);
}

/**
 * Calcula os pontos da trajetória de uma missão
 * @param {Object} missionData - Dados da missão
 * @returns {Array} Array de pontos THREE.Vector3
 */
function calculateTrajectoryPoints(missionData) {
    const points = [];
    
    // Para cada segmento de trajetória
    for (const segment of missionData.trajectory) {
        // Obter posições de origem e destino
        const originPosition = getObjectPosition(segment.origin);
        const destinationPosition = getObjectPosition(segment.destination);
        
        if (!originPosition || !destinationPosition) {
            console.warn(`Posições inválidas para trajetória: ${segment.origin} -> ${segment.destination}`);
            continue;
        }
        
        // Criar uma curva entre os dois pontos (com alguma curvatura para visualização)
        const segmentPoints = createCurvedSegment(originPosition, destinationPosition, MISSION_LINE_SEGMENTS);
        
        // Adicionar pontos ao array principal
        points.push(...segmentPoints);
    }
    
    return points;
}

/**
 * Cria um segmento de curva entre dois pontos
 * @param {THREE.Vector3} start - Ponto inicial
 * @param {THREE.Vector3} end - Ponto final
 * @param {number} segments - Número de segmentos
 * @returns {Array} Array de pontos THREE.Vector3
 */
function createCurvedSegment(start, end, segments) {
    const points = [];
    
    // Calcular o ponto de controle para a curva de Bezier
    // Adicionar alguma altura/curvatura ao caminho para não ser uma linha reta
    const distance = start.distanceTo(end);
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    
    // Adicionar um deslocamento perpendicular para criar uma curva
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
    perpendicular.multiplyScalar(distance * 0.3); // Ajustar curvatura com base na distância
    
    const controlPoint = midPoint.clone().add(perpendicular);
    
    // Criar uma curva quadrática de Bezier
    const curve = new THREE.QuadraticBezierCurve3(
        start,
        controlPoint,
        end
    );
    
    // Gerar pontos ao longo da curva
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const point = curve.getPoint(t);
        points.push(point);
    }
    
    return points;
}

/**
 * Cria um modelo de nave espacial para a missão
 * @param {THREE.Group} missionContainer - Contêiner da missão
 * @param {Object} missionData - Dados da missão
 */
function createSpacecraftModel(missionContainer, missionData) {
    // Criar um sprite para representar a nave
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createSpacecraftTexture(missionData.color || 0xffffff),
        color: missionData.color || 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const spacecraft = new THREE.Sprite(spriteMaterial);
    spacecraft.name = 'spacecraft';
    spacecraft.scale.set(2, 2, 1);
    
    // Posicionar no início da trajetória
    const trajectoryLine = missionContainer.getObjectByName('trajectoryLine');
    if (trajectoryLine && trajectoryLine.geometry.attributes.position.count > 0) {
        const firstPosition = new THREE.Vector3().fromBufferAttribute(
            trajectoryLine.geometry.attributes.position,
            0
        );
        spacecraft.position.copy(firstPosition);
    }
    
    // Adicionar ao contêiner da missão
    missionContainer.add(spacecraft);
}

/**
 * Cria uma textura para a nave espacial
 * @param {number} color - Cor da nave
 * @returns {THREE.Texture} Textura para o sprite
 */
function createSpacecraftTexture(color) {
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
    
    const hexColor = '#' + new THREE.Color(color).getHexString();
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, hexColor.replace(')', ', 0.8)'));
    gradient.addColorStop(0.5, hexColor.replace(')', ', 0.4)'));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adicionar uma pequena "cauda" para indicar a direção
    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(canvas.width / 4, canvas.height / 2);
    context.strokeStyle = hexColor.replace(')', ', 0.6)');
    context.lineWidth = 2;
    context.stroke();
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Obtém a posição de um objeto no sistema solar
 * @param {string} objectId - ID do objeto (planeta, lua, etc)
 * @returns {THREE.Vector3} Posição do objeto
 */
function getObjectPosition(objectId) {
    // Para objetos especiais
    if (objectId === 'sol') {
        return new THREE.Vector3(0, 0, 0);
    } else if (objectId === 'heliopausa') {
        return new THREE.Vector3(100, 0, 0); // Aproximação simplificada
    } else if (objectId === 'exteriorSolar') {
        return new THREE.Vector3(120, 30, 0); // Aproximação para fora do sistema solar
    } else if (objectId === 'l2') {
        // Ponto Lagrange 2 (simplificado) - a 1.5 milhões de km da Terra na direção oposta ao Sol
        const earthPosition = planetsRef.terra ? planetsRef.terra.position.clone() : new THREE.Vector3(1, 0, 0);
        const directionFromSun = earthPosition.clone().normalize();
        return earthPosition.clone().add(directionFromSun.multiplyScalar(0.01)); // Escala ajustada para visualização
    }
    
    // Para planetas e luas
    if (planetsRef[objectId]) {
        return planetsRef[objectId].position.clone();
    }
    
    // Se o objeto não for encontrado, retornar null
    console.warn(`Objeto não encontrado: ${objectId}`);
    return null;
}

/**
 * Ativa uma missão para visualização
 * @param {string} missionId - ID da missão
 * @returns {boolean} Sucesso da operação
 */
function activateMission(missionId) {
    // Verificar se a missão já está ativa
    if (activeMissions.find(m => m.userData.missionId === missionId)) {
        console.log(`Missão ${missionId} já está ativa`);
        return false;
    }
    
    // Encontrar o contêiner da missão
    const missionContainer = missionsContainer.getObjectByName(`mission-${missionId}`);
    if (!missionContainer) {
        console.warn(`Missão não encontrada: ${missionId}`);
        return false;
    }
    
    // Tornar visível
    missionContainer.visible = true;
    
    // Resetar progresso da animação
    missionContainer.userData.progress = 0;
    
    // Adicionar à lista de missões ativas
    activeMissions.push(missionContainer);
    
    console.log(`Missão ativada: ${missionId}`);
    return true;
}

/**
 * Desativa uma missão da visualização
 * @param {string} missionId - ID da missão
 * @returns {boolean} Sucesso da operação
 */
function deactivateMission(missionId) {
    // Encontrar o índice da missão
    const index = activeMissions.findIndex(m => m.userData.missionId === missionId);
    if (index === -1) {
        console.warn(`Missão não está ativa: ${missionId}`);
        return false;
    }
    
    // Remover da lista de missões ativas
    const missionContainer = activeMissions[index];
    activeMissions.splice(index, 1);
    
    // Tornar invisível
    missionContainer.visible = false;
    
    console.log(`Missão desativada: ${missionId}`);
    return true;
}

/**
 * Atualiza as missões ativas
 * @param {number} deltaTime - Tempo desde o último frame
 * @param {number} simulationSpeed - Velocidade da simulação
 */
export function updateMissions(deltaTime, simulationSpeed) {
    for (const mission of activeMissions) {
        // Atualizar o progresso da animação
        mission.userData.progress += deltaTime * simulationSpeed * 0.01;
        
        // Loop para missões ativas permanentes
        if (mission.userData.progress > 1) {
            if (mission.userData.status === 'ativa' || mission.userData.status === 'em andamento') {
                mission.userData.progress = 0;
            } else {
                mission.userData.progress = 1;
            }
        }
        
        // Atualizar a posição da nave na trajetória
        updateSpacecraftPosition(mission, mission.userData.progress);
    }
}

/**
 * Atualiza a posição da nave na trajetória
 * @param {THREE.Group} missionContainer - Contêiner da missão
 * @param {number} progress - Progresso da animação (0-1)
 */
function updateSpacecraftPosition(missionContainer, progress) {
    const spacecraft = missionContainer.getObjectByName('spacecraft');
    const trajectoryLine = missionContainer.getObjectByName('trajectoryLine');
    
    if (!spacecraft || !trajectoryLine || !trajectoryLine.geometry.attributes.position) {
        return;
    }
    
    // Obter o número de pontos na trajetória
    const numPoints = trajectoryLine.geometry.attributes.position.count;
    if (numPoints <= 1) return;
    
    // Calcular o índice do ponto na trajetória
    const pointIndex = Math.min(Math.floor(progress * (numPoints - 1)), numPoints - 2);
    const pointFraction = (progress * (numPoints - 1)) - pointIndex;
    
    // Obter os pontos atual e próximo
    const currentPos = new THREE.Vector3().fromBufferAttribute(
        trajectoryLine.geometry.attributes.position,
        pointIndex
    );
    
    const nextPos = new THREE.Vector3().fromBufferAttribute(
        trajectoryLine.geometry.attributes.position,
        pointIndex + 1
    );
    
    // Interpolar entre os pontos
    spacecraft.position.lerpVectors(currentPos, nextPos, pointFraction);
    
    // Atualizar o brilho com base na distância ao Sol
    const distanceToSun = spacecraft.position.length();
    const baseBrightness = 1.5;
    const brightness = baseBrightness / (1 + distanceToSun * 0.05);
    
    if (spacecraft.material) {
        spacecraft.material.opacity = brightness;
    }
}

/**
 * Define a visibilidade de todas as missões
 * @param {boolean} visible - Se as missões devem estar visíveis ou não
 */
function setAllMissionsVisible(visible) {
    // Primeiro, definir a visibilidade do container principal
    if (missionsContainer) {
        missionsContainer.visible = visible;
    }
    
    if (!visible) {
        // Desativar todas as missões ativas quando desligar a visibilidade
        const missionsToDeactivate = [...activeMissions]; // Criar cópia para evitar problemas ao modificar a array original
        missionsToDeactivate.forEach(mission => {
            deactivateMission(mission.userData.missionId);
        });
        
        // Garantir que TODAS as missões estejam invisíveis (mesmo as que não estavam ativas)
        missionsContainer.traverse(object => {
            if (object.name && object.name.startsWith('mission-')) {
                object.visible = false;
            }
        });
        
        console.log('Todas as missões foram desativadas e ocultadas');
    } else {
        // Quando reativar, apenas tornar o container visível, 
        // mas as missões individuais permanecem ocultas até serem explicitamente ativadas
        console.log('Container de missões agora está visível');
        // As missões individuais só ficam visíveis quando ativadas explicitamente pelo usuário
    }
    
    return visible;
} 