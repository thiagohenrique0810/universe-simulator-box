// Constantes do simulador
const PLANET_DATA = {
    sol: {
        radius: 3.5,
        textureUrl: 'textures/sun.jpg',
        distance: 0,
        orbitalSpeed: 0,
        rotationSpeed: 0.004,
        emissive: 0xffff00
    },
    mercurio: {
        radius: 0.14,
        textureUrl: 'textures/mercury.jpg',
        distance: 13,
        semiMajorAxis: 13,
        eccentricity: 0.205,
        orbitalSpeed: 0.016,
        rotationSpeed: 0.004,
        inclination: 7.0,
        orbitColor: 0xffffff
    },
    venus: {
        radius: 0.34,
        textureUrl: 'textures/venus.jpg',
        distance: 17,
        semiMajorAxis: 17,
        eccentricity: 0.007,
        orbitalSpeed: 0.0065,
        rotationSpeed: 0.002,
        inclination: 3.4,
        orbitColor: 0x997766
    },
    terra: {
        radius: 0.36,
        textureUrl: 'textures/earth.jpg',
        distance: 20,
        semiMajorAxis: 20,
        eccentricity: 0.017,
        orbitalSpeed: 0.004,
        rotationSpeed: 0.02,
        inclination: 0.0,
        orbitColor: 0x3399ff,
        satellites: [
            {
                name: 'lua',
                radius: 0.1,
                textureUrl: 'textures/moon.jpg',
                distance: 1.0,
                orbitalSpeed: 0.03,
                rotationSpeed: 0.01,
                eccentricity: 0.0549
            }
        ]
    },
    marte: {
        radius: 0.19,
        textureUrl: 'textures/mars.jpg',
        distance: 25,
        semiMajorAxis: 25,
        eccentricity: 0.094,
        orbitalSpeed: 0.0021,
        rotationSpeed: 0.018,
        inclination: 1.9,
        orbitColor: 0xdd4422,
        satellites: [
            {
                name: 'fobos',
                radius: 0.02,
                color: 0xaaaaaa,
                distance: 0.5,
                orbitalSpeed: 0.04,
                rotationSpeed: 0.01,
                eccentricity: 0.015
            },
            {
                name: 'deimos',
                radius: 0.01,
                color: 0x888888,
                distance: 0.7,
                orbitalSpeed: 0.02,
                rotationSpeed: 0.008,
                eccentricity: 0.0005
            }
        ]
    },
    jupiter: {
        radius: 1.2,
        textureUrl: 'textures/jupiter.jpg',
        distance: 46,
        semiMajorAxis: 46,
        eccentricity: 0.049,
        orbitalSpeed: 0.0003,
        rotationSpeed: 0.04,
        inclination: 1.3,
        orbitColor: 0xbbaa88,
        satellites: [
            {
                name: 'io',
                radius: 0.08,
                color: 0xdbb963,
                distance: 1.8,
                orbitalSpeed: 0.015,
                rotationSpeed: 0.005,
                eccentricity: 0.0041
            },
            {
                name: 'europa',
                radius: 0.07,
                color: 0xb5a7a0,
                distance: 2.2,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.005,
                eccentricity: 0.0094
            },
            {
                name: 'ganimedes',
                radius: 0.12,
                color: 0x8e8373,
                distance: 2.7,
                orbitalSpeed: 0.006,
                rotationSpeed: 0.003,
                eccentricity: 0.0013
            },
            {
                name: 'calisto',
                radius: 0.11,
                color: 0x3a3a3a,
                distance: 3.3,
                orbitalSpeed: 0.004,
                rotationSpeed: 0.002,
                eccentricity: 0.0074
            }
        ]
    },
    saturno: {
        radius: 0.96,
        textureUrl: 'textures/saturn.jpg',
        distance: 62,
        semiMajorAxis: 62,
        eccentricity: 0.057,
        orbitalSpeed: 0.0001,
        rotationSpeed: 0.01,
        inclination: 2.5,
        orbitColor: 0xddcc88,
        rings: true,
        satellites: [
            {
                name: 'titan',
                radius: 0.14,
                color: 0xf5c466,
                distance: 2.5,
                orbitalSpeed: 0.008,
                rotationSpeed: 0.003,
                eccentricity: 0.0288
            },
            {
                name: 'encélado',
                radius: 0.04,
                color: 0xe8e8e8,
                distance: 2.0,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.0047
            }
        ]
    },
    urano: {
        radius: 0.62,
        textureUrl: 'textures/uranus.jpg',
        distance: 88,
        semiMajorAxis: 88,
        eccentricity: 0.046,
        orbitalSpeed: 0.00004,
        rotationSpeed: 0.03,
        inclination: 0.8,
        orbitColor: 0x88ccff,
        satellites: [
            {
                name: 'titania',
                radius: 0.05,
                color: 0x999999,
                distance: 1.5,
                orbitalSpeed: 0.007,
                rotationSpeed: 0.003,
                eccentricity: 0.0011
            },
            {
                name: 'oberon',
                radius: 0.04,
                color: 0x777777,
                distance: 1.8,
                orbitalSpeed: 0.005,
                rotationSpeed: 0.002,
                eccentricity: 0.0014
            }
        ]
    },
    netuno: {
        radius: 0.60,
        textureUrl: 'textures/neptune.jpg',
        distance: 110,
        semiMajorAxis: 110,
        eccentricity: 0.011,
        orbitalSpeed: 0.00002,
        rotationSpeed: 0.032,
        inclination: 1.8,
        orbitColor: 0x3355ff,
        satellites: [
            {
                name: 'tritao',
                radius: 0.08,
                color: 0xd1ccc1,
                distance: 1.8,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.000016
            }
        ]
    }
};

