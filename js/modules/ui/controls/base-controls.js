/**
 * Módulo base para o sistema de controles
 * Contém funções compartilhadas e estrutura base
 */

// Exportar funções úteis para outros módulos
export { 
    createControlsContainer,
    createToggleControlsButton,
    createAccordionSection,
    createCheckbox,
    showTemporaryMessage
};

/**
 * Cria o container principal para os controles
 * @returns {HTMLElement} Container de controles
 */
function createControlsContainer() {
    // Verificar se já existe um container
    let controlsContainer = document.getElementById('controls-container');
    
    if (!controlsContainer) {
        // Criar container para controles
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-container';
        controlsContainer.className = 'controls-container';
        
        // Verificar se os controles devem iniciar ocultos
        const controlsHidden = localStorage.getItem('controlsHidden') === 'true';
        if (controlsHidden) {
            controlsContainer.classList.add('hidden');
        }
        
        document.body.appendChild(controlsContainer);
    }
    
    return controlsContainer;
}

/**
 * Cria o botão para mostrar/ocultar o painel de controles
 */
function createToggleControlsButton() {
    // Verificar se o botão já existe
    let toggleButton = document.getElementById('toggle-controls-btn');
    
    if (!toggleButton) {
        // Criar botão
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-controls-btn';
        toggleButton.setAttribute('title', 'Mostrar/Ocultar Controles');
        
        // Criar ícone para o botão
        const icon = document.createElement('span');
        icon.className = 'toggle-icon-rotate';
        icon.innerHTML = '⚙️'; // Ícone de engrenagem (unicode)
        
        // Verificar estado salvo
        const controlsHidden = localStorage.getItem('controlsHidden') === 'true';
        if (!controlsHidden) {
            icon.classList.add('open');
        }
        
        toggleButton.appendChild(icon);
        
        // Adicionar evento de clique
        toggleButton.addEventListener('click', toggleControlsPanel);
        
        // Adicionar ao documento
        document.body.appendChild(toggleButton);
    }
    
    return toggleButton;
}

/**
 * Alterna a visibilidade do painel de controles
 */
function toggleControlsPanel() {
    const controlsContainer = document.getElementById('controls-container');
    const toggleIcon = document.querySelector('.toggle-icon-rotate');
    
    if (!controlsContainer) return;
    
    // Verificar estado atual
    const isHidden = controlsContainer.classList.toggle('hidden');
    
    // Animar ícone
    if (isHidden) {
        toggleIcon.classList.remove('open');
    } else {
        toggleIcon.classList.add('open');
    }
    
    // Salvar preferência do usuário
    localStorage.setItem('controlsHidden', isHidden);
    
    // Mostrar feedback
    showTemporaryMessage(isHidden ? 'Controles ocultados' : 'Controles visíveis');
}

/**
 * Cria uma seção de controle no formato acordeão
 * @param {HTMLElement} container - Container para a seção
 * @param {String} title - Título da seção
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 * @returns {Object} - Objetos contendo o header, content e a seção completa
 */
function createAccordionSection(container, title, initiallyOpen = false) {
    // Criar a seção
    const section = document.createElement('section');
    section.className = 'controls-section';
    container.appendChild(section);
    
    // Criar o cabeçalho clicável
    const header = document.createElement('div');
    header.className = initiallyOpen ? 'section-header' : 'section-header closed';
    section.appendChild(header);
    
    // Título da seção
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = title;
    header.appendChild(headerTitle);
    
    // Ícone de expansão/contração
    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.textContent = '▼';
    header.appendChild(toggleIcon);
    
    // Conteúdo da seção
    const content = document.createElement('div');
    content.className = initiallyOpen ? 'section-content' : 'section-content closed';
    section.appendChild(content);
    
    // Adicionar evento de clique para expandir/contrair
    header.addEventListener('click', function() {
        const isClosed = header.classList.toggle('closed');
        content.classList.toggle('closed', isClosed);
    });
    
    return { section, header, content };
}

/**
 * Função auxiliar para criar checkbox
 * @param {String} label - Texto do label
 * @param {Boolean} initialState - Estado inicial do checkbox
 * @param {Function} onChange - Função a ser chamada quando o estado mudar
 * @returns {HTMLElement} Elemento do checkbox com label
 */
function createCheckbox(label, initialState, onChange) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = initialState;
    checkbox.style.margin = '0 5px 0 0';
    checkbox.addEventListener('change', function() {
        onChange(this.checked);
    });
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.fontSize = '12px';
    
    container.appendChild(checkbox);
    container.appendChild(labelElement);
    
    return container;
}

/**
 * Exibe uma mensagem temporária para o usuário
 * @param {String} message - Mensagem a ser exibida
 * @param {Boolean} isError - Indica se é uma mensagem de erro
 */
function showTemporaryMessage(message, isError = false) {
    // Verificar se já existe uma mensagem
    let messageElement = document.getElementById('temp-message');
    
    if (!messageElement) {
        // Criar elemento de mensagem
        messageElement = document.createElement('div');
        messageElement.id = 'temp-message';
        messageElement.style.position = 'fixed';
        messageElement.style.bottom = '20px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.zIndex = '1000';
        messageElement.style.transition = 'opacity 0.5s';
        document.body.appendChild(messageElement);
    }
    
    // Configurar estilo baseado no tipo de mensagem
    if (isError) {
        messageElement.style.backgroundColor = 'rgba(255, 50, 50, 0.8)';
    } else {
        messageElement.style.backgroundColor = 'rgba(50, 200, 50, 0.8)';
    }
    
    // Definir texto e mostrar
    messageElement.textContent = message;
    messageElement.style.opacity = '1';
    
    // Esconder após 3 segundos
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 500);
    }, 3000);
} 