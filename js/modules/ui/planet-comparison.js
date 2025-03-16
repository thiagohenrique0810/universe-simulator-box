/**
 * Sistema de comparação de planetas
 * Permite comparar características entre diferentes corpos celestes
 */

// Importação dos dados dos planetas
import { PLANET_DATA } from '../data/planet-data.js';
import { PLANET_INFO } from '../data/planet-info.js';

// Estado da comparação
let comparisonActive = false;
let selectedObjects = [];
const MAX_OBJECTS = 3; // Máximo de objetos para comparar simultaneamente

/**
 * Inicializa o sistema de comparação de planetas
 */
export function initPlanetComparison() {
    // Criar o botão de comparação no painel de controles
    createComparisonButton();
    
    // Escutar eventos de seleção de planetas
    listenForSelectionEvents();
}

/**
 * Cria o botão de comparação no painel de controles
 */
function createComparisonButton() {
    // Obter o container de controles
    const controlsContainer = document.getElementById('controls-container');
    if (!controlsContainer) {
        console.error('Container de controles não encontrado');
        return;
    }
    
    // Criar seção para comparação
    const comparisonSection = document.createElement('div');
    comparisonSection.className = 'control-section';
    
    // Título da seção
    const comparisonTitle = document.createElement('h3');
    comparisonTitle.textContent = 'Comparação de Planetas';
    comparisonSection.appendChild(comparisonTitle);
    
    // Botão para ativar/desativar comparação
    const comparisonButton = document.createElement('button');
    comparisonButton.className = 'control-button';
    comparisonButton.textContent = 'Iniciar Comparação';
    comparisonButton.addEventListener('click', toggleComparisonMode);
    comparisonSection.appendChild(comparisonButton);
    
    // Adicionar descrição
    const comparisonDescription = document.createElement('p');
    comparisonDescription.className = 'control-description';
    comparisonDescription.textContent = 'Selecione até 3 objetos para comparar suas características.';
    comparisonDescription.style.fontSize = '12px';
    comparisonDescription.style.marginTop = '5px';
    comparisonSection.appendChild(comparisonDescription);
    
    // Adicionar seção ao container
    controlsContainer.appendChild(comparisonSection);
}

/**
 * Ativa ou desativa o modo de comparação
 */
function toggleComparisonMode() {
    comparisonActive = !comparisonActive;
    
    // Notificar outros módulos sobre a mudança no modo de comparação
    document.dispatchEvent(new CustomEvent('comparison-mode-changed', {
        detail: { active: comparisonActive }
    }));
    
    // Atualizar botão
    const comparisonButton = document.querySelector('.control-section h3:contains("Comparação de Planetas")').nextElementSibling;
    if (comparisonButton) {
        comparisonButton.textContent = comparisonActive ? 'Cancelar Comparação' : 'Iniciar Comparação';
        comparisonButton.style.backgroundColor = comparisonActive ? 'rgba(255, 100, 100, 0.7)' : '';
    }
    
    // Mostrar ou esconder painel de objetos selecionados
    if (comparisonActive) {
        createSelectionPanel();
        showTemporaryMessage('Modo de comparação ativado. Selecione objetos para comparar.');
    } else {
        removeSelectionPanel();
        selectedObjects = [];
        hideComparisonResults();
        showTemporaryMessage('Modo de comparação desativado.');
    }
}

/**
 * Cria o painel de objetos selecionados
 */
