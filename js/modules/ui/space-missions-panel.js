/**
 * Painel de Controle de Missões Espaciais
 * Interface para selecionar e visualizar missões espaciais
 */

/**
 * Inicializa o painel de controle de missões espaciais
 * @param {Object} missionsSystem - Sistema de missões espaciais
 * @returns {Object} API do painel de missões
 */
export function initMissionsPanel(missionsSystem) {
    if (!missionsSystem) {
        console.error('Sistema de missões não fornecido para o painel');
        return;
    }
    
    // Criar o painel principal
    createMissionsControlPanel(missionsSystem);
    
    // Criar o painel de detalhes de missão
    createMissionDetailsPanel();
    
    // Adicionar listener para sincronizar interface quando a visibilidade global das missões for alterada
    document.addEventListener('toggle-space-missions', function(event) {
        const visible = event.detail.visible;
        
        // Encontrar o fieldset de missões espaciais
        const missionsLegends = document.querySelectorAll('.controls-section legend');
        let missionsFieldset = null;
        missionsLegends.forEach(legend => {
            if (legend.textContent === 'Missões Espaciais') {
                missionsFieldset = legend.closest('.controls-section');
            }
        });
        
        if (!visible) {
            // Atualizar a interface para refletir que todas as missões estão ocultas
            const missionsList = document.getElementById('missions-list');
            if (missionsList) {
                const missionItems = missionsList.querySelectorAll('.mission-item');
                missionItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
            
            // Desabilitar os botões de controle enquanto a visibilidade global estiver desligada
            const buttonsContainer = document.querySelector('.buttons-container');
            if (buttonsContainer) {
                const buttons = buttonsContainer.querySelectorAll('button');
                buttons.forEach(button => {
                    button.disabled = true;
                });
            }
            
            // Ocultar o painel de missões
            if (missionsFieldset) {
                missionsFieldset.style.display = 'none';
            }
        } else {
            // Quando a visibilidade global for ativada, reativar os botões
            const buttonsContainer = document.querySelector('.buttons-container');
            if (buttonsContainer) {
                const buttons = buttonsContainer.querySelectorAll('button');
                buttons.forEach(button => {
                    button.disabled = false;
                });
            }
            
            // Mostrar o painel de missões novamente
            if (missionsFieldset) {
                missionsFieldset.style.display = '';
            }
            
            // Nota: Não reativamos automaticamente as missões
        }
        // Quando visível novamente, não é necessário fazer nada especial, 
        // pois as missões não são automaticamente reativadas
    });
    
    console.log('Painel de controle de missões espaciais inicializado');
    
    // Retornar API pública
    return {
        showMissionDetails: showMissionDetails,
        updateMissionPositions: updateMissionPositions
    };
}

/**
 * Cria o painel de controle de missões
 * @param {Object} missionsSystem - Sistema de missões espaciais
 */
function createMissionsControlPanel(missionsSystem) {
    // Encontrar o painel de controle principal
    const controlPanel = document.querySelector('.control-panel');
    if (!controlPanel) {
        console.error('Painel de controle principal não encontrado');
        return;
    }
    
    // Criar o fieldset para os controles de missões
    const missionsFieldset = document.createElement('fieldset');
    missionsFieldset.className = 'controls-section';
    
    // Criar a legenda do fieldset
    const legend = document.createElement('legend');
    legend.textContent = 'Missões Espaciais';
    missionsFieldset.appendChild(legend);
    
    // Adicionar introdução
    const intro = document.createElement('p');
    intro.className = 'mission-intro';
    intro.textContent = 'Visualize trajetórias de missões espaciais históricas e planejadas.';
    missionsFieldset.appendChild(intro);
    
    // Criar seletor de categoria de missão
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-selector';
    
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Filtrar por categoria:';
    categoryContainer.appendChild(categoryLabel);
    
    const categorySelect = document.createElement('select');
    categorySelect.id = 'mission-category';
    categorySelect.className = 'select-control';
    
    // Adicionar opções de categoria
    const allOption = document.createElement('option');
    allOption.value = 'todas';
    allOption.textContent = 'Todas as missões';
    categorySelect.appendChild(allOption);
    
    const historicOption = document.createElement('option');
    historicOption.value = 'historica';
    historicOption.textContent = 'Missões Históricas';
    categorySelect.appendChild(historicOption);
    
    const activeOption = document.createElement('option');
    activeOption.value = 'ativa';
    activeOption.textContent = 'Missões Ativas';
    categorySelect.appendChild(activeOption);
    
    const plannedOption = document.createElement('option');
    plannedOption.value = 'planejada';
    plannedOption.textContent = 'Missões Planejadas';
    categorySelect.appendChild(plannedOption);
    
    categorySelect.addEventListener('change', () => {
        updateMissionsList(missionsSystem, categorySelect.value);
    });
    
    categoryContainer.appendChild(categorySelect);
    missionsFieldset.appendChild(categoryContainer);
    
    // Criar lista de missões
    const missionsListContainer = document.createElement('div');
    missionsListContainer.className = 'missions-list-container';
    
    const missionsList = document.createElement('div');
    missionsList.id = 'missions-list';
    missionsList.className = 'missions-list';
    
    missionsListContainer.appendChild(missionsList);
    missionsFieldset.appendChild(missionsListContainer);
    
    // Adicionar botão para mostrar todas as missões
    const showAllButton = document.createElement('button');
    showAllButton.textContent = 'Mostrar Todas as Missões';
    showAllButton.className = 'control-button';
    showAllButton.addEventListener('click', () => toggleAllMissions(missionsSystem, true));
    
    // Adicionar botão para ocultar todas as missões
    const hideAllButton = document.createElement('button');
    hideAllButton.textContent = 'Ocultar Todas as Missões';
    hideAllButton.className = 'control-button';
    hideAllButton.addEventListener('click', () => toggleAllMissions(missionsSystem, false));
    
    // Adicionar contêiner para os botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    buttonsContainer.appendChild(showAllButton);
    buttonsContainer.appendChild(hideAllButton);
    
    missionsFieldset.appendChild(buttonsContainer);
    
    // Adicionar o fieldset ao painel de controle
    controlPanel.appendChild(missionsFieldset);
    
    // Adicionar estilos CSS
    addMissionsPanelStyles();
    
    // Popular a lista de missões
    updateMissionsList(missionsSystem, 'todas');
}

/**
 * Atualiza a lista de missões com base na categoria selecionada
 * @param {Object} missionsSystem - Sistema de missões espaciais
 * @param {string} category - Categoria selecionada
 */
function updateMissionsList(missionsSystem, category) {
    const missionsList = document.getElementById('missions-list');
    if (!missionsList) return;
    
    // Limpar lista atual
    missionsList.innerHTML = '';
    
    // Obter todas as missões
    const allMissions = missionsSystem.getAllMissions();
    
    // Filtrar por categoria
    const filteredMissions = category === 'todas' 
        ? allMissions 
        : allMissions.filter(mission => mission.type === category || mission.status === category);
    
    // Criar elementos para cada missão
    filteredMissions.forEach(mission => {
        const missionItem = document.createElement('div');
        missionItem.className = 'mission-item';
        missionItem.dataset.missionId = mission.id;
        
        // Verificar se a missão está ativa
        const isActive = missionsSystem.getActiveMissions().some(m => 
            m.userData && m.userData.missionId === mission.id);
        
        if (isActive) {
            missionItem.classList.add('active');
        }
        
        // Adicionar cor da missão
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'mission-color';
        colorIndicator.style.backgroundColor = `#${new THREE.Color(mission.color).getHexString()}`;
        missionItem.appendChild(colorIndicator);
        
        // Adicionar nome da missão
        const missionName = document.createElement('span');
        missionName.className = 'mission-name';
        missionName.textContent = mission.name;
        missionItem.appendChild(missionName);
        
        // Adicionar status
        const missionStatus = document.createElement('span');
        missionStatus.className = 'mission-status';
        
        let statusClass = '';
        switch (mission.status) {
            case 'ativa': 
                statusClass = 'status-active'; 
                missionStatus.textContent = '●';
                missionStatus.title = 'Missão Ativa';
                break;
            case 'concluída': 
                statusClass = 'status-completed'; 
                missionStatus.textContent = '✓';
                missionStatus.title = 'Missão Concluída';
                break;
            case 'em andamento': 
                statusClass = 'status-ongoing'; 
                missionStatus.textContent = '◐';
                missionStatus.title = 'Em Andamento';
                break;
            case 'planejada': 
                statusClass = 'status-planned'; 
                missionStatus.textContent = '○';
                missionStatus.title = 'Missão Planejada';
                break;
            default: 
                statusClass = 'status-unknown';
                missionStatus.textContent = '?';
                missionStatus.title = 'Status Desconhecido';
        }
        
        missionStatus.classList.add(statusClass);
        missionItem.appendChild(missionStatus);
        
        // Adicionar ano
        const year = new Date(mission.startDate).getFullYear();
        const missionYear = document.createElement('span');
        missionYear.className = 'mission-year';
        missionYear.textContent = year;
        missionItem.appendChild(missionYear);
        
        // Adicionar eventos
        missionItem.addEventListener('click', () => {
            // Toggle ativação da missão
            if (isActive) {
                missionsSystem.deactivateMission(mission.id);
                missionItem.classList.remove('active');
            } else {
                // Criar a missão se ela ainda não existir
                missionsSystem.createMission(mission);
                missionsSystem.activateMission(mission.id);
                missionItem.classList.add('active');
            }
        });
        
        // Adicionar evento para mostrar detalhes
        missionItem.addEventListener('dblclick', () => {
            showMissionDetails(mission.id, missionsSystem);
        });
        
        // Adicionar dica informativa
        missionItem.title = `Clique para ${isActive ? 'ocultar' : 'mostrar'} trajetória\nClique duplo para detalhes`;
        
        missionsList.appendChild(missionItem);
    });
    
    // Adicionar mensagem se não houver missões
    if (filteredMissions.length === 0) {
        const noMissions = document.createElement('p');
        noMissions.className = 'no-missions';
        noMissions.textContent = 'Nenhuma missão encontrada nesta categoria.';
        missionsList.appendChild(noMissions);
    }
}

/**
 * Ativa ou desativa todas as missões
 * @param {Object} missionsSystem - Sistema de missões espaciais
 * @param {boolean} show - Mostrar ou ocultar todas as missões
 */
function toggleAllMissions(missionsSystem, show) {
    const allMissions = missionsSystem.getAllMissions();
    const activeMissions = missionsSystem.getActiveMissions();
    const activeMissionIds = activeMissions.map(m => m.userData.missionId);
    
    allMissions.forEach(mission => {
        if (show) {
            // Só mostrar se ainda não estiver ativa
            if (!activeMissionIds.includes(mission.id)) {
                missionsSystem.createMission(mission);
                missionsSystem.activateMission(mission.id);
            }
        } else {
            // Só ocultar se estiver ativa
            if (activeMissionIds.includes(mission.id)) {
                missionsSystem.deactivateMission(mission.id);
            }
        }
    });
    
    // Atualizar a interface
    const currentCategory = document.getElementById('mission-category').value;
    updateMissionsList(missionsSystem, currentCategory);
}

/**
 * Cria o painel de detalhes de missão
 */
function createMissionDetailsPanel() {
    // Verificar se o painel já existe
    let detailsPanel = document.getElementById('mission-details-panel');
    
    if (!detailsPanel) {
        detailsPanel = document.createElement('div');
        detailsPanel.id = 'mission-details-panel';
        detailsPanel.className = 'mission-details-panel hidden';
        
        // Criar o conteúdo base do painel
        detailsPanel.innerHTML = `
            <div class="mission-details-header">
                <h3 id="mission-details-title">Detalhes da Missão</h3>
                <button id="close-mission-details" class="close-button">&times;</button>
            </div>
            <div class="mission-details-content">
                <div class="mission-info-section">
                    <div class="mission-info-row">
                        <span class="label">Data de Lançamento:</span>
                        <span id="mission-launch-date" class="value">--/--/----</span>
                    </div>
                    <div class="mission-info-row">
                        <span class="label">Status:</span>
                        <span id="mission-status-detail" class="value">--</span>
                    </div>
                    <div class="mission-info-row">
                        <span class="label">Veículo de Lançamento:</span>
                        <span id="mission-vehicle" class="value">--</span>
                    </div>
                    <div class="mission-info-row">
                        <span class="label">Velocidade:</span>
                        <span id="mission-speed" class="value">-- km/s</span>
                    </div>
                </div>
                
                <div class="mission-description" id="mission-description">
                    Descrição da missão...
                </div>
                
                <div class="mission-achievements-section">
                    <h4>Objetivos da Missão</h4>
                    <ul id="mission-objectives" class="mission-list"></ul>
                    
                    <h4>Conquistas</h4>
                    <ul id="mission-achievements" class="mission-list"></ul>
                </div>
                
                <div class="mission-actions">
                    <a id="mission-link" href="#" target="_blank" class="mission-button">Site Oficial</a>
                    <button id="mission-toggle" class="mission-button">Mostrar Trajetória</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsPanel);
        
        // Adicionar evento para fechar o painel
        document.getElementById('close-mission-details').addEventListener('click', () => {
            detailsPanel.classList.add('hidden');
        });
    }
}

/**
 * Mostra detalhes de uma missão específica
 * @param {string} missionId - ID da missão
 * @param {Object} missionsSystem - Sistema de missões espaciais
 */
function showMissionDetails(missionId, missionsSystem) {
    // Obter informações da missão
    const mission = missionsSystem.getMissionById(missionId);
    if (!mission) {
        console.warn(`Missão não encontrada: ${missionId}`);
        return;
    }
    
    // Obter referência ao painel
    const detailsPanel = document.getElementById('mission-details-panel');
    if (!detailsPanel) return;
    
    // Atualizar título
    document.getElementById('mission-details-title').textContent = mission.name;
    
    // Formatar data de lançamento
    const launchDate = new Date(mission.startDate);
    const formattedDate = launchDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    document.getElementById('mission-launch-date').textContent = formattedDate;
    
    // Atualizar status
    const statusElement = document.getElementById('mission-status-detail');
    statusElement.textContent = capitalizeFirstLetter(mission.status);
    statusElement.className = 'value ' + getStatusClassName(mission.status);
    
    // Atualizar veículo
    document.getElementById('mission-vehicle').textContent = mission.launchVehicle || '--';
    
    // Atualizar velocidade
    document.getElementById('mission-speed').textContent = mission.speed ? `${mission.speed} km/s` : '--';
    
    // Atualizar descrição
    document.getElementById('mission-description').textContent = mission.description;
    
    // Atualizar objetivos
    const objectivesList = document.getElementById('mission-objectives');
    objectivesList.innerHTML = '';
    
    if (mission.objectives && mission.objectives.length > 0) {
        mission.objectives.forEach(objective => {
            const li = document.createElement('li');
            li.textContent = objective;
            objectivesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Informação não disponível';
        objectivesList.appendChild(li);
    }
    
    // Atualizar conquistas
    const achievementsList = document.getElementById('mission-achievements');
    achievementsList.innerHTML = '';
    
    if (mission.achievements && mission.achievements.length > 0) {
        mission.achievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            achievementsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Informação não disponível';
        achievementsList.appendChild(li);
    }
    
    // Atualizar link
    const linkElement = document.getElementById('mission-link');
    if (mission.link) {
        linkElement.href = mission.link;
        linkElement.style.display = 'inline-block';
    } else {
        linkElement.style.display = 'none';
    }
    
    // Verificar se a missão está ativa
    const isActive = missionsSystem.getActiveMissions().some(m => 
        m.userData && m.userData.missionId === mission.id);
    
    // Atualizar botão de toggle
    const toggleButton = document.getElementById('mission-toggle');
    toggleButton.textContent = isActive ? 'Ocultar Trajetória' : 'Mostrar Trajetória';
    toggleButton.onclick = () => {
        if (isActive) {
            missionsSystem.deactivateMission(mission.id);
            toggleButton.textContent = 'Mostrar Trajetória';
        } else {
            missionsSystem.createMission(mission);
            missionsSystem.activateMission(mission.id);
            toggleButton.textContent = 'Ocultar Trajetória';
        }
        
        // Atualizar lista
        const currentCategory = document.getElementById('mission-category').value;
        updateMissionsList(missionsSystem, currentCategory);
    };
    
    // Mostrar o painel
    detailsPanel.classList.remove('hidden');
}

/**
 * Atualiza a posição das naves no painel de missões
 * @param {Object} missionsSystem - Sistema de missões espaciais
 */
function updateMissionPositions(missionsSystem) {
    // A ser implementado se necessário para mostrar posições das naves no painel
}

/**
 * Retorna a classe CSS para um status de missão
 * @param {string} status - Status da missão
 * @returns {string} Classe CSS
 */
function getStatusClassName(status) {
    switch (status) {
        case 'ativa': return 'status-active';
        case 'concluída': return 'status-completed';
        case 'em andamento': return 'status-ongoing';
        case 'planejada': return 'status-planned';
        default: return 'status-unknown';
    }
}

/**
 * Capitaliza a primeira letra de uma string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizada
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adiciona estilos CSS para o painel de missões
 */
function addMissionsPanelStyles() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('missions-panel-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'missions-panel-styles';
    
    styleElement.textContent = `
        /* Estilo para o painel de missões */
        .mission-intro {
            font-size: 13px;
            color: #ccc;
            margin: 0 0 10px 0;
        }
        
        .category-selector {
            margin-bottom: 10px;
        }
        
        .category-selector label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            color: #aaa;
        }
        
        .missions-list-container {
            max-height: 220px;
            overflow-y: auto;
            border: 1px solid rgba(100, 150, 255, 0.2);
            border-radius: 4px;
            margin: 10px 0;
            background-color: rgba(30, 40, 60, 0.5);
        }
        
        .missions-list {
            padding: 5px;
        }
        
        .mission-item {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            margin-bottom: 2px;
            cursor: pointer;
            transition: background-color 0.2s;
            position: relative;
        }
        
        .mission-item:hover {
            background-color: rgba(60, 80, 120, 0.5);
        }
        
        .mission-item.active {
            background-color: rgba(40, 70, 120, 0.7);
        }
        
        .mission-color {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
            display: inline-block;
        }
        
        .mission-name {
            flex-grow: 1;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .mission-status {
            margin-right: 8px;
            font-size: 12px;
        }
        
        .status-active {
            color: #4CAF50;
        }
        
        .status-completed {
            color: #9E9E9E;
        }
        
        .status-ongoing {
            color: #2196F3;
        }
        
        .status-planned {
            color: #FFC107;
        }
        
        .status-unknown {
            color: #F44336;
        }
        
        .mission-year {
            font-size: 11px;
            color: #aaa;
            margin-left: 5px;
        }
        
        .no-missions {
            padding: 15px;
            text-align: center;
            color: #999;
            font-style: italic;
            font-size: 13px;
        }
        
        .buttons-container {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        
        .buttons-container button {
            width: 48%;
        }
        
        /* Painel de detalhes da missão */
        .mission-details-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            background-color: rgba(15, 20, 33, 0.95);
            color: white;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 80, 255, 0.5);
            z-index: 1000;
            overflow-y: auto;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .mission-details-panel.hidden {
            opacity: 0;
            transform: translate(-50%, -55%);
            pointer-events: none;
        }
        
        .mission-details-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(100, 150, 255, 0.3);
        }
        
        .mission-details-header h3 {
            margin: 0;
            color: #4fc3f7;
            font-size: 20px;
        }
        
        .mission-details-content {
            padding: 20px;
        }
        
        .mission-info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .mission-info-row {
            display: flex;
            flex-direction: column;
        }
        
        .mission-info-row .label {
            font-size: 12px;
            color: #aaa;
            margin-bottom: 3px;
        }
        
        .mission-info-row .value {
            font-size: 15px;
            font-weight: bold;
        }
        
        .mission-description {
            margin: 15px 0;
            line-height: 1.5;
            font-size: 14px;
            padding: 10px;
            background-color: rgba(30, 40, 60, 0.5);
            border-radius: 5px;
        }
        
        .mission-achievements-section h4 {
            margin: 15px 0 10px;
            color: #4fc3f7;
            font-size: 16px;
        }
        
        .mission-list {
            margin: 0;
            padding-left: 20px;
        }
        
        .mission-list li {
            margin-bottom: 5px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .mission-actions {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        
        .mission-button {
            background-color: #1976d2;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            text-align: center;
            transition: background-color 0.2s;
            display: inline-block;
        }
        
        .mission-button:hover {
            background-color: #1565c0;
        }
        
        @media (max-width: 768px) {
            .mission-info-section {
                grid-template-columns: 1fr;
            }
            
            .mission-details-panel {
                width: 90vw;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
} 