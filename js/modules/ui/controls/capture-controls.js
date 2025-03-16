/**
 * Módulo para controles de captura de mídia (screenshots)
 */
import { createAccordionSection, showTemporaryMessage } from './base-controls.js';

/**
 * Cria os controles de captura de mídia (screenshots)
 * @param {HTMLElement} controlsContainer - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
export function createCaptureControls(controlsContainer, initiallyOpen = false) {
    // Criar seção acordeão
    const { content } = createAccordionSection(
        controlsContainer, 
        'Captura de Mídia', 
        initiallyOpen
    );
    
    // Botão para capturar screenshot
    const screenshotButton = document.createElement('button');
    screenshotButton.textContent = '📷 Capturar Screenshot';
    screenshotButton.className = 'control-button';
    screenshotButton.style.width = '100%';
    screenshotButton.style.padding = '8px';
    screenshotButton.style.backgroundColor = '#2c3e50';
    screenshotButton.style.border = 'none';
    screenshotButton.style.borderRadius = '4px';
    screenshotButton.style.color = 'white';
    screenshotButton.style.cursor = 'pointer';
    screenshotButton.style.marginTop = '5px';
    screenshotButton.addEventListener('click', captureScreenshot);
    content.appendChild(screenshotButton);
}

/**
 * Captura um screenshot da simulação
 */
function captureScreenshot() {
    const renderer = document.querySelector('canvas');
    if (!renderer) {
        console.error('Canvas não encontrado para capturar screenshot');
        return;
    }
    
    try {
        // Capturar a imagem do canvas
        const image = renderer.toDataURL('image/png');
        
        // Criar link para download
        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = `sistema-solar-screenshot-${new Date().toISOString().replace(/:/g, '-')}.png`;
        
        // Simular clique para iniciar download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Mostrar feedback ao usuário
        showTemporaryMessage('Screenshot capturado com sucesso!');
    } catch (error) {
        console.error('Erro ao capturar screenshot:', error);
        showTemporaryMessage('Erro ao capturar screenshot', true);
    }
} 