// Variáveis da aplicação
let scene, camera, renderer, controls;
let planets = {};
let orbits = {};
let frameCount = 0;
let simulationSpeed = 1.0; // Fator multiplicador para controlar a velocidade da simulação
let asteroidBelt; // Objeto para armazenar o cinturão de asteroides
let selectedPlanet = null; // Planeta selecionado atualmente para informações
let backgroundMusic; // Variável para armazenar o áudio de fundo

// Dados detalhados sobre os planetas para exibição
const PLANET_INFO = {
    sol: {
        nome: "Sol",
        tipo: "Estrela anã amarela",
        composicao: "Hidrogênio (73%), Hélio (25%), outros elementos (2%)",
        temperatura: "5.500°C (superfície), 15.000.000°C (núcleo)",
        diametro: "1.392.700 km (109x Terra)",
        massa: "1,989 × 10^30 kg (333.000x Terra)",
        gravidade: "274 m/s² (28x Terra)",
        distanciaTerra: "149,6 milhões km (1 UA)",
        descricao: "O Sol é a estrela central do Sistema Solar, responsável pela energia que sustenta a vida na Terra. É uma estrela de tamanho médio que existe há cerca de 4,6 bilhões de anos e está na metade de sua vida."
    },
    mercurio: {
        nome: "Mercúrio",
        tipo: "Planeta rochoso",
        composicao: "Rocha e metal, grande núcleo de ferro",
        temperatura: "-173°C a 427°C",
        diametro: "4.879 km (0,38x Terra)",
        orbita: "88 dias terrestres",
        rotacao: "59 dias terrestres",
        distanciaSol: "57,9 milhões km (0,39 UA)",
        descricao: "Mercúrio é o menor e mais interno planeta do Sistema Solar, com a menor massa. Sua superfície é fortemente craterizada, semelhante à Lua, devido à falta de atmosfera para protegê-lo de impactos."
    },
    venus: {
        nome: "Vênus",
        tipo: "Planeta rochoso",
        composicao: "Dióxido de carbono, nitrogênio",
        temperatura: "462°C (média)",
        diametro: "12.104 km (0,95x Terra)",
        orbita: "225 dias terrestres",
        rotacao: "243 dias terrestres (retrógrada)",
        distanciaSol: "108,2 milhões km (0,72 UA)",
        descricao: "Vênus é conhecido como o gêmeo da Terra devido ao seu tamanho e massa similares, mas tem uma atmosfera densa de CO2 que causa um intenso efeito estufa, tornando-o o planeta mais quente do Sistema Solar."
    },
    terra: {
        nome: "Terra",
        tipo: "Planeta rochoso",
        composicao: "Nitrogênio, oxigênio, água",
        temperatura: "15°C (média)",
        diametro: "12.742 km",
        orbita: "365,25 dias",
        rotacao: "24 horas",
        distanciaSol: "149,6 milhões km (1 UA)",
        descricao: "A Terra é o único planeta conhecido a abrigar vida. Sua atmosfera e campos magnéticos protegem a superfície da radiação solar prejudicial, e 71% de sua superfície é coberta por água."
    },
    marte: {
        nome: "Marte",
        tipo: "Planeta rochoso",
        composicao: "Dióxido de carbono, nitrogênio, argônio",
        temperatura: "-63°C (média)",
        diametro: "6.779 km (0,53x Terra)",
        orbita: "687 dias terrestres",
        rotacao: "24,6 horas",
        distanciaSol: "227,9 milhões km (1,52 UA)",
        descricao: "Marte é conhecido como o planeta vermelho devido ao óxido de ferro em sua superfície. Possui a maior montanha do Sistema Solar (Olympus Mons) e o maior cânion (Valles Marineris)."
    },
    jupiter: {
        nome: "Júpiter",
        tipo: "Gigante gasoso",
        composicao: "Hidrogênio, hélio",
        temperatura: "-108°C (topo das nuvens)",
        diametro: "139.820 km (11x Terra)",
        orbita: "11,86 anos terrestres",
        rotacao: "9,93 horas",
        distanciaSol: "778,5 milhões km (5,2 UA)",
        descricao: "Júpiter é o maior planeta do Sistema Solar. Sua característica mais conhecida é a Grande Mancha Vermelha, uma tempestade gigante que existe há pelo menos 400 anos. Possui 79 luas conhecidas."
    },
    saturno: {
        nome: "Saturno",
        tipo: "Gigante gasoso",
        composicao: "Hidrogênio, hélio",
        temperatura: "-138°C (topo das nuvens)",
        diametro: "116.460 km (9,14x Terra)",
        orbita: "29,46 anos terrestres",
        rotacao: "10,7 horas",
        distanciaSol: "1,43 bilhões km (9,5 UA)",
        descricao: "Saturno é famoso por seus imensos anéis, compostos principalmente de partículas de gelo e rocha. É o segundo maior planeta do Sistema Solar e possui 82 luas conhecidas, incluindo Titan, a única lua com atmosfera densa."
    },
    urano: {
        nome: "Urano",
        tipo: "Gigante de gelo",
        composicao: "Hidrogênio, hélio, metano (dá a cor azul)",
        temperatura: "-195°C (média)",
        diametro: "50.724 km (4x Terra)",
        orbita: "84 anos terrestres",
        rotacao: "17,2 horas (retrógrada)",
        distanciaSol: "2,87 bilhões km (19,2 UA)",
        descricao: "Urano é único por seu eixo de rotação extremamente inclinado, quase paralelo ao plano de sua órbita, fazendo-o rolar como uma bola. Possui um sistema de anéis tênues e 27 luas conhecidas."
    },
    netuno: {
        nome: "Netuno",
        tipo: "Gigante de gelo",
        composicao: "Hidrogênio, hélio, metano (dá a cor azul)",
        temperatura: "-214°C (média)",
        diametro: "49.244 km (3,9x Terra)",
        orbita: "165 anos terrestres",
        rotacao: "16,1 horas",
        distanciaSol: "4,5 bilhões km (30 UA)",
        descricao: "Netuno é o planeta mais distante do Sol. Possui ventos mais fortes que qualquer outro planeta, chegando a 2.100 km/h. Sua característica mais notável é a Grande Mancha Escura, uma tempestade semelhante à de Júpiter."
    }
};

