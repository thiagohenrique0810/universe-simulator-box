/**
 * Painel de controle para visualização de exoplanetas
 * Permite selecionar e visualizar diferentes sistemas exoplanetários
 */

import { EXOPLANET_SYSTEMS, EXOPLANET_INFO } from '../data/exoplanet-data.js';

// Estado do módulo
let exoplanetSystem; // API do sistema de exoplanetas
let controlPanel; // Painel de controle principal
let detailsPanel; // Painel de detalhes do sistema/planeta selecionado
let camera; // Referência à câmera para focar nos sistemas
let controls; // Referência aos controles da câmera
let currentSelectedSystem = null; // Sistema atualmente selecionado
let currentSelectedPlanet = null; // Planeta atualmente selecionado

/**
 * Inicializa o painel de exoplanetas
 * @param {Object} exoplanetSystemAPI - API do sistema de exoplanetas
 * @param {THREE.Camera} cameraRef - Referência à câmera principal
 * @param {Object} controlsRef - Referência aos controles da câmera (OrbitControls)
 * @returns {Object} API do painel de exoplanetas
 */
export function initExoplanetPanel(exoplanetSystemAPI, cameraRef, controlsRef) {
    if (!exoplanetSystemAPI) {
        console.error('API do sistema de exoplanetas não fornecida ao painel');
        return null;
    }
    
    exoplanetSystem = exoplanetSystemAPI;
    camera = cameraRef;
    controls = controlsRef;
    
    // Criar interface de usuário
    createControlPanel();
    createDetailsPanel();
    
    // Inicializar eventos
    initEventListeners();
    
    console.log('Painel de controle de exoplanetas inicializado');
    
    // Retornar API pública
    return {
        showPanel: () => showPanel(),
        hidePanel: () => hidePanel(),
        selectSystem: (systemId) => selectSystem(systemId),
        selectPlanet: (systemId, planetId) => selectPlanet(systemId, planetId),
        isVisible: () => controlPanel.style.display !== 'none'
    };
}

/**
 * Cria o painel de controle principal
 */
function createControlPanel() {
    // Verificar se o painel já existe
    const existingPanel = document.getElementById('exoplanet-control-panel');
    if (existingPanel) {
        controlPanel = existingPanel;
        return;
    }
    
    // Criar elemento do painel
    controlPanel = document.createElement('div');
    controlPanel.id = 'exoplanet-control-panel';
    controlPanel.className = 'control-panel-section';
    
    // Título
    const title = document.createElement('h3');
    title.textContent = 'Sistemas Exoplanetários';
    controlPanel.appendChild(title);
    
    // Botão para voltar ao Sistema Solar
    const backButton = document.createElement('button');
    backButton.textContent = 'Voltar ao Sistema Solar';
    backButton.className = 'control-button return-button';
    backButton.onclick = returnToSolarSystem;
    controlPanel.appendChild(backButton);
    
    // Seletor de visualização
    const viewSelector = document.createElement('div');
    viewSelector.className = 'view-selector';
    
    const viewLabel = document.createElement('label');
    viewLabel.textContent = 'Visualizar: ';
    viewSelector.appendChild(viewLabel);
    
    const viewToggle = document.createElement('select');
    viewToggle.id = 'exoplanet-view-toggle';
    
    const viewOptions = [
        { value: 'distance', label: 'Por Distância' },
        { value: 'starType', label: 'Por Tipo de Estrela' },
        { value: 'habitable', label: 'Habitáveis Primeiro' },
        { value: 'discovery', label: 'Por Método de Descoberta' }
    ];
    
    viewOptions.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = option.label;
        viewToggle.appendChild(optElement);
    });
    
    viewSelector.appendChild(viewToggle);
    controlPanel.appendChild(viewSelector);
    
    // Lista de sistemas
    const systemList = document.createElement('div');
    systemList.id = 'exoplanet-system-list';
    systemList.className = 'system-list';
    controlPanel.appendChild(systemList);
    
    // Adicionar à interface principal
    const mainControlPanel = document.querySelector('.control-panel');
    if (mainControlPanel) {
        mainControlPanel.appendChild(controlPanel);
    } else {
        console.warn('Painel de controle principal não encontrado, adicionando ao body');
        document.body.appendChild(controlPanel);
    }
    
    // Preencher a lista de sistemas
    populateSystemList('distance');
    
    // Inicialmente esconder o painel
    controlPanel.style.display = 'none';
}

