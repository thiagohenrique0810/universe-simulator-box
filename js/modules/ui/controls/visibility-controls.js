/**
 * Módulo para controles de visibilidade dos elementos da simulação
 */
import { createAccordionSection, createCheckbox } from './base-controls.js';

// Variáveis para controle de visibilidade
let orbitLinesVisible = true;
let starsVisible = true;
let skyboxVisible = true;
let asteroidBeltVisible = true;
let saturnRingsVisible = true;
let asteroidBeltRingVisible = true;

/**
 * Cria os controles de visibilidade
 * @param {HTMLElement} container - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createVisibilityControls(container, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Visibilidade', 
        initiallyOpen
    );
    
    // Container para os checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.flexDirection = 'column';
    checkboxContainer.style.gap = '3px';
    
    // Checkbox para linhas de órbita
    const orbitCheckbox = createCheckbox(
        'Linhas de Órbita', 
        orbitLinesVisible, 
        function(checked) {
            orbitLinesVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-orbits-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(orbitCheckbox);
    
    // Checkbox para estrelas
    const starsCheckbox = createCheckbox(
        'Estrelas', 
        starsVisible, 
        function(checked) {
            starsVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-stars-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(starsCheckbox);
    
    // Checkbox para skybox
    const skyboxCheckbox = createCheckbox(
        'Via Láctea (Fundo)', 
        skyboxVisible, 
        function(checked) {
            skyboxVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-skybox-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(skyboxCheckbox);
    
    // Checkbox para cinturão de asteroides
    const asteroidBeltCheckbox = createCheckbox(
        'Cinturão de Asteroides', 
        asteroidBeltVisible, 
        function(checked) {
            asteroidBeltVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-asteroid-belt-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(asteroidBeltCheckbox);
    
    // Checkbox para anel do cinturão
    const beltRingCheckbox = createCheckbox(
        'Anel do Cinturão', 
        asteroidBeltRingVisible, 
        function(checked) {
            asteroidBeltRingVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-belt-ring-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(beltRingCheckbox);
    
    // Checkbox para anéis de Saturno
    const saturnRingsCheckbox = createCheckbox(
        'Anéis de Saturno', 
        saturnRingsVisible, 
        function(checked) {
            saturnRingsVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-saturn-rings-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(saturnRingsCheckbox);
    
    content.appendChild(checkboxContainer);
}

/**
 * Retorna o estado atual de visibilidade dos elementos
 * @returns {Object} Estado de visibilidade
 */
export function getVisibilityState() {
    return {
        orbitLinesVisible,
        starsVisible,
        skyboxVisible,
        asteroidBeltVisible,
        saturnRingsVisible,
        asteroidBeltRingVisible
    };
} 