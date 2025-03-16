/**
 * Ferramenta de Medição para o Sistema Solar
 * Permite medir distâncias entre corpos celestes e visualizar essas medições
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

let scene;
let camera;
let controls;
let planets = {};
let measurementState = {
    active: false,
    startObject: null,
    endObject: null,
    line: null,
    label: null,
    points: []
};

// Configurações da ferramenta de medição
const SETTINGS = {
    lineColor: 0x00ffff,
    lineWidth: 2,
    labelBackgroundColor: 'rgba(0, 20, 40, 0.8)',
    labelTextColor: '#00ffff',
    displayAU: true, // Mostrar distâncias em Unidades Astronômicas
    displayKm: true  // Mostrar distâncias em quilômetros
};

/**
 * Inicializa a ferramenta de medição
 * @param {THREE.Scene} sceneInstance - A cena Three.js
 * @param {THREE.Camera} cameraInstance - A câmera Three.js
 * @param {THREE.OrbitControls} controlsInstance - Os controles da órbita
 * @param {Object} planetObjects - Objetos dos planetas na cena
 * @returns {Object} - API da ferramenta de medição
 */
export function initMeasurementTool(sceneInstance, cameraInstance, controlsInstance, planetObjects) {
    scene = sceneInstance;
    camera = cameraInstance;
    controls = controlsInstance;
    planets = planetObjects;
    
    console.log('Ferramenta de medição inicializada');
    
    // Criar painel de controle da ferramenta
    createMeasurementControls();
    
    // Criar visualização central da medição
    createMeasurementDisplay();
    
    // Retornar API pública
    return {
        startMeasurement: startMeasurement,
        stopMeasurement: stopMeasurement,
        isActive: () => measurementState.active,
        getDistance: () => measurementState.startObject && measurementState.endObject 
            ? calculateDistance(
                measurementState.startObject.position, 
                measurementState.endObject.position
              ) 
            : null,
        getMeasurementState: () => ({...measurementState}),
        updateMeasurementVisuals: updateMeasurementVisuals
    };
}

/**
 * Cria o painel de controle da ferramenta de medição
 */
