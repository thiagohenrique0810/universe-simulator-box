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
    
    // Modificar o mapeamento UV da geometria para corrigir a orientação da textura
    const pos = ringGeometry.attributes.position;
    const uv = ringGeometry.attributes.uv;
    
    for (let i = 0; i < uv.count; i++) {
        const u = uv.getX(i);
        const v = uv.getY(i);
        
        // Inverter as coordenadas U para que a textura seja circular e não radial
        // Usar posição X,Z para calcular o ângulo theta
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const theta = Math.atan2(z, x);
        
        // Normalizar theta de -PI a PI para 0 a 1
        const newU = (theta + Math.PI) / (Math.PI * 2);
        
        // Garantir transição suave no ponto de emenda (0/1)
        uv.setXY(i, newU, v);
    }
    
    // Indicar que as coordenadas UV foram modificadas
    uv.needsUpdate = true;
    
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
    ringTexture.repeat.x = 5; // Aumentar repetição para maior detalhamento circular
    
    // Material para os anéis
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.name = "aneisSaturno";
    
    // Adicionar pequena rotação para criar inclinação nos anéis
    ring.rotation.z = THREE.MathUtils.degToRad(5);
    
    ringsContainer.add(ring);
    
    // Adicionar sombra dos anéis (parte inferior - sombra projetada nos anéis)
    const shadowRingGeometry = new THREE.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        ringSegments
    );
    
    // Aplicar o mesmo mapeamento UV na geometria da sombra
    const shadowPos = shadowRingGeometry.attributes.position;
    const shadowUv = shadowRingGeometry.attributes.uv;
    
    for (let i = 0; i < shadowUv.count; i++) {
        const x = shadowPos.getX(i);
        const z = shadowPos.getZ(i);
        const theta = Math.atan2(z, x);
        const newU = (theta + Math.PI) / (Math.PI * 2);
        
        shadowUv.setXY(i, newU, shadowUv.getY(i));
    }
    
    shadowUv.needsUpdate = true;
    
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