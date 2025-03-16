/**
 * Dados de Exoplanetas
 * Contém informações sobre sistemas de exoplanetas conhecidos
 */

/**
 * Catálogo de Exoplanetas
 * Contém dados sobre sistemas exoplanetários conhecidos e suas características
 */

// Fator de conversão de unidades astronômicas para unidades de simulação
export const auToSimUnits = (au) => au * 5; // 1 AU = 5 unidades na simulação

// Fator de conversão de massas terrestres para massas solares
export const earthMassesToSolarMasses = (earthMasses) => earthMasses / 332900;

// Catálogo de sistemas de exoplanetas
export const EXOPLANET_SYSTEMS = [
    {
        id: 'trappist1',
        name: 'TRAPPIST-1',
        description: 'Sistema com 7 planetas do tamanho da Terra, vários na zona habitável',
        distance: 39.6, // Anos-luz da Terra
        starType: 'M', // Anã vermelha ultra-fria
        starRadius: 0.121, // Raio solar
        starTemperature: 2566, // Kelvin
        starMass: 0.089, // Massas solares
        discoveryYear: 2016,
        discoveryMethod: 'Trânsito',
        habitableZone: {
            inner: 0.022, // AU
            outer: 0.063  // AU
        },
        planets: [
            {
                id: 'trappist1b',
                name: 'TRAPPIST-1 b',
                radius: 1.086, // Raios terrestres
                mass: 1.374, // Massas terrestres
                semiMajorAxis: 0.01111, // AU
                orbitalPeriod: 1.51087, // Dias
                eccentricity: 0.00622,
                inclination: 89.56, // Graus
                discoveryYear: 2016,
                color: 0xaa8866, // Cor para representação visual
                description: 'Planeta rochoso mais interno, muito quente para ter água líquida',
                habitable: false,
                atmosphere: 'Possivelmente fina, rica em dióxido de carbono'
            },
            {
                id: 'trappist1c',
                name: 'TRAPPIST-1 c',
                radius: 1.056,
                mass: 1.308,
                semiMajorAxis: 0.01521,
                orbitalPeriod: 2.42182,
                eccentricity: 0.00654,
                inclination: 89.7,
                discoveryYear: 2016,
                color: 0xcc8855,
                description: 'Segundo planeta mais interno, também muito quente',
                habitable: false,
                atmosphere: 'Possivelmente atmosfera densa e quente'
            },
            {
                id: 'trappist1d',
                name: 'TRAPPIST-1 d',
                radius: 0.772,
                mass: 0.388,
                semiMajorAxis: 0.02144,
                orbitalPeriod: 4.04961,
                eccentricity: 0.00837,
                inclination: 89.89,
                discoveryYear: 2016,
                color: 0x8899aa,
                description: 'Menor planeta do sistema, na borda interna da zona habitável',
                habitable: true,
                atmosphere: 'Possivelmente contém água, mas pode estar em estado de estufa'
            },
            {
                id: 'trappist1e',
                name: 'TRAPPIST-1 e',
                radius: 0.918,
                mass: 0.692,
                semiMajorAxis: 0.02817,
                orbitalPeriod: 6.09961,
                eccentricity: 0.00510,
                inclination: 89.736,
                discoveryYear: 2016,
                color: 0x3366aa,
                description: 'Considerado o mais promissor para habitabilidade, similar à Terra',
                habitable: true,
                atmosphere: 'Potencialmente densa, possibilidade de água líquida'
            },
            {
                id: 'trappist1f',
                name: 'TRAPPIST-1 f',
                radius: 1.045,
                mass: 1.039,
                semiMajorAxis: 0.03710,
                orbitalPeriod: 9.20669,
                eccentricity: 0.01007,
                inclination: 89.719,
                discoveryYear: 2016,
                color: 0x2288cc,
                description: 'Na zona habitável, potencialmente com água líquida em sua superfície',
                habitable: true,
                atmosphere: 'Possivelmente rica em água, talvez um mundo oceânico'
            },
            {
                id: 'trappist1g',
                name: 'TRAPPIST-1 g',
                radius: 1.127,
                mass: 1.321,
                semiMajorAxis: 0.04510,
                orbitalPeriod: 12.35294,
                eccentricity: 0.00208,
                inclination: 89.721,
                discoveryYear: 2016,
                color: 0x2266bb,
                description: 'Na borda externa da zona habitável, mais frio que os anteriores',
                habitable: true,
                atmosphere: 'Possivelmente densa, pode ter grandes quantidades de água ou gelo'
            },
            {
                id: 'trappist1h',
                name: 'TRAPPIST-1 h',
                radius: 0.755,
                mass: 0.326,
                semiMajorAxis: 0.05960,
                orbitalPeriod: 18.76762,
                eccentricity: 0.00567,
                inclination: 89.796,
                discoveryYear: 2017,
                color: 0x1144aa,
                description: 'Planeta mais externo, provavelmente congelado',
                habitable: false,
                atmosphere: 'Provavelmente fria, possível presença de gelo'
            }
        ]
    },
    {
        id: 'proxima',
        name: 'Proxima Centauri',
        description: 'Estrela mais próxima do Sol, com pelo menos dois planetas confirmados',
        distance: 4.25, // Anos-luz
        starType: 'M5.5Ve', // Anã vermelha
        starRadius: 0.1542, // Raio solar
        starTemperature: 3042, // Kelvin
        starMass: 0.1221, // Massas solares
        discoveryYear: 2016,
        discoveryMethod: 'Velocidade Radial',
        habitableZone: {
            inner: 0.032, // AU
            outer: 0.092  // AU
        },
        planets: [
            {
                id: 'proximab',
                name: 'Proxima Centauri b',
                radius: 1.08, // Raio terrestre estimado
                mass: 1.07, // Massas terrestres
                semiMajorAxis: 0.0485, // AU
                orbitalPeriod: 11.186, // Dias
                eccentricity: 0.11,
                inclination: 0, // Desconhecida
                discoveryYear: 2016,
                color: 0x5599aa,
                description: 'Planeta potencialmente habitável na zona habitável',
                habitable: true,
                atmosphere: 'Desconhecida, mas essencial para habitabilidade'
            },
            {
                id: 'proximac',
                name: 'Proxima Centauri c',
                radius: 1.5, // Raio terrestre estimado
                mass: 7, // Massas terrestres
                semiMajorAxis: 1.489, // AU
                orbitalPeriod: 1928, // Dias
                eccentricity: 0.04,
                inclination: 133, // Graus
                discoveryYear: 2019,
                color: 0x3377cc,
                description: 'Super-Terra distante, provavelmente fria',
                habitable: false,
                atmosphere: 'Provavelmente densa, possivelmente parecida com Netuno'
            },
            {
                id: 'proximad',
                name: 'Proxima Centauri d',
                radius: 0.8, // Estimativa
                mass: 0.26, // Estimativa
                semiMajorAxis: 0.02885,
                orbitalPeriod: 5.122,
                eccentricity: 0.04,
                discoveryYear: 2022,
                color: 0xaa7755,
                description: 'Planeta sub-terrestre muito próximo da estrela',
                habitable: false,
                atmosphere: 'Provavelmente fina ou ausente devido à proximidade com a estrela'
            }
        ]
    },
    {
        id: 'kepler90',
        name: 'Kepler-90',
        description: 'Sistema com 8 planetas, similar ao nosso Sistema Solar em número de planetas',
        distance: 2545, // Anos-luz
        starType: 'G', // Tipo solar
        starRadius: 1.2, // Raio solar
        starTemperature: 6080, // Kelvin
        starMass: 1.13, // Massas solares
        discoveryYear: 2013,
        discoveryMethod: 'Trânsito',
        habitableZone: {
            inner: 0.8, // AU aproximado
            outer: 1.7  // AU aproximado
        },
        planets: [
            {
                id: 'kepler90b',
                name: 'Kepler-90 b',
                radius: 1.31, // Raios terrestres
                mass: 2.27, // Massas terrestres, estimada
                semiMajorAxis: 0.074, // AU
                orbitalPeriod: 7.0, // Dias
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0xddaa77,
                description: 'Planeta rochoso interno, muito quente',
                habitable: false
            },
            {
                id: 'kepler90c',
                name: 'Kepler-90 c',
                radius: 1.18,
                mass: 1.8, // Estimada
                semiMajorAxis: 0.089,
                orbitalPeriod: 8.7,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0xccaa88,
                description: 'Planeta rochoso, próximo à estrela',
                habitable: false
            },
            {
                id: 'kepler90i',
                name: 'Kepler-90 i',
                radius: 1.32,
                mass: 2.3, // Estimada
                semiMajorAxis: 0.210,
                orbitalPeriod: 14.4,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2017,
                color: 0xaaaaaa,
                description: 'Pequeno planeta rochoso descoberto com IA pelo Google',
                habitable: false
            },
            {
                id: 'kepler90d',
                name: 'Kepler-90 d',
                radius: 2.88,
                mass: 8.0, // Estimada
                semiMajorAxis: 0.32,
                orbitalPeriod: 59.7,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0x99aacc,
                description: 'Possível mini-Netuno, gasoso',
                habitable: false
            },
            {
                id: 'kepler90e',
                name: 'Kepler-90 e',
                radius: 2.67,
                mass: 6.5, // Estimada
                semiMajorAxis: 0.42,
                orbitalPeriod: 91.9,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0x7799cc,
                description: 'Planeta semelhante a Netuno',
                habitable: false
            },
            {
                id: 'kepler90f',
                name: 'Kepler-90 f',
                radius: 2.89,
                mass: 8.0, // Estimada
                semiMajorAxis: 0.48,
                orbitalPeriod: 124.9,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0x5588cc,
                description: 'Planeta semelhante a Netuno',
                habitable: false
            },
            {
                id: 'kepler90g',
                name: 'Kepler-90 g',
                radius: 8.13,
                mass: 66.0, // Estimada
                semiMajorAxis: 0.71,
                orbitalPeriod: 210.6,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0x4477bb,
                description: 'Planeta gigante, semelhante a Júpiter',
                habitable: false
            },
            {
                id: 'kepler90h',
                name: 'Kepler-90 h',
                radius: 11.32,
                mass: 120.0, // Estimada
                semiMajorAxis: 1.01,
                orbitalPeriod: 331.6,
                eccentricity: 0.01, // Estimada
                discoveryYear: 2013,
                color: 0x3366aa,
                description: 'Planeta gigante externo, maior que Júpiter',
                habitable: false
            }
        ]
    },
    {
        id: 'hr8799',
        name: 'HR 8799',
        description: 'Sistema com 4 exoplanetas gigantes diretamente fotografados',
        distance: 129, // Anos-luz
        starType: 'A', // Estrela jovem, tipo A
        starRadius: 1.44, // Raio solar
        starTemperature: 7430, // Kelvin
        starMass: 1.47, // Massas solares
        discoveryYear: 2008,
        discoveryMethod: 'Imagem Direta',
        planets: [
            {
                id: 'hr8799e',
                name: 'HR 8799 e',
                radius: 12, // Raios de Júpiter, estimativa
                mass: 7.4, // Massas de Júpiter, estimativa
                semiMajorAxis: 16.4, // AU
                orbitalPeriod: 45, // Anos, estimativa
                eccentricity: 0.15, // Estimada
                discoveryYear: 2010,
                color: 0xb07050,
                description: 'Planeta gigante gasoso, mais interno',
                habitable: false,
                atmosphere: 'Nuvens de poeira e ferro, detecções de monóxido de carbono'
            },
            {
                id: 'hr8799d',
                name: 'HR 8799 d',
                radius: 10, // Estimativa
                mass: 7, // Massas de Júpiter
                semiMajorAxis: 27, // AU
                orbitalPeriod: 100, // Anos, estimativa
                eccentricity: 0.10, // Estimada
                discoveryYear: 2008,
                color: 0xa06040,
                description: 'Planeta gigante gasoso',
                habitable: false
            },
            {
                id: 'hr8799c',
                name: 'HR 8799 c',
                radius: 10, // Estimativa
                mass: 7, // Massas de Júpiter
                semiMajorAxis: 42.9, // AU
                orbitalPeriod: 190, // Anos, estimativa
                eccentricity: 0.05, // Estimada
                discoveryYear: 2008,
                color: 0x905030,
                description: 'Planeta gigante gasoso, atmosfera com metano, água e monóxido de carbono',
                habitable: false
            },
            {
                id: 'hr8799b',
                name: 'HR 8799 b',
                radius: 9, // Estimativa
                mass: 5, // Massas de Júpiter
                semiMajorAxis: 71, // AU
                orbitalPeriod: 460, // Anos, estimativa
                eccentricity: 0.03, // Estimada
                discoveryYear: 2008,
                color: 0x804020,
                description: 'Planeta gigante gasoso mais externo',
                habitable: false
            }
        ]
    },
    {
        id: 'toi700',
        name: 'TOI-700',
        description: 'Sistema com planeta do tamanho da Terra na zona habitável',
        distance: 101.5, // Anos-luz
        starType: 'M', // Anã vermelha
        starRadius: 0.42, // Raio solar
        starTemperature: 3480, // Kelvin
        starMass: 0.416, // Massas solares
        discoveryYear: 2020,
        discoveryMethod: 'Trânsito (TESS)',
        habitableZone: {
            inner: 0.12, // AU aproximado
            outer: 0.25  // AU aproximado
        },
        planets: [
            {
                id: 'toi700b',
                name: 'TOI-700 b',
                radius: 1.01, // Raios terrestres
                mass: 1.07, // Massas terrestres, estimada
                semiMajorAxis: 0.0637, // AU
                orbitalPeriod: 9.977, // Dias
                eccentricity: 0.1, // Estimada
                discoveryYear: 2020,
                color: 0xaaaaaa,
                description: 'Planeta terrestre, mais quente que a zona habitável',
                habitable: false
            },
            {
                id: 'toi700c',
                name: 'TOI-700 c',
                radius: 2.63, // Raios terrestres
                mass: 7.48, // Massas terrestres, estimada
                semiMajorAxis: 0.0925, // AU
                orbitalPeriod: 16.051, // Dias
                eccentricity: 0.1, // Estimada
                discoveryYear: 2020,
                color: 0x99aaaa,
                description: 'Planeta sub-Netuniano, na borda interna da zona habitável',
                habitable: false
            },
            {
                id: 'toi700d',
                name: 'TOI-700 d',
                radius: 1.19, // Raios terrestres
                mass: 1.72, // Massas terrestres, estimada
                semiMajorAxis: 0.163, // AU
                orbitalPeriod: 37.425, // Dias
                eccentricity: 0.1, // Estimada
                discoveryYear: 2020,
                color: 0x3399cc,
                description: 'Planeta na zona habitável, potencialmente com água líquida',
                habitable: true,
                atmosphere: 'Desconhecida, alvo importante para futuros estudos'
            },
            {
                id: 'toi700e',
                name: 'TOI-700 e',
                radius: 0.95, // Raios terrestres
                mass: 0.95, // Massas terrestres, estimada
                semiMajorAxis: 0.132, // AU
                orbitalPeriod: 27.4, // Dias
                eccentricity: 0.1, // Estimada
                discoveryYear: 2023,
                color: 0x4488cc,
                description: 'Planeta do tamanho da Terra na zona habitável da estrela',
                habitable: true,
                atmosphere: 'Desconhecida, alvo para investigação pelo JWST'
            }
        ]
    }
];

