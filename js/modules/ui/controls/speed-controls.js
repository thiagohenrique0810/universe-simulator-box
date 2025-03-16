/**
 * Módulo para controles de velocidade da simulação
 */
import { createAccordionSection } from './base-controls.js';

// Variável para controle da velocidade da simulação
let simulationSpeed = 0.1; // Velocidade inicial ajustada para 0.1

/**
 * Cria os controles de velocidade da simulação
 * @param {HTMLElement} controlsContainer - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createSpeedControls(controlsContainer, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        controlsContainer, 
        'Velocidade da Simulação', 
        initiallyOpen
    );
    
    // Container para o slider e o valor
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    
    // Criar slider para a velocidade
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0';
    speedSlider.max = '2';
    speedSlider.step = '0.1';
    speedSlider.value = simulationSpeed.toString();
    speedSlider.style.width = '150px';
    
    // Exibir o valor atual
    const speedValue = document.createElement('span');
    speedValue.textContent = `${simulationSpeed.toFixed(1)}x`;
    speedValue.style.marginLeft = '10px';
    speedValue.style.width = '30px';
    
    // Ao mover o slider, atualizar a velocidade da simulação
    speedSlider.addEventListener('input', function() {
        simulationSpeed = parseFloat(this.value);
        speedValue.textContent = `${simulationSpeed.toFixed(1)}x`;
    });
    
    sliderContainer.appendChild(speedSlider);
    sliderContainer.appendChild(speedValue);
    content.appendChild(sliderContainer);
    
    // Adicionar botões de controle rápido
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.marginTop = '5px';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    
    const buttonStyle = 'background-color: #444; border: none; color: white; padding: 2px 8px; ' +
                        'border-radius: 3px; margin: 0 2px; cursor: pointer;';
    
    // Botão para parar (0x)
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Parar';
    stopButton.style.cssText = buttonStyle;
    stopButton.addEventListener('click', function() {
        simulationSpeed = 0;
        speedSlider.value = '0';
        speedValue.textContent = '0.0x';
    });
    
    // Botão para velocidade normal (1x)
    const normalButton = document.createElement('button');
    normalButton.textContent = 'Normal';
    normalButton.style.cssText = buttonStyle;
    normalButton.addEventListener('click', function() {
        simulationSpeed = 1;
        speedSlider.value = '1';
        speedValue.textContent = '1.0x';
    });
    
    // Botão para velocidade rápida (2x)
    const fastButton = document.createElement('button');
    fastButton.textContent = 'Rápido';
    fastButton.style.cssText = buttonStyle;
    fastButton.addEventListener('click', function() {
        simulationSpeed = 2;
        speedSlider.value = '2';
        speedValue.textContent = '2.0x';
    });
    
    buttonsContainer.appendChild(stopButton);
    buttonsContainer.appendChild(normalButton);
    buttonsContainer.appendChild(fastButton);
    content.appendChild(buttonsContainer);
}

/**
 * Retorna a velocidade atual da simulação
 * @returns {Number} Velocidade da simulação
 */
export function getSimulationSpeed() {
    return simulationSpeed;
}

/**
 * Define a velocidade da simulação
 * @param {Number} speed - Nova velocidade
 */
export function setSimulationSpeed(speed) {
    simulationSpeed = speed;
} 