// Inicialização
function init() {
    // Criar a cena
    scene = new THREE.Scene();
    
    // Configurar a câmera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 2000);
    camera.position.set(0, 80, 120);
    
    // Configurar o renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Adicionar controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    
    // Ajustar velocidades orbitais de acordo com a Terceira Lei de Kepler
    ajustarVelocidadesKeplerianas();
    
    // Adicionar estrelas de fundo
    createStars();
    
    // Criar o sol e planetas
    createCelestialBodies();
    
    // Criar o cinturão de asteroides
    createAsteroidBelt();
    
    // Adicionar iluminação ambiente
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Eventos de redimensionamento
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar música de fundo
    setupBackgroundMusic();
    
    // Adicionar controles de velocidade da simulação
    createSimulationControls();
    
    // Adicionar painel de informações detalhadas
    createInfoPanel();
    
    // Adicionar evento de clique para selecionar planetas
    setupPlanetSelection();
    
    // Iniciar a animação
    animate();
}

// Função para ajustar velocidades orbitais de acordo com a Terceira Lei de Kepler
function ajustarVelocidadesKeplerianas() {
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

// Criar estrelas de fundo
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15
    });
    
    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Função para atualizar as posições dos planetas garantindo alinhamento preciso com órbitas
function updatePlanetPositions() {
    // Animar cada planeta
    for (const planetName in planets) {
        if (planetName === 'sol') continue;
        
        const planet = planets[planetName];
        const userData = planet.userData;
        
        if (userData) {
            // Atualizar ângulo orbital considerando o fator de velocidade da simulação
            userData.angle += userData.orbitalSpeed * simulationSpeed;
            
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
                    
                    // Definir a posição do planeta na órbita
                    planet.position.set(x, y, newZ);
                } else {
                    // Para planetas sem inclinação
                    planet.position.set(x, 0, z);
                }
            } else {
                // Modo circular para compatibilidade
                planet.position.x = Math.cos(userData.angle) * userData.distance;
                planet.position.z = Math.sin(userData.angle) * userData.distance;
                planet.position.y = 0; // Garantir que permaneça no plano XZ
            }
            
            // Rotação do planeta com fator de velocidade da simulação
            planet.rotation.y += userData.rotationSpeed * simulationSpeed;
            
            // Tratamento especial para Saturno (mantém os anéis estáveis)
            if (userData.hasRings) {
                // Ajustar a orientação do contêiner de anéis para manter sempre o mesmo ângulo global
                const ringsContainer = planet.children.find(child => child.children.length > 0 && child.children[0].geometry.type === 'RingGeometry');
                if (ringsContainer) {
                    // Compensar a rotação do planeta para manter os anéis estáveis
                    ringsContainer.rotation.y = -planet.rotation.y;
                }
            }
            
            // Animar luas com fator de velocidade da simulação
            planet.children.forEach(child => {
                if (child.userData && (child.userData.orbitalSpeed || child.userData.isElliptical)) {
                    // Atualizar ângulo orbital da lua com fator de velocidade
                    child.userData.angle += child.userData.orbitalSpeed * simulationSpeed;
                    
                    // Verificar se a lua tem órbita elíptica
                    if (child.userData.isElliptical) {
                        const angle = child.userData.angle;
                        const a = child.userData.a;
                        const b = child.userData.b;
                        const c = child.userData.c;
                        
                        // Posição na elipse - uso do mesmo cálculo da órbita visual
                        child.position.x = a * Math.cos(angle) - c;
                        child.position.z = b * Math.sin(angle);
                    } else {
                        // Atualizar posição da lua em órbita circular
                        child.position.x = Math.cos(child.userData.angle) * child.userData.distance;
                        child.position.z = Math.sin(child.userData.angle) * child.userData.distance;
                    }
                    
                    // Rotação da lua com fator de velocidade
                    child.rotation.y += child.userData.rotationSpeed * simulationSpeed;
                }
            });
        }
    }
}

