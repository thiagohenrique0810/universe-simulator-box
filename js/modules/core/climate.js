/**
 * Sistema de padrões climáticos para planetas com atmosfera
 * Implementa nuvens dinâmicas, tempestades e outros fenômenos atmosféricos
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Constantes e configurações
const CLOUD_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CLOUD_FRAGMENT_SHADER = `
uniform sampler2D cloudTexture;
uniform sampler2D cloudNoiseTexture;
uniform float time;
uniform float coverage; // 0.0 = sem nuvens, 1.0 = totalmente coberto
uniform float density;  // densidade das nuvens
uniform float brightness;
uniform vec3 cloudColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Função para misturar nuvens com ruído para criar padrões dinâmicos
vec4 getClouds(vec2 uv) {
    // Coordenadas de textura animadas para movimento das nuvens
    vec2 movingUv = vUv + vec2(time * 0.0008, time * 0.0003);
    vec2 movingUv2 = vUv + vec2(time * -0.0005, time * 0.0004);
    
    // Obter textura de nuvens base
    vec4 baseCloud = texture2D(cloudTexture, movingUv);
    
    // Obter textura de ruído para variação
    vec4 noiseA = texture2D(cloudNoiseTexture, movingUv2);
    vec4 noiseB = texture2D(cloudNoiseTexture, movingUv2 * 2.5);
    
    // Misturar nuvens com ruído
    float cloudMask = baseCloud.r;
    cloudMask = cloudMask * noiseA.g * 1.5;
    cloudMask = cloudMask * noiseB.b;
    
    // Ajustar cobertura e densidade
    cloudMask = smoothstep(1.0 - coverage, 1.0 - coverage + 0.1, cloudMask);
    cloudMask = pow(cloudMask, 1.0 / density);
    
    // Ajustar efeito de borda para nuvens mais realistas
    float fresnel = 1.0 - max(0.0, dot(normalize(-vPosition), vNormal));
    float edgeEffect = pow(fresnel, 4.0) * 0.5;
    
    // Cor final das nuvens
    vec3 finalColor = cloudColor * brightness;
    
    // Ajustar a transparência com base no mascaramento
    return vec4(finalColor, cloudMask * (1.0 - edgeEffect));
}

void main() {
    vec4 clouds = getClouds(vUv);
    
    // Aplicar a cor das nuvens com a transparência calculada
    gl_FragColor = clouds;
}
`;

/**
 * Configurações de clima para diferentes planetas
 */
