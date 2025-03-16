/**
 * Sistema de criação e gerenciamento dos corpos celestes
 * Cria o sol, planetas e luas com suas respectivas texturas
 */

import { createPlanetOrbit, createMoonOrbit, createMoonOrbitCircular } from './orbits.js';

// Variáveis para planetas
let planets = {};

/**
 * Cria o Sol, planetas e luas com suas texturas
 * @param {Object} scene - Cena Three.js
 * @param {Object} PLANET_DATA - Dados dos planetas
 * @returns {Object} Objeto contendo os planetas criados
 */
export function createCelestialBodies(scene, PLANET_DATA) {
    // Texturas temporárias até baixarmos as reais
    const textureLoader = new THREE.TextureLoader();
    
    // Criar o Sol
    const solGeometry = new THREE.SphereGeometry(PLANET_DATA.sol.radius, 32, 32);
    
    // Material mais realista para o sol com brilho próprio
    const solMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd33,
        emissive: 0xffdd33,
        emissiveIntensity: 1
    });
    
    // Tentar carregar a textura do sol
    textureLoader.load(
        PLANET_DATA.sol.textureUrl,
        function(texture) {
            solMaterial.map = texture;
            solMaterial.needsUpdate = true;
        },
        undefined,
        function(err) {
            console.log('Usando material básico para o Sol devido a erro na textura:', err);
            // Já estamos usando um material básico como fallback
        }
    );
    
    const sol = new THREE.Mesh(solGeometry, solMaterial);
    sol.name = "sol";
    scene.add(sol);
    planets.sol = sol;
    
    // Adicionar dados para rotação do sol
    sol.userData = {
        rotationSpeed: PLANET_DATA.sol.rotationSpeed || 0.004,
        radius: PLANET_DATA.sol.radius
    };
    
    // Criar uma luz no sol
    const solLight = new THREE.PointLight(0xffffcc, 1.5, 300);
    sol.add(solLight);
    
    // Adicionar glow ao redor do sol
    createSunGlow(sol, scene);
    
    // Para garantir consistência, usamos um ângulo fixo para cada planeta
    // em vez de ângulos aleatórios
    const planetInitialAngles = {
        mercurio: 0,
        venus: Math.PI / 6,
        terra: Math.PI / 3,
        marte: Math.PI / 2,
        jupiter: 2 * Math.PI / 3,
        saturno: 5 * Math.PI / 6,
        urano: Math.PI,
        netuno: 4 * Math.PI / 3
    };
    
    // Criar cada planeta
    for (const planetName in PLANET_DATA) {
        if (planetName === 'sol') continue; // Sol já foi criado
        
        const planetData = PLANET_DATA[planetName];
        
        // Definir cores iniciais para cada planeta
        const planetDefaultColors = {
            mercurio: 0xa9a9a9, // Cinza escuro
            venus: 0xe6c073,    // Amarelo dourado
            terra: 0x2F6CA2,    // Azul
            marte: 0xaa4200,    // Vermelho alaranjado
            jupiter: 0xd8ca9d,  // Bege claro
            saturno: 0xead6a9,  // Amarelo claro
            urano: 0x82b3d1,    // Azul claro
            netuno: 0x3f54ba    // Azul escuro
        };
        
        // Cor padrão para o planeta atual
        const planetColor = planetDefaultColors[planetName] || 0x808080;
        
        // Criar geometria do planeta
        const planetGeometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({
            color: planetColor,
            roughness: 0.7,
            metalness: 0
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.name = planetName;
        
        // Usar um ângulo fixo para cada planeta
        const angle = planetInitialAngles[planetName] || Math.random() * Math.PI * 2;
        
        // Criar a órbita visual e obter seus parâmetros
        const orbitParams = createPlanetOrbit(scene, planetName, planetData);
        
        // Posicionar o planeta
        planet.position.x = Math.cos(angle) * planetData.distance;
        planet.position.z = Math.sin(angle) * planetData.distance;
        
        // Inclinação do planeta (se definida)
        if (planetData.inclination) {
            planet.rotation.x = THREE.MathUtils.degToRad(planetData.inclination);
        }
        
        // Adicionar dados para a rotação e a órbita
        planet.userData = {
            angle: angle,
            distance: planetData.distance,
            rotationSpeed: planetData.rotationSpeed || 0.01,
            orbitalSpeed: planetData.orbitalSpeed || 0.005,
            semiMajorAxis: planetData.semiMajorAxis || planetData.distance,
            eccentricity: planetData.eccentricity || 0,
            radius: planetData.radius
        };
        
        scene.add(planet);
        planets[planetName] = planet;
        
        // Adicionar anéis para Saturno
        if (planetData.rings) {
            createSaturnRings(planet, planetData);
        }
        
        // Adicionar satélites (luas)
        if (planetData.satellites) {
            planetData.satellites.forEach(satellite => {
                createMoon(planet, satellite);
            });
        }
    }
    
    // Tentar carregar texturas
    loadTextures(PLANET_DATA);
    
    return planets;
}

/**
 * Cria os anéis de Saturno
 * @param {Object} planet - Objeto do planeta Saturno
 * @param {Object} planetData - Dados do planeta Saturno
 */
function createSaturnRings(planet, planetData) {
    // Criar um container para os anéis
    const ringsContainer = new THREE.Object3D();
    ringsContainer.name = "aneisSaturnoContainer";
    
    // Dimensões dos anéis
    const ringInnerRadius = planetData.radius + 0.3;
    const ringOuterRadius = planetData.radius + 1.5;
    const ringSegments = 128; // Alta resolução
    
    // Usar a geometria de anel padrão do Three.js
    const ringGeometry = new THREE.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        ringSegments
    );
    
    // Criar uma textura procedural para os anéis
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Preencher o fundo com transparência
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Definir o centro do canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY);
    
    // Desenhar um círculo dourado como base
    const gradient = ctx.createRadialGradient(centerX, centerY, ringInnerRadius / ringOuterRadius * maxRadius, 
                                             centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(230, 212, 164, 0.95)'); // Borda interna mais clara
    gradient.addColorStop(0.1, 'rgba(220, 202, 154, 0.9)'); // Transição
    gradient.addColorStop(0.3, 'rgba(210, 192, 144, 0.85)'); // Meio
    gradient.addColorStop(0.7, 'rgba(210, 192, 144, 0.8)'); // Meio para fora
    gradient.addColorStop(1, 'rgba(210, 192, 144, 0.7)'); // Borda externa
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, ringInnerRadius / ringOuterRadius * maxRadius, 0, Math.PI * 2, true);
    ctx.fill();
    
    // Adicionar divisões circulares (como a divisão de Cassini)
    const ringDivisions = [
        { pos: 0.7, width: 0.03 },
        { pos: 0.85, width: 0.01 } // Espaço mais fino no anel externo
    ];
    
    for (const division of ringDivisions) {
        const divRadius = (ringInnerRadius / ringOuterRadius * maxRadius) + 
                         (maxRadius - ringInnerRadius / ringOuterRadius * maxRadius) * division.pos;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, divRadius, 0, Math.PI * 2);
        ctx.lineWidth = division.width * maxRadius;
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.stroke();
    }
    
    // Adicionar variações sutis de textura
    for (let i = 0; i < 2000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = ringInnerRadius / ringOuterRadius * maxRadius + 
                        Math.random() * (maxRadius - ringInnerRadius / ringOuterRadius * maxRadius);
        
        // Verificar se estamos em uma divisão
        let inDivision = false;
        for (const division of ringDivisions) {
            const divRadius = (ringInnerRadius / ringOuterRadius * maxRadius) + 
                             (maxRadius - ringInnerRadius / ringOuterRadius * maxRadius) * division.pos;
            
            if (Math.abs(distance - divRadius) < division.width * maxRadius / 2) {
                inDivision = true;
                break;
            }
        }
        
        if (!inDivision) {
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = Math.random() * 2 + 1;
            
            if (Math.random() > 0.5) {
                ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
            } else {
                ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
            }
            
            ctx.fillRect(x - size/2, y - size/2, size, size);
        }
    }
    
    // Criar a textura a partir do canvas
    const ringTexture = new THREE.CanvasTexture(canvas);
    ringTexture.wrapS = THREE.ClampToEdgeWrapping;
    ringTexture.wrapT = THREE.ClampToEdgeWrapping;
    
    // Material para os anéis
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.9
    });
    
    // Criar o mesh do anel
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.name = "aneisSaturno";
    
    // Rotacionar para ficar no plano horizontal
    ring.rotation.x = Math.PI / 2;
    
    // Adicionar inclinação característica dos anéis de Saturno
    ring.rotation.z = THREE.MathUtils.degToRad(5);
    
    // Adicionar o anel ao container
    ringsContainer.add(ring);
    
    // Marcar o planeta como tendo anéis
    planet.userData.hasRings = true;
    
    // Adicionar o container dos anéis ao planeta
    planet.add(ringsContainer);
}

