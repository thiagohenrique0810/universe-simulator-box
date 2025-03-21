/**
 * Módulo para gerenciar a tela de carregamento
 * Controla o progresso, status e visibilidade da tela de carregamento
 */

// Estado do carregamento
let totalSteps = 0;
let currentStep = 0;
let loadingComplete = false;

/**
 * Inicializa o sistema de carregamento
 * @param {number} steps - Número total de etapas de carregamento
 */
export function initLoadingScreen(steps) {
    totalSteps = steps || 10; // valor padrão de 10 etapas
    currentStep = 0;
    loadingComplete = false;
    
    // Não precisamos garantir que a tela de carregamento esteja visível,
    // pois isso será controlado pelo botão de início no app.js
    
    // Inicializar a barra de progresso
    updateProgressBar(0);
    
    console.log('Tela de carregamento inicializada com', totalSteps, 'etapas');
    return {
        updateProgress,
        updateStatus,
        completeLoading,
        simulateLoading
    };
}

/**
 * Atualiza o progresso de carregamento
 * @param {string} status - Mensagem de status opcional
 */
export function updateProgress(status = null) {
    if (loadingComplete) return;
    
    currentStep++;
    const progress = Math.min((currentStep / totalSteps) * 100, 100);
    
    updateProgressBar(progress);
    
    if (status) {
        updateStatus(status);
    }
    
    console.log(`Progresso de carregamento: ${progress.toFixed(1)}% - Etapa ${currentStep}/${totalSteps}`);
    
    // Verificar se o carregamento está concluído
    if (currentStep >= totalSteps) {
        console.log('Todas as etapas de carregamento concluídas');
        // Não ocultamos automaticamente para permitir controle manual
    }
    
    return progress;
}

/**
 * Atualiza a mensagem de status na tela de carregamento
 * @param {string} message - Mensagem de status para exibir
 */
export function updateStatus(message) {
    const statusElement = document.getElementById('loading-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

/**
 * Atualiza a barra de progresso visual
 * @param {number} percent - Porcentagem de progresso (0-100)
 */
function updateProgressBar(percent) {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
}

/**
 * Conclui o carregamento e oculta a tela de carregamento
 * @param {number} delay - Atraso em ms antes de ocultar a tela
 */
export function completeLoading(delay = 800) {
    if (loadingComplete) return;
    
    // Assegurar que a barra de progresso esteja em 100%
    updateProgressBar(100);
    updateStatus('Carregamento concluído!');
    
    loadingComplete = true;
    
    // Aguardar o atraso especificado e então ocultar a tela
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        console.log('Tela de carregamento ocultada após delay de', delay, 'ms');
    }, delay);
}

/**
 * Simula o carregamento para testes, com mensagens de carregamento fictícias
 * @param {number} duration - Duração total da simulação em ms
 */
export function simulateLoading(duration = 5000) {
    const loadingMessages = [
        "Inicializando o sistema solar...",
        "Calculando órbitas planetárias...",
        "Criando texturas dos planetas...",
        "Configurando cinturão de asteroides...",
        "Preparando sistema de iluminação...",
        "Posicionando estrelas no fundo...",
        "Inicializando controles da câmera...",
        "Configurando física gravitacional...",
        "Carregando trajetórias de missões espaciais...",
        "Finalizando preparativos..."
    ];
    
    const stepTime = duration / totalSteps;
    let step = 0;
    
    const interval = setInterval(() => {
        if (step < totalSteps) {
            const messageIndex = Math.min(step, loadingMessages.length - 1);
            updateStatus(loadingMessages[messageIndex]);
            updateProgress();
            step++;
        } else {
            clearInterval(interval);
            completeLoading();
        }
    }, stepTime);
} 