const CLIMATE_SETTINGS = {
    terra: {
        hasClouds: true,
        cloudCoverage: 0.6,         // Cobertura de nuvens (0-1)
        cloudDensity: 1.2,          // Densidade (1-2)
        cloudBrightness: 1.0,       // Brilho (0.5-1.5)
        cloudColor: new THREE.Color(0xffffff),
        cloudTextureUrl: 'textures/earth_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 1.0,            // Velocidade do ciclo climático
        hasStorms: true,            // Tem tempestades
        stormFrequency: 0.3,        // Frequência de tempestades (0-1)
        hasSeasons: true,           // Tem estações
        seasonLength: 2000,         // Duração da estação (frames)
        weatherPatterns: ['temperate', 'tropical', 'polar'], // Padrões climáticos
        cloudLayerScale: 1.02       // Escala da camada de nuvens em relação ao planeta
    },
    venus: {
        hasClouds: true,
        cloudCoverage: 0.95,        // Cobertura quase total
        cloudDensity: 1.8,          // Muito densas
        cloudBrightness: 0.9,       // Menos brilhantes devido à atmosfera densa
        cloudColor: new THREE.Color(0xf5e6c8), // Amarelado
        cloudTextureUrl: 'textures/venus_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 0.4,            // Mais lento devido à rotação lenta
        hasStorms: true,
        stormFrequency: 0.6,        // Mais tempestades (clima extremo)
        hasSeasons: false,
        weatherPatterns: ['acid', 'hot'], // Padrões de clima venusiano
        cloudLayerScale: 1.03
    },
    titan: {
        hasClouds: true,
        cloudCoverage: 0.7,
        cloudDensity: 1.5,
        cloudBrightness: 0.7,
        cloudColor: new THREE.Color(0xe0c890), // Alaranjado
        cloudTextureUrl: 'textures/titan_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 0.6,
        hasStorms: true,
        stormFrequency: 0.4,
        hasSeasons: true,
        seasonLength: 3000,         // Estações longas
        weatherPatterns: ['methane', 'ethane'], // Metano e etano
        cloudLayerScale: 1.025
    },
    jupiter: {
        hasClouds: true,
        cloudCoverage: 0.9,
        cloudDensity: 1.4,
        cloudBrightness: 1.1,
        cloudColor: new THREE.Color(0xeadfbf), // Cor das faixas de Júpiter
        cloudTextureUrl: 'textures/jupiter_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 1.5,            // Rápido devido à rotação rápida
        hasStorms: true,
        stormFrequency: 0.8,        // Muitas tempestades (Grande Mancha Vermelha)
        hasSeasons: false,
        weatherPatterns: ['bands', 'vortex'], // Bandas e vórtices
        cloudLayerScale: 1.01
    },
    saturno: {
        hasClouds: true,
        cloudCoverage: 0.85,
        cloudDensity: 1.3,
        cloudBrightness: 1.0,
        cloudColor: new THREE.Color(0xe1d7b7), // Amarelado
        cloudTextureUrl: 'textures/saturn_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 1.4,
        hasStorms: true,
        stormFrequency: 0.7,
        hasSeasons: false,
        weatherPatterns: ['bands', 'hexagon'], // Hexágono polar
        cloudLayerScale: 1.015
    },
    urano: {
        hasClouds: true,
        cloudCoverage: 0.6,
        cloudDensity: 1.1,
        cloudBrightness: 0.9,
        cloudColor: new THREE.Color(0xc1e3e5), // Azul-esverdeado claro
        cloudTextureUrl: 'textures/uranus_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 0.8,
        hasStorms: true,
        stormFrequency: 0.3,
        hasSeasons: true,
        seasonLength: 4000,         // Estações muito longas
        weatherPatterns: ['uniform', 'spotty'], // Geralmente uniforme com manchas ocasionais
        cloudLayerScale: 1.02
    },
    netuno: {
        hasClouds: true,
        cloudCoverage: 0.7,
        cloudDensity: 1.2,
        cloudBrightness: 0.95,
        cloudColor: new THREE.Color(0x3c5ddd), // Azul intenso
        cloudTextureUrl: 'textures/neptune_clouds.jpg',
        noiseTextureUrl: 'textures/cloud_noise.jpg',
        cycleSpeed: 1.3,
        hasStorms: true,
        stormFrequency: 0.5,        // Grande Mancha Escura
        hasSeasons: false,
        weatherPatterns: ['storms', 'windy'], // Tempestades e ventos fortes
        cloudLayerScale: 1.03
    }
};

// Rastreamento de camadas de clima por planeta
const climateLayers = {};

// Texturas pré-carregadas
const loadedTextures = {};

/**
 * Pré-carrega texturas para uso posterior
 * @returns {Promise} Promessa resolvida quando todas as texturas foram carregadas
 */
export function preloadClimateTextures() {
    console.log('Pré-carregando texturas de nuvens e clima...');
    const textureLoader = new THREE.TextureLoader();
    const promises = [];
    
    // Lista de URLs únicas para carregar
    const uniqueUrls = new Set();
    
    // Coletar todas as URLs de texturas únicas
    Object.values(CLIMATE_SETTINGS).forEach(settings => {
        if (settings.cloudTextureUrl) uniqueUrls.add(settings.cloudTextureUrl);
        if (settings.noiseTextureUrl) uniqueUrls.add(settings.noiseTextureUrl);
    });
    
    // Carregar cada textura
    uniqueUrls.forEach(url => {
        const promise = new Promise((resolve, reject) => {
            textureLoader.load(
                url,
                texture => {
                    loadedTextures[url] = texture;
                    console.log(`Textura carregada: ${url}`);
                    resolve(texture);
                },
                undefined,
                error => {
                    console.error(`Erro ao carregar textura ${url}:`, error);
                    reject(error);
                }
            );
        });
        
        promises.push(promise);
    });
    
    return Promise.all(promises);
}

/**
 * Obter uma textura pré-carregada
 * @param {String} url - URL da textura
 * @returns {THREE.Texture|undefined} Textura ou undefined se não estiver carregada
 */
function getPreloadedTexture(url) {
    return loadedTextures[url];
}

/**
 * Aplica padrões climáticos a um planeta
 * @param {THREE.Object3D} planet - Objeto do planeta
 * @param {String} planetName - Nome do planeta
 * @param {Object} customSettings - Configurações personalizadas (opcional)
 * @returns {Object} Referência à camada climática criada
 */
