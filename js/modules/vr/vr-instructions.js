/**
 * Módulo de Instruções VR
 * Exibe um modal com instruções detalhadas para o uso do modo VR
 */

// Estado do módulo
let instructionsShown = false;  // Se as instruções já foram mostradas
let instructionsModal = null;   // Elemento DOM do modal

/**
 * Inicializa o módulo de instruções VR
 * @returns {Object} API do módulo
 */
export function initVRInstructions() {
    // Verificar storage se as instruções já foram vistas
    instructionsShown = localStorage.getItem('vrInstructionsShown') === 'true';
    
    // Criar o modal de instruções
    createInstructionsModal();
    
    // Retornar API pública
    return {
        showInstructions,
        hideInstructions,
        hasSeenInstructions: () => instructionsShown
    };
}

/**
 * Cria o modal de instruções VR
 */
function createInstructionsModal() {
    // Verificar se o modal já existe
    if (document.getElementById('vr-instructions-modal')) {
        return;
    }
    
    // Criar o elemento do modal
    instructionsModal = document.createElement('div');
    instructionsModal.id = 'vr-instructions-modal';
    instructionsModal.className = 'vr-instructions-modal';
    
    // Conteúdo do modal
    instructionsModal.innerHTML = `
        <div class="vr-instructions-content">
            <button id="vr-close-instructions" class="vr-close-button">&times;</button>
            <h2 class="vr-instructions-title">Instruções para o Modo VR</h2>
            
            <div class="vr-instructions-sections">
                <div class="vr-instruction-section">
                    <h4>Navegação</h4>
                    <ul>
                        <li><strong>Movimentação:</strong> Use o joystick do controle direito</li>
                        <li><strong>Teleporte:</strong> Aponte e pressione o gatilho</li>
                        <li><strong>Rotação:</strong> Gire fisicamente ou use os botões do controle</li>
                        <li><strong>Zoom:</strong> Aproxime ou afaste os controles</li>
                    </ul>
                </div>
                
                <div class="vr-instruction-section">
                    <h4>Interação</h4>
                    <ul>
                        <li><strong>Selecionar:</strong> Aponte e pressione o gatilho</li>
                        <li><strong>Agarrar:</strong> Aponte e segure o botão lateral</li>
                        <li><strong>Info:</strong> Toque em planetas para ver detalhes</li>
                        <li><strong>Pausa:</strong> Pressione o botão menu</li>
                    </ul>
                </div>
                
                <div class="vr-instruction-section">
                    <h4>Visão</h4>
                    <ul>
                        <li><strong>Escala:</strong> Ajuste no painel de controle</li>
                        <li><strong>Visibilidade:</strong> Toggle de elementos no menu</li>
                        <li><strong>Reset:</strong> Botão especial no controle esquerdo</li>
                        <li><strong>Perspectiva:</strong> Alterne entre primeira/terceira pessoa</li>
                    </ul>
                </div>
                
                <div class="vr-instruction-section">
                    <h4>Dicas</h4>
                    <ul>
                        <li>Remova o headset para pausar automaticamente</li>
                        <li>Procure áreas azuis para teleporte seguro</li>
                        <li>Toque duas vezes em um planeta para focar nele</li>
                        <li>Use o botão "Y" para alternar o painel de controle</li>
                    </ul>
                </div>
            </div>
            
            <button id="vr-start-experience" class="vr-start-button">Iniciar Experiência VR</button>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(instructionsModal);
    
    // Adicionar event listeners
    document.getElementById('vr-close-instructions').addEventListener('click', hideInstructions);
    document.getElementById('vr-start-experience').addEventListener('click', () => {
        hideInstructions();
        // Emitir evento para iniciar o modo VR
        window.dispatchEvent(new CustomEvent('vr-instructions-complete'));
    });
    
    // Permitir fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && instructionsModal.classList.contains('active')) {
            hideInstructions();
        }
    });
}

/**
 * Mostra o modal de instruções VR
 */
export function showInstructions() {
    if (!instructionsModal) {
        createInstructionsModal();
    }
    
    instructionsModal.classList.add('active');
}

/**
 * Esconde o modal de instruções VR e marca como visto
 */
export function hideInstructions() {
    if (instructionsModal) {
        instructionsModal.classList.remove('active');
        
        // Marcar como visto
        instructionsShown = true;
        localStorage.setItem('vrInstructionsShown', 'true');
    }
}

/**
 * Detecta o tipo de dispositivo VR conectado
 * @returns {Promise<Object>} Informações sobre o dispositivo
 */
export async function detectVRDevice() {
    if (!navigator.xr) {
        return { supported: false, device: null };
    }
    
    try {
        // Verificar se o VR imersivo é suportado
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        
        if (!isSupported) {
            return { supported: false, device: null };
        }
        
        // No WebXR, não há uma API direta para obter informações do dispositivo
        // Podemos tentar inferir com base em algumas características
        // Isto é um placeholder - uma implementação real dependeria de um detector específico
        return { 
            supported: true, 
            device: 'generic-vr-headset',
            controllers: true
        };
    } catch (error) {
        console.error('Erro ao detectar dispositivo VR:', error);
        return { supported: false, device: null, error };
    }
}

/**
 * Cria um elemento de notificação sobre a disponibilidade de VR
 * @param {boolean} isDetected - Se um dispositivo VR foi detectado
 * @param {string} deviceName - Nome do dispositivo, se detectado
 */
export function createVRNotification(isDetected, deviceName = 'dispositivo VR') {
    // Remover notificação anterior, se existir
    const existingNotification = document.getElementById('vr-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.id = 'vr-notification';
    notification.className = isDetected ? 'vr-notification vr-detected' : 'vr-notification vr-not-detected';
    
    notification.innerHTML = isDetected 
        ? `<strong>Dispositivo VR Detectado:</strong> ${deviceName}. Clique no botão "Entrar no Modo VR" para iniciar.`
        : `<strong>VR não detectado.</strong> Conecte um dispositivo compatível para utilizar o modo VR.`;
    
    // Adicionar ao DOM
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
        const vrSection = controlPanel.querySelector('fieldset legend:contains("Realidade Virtual")').parentNode;
        if (vrSection) {
            vrSection.appendChild(notification);
        } else {
            controlPanel.appendChild(notification);
        }
    } else {
        document.body.appendChild(notification);
    }
    
    // Remover após alguns segundos
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => notification.remove(), 1000);
    }, 8000);
} 