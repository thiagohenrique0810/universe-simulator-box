/**
 * Dados dos planetas do sistema solar
 * Contém informações sobre tamanho, distância, velocidade de rotação, etc.
 */
export const PLANET_DATA = {
    sol: {
        radius: 2.2,
        textureUrl: 'textures/sun.jpg',
        distance: 0,
        orbitalSpeed: 0,
        rotationSpeed: 0.004,
        emissive: 0xffff00
    },
    mercurio: {
        radius: 0.14,
        textureUrl: 'textures/mercury.jpg',
        distance: 20,
        semiMajorAxis: 20,
        eccentricity: 0.205,
        orbitalSpeed: 0.016,
        rotationSpeed: 0.004,
        inclination: 7.0,
        orbitColor: 0xffffff
    },
    venus: {
        radius: 0.34,
        textureUrl: 'textures/venus.jpg',
        distance: 30,
        semiMajorAxis: 30,
        eccentricity: 0.007,
        orbitalSpeed: 0.0065,
        rotationSpeed: 0.002,
        inclination: 3.4,
        orbitColor: 0x997766
    },
    terra: {
        radius: 0.36,
        textureUrl: 'textures/earth.jpg',
        distance: 40,
        semiMajorAxis: 40,
        eccentricity: 0.017,
        orbitalSpeed: 0.004,
        rotationSpeed: 0.02,
        inclination: 0.0,
        orbitColor: 0x3399ff,
        satellites: [
            {
                name: 'lua',
                radius: 0.098,
                textureUrl: 'textures/moon.jpg',
                distance: 1.2,
                orbitalSpeed: 0.03,
                rotationSpeed: 0.01,
                eccentricity: 0.0549
            }
        ]
    },
    marte: {
        radius: 0.19,
        textureUrl: 'textures/mars.jpg',
        distance: 55,
        semiMajorAxis: 55,
        eccentricity: 0.094,
        orbitalSpeed: 0.0021,
        rotationSpeed: 0.018,
        inclination: 1.9,
        orbitColor: 0xdd4422,
        satellites: [
            {
                name: 'fobos',
                radius: 0.004,
                color: 0xaaaaaa,
                distance: 0.4,
                orbitalSpeed: 0.04,
                rotationSpeed: 0.01,
                eccentricity: 0.015
            },
            {
                name: 'deimos',
                radius: 0.002,
                color: 0x888888,
                distance: 0.6,
                orbitalSpeed: 0.02,
                rotationSpeed: 0.008,
                eccentricity: 0.0005
            }
        ]
    },
    jupiter: {
        radius: 1.2,
        textureUrl: 'textures/jupiter.jpg',
        distance: 100,
        semiMajorAxis: 100,
        eccentricity: 0.049,
        orbitalSpeed: 0.0003,
        rotationSpeed: 0.04,
        inclination: 1.3,
        orbitColor: 0xbbaa88,
        satellites: [
            {
                name: 'io',
                radius: 0.033,
                color: 0xdbb963,
                distance: 1.5,
                orbitalSpeed: 0.015,
                rotationSpeed: 0.005,
                eccentricity: 0.0041
            },
            {
                name: 'europa',
                radius: 0.028,
                color: 0xb5a7a0,
                distance: 2.4,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.005,
                eccentricity: 0.0094
            },
            {
                name: 'ganimedes',
                radius: 0.042,
                color: 0x8e8373,
                distance: 3.8,
                orbitalSpeed: 0.006,
                rotationSpeed: 0.003,
                eccentricity: 0.0013
            },
            {
                name: 'calisto',
                radius: 0.038,
                color: 0x3a3a3a,
                distance: 6.7,
                orbitalSpeed: 0.004,
                rotationSpeed: 0.002,
                eccentricity: 0.0074
            },
            {
                name: 'amalteia',
                radius: 0.006,
                color: 0xaa5533,
                distance: 1.1,
                orbitalSpeed: 0.02,
                rotationSpeed: 0.006,
                eccentricity: 0.003
            }
        ]
    },
    saturno: {
        radius: 0.96,
        textureUrl: 'textures/saturn.jpg',
        distance: 150,
        semiMajorAxis: 150,
        eccentricity: 0.057,
        orbitalSpeed: 0.0001,
        rotationSpeed: 0.01,
        inclination: 2.5,
        orbitColor: 0xddcc88,
        rings: true,
        satellites: [
            {
                name: 'titan',
                radius: 0.04,
                color: 0xf5c466,
                distance: 5.0,
                orbitalSpeed: 0.008,
                rotationSpeed: 0.003,
                eccentricity: 0.0288
            },
            {
                name: 'encélado',
                radius: 0.008,
                color: 0xe8e8e8,
                distance: 1.6,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.0047
            },
            {
                name: 'mimas',
                radius: 0.004,
                color: 0xdddddd,
                distance: 1.2,
                orbitalSpeed: 0.012,
                rotationSpeed: 0.005,
                eccentricity: 0.0196
            },
            {
                name: 'tétis',
                radius: 0.01,
                color: 0xcccccc,
                distance: 2.0,
                orbitalSpeed: 0.009,
                rotationSpeed: 0.004,
                eccentricity: 0.0001
            },
            {
                name: 'dione',
                radius: 0.01,
                color: 0xdddddd,
                distance: 2.5,
                orbitalSpeed: 0.007,
                rotationSpeed: 0.003,
                eccentricity: 0.0022
            },
            {
                name: 'reia',
                radius: 0.014,
                color: 0xd8d8d8,
                distance: 3.5,
                orbitalSpeed: 0.006,
                rotationSpeed: 0.003,
                eccentricity: 0.0012
            },
            {
                name: 'jápeto',
                radius: 0.014,
                color: 0x8a8a8a,
                distance: 9.0,
                orbitalSpeed: 0.004,
                rotationSpeed: 0.002,
                eccentricity: 0.0283
            }
        ]
    },
    urano: {
        radius: 0.62,
        textureUrl: 'textures/uranus.jpg',
        distance: 200,
        semiMajorAxis: 200,
        eccentricity: 0.046,
        orbitalSpeed: 0.00004,
        rotationSpeed: 0.03,
        inclination: 0.8,
        orbitColor: 0x88ccff,
        rings: true,
        satellites: [
            {
                name: 'titania',
                radius: 0.012,
                color: 0x999999,
                distance: 2.7,
                orbitalSpeed: 0.007,
                rotationSpeed: 0.003,
                eccentricity: 0.0011
            },
            {
                name: 'oberon',
                radius: 0.012,
                color: 0x777777,
                distance: 3.6,
                orbitalSpeed: 0.005,
                rotationSpeed: 0.002,
                eccentricity: 0.0014
            },
            {
                name: 'ariel',
                radius: 0.009,
                color: 0xbbbbbb,
                distance: 1.9,
                orbitalSpeed: 0.008,
                rotationSpeed: 0.004,
                eccentricity: 0.0012
            },
            {
                name: 'umbriel',
                radius: 0.009,
                color: 0x555555,
                distance: 2.3,
                orbitalSpeed: 0.007,
                rotationSpeed: 0.003,
                eccentricity: 0.0039
            },
            {
                name: 'miranda',
                radius: 0.005,
                color: 0xaaaaaa,
                distance: 1.3,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.005,
                eccentricity: 0.0013
            }
        ]
    },
    netuno: {
        radius: 0.59,
        textureUrl: 'textures/neptune.jpg',
        distance: 240,
        semiMajorAxis: 240,
        eccentricity: 0.009,
        orbitalSpeed: 0.00003,
        rotationSpeed: 0.04,
        inclination: 1.77,
        orbitColor: 0x2233ff,
        rings: true,
        satellites: [
            {
                name: 'tritão',
                radius: 0.02,
                color: 0xcccccc,
                distance: 2.8,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.000016
            },
            {
                name: 'proteu',
                radius: 0.004,
                color: 0x999999,
                distance: 1.1,
                orbitalSpeed: 0.012,
                rotationSpeed: 0.005,
                eccentricity: 0.0005
            },
            {
                name: 'nereida',
                radius: 0.003,
                color: 0xaaaaaa,
                distance: 14.0,
                orbitalSpeed: 0.006,
                rotationSpeed: 0.003,
                eccentricity: 0.7512
            },
            {
                name: 'larissa',
                radius: 0.002,
                color: 0x888888,
                distance: 0.8,
                orbitalSpeed: 0.015,
                rotationSpeed: 0.006,
                eccentricity: 0.0014
            }
        ]
    },
    
    // Cinturão de Kuiper
    cinturaoKuiper: {
        nome: "Cinturão de Kuiper",
        descrição: "Região além da órbita de Netuno que contém diversos objetos pequenos, principalmente compostos por gelo.",
        // Não incluímos raio ou textura, pois este será apenas um container para os planetas anões
        planetasAnoes: [
            {
                id: "plutao",
                nome: "Plutão",
                radius: 0.17,
                color: 0xDAC3AD,
                distance: 300,
                semiMajorAxis: 395,
                eccentricity: 0.2488,
                orbitalSpeed: 0.000022,
                rotationSpeed: 0.01,
                inclination: 17.16,
                orbitColor: 0xaa66aa,
                tipo: "Planeta Anão",
                composicao: "Rocha e gelo (nitrogênio, metano, monóxido de carbono)",
                temperatura: "-230°C (média)",
                diametro: "2.376 km",
                orbita: "248 anos terrestres",
                rotacao: "6,4 dias (retrógrada)",
                distanciaSol: "5,9 bilhões km (39,5 UA)",
                descricao: "Plutão foi considerado o nono planeta do Sistema Solar até 2006, quando foi reclassificado como planeta anão. Possui cinco luas conhecidas, sendo Caronte a maior. A sonda New Horizons revelou uma superfície surpreendentemente diversa, com montanhas de gelo, planícies de nitrogênio congelado e possíveis glaciares em movimento.",
                satellites: [
                    {
                        name: 'caronte',
                        radius: 0.09,
                        color: 0xdddddd,
                        distance: 0.5,
                        orbitalSpeed: 0.02,
                        rotationSpeed: 0.02,
                        eccentricity: 0.0022
                    }
                ]
            },
            {
                id: "eris",
                nome: "Éris",
                radius: 0.18,
                color: 0xeeeeee,
                distance: 510,
                semiMajorAxis: 680,
                eccentricity: 0.44,
                orbitalSpeed: 0.000015,
                rotationSpeed: 0.008,
                inclination: 44.0,
                orbitColor: 0xbb88bb,
                tipo: "Planeta Anão",
                composicao: "Rocha e gelo (metano)",
                temperatura: "-243°C (estimada)",
                diametro: "2.326 km",
                orbita: "558 anos terrestres",
                rotacao: "25,9 horas (estimada)",
                distanciaSol: "14,5 bilhões km (96,4 UA) no afélio",
                descricao: "Éris é o segundo maior planeta anão conhecido e tem massa ligeiramente superior à de Plutão. Sua descoberta em 2005 foi um dos fatores que levaram à redefinição do termo 'planeta' e à criação da categoria de planetas anões. Possui uma lua conhecida chamada Disnomia.",
                satellites: [
                    {
                        name: 'disnomia',
                        radius: 0.025,
                        color: 0xcccccc,
                        distance: 0.4,
                        orbitalSpeed: 0.02,
                        rotationSpeed: 0.01,
                        eccentricity: 0.01
                    }
                ]
            },
            {
                id: "makemake",
                nome: "Makemake",
                radius: 0.14,
                color: 0xffccaa,
                distance: 460,
                semiMajorAxis: 460,
                eccentricity: 0.16,
                orbitalSpeed: 0.000018,
                rotationSpeed: 0.009,
                inclination: 29.0,
                orbitColor: 0xcc9988,
                tipo: "Planeta Anão",
                composicao: "Rocha e gelo (metano, etano)",
                temperatura: "-240°C (estimada)",
                diametro: "1.430 km",
                orbita: "306 anos terrestres",
                rotacao: "22,5 horas",
                distanciaSol: "7,8 bilhões km (52,3 UA) no afélio",
                descricao: "Makemake é um dos maiores objetos do Cinturão de Kuiper. Possui uma superfície avermelhada devido aos hidrocarbonetos complexos criados pela radiação cósmica. Foi descoberto em 2005 e nomeado em homenagem ao deus da criação da mitologia Rapa Nui da Ilha de Páscoa."
            },
            {
                id: "haumea",
                nome: "Haumea",
                radius: 0.14,
                color: 0xffffff,
                distance: 434,
                semiMajorAxis: 434,
                eccentricity: 0.19,
                orbitalSpeed: 0.00002,
                rotationSpeed: 0.08, // Rotação extremamente rápida
                inclination: 28.19,
                orbitColor: 0xaaaaaa,
                tipo: "Planeta Anão",
                composicao: "Rocha e gelo cristalino",
                temperatura: "-241°C (estimada)",
                diametro: "1.632 × 1.178 km (formato de elipsoide)",
                orbita: "285 anos terrestres",
                rotacao: "3,9 horas (extremamente rápida)",
                distanciaSol: "7,6 bilhões km (51 UA) no afélio",
                descricao: "Haumea é notável por sua forma alongada, resultado de sua rotação extremamente rápida. É o único planeta anão conhecido a possuir um anel. Tem duas luas, Hi'iaka e Namaka, e sua superfície é composta principalmente por gelo cristalino. Foi descoberto em 2004 e nomeado em homenagem à deusa haviana da fertilidade.",
                hasRings: true,
                satellites: [
                    {
                        name: "hi'iaka",
                        radius: 0.02,
                        color: 0xffffff,
                        distance: 0.3,
                        orbitalSpeed: 0.02,
                        rotationSpeed: 0.01,
                        eccentricity: 0.05
                    },
                    {
                        name: "namaka",
                        radius: 0.01,
                        color: 0xeeeeee,
                        distance: 0.4,
                        orbitalSpeed: 0.015,
                        rotationSpeed: 0.01,
                        eccentricity: 0.15
                    }
                ]
            }
        ]
    }
}; 