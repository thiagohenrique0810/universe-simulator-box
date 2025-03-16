/**
 * Módulo para controles do modo noturno e filtro de luz azul
 */
import { createAccordionSection, showTemporaryMessage } from './base-controls.js';

/**
 * Cria os controles para o modo noturno
 * @param {HTMLElement} controlsContainer - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createNightModeControls(controlsContainer, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        controlsContainer, 
        'Conforto Visual', 
        initiallyOpen
    );
    
    // Checkbox para modo noturno
    const nightModeContainer = document.createElement('div');
    nightModeContainer.style.display = 'flex';
    nightModeContainer.style.alignItems = 'center';
    nightModeContainer.style.marginBottom = '10px';
    
    const nightModeCheckbox = document.createElement('input');
    nightModeCheckbox.type = 'checkbox';
    nightModeCheckbox.checked = isNightModeActive();
    nightModeCheckbox.style.margin = '0 5px 0 0';
    nightModeCheckbox.addEventListener('change', function() {
        toggleNightMode(this.checked);
    });
    
    const nightModeLabel = document.createElement('label');
    nightModeLabel.textContent = 'Modo Noturno';
    
    nightModeContainer.appendChild(nightModeCheckbox);
    nightModeContainer.appendChild(nightModeLabel);
    content.appendChild(nightModeContainer);
    
    // Slider para filtro de luz azul
    const blueFilterLabel = document.createElement('div');
    blueFilterLabel.textContent = 'Filtro de Luz Azul:';
    blueFilterLabel.style.marginTop = '10px';
    content.appendChild(blueFilterLabel);
    
    const blueFilterSlider = document.createElement('input');
    blueFilterSlider.type = 'range';
    blueFilterSlider.min = '0';
    blueFilterSlider.max = '100';
    blueFilterSlider.value = getBlueFilterIntensity() * 100;
    blueFilterSlider.style.width = '100%';
    blueFilterSlider.addEventListener('input', function() {
        applyBlueFilter(this.value / 100);
    });
    content.appendChild(blueFilterSlider);
    
    // Aplicar configurações salvas
    if (isNightModeActive()) {
        toggleNightMode(true);
    }
    applyBlueFilter(getBlueFilterIntensity());
}

/**
 * Verifica se o modo noturno está ativo
 * @returns {Boolean} Estado do modo noturno
 */
function isNightModeActive() {
    return localStorage.getItem('nightMode') === 'true';
}

/**
 * Obtém a intensidade do filtro de luz azul
 * @returns {Number} Intensidade do filtro (0-1)
 */
function getBlueFilterIntensity() {
    const intensity = parseFloat(localStorage.getItem('blueFilter'));
    return isNaN(intensity) ? 0 : intensity;
}

/**
 * Alterna o modo noturno
 * @param {Boolean} active - Se o modo noturno deve estar ativo
 */
function toggleNightMode(active) {
    localStorage.setItem('nightMode', active);
    
    // Criar ou obter o elemento de estilo para o modo noturno
    let nightModeStyle = document.getElementById('night-mode-style');
    
    if (!nightModeStyle) {
        nightModeStyle = document.createElement('style');
        nightModeStyle.id = 'night-mode-style';
        document.head.appendChild(nightModeStyle);
    }
    
    if (active) {
        // Aplicar estilo de modo noturno
        nightModeStyle.textContent = `
            #controls-container, #info {
                background-color: rgba(10, 10, 15, 0.85) !important;
            }
            
            .control-button {
                background-color: rgba(20, 20, 30, 0.9) !important;
                border-color: rgba(50, 50, 80, 0.7) !important;
            }
            
            .control-button:hover {
                background-color: rgba(30, 30, 50, 0.9) !important;
            }
            
            h1, h2, h3, p, label {
                color: rgba(200, 200, 220, 0.9) !important;
            }
        `;
    } else {
        // Remover estilo de modo noturno
        nightModeStyle.textContent = '';
    }
    
    // Mostrar feedback ao usuário
    showTemporaryMessage(active ? 'Modo noturno ativado' : 'Modo noturno desativado');
}

/**
 * Aplica o filtro de luz azul
 * @param {Number} intensity - Intensidade do filtro (0-1)
 */
function applyBlueFilter(intensity) {
    localStorage.setItem('blueFilter', intensity);
    
    // Criar ou obter o elemento de estilo para o filtro
    let blueFilterStyle = document.getElementById('blue-filter-style');
    
    if (!blueFilterStyle) {
        blueFilterStyle = document.createElement('style');
        blueFilterStyle.id = 'blue-filter-style';
        document.head.appendChild(blueFilterStyle);
    }
    
    if (intensity > 0) {
        // Cores mais quentes para reduzir a luz azul
        const filterValue = `sepia(${intensity * 30}%) saturate(${100 - intensity * 20}%) 
                             brightness(${100 - intensity * 10}%) hue-rotate(${-intensity * 30}deg)`;
        
        blueFilterStyle.textContent = `
            body, #scene-container, canvas {
                filter: ${filterValue} !important;
            }
        `;
    } else {
        // Remover filtro
        blueFilterStyle.textContent = '';
    }
} 