/**
 * Cria uma lua para um planeta
 * @param {Object} planet - Planeta pai
 * @param {Object} satellite - Dados do satélite
 */
function createMoon(planet, satellite) {
    const moonGeometry = new THREE.SphereGeometry(satellite.radius, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: satellite.color || 0xffffff,
        roughness: 0.5,
        metalness: 0
    });
    
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = satellite.name;
    
    // Posicionar a lua
    const moonAngle = Math.random() * Math.PI * 2;
    
    // Verificar se a lua tem excentricidade (órbita elíptica)
    if (satellite.eccentricity) {
        const a = satellite.distance;  // Semi-eixo maior
        const c = a * satellite.eccentricity;  // Distância focal
        const b = Math.sqrt(a * a - c * c);  // Semi-eixo menor
        
        const x = a * Math.cos(moonAngle) - c;
        const z = b * Math.sin(moonAngle);
        
        moon.position.set(x, 0, z);
        
        // Armazenar parâmetros da órbita elíptica
        moon.userData = {
            angle: moonAngle,
            a: a,
            b: b,
            c: c,
            orbitalSpeed: satellite.orbitalSpeed,
            rotationSpeed: satellite.rotationSpeed,
            isElliptical: true,
            eccentricity: satellite.eccentricity,
            semiMajorAxis: a,
            radius: satellite.radius
        };
        
        // Criar uma órbita visual para a lua
        createMoonOrbit(planet, satellite, a, b, c);
    } else {
        // Órbita circular tradicional
        moon.position.x = Math.cos(moonAngle) * satellite.distance;
        moon.position.z = Math.sin(moonAngle) * satellite.distance;
        
        moon.userData = {
            angle: moonAngle,
            distance: satellite.distance,
            orbitalSpeed: satellite.orbitalSpeed,
            rotationSpeed: satellite.rotationSpeed,
            eccentricity: 0,
            semiMajorAxis: satellite.distance,
            radius: satellite.radius
        };
        
        // Criar órbita visual para lua com órbita circular
        createMoonOrbitCircular(planet, satellite.distance);
    }
    
    // Dados para animação da lua
    moon.userData = {
        angle: Math.random() * Math.PI * 2,
        distance: satellite.distance,
        rotationSpeed: satellite.rotationSpeed,
        orbitalSpeed: satellite.orbitalSpeed,
        eccentricity: satellite.eccentricity || 0,
        semiMajorAxis: satellite.distance,
        radius: satellite.radius
    };
    
    planet.add(moon);
}