// Informações gerais sobre exoplanetas
export const EXOPLANET_INFO = {
    discoveryMethods: [
        {
            id: 'transit',
            name: 'Método do Trânsito',
            description: 'Detecta exoplanetas observando a diminuição no brilho de uma estrela quando um planeta passa na frente dela. É o método que descobriu mais exoplanetas até hoje.',
            image: 'img/methods/transit.jpg'
        },
        {
            id: 'radialVelocity',
            name: 'Velocidade Radial',
            description: 'Detecta exoplanetas medindo pequenas oscilações na velocidade de uma estrela causadas pela atração gravitacional de planetas orbitando-a.',
            image: 'img/methods/radial_velocity.jpg'
        },
        {
            id: 'directImaging',
            name: 'Imageamento Direto',
            description: 'Observa exoplanetas diretamente usando técnicas avançadas para bloquear a luz das suas estrelas hospedeiras.',
            image: 'img/methods/direct_imaging.jpg'
        },
        {
            id: 'microlensing',
            name: 'Microlente Gravitacional',
            description: 'Detecta exoplanetas observando como a gravidade de um sistema estelar com planetas curva e amplifica a luz de uma estrela distante atrás dele.',
            image: 'img/methods/microlensing.jpg'
        }
    ],
    habitabilityFactors: [
        {
            factor: 'Zona Habitável',
            description: 'Região ao redor de uma estrela onde a temperatura permite que água líquida exista na superfície de um planeta.'
        },
        {
            factor: 'Tipo de Estrela',
            description: 'Estrelas como nosso Sol (tipo G) são consideradas ideais para vida, enquanto anãs vermelhas podem expor planetas a flares intensos.'
        },
        {
            factor: 'Massa Planetária',
            description: 'Planetas com massa similar à Terra têm maior probabilidade de manter atmosferas adequadas para vida.'
        },
        {
            factor: 'Atmosfera',
            description: 'A composição atmosférica, incluindo gases de efeito estufa, é crucial para manter temperaturas estáveis.'
        },
        {
            factor: 'Campo Magnético',
            description: 'Um campo magnético protege a superfície e atmosfera planetária da radiação estelar e ventos solares.'
        },
        {
            factor: 'Rotação Planetária',
            description: 'Períodos de rotação moderados ajudam a distribuir calor ao redor do planeta e evitar extremos climáticos.'
        }
    ],
    exoplanetTypes: [
        {
            type: 'Super-Terras',
            description: 'Planetas rochosos maiores que a Terra, mas menores que Netuno (até cerca de 10 massas terrestres).'
        },
        {
            type: 'Mini-Netunos',
            description: 'Planetas gasosos menores que Netuno, geralmente com 2-4 raios terrestres e massas entre 2-20 massas terrestres.'
        },
        {
            type: 'Júpiteres Quentes',
            description: 'Gigantes gasosos que orbitam muito próximos às suas estrelas, com temperaturas extremamente altas.'
        },
        {
            type: 'Júpiteres Frios',
            description: 'Gigantes gasosos similares a Júpiter que orbitam longe de suas estrelas.'
        },
        {
            type: 'Anãs Marrons',
            description: 'Objetos intermediários entre planetas e estrelas, com massa insuficiente para sustentar fusão nuclear estável.'
        },
        {
            type: 'Planetas Oceânicos',
            description: 'Planetas cobertos por oceanos globais profundos, com pouca ou nenhuma terra exposta.'
        },
        {
            type: 'Planetas de Lava',
            description: 'Planetas rochosos extremamente quentes onde a superfície é coberta parcial ou totalmente por magma derretido.'
        }
    ],
    interestingFacts: [
        'Já foram descobertos mais de 5.000 exoplanetas confirmados até 2023.',
        'Estima-se que existam bilhões de planetas na Via Láctea, possivelmente mais planetas do que estrelas.',
        'O exoplaneta mais próximo da Terra é Proxima Centauri b, a apenas 4,2 anos-luz de distância.',
        'Alguns exoplanetas orbitam múltiplas estrelas, assim como Tatooine da saga Star Wars.',
        'Há exoplanetas onde chove ferro líquido ou vidro, com ventos que ultrapassam 5.000 km/h.',
        'O exoplaneta WASP-12b está sendo "devorado" por sua estrela e desaparecerá completamente em cerca de 10 milhões de anos.',
        'O exoplaneta TrES-2b é o planeta mais escuro conhecido, refletindo menos de 1% da luz que recebe.',
        'HD 106906 b é um exoplaneta que orbita sua estrela a uma distância de 650 UA, cerca de 20 vezes a distância de Netuno ao Sol.',
        'O sistema Kepler-90 contém oito planetas, tornando-o o primeiro sistema exoplanetário descoberto com tantos planetas quanto nosso Sistema Solar.'
    ]
};

/**
 * Calcula a distância orbital em UA com base no período orbital em dias
 * usando a Terceira Lei de Kepler
 * @param {Number} orbitalPeriodDays - Período orbital em dias
 * @param {Number} starMass - Massa da estrela em massas solares
 * @returns {Number} - Distância orbital em UA
 */
export function calculateSemiMajorAxis(orbitalPeriodDays, starMass) {
    // Terceira Lei de Kepler: a³ = P² * (M_estrela / M_sol)
    // Onde P é o período em anos, a é o semi-eixo maior em UA
    const orbitalPeriodYears = orbitalPeriodDays / 365.25;
    return Math.pow(orbitalPeriodYears * orbitalPeriodYears * starMass, 1/3);
} 