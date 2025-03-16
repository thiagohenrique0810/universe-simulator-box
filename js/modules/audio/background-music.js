/**
 * Sistema de áudio de fundo
 * Gerencia a música de fundo e controles de áudio
 */

// Variável para armazenar o objeto de áudio
let backgroundMusic;

/**
 * Inicializa o sistema de música de fundo
 * @param {String} audioPath - Caminho para o arquivo de áudio
 * @returns {Object} Objeto de áudio
 */
export function setupBackgroundMusic(audioPath = 'sounds/universe-sound-track.mp3') {
    // Criar elemento de áudio
    backgroundMusic = new Audio(audioPath);
    backgroundMusic.loop = true; // Reproduzir em loop
    backgroundMusic.volume = 0.5; // Volume inicial (50%)
    
    // Reproduzir música (alguns navegadores podem bloquear autoplay)
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Reprodução automática bloqueada pelo navegador. Clique em qualquer lugar da tela para iniciar a música.');
            
            // Adicionar evento de clique para iniciar a música quando o usuário interagir com a página
            document.addEventListener('click', function startMusic() {
                backgroundMusic.play();
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });
    }
    
    // Criar controles para a música
    createMusicControls();
    
    return backgroundMusic;
}

/**
 * Cria controles para a música de fundo
 */
function createMusicControls() {
    // Criar container para controles de música
    const musicControls = document.createElement('div');
    musicControls.id = 'music-controls';
    musicControls.style.position = 'absolute';
    musicControls.style.bottom = '10px';
    musicControls.style.right = '10px';
    musicControls.style.background = 'rgba(0, 0, 0, 0.5)';
    musicControls.style.padding = '10px';
    musicControls.style.borderRadius = '5px';
    musicControls.style.color = 'white';
    musicControls.style.fontFamily = 'Arial, sans-serif';
    musicControls.style.zIndex = '100';
    musicControls.style.display = 'flex';
    musicControls.style.alignItems = 'center';
    
    // Ícone de música
    const musicIcon = document.createElement('div');
    musicIcon.innerHTML = '🎵';
    musicIcon.style.fontSize = '20px';
    musicIcon.style.marginRight = '10px';
    musicControls.appendChild(musicIcon);
    
    // Slider para controle de volume
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = backgroundMusic.volume.toString();
    volumeSlider.style.width = '100px';
    volumeSlider.style.margin = '0 10px';
    
    // Atualizar volume ao mover o slider
    volumeSlider.addEventListener('input', function() {
        backgroundMusic.volume = parseFloat(this.value);
        
        // Atualizar ícone de mudo/som baseado no volume
        if (parseFloat(this.value) === 0) {
            muteButton.textContent = '🔇';
        } else {
            muteButton.textContent = '🔊';
        }
    });
    
    musicControls.appendChild(volumeSlider);
    
    // Botão para silenciar/ativar som
    const muteButton = document.createElement('button');
    muteButton.textContent = '🔊';
    muteButton.style.background = 'transparent';
    muteButton.style.border = 'none';
    muteButton.style.color = 'white';
    muteButton.style.fontSize = '20px';
    muteButton.style.cursor = 'pointer';
    muteButton.style.padding = '0 5px';
    
    // Estado anterior do volume para restaurar após tirar o mudo
    let previousVolume = backgroundMusic.volume;
    
    // Alternar entre mudo e som
    muteButton.addEventListener('click', function() {
        if (backgroundMusic.volume > 0) {
            previousVolume = backgroundMusic.volume;
            backgroundMusic.volume = 0;
            volumeSlider.value = '0';
            this.textContent = '🔇';
        } else {
            backgroundMusic.volume = previousVolume;
            volumeSlider.value = previousVolume.toString();
            this.textContent = '🔊';
        }
    });
    
    musicControls.appendChild(muteButton);
    
    // Adicionar ao DOM
    document.body.appendChild(musicControls);
}

/**
 * Pausa a música de fundo
 */
export function pauseMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

/**
 * Retoma a música de fundo
 */
export function playMusic() {
    if (backgroundMusic) {
        backgroundMusic.play();
    }
}

/**
 * Ajusta o volume da música
 * @param {Number} volume - Valor do volume (0-1)
 */
export function setVolume(volume) {
    if (backgroundMusic) {
        backgroundMusic.volume = volume;
    }
}

/**
 * Retorna o objeto de áudio
 * @returns {HTMLAudioElement} Objeto de áudio
 */
export function getBackgroundMusic() {
    return backgroundMusic;
} 