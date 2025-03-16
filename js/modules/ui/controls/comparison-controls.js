/**
 * Módulo para controles de comparação de planetas
 */
import { createAccordionSection } from './base-controls.js';

/**
 * Cria controles para o sistema de comparação de planetas
 * @param {HTMLElement} container - Container dos controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createComparisonControls(container, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Comparação de Planetas', 
        initiallyOpen
    );
    
    // Informação sobre o recurso
    const infoText = document.createElement('p');
    infoText.textContent = 'Selecione até 3 objetos para comparar suas características.';
    infoText.style.fontSize = '0.8em';
    infoText.style.color = '#aaa';
    infoText.style.margin = '5px 0';
    content.appendChild(infoText);
    
    // Botão para iniciar comparação
    const comparisonButton = document.createElement('button');
    comparisonButton.id = 'comparison-button';
    comparisonButton.textContent = 'Iniciar Comparação';
    comparisonButton.className = 'button action-button';
    comparisonButton.style.width = '100%';
    comparisonButton.style.padding = '8px';
    comparisonButton.style.backgroundColor = '#2980b9';
    comparisonButton.style.border = 'none';
    comparisonButton.style.borderRadius = '4px';
    comparisonButton.style.color = 'white';
    comparisonButton.style.cursor = 'pointer';
    comparisonButton.style.marginTop = '5px';
    content.appendChild(comparisonButton);
    
    // Evento para o botão de comparação
    comparisonButton.addEventListener('click', function() {
        // Disparar evento para iniciar/parar modo de comparação
        const isActive = comparisonButton.classList.toggle('active');
        
        // Atualizar estilo do botão
        if (isActive) {
            comparisonButton.style.backgroundColor = '#c0392b';
            comparisonButton.textContent = 'Cancelar Comparação';
        } else {
            comparisonButton.style.backgroundColor = '#2980b9';
            comparisonButton.textContent = 'Iniciar Comparação';
        }
        
        // Disparar evento de mudança de modo de comparação
        document.dispatchEvent(new CustomEvent('comparison-mode-changed', {
            detail: { active: isActive }
        }));
    });
} 