export function applyClimateSystem(planet, planetName, customSettings = {}) {
    // Verificar se o planeta tem configurações climáticas
    if (!CLIMATE_SETTINGS[planetName] && !customSettings.forceClimate) {
        console.log(`Planeta ${planetName} não tem configurações climáticas definidas.`);
        return null;
    }
    
    // Mesclar configurações padrão com personalizadas
    const settings = Object.assign({}, 
        CLIMATE_SETTINGS[planetName] || {},
        customSettings
    );
    
    console.log(`Aplicando sistema climático para ${planetName}...`);
    
    // Remover sistema climático existente, se houver
    removeClimateSystem(planet);
    
    // Se o planeta tem nuvens, criar camada de nuvens
    if (settings.hasClouds) {
        const cloudLayer = createCloudLayer(planet, settings);
        
        // Armazenar referência à camada climática para atualização posterior
        climateLayers[planet.uuid] = {
            planet: planet,
            planetName: planetName,
            cloudLayer: cloudLayer,
            settings: settings,
            time: 0,
            stormTimer: 0,
            seasonTimer: 0,
            currentSeason: 0, // 0-3: primavera, verão, outono, inverno
            activeStorms: []
        };
        
        return climateLayers[planet.uuid];
    }
    
    return null;
}

/**
 * Cria uma camada de nuvens para um planeta
 * @param {THREE.Object3D} planet - Objeto do planeta
 * @param {Object} settings - Configurações climáticas
 * @returns {THREE.Mesh} Objeto da camada de nuvens
 */
function createCloudLayer(planet, settings) {
    // Obter o raio do planeta
    const planetRadius = planet.userData.radius || 1.0;
    
    // Criar geometria para a camada de nuvens (ligeiramente maior que o planeta)
    const cloudGeometry = new THREE.SphereGeometry(
        planetRadius * settings.cloudLayerScale, 
        32, 
        32
    );
    
    // Verificar se as texturas estão disponíveis
    let cloudTexture = null;
    let noiseTexture = null;
    
    try {
        // Tentar obter texturas pré-carregadas
        cloudTexture = getPreloadedTexture(settings.cloudTextureUrl);
        noiseTexture = getPreloadedTexture(settings.noiseTextureUrl);
        
        // Se as texturas não estiverem pré-carregadas, tentar carregá-las agora
        if (!cloudTexture) {
            console.log(`Carregando textura de nuvens para ${planet.name}: ${settings.cloudTextureUrl}`);
            cloudTexture = new THREE.TextureLoader().load(settings.cloudTextureUrl);
        }
        
        if (!noiseTexture) {
            console.log(`Carregando textura de ruído para ${planet.name}: ${settings.noiseTextureUrl}`);
            noiseTexture = new THREE.TextureLoader().load(settings.noiseTextureUrl);
        }
    } catch (error) {
        console.error(`Erro ao carregar texturas para o sistema climático de ${planet.name}:`, error);
        // Usar textura padrão como fallback
        cloudTexture = new THREE.Texture();
        noiseTexture = new THREE.Texture();
    }
    
    // Criar material com shader personalizado
    const cloudMaterial = new THREE.ShaderMaterial({
        uniforms: {
            cloudTexture: { value: cloudTexture },
            cloudNoiseTexture: { value: noiseTexture },
            time: { value: 0.0 },
            coverage: { value: settings.cloudCoverage },
            density: { value: settings.cloudDensity },
            brightness: { value: settings.cloudBrightness },
            cloudColor: { value: settings.cloudColor }
        },
        vertexShader: CLOUD_VERTEX_SHADER,
        fragmentShader: CLOUD_FRAGMENT_SHADER,
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        depthWrite: false // Importante para não afetar o depth buffer
    });
    
    // Criar mesh
    const cloudLayer = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudLayer.name = `${planet.name}_clouds`;
    cloudLayer.userData.isClimateLayer = true;
    
    // Garantir que a layer de nuvens não afeta a textura do planeta
    cloudLayer.renderOrder = 1; // Renderizar depois do planeta
    
    // Adicionar a camada de nuvens ao planeta
    planet.add(cloudLayer);
    
    console.log(`Camada de nuvens criada para ${planet.name}`);
    return cloudLayer;
}

/**
 * Remove o sistema climático de um planeta
 * @param {THREE.Object3D} planet - Objeto do planeta
 */