// Função para criar a geometria da órbita de um planeta
function createPlanetOrbit(planetName, planetData) {
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

// Modificar a função createCelestialBodies para usar a nova função createPlanetOrbit
function createCelestialBodies() {
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
        
        // Criar geometria do planeta
        const planetGeometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Usar um ângulo fixo para cada planeta
        const angle = planetInitialAngles[planetName] || Math.random() * Math.PI * 2;
        
        // Criar a órbita visual e obter seus parâmetros
        const orbitParams = createPlanetOrbit(planetName, planetData);
        
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
        
        scene.add(planet);
        planets[planetName] = planet;
        
        // Adicionar anéis para Saturno
        if (planetData.rings) {
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
        
        // Adicionar satélites (luas)
        if (planetData.satellites) {
            planetData.satellites.forEach(satellite => {
                const moonGeometry = new THREE.SphereGeometry(satellite.radius, 16, 16);
                const moonMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
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
                
                planet.add(moon);
            });
        }
    }
    
    // Tentar carregar texturas
    loadTextures();
}

// Carregar texturas para os planetas
function loadTextures() {
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
            }
        );
    }
    
    // Carregar textura para cada planeta
    for (const planetName in PLANET_DATA) {
        const textureUrl = PLANET_DATA[planetName].textureUrl;
        if (textureUrl) {
            loadPlanetTexture(planetName, textureUrl);
        }
    }
}

// Ajustar o tamanho do renderer quando a janela é redimensionada
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Adicionar uma função para verificar e corrigir o alinhamento orbital dos planetas
function validatePlanetOrbits() {
    // Lista de planetas a serem verificados com mais rigor
    const planetsToCheck = ['jupiter', 'saturno', 'urano', 'netuno'];
    
    for (const planetName of planetsToCheck) {
        const planet = planets[planetName];
        const orbit = orbits[planetName];
        
        if (planet && orbit && planet.userData) {
            // Recalcular posição baseada nos parâmetros orbitais
            const userData = planet.userData;
            
            if (userData.a && userData.b && userData.c) {
                const angle = userData.angle;
                const x = userData.a * Math.cos(angle) - userData.c;
                const z = userData.b * Math.sin(angle);
                
                if (userData.inclination) {
                    const inclRad = THREE.MathUtils.degToRad(userData.inclination);
                    
                    // Tratamento especial para Saturno e Urano
                    if (planetName === 'saturno' || planetName === 'urano') {
                        // Aplicar a mesma transformação que a órbita visual
                        planet.position.set(x, 0, z);  // Primeiro no plano XZ
                        planet.position.y = z * Math.sin(inclRad);  // Depois aplicar inclinação em Y
                        planet.position.z = z * Math.cos(inclRad);  // E ajustar Z
                        
                        // Forçar o alinhamento, verificando se ainda está fora da órbita
                        const orbit = orbits[planetName];
                        if (orbit) {
                            // Forçar o planeta a estar no plano da órbita
                            // Esta é uma correção adicional que garante alinhamento visual
                            orbit.worldToLocal(planet.position.clone(), planet.position);
                            orbit.localToWorld(planet.position);
                        }
                    } else {
                        // Método padrão para outros planetas
                        const y = z * Math.sin(inclRad);
                        const newZ = z * Math.cos(inclRad);
                        
                        // Forçar a posição exata do planeta na órbita
                        planet.position.set(x, y, newZ);
                    }
                }
            }
        }
    }
}

