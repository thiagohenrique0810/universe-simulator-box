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
        if (planetName === 'sol' || planetName === 'cinturaoKuiper') continue; // Sol já foi criado, Cinturão de Kuiper é tratado separadamente
        
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
        if (planetName === 'saturno' && planetData.rings) {
            createSaturnRings(planet, planetData);
        }
        
        // Adicionar anéis para Urano e Netuno
        if (planetName === 'urano') {
            createPlanetRings(planet, planetData, {
                innerRadius: 0.45,
                outerRadius: 0.50,
                color: 0xdddddd,
                opacity: 0.02,
                inclination: 97 // Inclinação extrema dos anéis de Urano
            });
        }
        
        if (planetName === 'netuno') {
            createPlanetRings(planet, planetData, {
                innerRadius: 0.45,
                outerRadius: 0.48,
                color: 0xcccccc,
                opacity: 0.015,
                inclination: 29 // Inclinação dos anéis de Netuno
            });
        }
        
        // Adicionar satélites (luas)
        if (planetData.satellites) {
            planetData.satellites.forEach(satellite => {
                createMoon(planet, satellite);
            });
        }
    }
    
    // Criar objetos do Cinturão de Kuiper
    if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
        createKuiperBeltObjects(scene, PLANET_DATA.cinturaoKuiper);
    }
    
    // Criar planetas anões e objetos do Cinturão de Kuiper
    if (PLANET_DATA.cinturaoKuiper) {
        console.log('Criando objetos do Cinturão de Kuiper...');
        createKuiperBeltObjects(scene, PLANET_DATA.cinturaoKuiper);
        
        // Criar também os objetos menores
        if (PLANET_DATA.cinturaoKuiper.objetosMenores) {
            console.log('Criando objetos menores do Cinturão de Kuiper...');
            createKuiperBeltSmallObjects(scene, PLANET_DATA.cinturaoKuiper.objetosMenores);
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
    moon.name = satellite.name; // Garantir que o nome da lua seja definido corretamente
    
    // Carregar textura da lua se estiver definida
    if (satellite.textureUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            satellite.textureUrl,
            function(texture) {
                moon.material.map = texture;
                moon.material.needsUpdate = true;
                console.log(`Textura carregada com sucesso para ${satellite.name}: ${satellite.textureUrl}`);
            },
            undefined,
            function(err) {
                console.error(`Erro ao carregar textura para ${satellite.name}:`, err);
            }
        );
    }
    
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
            radius: satellite.radius,
            isMoon: true, // Marcar explicitamente como lua
            planetParent: planet.name // Armazenar o nome do planeta pai
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
            radius: satellite.radius,
            isMoon: true, // Marcar explicitamente como lua
            planetParent: planet.name // Armazenar o nome do planeta pai
        };
        
        // Criar órbita visual para lua com órbita circular
        createMoonOrbitCircular(planet, satellite.distance);
    }
    
    // Adicionar a lua ao planeta
    planet.add(moon);
    
    console.log(`Lua criada: ${moon.name} para o planeta ${planet.name}`);
    
    return moon;
}

/**
 * Carrega texturas para os planetas
 * @param {Object} PLANET_DATA - Dados dos planetas incluindo caminhos das texturas
 */
