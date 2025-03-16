/**
 * Sistema de física avançada - Gravidade Real
 * Implementa a Lei da Gravitação Universal de Newton para simular interações gravitacionais
 * entre os corpos celestes do sistema solar.
 */

// Constante gravitacional universal (valor ajustado para a escala do simulador)
const G = 6.67430e-11 * 1e3; // Ajustada para proporcionar efeitos visíveis na simulação

// Estado da física avançada
let physicsEnabled = false;
let gravitationalStrength = 1.0; // Fator de intensidade (0-2, onde 1 é o valor real)

// Valores de massa para os corpos celestes (em kg, escala ajustada para a simulação)
const CELESTIAL_MASSES = {
    sol: 1.989e30 * 1e-24,      // Massa do Sol
    mercurio: 3.3011e23 * 1e-24, // Massa de Mercúrio
    venus: 4.8675e24 * 1e-24,    // Massa de Vênus
    terra: 5.972e24 * 1e-24,     // Massa da Terra
    marte: 6.417e23 * 1e-24,     // Massa de Marte
    jupiter: 1.898e27 * 1e-24,   // Massa de Júpiter
    saturno: 5.683e26 * 1e-24,   // Massa de Saturno
    urano: 8.681e25 * 1e-24,     // Massa de Urano
    netuno: 1.024e26 * 1e-24,    // Massa de Netuno
    lua: 7.342e22 * 1e-24,       // Massa da Lua
    // Outras luas principais
    io: 8.932e22 * 1e-24,
    europa: 4.8e22 * 1e-24,
    ganimedes: 1.482e23 * 1e-24,
    calisto: 1.076e23 * 1e-24,
    titan: 1.345e23 * 1e-24
};

// Velocidades e posições atuais dos planetas
let planetVelocities = {};
let planetPositions = {};

/**
 * Inicializa o sistema de física com gravidade
 * @param {Object} planets - Objeto contendo referências aos corpos celestes
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
export function initGravityPhysics(planets, PLANET_DATA) {
    console.log('Inicializando sistema de física avançada - Gravidade Real');
    
    // Inicializar as velocidades com base nas velocidades orbitais atuais
    for (const planetName in planets) {
        if (planetName === 'sol') continue; // O Sol é fixo no nosso modelo
        
        const planet = planets[planetName];
        let planetData;
        
        // Verificar se é um planeta regular ou um objeto do Cinturão de Kuiper
        if (PLANET_DATA[planetName]) {
            // Planeta regular
            planetData = PLANET_DATA[planetName];
        } else if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
            // Tentar encontrar nos planetas anões do Cinturão de Kuiper
            const dwarfPlanet = PLANET_DATA.cinturaoKuiper.planetasAnoes.find(p => p.id === planetName);
            if (dwarfPlanet) {
                planetData = dwarfPlanet;
            } else {
                console.warn(`Dados não encontrados para o objeto: ${planetName}`);
                continue; // Pular este objeto se não encontrar dados
            }
        } else {
            console.warn(`Dados não encontrados para o objeto: ${planetName}`);
            continue; // Pular este objeto se não encontrar dados
        }
        
        // Obter a posição atual do planeta
        const position = new THREE.Vector3();
        planet.getWorldPosition(position);
        
        // Calcular a direção da velocidade orbital (perpendicular ao raio)
        const toSun = new THREE.Vector3(0, 0, 0).sub(position).normalize();
        const perpendicular = new THREE.Vector3(-toSun.z, 0, toSun.x).normalize();
        
        // Magnitude da velocidade orbital
        const orbitalSpeed = planetData.orbitalSpeed || 0.01;
        
        // Velocidade inicial = direção perpendicular * velocidade orbital
        const velocity = perpendicular.multiplyScalar(orbitalSpeed * 0.1); // Escala para evitar movimentos muito rápidos
        
        // Armazenar posição e velocidade iniciais
        planetVelocities[planetName] = velocity;
        planetPositions[planetName] = position.clone();
        
        console.log(`Gravidade: Inicializado ${planetName} - Velocidade: (${velocity.x.toFixed(4)}, ${velocity.y.toFixed(4)}, ${velocity.z.toFixed(4)})`);
    }
    
    // Inicializar luas principais, se existirem
    for (const planetName in planets) {
        const planet = planets[planetName];
        
        if (planet.children) {
            planet.children.forEach(child => {
                if (child.userData && child.userData.isMoon) {
                    const moonName = child.name;
                    const moonData = findMoonData(PLANET_DATA, planetName, moonName);
                    
                    if (moonData) {
                        // Obter posição relativa da lua
                        const moonPosition = new THREE.Vector3();
                        child.getWorldPosition(moonPosition);
                        
                        // Obter a posição do planeta pai
                        const planetPosition = new THREE.Vector3();
                        planet.getWorldPosition(planetPosition);
                        
                        // Calcular a direção da lua ao planeta
                        const toParent = planetPosition.clone().sub(moonPosition).normalize();
                        
                        // Direção perpendicular (para órbita circular)
                        const perpendicular = new THREE.Vector3(-toParent.z, 0, toParent.x).normalize();
                        
                        // Velocidade orbital da lua
                        const orbitalSpeed = moonData.orbitalSpeed || 0.02;
                        
                        // Calcular velocidade
                        const velocity = perpendicular.multiplyScalar(orbitalSpeed * 0.1);
                        
                        // Armazenar velocidade e posição
                        const fullName = `${planetName}_${moonName}`;
                        planetVelocities[fullName] = velocity;
                        planetPositions[fullName] = moonPosition.clone();
                        
                        console.log(`Gravidade: Inicializado ${fullName} - Velocidade: (${velocity.x.toFixed(4)}, ${velocity.y.toFixed(4)}, ${velocity.z.toFixed(4)})`);
                    }
                }
            });
        }
    }
}

/**
 * Atualiza as posições dos corpos celestes com base na gravitação universal
 * @param {Object} planets - Objeto contendo referências aos corpos celestes
 * @param {Number} deltaTime - Tempo decorrido desde o último quadro
 * @param {Number} timeScale - Escala de tempo da simulação
 * @returns {Object} Objeto contendo as posições e velocidades atualizadas
 */
