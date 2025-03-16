/**
 * Sistema de Iluminação Realista
 * Gerencia iluminação, sombras e efeitos atmosféricos
 */
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// Variáveis globais do módulo
let ambientLight = null;
let sunLight = null;
let directionalLight = null;
let lightTarget = null;
let currentEclipses = { solar: [], lunar: [] };

/**
 * Configurações padrão para o sistema de iluminação
 */
const LIGHTING_SETTINGS = {
    sunIntensity: 1.5,         // Intensidade da luz do sol
    sunColor: 0xffffcc,        // Cor da luz do sol
    sunDistance: 0,            // Distância máxima de alcance (0 = infinito)
    sunDecay: 2,               // Taxa de decaimento da intensidade com a distância
    ambientIntensity: 0.15,    // Intensidade da luz ambiente
    castShadows: true,         // Ativar projeção de sombras
    enableEclipses: true,      // Ativar detecção de eclipses
    shadowMapSize: 2048,       // Tamanho da textura de sombra (maior = melhor qualidade, maior custo)
    shadowBias: -0.001,        // Viés da sombra (para evitar artefatos visuais)
    shadowFrustumSize: 200,    // Tamanho do frustum da câmera da sombra
    shadowDistance: 500,       // Distância máxima para projeção de sombras
    usePCFShadows: true,       // Usar sombras PCF (mais suaves)
    eclipseThreshold: 0.95,    // Limiar de cobertura para considerar um eclipse
    maxEclipseObjects: 10      // Número máximo de objetos a verificar para efeitos de eclipse
};

let shadowUpdateFrames = 5; // Atualiza sombras a cada N frames para melhor desempenho

/**
 * Inicializa o sistema de iluminação realista
 * @param {THREE.Scene} scene - Cena Three.js
 * @param {THREE.Object3D} sol - Objeto do sol (opcional)
 * @param {Object} customSettings - Configurações personalizadas
 */
export function initRealisticLighting(scene, sol, customSettings = {}) {
    console.log('Inicializando sistema de iluminação realista...');
    
    // Mesclar configurações padrão com personalizadas
    const settings = Object.assign({}, LIGHTING_SETTINGS, customSettings);
    
    // Remover qualquer sistema de iluminação existente
    removeLightingSystem(scene);
    
    // Verificar se o renderer suporta sombras
    if (!THREE.WebGLRenderer.prototype.shadowMap) {
        console.warn('O seu navegador não suporta renderização de sombras via WebGL.');
        settings.castShadows = false;
    }
    
    // Configurar luz ambiente para iluminação global mínima
    ambientLight = new THREE.AmbientLight(0xffffff, settings.ambientIntensity);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
    
    // Verificar se o sol foi fornecido e é válido
    if (!sol) {
        console.warn('Objeto sol não fornecido ou inválido. Criando um sol padrão...');
        // Criar um sol padrão no centro da cena
        sol = new THREE.Group();
        sol.name = 'solPadrao';
        sol.position.set(0, 0, 0);
        scene.add(sol);
    }
    
    // Configurar luz principal do sol
    setupSunLight(scene, sol, settings);
    
    // Se sombras estiverem ativadas, configurar luz direcional para sombras
    if (settings.castShadows) {
        setupShadowLight(scene, sol, settings);
    }
    
    // Configurar detector de eclipses
    setupEclipseDetector();
    
    // Retornar API do sistema de iluminação
    return {
        updateLighting: (planets, camera) => updateLighting(scene, sol, planets, camera, settings),
        setIntensity: (intensity) => {
            if (sunLight) sunLight.intensity = intensity;
            if (directionalLight) directionalLight.intensity = intensity * 0.8;
            settings.sunIntensity = intensity;
        },
        setShadowsEnabled: (enabled) => {
            settings.castShadows = enabled;
            if (directionalLight) directionalLight.castShadow = enabled;
        },
        setEclipsesEnabled: (enabled) => {
            settings.enableEclipses = enabled;
            if (!enabled) {
                // Limpar efeitos de eclipse
                clearEclipseEffects(planets);
            }
        },
        getSunLight: () => sunLight,
        getDirectionalLight: () => directionalLight,
        getSettings: () => ({ ...settings }),  // Retorna uma cópia das configurações
        cleanup: () => removeLightingSystem(scene)
    };
}