function createMeasurementControls() {
    // Encontrar o painel de controle principal
    let controlPanel = document.querySelector('.control-panel');
    
    // Se o painel não existir, vamos criar um
    if (!controlPanel) {
        console.warn('Painel de controle principal não encontrado. Criando um novo...');
        
        // Criar o painel principal se não existir
        controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';
        
        // Verificar se o elemento pai existe
        const controlsContainer = document.getElementById('controls-container');
        if (controlsContainer) {
            controlsContainer.appendChild(controlPanel);
        } else {
            // Se o container também não existir, criar um e adicionar ao body
            const newContainer = document.createElement('div');
            newContainer.id = 'controls-container';
            document.body.appendChild(newContainer);
            newContainer.appendChild(controlPanel);
            console.log('Container de controles criado dinamicamente');
        }
    }
    
    // Criar o fieldset para os controles da ferramenta de medição
    const measurementFieldset = document.createElement('fieldset');
    measurementFieldset.className = 'controls-section';
    
    // Criar a legenda do fieldset
    const legend = document.createElement('legend');
    legend.textContent = 'Ferramenta de Medição';
    measurementFieldset.appendChild(legend);
    
    // Botão para ativar/desativar a ferramenta
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-measurement';
    toggleButton.className = 'control-button';
    toggleButton.textContent = 'Iniciar Medição';
    toggleButton.addEventListener('click', () => {
        if (measurementState.active) {
            stopMeasurement();
            toggleButton.textContent = 'Iniciar Medição';
        } else {
            startMeasurement();
            toggleButton.textContent = 'Cancelar Medição';
        }
    });
    measurementFieldset.appendChild(toggleButton);
    
    // Dropdown para selecionar o primeiro objeto
    const startObjectLabel = document.createElement('label');
    startObjectLabel.className = 'control-item';
    startObjectLabel.textContent = 'Objeto Inicial:';
    
    const startObjectSelect = document.createElement('select');
    startObjectSelect.id = 'start-object';
    startObjectSelect.className = 'select-control';
    
    // Opção vazia padrão
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um objeto';
    startObjectSelect.appendChild(defaultOption);
    
    // Adicionar opções para cada planeta
    Object.keys(planets).forEach(planetId => {
        if (planetId !== 'sol') {  // Excluir o Sol para evitar medições muito grandes
            const option = document.createElement('option');
            option.value = planetId;
            option.textContent = planets[planetId].name || planetId;
            startObjectSelect.appendChild(option);
        }
    });
    
    startObjectSelect.addEventListener('change', (event) => {
        if (event.target.value) {
            selectStartObject(planets[event.target.value]);
        } else {
            selectStartObject(null);
        }
    });
    
    startObjectLabel.appendChild(startObjectSelect);
    measurementFieldset.appendChild(startObjectLabel);
    
    // Dropdown para selecionar o segundo objeto
    const endObjectLabel = document.createElement('label');
    endObjectLabel.className = 'control-item';
    endObjectLabel.textContent = 'Objeto Final:';
    
    const endObjectSelect = document.createElement('select');
    endObjectSelect.id = 'end-object';
    endObjectSelect.className = 'select-control';
    
    // Opção vazia padrão
    const defaultEndOption = document.createElement('option');
    defaultEndOption.value = '';
    defaultEndOption.textContent = 'Selecione um objeto';
    endObjectSelect.appendChild(defaultEndOption);
    
    // Adicionar opções para cada planeta
    Object.keys(planets).forEach(planetId => {
        if (planetId !== 'sol') {  // Excluir o Sol para evitar medições muito grandes
            const option = document.createElement('option');
            option.value = planetId;
            option.textContent = planets[planetId].name || planetId;
            endObjectSelect.appendChild(option);
        }
    });
    
    endObjectSelect.addEventListener('change', (event) => {
        if (event.target.value) {
            selectEndObject(planets[event.target.value]);
        } else {
            selectEndObject(null);
        }
    });
    
    endObjectLabel.appendChild(endObjectSelect);
    measurementFieldset.appendChild(endObjectLabel);
    
    // Opções de configuração
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'control-item options-container';
    
    // Checkbox para exibir distância em UA
    const displayAuLabel = document.createElement('label');
    displayAuLabel.className = 'checkbox-label';
    
    const displayAuCheckbox = document.createElement('input');
    displayAuCheckbox.type = 'checkbox';
    displayAuCheckbox.id = 'display-au';
    displayAuCheckbox.checked = SETTINGS.displayAU;
    
    displayAuCheckbox.addEventListener('change', (event) => {
        SETTINGS.displayAU = event.target.checked;
        updateMeasurementDisplay();
    });
    
    displayAuLabel.appendChild(displayAuCheckbox);
    displayAuLabel.appendChild(document.createTextNode(' Unidades Astronômicas (UA)'));
    optionsContainer.appendChild(displayAuLabel);
    
    // Checkbox para exibir distância em KM
    const displayKmLabel = document.createElement('label');
    displayKmLabel.className = 'checkbox-label';
    
    const displayKmCheckbox = document.createElement('input');
    displayKmCheckbox.type = 'checkbox';
    displayKmCheckbox.id = 'display-km';
    displayKmCheckbox.checked = SETTINGS.displayKm;
    
    displayKmCheckbox.addEventListener('change', (event) => {
        SETTINGS.displayKm = event.target.checked;
        updateMeasurementDisplay();
    });
    
    displayKmLabel.appendChild(displayKmCheckbox);
    displayKmLabel.appendChild(document.createTextNode(' Quilômetros (km)'));
    optionsContainer.appendChild(displayKmLabel);
    
    measurementFieldset.appendChild(optionsContainer);
    
    // Adicionar informações sobre a ferramenta
    const infoButton = document.createElement('button');
    infoButton.textContent = 'Sobre as Distâncias';
    infoButton.className = 'control-button info-button';
    infoButton.addEventListener('click', showDistancesInfo);
    
    measurementFieldset.appendChild(infoButton);
    
    // Adicionar o fieldset ao painel de controle
    controlPanel.appendChild(measurementFieldset);
    
    // Adicionar estilos CSS
    addMeasurementStyles();
}