export function updateGravityPhysics(planets, deltaTime, timeScale) {
    if (!physicsEnabled) return { positions: {}, velocities: {} };
    
    // Fator de escala de tempo para a simulação
    const scaledDeltaTime = deltaTime * timeScale * 1000; // Escalar para ter efeitos visíveis
    
    // Calcular forças gravitacionais
    const forces = calculateGravitationalForces(planets);
    
    // Atualizar velocidades e posições
    for (const objectName in forces) {
        // Ignorar o Sol, que permanece estático no nosso modelo
        if (objectName === 'sol') continue;
        
        // Vetor de força resultante
        const force = forces[objectName];
        
        // Determinar se é um planeta ou uma lua
        let object;
        let mass;
        
        if (objectName.includes('_')) {
            // É uma lua
            const [planetName, moonName] = objectName.split('_');
            object = planets[planetName].children.find(child => child.name === moonName);
            mass = CELESTIAL_MASSES[moonName] || CELESTIAL_MASSES.lua / 10; // Valor padrão se não estiver especificado
        } else {
            // É um planeta
            object = planets[objectName];
            mass = CELESTIAL_MASSES[objectName] || CELESTIAL_MASSES.terra / 10; // Valor padrão se não estiver especificado
        }
        
        if (!object) continue;
        
        // Velocidade atual
        const velocity = planetVelocities[objectName] || new THREE.Vector3(0, 0, 0);
        
        // Aplicar a Lei de Newton: F = m * a, ou a = F / m
        const acceleration = force.divideScalar(mass);
        
        // v = v0 + a * t
        velocity.add(acceleration.multiplyScalar(scaledDeltaTime * gravitationalStrength));
        
        // Atualizar a velocidade no objeto
        planetVelocities[objectName] = velocity;
        
        // Obter posição atual
        const position = planetPositions[objectName] || new THREE.Vector3();
        
        // x = x0 + v * t
        position.add(velocity.clone().multiplyScalar(scaledDeltaTime));
        
        // Atualizar a posição no objeto
        planetPositions[objectName] = position;
        
        // Aplicar a nova posição ao objeto 3D
        object.position.copy(position);
    }
    
    // Retornar posições e velocidades atualizadas para uso por outros sistemas
    return {
        positions: Object.assign({}, planetPositions),
        velocities: Object.assign({}, planetVelocities)
    };
}