// Animação
function animate() {
    requestAnimationFrame(animate);
    
    // Atualizar controles da câmera
    controls.update();
    
    // Atualizar posições dos planetas - este é o único lugar onde as posições são atualizadas
    updatePlanetPositions();
    
    // Animar cinturão de asteroides
    updateAsteroidBelt();
    
    // Incrementar contador de frames
    frameCount++;
    
    // Renderizar a cena
    renderer.render(scene, camera);
}

// Função auxiliar para criar uma órbita visual elíptica para uma lua
function createMoonOrbit(planet, satellite, a, b, c) {
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

// Função auxiliar para criar uma órbita visual circular para uma lua
function createMoonOrbitCircular(planet, distance) {
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

// Função para criar o cinturão de asteroides
function createAsteroidBelt() {
    // Definir parâmetros do cinturão
    const beltInnerRadius = 30;  // Entre Marte e Júpiter
    const beltOuterRadius = 40;
    const numAsteroids = 2000;   // Quantidade de asteroides
    
    // Criar um grupo para armazenar todos os asteroides
    asteroidBelt = new THREE.Group();
    
    // Geometria básica para os asteroides (esfera pequena)
    const asteroidGeometry = new THREE.SphereGeometry(0.08, 4, 4);
    
    // Materiais para os asteroides (variação de cores)
    const asteroidMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x8B8B8B, roughness: 0.8 }), // Cinza
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 }), // Marrom
        new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.7 })  // Cinza escuro
    ];
    
    // Criar cada asteroide
    for (let i = 0; i < numAsteroids; i++) {
        // Selecionar material aleatório
        const material = asteroidMaterials[Math.floor(Math.random() * asteroidMaterials.length)];
        
        // Criar o asteroid
        const asteroid = new THREE.Mesh(asteroidGeometry, material);
        
        // Posicionar aleatoriamente no cinturão
        const distance = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
        const angle = Math.random() * Math.PI * 2;
        
        // Altura aleatória (ligeiramente fora do plano da eclíptica)
        const height = (Math.random() - 0.5) * 5;
        
        // Definir posição
        asteroid.position.x = Math.cos(angle) * distance;
        asteroid.position.z = Math.sin(angle) * distance;
        asteroid.position.y = height;
        
        // Escala aleatória para variar tamanho
        const scale = 0.5 + Math.random() * 1.5;
        asteroid.scale.set(scale, scale, scale);
        
        // Rotação aleatória
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        asteroid.rotation.z = Math.random() * Math.PI;
        
        // Dados para animação
        asteroid.userData = {
            angle: angle,
            distance: distance,
            height: height,
            rotationSpeed: 0.005 + Math.random() * 0.01,
            orbitalSpeed: 0.0005 + Math.random() * 0.001
        };
        
        // Adicionar ao grupo
        asteroidBelt.add(asteroid);
    }
    
    // Adicionar o grupo à cena
    scene.add(asteroidBelt);
    
    // Criar um anel visual para mostrar a área do cinturão
    const beltRingGeometry = new THREE.RingGeometry(beltInnerRadius, beltOuterRadius, 64);
    const beltRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x666666, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15
    });
    
    const beltRing = new THREE.Mesh(beltRingGeometry, beltRingMaterial);
    beltRing.rotation.x = Math.PI / 2;
    scene.add(beltRing);
}

// Função para animar o cinturão de asteroides
function updateAsteroidBelt() {
    if (!asteroidBelt) return;
    
    // Iterar sobre cada asteroide
    asteroidBelt.children.forEach(asteroid => {
        const userData = asteroid.userData;
        
        // Atualizar ângulo orbital com fator de velocidade da simulação
        userData.angle += userData.orbitalSpeed * simulationSpeed;
        
        // Atualizar posição
        asteroid.position.x = Math.cos(userData.angle) * userData.distance;
        asteroid.position.z = Math.sin(userData.angle) * userData.distance;
        asteroid.position.y = userData.height;
        
        // Rotação do asteroide
        asteroid.rotation.y += userData.rotationSpeed * simulationSpeed;
        asteroid.rotation.x += userData.rotationSpeed * 0.5 * simulationSpeed;
    });
}

