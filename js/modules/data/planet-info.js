/**
 * Dados informativos sobre os planetas
 * Contém descrições, tipos, composição e outras informações para exibição
 */
export const PLANET_INFO = {
    sol: {
        nome: "Sol",
        tipo: "Estrela anã amarela",
        composicao: "Hidrogênio (73%), Hélio (25%), outros elementos (2%)",
        temperatura: "5.500°C (superfície), 15.000.000°C (núcleo)",
        diametro: "1.392.700 km (109x Terra)",
        massa: "1,989 × 10^30 kg (333.000x Terra)",
        gravidade: "274 m/s² (28x Terra)",
        distanciaTerra: "149,6 milhões km (1 UA)",
        descricao: "O Sol é a estrela central do Sistema Solar, responsável pela energia que sustenta a vida na Terra. É uma estrela de tamanho médio que existe há cerca de 4,6 bilhões de anos e está na metade de sua vida."
    },
    mercurio: {
        nome: "Mercúrio",
        tipo: "Planeta rochoso",
        composicao: "Rocha e metal, grande núcleo de ferro",
        temperatura: "-173°C a 427°C",
        diametro: "4.879 km (0,38x Terra)",
        orbita: "88 dias terrestres",
        rotacao: "59 dias terrestres",
        distanciaSol: "57,9 milhões km (0,39 UA)",
        descricao: "Mercúrio é o menor e mais interno planeta do Sistema Solar, com a menor massa. Sua superfície é fortemente craterizada, semelhante à Lua, devido à falta de atmosfera para protegê-lo de impactos."
    },
    venus: {
        nome: "Vênus",
        tipo: "Planeta rochoso",
        composicao: "Dióxido de carbono, nitrogênio",
        temperatura: "462°C (média)",
        diametro: "12.104 km (0,95x Terra)",
        orbita: "225 dias terrestres",
        rotacao: "243 dias terrestres (retrógrada)",
        distanciaSol: "108,2 milhões km (0,72 UA)",
        descricao: "Vênus é conhecido como o gêmeo da Terra devido ao seu tamanho e massa similares, mas tem uma atmosfera densa de CO2 que causa um intenso efeito estufa, tornando-o o planeta mais quente do Sistema Solar."
    },
    terra: {
        nome: "Terra",
        tipo: "Planeta rochoso",
        composicao: "Nitrogênio, oxigênio, água",
        temperatura: "15°C (média)",
        diametro: "12.742 km",
        orbita: "365,25 dias",
        rotacao: "24 horas",
        distanciaSol: "149,6 milhões km (1 UA)",
        descricao: "A Terra é o único planeta conhecido a abrigar vida. Sua atmosfera e campos magnéticos protegem a superfície da radiação solar prejudicial, e 71% de sua superfície é coberta por água."
    },
    marte: {
        nome: "Marte",
        tipo: "Planeta rochoso",
        composicao: "Dióxido de carbono, nitrogênio, argônio",
        temperatura: "-63°C (média)",
        diametro: "6.779 km (0,53x Terra)",
        orbita: "687 dias terrestres",
        rotacao: "24,6 horas",
        distanciaSol: "227,9 milhões km (1,52 UA)",
        descricao: "Marte é conhecido como o planeta vermelho devido ao óxido de ferro em sua superfície. Possui a maior montanha do Sistema Solar (Olympus Mons) e o maior cânion (Valles Marineris)."
    },
    jupiter: {
        nome: "Júpiter",
        tipo: "Gigante gasoso",
        composicao: "Hidrogênio, hélio",
        temperatura: "-108°C (topo das nuvens)",
        diametro: "139.820 km (11x Terra)",
        orbita: "11,86 anos terrestres",
        rotacao: "9,93 horas",
        distanciaSol: "778,5 milhões km (5,2 UA)",
        descricao: "Júpiter é o maior planeta do Sistema Solar. Sua característica mais conhecida é a Grande Mancha Vermelha, uma tempestade gigante que existe há pelo menos 400 anos. Possui 79 luas conhecidas."
    },
    saturno: {
        nome: "Saturno",
        tipo: "Gigante gasoso",
        composicao: "Hidrogênio, hélio",
        temperatura: "-138°C (topo das nuvens)",
        diametro: "116.460 km (9,14x Terra)",
        orbita: "29,46 anos terrestres",
        rotacao: "10,7 horas",
        distanciaSol: "1,43 bilhões km (9,5 UA)",
        descricao: "Saturno é famoso por seus imensos anéis, compostos principalmente de partículas de gelo e rocha. É o segundo maior planeta do Sistema Solar e possui 82 luas conhecidas, incluindo Titan, a única lua com atmosfera densa."
    },
    urano: {
        nome: "Urano",
        tipo: "Gigante de gelo",
        composicao: "Hidrogênio, hélio, metano (dá a cor azul)",
        temperatura: "-195°C (média)",
        diametro: "50.724 km (4x Terra)",
        orbita: "84 anos terrestres",
        rotacao: "17,2 horas (retrógrada)",
        distanciaSol: "2,87 bilhões km (19,2 UA)",
        descricao: "Urano é único por seu eixo de rotação extremamente inclinado, quase paralelo ao plano de sua órbita, fazendo-o rolar como uma bola. Possui um sistema de anéis tênues e 27 luas conhecidas."
    },
    netuno: {
        nome: "Netuno",
        tipo: "Gigante de gelo",
        composicao: "Hidrogênio, hélio, metano (dá a cor azul)",
        temperatura: "-214°C (média)",
        diametro: "49.244 km (3,9x Terra)",
        orbita: "165 anos terrestres",
        rotacao: "16,1 horas",
        distanciaSol: "4,5 bilhões km (30 UA)",
        descricao: "Netuno é o planeta mais distante do Sol. Possui ventos mais fortes que qualquer outro planeta, chegando a 2.100 km/h. Sua característica mais notável é a Grande Mancha Escura, uma tempestade semelhante à de Júpiter."
    }
}; 