/**
 * Carrega texturas para os planetas
 * @param {Object} PLANET_DATA - Dados dos planetas incluindo caminhos das texturas
 */
function loadTextures(PLANET_DATA) {
    const textureLoader = new THREE.TextureLoader();
    
    // Função para carregar textura de um planeta
    function loadPlanetTexture(planetName, textureUrl) {
        textureLoader.load(
            textureUrl,
            function(texture) {
                if (planets[planetName] && planets[planetName].material) {
                    planets[planetName].material.map = texture;
                    planets[planetName].material.needsUpdate = true;
                }
            },
            undefined,
            function(err) {
                console.error(`Erro ao carregar textura para ${planetName}:`, err);
                // Quando falhar, usar cores sólidas para evitar o efeito de piscagem
                if (planets[planetName] && planets[planetName].material) {
                    // Definir cores alternativas para os planetas sem texturas
                    const planetColors = {
                        mercurio: 0xa9a9a9, // Cinza escuro
                        venus: 0xe6c073,    // Amarelo dourado
                        terra: 0x2F6CA2,    // Azul
                        marte: 0xaa4200,    // Vermelho alaranjado
                        jupiter: 0xd8ca9d,  // Bege claro
                        saturno: 0xead6a9,  // Amarelo claro
                        urano: 0x82b3d1,    // Azul claro
                        netuno: 0x3f54ba    // Azul escuro
                    };
                    
                    // Usar a cor específica do planeta ou cinza se não tiver uma definida
                    const planetColor = planetColors[planetName] || 0x808080;
                    planets[planetName].material.color.setHex(planetColor);
                    // Aumentar a rugosidade para dar um pouco de textura visual
                    planets[planetName].material.roughness = 0.7;
                    planets[planetName].material.needsUpdate = true;
                }
            }
        );
    }
    
    // Verificar se as texturas existem antes de tentar carregá-las
    // Carregar textura para cada planeta
    for (const planetName in planets) {
        if (planetName !== 'sol' && planets[planetName]) {
            const planet = planets[planetName];
            // Verificar se o caminho da textura está em userData
            if (planet.userData && PLANET_DATA[planetName]) {
                const textureUrl = PLANET_DATA[planetName].textureUrl;
                if (textureUrl) {
                    loadPlanetTexture(planetName, textureUrl);
                }
            }
        }
    }
}

