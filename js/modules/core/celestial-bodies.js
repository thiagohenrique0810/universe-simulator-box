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
    const defaultTextureLoader = new THREE.TextureLoader();
    
    // Criar o Sol
    const solGeometry = new THREE.SphereGeometry(PLANET_DATA.sol.radius, 32, 32);
    const solMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    
    const sol = new THREE.Mesh(solGeometry, solMaterial);
    scene.add(sol);
    planets.sol = sol;
    
    // Criar uma luz no sol
    const solLight = new THREE.PointLight(0xffffff, 1.5, 300);
    sol.add(solLight);
    
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
        
        // Usar um ângulo fixo para cada planeta
        const angle = planetInitialAngles[planetName] || Math.random() * Math.PI * 2;
        
        // Criar a órbita visual e obter seus parâmetros
        const orbitParams = createPlanetOrbit(scene, planetName, planetData);
        
        // Inicializar a userdata do planeta, incluindo o ângulo inicial
        planet.userData = {
            angle: angle,
            orbitalSpeed: planetData.orbitalSpeed,
            rotationSpeed: planetData.rotationSpeed,
            distance: planetData.distance
        };
        
        // Se a órbita for elíptica, adicionar os parâmetros específicos
        if (orbitParams) {
            planet.userData.a = orbitParams.a;
            planet.userData.b = orbitParams.b;
            planet.userData.c = orbitParams.c;
            planet.userData.inclination = orbitParams.inclination;
            
            // Calcular a posição inicial baseada nos mesmos parâmetros da órbita
            const x = orbitParams.a * Math.cos(angle) - orbitParams.c;
            const z = orbitParams.b * Math.sin(angle);
            
            if (orbitParams.inclination) {
                const inclRad = THREE.MathUtils.degToRad(orbitParams.inclination);
                const y = z * Math.sin(inclRad);
                const newZ = z * Math.cos(inclRad);
                planet.position.set(x, y, newZ);
            } else {
                planet.position.set(x, 0, z);
            }
        } else {
            // Posicionamento circular padrão
            planet.position.x = Math.cos(angle) * planetData.distance;
            planet.position.z = Math.sin(angle) * planetData.distance;
        }
        
        // Definir nome do objeto para seleção
        planet.name = planetName;
        
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
    // Criar geometria dos anéis com maior resolução e detalhes
    const ringInnerRadius = planetData.radius + 0.3;
    const ringOuterRadius = planetData.radius + 1.5;
    const ringSegments = 128; // Aumento na resolução
    
    // Criar múltiplos anéis com diferentes tamanhos e opacidades para efeito realista
    const ringsContainer = new THREE.Object3D();
    
    // Anel principal
    const ringGeometry = new THREE.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        ringSegments
    );
    
    // Criar textura de ruído para simular divisões e variações nos anéis
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 1024;
    ringCanvas.height = 64;
    const ctx = ringCanvas.getContext('2d');
    
    // Preencher com gradiente
    const grd = ctx.createLinearGradient(0, 0, 1024, 0);
    grd.addColorStop(0, '#ac9975');
    grd.addColorStop(0.4, '#c2b280');
    grd.addColorStop(0.5, '#d0c090');
    grd.addColorStop(0.6, '#c2b280');
    grd.addColorStop(1, '#ac9975');
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 64);
    
    // Adicionar divisões nos anéis (lacunas)
    // Divisão de Cassini
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(512, 0, 20, 64);
    
    // Outras divisões menores
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(256, 0, 10, 64);
    ctx.fillRect(768, 0, 8, 64);
    
    // Adicionar ruído e variações
    for (let i = 0; i < 2000; i++) {
        const x = Math.floor(Math.random() * 1024);
        const y = Math.floor(Math.random() * 64);
        const size = Math.floor(Math.random() * 3) + 1;
        const opacity = 0.3 + Math.random() * 0.5;
        
        ctx.fillStyle = `rgba(0,0,0,${opacity})`;
        ctx.fillRect(x, y, size, size);
    }
    
    // Criar textura a partir do canvas
    const ringTexture = new THREE.CanvasTexture(ringCanvas);
    ringTexture.wrapS = THREE.RepeatWrapping;
    ringTexture.repeat.x = 3;
    
    // Material para os anéis
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    
    // Adicionar pequena rotação para criar inclinação nos anéis
    ring.rotation.z = THREE.MathUtils.degToRad(5);
    
    ringsContainer.add(ring);
    
    // Adicionar sombra dos anéis (parte inferior - sombra projetada nos anéis)
    const shadowRingGeometry = new THREE.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        ringSegments
    );
    
    const shadowRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        blending: THREE.MultiplyBlending
    });
    
    const shadowRing = new THREE.Mesh(shadowRingGeometry, shadowRingMaterial);
    shadowRing.rotation.x = Math.PI / 2;
    shadowRing.rotation.z = THREE.MathUtils.degToRad(5.2); // Ligeiramente diferente
    shadowRing.position.y = -0.05; // Ligeiramente deslocada para baixo
    
    ringsContainer.add(shadowRing);
    
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
            isElliptical: true
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
            rotationSpeed: satellite.rotationSpeed
        };
        
        // Criar órbita visual para lua com órbita circular
        createMoonOrbitCircular(planet, satellite.distance);
    }
    
    // Definir nome da lua
    moon.name = satellite.name;
    
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