export function removeClimateSystem(planet) {
    if (climateLayers[planet.uuid]) {
        const { cloudLayer } = climateLayers[planet.uuid];
        
        // Remover camada de nuvens
        if (cloudLayer && planet.children.includes(cloudLayer)) {
            planet.remove(cloudLayer);
            
            // Liberar recursos
            if (cloudLayer.geometry) cloudLayer.geometry.dispose();
            if (cloudLayer.material) {
                if (cloudLayer.material.uniforms) {
                    Object.values(cloudLayer.material.uniforms).forEach(uniform => {
                        if (uniform.value && uniform.value.isTexture) {
                            uniform.value.dispose();
                        }
                    });
                }
                cloudLayer.material.dispose();
            }
        }
        
        // Remover registro
        delete climateLayers[planet.uuid];
    }
}

/**
 * Atualiza todos os sistemas climáticos ativos
 * @param {Number} deltaTime - Tempo decorrido desde o último quadro (em segundos)
 * @param {Number} timeScale - Escala de tempo da simulação
 */
export function updateClimateSystems(deltaTime, timeScale) {
    for (const id in climateLayers) {
        const layer = climateLayers[id];
        
        // Atualizar tempo
        layer.time += deltaTime * timeScale * layer.settings.cycleSpeed;
        
        // Atualizar material da camada de nuvens
        if (layer.cloudLayer && layer.cloudLayer.material && layer.cloudLayer.material.uniforms) {
            layer.cloudLayer.material.uniforms.time.value = layer.time;
            
            // Atualizar cobertura de nuvens com base na estação atual, se aplicável
            if (layer.settings.hasSeasons) {
                // Avançar temporizador de estação
                layer.seasonTimer += deltaTime * timeScale;
                
                // Verificar mudança de estação
                if (layer.seasonTimer >= layer.settings.seasonLength) {
                    layer.seasonTimer = 0;
                    layer.currentSeason = (layer.currentSeason + 1) % 4;
                    console.log(`Planeta ${layer.planetName} mudou para a estação ${getSeasonName(layer.currentSeason)}`);
                }
                
                // Ajustar cobertura de nuvens com base na estação
                const seasonalCoverage = getSeasonalCloudCoverage(layer.settings.cloudCoverage, layer.currentSeason);
                layer.cloudLayer.material.uniforms.coverage.value = seasonalCoverage;
            }
            
            // Gerenciar tempestades
            if (layer.settings.hasStorms) {
                // Avançar temporizador de tempestade
                layer.stormTimer += deltaTime * timeScale;
                
                // Verificar se deve iniciar uma nova tempestade
                if (layer.stormTimer >= 100 && Math.random() < layer.settings.stormFrequency) {
                    startStorm(layer);
                    layer.stormTimer = 0;
                }
                
                // Atualizar tempestades ativas
                updateStorms(layer, deltaTime * timeScale);
            }
        }
    }
}

/**
 * Inicia uma tempestade em um planeta
 * @param {Object} layer - Camada climática do planeta
 */
function startStorm(layer) {
    const stormType = getRandomStormType(layer.settings.weatherPatterns);
    const duration = 50 + Math.random() * 200; // 50-250 frames
    
    console.log(`Tempestade do tipo ${stormType} iniciada em ${layer.planetName}`);
    
    // Adicionar tempestade à lista de tempestades ativas
    layer.activeStorms.push({
        type: stormType,
        duration: duration,
        elapsed: 0,
        intensity: 0.1 + Math.random() * 0.4, // 0.1-0.5
        position: {
            latitude: Math.random() * 180 - 90,  // -90 a 90
            longitude: Math.random() * 360 - 180 // -180 a 180
        }
    });
    
    // Limitar número de tempestades ativas
    if (layer.activeStorms.length > 3) {
        layer.activeStorms.shift(); // Remover a tempestade mais antiga
    }
}

/**
 * Atualiza as tempestades ativas
 * @param {Object} layer - Camada climática do planeta
 * @param {Number} deltaTime - Tempo decorrido desde o último quadro
 */
