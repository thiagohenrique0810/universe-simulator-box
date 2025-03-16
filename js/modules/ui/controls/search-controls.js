/**
 * Módulo para controles de busca de objetos do sistema solar
 */
import { showTemporaryMessage } from './base-controls.js';

/**
 * Cria o sistema de busca para objetos do sistema solar
 * Essa seção não é um acordeão para facilitar acesso rápido
 * @param {HTMLElement} controlsContainer - Container para os controles
 */
export function createSearchControls(controlsContainer) {
    // Importar dinamicamente os dados dos planetas
    import('../../data/planet-data.js').then(({ PLANET_DATA }) => {
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
            const searchableObjects = compileSearchableObjects(PLANET_DATA);
            
            // Filtrar objetos baseado na query
            const filteredObjects = filterSearchResults(searchableObjects, query);
            
            // Limitar a 10 resultados
            const displayResults = filteredObjects.slice(0, 10);
            
            // Se não houver resultados
            if (displayResults.length === 0) {
                showNoResults(resultsContainer);
                return;
            }
            
            // Criar elementos para cada resultado
            displayResults.forEach(obj => {
                createResultItem(obj, resultsContainer, searchInput);
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
 * Compila lista de objetos pesquisáveis do sistema solar
 * @param {Object} PLANET_DATA - Dados dos planetas e luas
 * @returns {Array} Lista de objetos pesquisáveis
 */
function compileSearchableObjects(PLANET_DATA) {
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
    
    return searchableObjects;
}

/**
 * Filtra os resultados de busca com base na query
 * @param {Array} objects - Lista de objetos pesquisáveis
 * @param {String} query - Termo de busca
 * @returns {Array} Lista de objetos filtrados
 */
function filterSearchResults(objects, query) {
    return objects.filter(obj => {
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
}

/**
 * Mostra mensagem de "nenhum resultado encontrado"
 * @param {HTMLElement} container - Container de resultados
 */
function showNoResults(container) {
    const noResults = document.createElement('div');
    noResults.className = 'search-no-results';
    noResults.textContent = 'Nenhum resultado encontrado';
    noResults.style.padding = '8px';
    noResults.style.color = '#aaa';
    noResults.style.textAlign = 'center';
    container.appendChild(noResults);
}

/**
 * Cria um item de resultado
 * @param {Object} obj - Objeto com dados do resultado
 * @param {HTMLElement} container - Container para adicionar o resultado
 * @param {HTMLElement} searchInput - Campo de busca (para limpar após seleção)
 */
function createResultItem(obj, container, searchInput) {
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
        container.style.display = 'none';
        
        // Mostrar mensagem de feedback
        showTemporaryMessage(`Focando em ${obj.name}`);
    });
    
    container.appendChild(resultItem);
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