// Criar controles de velocidade da simulação
function createSimulationControls() {
    // Criar container para controles
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'simulation-controls';
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '10px';
    controlsContainer.style.left = '10px';
    controlsContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    controlsContainer.style.padding = '10px';
    controlsContainer.style.borderRadius = '5px';
    controlsContainer.style.color = 'white';
    controlsContainer.style.fontFamily = 'Arial, sans-serif';
    controlsContainer.style.zIndex = '100';
    
    // Título
    const title = document.createElement('div');
    title.textContent = 'Velocidade da Simulação';
    title.style.marginBottom = '5px';
    controlsContainer.appendChild(title);
    
    // Container para o slider e o valor
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    
    // Criar slider para a velocidade
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0';
    speedSlider.max = '2';
    speedSlider.step = '0.1';
    speedSlider.value = simulationSpeed.toString();
    speedSlider.style.width = '150px';
    
    // Exibir o valor atual
    const speedValue = document.createElement('span');
    speedValue.textContent = `${simulationSpeed.toFixed(1)}x`;
    speedValue.style.marginLeft = '10px';
    speedValue.style.width = '30px';
    
    // Ao mover o slider, atualizar a velocidade da simulação
    speedSlider.addEventListener('input', function() {
        simulationSpeed = parseFloat(this.value);
        speedValue.textContent = `${simulationSpeed.toFixed(1)}x`;
    });
    
    sliderContainer.appendChild(speedSlider);
    sliderContainer.appendChild(speedValue);
    controlsContainer.appendChild(sliderContainer);
    
    // Adicionar botões de controle rápido
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.marginTop = '5px';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    
    const buttonStyle = 'background-color: #444; border: none; color: white; padding: 2px 8px; ' +
                        'border-radius: 3px; margin: 0 2px; cursor: pointer;';
    
    // Botão para parar (0x)
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Parar';
    stopButton.style.cssText = buttonStyle;
    stopButton.addEventListener('click', function() {
        simulationSpeed = 0;
        speedSlider.value = '0';
        speedValue.textContent = '0.0x';
    });
    
    // Botão para velocidade normal (1x)
    const normalButton = document.createElement('button');
    normalButton.textContent = 'Normal';
    normalButton.style.cssText = buttonStyle;
    normalButton.addEventListener('click', function() {
        simulationSpeed = 1;
        speedSlider.value = '1';
        speedValue.textContent = '1.0x';
    });
    
    // Botão para velocidade rápida (2x)
    const fastButton = document.createElement('button');
    fastButton.textContent = 'Rápido';
    fastButton.style.cssText = buttonStyle;
    fastButton.addEventListener('click', function() {
        simulationSpeed = 2;
        speedSlider.value = '2';
        speedValue.textContent = '2.0x';
    });
    
    buttonsContainer.appendChild(stopButton);
    buttonsContainer.appendChild(normalButton);
    buttonsContainer.appendChild(fastButton);
    controlsContainer.appendChild(buttonsContainer);
    
    // Adicionar ao DOM
    document.body.appendChild(controlsContainer);
}

// Criar painel de informações detalhadas sobre os planetas
function createInfoPanel() {
    // Criar container para informações
    const infoPanel = document.createElement('div');
    infoPanel.id = 'planet-info';
    infoPanel.style.position = 'absolute';
    infoPanel.style.right = '10px';
    infoPanel.style.top = '10px';
    infoPanel.style.width = '300px';
    infoPanel.style.background = 'rgba(0, 0, 0, 0.7)';
    infoPanel.style.padding = '15px';
    infoPanel.style.borderRadius = '5px';
    infoPanel.style.color = 'white';
    infoPanel.style.fontFamily = 'Arial, sans-serif';
    infoPanel.style.zIndex = '100';
    infoPanel.style.maxHeight = '80vh';
    infoPanel.style.overflowY = 'auto';
    infoPanel.style.display = 'none'; // Inicialmente oculto
    
    // Adicionar título do painel
    const panelTitle = document.createElement('h2');
    panelTitle.textContent = 'Informações do Planeta';
    panelTitle.style.margin = '0 0 10px 0';
    panelTitle.style.textAlign = 'center';
    panelTitle.style.borderBottom = '1px solid #555';
    panelTitle.style.paddingBottom = '5px';
    infoPanel.appendChild(panelTitle);
    
    // Conteúdo (será preenchido quando um planeta for selecionado)
    const infoContent = document.createElement('div');
    infoContent.id = 'planet-info-content';
    infoPanel.appendChild(infoContent);
    
    // Botão de fechar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        infoPanel.style.display = 'none';
        selectedPlanet = null;
    });
    infoPanel.appendChild(closeButton);
    
    // Adicionar instruções
    const instructions = document.createElement('p');
    instructions.textContent = 'Clique em um planeta para ver suas informações';
    instructions.style.textAlign = 'center';
    instructions.style.fontSize = '0.9em';
    instructions.style.marginTop = '20px';
    instructions.style.color = '#aaa';
    instructions.id = 'planet-instructions';
    infoPanel.appendChild(instructions);
    
    // Adicionar ao DOM
    document.body.appendChild(infoPanel);
}

