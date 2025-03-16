/**
 * Controles de interface para a Nuvem de Oort e Cometas
 * Permitindo ao usuário controlar a visualização e comportamento dos cometas
 */

/**
 * Inicializa os controles de interface para a Nuvem de Oort e cometas
 * @param {Object} oortCloudSystem - Sistema da Nuvem de Oort
 */
export function initOortCloudControls(oortCloudSystem) {
    if (!oortCloudSystem) {
        console.error('Sistema da Nuvem de Oort não fornecido para os controles');
        return;
    }
    
    // Criar o painel de controles da Nuvem de Oort
    createOortControlPanel(oortCloudSystem);
    
    console.log('Controles da Nuvem de Oort inicializados');
}

/**
 * Cria o painel de controles da Nuvem de Oort
 * @param {Object} oortCloudSystem - Sistema da Nuvem de Oort
 */
function createOortControlPanel(oortCloudSystem) {
    // Encontrar o painel de controles principal
    const controlPanel = document.querySelector('.control-panel');
    if (!controlPanel) {
        console.error('Painel de controle principal não encontrado');
        return;
    }
    
    // Criar o fieldset para os controles da Nuvem de Oort
    const oortFieldset = document.createElement('fieldset');
    oortFieldset.className = 'controls-section';
    
    // Criar a legenda do fieldset
    const legend = document.createElement('legend');
    legend.textContent = 'Nuvem de Oort e Cometas';
    oortFieldset.appendChild(legend);
    
    // Adicionar controle de visibilidade da Nuvem de Oort
    const oortVisibilityLabel = document.createElement('label');
    oortVisibilityLabel.className = 'control-item';
    
    const oortVisibilityCheckbox = document.createElement('input');
    oortVisibilityCheckbox.type = 'checkbox';
    oortVisibilityCheckbox.id = 'oort-cloud-visibility';
    oortVisibilityCheckbox.checked = oortCloudSystem.isOortCloudVisible();
    
    oortVisibilityCheckbox.addEventListener('change', (event) => {
        oortCloudSystem.setOortCloudVisibility(event.target.checked);
    });
    
    oortVisibilityLabel.appendChild(oortVisibilityCheckbox);
    oortVisibilityLabel.appendChild(document.createTextNode(' Mostrar Nuvem de Oort'));
    oortFieldset.appendChild(oortVisibilityLabel);
    
    // Adicionar controle de visibilidade dos cometas
    const cometsVisibilityLabel = document.createElement('label');
    cometsVisibilityLabel.className = 'control-item';
    
    const cometsVisibilityCheckbox = document.createElement('input');
    cometsVisibilityCheckbox.type = 'checkbox';
    cometsVisibilityCheckbox.id = 'comets-visibility';
    cometsVisibilityCheckbox.checked = oortCloudSystem.areCometsVisible();
    
    cometsVisibilityCheckbox.addEventListener('change', (event) => {
        oortCloudSystem.setCometVisibility(event.target.checked);
    });
    
    cometsVisibilityLabel.appendChild(cometsVisibilityCheckbox);
    cometsVisibilityLabel.appendChild(document.createTextNode(' Mostrar Cometas'));
    oortFieldset.appendChild(cometsVisibilityLabel);
    
    // Adicionar controle de frequência de cometas
    const cometFrequencyContainer = document.createElement('div');
    cometFrequencyContainer.className = 'control-item';
    
    const cometFrequencyLabel = document.createElement('label');
    cometFrequencyLabel.htmlFor = 'comet-frequency';
    cometFrequencyLabel.textContent = 'Frequência de Cometas:';
    cometFrequencyContainer.appendChild(cometFrequencyLabel);
    
    const cometFrequencyValue = document.createElement('span');
    cometFrequencyValue.id = 'comet-frequency-value';
    cometFrequencyValue.textContent = Math.round(oortCloudSystem.getCometFrequency() * 100) + '%';
    cometFrequencyValue.style.marginLeft = '8px';
    cometFrequencyValue.style.minWidth = '40px';
    cometFrequencyValue.style.display = 'inline-block';
    cometFrequencyContainer.appendChild(cometFrequencyValue);
    
    const cometFrequencySlider = document.createElement('input');
    cometFrequencySlider.type = 'range';
    cometFrequencySlider.id = 'comet-frequency';
    cometFrequencySlider.min = '0';
    cometFrequencySlider.max = '100';
    cometFrequencySlider.value = oortCloudSystem.getCometFrequency() * 100;
    cometFrequencySlider.className = 'slider';
    
    cometFrequencySlider.addEventListener('input', (event) => {
        const frequency = parseInt(event.target.value) / 100;
        oortCloudSystem.setCometFrequency(frequency);
        cometFrequencyValue.textContent = event.target.value + '%';
    });
    
    cometFrequencyContainer.appendChild(cometFrequencySlider);
    oortFieldset.appendChild(cometFrequencyContainer);
    
    // Adicionar botão para criar cometa
    const triggerCometBtn = document.createElement('button');
    triggerCometBtn.textContent = 'Criar Cometa';
    triggerCometBtn.className = 'control-button';
    triggerCometBtn.addEventListener('click', () => {
        oortCloudSystem.triggerComet();
    });
    
    oortFieldset.appendChild(triggerCometBtn);
    
    // Adicionar separador
    const separator = document.createElement('hr');
    separator.style.margin = '10px 0';
    separator.style.border = 'none';
    separator.style.borderTop = '1px solid rgba(255, 255, 255, 0.2)';
    oortFieldset.appendChild(separator);
    
    // Adicionar informações sobre a Nuvem de Oort
    const infoButton = document.createElement('button');
    infoButton.textContent = 'Sobre a Nuvem de Oort';
    infoButton.className = 'control-button info-button';
    infoButton.addEventListener('click', showOortCloudInfo);
    
    oortFieldset.appendChild(infoButton);
    
    // Adicionar o fieldset ao painel de controles
    controlPanel.appendChild(oortFieldset);
}

