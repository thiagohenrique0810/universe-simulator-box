/**
 * Sistema de painel de informações dos planetas
 * Gerencia a exibição de informações detalhadas dos planetas
 */

// Elementos DOM
let infoPanel, infoContent, instructions;

/**
 * Cria o painel de informações dos planetas
 * @param {Object} PLANET_INFO - Dados informativos dos planetas
 * @returns {Object} Objeto com elementos do painel
 */
export function createInfoPanel(PLANET_INFO) {
    // Criar container para informações
    infoPanel = document.createElement('div');
    infoPanel.id = 'planet-info';
    infoPanel.style.position = 'absolute';
    infoPanel.style.left = '10px';
    infoPanel.style.top = '80px';
    infoPanel.style.width = '300px';
    infoPanel.style.background = 'rgba(0, 0, 0, 0.7)';
    infoPanel.style.padding = '15px';
    infoPanel.style.borderRadius = '5px';
    infoPanel.style.color = 'white';
    infoPanel.style.fontFamily = 'Arial, sans-serif';
    infoPanel.style.zIndex = '100';
    infoPanel.style.maxHeight = '80vh';
    infoPanel.style.overflowY = 'auto';
    infoPanel.style.display = 'none'; // Inicialmente oculto
    
    // Adicionar título do painel
    const panelTitle = document.createElement('h2');
    panelTitle.textContent = 'Informações do Planeta';
    panelTitle.style.margin = '0 0 10px 0';
    panelTitle.style.textAlign = 'center';
    panelTitle.style.borderBottom = '1px solid #555';
    panelTitle.style.paddingBottom = '5px';
    infoPanel.appendChild(panelTitle);
    
    // Conteúdo (será preenchido quando um planeta for selecionado)
    infoContent = document.createElement('div');
    infoContent.id = 'planet-info-content';
    infoPanel.appendChild(infoContent);
    
    // Botão de fechar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        infoPanel.style.display = 'none';
    });
    infoPanel.appendChild(closeButton);
    
    // Adicionar instruções
    instructions = document.createElement('p');
    instructions.textContent = 'Clique em um planeta para ver suas informações';
    instructions.style.textAlign = 'center';
    instructions.style.fontSize = '0.9em';
    instructions.style.marginTop = '20px';
    instructions.style.color = '#aaa';
    instructions.id = 'planet-instructions';
    infoPanel.appendChild(instructions);
    
    // Adicionar ao DOM
    document.body.appendChild(infoPanel);
    
    return { infoPanel, infoContent, instructions };
}

/**
 * Exibe informações detalhadas do planeta selecionado
 * @param {String} planetName - Nome do planeta
 * @param {Object} PLANET_INFO - Dados informativos dos planetas
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
export function showPlanetInfo(planetName, PLANET_INFO, PLANET_DATA) {
    if (!planetName || !PLANET_INFO[planetName]) {
        console.error(`Informações não encontradas para o planeta: ${planetName}`);
        return;
    }
    
    try {
        // Mostrar o painel
        infoPanel.style.display = 'block';
        
        // Ocultar instruções
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Dados do planeta
        const planetInfo = PLANET_INFO[planetName];
        
        // Construir HTML
        let htmlContent = `
            <h3>${planetInfo.nome}</h3>
            <div class="info-item">
                <strong>Tipo:</strong> ${planetInfo.tipo}
            </div>
            <div class="info-item">
                <strong>Composição:</strong> ${planetInfo.composicao}
            </div>
            <div class="info-item">
                <strong>Temperatura:</strong> ${planetInfo.temperatura}
            </div>
            <div class="info-item">
                <strong>Diâmetro:</strong> ${planetInfo.diametro}
            </div>`;
        
        // Adicionar informações condicionais
        if (planetInfo.orbita) {
            htmlContent += `
            <div class="info-item">
                <strong>Período Orbital:</strong> ${planetInfo.orbita}
            </div>`;
        }
        
        if (planetInfo.rotacao) {
            htmlContent += `
            <div class="info-item">
                <strong>Período de Rotação:</strong> ${planetInfo.rotacao}
            </div>`;
        }
        
        if (planetInfo.distanciaSol) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância ao Sol:</strong> ${planetInfo.distanciaSol}
            </div>`;
        }
        
        if (planetInfo.distanciaTerra) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância à Terra:</strong> ${planetInfo.distanciaTerra}
            </div>`;
        }
        
        // Adicionar descrição
        htmlContent += `
            <div class="info-description">
                ${planetInfo.descricao}
            </div>`;
        
        // Adicionar satélites se existirem
        if (PLANET_DATA[planetName] && 
            PLANET_DATA[planetName].satellites && 
            PLANET_DATA[planetName].satellites.length > 0) {
            
            htmlContent += `
            <div class="satellites-section">
                <h4>Satélites</h4>
                <ul>`;
            
            // Adicionar cada satélite
            PLANET_DATA[planetName].satellites.forEach(satellite => {
                const satelliteName = satellite.name.charAt(0).toUpperCase() + satellite.name.slice(1);
                htmlContent += `<li>${satelliteName}</li>`;
            });
            
            htmlContent += `
                </ul>
            </div>`;
        }
        
        // Atualizar o conteúdo HTML
        infoContent.innerHTML = htmlContent;
        
        // Aplicar estilos CSS
        applyInfoPanelStyles();
        
    } catch (error) {
        console.error('Erro ao mostrar informações do planeta:', error);
    }
}

/**
 * Exibe informações detalhadas da lua selecionada
 * @param {String} moonName - Nome da lua
 * @param {String} planetName - Nome do planeta pai
 * @param {Object} PLANET_DATA - Dados dos planetas
 */