function loadTextures(PLANET_DATA) {
    const textureLoader = new THREE.TextureLoader();
    
    console.log("Iniciando carregamento de texturas para planetas...");
    
    // Carregar textura do Sol
    if (PLANET_DATA.sol && PLANET_DATA.sol.textureUrl) {
        console.log(`Carregando textura do Sol: ${PLANET_DATA.sol.textureUrl}`);
        textureLoader.load(
            PLANET_DATA.sol.textureUrl,
            function(texture) {
                if (planets.sol && planets.sol.material) {
                    console.log("Aplicando textura ao Sol");
                    planets.sol.material.map = texture;
                    planets.sol.material.needsUpdate = true;
                }
            },
            undefined,
            function(err) {
                console.error("Erro ao carregar textura do Sol:", err);
            }
        );
    }
    
    // Função para carregar textura de um planeta
    function loadPlanetTexture(planetName, textureUrl) {
        console.log(`Carregando textura para ${planetName}: ${textureUrl}`);
        
        textureLoader.load(
            textureUrl,
            function(texture) {
                if (planets[planetName] && planets[planetName].material) {
                    console.log(`Textura carregada e aplicada para ${planetName}`);
                    planets[planetName].material.map = texture;
                    planets[planetName].material.needsUpdate = true;
                } else {
                    console.warn(`Planeta ${planetName} ou seu material não encontrado`);
                }
            },
            // Callback de progresso (opcional)
            function(xhr) {
                console.log(`${planetName}: ${(xhr.loaded / xhr.total * 100)}% carregado`);
            },
            // Callback de erro
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
    
    // Carregar texturas para cada planeta
    for (const planetName in PLANET_DATA) {
        if (planetName === 'sol' || planetName === 'cinturaoKuiper') continue; // Sol já tratado, Cinturão de Kuiper separado
        
        const planetData = PLANET_DATA[planetName];
        
        if (planetData.textureUrl) {
            loadPlanetTexture(planetName, planetData.textureUrl);
        } else {
            console.warn(`Planeta ${planetName} não tem URL de textura definida`);
        }
        
        // Carregar texturas para luas também
        if (planetData.satellites) {
            planetData.satellites.forEach(satellite => {
                if (satellite.textureUrl) {
                    // Para luas, precisamos encontrar o objeto Mesh dentro do planeta pai
                    const moon = planets[planetName].children.find(child => child.name === satellite.name);
                    
                    if (moon && moon.material) {
                        textureLoader.load(
                            satellite.textureUrl,
                            function(texture) {
                                moon.material.map = texture;
                                moon.material.needsUpdate = true;
                                console.log(`Textura aplicada para lua ${satellite.name}`);
                            },
                            undefined,
                            function(err) {
                                console.error(`Erro ao carregar textura para lua ${satellite.name}:`, err);
                            }
                        );
                    }
                }
            });
        }
    }
    
    // Carregar texturas para planetas anões do Cinturão de Kuiper
    if (PLANET_DATA.cinturaoKuiper && PLANET_DATA.cinturaoKuiper.planetasAnoes) {
        PLANET_DATA.cinturaoKuiper.planetasAnoes.forEach(dwarfPlanet => {
            if (dwarfPlanet.textureUrl) {
                loadPlanetTexture(dwarfPlanet.id, dwarfPlanet.textureUrl);
            }
            
            // Carregar texturas para luas de planetas anões
            if (dwarfPlanet.satellites) {
                dwarfPlanet.satellites.forEach(satellite => {
                    if (satellite.textureUrl) {
                        const dwarfPlanetObj = planets[dwarfPlanet.id];
                        if (dwarfPlanetObj) {
                            const moon = dwarfPlanetObj.children.find(child => child.name === satellite.name);
                            
                            if (moon && moon.material) {
                                textureLoader.load(
                                    satellite.textureUrl,
                                    function(texture) {
                                        moon.material.map = texture;
                                        moon.material.needsUpdate = true;
                                    },
                                    undefined,
                                    function(err) {
                                        console.error(`Erro ao carregar textura para lua ${satellite.name} do planeta anão ${dwarfPlanet.id}:`, err);
                                    }
                                );
                            }
                        }
                    }
                });
            }
        });
    }
    
    console.log("Solicitação de carregamento de texturas concluída");
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

/**
 * Cria os objetos do Cinturão de Kuiper (planetas anões)
 * @param {Object} scene - Cena Three.js
 * @param {Object} kuiperData - Dados do Cinturão de Kuiper
 */
function createKuiperBeltObjects(scene, kuiperData) {
    console.log('Criando objetos do Cinturão de Kuiper...');
    
    if (!kuiperData.planetasAnoes || !Array.isArray(kuiperData.planetasAnoes)) {
        console.warn('Dados de planetas anões não encontrados ou inválidos');
        return;
    }
    
    const textureLoader = new THREE.TextureLoader();
    
    // Criar cada planeta anão
    kuiperData.planetasAnoes.forEach(dwarfPlanetData => {
        console.log(`Criando planeta anão: ${dwarfPlanetData.nome}`);
        
        // Verificar dados essenciais
        if (!dwarfPlanetData.id || !dwarfPlanetData.radius || !dwarfPlanetData.distance) {
            console.warn(`Dados insuficientes para criar o planeta anão ${dwarfPlanetData.nome}`);
            return;
        }
        
        // Criar geometria do planeta anão
        const dwarfGeometry = new THREE.SphereGeometry(dwarfPlanetData.radius, 32, 32);
        
        // Determinar material baseado na textura ou cor
        let dwarfMaterial;
        if (dwarfPlanetData.textureUrl) {
            dwarfMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.7,
                metalness: 0.1
            });
            
            // Tentar carregar a textura
            textureLoader.load(
                dwarfPlanetData.textureUrl,
                function(texture) {
                    dwarfMaterial.map = texture;
                    dwarfMaterial.needsUpdate = true;
                },
                undefined,
                function(err) {
                    console.warn(`Erro ao carregar textura para ${dwarfPlanetData.nome}:`, err);
                    // Usar cor especificada ou cor padrão
                    dwarfMaterial.color.set(dwarfPlanetData.color || 0xaaaaaa);
                }
            );
        } else {
            // Se não tiver textura, usar cor diretamente
            dwarfMaterial = new THREE.MeshStandardMaterial({
                color: dwarfPlanetData.color || 0xaaaaaa,
                roughness: 0.7,
                metalness: 0.1
            });
        }
        
        // Criar o objeto 3D para o planeta anão
        const dwarfPlanet = new THREE.Mesh(dwarfGeometry, dwarfMaterial);
        dwarfPlanet.name = dwarfPlanetData.id;
        
        // Definir um ângulo aleatório ou baseado no identificador
        const seed = dwarfPlanetData.id.charCodeAt(0) + dwarfPlanetData.id.charCodeAt(dwarfPlanetData.id.length - 1);
        const angle = (seed % 100) / 100 * Math.PI * 2;
        
        // Criar órbita visual
        const orbitParams = createPlanetOrbit(scene, dwarfPlanetData.id, dwarfPlanetData);
        
        // Posicionar o planeta anão
        dwarfPlanet.position.x = Math.cos(angle) * dwarfPlanetData.distance;
        dwarfPlanet.position.z = Math.sin(angle) * dwarfPlanetData.distance;
        
        // Aplicar inclinação orbital, se definida
        if (dwarfPlanetData.inclination) {
            dwarfPlanet.rotation.x = THREE.MathUtils.degToRad(dwarfPlanetData.inclination);
        }
        
        // Adicionar dados para rotação e órbita
        dwarfPlanet.userData = {
            angle: angle,
            distance: dwarfPlanetData.distance,
            rotationSpeed: dwarfPlanetData.rotationSpeed || 0.005,
            orbitalSpeed: dwarfPlanetData.orbitalSpeed || 0.00001,
            semiMajorAxis: dwarfPlanetData.semiMajorAxis || dwarfPlanetData.distance,
            eccentricity: dwarfPlanetData.eccentricity || 0,
            radius: dwarfPlanetData.radius,
            isDwarfPlanet: true // Marcar como planeta anão
        };
        
        // Adicionar o planeta anão à cena
        scene.add(dwarfPlanet);
        planets[dwarfPlanetData.id] = dwarfPlanet;
        
        // Adicionar anéis, se especificado
        if (dwarfPlanetData.hasRings) {
            createDwarfPlanetRings(dwarfPlanet, dwarfPlanetData);
        }
        
        // Adicionar satélites (luas)
        if (dwarfPlanetData.satellites && Array.isArray(dwarfPlanetData.satellites)) {
            dwarfPlanetData.satellites.forEach(satellite => {
                createMoon(dwarfPlanet, satellite);
            });
        }
    });
}

/**
 * Cria anéis para planetas anões (como Haumea)
 * @param {Object} planet - Objeto do planeta anão
 * @param {Object} planetData - Dados do planeta anão
 */
function createDwarfPlanetRings(planet, planetData) {
    // Criar um container para os anéis
    const ringsContainer = new THREE.Object3D();
    ringsContainer.name = `aneis${planetData.nome}Container`;
    
    // Dimensões dos anéis - mais sutis para planetas anões
    const ringInnerRadius = planetData.radius * 1.2;
    const ringOuterRadius = planetData.radius * 1.8;
    const ringSegments = 64; // Resolução menor que os anéis de Saturno
    
    // Usar a geometria de anel padrão do Three.js
    const ringGeometry = new THREE.RingGeometry(
        ringInnerRadius,
        ringOuterRadius,
        ringSegments
    );
    
    // Material para os anéis - mais transparente para planetas anões
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    
    // Criar o mesh do anel
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.name = `aneis${planetData.nome}`;
    
    // Rotacionar para ficar no plano horizontal
    ring.rotation.x = Math.PI / 2;
    
    // Adicionar inclinação personalizada se especificada
    const ringTilt = planetData.ringTilt || 5; // Valor padrão
    ring.rotation.z = THREE.MathUtils.degToRad(ringTilt);
    
    // Adicionar o anel ao container
    ringsContainer.add(ring);
    
    // Marcar o planeta como tendo anéis
    planet.userData.hasRings = true;
    
    // Adicionar o container dos anéis ao planeta
    planet.add(ringsContainer);
}

/**
 * Cria anéis para planetas
 * @param {Object} planet - Objeto do planeta
 * @param {Object} planetData - Dados do planeta
 * @param {Object} ringsData - Dados dos anéis
 */
function createPlanetRings(planet, planetData, ringsData) {
    // Criar um container para os anéis
    const planetName = planet.name;
    const ringsContainer = new THREE.Object3D();
    ringsContainer.name = `aneis${planetName}Container`;
    
    // Dimensões dos anéis
    const { innerRadius, outerRadius, color, opacity, inclination } = ringsData;
    
    // Usar a geometria de anel padrão do Three.js
    const ringGeometry = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        128
    );
    
    // Definir a transparência baseada no planeta
    let finalOpacity = opacity;
    if (planetName === 'urano' || planetName === 'netuno') {
        // Anéis de Urano e Netuno são extremamente tênues na realidade
        finalOpacity = opacity * 0.3; // Reduzir ainda mais a opacidade
    }
    
    // Material para os anéis - condições específicas para Urano e Netuno
    let ringMaterial;
    
    if (planetName === 'urano' || planetName === 'netuno') {
        // Material mais tênue para anéis quase invisíveis
        ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: finalOpacity,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending, // Usar blending aditivo para tornar ainda mais sutil
            depthWrite: false  // Evitar problemas de z-fighting
        });
    } else {
        // Material normal para Saturno
        ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: finalOpacity,
            side: THREE.DoubleSide
        });
    }
    
    // Criar o mesh do anel
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.name = `aneis${planetName}`;
    
    // Rotacionar para ficar no plano horizontal
    ring.rotation.x = Math.PI / 2;
    
    // Adicionar inclinação personalizada se especificada
    ring.rotation.z = THREE.MathUtils.degToRad(inclination);
    
    // Adicionar o anel ao container
    ringsContainer.add(ring);
    
    // Marcar o planeta como tendo anéis
    planet.userData.hasRings = true;
    
    // Adicionar o container dos anéis ao planeta
    planet.add(ringsContainer);
}

