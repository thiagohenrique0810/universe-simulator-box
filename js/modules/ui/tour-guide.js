/**
 * Sistema de Tour Guiado pelo Sistema Solar
 * Implementa um tour interativo pelos planetas e outros corpos celestes
 */

import { PLANET_INFO } from '../data/planet-info.js';

// Configuração dos pontos do tour
const TOUR_STOPS = [
    {
        id: 'intro',
        title: 'Bem-vindo ao Sistema Solar',
        target: 'sol',
        distance: 100,
        angle: { x: 0.5, y: 0.5 },
        description: 'Bem-vindo ao tour guiado pelo Sistema Solar! Vamos explorar juntos os planetas, luas e outros corpos celestes. Clique em "Próximo" para começar.',
        duration: 8000
    },
    {
        id: 'sol',
        title: 'O Sol',
        target: 'sol',
        distance: 10,
        angle: { x: 0.3, y: 0.4 },
        description: 'O Sol é a estrela central do Sistema Solar. É uma esfera quase perfeita de plasma quente, com um diâmetro de aproximadamente 1.392.684 km, cerca de 109 vezes o da Terra. O Sol contém 99,86% da massa do Sistema Solar.',
        duration: 12000
    },
    {
        id: 'mercurio',
        title: 'Mercúrio',
        target: 'mercurio',
        distance: 1.5,
        angle: { x: 0.2, y: 0.3 },
        description: 'Mercúrio é o planeta mais próximo do Sol e o menor do Sistema Solar. A sua órbita dura 88 dias terrestres, sendo o planeta com a órbita mais rápida. Apesar da proximidade com o Sol, não é o planeta mais quente, título que pertence a Vênus.',
        duration: 10000
    },
    {
        id: 'venus',
        title: 'Vênus',
        target: 'venus',
        distance: 1.5,
        angle: { x: 0.2, y: 0.3 },
        description: 'Vênus é o segundo planeta do Sistema Solar em ordem de distância ao Sol. É chamado de planeta irmão da Terra, por ter massa e tamanho similares. Possui a atmosfera mais densa entre os planetas terrestres, composta principalmente de dióxido de carbono.',
        duration: 10000
    },
    {
        id: 'terra',
        title: 'Terra',
        target: 'terra',
        distance: 1.8,
        angle: { x: 0.2, y: 0.3 },
        description: 'A Terra é o terceiro planeta mais próximo do Sol, o mais denso e o quinto maior dos oito planetas do Sistema Solar. É também o maior dos quatro planetas terrestres. É o único corpo celeste conhecido por abrigar vida.',
        duration: 10000
    },
    {
        id: 'lua',
        title: 'Lua',
        target: 'lua',
        parentTarget: 'terra',
        distance: 0.5,
        angle: { x: 0.3, y: 0.3 },
        description: 'A Lua é o único satélite natural da Terra e o quinto maior satélite do Sistema Solar. É o maior satélite natural de um planeta no Sistema Solar em relação ao tamanho do planeta.',
        duration: 8000
    },
    {
        id: 'marte',
        title: 'Marte',
        target: 'marte',
        distance: 1.5,
        angle: { x: 0.2, y: 0.3 },
        description: 'Marte é o quarto planeta a partir do Sol, muitas vezes descrito como o "Planeta Vermelho", devido à aparência avermelhada causada pelo óxido de ferro presente em sua superfície. Tem duas pequenas luas, Fobos e Deimos.',
        duration: 10000
    },
    {
        id: 'cinturaoAsteroides',
        title: 'Cinturão de Asteroides',
        target: 'cinturaoAsteroides',
        distance: 20,
        angle: { x: 0, y: 0.5 },
        description: 'O Cinturão de Asteroides é uma região do Sistema Solar localizada entre as órbitas de Marte e Júpiter. Contém um grande número de objetos irregulares chamados asteroides ou pequenos planetas.',
        duration: 8000
    },
    {
        id: 'jupiter',
        title: 'Júpiter',
        target: 'jupiter',
        distance: 5,
        angle: { x: 0.3, y: 0.3 },
        description: 'Júpiter é o maior planeta do Sistema Solar, tanto em diâmetro quanto em massa, e é o quinto mais próximo do Sol. É um gigante gasoso, junto com Saturno, Urano e Netuno. Possui 79 satélites conhecidos.',
        duration: 12000
    },
    {
        id: 'saturno',
        title: 'Saturno',
        target: 'saturno',
        distance: 5,
        angle: { x: 0.4, y: 0.3 },
        description: 'Saturno é o sexto planeta a partir do Sol e o segundo maior do Sistema Solar. É conhecido principalmente por seu impressionante sistema de anéis, que é composto principalmente de partículas de gelo e poeira cósmica.',
        duration: 12000
    },
    {
        id: 'urano',
        title: 'Urano',
        target: 'urano',
        distance: 3,
        angle: { x: 0.3, y: 0.3 },
        description: 'Urano é o sétimo planeta a partir do Sol. Sua particularidade é que seu eixo de rotação está praticamente deitado em relação ao plano de sua órbita, fazendo com que seus polos fiquem onde a maioria dos outros planetas tem o equador.',
        duration: 10000
    },
    {
        id: 'netuno',
        title: 'Netuno',
        target: 'netuno',
        distance: 3,
        angle: { x: 0.3, y: 0.3 },
        description: 'Netuno é o oitavo e último planeta do Sistema Solar na ordem de distância ao Sol. É o quarto maior planeta em diâmetro e o terceiro maior em massa. É 17 vezes mais massivo que a Terra e ligeiramente mais massivo que Urano.',
        duration: 10000
    },
    {
        id: 'cinturaoKuiper',
        title: 'Cinturão de Kuiper',
        target: 'cinturaoKuiper',
        distance: 50,
        angle: { x: 0.1, y: 0.5 },
        description: 'O Cinturão de Kuiper é uma região do Sistema Solar que se estende desde a órbita de Netuno a 30 UA até 50 UA do Sol. É similar ao cinturão de asteroides, mas muito maior. Contém principalmente objetos compostos de voláteis congelados (gelos).',
        duration: 10000
    },
    {
        id: 'plutao',
        title: 'Plutão',
        target: 'plutao',
        distance: 1.5,
        angle: { x: 0.3, y: 0.3 },
        description: 'Plutão, formalmente designado como 134340 Plutão, é o segundo maior planeta anão do Sistema Solar. Antes classificado como planeta, hoje é considerado um planeta anão e o maior membro do Cinturão de Kuiper.',
        duration: 8000
    },
    {
        id: 'final',
        title: 'Fim do Tour',
        target: 'sol',
        distance: 200,
        angle: { x: 0, y: 0 },
        description: 'Você completou o tour pelo Sistema Solar! Esperamos que tenha aprendido mais sobre nosso vizinho cósmico. Agora você pode explorar livremente usando os controles de navegação ou reiniciar o tour para revisar o que aprendeu.',
        duration: 10000
    }
];

