/**
 * Sistema de efeitos atmosféricos para planetas
 * Implementa shaders para dispersão atmosférica realista
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Constantes do sistema
const VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
uniform vec3 glowColor;
uniform float intensity;
uniform sampler2D baseTexture;
uniform float atmosphereThickness;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    // Cálculo básico do efeito de brilho atmosférico
    float rim = 1.0 - max(0.0, dot(normalize(-vPosition), vNormal));
    
    // Ajuste da intensidade com curvatura para simular dispersão atmosférica
    float glow = pow(rim, atmosphereThickness) * intensity;
    
    // Obter cor da textura base
    vec4 baseColor = texture2D(baseTexture, vUv);
    
    // Combinar textura com efeito de brilho atmosférico
    vec3 finalColor = mix(baseColor.rgb, glowColor, glow * 0.6);
    
    // Aplicar glow mais intenso nas bordas
    finalColor += glowColor * glow * 0.4;
    
    gl_FragColor = vec4(finalColor, baseColor.a);
}
`;

// Shaders para camada atmosférica adicional
const ATMOSPHERIC_LAYER_VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERIC_LAYER_FRAGMENT_SHADER = `
uniform vec3 glowColor;
uniform float intensity;
uniform float atmosphereThickness;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Cálculo de efeito de borda mais intenso
    float rim = 1.0 - max(0.0, dot(normalize(-vPosition), vNormal));
    
    // Ajuste de intensidade exponencial para criar o efeito de dispersão
    float glow = pow(rim, atmosphereThickness) * intensity;
    
    // Aplicar transparência baseada na intensidade do glow
    float alpha = min(1.0, glow * 2.0);
    
    // Cor final com transparência
    gl_FragColor = vec4(glowColor, alpha * 0.7);
}
`;

/**
 * Configurações padrão para atmosferas planetárias
 */
const DEFAULT_ATMOSPHERE_SETTINGS = {
    terra: {
        color: new THREE.Color(0x6CA6FF), // Azul claro
        intensity: 1.2,
        thickness: 4.0,
        scale: 1.05 // Escala da camada atmosférica em relação ao planeta
    },
    venus: {
        color: new THREE.Color(0xF0CB94), // Amarelo acastanhado
        intensity: 1.5,
        thickness: 3.0,
        scale: 1.08
    },
    titan: {
        color: new THREE.Color(0xE89F51), // Laranja acastanhado
        intensity: 1.0,
        thickness: 3.5,
        scale: 1.08
    },
    marte: {
        color: new THREE.Color(0xDBA675), // Vermelho-laranja suave
        intensity: 0.7,
        thickness: 5.0,
        scale: 1.03
    },
    jupiter: {
        color: new THREE.Color(0xE0C292), // Bege claro
        intensity: 0.8,
        thickness: 3.0,
        scale: 1.02
    },
    saturno: {
        color: new THREE.Color(0xEDDAA7), // Amarelo claro
        intensity: 0.8,
        thickness: 3.0,
        scale: 1.02
    },
    urano: {
        color: new THREE.Color(0x9DDEF0), // Azul claro
        intensity: 0.8,
        thickness: 3.0,
        scale: 1.02
    },
    netuno: {
        color: new THREE.Color(0x3F54BA), // Azul escuro
        intensity: 0.8,
        thickness: 3.0,
        scale: 1.02
    }
};

/**
 * Aplica efeito atmosférico a um planeta
 * @param {Object} planet - Objeto 3D do planeta
 * @param {String} planetName - Nome do planeta para usar configurações predefinidas
 * @param {Object} customSettings - Configurações personalizadas (opcional)
 */
