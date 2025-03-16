/**
 * Menu Principal da Aplicação
 * Gerencia a criação e interação com o menu principal do simulador
 */

// Importação de funções utilizadas pelo menu
import { 
    toggleOrbits, 
    toggleLabels, 
    toggleGrid,
    resetCameraPosition
} from '../../app.js';

import { startGuidedTour } from '../tour/guided-tour.js';
import { toggleMeteorShower } from '../core/meteor-shower.js';
import { toggleMeasurementTool } from '../ui/measurement-tool.js';
import { toggleSpaceMissionsPanel } from '../ui/space-missions-panel.js';
import { toggleOortCloudControls } from '../ui/oort-cloud-controls.js';
import { toggleVRMode } from '../vr/vr-system.js';
import { openExoplanetPanel } from '../../app.js';

/**
 * Inicializa o menu principal
 * @returns {HTMLElement} O elemento do menu criado
 */
export function initMainMenu() {
    const menu = createMainMenu();
    document.body.appendChild(menu);
    
    console.log('Menu principal inicializado');
    return menu;
}

/**
 * Cria e configura o menu principal da aplicação
 * @returns {HTMLElement} O elemento do menu
 */
function createMainMenu() {
    // Criar container do menu
    const menuContainer = document.createElement('div');
    menuContainer.id = 'main-menu';
    menuContainer.className = 'main-menu';
    
    // Estrutura do menu
    const menuItems = [
        {
            id: 'tour-button',
            label: 'Tour Guiado',
            icon: '<i class="fas fa-route"></i>',
            action: startGuidedTour,
            tooltip: 'Inicie um tour guiado pelo Sistema Solar'
        },
        {
            id: 'toggle-orbits',
            label: 'Mostrar Órbitas',
            icon: '<i class="fas fa-circle-notch"></i>',
            action: toggleOrbits,
            tooltip: 'Mostrar ou ocultar órbitas dos planetas'
        },
        {
            id: 'toggle-labels',
            label: 'Mostrar Rótulos',
            icon: '<i class="fas fa-tags"></i>',
            action: toggleLabels,
            tooltip: 'Mostrar ou ocultar nomes dos corpos celestes'
        },
        {
            id: 'toggle-grid',
            label: 'Mostrar Grade',
            icon: '<i class="fas fa-th"></i>',
            action: toggleGrid,
            tooltip: 'Mostrar ou ocultar grade de referência'
        },
        {
            id: 'reset-camera',
            label: 'Resetar Câmera',
            icon: '<i class="fas fa-sync-alt"></i>',
            action: resetCameraPosition,
            tooltip: 'Voltar a câmera para a posição inicial'
        },
        {
            id: 'meteor-shower',
            label: 'Chuva de Meteoros',
            icon: '<i class="fas fa-meteor"></i>',
            action: toggleMeteorShower,
            tooltip: 'Simular uma chuva de meteoros'
        },
        {
            id: 'measurement-tool',
            label: 'Ferramenta de Medição',
            icon: '<i class="fas fa-ruler-combined"></i>',
            action: toggleMeasurementTool,
            tooltip: 'Medir distâncias entre corpos celestes'
        },
        {
            id: 'oort-cloud',
            label: 'Nuvem de Oort',
            icon: '<i class="fas fa-cloud"></i>',
            action: toggleOortCloudControls,
            tooltip: 'Configurar a Nuvem de Oort e cometas'
        },
        {
            id: 'space-missions',
            label: 'Missões Espaciais',
            icon: '<i class="fas fa-rocket"></i>',
            action: toggleSpaceMissionsPanel,
            tooltip: 'Visualizar missões espaciais históricas e atuais'
        },
        {
            id: 'exoplanets-button',
            label: 'Explorar Exoplanetas',
            icon: '<i class="fas fa-globe-americas"></i>',
            action: openExoplanetPanel,
            tooltip: 'Explore sistemas exoplanetários conhecidos'
        },
        {
            id: 'vr-mode',
            label: 'Modo VR',
            icon: '<i class="fas fa-vr-cardboard"></i>',
            action: toggleVRMode,
            tooltip: 'Entrar no modo de Realidade Virtual'
        }
    ];
    
    // Criar os botões do menu
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = item.id;
        button.className = 'menu-button';
        button.innerHTML = `
            <span class="icon">${item.icon}</span>
            <span class="label">${item.label}</span>
        `;
        button.addEventListener('click', item.action);
        button.title = item.tooltip;
        
        menuContainer.appendChild(button);
    });
    
    // Botão de toggle do menu
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-menu';
    toggleButton.className = 'toggle-menu-button';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    toggleButton.addEventListener('click', toggleMenuVisibility);
    
    document.body.appendChild(toggleButton);
    
    return menuContainer;
}

/**
 * Alterna a visibilidade do menu
 */
function toggleMenuVisibility() {
    const menu = document.getElementById('main-menu');
    if (menu) {
        menu.classList.toggle('menu-hidden');
        
        // Também alternar o ícone do botão
        const toggleButton = document.getElementById('toggle-menu');
        if (toggleButton) {
            if (menu.classList.contains('menu-hidden')) {
                toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                toggleButton.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    }
}

/**
 * Abre o menu
 */
export function openMenu() {
    const menu = document.getElementById('main-menu');
    if (menu) {
        menu.classList.remove('menu-hidden');
        
        const toggleButton = document.getElementById('toggle-menu');
        if (toggleButton) {
            toggleButton.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
}

/**
 * Fecha o menu
 */
export function closeMenu() {
    const menu = document.getElementById('main-menu');
    if (menu) {
        menu.classList.add('menu-hidden');
        
        const toggleButton = document.getElementById('toggle-menu');
        if (toggleButton) {
            toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
} 