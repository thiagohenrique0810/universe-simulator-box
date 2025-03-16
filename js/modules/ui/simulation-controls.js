/**
 * Sistema de controles de simulação
 * Gerencia os controles para ajustar a velocidade e visibilidade dos elementos
 */

// Variáveis para controle da simulação
let simulationSpeed = 1.0; // Velocidade padrão da simulação

// Variáveis para controle de visibilidade
let orbitLinesVisible = true;
let starsVisible = true;
let asteroidBeltVisible = true;
let saturnRingsVisible = true;
let asteroidBeltRingVisible = true;

// Funções de callback para visibilidade
let visibilityCallbacks = {};

/**
 * Cria os controles de simulação
 * @param {Object} callbacks - Funções de callback para controle de visibilidade
 * @returns {Object} Objeto com as variáveis de controle
 */
export function createSimulationControls(callbacks) {
    // Armazenar callbacks
    visibilityCallbacks = callbacks;
    
    // Criar container para controles
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'simulation-controls';
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '10px';
    controlsContainer.style.left = '10px';
    controlsContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    controlsContainer.style.padding = '10px';
    controlsContainer.style.borderRadius = '5px';
    controlsContainer.style.color = 'white';
    controlsContainer.style.fontFamily = 'Arial, sans-serif';
    controlsContainer.style.zIndex = '100';
    
    // Título
    const title = document.createElement('div');
    title.textContent = 'Velocidade da Simulação';
    title.style.marginBottom = '5px';
    controlsContainer.appendChild(title);
    
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
    controlsContainer.appendChild(sliderContainer);
    
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
    controlsContainer.appendChild(buttonsContainer);
    
    // Adicionar seção de controles de visibilidade
    const visibilityTitle = document.createElement('div');
    visibilityTitle.textContent = 'Controles de Visibilidade';
    visibilityTitle.style.fontWeight = 'bold';
    visibilityTitle.style.marginTop = '10px';
    visibilityTitle.style.marginBottom = '5px';
    controlsContainer.appendChild(visibilityTitle);
    
    // Container para os checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.flexDirection = 'column';
    checkboxContainer.style.gap = '3px';
    
    // Checkbox para linhas de órbita
    const orbitCheckbox = createCheckbox(
        'Linhas de Órbita', 
        orbitLinesVisible, 
        function(isChecked) {
            orbitLinesVisible = isChecked;
            if (callbacks.toggleOrbitsVisibility) {
                callbacks.toggleOrbitsVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(orbitCheckbox);
    
    // Checkbox para estrelas
    const starsCheckbox = createCheckbox(
        'Estrelas', 
        starsVisible, 
        function(isChecked) {
            starsVisible = isChecked;
            if (callbacks.toggleStarsVisibility) {
                callbacks.toggleStarsVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(starsCheckbox);
    
    // Checkbox para cinturão de asteroides
    const asteroidsCheckbox = createCheckbox(
        'Cinturão de Asteroides', 
        asteroidBeltVisible, 
        function(isChecked) {
            asteroidBeltVisible = isChecked;
            if (callbacks.toggleAsteroidBeltVisibility) {
                callbacks.toggleAsteroidBeltVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(asteroidsCheckbox);
    
    // Checkbox para representação visual do cinturão de asteroides (anel)
    const beltRingCheckbox = createCheckbox(
        'Anel do Cinturão', 
        asteroidBeltRingVisible, 
        function(isChecked) {
            asteroidBeltRingVisible = isChecked;
            if (callbacks.toggleBeltRingVisibility) {
                callbacks.toggleBeltRingVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(beltRingCheckbox);
    
    // Checkbox para anéis de Saturno
    const saturnRingsCheckbox = createCheckbox(
        'Anéis de Saturno', 
        saturnRingsVisible, 
        function(isChecked) {
            saturnRingsVisible = isChecked;
            if (callbacks.toggleSaturnRingsVisibility) {
                callbacks.toggleSaturnRingsVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(saturnRingsCheckbox);
    
    controlsContainer.appendChild(checkboxContainer);
    
    // Adicionar ao DOM
    document.body.appendChild(controlsContainer);
    
    return {
        simulationSpeed,
        orbitLinesVisible,
        starsVisible,
        asteroidBeltVisible,
        saturnRingsVisible,
        asteroidBeltRingVisible
    };
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

/**
 * Retorna o estado de visibilidade dos elementos
 * @returns {Object} Estado de visibilidade
 */
export function getVisibilityState() {
    return {
        orbitLinesVisible,
        starsVisible,
        asteroidBeltVisible,
        saturnRingsVisible,
        asteroidBeltRingVisible
    };
} 