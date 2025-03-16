/**
 * Sistema de controles de simulação
 * Gerencia os controles para ajustar a velocidade e visibilidade dos elementos
 */

// Importar componentes de controle
import { createControlsContainer, createToggleControlsButton } from './controls/base-controls.js';
import { createSpeedControls, getSimulationSpeed, setSimulationSpeed } from './controls/speed-controls.js';
import { createVisibilityControls, getVisibilityState } from './controls/visibility-controls.js';
import { createCaptureControls } from './controls/capture-controls.js';
import { createNightModeControls } from './controls/night-mode-controls.js';
import { createComparisonControls } from './controls/comparison-controls.js';
import { createPhysicsControls } from './controls/physics-controls.js';
import { createSearchControls } from './controls/search-controls.js';
import { createLightingControls, getSunIntensity } from './controls/lighting-controls.js';

/**
 * Cria o painel de controles da simulação
 * @returns {HTMLElement} Container dos controles
 */
export function createSimulationControls() {
    // Criar container para controles
    const controlsContainer = createControlsContainer();
    
    // Criar botão para mostrar/ocultar controles
    createToggleControlsButton();
    
    // Título principal
    const mainTitle = document.createElement('h2');
    mainTitle.textContent = 'Controles da Simulação';
    mainTitle.style.textAlign = 'center';
    mainTitle.style.margin = '0 0 15px 0';
    mainTitle.style.borderBottom = '2px solid #555';
    mainTitle.style.paddingBottom = '8px';
    controlsContainer.appendChild(mainTitle);
    
    // Criar controles de velocidade (inicialmente aberto)
    createSpeedControls(controlsContainer, true);
    
    // Criar controles de visibilidade
    createVisibilityControls(controlsContainer);
    
    // Criar controles de iluminação
    createLightingControls(controlsContainer);
    
    // Criar controles de captura de mídia
    createCaptureControls(controlsContainer);
    
    // Criar controles de modo noturno
    createNightModeControls(controlsContainer);
    
    // Criar controles de comparação de planetas
    createComparisonControls(controlsContainer);
    
    // Criar controles de física avançada
    createPhysicsControls(controlsContainer);
    
    // Criar controles de busca (sempre visível)
    createSearchControls(controlsContainer);
    
    return controlsContainer;
}

// Exportar funções para acesso externo
export { getSimulationSpeed, setSimulationSpeed, getVisibilityState, getSunIntensity }; 