/**
 * Cria o painel de detalhes para exibir informações sobre o sistema/planeta selecionado
 */
function createDetailsPanel() {
    // Verificar se o painel já existe
    const existingPanel = document.getElementById('exoplanet-details-panel');
    if (existingPanel) {
        detailsPanel = existingPanel;
        return;
    }
    
    // Criar elemento do painel
    detailsPanel = document.createElement('div');
    detailsPanel.id = 'exoplanet-details-panel';
    detailsPanel.className = 'details-panel';
    
    // Título do painel
    const title = document.createElement('h3');
    title.id = 'exoplanet-details-title';
    title.textContent = 'Detalhes do Sistema';
    detailsPanel.appendChild(title);
    
    // Conteúdo do painel (será preenchido dinamicamente)
    const content = document.createElement('div');
    content.id = 'exoplanet-details-content';
    detailsPanel.appendChild(content);
    
    // Adicionar lista de planetas
    const planetListTitle = document.createElement('h4');
    planetListTitle.textContent = 'Planetas:';
    content.appendChild(planetListTitle);
    
    const planetList = document.createElement('ul');
    planetList.id = 'exoplanet-planet-list';
    content.appendChild(planetList);
    
    // Botão para fechar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.className = 'control-button close-button';
    closeButton.onclick = () => { detailsPanel.style.display = 'none'; };
    detailsPanel.appendChild(closeButton);
    
    // Adicionar à interface principal
    document.body.appendChild(detailsPanel);
    
    // Inicialmente esconder o painel
    detailsPanel.style.display = 'none';
}

/**
 * Preenche a lista de sistemas exoplanetários com base no critério selecionado
 * @param {string} sortBy - Critério de ordenação ('distance', 'starType', 'habitable', 'discovery')
 */
function populateSystemList(sortBy) {
    const systemList = document.getElementById('exoplanet-system-list');
    if (!systemList) return;
    
    // Limpar lista atual
    systemList.innerHTML = '';
    
    // Obter sistemas e ordenar
    let systems = [...EXOPLANET_SYSTEMS];
    
    switch (sortBy) {
        case 'distance':
            systems.sort((a, b) => a.distance - b.distance);
            break;
        case 'starType':
            systems.sort((a, b) => a.starType.localeCompare(b.starType));
            break;
        case 'habitable':
            systems.sort((a, b) => {
                const aHabitable = a.planets?.some(p => p.habitable) ? 1 : 0;
                const bHabitable = b.planets?.some(p => p.habitable) ? 1 : 0;
                return bHabitable - aHabitable; // Habitáveis primeiro
            });
            break;
        case 'discovery':
            systems.sort((a, b) => a.discoveryMethod.localeCompare(b.discoveryMethod));
            break;
    }
    
    // Criar elementos para cada sistema
    systems.forEach(system => {
        const systemItem = document.createElement('div');
        systemItem.className = 'system-item';
        systemItem.dataset.systemId = system.id;
        systemItem.onclick = () => selectSystem(system.id);
        
        const systemName = document.createElement('div');
        systemName.className = 'system-name';
        systemName.textContent = system.name;
        systemItem.appendChild(systemName);
        
        const systemInfo = document.createElement('div');
        systemInfo.className = 'system-info';
        
        // Ícone para indicar tipo de estrela
        const starTypeIcon = document.createElement('span');
        starTypeIcon.className = 'star-type-icon';
        starTypeIcon.textContent = system.starType.charAt(0);
        starTypeIcon.title = `Estrela tipo ${system.starType}`;
        systemInfo.appendChild(starTypeIcon);
        
        // Indicador de distância
        const distanceIndicator = document.createElement('span');
        distanceIndicator.className = 'distance-indicator';
        distanceIndicator.textContent = `${system.distance} anos-luz`;
        distanceIndicator.title = `Distância: ${system.distance} anos-luz`;
        systemInfo.appendChild(distanceIndicator);
        
        // Indicador de habitabilidade
        if (system.planets?.some(p => p.habitable)) {
            const habitableIndicator = document.createElement('span');
            habitableIndicator.className = 'habitable-indicator';
            habitableIndicator.innerHTML = '&#x1F30D;'; // Emoji do planeta Terra
            habitableIndicator.title = 'Contém planeta(s) na zona habitável';
            systemInfo.appendChild(habitableIndicator);
        }
        
        systemItem.appendChild(systemInfo);
        systemList.appendChild(systemItem);
    });
}