function updateStorms(layer, deltaTime) {
    // Atualizar cada tempestade ativa
    for (let i = layer.activeStorms.length - 1; i >= 0; i--) {
        const storm = layer.activeStorms[i];
        
        // Atualizar tempo decorrido
        storm.elapsed += deltaTime;
        
        // Verificar se a tempestade terminou
        if (storm.elapsed >= storm.duration) {
            layer.activeStorms.splice(i, 1);
            continue;
        }
        
        // Atualizar intensidade da tempestade (crescimento, pico, dissipação)
        const progress = storm.elapsed / storm.duration;
        
        if (progress < 0.3) {
            // Fase de crescimento
            storm.currentIntensity = storm.intensity * (progress / 0.3);
        } else if (progress < 0.7) {
            // Fase de pico
            storm.currentIntensity = storm.intensity;
        } else {
            // Fase de dissipação
            storm.currentIntensity = storm.intensity * (1 - ((progress - 0.7) / 0.3));
        }
        
        // Implementar efeitos visuais específicos da tempestade no shader de nuvens
        // Isso pode incluir ajustes localizados na densidade, cor, etc.
    }
    
    // Se houver tempestades ativas, adicionar um pouco de turbulência à cobertura de nuvens
    if (layer.activeStorms.length > 0) {
        const turbulence = 0.05 + (layer.activeStorms.length * 0.03);
        const baseCoverage = layer.settings.hasSeasons 
            ? getSeasonalCloudCoverage(layer.settings.cloudCoverage, layer.currentSeason) 
            : layer.settings.cloudCoverage;
        
        // Ajustar cobertura de nuvens para refletir tempestades
        const stormyCloudCoverage = Math.min(1.0, baseCoverage + turbulence);
        layer.cloudLayer.material.uniforms.coverage.value = stormyCloudCoverage;
        
        // Aqui também poderiam ser aplicados efeitos adicionais como raios, etc.
    }
}

/**
 * Obtém uma cobertura de nuvens ajustada para a estação atual
 * @param {Number} baseCoverage - Cobertura base de nuvens
 * @param {Number} season - Estação atual (0-3)
 * @returns {Number} Cobertura ajustada
 */
function getSeasonalCloudCoverage(baseCoverage, season) {
    // Primavera: mais nuvens, Verão: menos nuvens, Outono: mais nuvens, Inverno: muito mais nuvens
    const seasonalModifiers = [0.1, -0.2, 0.1, 0.25];
    const seasonalCoverage = Math.max(0, Math.min(1, baseCoverage + seasonalModifiers[season]));
    return seasonalCoverage;
}

/**
 * Obtém um tipo de tempestade aleatório com base nos padrões climáticos do planeta
 * @param {Array} weatherPatterns - Lista de padrões climáticos possíveis
 * @returns {String} Tipo de tempestade
 */
function getRandomStormType(weatherPatterns) {
    if (!weatherPatterns || weatherPatterns.length === 0) {
        return 'generic';
    }
    
    // Selecionar um padrão climático aleatório
    const pattern = weatherPatterns[Math.floor(Math.random() * weatherPatterns.length)];
    
    // Mapeamento de padrões climáticos para tipos de tempestade
    const stormTypes = {
        temperate: ['rain', 'thunder', 'snow'],
        tropical: ['hurricane', 'monsoon', 'typhoon'],
        polar: ['blizzard', 'snow'],
        acid: ['acidRain', 'sulfurStorm'],
        hot: ['dustStorm', 'heatWave'],
        methane: ['methaneClouds', 'ethaneRain'],
        ethane: ['hydrocarbon', 'nitrogenStorm'],
        bands: ['jovianCyclone', 'bandStorm'],
        vortex: ['giantVortex', 'spotStorm'],
        hexagon: ['hexagonalStorm', 'polarCyclone'],
        uniform: ['coldFront', 'icyStorm'],
        spotty: ['methanePatch', 'ammoniaClouds'],
        storms: ['darkSpot', 'superStorm'],
        windy: ['highWinds', 'stratosphericStorm']
    };
    
    // Obter tipos de tempestade para o padrão selecionado
    const possibleTypes = stormTypes[pattern] || ['generic'];
    
    // Retornar um tipo aleatório
    return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
}

/**
 * Retorna o nome da estação com base no índice
 * @param {Number} seasonIndex - Índice da estação (0-3)
 * @returns {String} Nome da estação
 */
function getSeasonName(seasonIndex) {
    const seasons = ['Primavera', 'Verão', 'Outono', 'Inverno'];
    return seasons[seasonIndex] || 'Desconhecida';
}

/**
 * Ativa ou desativa todos os sistemas climáticos
 * @param {Object} planets - Objeto contendo referências a todos os planetas
 * @param {Boolean} enabled - Estado desejado
 */
export function toggleClimateSystems(planets, enabled) {
    for (const planetName in planets) {
        const planet = planets[planetName];
        
        planet.traverse(child => {
            if (child.userData && child.userData.isClimateLayer) {
                child.visible = enabled;
            }
        });
    }
    
    console.log(`Sistemas climáticos ${enabled ? 'ativados' : 'desativados'}`);
} 