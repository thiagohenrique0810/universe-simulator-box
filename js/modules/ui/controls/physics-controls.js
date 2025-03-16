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
        document.dispatchEvent(new CustomEvent('toggle-advanced-physics', {
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
        document.dispatchEvent(new CustomEvent('set-gravity-strength', {
            detail: { strength: value }
        }));
    });
    
    // Evento para o botão de reset
    resetButton.addEventListener('click', function() {
        // Disparar evento para resetar órbitas
        document.dispatchEvent(new CustomEvent('reset-orbits', {}));
    });
    
    // Adicionar seção para o sistema de colisões
    const collisionsContainer = document.createElement('div');
    collisionsContainer.className = 'collisions-container';
    collisionsContainer.style.marginTop = '20px';
    collisionsContainer.style.paddingTop = '15px';
    collisionsContainer.style.borderTop = '1px solid #444';
    
    // Título da seção de colisões
    const collisionsTitle = document.createElement('h4');
    collisionsTitle.textContent = 'Sistema de Colisões';
    collisionsTitle.style.margin = '0 0 10px 0';
    collisionsTitle.style.fontSize = '0.9em';
    collisionsContainer.appendChild(collisionsTitle);
    
    // Informação sobre o sistema de colisões
    const collisionsInfo = document.createElement('p');
    collisionsInfo.className = 'collisions-info';
    collisionsInfo.textContent = 'Detecta e simula colisões entre corpos celestes com efeitos visuais.';
    collisionsInfo.style.fontSize = '0.8em';
    collisionsInfo.style.color = '#aaa';
    collisionsInfo.style.marginBottom = '10px';
    collisionsContainer.appendChild(collisionsInfo);
    
    // Container para o toggle de colisões
    const collisionsToggleContainer = document.createElement('div');
    collisionsToggleContainer.style.display = 'flex';
    collisionsToggleContainer.style.alignItems = 'center';
    collisionsToggleContainer.style.marginBottom = '10px';
    
    // Checkbox para ativar/desativar colisões
    const collisionsToggle = document.createElement('input');
    collisionsToggle.type = 'checkbox';
    collisionsToggle.id = 'collisions-toggle';
    collisionsToggle.style.margin = '0 5px 0 0';
    collisionsToggleContainer.appendChild(collisionsToggle);
    
    // Label para o checkbox de colisões
    const collisionsLabel = document.createElement('label');
    collisionsLabel.htmlFor = 'collisions-toggle';
    collisionsLabel.textContent = 'Ativar Colisões';
    collisionsToggleContainer.appendChild(collisionsLabel);
    
    collisionsContainer.appendChild(collisionsToggleContainer);
    
    // Container para o controle deslizante de elasticidade
    const elasticityContainer = document.createElement('div');
    elasticityContainer.className = 'elasticity-container';
    
    // Label para o controle de elasticidade
    const elasticityLabel = document.createElement('label');
    elasticityLabel.htmlFor = 'collision-elasticity';
    elasticityLabel.textContent = 'Elasticidade das Colisões:';
    elasticityLabel.style.display = 'block';
    elasticityLabel.style.marginBottom = '5px';
    elasticityContainer.appendChild(elasticityLabel);
    
    // Container para o slider e o valor de elasticidade
    const elasticitySliderContainer = document.createElement('div');
    elasticitySliderContainer.style.display = 'flex';
    elasticitySliderContainer.style.alignItems = 'center';
    
    // Controle deslizante para a elasticidade
    const elasticitySlider = document.createElement('input');
    elasticitySlider.type = 'range';
    elasticitySlider.id = 'collision-elasticity';
    elasticitySlider.min = '0';
    elasticitySlider.max = '1';
    elasticitySlider.step = '0.1';
    elasticitySlider.value = '0.7';
    elasticitySlider.className = 'slider';
    elasticitySlider.style.flex = '1';
    elasticitySliderContainer.appendChild(elasticitySlider);
    
    // Display para o valor atual de elasticidade
    const elasticityValue = document.createElement('span');
    elasticityValue.id = 'elasticity-value';
    elasticityValue.textContent = '0.7';
    elasticityValue.style.marginLeft = '10px';
    elasticityValue.style.width = '35px';
    elasticitySliderContainer.appendChild(elasticityValue);
    
    // Adicionar o container do slider ao container de elasticidade
    elasticityContainer.appendChild(elasticitySliderContainer);
    
    // Adicionar o container de elasticidade à seção de colisões
    collisionsContainer.appendChild(elasticityContainer);
    
    // Container para o controle deslizante de intensidade de explosão
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'explosion-container';
    explosionContainer.style.marginTop = '10px';
    
    // Label para o controle de intensidade de explosão
    const explosionLabel = document.createElement('label');
    explosionLabel.htmlFor = 'explosion-intensity';
    explosionLabel.textContent = 'Intensidade das Explosões:';
    explosionLabel.style.display = 'block';
    explosionLabel.style.marginBottom = '5px';
    explosionContainer.appendChild(explosionLabel);
    
    // Container para o slider e o valor de intensidade de explosão
    const explosionSliderContainer = document.createElement('div');
    explosionSliderContainer.style.display = 'flex';
    explosionSliderContainer.style.alignItems = 'center';
    
    // Controle deslizante para intensidade de explosão
    const explosionSlider = document.createElement('input');
    explosionSlider.type = 'range';
    explosionSlider.id = 'explosion-intensity';
    explosionSlider.min = '0.5';
    explosionSlider.max = '2';
    explosionSlider.step = '0.1';
    explosionSlider.value = '1';
    explosionSlider.className = 'slider';
    explosionSlider.style.flex = '1';
    explosionSliderContainer.appendChild(explosionSlider);
    
    // Display para o valor atual de intensidade de explosão
    const explosionValue = document.createElement('span');
    explosionValue.id = 'explosion-value';
    explosionValue.textContent = '1.0x';
    explosionValue.style.marginLeft = '10px';
    explosionValue.style.width = '35px';
    explosionSliderContainer.appendChild(explosionValue);
    
    // Adicionar o container do slider ao container de intensidade de explosão
    explosionContainer.appendChild(explosionSliderContainer);
    
    // Adicionar o container de intensidade de explosão à seção de colisões
    collisionsContainer.appendChild(explosionContainer);
    
    // Inicialmente desativar controles de colisão
    elasticityContainer.style.opacity = '0.5';
    elasticityContainer.style.pointerEvents = 'none';
    explosionContainer.style.opacity = '0.5';
    explosionContainer.style.pointerEvents = 'none';
    
    // Evento para o toggle de colisões
    collisionsToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        
        // Disparar evento para ativar/desativar colisões
        document.dispatchEvent(new CustomEvent('toggle-collisions', {
            detail: { enabled: isEnabled }
        }));
        
        // Ativar/desativar controles dependentes
        elasticityContainer.style.opacity = isEnabled ? '1' : '0.5';
        elasticityContainer.style.pointerEvents = isEnabled ? 'auto' : 'none';
        explosionContainer.style.opacity = isEnabled ? '1' : '0.5';
        explosionContainer.style.pointerEvents = isEnabled ? 'auto' : 'none';
    });
    
    // Evento para o slider de elasticidade
    elasticitySlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        // Atualizar o display de valor
        elasticityValue.textContent = value.toFixed(1);
        
        // Disparar evento para ajustar a elasticidade
        document.dispatchEvent(new CustomEvent('set-collision-elasticity', {
            detail: { value: value }
        }));
    });
    
    // Evento para o slider de intensidade de explosão
    explosionSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        // Atualizar o display de valor
        explosionValue.textContent = value.toFixed(1) + 'x';
        
        // Disparar evento para ajustar a intensidade de explosão
        document.dispatchEvent(new CustomEvent('set-explosion-intensity', {
            detail: { value: value }
        }));
    });
    
    // Adicionar o container de colisões à seção de física
    content.appendChild(collisionsContainer);
} 