/**
 * Configura a luz principal emitida pelo sol
 * @param {THREE.Scene} scene - Cena Three.js
 * @param {THREE.Object3D} sol - Objeto do sol
 * @param {Object} settings - Configurações de iluminação
 */
function setupSunLight(scene, sol, settings) {
    // Verificar se o sol existe e tem children antes de tentar acessá-lo
    if (sol && sol.children) {
        // Remover luz existente no sol, se houver
        sol.children.forEach(child => {
            if (child.isLight) {
                sol.remove(child);
            }
        });
    }
    
    // Criar luz pontual no centro do sol
    const sunLight = new THREE.PointLight(
        settings.sunColor,
        settings.sunIntensity,
        settings.sunDistance,
        settings.sunDecay
    );
    sunLight.name = 'sunLight';
    
    // Adicionar luz ao sol ou à cena
    if (sol) {
        sol.add(sunLight);
    } else {
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);
    }
    
    // Retornar referência à luz
    return sunLight;
}

/**
 * Configura luz direcional para sombras
 * @param {THREE.Scene} scene - Cena Three.js
 * @param {THREE.Object3D} sol - Objeto do sol
 * @param {Object} settings - Configurações de iluminação
 */
function setupShadowLight(scene, sol, settings) {
    // Criar alvo para a luz direcional
    const lightTarget = new THREE.Object3D();
    lightTarget.name = 'lightTarget';
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);
    
    // Criar luz direcional para sombras (emana do sol, mas com projeção paralela para sombras melhores)
    const directionalLight = new THREE.DirectionalLight(0xffffcc, settings.sunIntensity * 0.8);
    directionalLight.name = 'directionalLight';
    directionalLight.castShadow = settings.castShadows;
    directionalLight.shadow.bias = settings.shadowBias;
    
    // Configurar qualidade das sombras
    directionalLight.shadow.mapSize.width = settings.shadowMapSize;
    directionalLight.shadow.mapSize.height = settings.shadowMapSize;
    
    // Configurar frustum da luz direcional para otimizar a qualidade das sombras
    const size = settings.shadowFrustumSize;
    directionalLight.shadow.camera.left = -size;
    directionalLight.shadow.camera.right = size;
    directionalLight.shadow.camera.top = size;
    directionalLight.shadow.camera.bottom = -size;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    
    // Colocar a luz direcional na posição do sol ou no centro da cena
    if (sol) {
        sol.add(directionalLight);
    } else {
        directionalLight.position.set(0, 0, 0);
        scene.add(directionalLight);
    }
    
    directionalLight.target = lightTarget;
    
    // Retornar referência à luz
    return {
        light: directionalLight,
        target: lightTarget
    };
}

/**
 * Configura o detector de eclipses
 */
function setupEclipseDetector() {
    console.log('Sistema de detecção de eclipses inicializado');
    
    // A detecção de eclipses é realizada durante a atualização de iluminação
    // e não requer configuração adicional
}

/**
 * Atualiza o sistema de iluminação
 * @param {THREE.Scene} scene - Cena principal
 * @param {Object} sol - Objeto do sol
 * @param {Object} planets - Objeto com todos os planetas
 * @param {THREE.Camera} camera - Câmera principal
 * @param {Object} settings - Configurações de iluminação
 */
export function updateLighting(scene, sol, planets, camera, settings) {
    // Contador estático para limitar atualizações de sombra
    updateLighting.frameCount = (updateLighting.frameCount || 0) + 1;
    
    // Atualizar sombras apenas em alguns frames para melhor desempenho
    const updateShadowsThisFrame = (updateLighting.frameCount % shadowUpdateFrames === 0);
    
    // Atualizar posição da luz direcional para acompanhar o sol
    if (directionalLight && updateShadowsThisFrame) {
        directionalLight.position.copy(sol.position);
        
        // Otimizar frustum da sombra com base na posição da câmera
        if (settings.optimizeShadows) {
            optimizeShadowFrustum(camera, directionalLight, settings);
        }
    }
    
    // Detectar e atualizar eclipses
    if (settings.enableEclipses) {
        detectEclipses(sol, planets, settings);
    }
}