/**
 * Cria os objetos menores do Cinturão de Kuiper
 * @param {Object} scene - Cena Three.js
 * @param {Object} objetosMenores - Dados dos objetos menores do Cinturão de Kuiper
 */
function createKuiperBeltSmallObjects(scene, objetosMenores) {
    const textureLoader = new THREE.TextureLoader();
    
    // Função auxiliar para criar um objeto individual
    function createSmallObject(objectData, objectType) {
        console.log(`Criando objeto ${objectType}: ${objectData.nome}`);
        
        // Verificar dados essenciais
        if (!objectData.id || !objectData.radius || !objectData.distance) {
            console.warn(`Dados insuficientes para criar o objeto ${objectData.nome}`);
            return;
        }
        
        // Criar geometria do objeto
        const objectGeometry = new THREE.SphereGeometry(objectData.radius, 24, 24);
        
        // Determinar material baseado na textura ou cor
        let objectMaterial;
        if (objectData.textureUrl) {
            objectMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.7,
                metalness: 0.1
            });
            
            // Tentar carregar a textura
            textureLoader.load(
                objectData.textureUrl,
                function(texture) {
                    objectMaterial.map = texture;
                    objectMaterial.needsUpdate = true;
                },
                undefined,
                function(err) {
                    console.warn(`Erro ao carregar textura para ${objectData.nome}:`, err);
                    // Usar cor especificada ou cor padrão
                    objectMaterial.color.set(objectData.color || 0xaaaaaa);
                }
            );
        } else {
            // Se não tiver textura, usar cor diretamente
            objectMaterial = new THREE.MeshStandardMaterial({
                color: objectData.color || 0xaaaaaa,
                roughness: 0.7,
                metalness: 0.1
            });
        }
        
        // Criar o objeto 3D
        const object = new THREE.Mesh(objectGeometry, objectMaterial);
        object.name = objectData.id;
        
        // Definir um ângulo baseado no ID ou aleatório
        const seed = objectData.id.charCodeAt(0) + objectData.id.charCodeAt(objectData.id.length - 1);
        const angle = (seed % 100) / 100 * Math.PI * 2;
        
        // Criar órbita visual
        const orbitParams = createPlanetOrbit(scene, objectData.id, objectData);
        
        // Posicionar o objeto - uso de excentricidade para objetos mais externos
        if (objectData.eccentricity > 0.3) {
            // Para objetos de alta excentricidade, posicioná-los em pontos diferentes da órbita
            const trueAnomaly = (seed % 360) * Math.PI / 180; // Ângulo na órbita
            const semiMajorAxis = objectData.semiMajorAxis || objectData.distance;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(objectData.eccentricity, 2));
            const distance = semiMajorAxis * (1 - Math.pow(objectData.eccentricity, 2)) / 
                            (1 + objectData.eccentricity * Math.cos(trueAnomaly));
            
            object.position.x = Math.cos(angle + trueAnomaly) * distance;
            object.position.z = Math.sin(angle + trueAnomaly) * distance * Math.cos(THREE.MathUtils.degToRad(objectData.inclination || 0));
            object.position.y = Math.sin(angle + trueAnomaly) * distance * Math.sin(THREE.MathUtils.degToRad(objectData.inclination || 0));
        } else {
            // Para objetos de baixa excentricidade, usar posicionamento mais simples
            object.position.x = Math.cos(angle) * objectData.distance;
            object.position.z = Math.sin(angle) * objectData.distance;
            
            // Aplicar inclinação, se definida
            if (objectData.inclination) {
                const inclinationRad = THREE.MathUtils.degToRad(objectData.inclination);
                object.position.y = Math.sin(angle) * objectData.distance * Math.tan(inclinationRad);
            }
        }
        
        // Adicionar dados para rotação e órbita
        object.userData = {
            angle: angle,
            distance: objectData.distance,
            rotationSpeed: objectData.rotationSpeed || 0.005,
            orbitalSpeed: objectData.orbitalSpeed || 0.00001,
            semiMajorAxis: objectData.semiMajorAxis || objectData.distance,
            eccentricity: objectData.eccentricity || 0,
            radius: objectData.radius,
            tipo: objectData.tipo || objectType
        };
        
        // Adicionar o objeto à cena
        scene.add(object);
        planets[objectData.id] = object;
        
        // Adicionar satélites (luas), se houver
        if (objectData.satellites && Array.isArray(objectData.satellites)) {
            objectData.satellites.forEach(satellite => {
                createMoon(object, satellite);
            });
        }
        
        return object;
    }
    
    // Processar objetos clássicos
    if (objetosMenores.objetosClassicos && Array.isArray(objetosMenores.objetosClassicos)) {
        objetosMenores.objetosClassicos.forEach(objectData => {
            createSmallObject(objectData, "Objeto Clássico");
        });
    }
    
    // Processar objetos ressonantes
    if (objetosMenores.objetosRessonantes && Array.isArray(objetosMenores.objetosRessonantes)) {
        objetosMenores.objetosRessonantes.forEach(objectData => {
            createSmallObject(objectData, "Objeto Ressonante");
        });
    }
    
    // Processar objetos do disco disperso
    if (objetosMenores.discoDisperso && Array.isArray(objetosMenores.discoDisperso)) {
        objetosMenores.discoDisperso.forEach(objectData => {
            createSmallObject(objectData, "Objeto do Disco Disperso");
        });
    }
    
    // Criar nuvem de objetos menores aleatórios para cada região
    createRandomKuiperBeltPopulation(scene, "classico", 40, 410, 450, 0.1, 10, 0.01);
    createRandomKuiperBeltPopulation(scene, "ressonante", 30, 380, 400, 0.25, 25, 0.02);
    createRandomKuiperBeltPopulation(scene, "disperso", 25, 480, 650, 0.5, 40, 0.04);
}

