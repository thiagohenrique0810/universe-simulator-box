/**
 * Sistema de controles de simulação
 * Gerencia os controles para ajustar a velocidade e visibilidade dos elementos
 */

// Variáveis para controle da simulação
let simulationSpeed = 0.1; // Velocidade inicial da simulação ajustada para 0.1

// Variáveis para controle de visibilidade
let orbitLinesVisible = true;
let starsVisible = true;
let skyboxVisible = true; // Nova variável para controle do skybox
let asteroidBeltVisible = true;
let saturnRingsVisible = true;
let asteroidBeltRingVisible = true;

// Funções de callback para visibilidade
let visibilityCallbacks = {};

/**
 * Cria os controles de simulação e visibilidade
 * @param {Object} toggleCallbacks - Funções para alternar a visibilidade de elementos
 */
export function createSimulationControls({
    toggleOrbitsVisibility,
    toggleStarsVisibility,
    toggleSkyboxVisibility,
    toggleAsteroidBeltVisibility,
    toggleBeltRingVisibility,
    toggleSaturnRingsVisibility
}) {
    console.log('Criando controles de simulação...');
    
    // Criar o container principal para todos os controles
    const controlsContainer = createControlsContainer();
    
    // Criar os diferentes grupos de controles
    createSpeedControls(controlsContainer);
    createVisibilityControls({
        toggleOrbitsVisibility,
        toggleStarsVisibility,
        toggleSkyboxVisibility,
        toggleAsteroidBeltVisibility,
        toggleBeltRingVisibility,
        toggleSaturnRingsVisibility
    }, controlsContainer);
    createCaptureControls(controlsContainer);
    createNightModeControls(controlsContainer);
    createSearchControls(controlsContainer);
}

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
        document.body.appendChild(controlsContainer);
    }
    
    return controlsContainer;
}

/**
 * Cria os controles de velocidade da simulação
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createSpeedControls(controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Seção de controles de velocidade
    const speedSection = document.createElement('div');
    speedSection.className = 'control-section';
    
    // Título
    const speedTitle = document.createElement('h3');
    speedTitle.textContent = 'Velocidade da Simulação';
    speedSection.appendChild(speedTitle);
    
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
    speedSection.appendChild(sliderContainer);
    
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
    speedSection.appendChild(buttonsContainer);
    
    // Adicionar ao container principal
    controlsContainer.appendChild(speedSection);
}

/**
 * Cria os controles de visibilidade
 * @param {Object} toggleCallbacks - Funções para alternar a visibilidade de elementos
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createVisibilityControls({
    toggleOrbitsVisibility,
    toggleStarsVisibility,
    toggleSkyboxVisibility,
    toggleAsteroidBeltVisibility,
    toggleBeltRingVisibility,
    toggleSaturnRingsVisibility
}, controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Seção de controles de visibilidade
    const visibilitySection = document.createElement('div');
    visibilitySection.className = 'control-section';
    
    // Título
    const visibilityTitle = document.createElement('h3');
    visibilityTitle.textContent = 'Visibilidade';
    visibilitySection.appendChild(visibilityTitle);
    
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
            if (toggleOrbitsVisibility) {
                toggleOrbitsVisibility(isChecked);
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
            if (toggleStarsVisibility) {
                toggleStarsVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(starsCheckbox);
    
    // Checkbox para o skybox (Via Láctea)
    const skyboxCheckbox = createCheckbox(
        'Via Láctea (Fundo)', 
        skyboxVisible, 
        function(isChecked) {
            skyboxVisible = isChecked;
            if (toggleSkyboxVisibility) {
                toggleSkyboxVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(skyboxCheckbox);
    
    // Checkbox para cinturão de asteroides
    const asteroidsCheckbox = createCheckbox(
        'Cinturão de Asteroides', 
        asteroidBeltVisible, 
        function(isChecked) {
            asteroidBeltVisible = isChecked;
            if (toggleAsteroidBeltVisibility) {
                toggleAsteroidBeltVisibility(isChecked);
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
            if (toggleBeltRingVisibility) {
                toggleBeltRingVisibility(isChecked);
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
            if (toggleSaturnRingsVisibility) {
                toggleSaturnRingsVisibility(isChecked);
            }
        }
    );
    checkboxContainer.appendChild(saturnRingsCheckbox);
    
    visibilitySection.appendChild(checkboxContainer);
    
    // Adicionar ao container principal
    controlsContainer.appendChild(visibilitySection);
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
 * Retorna o estado atual de visibilidade dos elementos
 * @returns {Object} Estado de visibilidade
 */