export function showMoonInfo(moonName, planetName, PLANET_DATA) {
    console.log(`Tentando mostrar informações da lua: ${moonName} do planeta: ${planetName}`);
    
    if (!moonName || !planetName || !PLANET_DATA[planetName]) {
        console.error(`Informações não encontradas para a lua: ${moonName} do planeta: ${planetName}`);
        return;
    }
    
    try {
        // Encontrar os dados da lua
        const planet = PLANET_DATA[planetName];
        console.log(`Dados do planeta encontrados: ${planetName}, tem satélites: ${!!planet.satellites}`);
        
        if (!planet.satellites) {
            console.error(`O planeta ${planetName} não possui luas definidas.`);
            return;
        }
        
        console.log(`Satélites do planeta ${planetName}:`, planet.satellites.map(s => s.name).join(', '));
        
        // Converter moonName para minúsculo para comparação
        const moonNameLower = moonName.toLowerCase();
        const moon = planet.satellites.find(sat => sat.name.toLowerCase() === moonNameLower);
        console.log(`Lua encontrada: ${!!moon}, nome buscado: ${moonName} (${moonNameLower})`);
        
        if (!moon) {
            console.error(`Lua ${moonName} não encontrada para o planeta ${planetName}.`);
            return;
        }
        
        console.log(`Dados da lua encontrados:`, JSON.stringify(moon));
        
        // Mostrar o painel
        infoPanel.style.display = 'block';
        
        // Ocultar instruções
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Atualizar o título do painel
        const panelTitle = infoPanel.querySelector('h2');
        if (panelTitle) {
            panelTitle.textContent = 'Informações da Lua';
        }
        
        // Construir HTML
        const moonNameCapitalized = moonName.charAt(0).toUpperCase() + moonName.slice(1);
        const planetNameCapitalized = planetName.charAt(0).toUpperCase() + planetName.slice(1);
        
        let htmlContent = `
            <h3>${moonNameCapitalized}</h3>
            <div class="info-item">
                <strong>Planeta:</strong> ${planetNameCapitalized}
            </div>
            <div class="info-item">
                <strong>Raio:</strong> ${(moon.radius * 71492).toFixed(0)} km
            </div>
            <div class="info-item">
                <strong>Distância ao planeta:</strong> ${(moon.distance * 71492).toFixed(0)} km
            </div>`;
        
        // Adicionar informações condicionais
        if (moon.orbitalSpeed) {
            htmlContent += `
            <div class="info-item">
                <strong>Velocidade orbital:</strong> ${moon.orbitalSpeed.toFixed(4)} rad/s
            </div>`;
        }
        
        if (moon.rotationSpeed) {
            htmlContent += `
            <div class="info-item">
                <strong>Velocidade de rotação:</strong> ${moon.rotationSpeed.toFixed(4)} rad/s
            </div>`;
        }
        
        if (moon.eccentricity) {
            htmlContent += `
            <div class="info-item">
                <strong>Excentricidade:</strong> ${moon.eccentricity.toFixed(4)}
            </div>`;
        }
        
        // Adicionar descrição genérica
        htmlContent += `
            <div class="info-description">
                ${moonNameCapitalized} é uma lua de ${planetNameCapitalized}. As luas são corpos celestes naturais que orbitam planetas ou outros corpos do sistema solar.
            </div>`;
        
        // Atualizar o conteúdo HTML
        infoContent.innerHTML = htmlContent;
        
        // Aplicar estilos CSS
        applyInfoPanelStyles();
        
    } catch (error) {
        console.error('Erro ao mostrar informações da lua:', error);
    }
}

/**
 * Mostra informações detalhadas sobre o planeta anão selecionado no painel de informações
 * @param {String} dwarfPlanetId - ID do planeta anão selecionado
 */