/**
 * Inicializa os listeners de eventos para o painel
 */
function initEventListeners() {
    // Ouvir mudanças no seletor de visualização
    const viewToggle = document.getElementById('exoplanet-view-toggle');
    if (viewToggle) {
        viewToggle.addEventListener('change', (e) => {
            populateSystemList(e.target.value);
        });
    }
    
    // Adicionar listener para teclas (escape fecha o painel)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && controlPanel.style.display !== 'none') {
            hidePanel();
        }
    });
}

/**
 * Seleciona um sistema exoplanetário e exibe seus detalhes
 * @param {string} systemId - ID do sistema a ser selecionado
 */
function selectSystem(systemId) {
    // Verificar se o sistema existe
    const systemData = EXOPLANET_SYSTEMS.find(s => s.id === systemId);
    if (!systemData) {
        console.error(`Sistema exoplanetário ${systemId} não encontrado`);
        return;
    }
    
    currentSelectedSystem = systemId;
    currentSelectedPlanet = null;
    
    // Selecionar no sistema 3D
    if (exoplanetSystem) {
        exoplanetSystem.selectSystem(systemId);
        exoplanetSystem.focusOnSystem(systemId, camera, controls, () => {
            console.log(`Câmera focada no sistema ${systemData.name}`);
        });
    }
    
    // Atualizar UI
    updateSystemDetails(systemData);
    
    // Destacar o sistema selecionado na lista
    const systemItems = document.querySelectorAll('.system-item');
    systemItems.forEach(item => {
        if (item.dataset.systemId === systemId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Mostrar painel de detalhes
    showDetailsPanel();
}

/**
 * Seleciona um planeta específico dentro de um sistema
 * @param {string} systemId - ID do sistema
 * @param {string} planetId - ID do planeta
 */
function selectPlanet(systemId, planetId) {
    // Verificar se o sistema está selecionado
    if (currentSelectedSystem !== systemId) {
        selectSystem(systemId);
    }
    
    currentSelectedPlanet = planetId;
    
    // Encontrar dados do planeta
    const systemData = EXOPLANET_SYSTEMS.find(s => s.id === systemId);
    if (!systemData || !systemData.planets) return;
    
    const planetData = systemData.planets.find(p => p.id === planetId);
    if (!planetData) return;
    
    // Focar no planeta
    if (exoplanetSystem) {
        exoplanetSystem.focusOnPlanet(systemId, planetId, camera, controls, () => {
            console.log(`Câmera focada no planeta ${planetData.name}`);
        });
    }
    
    // Atualizar UI
    updatePlanetDetails(planetData);
    
    // Destacar o planeta selecionado na lista
    const planetItems = document.querySelectorAll('#exoplanet-planet-list li');
    planetItems.forEach(item => {
        if (item.dataset.planetId === planetId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

/**
 * Atualiza o painel de detalhes com informações do sistema
 * @param {Object} systemData - Dados do sistema
 */
function updateSystemDetails(systemData) {
    const title = document.getElementById('exoplanet-details-title');
    const content = document.getElementById('exoplanet-details-content');
    const planetList = document.getElementById('exoplanet-planet-list');
    
    if (!title || !content || !planetList) return;
    
    // Atualizar título
    title.textContent = systemData.name;
    
    // Limpar conteúdo anterior
    content.innerHTML = '';
    
    // Construir informações do sistema
    const infoContainer = document.createElement('div');
    infoContainer.className = 'system-details';
    
    // Descrição
    const description = document.createElement('p');
    description.className = 'system-description';
    description.textContent = systemData.description;
    infoContainer.appendChild(description);
    
    // Tabela de características
    const table = document.createElement('table');
    table.className = 'info-table';
    
    // Linhas da tabela
    const rows = [
        { label: 'Distância', value: `${systemData.distance} anos-luz` },
        { label: 'Tipo de Estrela', value: systemData.starType },
        { label: 'Massa Estelar', value: `${systemData.starMass.toFixed(3)} M☉` },
        { label: 'Raio Estelar', value: `${systemData.starRadius.toFixed(3)} R☉` },
        { label: 'Temperatura', value: `${systemData.starTemperature} K` },
        { label: 'Descoberta', value: `${systemData.discoveryYear}, ${systemData.discoveryMethod}` }
    ];
    
    // Adicionar zona habitável se definida
    if (systemData.habitableZone) {
        rows.push({ 
            label: 'Zona Habitável', 
            value: `${systemData.habitableZone.inner.toFixed(3)} - ${systemData.habitableZone.outer.toFixed(3)} UA` 
        });
    }
    
    // Preencher tabela
    rows.forEach(row => {
        const tr = document.createElement('tr');
        
        const tdLabel = document.createElement('td');
        tdLabel.className = 'info-label';
        tdLabel.textContent = row.label;
        tr.appendChild(tdLabel);
        
        const tdValue = document.createElement('td');
        tdValue.className = 'info-value';
        tdValue.textContent = row.value;
        tr.appendChild(tdValue);
        
        table.appendChild(tr);
    });
    
    infoContainer.appendChild(table);
    content.appendChild(infoContainer);
    
    // Adicionar título da lista de planetas
    const planetsTitle = document.createElement('h4');
    planetsTitle.textContent = 'Planetas:';
    content.appendChild(planetsTitle);
    
    // Redefinir lista de planetas
    planetList.innerHTML = '';
    content.appendChild(planetList);
    
    // Preencher lista de planetas
    if (systemData.planets && systemData.planets.length > 0) {
        systemData.planets.forEach(planet => {
            const planetItem = document.createElement('li');
            planetItem.className = 'planet-item';
            planetItem.dataset.planetId = planet.id;
            planetItem.onclick = (e) => {
                e.stopPropagation();
                selectPlanet(systemData.id, planet.id);
            };
            
            const planetColor = document.createElement('span');
            planetColor.className = 'planet-color';
            planetColor.style.backgroundColor = `#${planet.color.toString(16).padStart(6, '0')}`;
            planetItem.appendChild(planetColor);
            
            const planetName = document.createElement('span');
            planetName.className = 'planet-name';
            planetName.textContent = planet.name;
            planetItem.appendChild(planetName);
            
            // Indicadores
            const indicators = document.createElement('span');
            indicators.className = 'planet-indicators';
            
            // Indicador de habitabilidade
            if (planet.habitable) {
                const habitableIcon = document.createElement('span');
                habitableIcon.className = 'habitable-icon';
                habitableIcon.innerHTML = '&#x1F30D;'; // Emoji do planeta Terra
                habitableIcon.title = 'Potencialmente habitável';
                indicators.appendChild(habitableIcon);
            }
            
            planetItem.appendChild(indicators);
            planetList.appendChild(planetItem);
        });
    } else {
        const noPlants = document.createElement('li');
        noPlants.textContent = 'Nenhum planeta conhecido';
        noPlants.className = 'no-planets';
        planetList.appendChild(noPlants);
    }
}

/**
 * Atualiza o painel de detalhes com informações do planeta
 * @param {Object} planetData - Dados do planeta
 */
function updatePlanetDetails(planetData) {
    const content = document.getElementById('exoplanet-details-content');
    if (!content) return;
    
    // Manter a lista de planetas, mas remover o resto
    const planetList = document.getElementById('exoplanet-planet-list').parentNode;
    content.innerHTML = '';
    
    // Construir informações do planeta
    const infoContainer = document.createElement('div');
    infoContainer.className = 'planet-details';
    
    // Nome e descrição
    const title = document.createElement('h4');
    title.className = 'planet-title';
    title.textContent = planetData.name;
    infoContainer.appendChild(title);
    
    // Descrição
    const description = document.createElement('p');
    description.className = 'planet-description';
    description.textContent = planetData.description;
    infoContainer.appendChild(description);
    
    // Tabela de características
    const table = document.createElement('table');
    table.className = 'info-table';
    
    // Linhas da tabela
    const rows = [
        { label: 'Raio', value: `${planetData.radius.toFixed(2)} Raios Terrestres` },
        { label: 'Massa', value: `${planetData.mass.toFixed(2)} Massas Terrestres` },
        { label: 'Distância da Estrela', value: `${planetData.semiMajorAxis.toFixed(4)} UA` },
        { label: 'Período Orbital', value: planetData.orbitalPeriod >= 365 ? 
                                          `${(planetData.orbitalPeriod/365).toFixed(2)} anos` : 
                                          `${planetData.orbitalPeriod.toFixed(2)} dias` },
        { label: 'Excentricidade', value: planetData.eccentricity ? planetData.eccentricity.toFixed(4) : 'Desconhecida' },
        { label: 'Ano de Descoberta', value: planetData.discoveryYear || 'Desconhecido' }
    ];
    
    // Adicionar informação sobre inclinação se disponível
    if (planetData.inclination !== undefined) {
        rows.push({ label: 'Inclinação', value: `${planetData.inclination}°` });
    }
    
    // Adicionar informação sobre atmosfera se disponível
    if (planetData.atmosphere) {
        rows.push({ label: 'Atmosfera', value: planetData.atmosphere });
    }
    
    // Adicionar informação sobre habitabilidade
    rows.push({ 
        label: 'Habitabilidade', 
        value: planetData.habitable ? 'Potencialmente habitável' : 'Não habitável' 
    });
    
    // Preencher tabela
    rows.forEach(row => {
        const tr = document.createElement('tr');
        
        const tdLabel = document.createElement('td');
        tdLabel.className = 'info-label';
        tdLabel.textContent = row.label;
        tr.appendChild(tdLabel);
        
        const tdValue = document.createElement('td');
        tdValue.className = 'info-value';
        tdValue.textContent = row.value;
        tr.appendChild(tdValue);
        
        table.appendChild(tr);
    });
    
    infoContainer.appendChild(table);
    content.appendChild(infoContainer);
    
    // Re-adicionar a lista de planetas
    content.appendChild(planetList);
}

/**
 * Exibe o painel de detalhes
 */
function showDetailsPanel() {
    if (detailsPanel) {
        detailsPanel.style.display = 'block';
    }
}

/**
 * Exibe o painel de controle
 */
function showPanel() {
    if (controlPanel) {
        controlPanel.style.display = 'block';
    }
}

/**
 * Oculta o painel de controle e detalhes
 */
function hidePanel() {
    if (controlPanel) {
        controlPanel.style.display = 'none';
    }
    
    if (detailsPanel) {
        detailsPanel.style.display = 'none';
    }
}

/**
 * Retorna a visualização para o Sistema Solar
 */
function returnToSolarSystem() {
    // Adicione aqui a lógica para retornar ao Sistema Solar
    hidePanel();
    
    // Desativar sistemas exoplanetários
    if (exoplanetSystem) {
        exoplanetSystem.toggleAllSystemsVisibility(false);
    }
    
    // Reposicionar câmera
    if (camera && controls) {
        // Posição do Sistema Solar
        const solarSystemPosition = new THREE.Vector3(0, 0, 0);
        
        // Animar câmera de volta
        const targetPosition = new THREE.Vector3(0, 50, 150);
        
        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        
        const duration = 2.0; // segundos
        const startTime = Date.now();
        
        function animate() {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1.0);
            
            // Easing
            const eased = 1 - Math.pow(1 - progress, 3);
            
            // Interpolar posição
            camera.position.lerpVectors(startPosition, targetPosition, eased);
            
            // Interpolar alvo
            controls.target.lerpVectors(startTarget, solarSystemPosition, eased);
            controls.update();
            
            if (progress < 1.0) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
} 