export function getVisibilityState() {
    return {
        orbitLinesVisible,
        starsVisible,
        skyboxVisible,
        asteroidBeltVisible,
        saturnRingsVisible,
        asteroidBeltRingVisible
    };
}

/**
 * Cria os controles de captura de mídia (screenshots)
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createCaptureControls(controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Criar seção para captura de mídia
    const captureSection = document.createElement('div');
    captureSection.className = 'control-section';
    
    // Título da seção
    const captureTitle = document.createElement('h3');
    captureTitle.textContent = 'Captura de Mídia';
    captureSection.appendChild(captureTitle);
    
    // Botão para capturar screenshot
    const screenshotButton = document.createElement('button');
    screenshotButton.textContent = '📷 Capturar Screenshot';
    screenshotButton.className = 'control-button';
    screenshotButton.addEventListener('click', captureScreenshot);
    captureSection.appendChild(screenshotButton);
    
    // Adicionar seção ao container
    controlsContainer.appendChild(captureSection);
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

/**
 * Cria os controles para o modo noturno
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createNightModeControls(controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Criar seção para modo noturno
    const nightModeSection = document.createElement('div');
    nightModeSection.className = 'control-section';
    
    // Título da seção
    const nightModeTitle = document.createElement('h3');
    nightModeTitle.textContent = 'Conforto Visual';
    nightModeSection.appendChild(nightModeTitle);
    
    // Checkbox para modo noturno
    const nightModeLabel = document.createElement('label');
    nightModeLabel.className = 'control-checkbox';
    
    const nightModeCheckbox = document.createElement('input');
    nightModeCheckbox.type = 'checkbox';
    nightModeCheckbox.checked = isNightModeActive();
    nightModeCheckbox.addEventListener('change', function() {
        toggleNightMode(this.checked);
    });
    
    nightModeLabel.appendChild(nightModeCheckbox);
    nightModeLabel.appendChild(document.createTextNode('Modo Noturno'));
    nightModeSection.appendChild(nightModeLabel);
    
    // Slider para filtro de luz azul
    const blueFilterLabel = document.createElement('div');
    blueFilterLabel.textContent = 'Filtro de Luz Azul:';
    blueFilterLabel.style.marginTop = '10px';
    nightModeSection.appendChild(blueFilterLabel);
    
    const blueFilterSlider = document.createElement('input');
    blueFilterSlider.type = 'range';
    blueFilterSlider.min = '0';
    blueFilterSlider.max = '100';
    blueFilterSlider.value = getBlueFilterIntensity() * 100;
    blueFilterSlider.style.width = '100%';
    blueFilterSlider.addEventListener('input', function() {
        applyBlueFilter(this.value / 100);
    });
    nightModeSection.appendChild(blueFilterSlider);
    
    // Adicionar seção ao container
    controlsContainer.appendChild(nightModeSection);
    
    // Aplicar configurações salvas
    if (isNightModeActive()) {
        toggleNightMode(true);
    }
    applyBlueFilter(getBlueFilterIntensity());
}

/**
 * Verifica se o modo noturno está ativo
 * @returns {Boolean} Estado do modo noturno
 */
function isNightModeActive() {
    return localStorage.getItem('nightMode') === 'true';
}

/**
 * Obtém a intensidade do filtro de luz azul
 * @returns {Number} Intensidade do filtro (0-1)
 */
function getBlueFilterIntensity() {
    const intensity = parseFloat(localStorage.getItem('blueFilter'));
    return isNaN(intensity) ? 0 : intensity;
}

/**
 * Alterna o modo noturno
 * @param {Boolean} active - Se o modo noturno deve estar ativo
 */
function toggleNightMode(active) {
    localStorage.setItem('nightMode', active);
    
    // Criar ou obter o elemento de estilo para o modo noturno
    let nightModeStyle = document.getElementById('night-mode-style');
    
    if (!nightModeStyle) {
        nightModeStyle = document.createElement('style');
        nightModeStyle.id = 'night-mode-style';
        document.head.appendChild(nightModeStyle);
    }
    
    if (active) {
        // Aplicar estilo de modo noturno
        nightModeStyle.textContent = `
            #controls-container, #info {
                background-color: rgba(10, 10, 15, 0.85) !important;
            }
            
            .control-button {
                background-color: rgba(20, 20, 30, 0.9) !important;
                border-color: rgba(50, 50, 80, 0.7) !important;
            }
            
            .control-button:hover {
                background-color: rgba(30, 30, 50, 0.9) !important;
            }
            
            h1, h2, h3, p, label {
                color: rgba(200, 200, 220, 0.9) !important;
            }
        `;
    } else {
        // Remover estilo de modo noturno
        nightModeStyle.textContent = '';
    }
    
    // Mostrar feedback ao usuário
    showTemporaryMessage(active ? 'Modo noturno ativado' : 'Modo noturno desativado');
}

