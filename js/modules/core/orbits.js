/**
 * Sistema de órbitas para planetas e luas
 * Gerencia a criação e movimento nas órbitas
 */

// Variáveis para órbitas
let orbits = {};

/**
 * Ajusta as velocidades orbitais dos planetas segundo a Lei de Kepler
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
export function ajustarVelocidadesKeplerianas(PLANET_DATA) {
    // T² ∝ a³ (onde T é período orbital e a é semi-eixo maior)
    // Usamos a Terra como referência
    const terrestreSemiMajorAxis = PLANET_DATA.terra.semiMajorAxis;
    const terrestreOrbitalSpeed = PLANET_DATA.terra.orbitalSpeed;
    
    for (const planetName in PLANET_DATA) {
        if (planetName === 'sol' || planetName === 'terra') continue;
        
        const planeta = PLANET_DATA[planetName];
        if (planeta.semiMajorAxis) {
            // Calcular nova velocidade orbital usando a 3ª Lei de Kepler
            // v ∝ 1/√a (velocidade é inversamente proporcional à raiz quadrada do semi-eixo maior)
            const fatorVelocidade = Math.sqrt(terrestreSemiMajorAxis / planeta.semiMajorAxis);
            planeta.orbitalSpeed = terrestreOrbitalSpeed * fatorVelocidade;
            
            console.log(`Velocidade orbital de ${planetName} ajustada para: ${planeta.orbitalSpeed.toExponential(3)}`);
        }
    }
}

/**
 * Cria a órbita visual para um planeta
 * @param {Object} scene - Cena Three.js
 * @param {String} planetName - Nome do planeta
 * @param {Object} planetData - Dados do planeta
 * @returns {Object|null} - Parâmetros da órbita ou null
 */
export function createPlanetOrbit(scene, planetName, planetData) {
    // Verificar se o planeta tem órbita elíptica
    if (planetData.eccentricity) {
        // Calculando parâmetros da elipse
        const a = planetData.semiMajorAxis;  // Semi-eixo maior
        const c = a * planetData.eccentricity; // Distância focal
        const b = Math.sqrt(a * a - c * c);  // Semi-eixo menor
        
        // Criar a curva da órbita com alta resolução para todos os planetas
        // Um número maior de pontos garante uma órbita mais suave e precisa
        let numPoints = 500;
        
        // Para planetas mais distantes ou com órbitas mais complexas, usar ainda mais pontos
        if (planetName === 'saturno' || planetName === 'urano' || 
            planetName === 'netuno' || planetName === 'jupiter') {
            numPoints = 800;
        }
        
        const curve = new THREE.EllipseCurve(
            c, 0,             // Centro da elipse (x,y) - Deslocado para o foco
            a, b,             // Semi-eixos maior e menor
            0, 2 * Math.PI,   // Ângulos inicial e final (radianos)
            false,            // Sentido anti-horário
            0                 // Rotação inicial
        );
        
        const points = curve.getPoints(numPoints);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Definir largura da linha baseada na distância
        const lineWidth = 1;
        
        // Ajustar cor e opacidade para planetas específicos
        let orbitColor = planetData.orbitColor || 0x444444;
        let orbitOpacity = 0.7; // Aumentar a opacidade padrão para melhor visualização
        
        // Tratamento especial para planetas específicos
        if (planetName === 'mercurio') {
            orbitOpacity = 0.8;
            orbitColor = 0xdddddd;
        } else if (planetName === 'saturno') {
            orbitOpacity = 0.9;
        } else if (planetName === 'urano') {
            orbitOpacity = 0.9;
        }
        
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: orbitColor,
            transparent: true,
            opacity: orbitOpacity,
            linewidth: lineWidth
        });
        
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        
        // Aplicar inclinação da órbita se especificada
        orbit.rotation.x = Math.PI / 2;  // Rotacionar para ficar no plano XZ
        if (planetData.inclination) {
            orbit.rotation.z = THREE.MathUtils.degToRad(planetData.inclination);
        }
        
        scene.add(orbit);
        orbits[planetName] = orbit;
        
        // Retornar os parâmetros da elipse para uso na animação
        return {
            a: a,
            b: b,
            c: c,
            inclination: planetData.inclination || 0
        };
    } else {
        // Criar órbita circular para compatibilidade com código existente
        const orbitGeometry = new THREE.RingGeometry(
            planetData.distance - 0.1, 
            planetData.distance + 0.1, 
            64
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits[planetName] = orbit;
        
        return null;
    }
}