// Configurar seleção de planetas por clique
function setupPlanetSelection() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Função de clique para seleção de planetas
    window.addEventListener('click', function(event) {
        try {
            // Calcular posição normalizada do mouse
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            // Raycasting para identificar objetos clicados
            raycaster.setFromCamera(mouse, camera);
            
            // Obter objetos que intersectam o raio
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            if (intersects.length > 0) {
                // Procurar um planeta entre os objetos intersectados
                let foundPlanet = false;
                let foundPlanetName = null;
                
                for (let i = 0; i < intersects.length && !foundPlanet; i++) {
                    const object = intersects[i].object;
                    if (!object) continue;
                    
                    // Método mais robusto para encontrar o planeta clicado
                    // Verificar se o objeto ou qualquer um de seus ancestrais é um planeta
                    let currentObj = object;
                    while (currentObj && !foundPlanet) {
                        // Verificar todos os planetas
                        for (const planetName in planets) {
                            if (planets[planetName] === currentObj) {
                                console.log(`Planeta encontrado: ${planetName}`);
                                foundPlanetName = planetName;
                                foundPlanet = true;
                                break;
                            }
                        }
                        
                        // Subir na hierarquia de objetos
                        currentObj = currentObj.parent;
                    }
                }
                
                // Mostrar informações do planeta encontrado
                if (foundPlanet && foundPlanetName) {
                    try {
                        selectedPlanet = foundPlanetName;
                        showPlanetInfo(foundPlanetName);
                    } catch (e) {
                        console.error('Erro ao mostrar informações do planeta:', e);
                    }
                } else {
                    // Se nenhum planeta foi clicado, esconder o painel de informações
                    const infoPanel = document.getElementById('planet-info');
                    if (infoPanel) {
                        infoPanel.style.display = 'none';
                    }
                    selectedPlanet = null;
                }
            }
        } catch (error) {
            console.error('Erro no processamento do clique:', error);
        }
    });
}

// Função para exibir informações detalhadas do planeta selecionado
function showPlanetInfo(planetName) {
    if (!planetName || !PLANET_INFO[planetName]) {
        console.error(`Informações não encontradas para o planeta: ${planetName}`);
        return;
    }
    
    try {
        // Obter referências aos elementos DOM
        const infoPanel = document.getElementById('planet-info');
        const infoContent = document.getElementById('planet-info-content');
        const instructions = document.getElementById('planet-instructions');
        
        if (!infoPanel || !infoContent) {
            console.error('Elementos de informação não encontrados no DOM');
            return;
        }
        
        // Mostrar o painel
        infoPanel.style.display = 'block';
        
        // Ocultar instruções se existirem
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Dados do planeta
        const planetInfo = PLANET_INFO[planetName];
        
        // Construir HTML
        let htmlContent = `
            <h3>${planetInfo.nome}</h3>
            <div class="info-item">
                <strong>Tipo:</strong> ${planetInfo.tipo}
            </div>
            <div class="info-item">
                <strong>Composição:</strong> ${planetInfo.composicao}
            </div>
            <div class="info-item">
                <strong>Temperatura:</strong> ${planetInfo.temperatura}
            </div>
            <div class="info-item">
                <strong>Diâmetro:</strong> ${planetInfo.diametro}
            </div>`;
        
        // Adicionar informações condicionais
        if (planetInfo.orbita) {
            htmlContent += `
            <div class="info-item">
                <strong>Período Orbital:</strong> ${planetInfo.orbita}
            </div>`;
        }
        
        if (planetInfo.rotacao) {
            htmlContent += `
            <div class="info-item">
                <strong>Período de Rotação:</strong> ${planetInfo.rotacao}
            </div>`;
        }
        
        if (planetInfo.distanciaSol) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância ao Sol:</strong> ${planetInfo.distanciaSol}
            </div>`;
        }
        
        if (planetInfo.distanciaTerra) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância à Terra:</strong> ${planetInfo.distanciaTerra}
            </div>`;
        }
        
        // Adicionar descrição
        htmlContent += `
            <div class="info-description">
                ${planetInfo.descricao}
            </div>`;
        
        // Adicionar satélites se existirem
        if (PLANET_DATA[planetName] && 
            PLANET_DATA[planetName].satellites && 
            PLANET_DATA[planetName].satellites.length > 0) {
            
            htmlContent += `
            <div class="satellites-section">
                <h4>Satélites</h4>
                <ul>`;
            
            // Adicionar cada satélite
            PLANET_DATA[planetName].satellites.forEach(satellite => {
                const satelliteName = satellite.name.charAt(0).toUpperCase() + satellite.name.slice(1);
                htmlContent += `<li>${satelliteName}</li>`;
            });
            
            htmlContent += `
                </ul>
            </div>`;
        }
        
        // Atualizar o conteúdo HTML
        infoContent.innerHTML = htmlContent;
        
        // Aplicar estilos CSS sem usar const
        applyInfoPanelStyles(infoContent);
        
    } catch (error) {
        console.error('Erro ao mostrar informações do planeta:', error);
    }
}

