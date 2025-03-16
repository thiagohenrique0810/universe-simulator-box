/**
 * Módulo para controles de iluminação realista do sistema solar
 */
import { createAccordionSection, createSlider } from './base-controls.js';

// Valores padrão
let sunIntensity = 1.5; // Intensidade solar padrão

/**
 * Cria controles de iluminação para o sistema solar
 * @param {HTMLElement} container - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createLightingControls(container, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Iluminação Realista', 
        initiallyOpen
    );
    
    // Container para os controles de iluminação
    const lightingContainer = document.createElement('div');
    lightingContainer.style.display = 'flex';
    lightingContainer.style.flexDirection = 'column';
    lightingContainer.style.gap = '15px';
    lightingContainer.style.marginTop = '10px';
    content.appendChild(lightingContainer);
    
    // Controle de intensidade solar
    const sunIntensityContainer = document.createElement('div');
    
    const sunIntensityLabel = document.createElement('label');
    sunIntensityLabel.textContent = 'Intensidade da Luz Solar';
    sunIntensityLabel.style.display = 'block';
    sunIntensityLabel.style.marginBottom = '5px';
    sunIntensityContainer.appendChild(sunIntensityLabel);
    
    // Criar slider para intensidade solar (0.5 a 3.0)
    const sunIntensitySlider = createSlider({
        min: 0.5,
        max: 3.0,
        step: 0.1,
        value: sunIntensity,
        onChange: (value) => {
            sunIntensity = value;
            sunIntensityValue.textContent = value.toFixed(1);
            
            // Disparar evento para atualizar a intensidade solar
            document.dispatchEvent(new CustomEvent('set-sun-intensity', {
                detail: { intensity: value }
            }));
        }
    });
    
    // Valor atual da intensidade
    const sunIntensityValue = document.createElement('span');
    sunIntensityValue.textContent = sunIntensity.toFixed(1);
    sunIntensityValue.style.marginLeft = '10px';
    sunIntensityValue.style.fontWeight = 'bold';
    
    // Container para o slider e seu valor
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    sliderContainer.appendChild(sunIntensitySlider);
    sliderContainer.appendChild(sunIntensityValue);
    
    sunIntensityContainer.appendChild(sliderContainer);
    lightingContainer.appendChild(sunIntensityContainer);
    
    // Adicionar dica informativa
    const infoTip = document.createElement('p');
    infoTip.textContent = 'Ajustar iluminação afeta o realismo das sombras e eclipses.';
    infoTip.style.fontSize = '0.8em';
    infoTip.style.color = '#777';
    infoTip.style.margin = '5px 0 0 0';
    lightingContainer.appendChild(infoTip);
}

/**
 * Retorna a intensidade atual da luz solar
 * @returns {Number} Intensidade atual
 */
export function getSunIntensity() {
    return sunIntensity;
} 