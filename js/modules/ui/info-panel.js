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
    infoPanel.style.right = '10px';
    infoPanel.style.top = '10px';
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