/**
 * Otimiza o frustum da sombra com base na posição da câmera
 * @param {THREE.Camera} camera - Câmera principal
 * @param {THREE.DirectionalLight} light - Luz direcional
 * @param {Object} settings - Configurações de iluminação
 */
function optimizeShadowFrustum(camera, light, settings) {
    // Obter posição da câmera
    const cameraPosition = camera.position.clone();
    
    // Calcular centro do frustum com base na posição da câmera
    const frustumCenter = cameraPosition.clone();
    
    // Ajustar tamanho do frustum com base na distância da câmera
    const distanceFromOrigin = cameraPosition.length();
    let frustumSize = settings.shadowFrustumSize;
    
    // Escalar o frustum com base na distância (quanto mais longe, maior o frustum)
    if (distanceFromOrigin > 100) {
        frustumSize = Math.min(settings.shadowFrustumSize * 2, distanceFromOrigin * 0.8);
    }
    
    // Atualizar frustum da câmera de sombra
    light.shadow.camera.left = -frustumSize;
    light.shadow.camera.right = frustumSize;
    light.shadow.camera.top = frustumSize;
    light.shadow.camera.bottom = -frustumSize;
    
    // Atualizar alvo da luz para o centro do frustum
    if (light.target) {
        light.target.position.copy(frustumCenter);
    }
    
    // Atualizar a câmera de sombra
    light.shadow.camera.updateProjectionMatrix();
}

/**
 * Detecta eclipses solares e lunares
 * @param {Object} sol - Objeto do sol
 * @param {Object} planets - Objeto com todos os planetas
 * @param {Object} settings - Configurações de iluminação
 */
