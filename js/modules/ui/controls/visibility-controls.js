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
let uranusRingsVisible = true;
let neptuneRingsVisible = true;
let asteroidBeltRingVisible = true;
let shadowsVisible = true;
let eclipsesEnabled = true;
let kuiperBeltVisible = true;
let kuiperBeltSmallObjectsVisible = true;
let spaceMissionsVisible = true;

/**
 * Cria os controles de visibilidade para elementos do sistema solar
 * Permite mostrar/ocultar órbitas, estrelas, skybox, etc.
 */
export function createVisibilityControls(container, initiallyOpen = true) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Visibilidade', 
        initiallyOpen
    );
    
    // Lista de elementos de visibilidade
    const visibilityItems = [
        {
            id: 'show-orbits',
            label: 'Órbitas',
            eventName: 'toggle-orbits',
            defaultChecked: true
        },
        {
            id: 'show-stars',
            label: 'Estrelas',
            eventName: 'toggle-stars',
            defaultChecked: true
        },
        {
            id: 'show-skybox',
            label: 'Fundo Estelar',
            eventName: 'toggle-skybox',
            defaultChecked: true
        },
        {
            id: 'show-asteroid-belt',
            label: 'Cinturão de Asteroides',
            eventName: 'toggle-asteroid-belt',
            defaultChecked: true
        },
        {
            id: 'show-belt-ring',
            label: 'Anel do Cinturão',
            eventName: 'toggle-belt-ring',
            defaultChecked: true
        },
        {
            id: 'show-saturn-rings',
            label: 'Anéis de Saturno',
            eventName: 'toggle-saturn-rings',
            defaultChecked: true
        },
        {
            id: 'show-uranus-rings',
            label: 'Anéis de Urano',
            eventName: 'toggle-uranus-rings',
            defaultChecked: true
        },
        {
            id: 'show-neptune-rings',
            label: 'Anéis de Netuno',
            eventName: 'toggle-neptune-rings',
            defaultChecked: true
        },
        {
            id: 'show-atmosphere',
            label: 'Efeitos Atmosféricos',
            eventName: 'toggle-atmosphere',
            defaultChecked: true
        },
        {
            id: 'show-climate',
            label: 'Sistemas Climáticos',
            eventName: 'toggle-climate',
            defaultChecked: true
        },
        {
            id: 'show-shadows',
            label: 'Sombras',
            eventName: 'toggle-shadows',
            defaultChecked: true
        },
        {
            id: 'show-eclipses',
            label: 'Eclipses',
            eventName: 'toggle-eclipses',
            defaultChecked: true
        },
        {
            id: 'show-kuiper-belt',
            label: 'Cinturão de Kuiper',
            eventName: 'toggle-kuiper-belt',
            defaultChecked: true
        },
        {
            id: 'show-kuiper-small-objects',
            label: 'Objetos Menores de Kuiper',
            eventName: 'toggle-kuiper-small-objects',
            defaultChecked: true
        },
        {
            id: 'show-space-missions',
            label: 'Missões Espaciais',
            eventName: 'toggle-space-missions',
            defaultChecked: true
        }
    ];
    
    // Criar container com duas colunas para os checkboxes
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridContainer.style.gap = '5px';
    gridContainer.style.marginTop = '10px';
    content.appendChild(gridContainer);
    
    // Adicionar checkboxes para cada item de visibilidade
    visibilityItems.forEach(item => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = item.id;
        checkbox.checked = item.defaultChecked;
        checkbox.style.margin = '0 5px 0 0';
        
        const label = document.createElement('label');
        label.htmlFor = item.id;
        label.textContent = item.label;
        label.style.fontSize = '0.9em';
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        gridContainer.appendChild(checkboxContainer);
        
        // Criar evento para o checkbox
        checkbox.addEventListener('change', function() {
            document.dispatchEvent(new CustomEvent(item.eventName, {
                detail: { visible: this.checked }
            }));
        });
    });
    
    // Adicionar listeners para atualizar variáveis de estado
    document.addEventListener('toggle-orbits', (e) => orbitLinesVisible = e.detail.visible);
    document.addEventListener('toggle-stars', (e) => starsVisible = e.detail.visible);
    document.addEventListener('toggle-skybox', (e) => skyboxVisible = e.detail.visible);
    document.addEventListener('toggle-asteroid-belt', (e) => asteroidBeltVisible = e.detail.visible);
    document.addEventListener('toggle-belt-ring', (e) => asteroidBeltRingVisible = e.detail.visible);
    document.addEventListener('toggle-saturn-rings', (e) => saturnRingsVisible = e.detail.visible);
    document.addEventListener('toggle-uranus-rings', (e) => uranusRingsVisible = e.detail.visible);
    document.addEventListener('toggle-neptune-rings', (e) => neptuneRingsVisible = e.detail.visible);
    document.addEventListener('toggle-shadows', (e) => shadowsVisible = e.detail.visible);
    document.addEventListener('toggle-eclipses', (e) => eclipsesEnabled = e.detail.visible);
    document.addEventListener('toggle-kuiper-belt', (e) => kuiperBeltVisible = e.detail.visible);
    document.addEventListener('toggle-kuiper-small-objects', (e) => kuiperBeltSmallObjectsVisible = e.detail.visible);
    document.addEventListener('toggle-space-missions', (e) => spaceMissionsVisible = e.detail.visible);
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
        uranusRingsVisible,
        neptuneRingsVisible,
        asteroidBeltRingVisible,
        shadowsVisible,
        eclipsesEnabled,
        kuiperBeltVisible,
        kuiperBeltSmallObjectsVisible,
        spaceMissionsVisible
    };
} 