/**
 * Cria uma população aleatória de pequenos objetos do Cinturão de Kuiper
 * @param {Object} scene - Cena Three.js
 * @param {String} region - Região ('classico', 'ressonante', 'disperso')
 * @param {Number} count - Número de objetos a criar
 * @param {Number} minDistance - Distância mínima do Sol
 * @param {Number} maxDistance - Distância máxima do Sol
 * @param {Number} maxEccentricity - Excentricidade máxima das órbitas
 * @param {Number} maxInclination - Inclinação máxima das órbitas em graus
 * @param {Number} sizeVariation - Variação de tamanho (0-1)
 */
function createRandomKuiperBeltPopulation(scene, region, count, minDistance, maxDistance, maxEccentricity, maxInclination, sizeVariation) {
    console.log(`Criando população de objetos pequenos da região ${region} do Cinturão de Kuiper (${count} objetos)`);
    
    // Cores base para cada região
    const regionColors = {
        classico: new THREE.Color(0xaabbcc),  // Azulado
        ressonante: new THREE.Color(0xccbbaa), // Acastanhado
        disperso: new THREE.Color(0xbbaacc)    // Avermelhado
    };
    
    // Geometria compartilhada para economizar memória
    const smallGeometry = new THREE.SphereGeometry(0.025, 8, 8);
    
    // Container para agrupar todos os objetos pequenos
    const container = new THREE.Object3D();
    container.name = `kuiperBelt_${region}_small`;
    scene.add(container);
    
    // Registrar o container
    planets[`kuiperBelt_${region}`] = container;
    
    // Criar lote de objetos pequenos
    for (let i = 0; i < count; i++) {
        // Determinar distância aleatória dentro do intervalo
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        
        // Parâmetros orbitais
        const eccentricity = Math.random() * maxEccentricity;
        const inclination = Math.random() * maxInclination;
        const angle = Math.random() * Math.PI * 2; // Ângulo inicial aleatório
        const trueAnomaly = Math.random() * Math.PI * 2; // Posição na órbita aleatória
        
        // Tamanho aleatório com variação
        const size = 0.015 + Math.random() * sizeVariation * 0.03;
        
        // Velocidade orbital baseada na distância (mais distante = mais lento)
        const orbitalSpeed = 0.00002 * (400 / distance);
        
        // Cor derivada da cor base com variação
        const baseColor = regionColors[region] || new THREE.Color(0xaaaaaa);
        const colorVariation = 0.2; // Variação de 20% na cor
        const objectColor = new THREE.Color(
            baseColor.r * (1 - colorVariation / 2 + Math.random() * colorVariation),
            baseColor.g * (1 - colorVariation / 2 + Math.random() * colorVariation),
            baseColor.b * (1 - colorVariation / 2 + Math.random() * colorVariation)
        );
        
        // Material com variação de cor
        const material = new THREE.MeshStandardMaterial({
            color: objectColor,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Criar o objeto
        const object = new THREE.Mesh(smallGeometry, material);
        object.name = `kuiperObj_${region}_${i}`;
        
        // Calcular posição na órbita elíptica
        let posX, posY, posZ;
        
        if (eccentricity > 0.1) {
            // Para órbitas elípticas
            const semiMajorAxis = distance;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
            
            // Calcular distância no ponto específico da órbita
            const r = semiMajorAxis * (1 - Math.pow(eccentricity, 2)) / 
                      (1 + eccentricity * Math.cos(trueAnomaly));
            
            // Posição na órbita
            posX = Math.cos(angle + trueAnomaly) * r;
            
            // Considerar inclinação
            if (inclination > 0) {
                const incRad = THREE.MathUtils.degToRad(inclination);
                posZ = Math.sin(angle + trueAnomaly) * r * Math.cos(incRad);
                posY = Math.sin(angle + trueAnomaly) * r * Math.sin(incRad);
            } else {
                posZ = Math.sin(angle + trueAnomaly) * r;
                posY = 0;
            }
        } else {
            // Para órbitas quase circulares, simplificar
            posX = Math.cos(angle) * distance;
            
            if (inclination > 0) {
                const incRad = THREE.MathUtils.degToRad(inclination);
                posZ = Math.sin(angle) * distance * Math.cos(incRad);
                posY = Math.sin(angle) * distance * Math.sin(incRad);
            } else {
                posZ = Math.sin(angle) * distance;
                posY = 0;
            }
        }
        
        // Posicionar objeto
        object.position.set(posX, posY, posZ);
        
        // Adicionar dados para animação
        object.userData = {
            angle: angle,
            distance: distance,
            orbitalSpeed: orbitalSpeed,
            rotationSpeed: 0.01 + Math.random() * 0.02,
            eccentricity: eccentricity,
            semiMajorAxis: distance,
            trueAnomaly: trueAnomaly,
            inclination: inclination,
            radius: size,
            isKuiperObject: true,
            region: region
        };
        
        // Adicionar ao container
        container.add(object);
    }
    
    return container;
} 