function detectEclipses(sol, planets, settings) {
    // Limpar eclipses atuais
    currentEclipses.solar = [];
    currentEclipses.lunar = [];
    
    // Matriz para armazenar os raios de teste
    const rays = [];
    
    // Para cada planeta com luas, verificar possíveis eclipses
    for (const planetName in planets) {
        // Pular o sol
        if (planetName === 'sol') continue;
        
        const planet = planets[planetName];
        
        // Verificar apenas planetas com luas
        if (!planet.children || planet.children.length === 0) continue;
        
        // Obter posição do planeta
        const planetPosition = new THREE.Vector3();
        planet.getWorldPosition(planetPosition);
        
        // Calcular direção do planeta ao sol
        const directionToSun = new THREE.Vector3().subVectors(sol.position, planetPosition).normalize();
        
        // Verificar eclipse solar para as luas (planeta bloqueia o sol da lua)
        planet.children.forEach(child => {
            // Verificar se é uma lua
            if (!child.userData || !child.userData.isMoon) return;
            
            const moon = child;
            
            // Obter posição da lua
            const moonPosition = new THREE.Vector3();
            moon.getWorldPosition(moonPosition);
            
            // Calcular direção da lua ao sol
            const moonToSun = new THREE.Vector3().subVectors(sol.position, moonPosition).normalize();
            
            // Criar raio da lua em direção ao sol
            const moonRay = new THREE.Ray(moonPosition, moonToSun);
            
            // Testar interseção com o planeta
            const planetRadius = planet.userData.radius || 0.3;
            const planetSphere = new THREE.Sphere(planetPosition, planetRadius);
            
            const intersectionPoint = new THREE.Vector3();
            const hasIntersection = moonRay.intersectSphere(planetSphere, intersectionPoint);
            
            // Se há interseção, é um eclipse solar para a lua
            if (hasIntersection) {
                // Calcular distância do ponto de interseção à lua
                const distanceToIntersection = moonPosition.distanceTo(intersectionPoint);
                const distanceToSun = moonPosition.distanceTo(sol.position);
                
                // Verificar se o planeta está entre a lua e o sol (e não atrás da lua)
                if (distanceToIntersection < distanceToSun) {
                    // Calcular completude do eclipse (quanto mais próximo, mais completo)
                    const moonRadius = moon.userData.radius || 0.1;
                    const sunRadius = sol.userData.radius || 2.0;
                    
                    // Proporção de cobertura (simplificada)
                    const coverage = Math.min(1.0, planetRadius / (moonRadius * 2));
                    
                    // Adicionar eclipse solar à lista
                    currentEclipses.solar.push({
                        planet: planetName,
                        moon: moon.name,
                        coverage: coverage,
                        type: 'solar'
                    });
                    
                    // Aplicar efeito de escurecimento na lua durante eclipse
                    applyEclipseEffect(moon, coverage);
                }
            }
        });
        
        // Verificar eclipse lunar (sombra do planeta atinge a lua)
        const planetToSun = new THREE.Vector3().subVectors(sol.position, planetPosition).normalize();
        const planetRay = new THREE.Ray(planetPosition, planetToSun.clone().negate()); // Raio na direção oposta ao sol
        
        // Encontrar ponto na sombra a uma distância suficiente
        const shadowLength = planet.userData.distance * 2; // Ajustar conforme necessário
        const shadowPoint = planetRay.at(shadowLength, new THREE.Vector3());
        
        // Para cada lua, verificar se está na sombra do planeta
        planet.children.forEach(child => {
            // Verificar se é uma lua
            if (!child.userData || !child.userData.isMoon) return;
            
            const moon = child;
            
            // Obter posição da lua
            const moonPosition = new THREE.Vector3();
            moon.getWorldPosition(moonPosition);
            
            // Calcular distância da lua ao eixo da sombra
            const planetToMoonDirection = new THREE.Vector3().subVectors(moonPosition, planetPosition);
            const projectionLength = planetToMoonDirection.dot(planetToSun.clone().negate());
            
            // Verificar se a lua está atrás do planeta em relação ao sol
            if (projectionLength > 0) {
                // Calcular distância perpendicular ao eixo da sombra
                const projection = planetToSun.clone().negate().multiplyScalar(projectionLength);
                const perpendicularDistance = new THREE.Vector3()
                    .subVectors(planetToMoonDirection, projection)
                    .length();
                
                // Raio da sombra naquele ponto (aproximação do cone de sombra)
                const shadowRadius = planet.userData.radius * (1 - projectionLength / shadowLength);
                
                // Se a lua está dentro do raio da sombra, está em eclipse lunar
                if (perpendicularDistance < shadowRadius) {
                    // Calcular cobertura do eclipse (simplificada)
                    const coverage = Math.min(1.0, (shadowRadius - perpendicularDistance) / shadowRadius);
                    
                    // Adicionar eclipse lunar à lista
                    currentEclipses.lunar.push({
                        planet: planetName,
                        moon: moon.name,
                        coverage: coverage,
                        type: 'lunar'
                    });
                    
                    // Aplicar efeito de escurecimento na lua durante eclipse
                    applyEclipseEffect(moon, coverage);
                }
            }
        });
    }
    
    // Se houver eclipses, registrar no console
    if (currentEclipses.solar.length > 0 || currentEclipses.lunar.length > 0) {
        //console.log('Eclipses detectados:', currentEclipses);
    }
}

/**
 * Aplica efeito visual de eclipse a um objeto
 * @param {THREE.Object3D} object - Objeto afetado pelo eclipse
 * @param {Number} coverage - Grau de cobertura do eclipse (0-1)
 */
function applyEclipseEffect(object, coverage) {
    // Verificar se o objeto tem material para aplicar efeito
    if (!object.material) return;
    
    // Salvar brilho original se não existir
    if (object.userData.originalEmissiveIntensity === undefined) {
        object.userData.originalEmissiveIntensity = object.material.emissiveIntensity || 0;
    }
    
    // Escurecer o objeto proporcionalmente à cobertura do eclipse
    if (object.material.emissive) {
        // Para materiais com emissão, reduzir a intensidade
        object.material.emissiveIntensity = object.userData.originalEmissiveIntensity * (1 - coverage * 0.8);
    } else {
        // Para materiais sem emissão, escurecer diretamente
        const originalColor = object.userData.originalColor || object.material.color.clone();
        object.userData.originalColor = originalColor;
        
        // Criar cor escurecida
        const darkenedColor = originalColor.clone().multiplyScalar(1 - coverage * 0.6);
        object.material.color.copy(darkenedColor);
    }
    
    // Marcar para atualização
    object.material.needsUpdate = true;
}