/**
 * Exibe informações sobre a Nuvem de Oort
 */
function showOortCloudInfo() {
    // Criar painel de informações se não existir
    let infoPanel = document.getElementById('oort-info-panel');
    
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.id = 'oort-info-panel';
        infoPanel.className = 'info-panel';
        
        // Criar conteúdo do painel
        infoPanel.innerHTML = `
            <div class="info-header">
                <h3>A Nuvem de Oort</h3>
                <button id="close-oort-info" class="close-button">&times;</button>
            </div>
            <div class="info-content">
                <p>A Nuvem de Oort é uma vasta concha esférica de objetos gelados que envolve o nosso Sistema Solar, localizada a cerca de 2.000 a 100.000 unidades astronômicas (UA) do Sol.</p>
                
                <h4>Características Principais:</h4>
                <ul>
                    <li><strong>Composição:</strong> Trilhões de corpos gelados compostos principalmente de água, amônia e metano em estado congelado.</li>
                    <li><strong>Origem:</strong> Formada a partir de material planetário ejetado para o espaço exterior durante a formação do Sistema Solar.</li>
                    <li><strong>Dimensão:</strong> Estende-se até aproximadamente um quarto da distância até a estrela mais próxima, Proxima Centauri.</li>
                </ul>
                
                <h4>Cometas:</h4>
                <p>A Nuvem de Oort é a principal fonte de cometas de longo período. Perturbações gravitacionais causadas por estrelas próximas ou pela maré galáctica podem deslocar estes objetos, enviando-os em trajetórias que os levam para o interior do Sistema Solar.</p>
                
                <p>Quando um cometa se aproxima do Sol, o calor causa a sublimação do gelo, criando uma atmosfera temporária chamada coma e, frequentemente, uma cauda que aponta para longe do Sol devido à pressão da radiação solar e ao vento solar.</p>
                
                <div class="image-placeholder">
                    <img src="img/oort-cloud-diagram.jpg" alt="Diagrama da Nuvem de Oort" onerror="this.style.display='none'">
                </div>
                
                <h4>Curiosidades:</h4>
                <ul>
                    <li>A Nuvem de Oort foi proposta pelo astrônomo holandês Jan Oort em 1950.</li>
                    <li>Estima-se que contenha trilhões de objetos maiores que 1 km de diâmetro.</li>
                    <li>Alguns cometas famosos como o Hale-Bopp e o Hyakutake são originários da Nuvem de Oort.</li>
                    <li>A Voyager 1, a nave espacial mais distante da Terra, levará cerca de 300 anos para alcançar a borda interna da Nuvem de Oort e 30.000 anos para passar por ela.</li>
                </ul>
            </div>
        `;
        
        document.body.appendChild(infoPanel);
        
        // Adicionar evento para o botão de fechar
        document.getElementById('close-oort-info').addEventListener('click', () => {
            infoPanel.classList.add('hidden');
        });
        
        // Adicionar estilos CSS
        addInfoPanelStyles();
    }
    
    // Mostrar o painel
    infoPanel.classList.remove('hidden');
}

/**
 * Adiciona estilos CSS para o painel de informações
 */
function addInfoPanelStyles() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('oort-info-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'oort-info-styles';
    
    styleElement.textContent = `
        .info-panel {
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
        
        .info-panel.hidden {
            opacity: 0;
            transform: translate(-50%, -55%);
            pointer-events: none;
        }
        
        .info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(100, 150, 255, 0.3);
        }
        
        .info-header h3 {
            margin: 0;
            color: #4fc3f7;
            font-size: 20px;
        }
        
        .close-button {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .info-content {
            padding: 20px;
        }
        
        .info-content h4 {
            color: #4fc3f7;
            margin: 15px 0 10px;
        }
        
        .info-content p {
            line-height: 1.6;
            margin: 10px 0;
        }
        
        .info-content ul {
            padding-left: 20px;
            margin: 10px 0;
        }
        
        .info-content li {
            margin-bottom: 8px;
            line-height: 1.4;
        }
        
        .image-placeholder {
            width: 100%;
            height: 200px;
            background-color: rgba(50, 50, 70, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px 0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .image-placeholder img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .info-button {
            background-color: #2962ff;
        }
        
        .info-button:hover {
            background-color: #0039cb;
        }
        
        @media (max-width: 768px) {
            .info-panel {
                width: 90vw;
                max-height: 80vh;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
} 