/**
 * Atualiza as posições dos planetas e suas luas
 * @param {Object} planets - Objeto contendo todos os planetas
 * @param {Number} deltaTime - Tempo decorrido desde o último frame
 * @param {Object} parameters - Parâmetros de simulação (inclui timeScale)
 */
export function updatePlanetPositions(planets, deltaTime, parameters) {
    // Se não houver planetas, retorna
    if (!planets) return;
    
    // Multiplica o delta pelo fator de velocidade da simulação
    const scaledDelta = deltaTime * parameters.timeScale;
    
    // Atualizar posição e rotação de cada planeta
    for (const planetName in planets) {
        if (planetName === 'sol') {
            // Rotação do sol
            const sol = planets[planetName];
            sol.rotation.y += sol.userData.rotationSpeed * scaledDelta;
            continue;
        }
        
        const planet = planets[planetName];
        const userData = planet.userData;
        
        // Ignora objetos sem dados
        if (!userData) continue;
        
        // Atualiza o ângulo usado para calcular a posição na órbita
        userData.angle += userData.orbitalSpeed * scaledDelta;
        
        // Mantém o ângulo entre 0 e 2π
        while (userData.angle > Math.PI * 2) userData.angle -= Math.PI * 2;
        
        // Usar equação de órbita elíptica se tiver excentricidade
        // Se não, usar órbita circular (mais eficiente)
        if (userData.eccentricity > 0) {
            // Ângulo verdadeiro (true anomaly)
            let angle = userData.angle;
            
            // Calcular distância do foco usando a equação da órbita elíptica
            // r = a(1-e²)/(1+e*cos(θ)) onde a é o semi-eixo maior, e é a excentricidade
            const orbit_r = (userData.semiMajorAxis * (1 - Math.pow(userData.eccentricity, 2))) /
                           (1 + userData.eccentricity * Math.cos(angle));
            
            // Atualizar posição baseado no ângulo e na distância calculada
            planet.position.x = orbit_r * Math.cos(angle);
            planet.position.z = orbit_r * Math.sin(angle);
        } else {
            // Órbita circular (padrão)
            planet.position.x = userData.distance * Math.cos(userData.angle);
            planet.position.z = userData.distance * Math.sin(userData.angle);
        }
        
        // Rotação do planeta (ajustada pelo tempo)
        planet.rotation.y += userData.rotationSpeed * scaledDelta;
        
        // Atualizar posição das luas, se houver
        updateMoons(planet, scaledDelta);
    }
    
    // Atualizar posições dos objetos do Cinturão de Kuiper (planetas anões)
    updateDwarfPlanets(planets, scaledDelta);
}

/**
 * Atualiza as posições e rotações dos planetas anões
 * @param {Object} planets - Objeto contendo todos os planetas, incluindo anões
 * @param {Number} scaledDelta - Tempo escalado para a velocidade da simulação
 */
function updateDwarfPlanets(planets, scaledDelta) {
    for (const objName in planets) {
        const obj = planets[objName];
        
        // Verifica se é um planeta anão
        if (obj.userData && obj.userData.isDwarfPlanet) {
            // Atualiza o ângulo com velocidade orbital mais lenta para objetos distantes
            obj.userData.angle += obj.userData.orbitalSpeed * scaledDelta;
            
            // Mantém o ângulo entre 0 e 2π
            while (obj.userData.angle > Math.PI * 2) obj.userData.angle -= Math.PI * 2;
            
            // Usar equação de órbita elíptica se tiver excentricidade
            if (obj.userData.eccentricity > 0) {
                let angle = obj.userData.angle;
                
                // Calcular distância usando a equação da órbita elíptica
                // r = a(1-e²)/(1+e*cos(θ))
                const orbit_r = (obj.userData.semiMajorAxis * (1 - Math.pow(obj.userData.eccentricity, 2))) /
                               (1 + obj.userData.eccentricity * Math.cos(angle));
                
                // Atualizar posição baseado no ângulo e na distância calculada
                obj.position.x = orbit_r * Math.cos(angle);
                obj.position.z = orbit_r * Math.sin(angle);
            } else {
                // Órbita circular (padrão)
                obj.position.x = obj.userData.distance * Math.cos(obj.userData.angle);
                obj.position.z = obj.userData.distance * Math.sin(obj.userData.angle);
            }
            
            // Rotação do planeta anão
            obj.rotation.y += obj.userData.rotationSpeed * scaledDelta;
            
            // Atualizar posição das luas, se houver
            if (obj.children) {
                updateMoons(obj, scaledDelta);
            }
        }
    }
} 