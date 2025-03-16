/**
 * Módulo para controles de física avançada (gravidade real)
 */
import { createAccordionSection } from './base-controls.js';

/**
 * Cria os controles de física avançada
 * @param {HTMLElement} container - Container dos controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createPhysicsControls(container, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Física Avançada', 
        initiallyOpen
    );
    
    // Container para o toggle de física
    const physicsToggleContainer = document.createElement('div');
    physicsToggleContainer.className = 'physics-toggle-container';
    physicsToggleContainer.style.display = 'flex';
    physicsToggleContainer.style.alignItems = 'center';
    physicsToggleContainer.style.marginBottom = '10px';
    
    // Checkbox para ativar/desativar a física
    const physicsToggle = document.createElement('input');
    physicsToggle.type = 'checkbox';
    physicsToggle.id = 'physics-toggle';
    physicsToggle.style.margin = '0 5px 0 0';
    physicsToggleContainer.appendChild(physicsToggle);
    
    // Label para o checkbox
    const physicsLabel = document.createElement('label');
    physicsLabel.htmlFor = 'physics-toggle';
    physicsLabel.textContent = 'Gravidade Real';
    physicsToggleContainer.appendChild(physicsLabel);
    
    content.appendChild(physicsToggleContainer);
    
    // Informação sobre a gravidade
    const physicsInfo = document.createElement('p');
    physicsInfo.className = 'physics-info';
    physicsInfo.textContent = 'Simula interações gravitacionais entre corpos celestes segundo a Lei da Gravitação Universal.';
    physicsInfo.style.fontSize = '0.8em';
    physicsInfo.style.color = '#aaa';
    physicsInfo.style.marginBottom = '10px';
    content.appendChild(physicsInfo);
    
    // Container para o controle deslizante de intensidade
    const strengthContainer = document.createElement('div');
    strengthContainer.className = 'gravity-strength-container';
    
    // Label para o controle de intensidade
    const strengthLabel = document.createElement('label');
    strengthLabel.htmlFor = 'gravity-strength';
    strengthLabel.textContent = 'Intensidade da Gravidade:';
    strengthLabel.style.display = 'block';
    strengthLabel.style.marginBottom = '5px';
    strengthContainer.appendChild(strengthLabel);
    
    // Container para o slider e o valor
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    
    // Controle deslizante para a intensidade
    const strengthSlider = document.createElement('input');
    strengthSlider.type = 'range';
    strengthSlider.id = 'gravity-strength';
    strengthSlider.min = '0';
    strengthSlider.max = '2';
    strengthSlider.step = '0.1';
    strengthSlider.value = '1';
    strengthSlider.className = 'slider';
    strengthSlider.style.flex = '1';
    sliderContainer.appendChild(strengthSlider);
    
    // Display para o valor atual
    const strengthValue = document.createElement('span');
    strengthValue.id = 'gravity-strength-value';
    strengthValue.textContent = '1.0x';
    strengthValue.style.marginLeft = '10px';
    strengthValue.style.width = '35px';
    sliderContainer.appendChild(strengthValue);
    
    // Adicionar o container do slider ao container de intensidade
    strengthContainer.appendChild(sliderContainer);
    
    // Adicionar o container de intensidade à seção de física
    content.appendChild(strengthContainer);
    
    // Botão de reset das órbitas
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Resetar Órbitas';
    resetButton.className = 'reset-button';
    resetButton.style.marginTop = '10px';
    resetButton.style.width = '100%';
    resetButton.style.padding = '5px';
    resetButton.style.backgroundColor = '#555';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.color = 'white';
    resetButton.style.cursor = 'pointer';
    content.appendChild(resetButton);
    
    // Inicialmente desativar o controle de intensidade
    strengthContainer.style.opacity = '0.5';
    strengthContainer.style.pointerEvents = 'none';
    resetButton.style.opacity = '0.5';
    resetButton.style.pointerEvents = 'none';
    
    // Evento para o toggle de física
    physicsToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        
        // Disparar evento para ativar/desativar física
        document.dispatchEvent(new CustomEvent('physics-enabled-changed', {
            detail: { enabled: isEnabled }
        }));
        
        // Ativar/desativar controles dependentes
        strengthContainer.style.opacity = isEnabled ? '1' : '0.5';
        strengthContainer.style.pointerEvents = isEnabled ? 'auto' : 'none';
        resetButton.style.opacity = isEnabled ? '1' : '0.5';
        resetButton.style.pointerEvents = isEnabled ? 'auto' : 'none';
    });
    
    // Evento para o slider de intensidade
    strengthSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        // Atualizar o display de valor
        strengthValue.textContent = value.toFixed(1) + 'x';
        
        // Disparar evento para ajustar a intensidade da gravidade
        document.dispatchEvent(new CustomEvent('gravity-strength-changed', {
            detail: { strength: value }
        }));
    });
    
    // Evento para o botão de reset
    resetButton.addEventListener('click', function() {
        // Disparar evento para resetar órbitas
        document.dispatchEvent(new CustomEvent('reset-orbits', {}));
    });
} 