/**
 * Calcula as forças gravitacionais entre todos os corpos celestes
 * @param {Object} planets - Objeto contendo referências aos corpos celestes
 * @returns {Object} - Forças resultantes para cada corpo celeste
 */
function calculateGravitationalForces(planets) {
    // Objeto para armazenar forças resultantes
    const forces = {};
    
    // Inicializar forças como vetores zero
    for (const planetName in planets) {
        forces[planetName] = new THREE.Vector3(0, 0, 0);
        
        // Inicializar forças para luas
        const planet = planets[planetName];
        if (planet.children) {
            planet.children.forEach(child => {
                if (child.userData && child.userData.isMoon) {
                    const fullName = `${planetName}_${child.name}`;
                    forces[fullName] = new THREE.Vector3(0, 0, 0);
                }
            });
        }
    }
    
    // Lista de todos os objetos para iterar (planetas e luas)
    const allObjects = [];
    
    // Adicionar planetas à lista
    for (const planetName in planets) {
        const planet = planets[planetName];
        
        allObjects.push({
            name: planetName,
            object: planet,
            mass: CELESTIAL_MASSES[planetName] || CELESTIAL_MASSES.terra / 10,
            position: planetPositions[planetName] || new THREE.Vector3().copy(planet.position)
        });
        
        // Adicionar luas à lista
        if (planet.children) {
            planet.children.forEach(child => {
                if (child.userData && child.userData.isMoon) {
                    const moonName = child.name;
                    const fullName = `${planetName}_${moonName}`;
                    
                    allObjects.push({
                        name: fullName,
                        object: child,
                        mass: CELESTIAL_MASSES[moonName] || CELESTIAL_MASSES.lua / 10,
                        position: planetPositions[fullName] || new THREE.Vector3().copy(child.position)
                    });
                }
            });
        }
    }
    
    // Calcular forças entre cada par de objetos
    for (let i = 0; i < allObjects.length; i++) {
        const obj1 = allObjects[i];
        
        for (let j = i + 1; j < allObjects.length; j++) {
            const obj2 = allObjects[j];
            
            // Vetor distância do obj1 ao obj2
            const direction = obj2.position.clone().sub(obj1.position);
            
            // Distância ao quadrado (para Lei de Newton)
            const distanceSquared = direction.lengthSq();
            
            // Evitar divisão por zero ou valores muito pequenos
            if (distanceSquared < 0.01) continue;
            
            // Normalizar o vetor direção
            const distance = Math.sqrt(distanceSquared);
            direction.normalize();
            
            // Calcular força gravitacional: F = G * (m1 * m2) / r²
            const forceMagnitude = G * (obj1.mass * obj2.mass) / distanceSquared;
            
            // Criar os vetores de força para cada objeto
            const forceOnObj1 = direction.clone().multiplyScalar(forceMagnitude);
            const forceOnObj2 = direction.clone().multiplyScalar(-forceMagnitude);
            
            // Adicionar às forças resultantes
            forces[obj1.name].add(forceOnObj1);
            forces[obj2.name].add(forceOnObj2);
        }
    }
    
    return forces;
}

/**
 * Ativa ou desativa o sistema de física avançada
 * @param {Boolean} enabled - Indica se a física deve estar ativa
 */
export function setPhysicsEnabled(enabled) {
    physicsEnabled = enabled;
    console.log(`Sistema de física avançada: ${enabled ? 'Ativado' : 'Desativado'}`);
    return physicsEnabled;
}

/**
 * Verifica se o sistema de física avançada está ativo
 * @returns {Boolean} - Estado atual da física avançada
 */
export function isPhysicsEnabled() {
    return physicsEnabled;
}

/**
 * Define a intensidade da força gravitacional
 * @param {Number} strength - Fator de intensidade (0-2)
 */
export function setGravitationalStrength(strength) {
    gravitationalStrength = Math.max(0, Math.min(2, strength));
    console.log(`Intensidade gravitacional ajustada para: ${gravitationalStrength.toFixed(2)}`);
    return gravitationalStrength;
}

/**
 * Obtém a intensidade atual da força gravitacional
 * @returns {Number} - Intensidade atual
 */
export function getGravitationalStrength() {
    return gravitationalStrength;
}