export function showDwarfPlanetInfo(dwarfPlanetId) {
    const infoPanel = document.getElementById('info-panel');
    const infoPanelContent = document.getElementById('info-panel-content');
    
    // Obter dados do planeta anão do PLANET_DATA
    const dwarfPlanet = findDwarfPlanetById(dwarfPlanetId);
    
    if (!dwarfPlanet) {
        console.error(`Planeta anão com ID '${dwarfPlanetId}' não encontrado`);
        return;
    }
    
    // Construir HTML com informações do planeta anão
    const html = `
        <div class="info-header">
            <h2>${dwarfPlanet.nome}</h2>
            <span class="planet-type">Planeta Anão</span>
        </div>
        
        <div class="info-stats">
            <div class="stat">
                <span class="stat-label">Diâmetro:</span>
                <span class="stat-value">${dwarfPlanet.diametro || 'Desconhecido'}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Distância do Sol:</span>
                <span class="stat-value">${formatDistanceToSun(dwarfPlanet.distance)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Período Orbital:</span>
                <span class="stat-value">${dwarfPlanet.periodoOrbital || 'Desconhecido'}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Período de Rotação:</span>
                <span class="stat-value">${dwarfPlanet.periodoRotacao || 'Desconhecido'}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Temperatura:</span>
                <span class="stat-value">${dwarfPlanet.temperatura || 'Desconhecida'}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Excentricidade:</span>
                <span class="stat-value">${dwarfPlanet.eccentricity ? dwarfPlanet.eccentricity.toFixed(2) : 'Desconhecida'}</span>
            </div>
        </div>
        
        <div class="info-description">
            <p>${dwarfPlanet.descricao || 'Informações não disponíveis para este planeta anão.'}</p>
        </div>
        
        <div class="info-footer">
            <button id="close-info" class="info-button">Fechar</button>
            <button id="more-info" class="info-button">Mais Informações</button>
        </div>
    `;
    
    // Atualizar conteúdo do painel
    infoPanelContent.innerHTML = html;
    
    // Mostrar o painel
    infoPanel.classList.add('visible');
    
    // Adicionar eventos aos botões
    document.getElementById('close-info').addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });
    
    document.getElementById('more-info').addEventListener('click', () => {
        // Abrir Wikipedia ou outra fonte em uma nova aba
        let searchTerm = `${dwarfPlanet.nome} planeta anão`;
        window.open(`https://pt.wikipedia.org/wiki/${dwarfPlanet.nome}`, '_blank');
    });
}

/**
 * Mostra informações sobre um objeto menor do Cinturão de Kuiper
 * @param {String} objectId - ID do objeto
 */
