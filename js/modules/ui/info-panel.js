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
 * Exibe informações detalhadas do planeta anão selecionado
 * @param {String} dwarfPlanetName - Nome do planeta anão
 */
export function showDwarfPlanetInfo(dwarfPlanetName) {
    console.log(`Tentando mostrar informações do planeta anão: ${dwarfPlanetName}`);
    
    try {
        // Mostrar o painel
        infoPanel.style.display = 'block';
        
        // Ocultar instruções
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Atualizar o título do painel
        const panelTitle = infoPanel.querySelector('h2');
        if (panelTitle) {
            panelTitle.textContent = 'Planeta Anão';
        }
        
        // Informações dos planetas anões
        const dwarfPlanetInfo = {
            ceres: {
                nome: 'Ceres',
                diametro: '940 km',
                descoberta: '1801 por Giuseppe Piazzi',
                orbita: '4,6 anos',
                distanciaSol: '2,77 UA',
                descricao: 'Ceres é o maior objeto do cinturão de asteroides entre Marte e Júpiter. Foi o primeiro asteroide descoberto e é classificado como planeta anão desde 2006. Contém cerca de um terço da massa total do cinturão de asteroides.'
            },
            eris: {
                nome: 'Éris',
                diametro: '2.326 km',
                descoberta: '2005 por Mike Brown',
                orbita: '558 anos',
                distanciaSol: '68 UA (no afélio)',
                descricao: 'Éris é o segundo maior planeta anão conhecido no Sistema Solar e tem uma massa aproximadamente 27% maior que Plutão. Sua descoberta levou à reclassificação de Plutão e à definição formal de "planeta anão".'
            },
            makemake: {
                nome: 'Makemake',
                diametro: '1.430 km',
                descoberta: '2005 por Mike Brown',
                orbita: '306 anos',
                distanciaSol: '45,8 UA (no afélio)',
                descricao: 'Makemake é o terceiro maior planeta anão conhecido no Sistema Solar e o segundo maior objeto no cinturão de Kuiper. Tem uma superfície avermelhada e é composto principalmente por metano, etano e nitrogênio congelados.'
            },
            haumea: {
                nome: 'Haumea',
                diametro: '1.632 × 1.178 km (elipsoide)',
                descoberta: '2004 por Mike Brown',
                orbita: '285 anos',
                distanciaSol: '51,5 UA (no afélio)',
                descricao: 'Haumea é um dos planetas anões mais incomuns devido à sua forma alongada, resultado de sua rotação extremamente rápida. Completa uma rotação em apenas 4 horas. Possui dois satélites conhecidos e um anel.'
            },
            moon: {
                nome: 'Lua (representação)',
                diametro: '3.474 km',
                descoberta: 'Conhecida desde a pré-história',
                orbita: '27,3 dias',
                distanciaTerra: '384.400 km',
                descricao: 'Embora a Lua não seja um planeta anão, mas sim um satélite natural da Terra, sua textura foi incluída aqui para representação visual. É o único satélite natural da Terra e o quinto maior do Sistema Solar.'
            }
        };
        
        // Verificar se temos informações para este planeta anão
        if (!dwarfPlanetInfo[dwarfPlanetName]) {
            console.error(`Informações não encontradas para o planeta anão: ${dwarfPlanetName}`);
            return;
        }
        
        const info = dwarfPlanetInfo[dwarfPlanetName];
        
        // Construir HTML
        let htmlContent = `
            <h3>${info.nome}</h3>
            <div class="info-item">
                <strong>Diâmetro:</strong> ${info.diametro}
            </div>
            <div class="info-item">
                <strong>Descoberta:</strong> ${info.descoberta}
            </div>`;
        
        if (info.orbita) {
            htmlContent += `
            <div class="info-item">
                <strong>Período Orbital:</strong> ${info.orbita}
            </div>`;
        }
        
        if (info.distanciaSol) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância ao Sol:</strong> ${info.distanciaSol}
            </div>`;
        }
        
        if (info.distanciaTerra) {
            htmlContent += `
            <div class="info-item">
                <strong>Distância à Terra:</strong> ${info.distanciaTerra}
            </div>`;
        }
        
        // Adicionar descrição
        htmlContent += `
            <div class="info-description">
                ${info.descricao}
            </div>`;
        
        // Atualizar o conteúdo HTML
        infoContent.innerHTML = htmlContent;
        
        // Aplicar estilos CSS
        applyInfoPanelStyles();
        
    } catch (error) {
        console.error('Erro ao mostrar informações do planeta anão:', error);
    }
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