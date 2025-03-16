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
 * Cria o painel de controles da simulação
 * @returns {HTMLElement} Container dos controles
 */
export function createSimulationControls() {
    // Criar container para controles
    const controlsContainer = createControlsContainer();
    
    // Título principal
    const mainTitle = document.createElement('h2');
    mainTitle.textContent = 'Controles da Simulação';
    mainTitle.style.textAlign = 'center';
    mainTitle.style.margin = '0 0 15px 0';
    mainTitle.style.borderBottom = '2px solid #555';
    mainTitle.style.paddingBottom = '8px';
    controlsContainer.appendChild(mainTitle);
    
    // Criar controles de velocidade (inicialmente aberto)
    createSpeedControls(controlsContainer, true);
    
    // Criar controles de visibilidade
    createVisibilityControls(controlsContainer);
    
    // Criar controles de captura de mídia
    createCaptureControls(controlsContainer);
    
    // Criar controles de modo noturno
    createNightModeControls(controlsContainer);
    
    // Criar controles de comparação de planetas
    createComparisonControls(controlsContainer);
    
    // Criar controles de física avançada
    createPhysicsControls(controlsContainer);
    
    // Criar controles de busca (sempre visível)
    createSearchControls(controlsContainer);
    
    return controlsContainer;
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
 * Cria os controles de velocidade da simulação
 * @param {HTMLElement} controlsContainer - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createSpeedControls(controlsContainer, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
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
 * Cria os controles de visibilidade
 * @param {HTMLElement} container - Container para os controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createVisibilityControls(container, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    container = container || createControlsContainer();
    
    // Criar seção acordeão
    const { content } = createAccordionSection(
        container, 
        'Visibilidade', 
        initiallyOpen
    );
    
    // Container para os checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.flexDirection = 'column';
    checkboxContainer.style.gap = '3px';
    
    // Checkbox para linhas de órbita
    const orbitCheckbox = createCheckbox(
        'Linhas de Órbita', 
        orbitLinesVisible, 
        function(checked) {
            orbitLinesVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-orbits-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(orbitCheckbox);
    
    // Checkbox para estrelas
    const starsCheckbox = createCheckbox(
        'Estrelas', 
        starsVisible, 
        function(checked) {
            starsVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-stars-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(starsCheckbox);
    
    // Checkbox para skybox
    const skyboxCheckbox = createCheckbox(
        'Via Láctea (Fundo)', 
        skyboxVisible, 
        function(checked) {
            skyboxVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-skybox-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(skyboxCheckbox);
    
    // Checkbox para cinturão de asteroides
    const asteroidBeltCheckbox = createCheckbox(
        'Cinturão de Asteroides', 
        asteroidBeltVisible, 
        function(checked) {
            asteroidBeltVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-asteroid-belt-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(asteroidBeltCheckbox);
    
    // Checkbox para anel do cinturão
    const beltRingCheckbox = createCheckbox(
        'Anel do Cinturão', 
        asteroidBeltRingVisible, 
        function(checked) {
            asteroidBeltRingVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-belt-ring-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(beltRingCheckbox);
    
    // Checkbox para anéis de Saturno
    const saturnRingsCheckbox = createCheckbox(
        'Anéis de Saturno', 
        saturnRingsVisible, 
        function(checked) {
            saturnRingsVisible = checked;
            document.dispatchEvent(new CustomEvent('toggle-saturn-rings-visibility', {
                detail: { visible: checked }
            }));
        }
    );
    checkboxContainer.appendChild(saturnRingsCheckbox);
    
    content.appendChild(checkboxContainer);
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
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createCaptureControls(controlsContainer, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
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
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createNightModeControls(controlsContainer, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Criar seção acordeão
    const { content } = createAccordionSection(
        controlsContainer, 
        'Conforto Visual', 
        initiallyOpen
    );
    
    // Checkbox para modo noturno
    const nightModeContainer = document.createElement('div');
    nightModeContainer.style.display = 'flex';
    nightModeContainer.style.alignItems = 'center';
    nightModeContainer.style.marginBottom = '10px';
    
    const nightModeCheckbox = document.createElement('input');
    nightModeCheckbox.type = 'checkbox';
    nightModeCheckbox.checked = isNightModeActive();
    nightModeCheckbox.style.margin = '0 5px 0 0';
    nightModeCheckbox.addEventListener('change', function() {
        toggleNightMode(this.checked);
    });
    
    const nightModeLabel = document.createElement('label');
    nightModeLabel.textContent = 'Modo Noturno';
    
    nightModeContainer.appendChild(nightModeCheckbox);
    nightModeContainer.appendChild(nightModeLabel);
    content.appendChild(nightModeContainer);
    
    // Slider para filtro de luz azul
    const blueFilterLabel = document.createElement('div');
    blueFilterLabel.textContent = 'Filtro de Luz Azul:';
    blueFilterLabel.style.marginTop = '10px';
    content.appendChild(blueFilterLabel);
    
    const blueFilterSlider = document.createElement('input');
    blueFilterSlider.type = 'range';
    blueFilterSlider.min = '0';
    blueFilterSlider.max = '100';
    blueFilterSlider.value = getBlueFilterIntensity() * 100;
    blueFilterSlider.style.width = '100%';
    blueFilterSlider.addEventListener('input', function() {
        applyBlueFilter(this.value / 100);
    });
    content.appendChild(blueFilterSlider);
    
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
 * Essa seção não é um acordeão para facilitar acesso rápido
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
function createSearchControls(controlsContainer) {
    // Se não foi fornecido um container, criar ou obter um
    controlsContainer = controlsContainer || createControlsContainer();
    
    // Importar dinamicamente os dados dos planetas
    import('../data/planet-data.js').then(({ PLANET_DATA }) => {
        // Criar seção para sistema de busca
        const searchSection = document.createElement('div');
        searchSection.className = 'controls-section search-section';
        searchSection.style.marginTop = '15px';
        searchSection.style.borderTop = '2px solid #555';
        searchSection.style.paddingTop = '15px';
        
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
        searchInput.style.width = '100%';
        searchInput.style.padding = '8px';
        searchInput.style.backgroundColor = 'rgba(40, 40, 40, 0.7)';
        searchInput.style.border = '1px solid #555';
        searchInput.style.borderRadius = '4px';
        searchInput.style.color = 'white';
        searchInput.style.marginTop = '5px';
        searchContainer.appendChild(searchInput);
        
        // Container de resultados
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.style.display = 'none';
        resultsContainer.style.maxHeight = '200px';
        resultsContainer.style.overflowY = 'auto';
        resultsContainer.style.marginTop = '5px';
        resultsContainer.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        resultsContainer.style.border = '1px solid #555';
        resultsContainer.style.borderRadius = '4px';
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
                noResults.style.padding = '8px';
                noResults.style.color = '#aaa';
                noResults.style.textAlign = 'center';
                resultsContainer.appendChild(noResults);
                return;
            }
            
            // Criar elementos para cada resultado
            displayResults.forEach(obj => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.style.padding = '8px';
                resultItem.style.borderBottom = '1px solid #444';
                resultItem.style.cursor = 'pointer';
                resultItem.style.display = 'flex';
                resultItem.style.alignItems = 'center';
                
                // Hover effect
                resultItem.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'rgba(60, 60, 60, 0.7)';
                });
                resultItem.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
                
                // Aplicar ícone de acordo com o tipo
                const icon = document.createElement('span');
                icon.className = 'search-result-icon';
                icon.style.marginRight = '8px';
                icon.style.fontSize = '16px';
                
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
                nameElement.style.fontWeight = 'bold';
                infoContainer.appendChild(nameElement);
                
                const typeElement = document.createElement('div');
                typeElement.className = 'search-result-type';
                typeElement.textContent = obj.parent ? `${obj.type} de ${obj.parent}` : obj.type;
                typeElement.style.fontSize = '0.8em';
                typeElement.style.color = '#aaa';
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

/**
 * Cria controles para o sistema de comparação de planetas
 * @param {HTMLElement} container - Container dos controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createComparisonControls(container, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    container = container || createControlsContainer();
    
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

/**
 * Cria os controles de física avançada
 * @param {HTMLElement} container - Container dos controles
 * @param {Boolean} initiallyOpen - Se a seção deve iniciar aberta
 */
function createPhysicsControls(container, initiallyOpen = false) {
    // Se não foi fornecido um container, criar ou obter um
    container = container || createControlsContainer();
    
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