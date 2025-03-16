/**
 * Sistema do cinturão de asteroides
 * Gerencia a criação e atualização dos asteroides
 */

// Variáveis para o cinturão de asteroides
let asteroidBelt;
let beltRing;

/**
 * Cria o cinturão de asteroides
 * @param {Object} scene - Cena Three.js
 * @returns {Object} Objeto com o cinturão de asteroides e seu anel visual
 */
export function createAsteroidBelt(scene) {
    // Definir parâmetros do cinturão
    const beltInnerRadius = 65;  // Logo após a órbita de Marte (55)
    const beltOuterRadius = 90;  // Antes da órbita de Júpiter (100)
    const numAsteroids = 3500;   // Aumentando a quantidade de asteroides para maior densidade
    
    // Criar um grupo para armazenar todos os asteroides
    asteroidBelt = new THREE.Group();
    asteroidBelt.name = "cinturaoAsteroides";
    
    // Carregar as texturas dos asteroides
    const textureLoader = new THREE.TextureLoader();
    const asteroidTextures = [
        textureLoader.load('textures/asteroid.avif'),
        textureLoader.load('textures/ceres.jpg'),
        textureLoader.load('textures/eris.jpg'),
        textureLoader.load('textures/makemake.jpg'),
        textureLoader.load('textures/moon.jpg'),
        textureLoader.load('textures/haumea.jpg')
    ];
    
    // Materiais base para os asteroides com as texturas carregadas
    const asteroidMaterials = asteroidTextures.map(texture => {
        return new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.8,
            metalness: 0.2,
            bumpScale: 0.02,
            side: THREE.DoubleSide // Renderiza ambos os lados das faces
        });
    });
    
    // Função para criar geometria de asteroide deformada
    function createAsteroidGeometry(baseRadius) {
        // Usamos um octaedro com mais subdivisões para maior solidez
        const geometry = new THREE.OctahedronGeometry(baseRadius, 2);
        
        // Obter os vértices da geometria para deformação
        const positions = geometry.attributes.position;
        
        // Aplicar deformações aleatórias aos vértices
        for (let i = 0; i < positions.count; i++) {
            // Vetores para manipular as posições
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positions, i);
            
            // Fator de deformação aleatório (entre 0.7 e 1.3) - menor deformação para evitar buracos
            const deformFactor = 0.7 + Math.random() * 0.6;
            
            // Aplicar deformação
            vertex.multiplyScalar(deformFactor);
            
            // Inserir de volta no buffer de posições
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        // Atualizar as normais da geometria após a deformação
        geometry.computeVertexNormals();
        
        return geometry;
    }
    
    // Criar cada asteroide
    for (let i = 0; i < numAsteroids; i++) {
        // Criar geometria deformada para este asteroide específico
        const asteroidGeometry = createAsteroidGeometry(0.03);
        
        // Selecionar um material aleatório da lista de materiais
        const materialIndex = Math.floor(Math.random() * asteroidMaterials.length);
        
        // Criar o asteroide com o material de textura selecionado
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterials[materialIndex].clone());
        asteroid.name = `asteroide_${i}`;
        
        // Para os primeiros 5 asteroides, usar texturas específicas e torná-los maiores (planetas anões)
        if (i < 5) {
            // Usar uma textura específica para cada planeta anão
            asteroid.material = asteroidMaterials[i+1].clone(); // Começar do índice 1 (ceres, eris, etc.)
            
            // Nomes dos planetas anões
            const dwarfPlanetNames = ['ceres', 'eris', 'makemake', 'moon', 'haumea'];
            asteroid.name = dwarfPlanetNames[i];
            
            // Tornar estes asteroides maiores (planetas anões)
            const scale = 1.0 + Math.random() * 0.5; // Escala maior
            asteroid.scale.set(scale, scale, scale);
            
            // Posicionar em locais específicos do cinturão
            const angle = (i / 5) * Math.PI * 2; // Distribuir uniformemente
            const distance = beltInnerRadius + (i / 4) * (beltOuterRadius - beltInnerRadius);
            
            // Altura menor para planetas anões (mais próximos do plano da eclíptica)
            const height = (Math.random() - 0.5) * 3;
            
            // Definir posição
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = height;
            
            // Dados para animação
            asteroid.userData = {
                angle: angle,
                distance: distance,
                height: height,
                rotationSpeed: 0.002 + Math.random() * 0.005, // Rotação mais lenta
                orbitalSpeed: 0.0003 + Math.random() * 0.0005, // Órbita mais lenta
                radius: 0.03 * scale, // Armazenar o raio escalado para referência
                isDwarfPlanet: true,
                name: dwarfPlanetNames[i]
            };
        } else {
            // Posicionar aleatoriamente no cinturão
            const distance = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
            const angle = Math.random() * Math.PI * 2;
            
            // Altura aleatória (mais espalhada verticalmente para um efeito mais realista)
            const height = (Math.random() - 0.5) * 10;
            
            // Definir posição
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = height;
            
            // Escala aleatória para variar tamanho (reduzida ainda mais)
            const scale = 0.1 + Math.random() * 0.6;
            asteroid.scale.set(scale, scale, scale);
            
            // Deformação adicional pela escala em um eixo
            const stretchAxis = Math.floor(Math.random() * 3); // 0, 1 ou 2 (x, y, z)
            const stretchFactor = 0.75 + Math.random() * 0.5;
            
            if (stretchAxis === 0) {
                asteroid.scale.x *= stretchFactor;
            } else if (stretchAxis === 1) {
                asteroid.scale.y *= stretchFactor;
            } else {
                asteroid.scale.z *= stretchFactor;
            }
            
            // Rotação aleatória mais interessante
            asteroid.rotation.x = Math.random() * Math.PI * 2;
            asteroid.rotation.y = Math.random() * Math.PI * 2;
            asteroid.rotation.z = Math.random() * Math.PI * 2;
            
            // Dados para animação
            asteroid.userData = {
                angle: angle,
                distance: distance,
                height: height,
                rotationSpeed: 0.005 + Math.random() * 0.01,
                orbitalSpeed: 0.0005 + Math.random() * 0.001,
                radius: 0.03 * scale // Armazenar o raio escalado para referência
            };
        }
        
        // Adicionar ao grupo
        asteroidBelt.add(asteroid);
    }
    
    // Adicionar o grupo à cena
    scene.add(asteroidBelt);
    
    // Criar um anel visual para mostrar a área do cinturão
    const beltRingGeometry = new THREE.RingGeometry(beltInnerRadius, beltOuterRadius, 64);
    const beltRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x887766, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    
    beltRing = new THREE.Mesh(beltRingGeometry, beltRingMaterial);
    beltRing.rotation.x = Math.PI / 2;
    beltRing.name = "anelCinturao";
    scene.add(beltRing);
    
    return { asteroidBelt, beltRing };
}

/**
 * Atualiza a posição e rotação dos asteroides
 * @param {Number} simulationSpeed - Velocidade da simulação
 */
export function updateAsteroidBelt(simulationSpeed) {
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

/**
 * Controla a visibilidade do cinturão de asteroides
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleAsteroidBeltVisibility(visible) {
    if (asteroidBelt) {
        asteroidBelt.visible = visible;
    }
}

/**
 * Controla a visibilidade do anel visual do cinturão
 * @param {Boolean} visible - Estado de visibilidade
 */
export function toggleBeltRingVisibility(visible) {
    if (beltRing) {
        beltRing.visible = visible;
    }
}

/**
 * Retorna os objetos do cinturão de asteroides
 * @returns {Object} Objeto com o cinturão e seu anel
 */
export function getAsteroidBelt() {
    return { asteroidBelt, beltRing };
}