/**
 * Aplica o filtro de luz azul
 * @param {Number} intensity - Intensidade do filtro (0-1)
 */
function applyBlueFilter(intensity) {
    localStorage.setItem('blueFilter', intensity);
    
    // Criar ou obter o elemento de estilo para o filtro
    let blueFilterStyle = document.getElementById('blue-filter-style');
    
    if (!blueFilterStyle) {
        blueFilterStyle = document.createElement('style');
        blueFilterStyle.id = 'blue-filter-style';
        document.head.appendChild(blueFilterStyle);
    }
    
    if (intensity > 0) {
        // Cores mais quentes para reduzir a luz azul
        const filterValue = `sepia(${intensity * 30}%) saturate(${100 - intensity * 20}%) 
                             brightness(${100 - intensity * 10}%) hue-rotate(${-intensity * 30}deg)`;
        
        blueFilterStyle.textContent = `
            body, #scene-container, canvas {
                filter: ${filterValue} !important;
            }
        `;
    } else {
        // Remover filtro
        blueFilterStyle.textContent = '';
    }
}

/**
 * Cria o sistema de busca para objetos do sistema solar
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createSearchControls(controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Importar dinamicamente os dados dos planetas
    import('../data/planet-data.js').then(({ PLANET_DATA }) => {
        // Criar seção para sistema de busca
        const searchSection = document.createElement('div');
        searchSection.className = 'control-section';
        
        // Título da seção
        const searchTitle = document.createElement('h3');
        searchTitle.textContent = 'Busca de Objetos';
        searchSection.appendChild(searchTitle);
        
        // Container de busca
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        // Campo de busca
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar planeta, lua ou planeta anão...';
        searchInput.className = 'search-input';
        searchContainer.appendChild(searchInput);
        
        // Container de resultados
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.style.display = 'none';
        searchContainer.appendChild(resultsContainer);
        
        // Adicionar evento de busca
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }
            
            // Exibir resultados
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '';
            
            // Compilar lista de todos os objetos pesquisáveis
            const searchableObjects = [];
            
            // Adicionar planetas
            Object.entries(PLANET_DATA).forEach(([key, planet]) => {
                if (key !== 'unidades') {
                    // Garantir que o planeta tenha um nome
                    const planetName = planet.nome || key.charAt(0).toUpperCase() + key.slice(1);
                    
                    searchableObjects.push({
                        name: planetName,
                        key: key,
                        type: 'Planeta',
                        info: planet.descricao || `${planetName} é um planeta do Sistema Solar`
                    });
                    
                    // Adicionar luas do planeta, se houver
                    if (planet.satellites && Array.isArray(planet.satellites)) {
                        planet.satellites.forEach(moon => {
                            if (moon && moon.name) {
                                const moonName = moon.name.charAt(0).toUpperCase() + moon.name.slice(1);
                                searchableObjects.push({
                                    name: moonName,
                                    key: moon.name.toLowerCase(),
                                    parent: planetName,
                                    parentKey: key,
                                    type: 'Lua',
                                    info: `${moonName} é uma lua de ${planetName}`
                                });
                            }
                        });
                    }
                    
                    // Adicionar planetas anões, se houver
                    if (planet.planetasAnoes && Array.isArray(planet.planetasAnoes)) {
                        planet.planetasAnoes.forEach(dwarfPlanet => {
                            if (dwarfPlanet && dwarfPlanet.nome) {
                                searchableObjects.push({
                                    name: dwarfPlanet.nome,
                                    key: dwarfPlanet.id || dwarfPlanet.nome.toLowerCase(),
                                    type: 'Planeta Anão',
                                    info: dwarfPlanet.descricao || `${dwarfPlanet.nome} é um planeta anão do Sistema Solar`
                                });
                            }
                        });
                    }
                }
            });
            
            // Filtrar objetos baseado na query
            const filteredObjects = searchableObjects.filter(obj => {
                // Verificar se o objeto e suas propriedades existem
                if (!obj || !obj.name) return false;
                
                // Verificar nome
                const nameMatch = obj.name.toLowerCase().includes(query);
                
                // Verificar info (descrição)
                const infoMatch = obj.info ? obj.info.toLowerCase().includes(query) : false;
                
                // Verificar tipo
                const typeMatch = obj.type ? obj.type.toLowerCase().includes(query) : false;
                
                return nameMatch || infoMatch || typeMatch;
            });
            
            // Limitar a 10 resultados
            const displayResults = filteredObjects.slice(0, 10);
            
            // Se não houver resultados
            if (displayResults.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'search-no-results';
                noResults.textContent = 'Nenhum resultado encontrado';
                resultsContainer.appendChild(noResults);
                return;
            }
            
            // Criar elementos para cada resultado
            displayResults.forEach(obj => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                // Aplicar ícone de acordo com o tipo
                const icon = document.createElement('span');
                icon.className = 'search-result-icon';
                
                if (obj.type === 'Planeta') {
                    icon.textContent = '🪐';
                } else if (obj.type === 'Lua') {
                    icon.textContent = '🌙';
                } else if (obj.type === 'Planeta Anão') {
                    icon.textContent = '⚪';
                } else {
                    icon.textContent = '✨';
                }
                
                resultItem.appendChild(icon);
                
                // Nome e tipo
                const infoContainer = document.createElement('div');
                infoContainer.className = 'search-result-info';
                
                const nameElement = document.createElement('div');
                nameElement.className = 'search-result-name';
                nameElement.textContent = obj.name;
                infoContainer.appendChild(nameElement);
                
                const typeElement = document.createElement('div');
                typeElement.className = 'search-result-type';
                typeElement.textContent = obj.parent ? `${obj.type} de ${obj.parent}` : obj.type;
                infoContainer.appendChild(typeElement);
                
                resultItem.appendChild(infoContainer);
                
                // Adicionar evento de clique para focar no objeto
                resultItem.addEventListener('click', () => {
                    // Localizar o objeto na cena usando o evento personalizado
                    const focusEvent = new CustomEvent('focus-object', {
                        detail: {
                            objectKey: obj.parent ? obj.parentKey : obj.key,
                            objectName: obj.name,
                            isMoon: obj.type === 'Lua',
                            isDwarfPlanet: obj.type === 'Planeta Anão'
                        }
                    });
                    document.dispatchEvent(focusEvent);
                    
                    // Limpar busca e esconder resultados
                    searchInput.value = '';
                    resultsContainer.style.display = 'none';
                    
                    // Mostrar mensagem de feedback
                    showTemporaryMessage(`Focando em ${obj.name}`);
                });
                
                resultsContainer.appendChild(resultItem);
            });
            
            // Adicionar atalhos para navegação com teclado
            handleKeyboardNavigation(resultsContainer, searchInput);
        });
        
        // Manipulador de eventos para clicar fora da busca
        document.addEventListener('click', function(event) {
            if (!searchContainer.contains(event.target)) {
                resultsContainer.style.display = 'none';
            }
        });
        
        // Adicionar elementos ao DOM
        searchSection.appendChild(searchContainer);
        controlsContainer.appendChild(searchSection);
    }).catch(error => {
        console.error('Erro ao carregar dados para o sistema de busca:', error);
    });
}

/**
 * Manipula navegação por teclado nos resultados da busca
 * @param {HTMLElement} resultsContainer - Container de resultados
 * @param {HTMLElement} searchInput - Campo de busca
 */
