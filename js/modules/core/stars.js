/**
 * Sistema de estrelas de fundo
 * Cria e gerencia o campo de estrelas para simular o espaço profundo
 */

// Variável para armazenar o objeto das estrelas
let stars;
let skybox;

/**
 * Cria o campo de estrelas de fundo
 * @param {Object} scene - Cena Three.js
 * @returns {Object} Objeto das estrelas
 */
export function createStars(scene) {
    // Adicionar o fundo da Via Láctea como skybox
    const textureLoader = new THREE.TextureLoader();
    
    // Usar caminho relativo para a textura
    const texturePath = 'textures/via-lactea.jpg';
    console.log('Carregando textura da Via Láctea:', texturePath);
    
    const skyboxTexture = textureLoader.load(texturePath, 
        // Callback de sucesso
        function(texture) {
            console.log('Textura da Via Láctea carregada com sucesso:', texture);
            // Verificar se o skybox já foi criado
            if (skybox && skybox.material) {
                console.log('Atualizando material do skybox com a textura carregada');
                skybox.material.map = texture;
                skybox.material.needsUpdate = true;
            }
        },
        // Callback de progresso
        function(xhr) {
            console.log('Progresso de carregamento da textura: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        // Callback de erro
        function(error) {
            console.error('Erro ao carregar a textura da Via Láctea:', error);
            // Tentar caminho alternativo como fallback
            console.log('Tentando caminho alternativo como fallback...');
            const fallbackPath = '../textures/via-lactea.jpg';
            textureLoader.load(fallbackPath, 
                function(texture) {
                    console.log('Textura carregada com sucesso usando caminho alternativo');
                    if (skybox && skybox.material) {
                        skybox.material.map = texture;
                        skybox.material.needsUpdate = true;
                    }
                },
                null,
                function(error) {
                    console.error('Erro ao carregar a textura com caminho alternativo:', error);
                }
            );
        }
    );
    
    // Criar uma esfera grande para o skybox
    const skyboxGeometry = new THREE.SphereGeometry(1000, 60, 40);
    // Inverter as normais para que a textura seja renderizada na parte interna da esfera
    skyboxGeometry.scale(-1, 1, 1);
    
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: skyboxTexture,
        side: THREE.BackSide, // Para renderizar a parte interna da esfera
        color: 0xffffff, // Cor branca para não alterar a textura
    });
    
    skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    skybox.name = 'skybox-via-lactea'; // Adicionar nome para facilitar a identificação
    skybox.visible = true; // Garantir que o skybox esteja visível por padrão
    scene.add(skybox);
    console.log('Skybox adicionado à cena com nome:', skybox.name);
    
    // Adicionar estrelas como pontos para adicionar mais profundidade
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // Cor branca para as estrelas
        size: 0.3, // Aumentar o tamanho das estrelas para maior visibilidade
        transparent: true,
        opacity: 0.9, // Aumentar a opacidade para maior visibilidade
        sizeAttenuation: true // Ativar atenuação de tamanho com a distância
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) { // Aumentar o número de estrelas
        const x = THREE.MathUtils.randFloatSpread(1800);
        const y = THREE.MathUtils.randFloatSpread(1800);
        const z = THREE.MathUtils.randFloatSpread(1800);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.name = 'stars-points'; // Adicionar nome para facilitar a identificação
    stars.visible = true; // Garantir que as estrelas estejam visíveis por padrão
    scene.add(stars);
    console.log('Estrelas adicionadas à cena com nome:', stars.name);
    
    // Verificar objetos na cena
    console.log('Objetos na cena após adicionar estrelas e skybox:');
    scene.children.forEach((child, index) => {
        console.log(`Objeto ${index}:`, child.name || 'sem nome', child.type, child.visible ? 'visível' : 'invisível');
    });
    
    return { stars, skybox };
}

/**
 * Alterna a visibilidade do campo de estrelas
 * @param {Boolean} visible - Se as estrelas devem estar visíveis
 */
export function toggleStarsVisibility(visible) {
    if (stars) {
        stars.visible = visible;
        console.log('Visibilidade das estrelas alterada para:', visible);
    }
}

/**
 * Alterna a visibilidade do skybox (Via Láctea)
 * @param {Boolean} visible - Se o skybox deve estar visível
 */
export function toggleSkyboxVisibility(visible) {
    if (skybox) {
        skybox.visible = visible;
        console.log('Visibilidade do skybox alterada para:', visible);
    } else {
        console.error('Skybox não encontrado ao tentar alterar visibilidade');
    }
}

/**
 * Retorna o objeto das estrelas
 * @returns {Object} Objeto das estrelas
 */
export function getStars() {
    return stars;
}

/**
 * Retorna o objeto do skybox
 * @returns {Object} Objeto do skybox
 */
export function getSkybox() {
    return skybox;
} 