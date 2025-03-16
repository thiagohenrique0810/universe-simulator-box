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
 * Cria os controles de visibilidade para elementos do sistema solar
 * Permite mostrar/ocultar órbitas, estrelas, skybox, etc.
 */
export function createVisibilityControls() {
    // Criar o container para os controles
    const container = document.createElement('div');
    container.className = 'controls-section';
    
    // Adicionar título da seção
    const title = document.createElement('h3');
    title.textContent = 'Controles de Visibilidade';
    title.className = 'section-title';
    container.appendChild(title);
    
    // Controles de visibilidade
    const controls = [
        {
            id: 'toggle-orbits',
            label: 'Mostrar Órbitas',
            checked: true,
            event: 'toggle-orbits'
        },
        {
            id: 'toggle-stars',
            label: 'Mostrar Estrelas',
            checked: true,
            event: 'toggle-stars'
        },
        {
            id: 'toggle-skybox',
            label: 'Mostrar Skybox',
            checked: true,
            event: 'toggle-skybox'
        },
        {
            id: 'toggle-asteroid-belt',
            label: 'Mostrar Cinturão de Asteroides',
            checked: true,
            event: 'toggle-asteroid-belt'
        },
        {
            id: 'toggle-belt-ring',
            label: 'Mostrar Anel do Cinturão',
            checked: true,
            event: 'toggle-belt-ring'
        },
        {
            id: 'toggle-saturn-rings',
            label: 'Mostrar Anéis de Saturno',
            checked: true,
            event: 'toggle-saturn-rings'
        },
        {
            id: 'toggle-atmosphere',
            label: 'Mostrar Efeitos Atmosféricos',
            checked: true,
            event: 'toggle-atmosphere'
        }
    ];
    
    // Criar cada controle de visibilidade
    controls.forEach(control => {
        const controlContainer = document.createElement('div');
        controlContainer.className = 'control-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = control.id;
        checkbox.checked = control.checked;
        
        const label = document.createElement('label');
        label.htmlFor = control.id;
        label.textContent = control.label;
        
        // Evento de mudança
        checkbox.addEventListener('change', () => {
            // Disparar evento customizado
            document.dispatchEvent(new CustomEvent(control.event, {
                detail: { visible: checkbox.checked }
            }));
        });
        
        controlContainer.appendChild(checkbox);
        controlContainer.appendChild(label);
        container.appendChild(controlContainer);
    });
    
    return container;
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