/**
 * Reseta as órbitas para seus valores Keplerianos originais
 * @param {Object} planets - Objeto contendo referências aos corpos celestes
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
export function resetOrbits(planets, PLANET_DATA) {
    console.log('Resetando órbitas para valores Keplerianos');
    
    // Resetar planetas
    for (const planetName in planets) {
        if (planetName === 'sol') continue;
        
        const planet = planets[planetName];
        let planetData;
        
        // Verificar se é um planeta regular ou um objeto do Cinturão de Kuiper
        if (PLANET_DATA[planetName]) {
            // Planeta regular
            planetData = PLANET_DATA[planetName];
        } else if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
            // Tentar encontrar nos planetas anões do Cinturão de Kuiper
            const dwarfPlanet = PLANET_DATA.cinturaoKuiper.planetasAnoes.find(p => p.id === planetName);
            if (dwarfPlanet) {
                planetData = dwarfPlanet;
            } else {
                console.warn(`Dados não encontrados para resetar órbita: ${planetName}`);
                continue; // Pular este objeto se não encontrar dados
            }
        } else {
            console.warn(`Dados não encontrados para resetar órbita: ${planetName}`);
            continue; // Pular este objeto se não encontrar dados
        }
        
        // Calcular posição inicial
        const distance = planetData.distance || 10;
        const angle = Math.random() * Math.PI * 2;
        
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        // Resetar posição
        planet.position.set(x, 0, z);
        
        // Recalcular velocidade orbital inicial
        const toSun = new THREE.Vector3(0, 0, 0).sub(planet.position).normalize();
        const perpendicular = new THREE.Vector3(-toSun.z, 0, toSun.x).normalize();
        
        const orbitalSpeed = planetData.orbitalSpeed || 0.01;
        const velocity = perpendicular.multiplyScalar(orbitalSpeed * 0.1);
        
        // Atualizar dados
        planetVelocities[planetName] = velocity;
        planetPositions[planetName] = planet.position.clone();
        
        // Resetar luas, se existirem
        if (planet.children) {
            planet.children.forEach(child => {
                if (child.userData && child.userData.isMoon) {
                    resetMoon(child, planet, planetName, PLANET_DATA);
                }
            });
        }
    }
}

/**
 * Reseta a posição e velocidade de uma lua
 * @param {Object} moon - Objeto da lua
 * @param {Object} planet - Objeto do planeta pai
 * @param {String} planetName - Nome do planeta pai
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
function resetMoon(moon, planet, planetName, PLANET_DATA) {
    const moonName = moon.name;
    const moonData = findMoonData(PLANET_DATA, planetName, moonName);
    
    if (!moonData) return;
    
    // Calcular posição inicial
    const distance = moonData.distance || 1;
    const angle = Math.random() * Math.PI * 2;
    
    const x = distance;
    const z = 0;
    
    // Resetar posição relativa ao planeta
    moon.position.set(x, 0, z);
    
    // Calcular velocidade orbital inicial
    const orbitalSpeed = moonData.orbitalSpeed || 0.02;
    const velocity = new THREE.Vector3(0, 0, orbitalSpeed * 0.1);
    
    // Atualizar dados
    const fullName = `${planetName}_${moonName}`;
    planetVelocities[fullName] = velocity;
    
    // A posição mundial será calculada no próximo quadro
    const worldPosition = new THREE.Vector3();
    moon.getWorldPosition(worldPosition);
    planetPositions[fullName] = worldPosition;
}

/**
 * Encontra os dados de uma lua nos dados dos planetas
 * @param {Object} PLANET_DATA - Dados dos planetas
 * @param {String} planetName - Nome do planeta pai
 * @param {String} moonName - Nome da lua
 * @returns {Object|null} - Dados da lua ou null se não encontrada
 */
function findMoonData(PLANET_DATA, planetName, moonName) {
    // Verificar se é um planeta regular
    const planet = PLANET_DATA[planetName];
    
    if (planet && planet.satellites) {
        const moon = planet.satellites.find(moon => moon.name === moonName);
        if (moon) return moon;
    }
    
    // Se não encontrou ou não é um planeta regular, procurar em planetas anões
    if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
        const dwarfPlanet = PLANET_DATA.cinturaoKuiper.planetasAnoes.find(p => p.id === planetName);
        
        if (dwarfPlanet && dwarfPlanet.satellites) {
            const moon = dwarfPlanet.satellites.find(moon => moon.name === moonName);
            if (moon) return moon;
        }
    }
    
    // Não encontrou em nenhum lugar
    return null;
} 