export function applyAtmosphericEffect(planet, planetName, customSettings = {}) {
    // Verificar se o planeta tem material e geometria
    if (!planet || !planet.material || !planet.geometry) {
        console.warn(`Não foi possível aplicar efeito atmosférico: planeta ${planetName} inválido`);
        return;
    }
    
    // Obter configurações para o planeta ou usar valores padrão
    const settings = DEFAULT_ATMOSPHERE_SETTINGS[planetName] || {
        color: new THREE.Color(0xFFFFFF),
        intensity: 1.0,
        thickness: 4.0,
        scale: 1.05
    };
    
    // Mesclar com configurações personalizadas
    const finalSettings = { ...settings, ...customSettings };
    
    // Salvar o material original
    const originalMaterial = planet.material;
    
    // Verificar se o planeta já tem o shader atmosférico aplicado
    if (planet.userData.hasAtmosphere) {
        // Atualizar uniforms se já existir
        if (planet.material.uniforms) {
            planet.material.uniforms.glowColor.value = finalSettings.color;
            planet.material.uniforms.intensity.value = finalSettings.intensity;
            planet.material.uniforms.atmosphereThickness.value = finalSettings.thickness;
        }
        return;
    }
    
    // Criar material com shader
    const atmosphericMaterial = new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: originalMaterial.map },
            glowColor: { value: finalSettings.color },
            intensity: { value: finalSettings.intensity },
            atmosphereThickness: { value: finalSettings.thickness }
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
        transparent: true
    });
    
    // Aplicar o novo material ao planeta
    planet.material = atmosphericMaterial;
    planet.userData.hasAtmosphere = true;
    planet.userData.originalMaterial = originalMaterial;
    
    // Criar camada atmosférica externa (halo)
    createAtmosphericLayer(planet, finalSettings);
    
    console.log(`Efeito atmosférico aplicado ao planeta ${planetName}`);
}

/**
 * Cria uma camada atmosférica externa (halo) ao redor do planeta
 * @param {Object} planet - Objeto 3D do planeta
 * @param {Object} settings - Configurações da atmosfera
 */
function createAtmosphericLayer(planet, settings) {
    // Verificar se já existe uma camada atmosférica
    if (planet.userData.atmosphericLayer) {
        // Remover a camada existente
        planet.remove(planet.userData.atmosphericLayer);
    }
    
    // Clonar a geometria do planeta e escalar para criar a camada atmosférica
    const atmosphereGeometry = planet.geometry.clone();
    
    // Criar material para a camada atmosférica
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: settings.color },
            intensity: { value: settings.intensity },
            atmosphereThickness: { value: settings.thickness * 0.7 } // Ajuste para visual melhor
        },
        vertexShader: ATMOSPHERIC_LAYER_VERTEX_SHADER,
        fragmentShader: ATMOSPHERIC_LAYER_FRAGMENT_SHADER,
        transparent: true,
        side: THREE.BackSide, // Renderizar apenas a parte interna do halo
        blending: THREE.AdditiveBlending
    });
    
    // Criar malha para a camada atmosférica
    const atmosphericLayer = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphericLayer.scale.set(settings.scale, settings.scale, settings.scale);
    atmosphericLayer.name = `${planet.name}_atmosphere`;
    
    // Adicionar a camada atmosférica ao planeta
    planet.add(atmosphericLayer);
    planet.userData.atmosphericLayer = atmosphericLayer;
}

/**
 * Remove o efeito atmosférico de um planeta
 * @param {Object} planet - Objeto 3D do planeta
 */
export function removeAtmosphericEffect(planet) {
    // Verificar se o planeta tem o efeito atmosférico aplicado
    if (!planet || !planet.userData.hasAtmosphere) {
        return;
    }
    
    // Restaurar material original
    if (planet.userData.originalMaterial) {
        planet.material = planet.userData.originalMaterial;
    }
    
    // Remover camada atmosférica
    if (planet.userData.atmosphericLayer) {
        planet.remove(planet.userData.atmosphericLayer);
        planet.userData.atmosphericLayer = null;
    }
    
    // Resetar flags
    planet.userData.hasAtmosphere = false;
    planet.userData.originalMaterial = null;
    
    console.log(`Efeito atmosférico removido do planeta ${planet.name}`);
}

/**
 * Ativa/desativa efeitos atmosféricos para todos os planetas
 * @param {Object} planets - Objeto contendo todos os planetas
 * @param {Boolean} enabled - Estado dos efeitos atmosféricos
 */
export function toggleAtmosphericEffects(planets, enabled) {
    // Lista de planetas que devem ter atmosfera
    const planetasComAtmosfera = ['terra', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'netuno'];
    
    for (const planetName of planetasComAtmosfera) {
        const planet = planets[planetName];
        if (!planet) continue;
        
        if (enabled) {
            applyAtmosphericEffect(planet, planetName);
        } else {
            removeAtmosphericEffect(planet);
        }
    }
    
    // Verificar também luas com atmosfera como Titan
    if (planets.saturno && planets.saturno.children) {
        planets.saturno.children.forEach(child => {
            if (child.name === 'titan') {
                if (enabled) {
                    applyAtmosphericEffect(child, 'titan');
                } else {
                    removeAtmosphericEffect(child);
                }
            }
        });
    }
} 