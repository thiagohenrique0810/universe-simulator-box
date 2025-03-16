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
        distance: 13,
        semiMajorAxis: 13,
        eccentricity: 0.205,
        orbitalSpeed: 0.016,
        rotationSpeed: 0.004,
        inclination: 7.0,
        orbitColor: 0xffffff
    },
    venus: {
        radius: 0.34,
        textureUrl: 'textures/venus.jpg',
        distance: 17,
        semiMajorAxis: 17,
        eccentricity: 0.007,
        orbitalSpeed: 0.0065,
        rotationSpeed: 0.002,
        inclination: 3.4,
        orbitColor: 0x997766
    },
    terra: {
        radius: 0.36,
        textureUrl: 'textures/earth.jpg',
        distance: 20,
        semiMajorAxis: 20,
        eccentricity: 0.017,
        orbitalSpeed: 0.004,
        rotationSpeed: 0.02,
        inclination: 0.0,
        orbitColor: 0x3399ff,
        satellites: [
            {
                name: 'lua',
                radius: 0.1,
                textureUrl: 'textures/moon.jpg',
                distance: 1.0,
                orbitalSpeed: 0.03,
                rotationSpeed: 0.01,
                eccentricity: 0.0549
            }
        ]
    },
    marte: {
        radius: 0.19,
        textureUrl: 'textures/mars.jpg',
        distance: 25,
        semiMajorAxis: 25,
        eccentricity: 0.094,
        orbitalSpeed: 0.0021,
        rotationSpeed: 0.018,
        inclination: 1.9,
        orbitColor: 0xdd4422,
        satellites: [
            {
                name: 'fobos',
                radius: 0.02,
                color: 0xaaaaaa,
                distance: 0.5,
                orbitalSpeed: 0.04,
                rotationSpeed: 0.01,
                eccentricity: 0.015
            },
            {
                name: 'deimos',
                radius: 0.01,
                color: 0x888888,
                distance: 0.7,
                orbitalSpeed: 0.02,
                rotationSpeed: 0.008,
                eccentricity: 0.0005
            }
        ]
    },
    jupiter: {
        radius: 1.2,
        textureUrl: 'textures/jupiter.jpg',
        distance: 46,
        semiMajorAxis: 46,
        eccentricity: 0.049,
        orbitalSpeed: 0.0003,
        rotationSpeed: 0.04,
        inclination: 1.3,
        orbitColor: 0xbbaa88,
        satellites: [
            {
                name: 'io',
                radius: 0.08,
                color: 0xdbb963,
                distance: 1.8,
                orbitalSpeed: 0.015,
                rotationSpeed: 0.005,
                eccentricity: 0.0041
            },
            {
                name: 'europa',
                radius: 0.07,
                color: 0xb5a7a0,
                distance: 2.2,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.005,
                eccentricity: 0.0094
            },
            {
                name: 'ganimedes',
                radius: 0.12,
                color: 0x8e8373,
                distance: 2.7,
                orbitalSpeed: 0.006,
                rotationSpeed: 0.003,
                eccentricity: 0.0013
            },
            {
                name: 'calisto',
                radius: 0.11,
                color: 0x3a3a3a,
                distance: 3.3,
                orbitalSpeed: 0.004,
                rotationSpeed: 0.002,
                eccentricity: 0.0074
            }
        ]
    },
    saturno: {
        radius: 0.96,
        textureUrl: 'textures/saturn.jpg',
        distance: 62,
        semiMajorAxis: 62,
        eccentricity: 0.057,
        orbitalSpeed: 0.0001,
        rotationSpeed: 0.01,
        inclination: 2.5,
        orbitColor: 0xddcc88,
        rings: true,
        satellites: [
            {
                name: 'titan',
                radius: 0.14,
                color: 0xf5c466,
                distance: 2.5,
                orbitalSpeed: 0.008,
                rotationSpeed: 0.003,
                eccentricity: 0.0288
            },
            {
                name: 'encélado',
                radius: 0.04,
                color: 0xe8e8e8,
                distance: 2.0,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.0047
            }
        ]
    },
    urano: {
        radius: 0.62,
        textureUrl: 'textures/uranus.jpg',
        distance: 88,
        semiMajorAxis: 88,
        eccentricity: 0.046,
        orbitalSpeed: 0.00004,
        rotationSpeed: 0.03,
        inclination: 0.8,
        orbitColor: 0x88ccff,
        satellites: [
            {
                name: 'titania',
                radius: 0.05,
                color: 0x999999,
                distance: 1.5,
                orbitalSpeed: 0.007,
                rotationSpeed: 0.003,
                eccentricity: 0.0011
            },
            {
                name: 'oberon',
                radius: 0.04,
                color: 0x777777,
                distance: 1.8,
                orbitalSpeed: 0.005,
                rotationSpeed: 0.002,
                eccentricity: 0.0014
            }
        ]
    },
    netuno: {
        radius: 0.60,
        textureUrl: 'textures/neptune.jpg',
        distance: 110,
        semiMajorAxis: 110,
        eccentricity: 0.011,
        orbitalSpeed: 0.00002,
        rotationSpeed: 0.032,
        inclination: 1.8,
        orbitColor: 0x3355ff,
        satellites: [
            {
                name: 'tritao',
                radius: 0.08,
                color: 0xd1ccc1,
                distance: 1.8,
                orbitalSpeed: 0.01,
                rotationSpeed: 0.004,
                eccentricity: 0.000016
            }
        ]
    }
}; 