// Variáveis do módulo
let currentStopIndex = 0;
let tourActive = false;
let tourPaused = false;
let planets = {};
let scene, camera, controls;
let tourPanel;
let animationInProgress = false;
let tourInterval;
let originalSimulationSpeed = 1;
let cameraUtils;

/**
 * Inicializa o sistema de tour guiado
 * @param {Object} sceneRef - Referência para a cena Three.js
 * @param {Object} cameraRef - Referência para a câmera
 * @param {Object} controlsRef - Referência para os controles de câmera
 * @param {Object} planetsRef - Referência para os objetos dos planetas
 * @param {Object} cameraUtilsRef - Referência para as utilidades de câmera
 * @param {Function} getSimulationSpeedRef - Função para obter a velocidade atual da simulação
 * @param {Function} setSimulationSpeedRef - Função para definir a velocidade da simulação
 */
export function initTourGuide(
    sceneRef, 
    cameraRef, 
    controlsRef, 
    planetsRef, 
    cameraUtilsRef,
    getSimulationSpeedRef,
    setSimulationSpeedRef
) {
    scene = sceneRef;
    camera = cameraRef;
    controls = controlsRef;
    planets = planetsRef;
    cameraUtils = cameraUtilsRef;
    
    // Criar o painel do tour
    createTourPanel();
    
    // Registrar os botões do tour
    document.getElementById('tour-previous-btn').addEventListener('click', previousStop);
    document.getElementById('tour-next-btn').addEventListener('click', nextStop);
    document.getElementById('tour-pause-btn').addEventListener('click', togglePauseTour);
    document.getElementById('tour-stop-btn').addEventListener('click', stopTour);
    
    // Adicionar evento para o botão de iniciar tour no painel principal
    const tourButton = document.createElement('button');
    tourButton.id = 'main-tour-btn';
    tourButton.className = 'control-button';
    tourButton.textContent = 'Iniciar Tour Guiado';
    tourButton.addEventListener('click', startTour);
    
    // Adicionar o botão ao painel de controles
    const controlPanel = document.querySelector('.control-panel') || document.body;
    controlPanel.appendChild(tourButton);
    
    console.log('Sistema de Tour Guiado inicializado com sucesso!');
}

/**
 * Cria o painel de interface do tour
 */