/**
 * Cria órbita visual elíptica para uma lua
 * @param {Object} planet - Planeta pai
 * @param {Object} satellite - Dados do satélite
 * @param {Number} a - Semi-eixo maior
 * @param {Number} b - Semi-eixo menor
 * @param {Number} c - Distância focal
 */
export function createMoonOrbit(planet, satellite, a, b, c) {
    const curve = new THREE.EllipseCurve(
        c, 0,  // Centro (deslocado para o foco)
        a, b,  // Semi-eixos
        0, 2 * Math.PI,
        false,
        0
    );
    
    const points = curve.getPoints(50);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.3
    });
    
    const moonOrbit = new THREE.Line(orbitGeometry, orbitMaterial);
    moonOrbit.rotation.x = Math.PI / 2;  // Rotacionar para ficar no plano XZ, mesmo plano do movimento da lua
    
    // Adicionar propriedade para identificar o objeto como uma órbita lunar
    moonOrbit.userData = { isMoonOrbit: true };
    
    planet.add(moonOrbit);
}

/**
 * Cria órbita visual circular para uma lua
 * @param {Object} planet - Planeta pai
 * @param {Number} distance - Distância da lua ao planeta
 */
export function createMoonOrbitCircular(planet, distance) {
    const orbitGeometry = new THREE.RingGeometry(
        distance - 0.02, 
        distance + 0.02, 
        32
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    
    const moonOrbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    moonOrbit.rotation.x = Math.PI / 2;
    
    // Adicionar propriedade para identificar o objeto como uma órbita lunar
    moonOrbit.userData = { isMoonOrbit: true };
    
    planet.add(moonOrbit);
}

/**
 * Atualiza as posições dos planetas em suas órbitas
 * @param {Object} planets - Objetos dos planetas
 * @param {Number} simulationSpeed - Velocidade da simulação
 */
export function updatePlanetPositions(planets, simulationSpeed) {
    // Animar cada planeta
    for (const planetName in planets) {
        if (planetName === 'sol') continue;
        
        const planet = planets[planetName];
        const userData = planet.userData;
        
        if (userData) {
            // Atualizar ângulo orbital considerando o fator de velocidade da simulação
            // Usar um incremento menor para movimento mais suave
            const angleIncrement = userData.orbitalSpeed * simulationSpeed;
            userData.angle = (userData.angle + angleIncrement) % (2 * Math.PI);
            
            // Mover o planeta em sua órbita
            if (userData.a && userData.b && userData.c) {
                // Equação paramétrica da elipse
                const angle = userData.angle;
                
                // Calcular a posição no plano da elipse
                const x = userData.a * Math.cos(angle) - userData.c;
                const z = userData.b * Math.sin(angle);
                
                // Aplicar a inclinação de maneira consistente com a órbita visual
                if (userData.inclination) {
                    const inclRad = THREE.MathUtils.degToRad(userData.inclination);
                    
                    // Método único e consistente para todos os planetas
                    // Calcular a posição no plano XZ e depois aplicar inclinação
                    const y = z * Math.sin(inclRad);
                    const newZ = z * Math.cos(inclRad);
                    
                    // Usar lerp para transição suave entre posições para evitar "pulos"
                    const newPosition = new THREE.Vector3(x, y, newZ);
                    planet.position.lerp(newPosition, 0.1);
                } else {
                    // Para planetas sem inclinação
                    const newPosition = new THREE.Vector3(x, 0, z);
                    planet.position.lerp(newPosition, 0.1);
                }
            } else {
                // Modo circular para compatibilidade
                const newX = Math.cos(userData.angle) * userData.distance;
                const newZ = Math.sin(userData.angle) * userData.distance;
                const newPosition = new THREE.Vector3(newX, 0, newZ);
                planet.position.lerp(newPosition, 0.1);
            }
            
            // Rotação do planeta com fator de velocidade da simulação
            planet.rotation.y += userData.rotationSpeed * simulationSpeed;
            
            // Tratamento especial para Saturno (mantém os anéis estáveis)
            if (userData.hasRings) {
                // Ajustar a orientação do contêiner de anéis para manter sempre o mesmo ângulo global
                const ringsContainer = planet.children.find(child => 
                    child.children.length > 0 && 
                    child.children[0].geometry && 
                    child.children[0].geometry.type === 'RingGeometry'
                );
                if (ringsContainer) {
                    // Compensar a rotação do planeta para manter os anéis estáveis
                    ringsContainer.rotation.y = -planet.rotation.y;
                }
            }
            
            // Animar luas com fator de velocidade da simulação
            planet.children.forEach(child => {
                if (child.userData && (child.userData.orbitalSpeed || child.userData.isElliptical)) {
                    // Atualizar ângulo orbital da lua com fator de velocidade
                    child.userData.angle = (child.userData.angle + child.userData.orbitalSpeed * simulationSpeed) % (2 * Math.PI);
                    
                    // Verificar se a lua tem órbita elíptica
                    if (child.userData.isElliptical) {
                        const angle = child.userData.angle;
                        const a = child.userData.a;
                        const b = child.userData.b;
                        const c = child.userData.c;
                        
                        // Posição na elipse - uso do mesmo cálculo da órbita visual
                        const newX = a * Math.cos(angle) - c;
                        const newZ = b * Math.sin(angle);
                        const newPosition = new THREE.Vector3(newX, 0, newZ);
                        
                        // Transição suave para evitar piscadas
                        child.position.lerp(newPosition, 0.1);
                    } else {
                        // Atualizar posição da lua em órbita circular com transição suave
                        const newX = Math.cos(child.userData.angle) * child.userData.distance;
                        const newZ = Math.sin(child.userData.angle) * child.userData.distance;
                        const newPosition = new THREE.Vector3(newX, 0, newZ);
                        
                        // Transição suave para evitar piscadas
                        child.position.lerp(newPosition, 0.1);
                    }
                    
                    // Rotação da lua com fator de velocidade
                    child.rotation.y += child.userData.rotationSpeed * simulationSpeed;
                }
            });
        }
    }
}

/**
 * Verifica e corrige o alinhamento orbital dos planetas
 * @param {Object} planets - Objetos dos planetas
 * @param {Object} orbits - Objetos das órbitas
 */
export function validatePlanetOrbits(planets, orbits) {
    // Remover verificação específica para determinados planetas
    // Tratar todos os planetas de forma consistente
    
    for (const planetName in planets) {
        if (planetName === 'sol') continue;
        
        const planet = planets[planetName];
        const orbit = orbits[planetName];
        
        if (planet && orbit && planet.userData) {
            // Apenas inicializar posições, não forçar mudanças abruptas
            // Isso evita que a validação cause piscadas
            const userData = planet.userData;
            
            if (userData.a && userData.b && userData.c) {
                const angle = userData.angle;
                const x = userData.a * Math.cos(angle) - userData.c;
                const z = userData.b * Math.sin(angle);
                
                if (userData.inclination) {
                    const inclRad = THREE.MathUtils.degToRad(userData.inclination);
                    const y = z * Math.sin(inclRad);
                    const newZ = z * Math.cos(inclRad);
                    
                    // Apenas definir valores iniciais não usando lerp ou outras técnicas que
                    // poderiam causar transições bruscas
                    if (planetName === 'saturno' || planetName === 'urano') {
                        // Tratamento específico, mas sem forçar worldToLocal/localToWorld
                        // que poderia causar piscadas
                        planet.position.set(x, z * Math.sin(inclRad), z * Math.cos(inclRad));
                    } else {
                        planet.position.set(x, y, newZ);
                    }
                } else {
                    planet.position.set(x, 0, z);
                }
            }
        }
    }
}

/**
 * Controla a visibilidade das órbitas
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleOrbitsVisibility(visible) {
    for (const planetName in orbits) {
        if (orbits.hasOwnProperty(planetName)) {
            orbits[planetName].visible = visible;
        }
    }
}

/**
 * Retorna o objeto de órbitas
 * @returns {Object} Objeto com todas as órbitas
 */
export function getOrbits() {
    return orbits;
} 