/**
 * Retorna o objeto de planetas
 * @returns {Object} Objeto com todos os planetas
 */
export function getPlanets() {
    return planets;
}

/**
 * Cria efeito de glow ao redor do sol
 * @param {Object} sol - Objeto do sol
 * @param {Object} scene - Cena Three.js
 */
function createSunGlow(sol, scene) {
    // Criar geometria para o glow (esfera um pouco maior que o sol)
    const glowRadius = sol.geometry.parameters.radius * 1.2;
    const glowGeometry = new THREE.SphereGeometry(glowRadius, 32, 32);
    
    // Material para o glow (transparente e com cor de fogo)
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd33,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide // Para renderizar apenas a parte de trás da esfera
    });
    
    // Criar o mesh de glow
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // Adicionar o glow à cena (não ao sol para evitar herança de transformações)
    scene.add(glow);
    
    // Segundo glow para efeito de coroa solar
    const coronaRadius = sol.geometry.parameters.radius * 1.5;
    const coronaGeometry = new THREE.SphereGeometry(coronaRadius, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    scene.add(corona);
    
    // Função para atualizar a posição do glow
    let time = 0;
    
    sol.userData.updateGlow = function() {
        // Atualizar posição do glow
        glow.position.copy(sol.position);
        
        // Rotacionar o sol lentamente
        sol.rotation.y += sol.userData.rotationSpeed * 0.5;
        
        // Atualizar o tempo para animar o glow
        time += 0.01;
        
        // Variar sutilmente o tamanho do glow para simular a atividade solar
        const pulseFactor = 1 + 0.05 * Math.sin(time);
        glow.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Atualizar a coroa solar
        corona.position.copy(sol.position);
        const coronaPulseFactor = 1 + 0.08 * Math.cos(time * 0.8);
        corona.scale.set(coronaPulseFactor, coronaPulseFactor, coronaPulseFactor);
    };
    
    // Chamar a função inicialmente
    sol.userData.updateGlow();
} 