function createTourPanel() {
    tourPanel = document.createElement('div');
    tourPanel.id = 'tour-panel';
    tourPanel.className = 'tour-panel hidden';
    
    tourPanel.innerHTML = `
        <div class="tour-header">
            <h2 id="tour-title">Tour Guiado pelo Sistema Solar</h2>
            <div class="tour-progress-bar">
                <div id="tour-progress" class="tour-progress"></div>
            </div>
        </div>
        <div class="tour-content">
            <p id="tour-description"></p>
        </div>
        <div class="tour-controls">
            <button id="tour-previous-btn" class="tour-btn">Anterior</button>
            <button id="tour-pause-btn" class="tour-btn">Pausar</button>
            <button id="tour-next-btn" class="tour-btn">Próximo</button>
            <button id="tour-stop-btn" class="tour-btn">Encerrar Tour</button>
        </div>
    `;
    
    document.body.appendChild(tourPanel);
    
    // Adicionar estilos para o tour
    addTourStyles();
}

/**
 * Adiciona estilos CSS para o tour
 */
function addTourStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .tour-panel {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 0, 150, 0.5);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .tour-panel.hidden {
            transform: translate(-50%, 200px);
            opacity: 0;
            pointer-events: none;
        }
        
        .tour-header {
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 10px;
        }
        
        .tour-header h2 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #4fc3f7;
        }
        
        .tour-progress-bar {
            height: 4px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .tour-progress {
            height: 100%;
            background-color: #4fc3f7;
            width: 0%;
            transition: width 0.5s ease;
        }
        
        .tour-content {
            margin-bottom: 15px;
            max-height: 150px;
            overflow-y: auto;
        }
        
        .tour-content p {
            margin: 0;
            line-height: 1.5;
        }
        
        .tour-controls {
            display: flex;
            justify-content: space-between;
        }
        
        .tour-btn {
            background-color: #2196f3;
            border: none;
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .tour-btn:hover {
            background-color: #0d8aee;
        }
        
        .tour-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
        }
        
        #main-tour-btn {
            background-color: #2196f3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            margin-top: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        #main-tour-btn:hover {
            background-color: #0d8aee;
        }
        
        @media (max-width: 600px) {
            .tour-panel {
                width: 90%;
            }
            
            .tour-controls {
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .tour-btn {
                flex: 1 0 40%;
            }
        }
    `;
    
    document.head.appendChild(styleEl);
}

/**
 * Inicia o tour guiado
 */
function startTour() {
    if (tourActive) return;
    
    tourActive = true;
    currentStopIndex = 0;
    tourPaused = false;
    
    // Exibir o painel do tour
    tourPanel.classList.remove('hidden');
    
    // Armazenar a velocidade original da simulação para restaurar depois
    originalSimulationSpeed = window.getSimulationSpeed ? window.getSimulationSpeed() : 1;
    
    // Definir a velocidade como lenta durante o tour para melhor visualização
    if (window.setSimulationSpeed) {
        window.setSimulationSpeed(0.5);
    }
    
    // Iniciar a primeira parada
    goToStop(0);
    
    console.log('Tour iniciado!');
}

/**
 * Navega para a próxima parada no tour
 */
function nextStop() {
    if (!tourActive || animationInProgress) return;
    
    if (currentStopIndex < TOUR_STOPS.length - 1) {
        goToStop(currentStopIndex + 1);
    } else {
        stopTour(); // Finalizar o tour se for a última parada
    }
}

/**
 * Navega para a parada anterior no tour
 */
function previousStop() {
    if (!tourActive || animationInProgress) return;
    
    if (currentStopIndex > 0) {
        goToStop(currentStopIndex - 1);
    }
}

/**
 * Pausa ou continua o tour
 */
function togglePauseTour() {
    if (!tourActive) return;
    
    tourPaused = !tourPaused;
    const pauseBtn = document.getElementById('tour-pause-btn');
    
    if (tourPaused) {
        pauseBtn.textContent = 'Continuar';
        clearTimeout(tourInterval);
    } else {
        pauseBtn.textContent = 'Pausar';
        
        // Reiniciar o timer para a próxima parada
        const currentStop = TOUR_STOPS[currentStopIndex];
        const remainingTime = currentStop.duration * (1 - parseFloat(document.getElementById('tour-progress').style.width) / 100);
        
        if (remainingTime > 0) {
            tourInterval = setTimeout(() => {
                if (!tourPaused && tourActive) {
                    nextStop();
                }
            }, remainingTime);
        }
    }
}

/**
 * Para o tour guiado
 */
function stopTour() {
    tourActive = false;
    tourPaused = false;
    clearTimeout(tourInterval);
    
    // Ocultar o painel
    tourPanel.classList.add('hidden');
    
    // Restaurar a velocidade original da simulação
    if (window.setSimulationSpeed) {
        window.setSimulationSpeed(originalSimulationSpeed);
    }
    
    // Restaurar os controles da câmera
    if (controls) {
        controls.enabled = true;
    }
    
    console.log('Tour finalizado!');
}

/**
 * Navega para uma parada específica do tour
 * @param {number} index - Índice da parada do tour
 */
function goToStop(index) {
    clearTimeout(tourInterval);
    
    if (index < 0 || index >= TOUR_STOPS.length) return;
    
    currentStopIndex = index;
    animationInProgress = true;
    
    const stop = TOUR_STOPS[index];
    
    // Atualizar o título e descrição
    document.getElementById('tour-title').textContent = stop.title;
    document.getElementById('tour-description').textContent = stop.description;
    
    // Atualizar a barra de progresso do tour completo
    const progressPercentage = ((index) / (TOUR_STOPS.length - 1)) * 100;
    document.getElementById('tour-progress').style.width = `${progressPercentage}%`;
    
    // Atualizar estado dos botões
    document.getElementById('tour-previous-btn').disabled = index === 0;
    document.getElementById('tour-next-btn').disabled = false;
    
    // Determinar o alvo para a câmera
    let target;
    
    // Verificar se o alvo é um objeto especial
    if (stop.target === 'cinturaoAsteroides') {
        // Posicionar a câmera para ver o cinturão de asteroides
        const position = new THREE.Vector3(0, 20, 80);
        camera.position.copy(position);
        controls.target.set(0, 0, 0);
    } else if (stop.target === 'cinturaoKuiper') {
        // Posicionar a câmera para ver o cinturão de Kuiper
        const position = new THREE.Vector3(0, 50, 225);
        camera.position.copy(position);
        controls.target.set(0, 0, 220);
    } else {
        // Para luas, precisamos considerar o planeta pai
        if (stop.parentTarget && planets[stop.parentTarget]) {
            const parentPlanet = planets[stop.parentTarget];
            
            // Procurar pela lua no planeta pai
            if (parentPlanet.children) {
                for (const child of parentPlanet.children) {
                    if (child.name === stop.target) {
                        target = child;
                        break;
                    }
                }
            }
        } else if (planets[stop.target]) {
            target = planets[stop.target];
        }
        
        // Se encontramos um alvo, focar nele
        if (target) {
            focusOnTarget(target, stop.distance, stop.angle);
        }
    }
    
    // Definir um temporizador para avançar automaticamente para a próxima parada
    tourInterval = setTimeout(() => {
        if (!tourPaused && tourActive) {
            nextStop();
        }
    }, stop.duration);
    
    // Animação concluída
    setTimeout(() => {
        animationInProgress = false;
    }, 1000);
    
    console.log(`Navegando para parada do tour: ${stop.title}`);
}

/**
 * Foca a câmera em um alvo específico
 * @param {Object} target - Objeto alvo para foco
 * @param {number} distance - Distância para manter do alvo
 * @param {Object} angle - Ângulo para visualizar o alvo
 */
function focusOnTarget(target, distance, angle) {
    if (!target) return;
    
    // Desabilitar os controles durante a animação
    if (controls) {
        controls.enabled = false;
    }
    
    // Se temos as utilidades de câmera disponíveis, usar elas
    if (cameraUtils && cameraUtils.focusOnObject) {
        cameraUtils.focusOnObject(target, true);
        return;
    }
    
    // Caso contrário, implementar nosso próprio sistema de foco
    const targetPosition = target.position.clone();
    
    // Calcular a posição da câmera com base na distância e ângulo
    const radius = target.userData.radius || 1;
    const scaledDistance = radius * distance;
    
    // Converter ângulos para coordenadas esféricas
    const phi = Math.PI * (0.5 - angle.y); // latitude
    const theta = 2 * Math.PI * angle.x; // longitude
    
    // Calcular a posição da câmera em coordenadas cartesianas
    const cameraPosition = new THREE.Vector3();
    cameraPosition.x = targetPosition.x + scaledDistance * Math.sin(phi) * Math.cos(theta);
    cameraPosition.y = targetPosition.y + scaledDistance * Math.cos(phi);
    cameraPosition.z = targetPosition.z + scaledDistance * Math.sin(phi) * Math.sin(theta);
    
    // Animação suave
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 1000; // 1 segundo
    const startTime = Date.now();
    
    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Easing out cubic
        
        // Interpolar posição
        camera.position.lerpVectors(startPosition, cameraPosition, easeProgress);
        
        // Interpolar alvo
        controls.target.lerpVectors(startTarget, targetPosition, easeProgress);
        controls.update();
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            // Reativar os controles após a animação
            if (controls) {
                controls.enabled = true;
            }
        }
    }
    
    animateCamera();
} 