function createSelectionPanel() {
    // Remover painel existente, se houver
    removeSelectionPanel();
    
    // Criar o painel de seleção
    const selectionPanel = document.createElement('div');
    selectionPanel.id = 'comparison-selection-panel';
    selectionPanel.className = 'comparison-panel';
    
    // Título
    const panelTitle = document.createElement('h3');
    panelTitle.textContent = 'Objetos Selecionados';
    selectionPanel.appendChild(panelTitle);
    
    // Lista de slots para objetos
    const slotsList = document.createElement('div');
    slotsList.className = 'comparison-slots';
    
    // Criar slots vazios
    for (let i = 0; i < MAX_OBJECTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'comparison-slot empty';
        slot.innerHTML = '<span>Clique em um objeto para selecionar</span>';
        slotsList.appendChild(slot);
    }
    
    selectionPanel.appendChild(slotsList);
    
    // Botão de comparar
    const compareButton = document.createElement('button');
    compareButton.textContent = 'Comparar Selecionados';
    compareButton.className = 'control-button';
    compareButton.disabled = true;
    compareButton.addEventListener('click', showComparison);
    selectionPanel.appendChild(compareButton);
    
    // Adicionar ao DOM
    document.body.appendChild(selectionPanel);
}

/**
 * Remove o painel de objetos selecionados
 */
function removeSelectionPanel() {
    const panel = document.getElementById('comparison-selection-panel');
    if (panel) {
        panel.remove();
    }
}

/**
 * Escuta eventos de seleção de objetos para comparação
 */
function listenForSelectionEvents() {
    // Escutar evento personalizado para seleção de objetos
    document.addEventListener('select-for-comparison', function(event) {
        if (!comparisonActive) return;
        
        const { object } = event.detail;
        
        // Verificar se o objeto já está selecionado
        const existingIndex = selectedObjects.findIndex(o => o.name === object.name);
        
        if (existingIndex >= 0) {
            // Se já está selecionado, remover da seleção
            selectedObjects.splice(existingIndex, 1);
            showTemporaryMessage(`${object.name} removido da comparação.`);
        } else {
            // Se não está selecionado, adicionar se houver espaço
            if (selectedObjects.length < MAX_OBJECTS) {
                selectedObjects.push(object);
                showTemporaryMessage(`${object.name} adicionado para comparação.`);
            } else {
                showTemporaryMessage('Máximo de objetos atingido. Remova um para adicionar outro.', true);
            }
        }
        
        // Atualizar interface
        updateSelectionPanel();
    });
}

/**
 * Atualiza o painel de objetos selecionados
 */
function updateSelectionPanel() {
    const panel = document.getElementById('comparison-selection-panel');
    if (!panel) return;
    
    // Obter slots
    const slots = panel.querySelectorAll('.comparison-slot');
    
    // Atualizar cada slot
    for (let i = 0; i < MAX_OBJECTS; i++) {
        const slot = slots[i];
        
        if (i < selectedObjects.length) {
            // Slot com objeto
            const object = selectedObjects[i];
            slot.className = 'comparison-slot filled';
            slot.innerHTML = `
                <div class="slot-content">
                    <span class="slot-icon">${getObjectIcon(object.type)}</span>
                    <span class="slot-name">${object.name}</span>
                    <span class="slot-type">${object.type}</span>
                    <button class="slot-remove">✕</button>
                </div>
            `;
            
            // Adicionar evento para remover
            const removeButton = slot.querySelector('.slot-remove');
            if (removeButton) {
                removeButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectedObjects.splice(i, 1);
                    updateSelectionPanel();
                    showTemporaryMessage(`${object.name} removido da comparação.`);
                });
            }
        } else {
            // Slot vazio
            slot.className = 'comparison-slot empty';
            slot.innerHTML = '<span>Clique em um objeto para selecionar</span>';
        }
    }
    
    // Atualizar botão de comparar
    const compareButton = panel.querySelector('button');
    if (compareButton) {
        compareButton.disabled = selectedObjects.length < 2;
    }
}

/**
 * Exibe a comparação entre os objetos selecionados
 */