/**
 * Cria o display central para mostrar a medição atual
 */
function createMeasurementDisplay() {
    // Criar o elemento de display de medição
    let measurementDisplay = document.getElementById('measurement-display');
    
    if (!measurementDisplay) {
        measurementDisplay = document.createElement('div');
        measurementDisplay.id = 'measurement-display';
        measurementDisplay.className = 'measurement-display hidden';
        
        // Conteúdo do display
        measurementDisplay.innerHTML = `
            <div class="measurement-header">
                <span class="measurement-title">Distância Medida</span>
                <button id="close-measurement" class="close-button">&times;</button>
            </div>
            <div class="measurement-content">
                <div class="objects-info">
                    <div id="start-object-info" class="object-info">
                        <span class="object-label">Origem:</span>
                        <span class="object-name">---</span>
                    </div>
                    <div class="arrow">→</div>
                    <div id="end-object-info" class="object-info">
                        <span class="object-label">Destino:</span>
                        <span class="object-name">---</span>
                    </div>
                </div>
                <div class="distance-display">
                    <div id="au-distance" class="distance-value">
                        <span class="value">---</span>
                        <span class="unit">UA</span>
                    </div>
                    <div id="km-distance" class="distance-value">
                        <span class="value">---</span>
                        <span class="unit">km</span>
                    </div>
                </div>
                <div class="comparison">
                    <div class="comparison-title">Comparações</div>
                    <div id="light-time" class="comparison-item">
                        <span class="label">Tempo de luz:</span>
                        <span class="value">---</span>
                    </div>
                    <div id="spacecraft-time" class="comparison-item">
                        <span class="label">Tempo de viagem (sonda):</span>
                        <span class="value">---</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(measurementDisplay);
        
        // Adicionar evento para o botão de fechar
        document.getElementById('close-measurement').addEventListener('click', () => {
            measurementDisplay.classList.add('hidden');
        });
    }
}

/**
 * Inicia o modo de medição
 */
function startMeasurement() {
    measurementState.active = true;
    
    // Resetar seleção de objetos
    measurementState.startObject = null;
    measurementState.endObject = null;
    
    // Resetar elementos visuais
    if (measurementState.line) {
        scene.remove(measurementState.line);
        measurementState.line = null;
    }
    
    if (measurementState.label) {
        scene.remove(measurementState.label);
        measurementState.label = null;
    }
    
    // Resetar os dropdowns
    const startObjectSelect = document.getElementById('start-object');
    const endObjectSelect = document.getElementById('end-object');
    
    if (startObjectSelect) startObjectSelect.value = '';
    if (endObjectSelect) endObjectSelect.value = '';
    
    // Atualizar UI
    document.getElementById('measurement-display').classList.add('hidden');
    document.getElementById('toggle-measurement').textContent = 'Cancelar Medição';
    
    console.log('Modo de medição iniciado');
}

/**
 * Para o modo de medição
 */
function stopMeasurement() {
    measurementState.active = false;
    
    // Remover elementos visuais
    if (measurementState.line) {
        scene.remove(measurementState.line);
        measurementState.line = null;
    }
    
    // Atualizar UI
    document.getElementById('toggle-measurement').textContent = 'Iniciar Medição';
    
    console.log('Modo de medição finalizado');
}

/**
 * Seleciona o objeto inicial para a medição
 * @param {Object} object - O objeto Three.js a ser usado como início
 */
function selectStartObject(object) {
    measurementState.startObject = object;
    
    // Atualizar a exibição
    const startObjectInfo = document.querySelector('#start-object-info .object-name');
    if (startObjectInfo) {
        startObjectInfo.textContent = object ? object.name || 'Objeto Selecionado' : '---';
    }
    
    updateMeasurementVisuals();
}

/**
 * Seleciona o objeto final para a medição
 * @param {Object} object - O objeto Three.js a ser usado como fim
 */
function selectEndObject(object) {
    measurementState.endObject = object;
    
    // Atualizar a exibição
    const endObjectInfo = document.querySelector('#end-object-info .object-name');
    if (endObjectInfo) {
        endObjectInfo.textContent = object ? object.name || 'Objeto Selecionado' : '---';
    }
    
    updateMeasurementVisuals();
}

/**
 * Atualiza os elementos visuais da medição
 */
function updateMeasurementVisuals() {
    // Remover linha existente
    if (measurementState.line) {
        scene.remove(measurementState.line);
        measurementState.line = null;
    }
    
    // Atualizar o display de medição
    updateMeasurementDisplay();
    
    // Se ambos os objetos estiverem selecionados, criar a linha
    if (measurementState.startObject && measurementState.endObject) {
        // Criar a linha entre os objetos
        const startPos = measurementState.startObject.position;
        const endPos = measurementState.endObject.position;
        
        const material = new THREE.LineBasicMaterial({
            color: SETTINGS.lineColor,
            linewidth: SETTINGS.lineWidth
        });
        
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(startPos.x, startPos.y, startPos.z),
            new THREE.Vector3(endPos.x, endPos.y, endPos.z)
        ]);
        
        measurementState.line = new THREE.Line(geometry, material);
        scene.add(measurementState.line);
        
        // Mostrar o display de medição
        document.getElementById('measurement-display').classList.remove('hidden');
    } else {
        // Esconder o display de medição
        document.getElementById('measurement-display').classList.add('hidden');
    }
}

/**
 * Atualiza o display de medição com os valores atuais
 */
function updateMeasurementDisplay() {
    if (!measurementState.startObject || !measurementState.endObject) {
        return;
    }
    
    const startPos = measurementState.startObject.position;
    const endPos = measurementState.endObject.position;
    
    // Calcular a distância
    const distanceInSceneUnits = calculateDistance(startPos, endPos);
    
    // Converter para UA (assumindo que 1 unidade no espaço da cena = 1 UA)
    const distanceInAU = distanceInSceneUnits;
    
    // Converter para km (1 UA = 149,597,870.7 km)
    const distanceInKm = distanceInAU * 149597870.7;
    
    // Atualizar os displays de distância
    const auDisplay = document.querySelector('#au-distance .value');
    const kmDisplay = document.querySelector('#km-distance .value');
    
    if (auDisplay) auDisplay.textContent = distanceInAU.toFixed(3);
    if (kmDisplay) kmDisplay.textContent = formatLargeNumber(distanceInKm);
    
    // Calcular e mostrar comparações
    
    // Tempo de luz (velocidade da luz = 299,792.458 km/s)
    const lightTimeSeconds = distanceInKm / 299792.458;
    const lightTimeDisplay = document.querySelector('#light-time .value');
    
    if (lightTimeDisplay) {
        if (lightTimeSeconds < 60) {
            lightTimeDisplay.textContent = `${lightTimeSeconds.toFixed(2)} segundos`;
        } else if (lightTimeSeconds < 3600) {
            lightTimeDisplay.textContent = `${(lightTimeSeconds / 60).toFixed(2)} minutos`;
        } else {
            lightTimeDisplay.textContent = `${(lightTimeSeconds / 3600).toFixed(2)} horas`;
        }
    }
    
    // Tempo de viagem de uma sonda espacial (assumindo 50,000 km/h de velocidade média)
    const spacecraftTimeHours = distanceInKm / 50000;
    const spacecraftTimeDisplay = document.querySelector('#spacecraft-time .value');
    
    if (spacecraftTimeDisplay) {
        if (spacecraftTimeHours < 24) {
            spacecraftTimeDisplay.textContent = `${spacecraftTimeHours.toFixed(1)} horas`;
        } else if (spacecraftTimeHours < 730) { // aproximadamente 30 dias
            spacecraftTimeDisplay.textContent = `${(spacecraftTimeHours / 24).toFixed(1)} dias`;
        } else {
            spacecraftTimeDisplay.textContent = `${(spacecraftTimeHours / 8760).toFixed(2)} anos`; // 8760 = 365 * 24
        }
    }
    
    // Mostrar ou esconder seções baseado nas configurações
    const auDistanceElement = document.getElementById('au-distance');
    const kmDistanceElement = document.getElementById('km-distance');
    
    if (auDistanceElement) auDistanceElement.style.display = SETTINGS.displayAU ? 'flex' : 'none';
    if (kmDistanceElement) kmDistanceElement.style.display = SETTINGS.displayKm ? 'flex' : 'none';
}

/**
 * Calcula a distância entre dois pontos 3D
 * @param {THREE.Vector3} point1 - O primeiro ponto
 * @param {THREE.Vector3} point2 - O segundo ponto
 * @returns {number} - A distância entre os pontos
 */
function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) +
        Math.pow(point2.y - point1.y, 2) +
        Math.pow(point2.z - point1.z, 2)
    );
}

/**
 * Formata um número grande com separadores de milhares e notação científica se necessário
 * @param {number} num - O número a ser formatado
 * @returns {string} - O número formatado
 */
function formatLargeNumber(num) {
    if (num >= 1e12) {
        return `${(num / 1e12).toFixed(2)} trilhões`;
    } else if (num >= 1e9) {
        return `${(num / 1e9).toFixed(2)} bilhões`;
    } else if (num >= 1e6) {
        return `${(num / 1e6).toFixed(2)} milhões`;
    } else if (num >= 1e3) {
        return `${(num / 1e3).toFixed(2)} mil`;
    } else {
        return num.toFixed(2);
    }
}

/**
 * Adiciona estilos CSS para a ferramenta de medição
 */
function addMeasurementStyles() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('measurement-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'measurement-styles';
    
    styleElement.textContent = `
        /* Estilos para o painel de controle da ferramenta de medição */
        .select-control {
            width: 100%;
            background-color: rgba(30, 40, 60, 0.8);
            color: white;
            border: 1px solid rgba(100, 150, 255, 0.4);
            border-radius: 4px;
            padding: 5px;
            margin-top: 5px;
            font-size: 14px;
        }
        
        .options-container {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
        }
        
        .checkbox-label {
            margin: 5px 0;
            display: flex;
            align-items: center;
        }
        
        /* Estilos para o display de medição */
        .measurement-display {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            max-width: 90vw;
            background-color: rgba(15, 20, 33, 0.95);
            color: white;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 80, 255, 0.5);
            z-index: 900;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .measurement-display.hidden {
            opacity: 0;
            transform: translate(-50%, 20px);
            pointer-events: none;
        }
        
        .measurement-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid rgba(100, 150, 255, 0.3);
        }
        
        .measurement-title {
            color: #4fc3f7;
            font-weight: bold;
            font-size: 16px;
        }
        
        .measurement-content {
            padding: 15px;
        }
        
        .objects-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .object-info {
            display: flex;
            flex-direction: column;
            min-width: 120px;
        }
        
        .arrow {
            color: #4fc3f7;
            font-size: 20px;
        }
        
        .object-label {
            font-size: 12px;
            color: #aaa;
        }
        
        .object-name {
            font-weight: bold;
            font-size: 16px;
            color: #fff;
        }
        
        .distance-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 15px 0;
        }
        
        .distance-value {
            display: flex;
            align-items: baseline;
            margin-bottom: 5px;
        }
        
        .distance-value .value {
            font-size: 24px;
            font-weight: bold;
            color: #4fc3f7;
            margin-right: 5px;
        }
        
        .distance-value .unit {
            font-size: 16px;
            color: #aaa;
        }
        
        .comparison {
            padding: 10px;
            background-color: rgba(30, 40, 60, 0.5);
            border-radius: 6px;
            margin-top: 10px;
        }
        
        .comparison-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #ccc;
        }
        
        .comparison-item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
        
        .comparison-item .label {
            font-size: 13px;
            color: #aaa;
        }
        
        .comparison-item .value {
            font-size: 13px;
            font-weight: bold;
            color: #fff;
        }
        
        /* Painel de informações sobre distâncias */
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
        
        @media (max-width: 576px) {
            .measurement-display {
                width: 90vw;
            }
            
            .object-info {
                min-width: 100px;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

/**
 * Exibe o painel de informações sobre distâncias no sistema solar
 */
function showDistancesInfo() {
    // Criar painel de informações se não existir
    let infoPanel = document.getElementById('distances-info-panel');
    
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.id = 'distances-info-panel';
        infoPanel.className = 'info-panel';
        
        // Criar conteúdo do painel
        infoPanel.innerHTML = `
            <div class="info-header">
                <h3>Distâncias no Sistema Solar</h3>
                <button id="close-distances-info" class="close-button">&times;</button>
            </div>
            <div class="info-content">
                <p>O Sistema Solar é vasto, com distâncias que vão além da nossa compreensão cotidiana. Para dimensionar essas distâncias, utilizamos diferentes unidades de medida.</p>
                
                <h4>Unidades de Medida</h4>
                <p><strong>Unidade Astronômica (UA)</strong>: É a distância média da Terra ao Sol, aproximadamente 149.597.871 km. É a unidade padrão para medir distâncias dentro do Sistema Solar.</p>
                
                <h4>Distâncias Médias dos Planetas ao Sol</h4>
                <ul>
                    <li><strong>Mercúrio</strong>: 0,39 UA (57,9 milhões km)</li>
                    <li><strong>Vênus</strong>: 0,72 UA (108,2 milhões km)</li>
                    <li><strong>Terra</strong>: 1,00 UA (149,6 milhões km)</li>
                    <li><strong>Marte</strong>: 1,52 UA (227,9 milhões km)</li>
                    <li><strong>Júpiter</strong>: 5,20 UA (778,5 milhões km)</li>
                    <li><strong>Saturno</strong>: 9,58 UA (1,4 bilhão km)</li>
                    <li><strong>Urano</strong>: 19,18 UA (2,9 bilhões km)</li>
                    <li><strong>Netuno</strong>: 30,07 UA (4,5 bilhões km)</li>
                </ul>
                
                <h4>Para Dimensionar</h4>
                <ul>
                    <li>A luz do Sol leva aproximadamente 8 minutos e 20 segundos para alcançar a Terra.</li>
                    <li>A luz do Sol leva cerca de 4 horas para alcançar Netuno.</li>
                    <li>A sonda Voyager 1, lançada em 1977, levou 12 anos para alcançar Netuno.</li>
                    <li>Atualmente, a Voyager 1 está a mais de 157 UA do Sol (mais de 23,3 bilhões km), tendo deixado a heliosfera em 2012.</li>
                </ul>
                
                <h4>Cinturões e Outros Objetos</h4>
                <ul>
                    <li><strong>Cinturão de Asteroides</strong>: Entre Marte e Júpiter, cerca de 2,2 a 3,2 UA do Sol.</li>
                    <li><strong>Cinturão de Kuiper</strong>: Estende-se de 30 a 50 UA do Sol.</li>
                    <li><strong>Nuvem de Oort</strong>: Estende-se de 2.000 a 100.000 UA do Sol.</li>
                    <li><strong>Proxima Centauri</strong> (estrela mais próxima): Aproximadamente 268.000 UA (4,25 anos-luz).</li>
                </ul>
            </div>
        `;
        
        document.body.appendChild(infoPanel);
        
        // Adicionar evento para o botão de fechar
        document.getElementById('close-distances-info').addEventListener('click', () => {
            infoPanel.classList.add('hidden');
        });
    }
    
    // Mostrar o painel
    infoPanel.classList.remove('hidden');
} 