export function showKuiperObjectInfo(objectId) {
    if (!infoPanel || !infoContent) return;
    
    // Obter dados do objeto do PLANET_DATA
    const kuiperObject = findKuiperObjectById(objectId);
    
    if (!kuiperObject) {
        console.error(`Objeto do Cinturão de Kuiper com ID '${objectId}' não encontrado`);
        return;
    }
    
    // Construir HTML com informações do objeto
    const html = `
        <div class="info-header">
            <h2>${kuiperObject.nome}</h2>
            <span class="planet-type">${kuiperObject.tipo || 'Objeto do Cinturão de Kuiper'}</span>
        </div>
        
        <div class="info-stats">
            <div class="stat">
                <span class="stat-label">Diâmetro:</span>
                <span class="stat-value">${kuiperObject.diametro || 'Não disponível'}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Distância do Sol:</span>
                <span class="stat-value">${formatDistanceToSun(kuiperObject.distance)}</span>
            </div>
            ${kuiperObject.orbita ? `
            <div class="stat">
                <span class="stat-label">Período Orbital:</span>
                <span class="stat-value">${kuiperObject.orbita}</span>
            </div>
            ` : ''}
            <div class="stat">
                <span class="stat-label">Excentricidade:</span>
                <span class="stat-value">${kuiperObject.eccentricity ? kuiperObject.eccentricity.toFixed(2) : 'Desconhecida'}</span>
            </div>
            ${kuiperObject.inclinacao ? `
            <div class="stat">
                <span class="stat-label">Inclinação Orbital:</span>
                <span class="stat-value">${kuiperObject.inclinacao}°</span>
            </div>
            ` : ''}
            ${kuiperObject.composicao ? `
            <div class="stat">
                <span class="stat-label">Composição:</span>
                <span class="stat-value">${kuiperObject.composicao}</span>
            </div>
            ` : ''}
            ${kuiperObject.temperatura ? `
            <div class="stat">
                <span class="stat-label">Temperatura:</span>
                <span class="stat-value">${kuiperObject.temperatura}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="info-description">
            <p>${kuiperObject.descricao || `${kuiperObject.nome} é um objeto do Cinturão de Kuiper, região além de Netuno, a aproximadamente ${kuiperObject.distance} unidades astronômicas do Sol.`}</p>
        </div>
        
        <div class="info-footer">
            <button id="close-info" class="info-button">Fechar</button>
            <button id="more-info" class="info-button">Mais Informações</button>
        </div>
    `;
    
    // Atualizar conteúdo do painel
    infoContent.innerHTML = html;
    
    // Mostrar o painel
    infoPanel.classList.add('visible');
    
    // Adicionar eventos para botões
    document.getElementById('close-info').addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });
    
    document.getElementById('more-info').addEventListener('click', () => {
        // Abrir Wikipedia ou outra fonte para mais informações
        let searchTerm = `${kuiperObject.nome} objeto cinturão kuiper`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
    });
}

/**
 * Busca um planeta anão ou objeto menor do Cinturão de Kuiper pelo ID
 * @param {String} id - ID do objeto a buscar
 * @returns {Object|null} - Objeto encontrado ou null
 */
function findDwarfPlanetById(id) {
    if (!window.PLANET_DATA || !window.PLANET_DATA.cinturaoKuiper) {
        return null;
    }
    
    // Buscar entre os planetas anões
    if (window.PLANET_DATA.cinturaoKuiper.planetasAnoes) {
        const dwarfPlanet = window.PLANET_DATA.cinturaoKuiper.planetasAnoes.find(planet => planet.id === id);
        if (dwarfPlanet) return dwarfPlanet;
    }
    
    // Se não encontrar nos planetas anões, buscar nos objetos menores
    return findKuiperObjectById(id);
}

/**
 * Busca um objeto menor do Cinturão de Kuiper pelo ID
 * @param {String} id - ID do objeto a buscar
 * @returns {Object|null} - Objeto encontrado ou null
 */
function findKuiperObjectById(id) {
    if (!window.PLANET_DATA || !window.PLANET_DATA.cinturaoKuiper || !window.PLANET_DATA.cinturaoKuiper.objetosMenores) {
        return null;
    }
    
    const objetosMenores = window.PLANET_DATA.cinturaoKuiper.objetosMenores;
    
    // Buscar em cada categoria de objetos
    const categorias = ['objetosClassicos', 'objetosRessonantes', 'discoDisperso'];
    
    for (const categoria of categorias) {
        if (objetosMenores[categoria] && Array.isArray(objetosMenores[categoria])) {
            const objeto = objetosMenores[categoria].find(obj => obj.id === id);
            if (objeto) return objeto;
        }
    }
    
    return null;
}

/**
 * Formata a distância do Sol em uma string legível
 * @param {Number} distance - Distância em unidades astronômicas
 * @returns {String} Distância formatada
 */
function formatDistanceToSun(distance) {
    const millionKm = distance * 149.6; // 1 UA = 149.6 milhões de km
    return `${millionKm.toFixed(1)} milhões km (${distance} UA)`;
}

/**
 * Aplica estilos ao painel de informações
 */
function applyInfoPanelStyles() {
    if (!infoContent) return;
    
    // Estilizar itens de informação
    let infoItems = infoContent.querySelectorAll('.info-item');
    if (infoItems && infoItems.length > 0) {
        for (let i = 0; i < infoItems.length; i++) {
            let item = infoItems[i];
            if (item) {
                item.style.margin = '5px 0';
                item.style.fontSize = '0.9em';
            }
        }
    }
    
    // Estilizar descrição
    let description = infoContent.querySelector('.info-description');
    if (description) {
        description.style.marginTop = '15px';
        description.style.fontSize = '0.9em';
        description.style.lineHeight = '1.4';
        description.style.textAlign = 'justify';
    }
    
    // Estilizar seção de satélites
    let satellitesSection = infoContent.querySelector('.satellites-section');
    if (satellitesSection) {
        satellitesSection.style.marginTop = '15px';
        satellitesSection.style.borderTop = '1px solid #555';
        satellitesSection.style.paddingTop = '10px';
        
        let satellitesList = satellitesSection.querySelector('ul');
        if (satellitesList) {
            satellitesList.style.paddingLeft = '20px';
            satellitesList.style.fontSize = '0.9em';
            
            let satellitesItems = satellitesList.querySelectorAll('li');
            if (satellitesItems && satellitesItems.length > 0) {
                for (let i = 0; i < satellitesItems.length; i++) {
                    let item = satellitesItems[i];
                    if (item) {
                        item.style.margin = '3px 0';
                    }
                }
            }
        }
    }
} 