/**
 * Limpa efeitos de eclipse em todos os objetos
 * @param {Object} planets - Objeto com todos os planetas
 */
function clearEclipseEffects(planets) {
    // Para cada planeta
    for (const planetName in planets) {
        const planet = planets[planetName];
        
        // Restaurar cor original do planeta, se modificada
        if (planet.material && planet.userData.originalColor) {
            planet.material.color.copy(planet.userData.originalColor);
            planet.material.needsUpdate = true;
        }
        
        // Restaurar emissão original do planeta, se modificada
        if (planet.material && planet.material.emissive && planet.userData.originalEmissiveIntensity !== undefined) {
            planet.material.emissiveIntensity = planet.userData.originalEmissiveIntensity;
            planet.material.needsUpdate = true;
        }
        
        // Restaurar também para todas as luas
        if (planet.children) {
            planet.children.forEach(child => {
                // Verificar se é uma lua
                if (!child.userData || !child.userData.isMoon) return;
                
                // Restaurar cor original
                if (child.material && child.userData.originalColor) {
                    child.material.color.copy(child.userData.originalColor);
                    child.material.needsUpdate = true;
                }
                
                // Restaurar emissão original
                if (child.material && child.material.emissive && child.userData.originalEmissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = child.userData.originalEmissiveIntensity;
                    child.material.needsUpdate = true;
                }
            });
        }
    }
}

/**
 * Remove o sistema de iluminação da cena
 * @param {THREE.Scene} scene - Cena principal
 */
function removeLightingSystem(scene) {
    // Remover luz ambiente
    scene.children.forEach(child => {
        if (child.name === 'ambientLight' || child.name === 'directionalLight' || child.name === 'lightTarget') {
            scene.remove(child);
        }
    });
    
    // Limpar variáveis globais
    sunLight = null;
    ambientLight = null;
    directionalLight = null;
    lightTarget = null;
    
    console.log('Sistema de iluminação removido');
}

/**
 * Prepara um objeto para receber sombras
 * @param {THREE.Object3D|Object} object - Objeto a ser configurado ou coleção de objetos
 * @param {Boolean} castShadow - Se o objeto deve projetar sombras
 * @param {Boolean} receiveShadow - Se o objeto deve receber sombras
 */
export function setupObjectForShadows(object, castShadow = true, receiveShadow = true) {
    // Verificar se o objeto é válido
    if (!object) {
        console.warn('Objeto inválido passado para setupObjectForShadows');
        return;
    }
    
    // Verificar se é uma coleção de objetos (como o objeto planets)
    if (typeof object === 'object' && !Array.isArray(object) && !(object instanceof THREE.Object3D)) {
        const numItems = Object.keys(object).length;
        console.log('Configurando sombras para coleção de objetos:', numItems, 'itens');
        
        // Iterar sobre as propriedades do objeto, mas apenas tratar objetos 3D para evitar recursão infinita
        for (const key in object) {
            if (object[key] && object[key] instanceof THREE.Object3D) {
                // Apenas processar objetos 3D para evitar loop infinito
                setupObjectForShadows(object[key], castShadow, receiveShadow);
            }
        }
        return;
    }
    
    // A partir daqui, tratamos um objeto 3D individual
    
    // Configurar o objeto principal se for um Mesh
    if (object.isMesh) {
        object.castShadow = castShadow;
        object.receiveShadow = receiveShadow;
    }
    
    // Configurar recursivamente todos os filhos
    if (object.children && object.children.length > 0) {
        object.children.forEach(child => {
            setupObjectForShadows(child, castShadow, receiveShadow);
        });
    }
} 