// Função separada para aplicar estilos para evitar problemas com constantes
function applyInfoPanelStyles(infoContent) {
    if (!infoContent) return;
    
    // Estilizar itens de informação
    let infoItems = infoContent.querySelectorAll('.info-item');
    if (infoItems && infoItems.length > 0) {
        for (let i = 0; i < infoItems.length; i++) {
            let item = infoItems[i];
            if (item) {
                item.style.margin = '5px 0';
                item.style.fontSize = '0.9em';
            }
        }
    }
    
    // Estilizar descrição
    let description = infoContent.querySelector('.info-description');
    if (description) {
        description.style.marginTop = '15px';
        description.style.fontSize = '0.9em';
        description.style.lineHeight = '1.4';
        description.style.textAlign = 'justify';
    }
    
    // Estilizar seção de satélites
    let satellitesSection = infoContent.querySelector('.satellites-section');
    if (satellitesSection) {
        satellitesSection.style.marginTop = '15px';
        satellitesSection.style.borderTop = '1px solid #555';
        satellitesSection.style.paddingTop = '10px';
        
        let satellitesList = satellitesSection.querySelector('ul');
        if (satellitesList) {
            satellitesList.style.paddingLeft = '20px';
            satellitesList.style.fontSize = '0.9em';
            
            let satellitesItems = satellitesList.querySelectorAll('li');
            if (satellitesItems && satellitesItems.length > 0) {
                for (let i = 0; i < satellitesItems.length; i++) {
                    let item = satellitesItems[i];
                    if (item) {
                        item.style.margin = '3px 0';
                    }
                }
            }
        }
    }
}

// Configurar música de fundo
function setupBackgroundMusic() {
    // Criar elemento de áudio
    backgroundMusic = new Audio('sounds/universe-sound-track.mp3');
    backgroundMusic.loop = true; // Reproduzir em loop
    backgroundMusic.volume = 0.5; // Volume inicial (50%)
    
    // Reproduzir música (alguns navegadores podem bloquear autoplay)
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Reprodução automática bloqueada pelo navegador. Clique em qualquer lugar da tela para iniciar a música.');
            
            // Adicionar evento de clique para iniciar a música quando o usuário interagir com a página
            document.addEventListener('click', function startMusic() {
                backgroundMusic.play();
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });
    }
    
    // Criar controles para a música
    createMusicControls();
}

// Criar controles para a música de fundo
function createMusicControls() {
    // Criar container para controles de música
    const musicControls = document.createElement('div');
    musicControls.id = 'music-controls';
    musicControls.style.position = 'absolute';
    musicControls.style.bottom = '10px';
    musicControls.style.right = '10px';
    musicControls.style.background = 'rgba(0, 0, 0, 0.5)';
    musicControls.style.padding = '10px';
    musicControls.style.borderRadius = '5px';
    musicControls.style.color = 'white';
    musicControls.style.fontFamily = 'Arial, sans-serif';
    musicControls.style.zIndex = '100';
    musicControls.style.display = 'flex';
    musicControls.style.alignItems = 'center';
    
    // Ícone de música
    const musicIcon = document.createElement('div');
    musicIcon.innerHTML = '🎵';
    musicIcon.style.fontSize = '20px';
    musicIcon.style.marginRight = '10px';
    musicControls.appendChild(musicIcon);
    
    // Slider para controle de volume
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = backgroundMusic.volume.toString();
    volumeSlider.style.width = '100px';
    volumeSlider.style.margin = '0 10px';
    
    // Atualizar volume ao mover o slider
    volumeSlider.addEventListener('input', function() {
        backgroundMusic.volume = parseFloat(this.value);
        
        // Atualizar ícone de mudo/som baseado no volume
        if (parseFloat(this.value) === 0) {
            muteButton.textContent = '🔇';
        } else {
            muteButton.textContent = '🔊';
        }
    });
    
    musicControls.appendChild(volumeSlider);
    
    // Botão para silenciar/ativar som
    const muteButton = document.createElement('button');
    muteButton.textContent = '🔊';
    muteButton.style.background = 'transparent';
    muteButton.style.border = 'none';
    muteButton.style.color = 'white';
    muteButton.style.fontSize = '20px';
    muteButton.style.cursor = 'pointer';
    muteButton.style.padding = '0 5px';
    
    // Estado anterior do volume para restaurar após tirar o mudo
    let previousVolume = backgroundMusic.volume;
    
    // Alternar entre mudo e som
    muteButton.addEventListener('click', function() {
        if (backgroundMusic.volume > 0) {
            previousVolume = backgroundMusic.volume;
            backgroundMusic.volume = 0;
            volumeSlider.value = '0';
            this.textContent = '🔇';
        } else {
            backgroundMusic.volume = previousVolume;
            volumeSlider.value = previousVolume.toString();
            this.textContent = '🔊';
        }
    });
    
    musicControls.appendChild(muteButton);
    
    // Adicionar ao DOM
    document.body.appendChild(musicControls);
}

// Iniciar o simulador quando a página estiver carregada
window.addEventListener('load', init); 