function handleKeyboardNavigation(resultsContainer, searchInput) {
    let selectedIndex = -1;
    const resultItems = resultsContainer.querySelectorAll('.search-result-item');
    
    // Remover seleção anterior
    const clearSelection = () => {
        resultItems.forEach(item => item.classList.remove('selected'));
    };
    
    // Adicionar evento de tecla ao campo de busca
    searchInput.addEventListener('keydown', function(event) {
        // Se os resultados não estiverem visíveis, não fazer nada
        if (resultsContainer.style.display === 'none') return;
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                clearSelection();
                selectedIndex = (selectedIndex + 1) % resultItems.length;
                resultItems[selectedIndex].classList.add('selected');
                resultItems[selectedIndex].scrollIntoView({ block: 'nearest' });
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                clearSelection();
                selectedIndex = selectedIndex <= 0 ? resultItems.length - 1 : selectedIndex - 1;
                resultItems[selectedIndex].classList.add('selected');
                resultItems[selectedIndex].scrollIntoView({ block: 'nearest' });
                break;
                
            case 'Enter':
                if (selectedIndex >= 0) {
                    event.preventDefault();
                    resultItems[selectedIndex].click();
                }
                break;
                
            case 'Escape':
                event.preventDefault();
                resultsContainer.style.display = 'none';
                searchInput.blur();
                break;
        }
    });
} 