function showComparison() {
    if (selectedObjects.length < 2) {
        showTemporaryMessage('Selecione pelo menos 2 objetos para comparar.', true);
        return;
    }
    
    // Remover resultados anteriores
    hideComparisonResults();
    
    // Criar painel de resultados
    const resultsPanel = document.createElement('div');
    resultsPanel.id = 'comparison-results';
    resultsPanel.className = 'comparison-results';
    
    // Cabeçalho
    const header = document.createElement('div');
    header.className = 'comparison-header';
    
    // Título
    const title = document.createElement('h2');
    title.textContent = 'Comparação de Objetos';
    header.appendChild(title);
    
    // Botão de fechar
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', hideComparisonResults);
    header.appendChild(closeButton);
    
    resultsPanel.appendChild(header);
    
    // Tabela de comparação
    const table = document.createElement('table');
    table.className = 'comparison-table';
    
    // Criar cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Coluna de propriedades
    const propertyHeader = document.createElement('th');
    propertyHeader.textContent = 'Propriedade';
    headerRow.appendChild(propertyHeader);
    
    // Colunas para cada objeto
    selectedObjects.forEach(object => {
        const objectHeader = document.createElement('th');
        objectHeader.innerHTML = `
            <div class="object-header">
                <span class="object-icon">${getObjectIcon(object.type)}</span>
                <span class="object-name">${object.name}</span>
            </div>
        `;
        headerRow.appendChild(objectHeader);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    
    // Propriedades a serem comparadas
    const comparisonProperties = [
        { id: 'diametro', name: 'Diâmetro', unit: 'km', formatter: formatNumber },
        { id: 'massa', name: 'Massa', unit: 'kg', formatter: formatScientific },
        { id: 'distancia', name: 'Distância do Sol', unit: 'km', formatter: formatNumber },
        { id: 'periodoOrbital', name: 'Período Orbital', unit: 'dias', formatter: formatNumber },
        { id: 'periodoRotacao', name: 'Período de Rotação', unit: 'horas', formatter: formatNumber },
        { id: 'gravidade', name: 'Gravidade', unit: 'm/s²', formatter: formatNumber },
        { id: 'temperatura', name: 'Temperatura Média', unit: '°C', formatter: formatNumber }
    ];
    
    // Para cada propriedade, criar uma linha
    comparisonProperties.forEach(property => {
        const row = document.createElement('tr');
        
        // Célula da propriedade
        const propertyCell = document.createElement('td');
        propertyCell.className = 'property-name';
        propertyCell.textContent = `${property.name} (${property.unit})`;
        row.appendChild(propertyCell);
        
        // Células para valores dos objetos
        selectedObjects.forEach(object => {
            const valueCell = document.createElement('td');
            
            // Obter dados do objeto
            let objectData = getObjectData(object);
            
            // Formatar o valor conforme a propriedade
            const value = objectData[property.id];
            if (value !== undefined && value !== null) {
                valueCell.textContent = property.formatter(value);
                
                // Destacar maior e menor valor
                if (selectedObjects.length > 1) {
                    highlightExtremeValues(selectedObjects, objectData, property.id, valueCell);
                }
            } else {
                valueCell.textContent = 'N/A';
                valueCell.className = 'not-available';
            }
            
            row.appendChild(valueCell);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    resultsPanel.appendChild(table);
    
    // Adicionar descrições dos objetos
    const descriptionsSection = createDescriptionsSection();
    if (descriptionsSection) {
        resultsPanel.appendChild(descriptionsSection);
    }
    
    // Adicionar ao DOM
    document.body.appendChild(resultsPanel);
}

/**
 * Cria a seção de descrições dos objetos
 * @returns {HTMLElement} Elemento com as descrições
 */
function createDescriptionsSection() {
    const section = document.createElement('div');
    section.className = 'comparison-descriptions';
    
    // Título
    const title = document.createElement('h3');
    title.textContent = 'Informações Adicionais';
    section.appendChild(title);
    
    // Descrições para cada objeto
    selectedObjects.forEach(object => {
        const objectData = getObjectData(object);
        
        if (objectData && objectData.descricao) {
            const descriptionBox = document.createElement('div');
            descriptionBox.className = 'description-box';
            
            // Cabeçalho com nome e ícone
            const descHeader = document.createElement('div');
            descHeader.className = 'description-header';
            descHeader.innerHTML = `
                <span class="object-icon">${getObjectIcon(object.type)}</span>
                <h4>${object.name}</h4>
            `;
            descriptionBox.appendChild(descHeader);
            
            // Texto da descrição
            const descText = document.createElement('p');
            descText.textContent = objectData.descricao;
            descriptionBox.appendChild(descText);
            
            section.appendChild(descriptionBox);
        }
    });
    
    return section;
}

/**
 * Oculta os resultados da comparação
 */
function hideComparisonResults() {
    const results = document.getElementById('comparison-results');
    if (results) {
        results.remove();
    }
}

/**
 * Obtém os dados de um objeto para comparação
 * @param {Object} object - Objeto selecionado
 * @returns {Object} Dados do objeto
 */
function getObjectData(object) {
    // Verificar pelo tipo do objeto
    switch (object.type) {
        case 'Planeta':
            return PLANET_DATA[object.key];
        case 'Lua':
            // Buscar lua nos dados do planeta pai
            const parentPlanet = PLANET_DATA[object.parentKey];
            if (parentPlanet && parentPlanet.luas) {
                return parentPlanet.luas.find(moon => 
                    moon.nome === object.name || 
                    (moon.id && moon.id === object.key)
                );
            }
            break;
        case 'Planeta Anão':
            // Buscar planeta anão nos dados
            for (const planetKey in PLANET_DATA) {
                if (planetKey !== 'unidades' && PLANET_DATA[planetKey].planetasAnoes) {
                    const dwarfPlanet = PLANET_DATA[planetKey].planetasAnoes.find(
                        dwarf => dwarf.nome === object.name || (dwarf.id && dwarf.id === object.key)
                    );
                    if (dwarfPlanet) return dwarfPlanet;
                }
            }
            break;
    }
    
    // Se não encontrou nos dados estruturados, procurar nas informações
    if (object.type === 'Planeta' && PLANET_INFO[object.key]) {
        return PLANET_INFO[object.key];
    }
    
    // Caso não encontre, retornar objeto com dados básicos
    return {
        nome: object.name,
        tipo: object.type
    };
}

/**
 * Destaca o maior e menor valor em uma propriedade
 * @param {Array} objects - Lista de objetos sendo comparados
 * @param {Object} currentObject - Objeto atual
 * @param {String} property - Propriedade sendo comparada
 * @param {HTMLElement} cell - Célula a ser destacada
 */
function highlightExtremeValues(objects, currentObject, property, cell) {
    // Coletar todos os valores disponíveis para esta propriedade
    const allValues = objects
        .map(obj => getObjectData(obj)[property])
        .filter(value => value !== undefined && value !== null && !isNaN(value));
    
    if (allValues.length < 2) return;
    
    const currentValue = currentObject[property];
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    
    // Destacar máximo e mínimo
    if (currentValue === maxValue) {
        cell.classList.add('max-value');
    } else if (currentValue === minValue) {
        cell.classList.add('min-value');
    }
}

/**
 * Retorna um ícone baseado no tipo do objeto
 * @param {String} type - Tipo do objeto
 * @returns {String} Emoji/ícone correspondente
 */
function getObjectIcon(type) {
    switch (type) {
        case 'Planeta':
            return '🪐';
        case 'Lua':
            return '🌙';
        case 'Planeta Anão':
            return '⚪';
        default:
            return '✨';
    }
}

/**
 * Formata um número para exibição
 * @param {Number} value - Valor a ser formatado
 * @returns {String} Valor formatado
 */
function formatNumber(value) {
    // Se o valor for muito grande, usar notação científica
    if (Math.abs(value) >= 1000000) {
        return formatScientific(value);
    }
    
    // Caso contrário, formatar com separador de milhares
    return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata um número em notação científica
 * @param {Number} value - Valor a ser formatado
 * @returns {String} Valor em notação científica
 */
function formatScientific(value) {
    // Se o valor for zero, retornar 0
    if (value === 0) return '0';
    
    // Converter para notação científica com 2 casas decimais
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    
    return `${mantissa.toFixed(2)} × 10^${exponent}`;
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