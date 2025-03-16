<<<<<<< HEAD
# universe-simulator-box
simulador do universo criado por IA, parecido com o universe sandbox porem mais simples e roda em qualquer dispositivo com javascript
=======
# Simulador do Sistema Solar

Um simulador 3D do Sistema Solar desenvolvido com Three.js, onde o usuário pode interagir com o cenário utilizando o cursor para rotacionar a visualização e observar a órbita dos planetas ao redor do Sol.

## Funcionalidades

- Representação 3D do Sol, planetas e lua da Terra
- Órbitas planetárias com animação
- Rotação dos planetas em torno de seu próprio eixo
- Anéis de Saturno
- Controle da câmera com o mouse para visualização de diferentes ângulos
- Campo de estrelas para simular o espaço profundo
- Iluminação realista com o Sol como fonte de luz

## Requisitos

- Navegador moderno com suporte a WebGL

## Como Executar

1. Clone este repositório:
```
git clone https://github.com/seu-usuario/simulador-sistema-solar.git
cd simulador-sistema-solar
```

2. Baixe as texturas:
   - Utilize as URLs fornecidas no arquivo `js/textures-downloader.js`
   - Baixe todas as imagens e salve-as na pasta `textures/`

3. Inicie um servidor local:
   - Você pode usar Python:
     ```
     python -m http.server
     ```
   - Ou instalar o `live-server` via npm:
     ```
     npm install -g live-server
     live-server
     ```

4. Acesse o simulador no navegador:
   - Abra `http://localhost:8000` (ou a porta fornecida pelo seu servidor)

## Controles

- Clique e arraste para rotacionar a visualização
- Scroll do mouse para zoom
- Clique com o botão direito e arraste para movimentar a cena

## Estrutura do Projeto

- `index.html`: Página principal
- `styles.css`: Estilos da página
- `js/app.js`: Código principal do simulador (arquivo coordenador)
- `js/modules/`: Pasta contendo os módulos do sistema
  - `data/`: Dados do sistema
    - `planet-data.js`: Dados físicos dos planetas
    - `planet-info.js`: Informações descritivas dos planetas
  - `core/`: Componentes principais
    - `renderer.js`: Configuração do sistema de renderização Three.js
    - `celestial-bodies.js`: Criação e gerenciamento de planetas e luas
    - `orbits.js`: Sistema de órbitas planetárias
    - `asteroids.js`: Sistema do cinturão de asteroides
    - `stars.js`: Sistema de estrelas de fundo
  - `ui/`: Componentes de interface
    - `info-panel.js`: Painel de informações dos planetas
    - `planet-selection.js`: Sistema de seleção de planetas
    - `simulation-controls.js`: Controles de simulação e visibilidade
  - `audio/`: Sistema de áudio
    - `background-music.js`: Gerenciamento da música de fundo
- `textures/`: Pasta para armazenar as texturas dos planetas (precisa ser criada)
- `sounds/`: Pasta com arquivos de áudio

## Tecnologias Utilizadas

- **Three.js**: Para renderização 3D e manipulação da cena
- **HTML5/CSS3**: Para a estrutura e estilo da página
- **JavaScript (ES6 Modules)**: Para a lógica de programação e interatividade
- **OrbitControls**: Para manipulação da câmera

## Referências de Texturas

As texturas utilizadas são fornecidas pelo [Solar System Scope](https://www.solarsystemscope.com/textures/) sob licença Creative Commons Attribution 4.0 International.

## Detalhes de Implementação

- Os tamanhos dos planetas e distâncias foram ajustados para melhor visualização (não estão em escala real)
- Algoritmos de iluminação e sombreamento são utilizados para criar efeitos realistas
- A animação utiliza `requestAnimationFrame` para otimização de desempenho
- Técnicas de otimização são aplicadas para garantir uma experiência suave

## Próximas Melhorias

- Adicionar mais satélites para outros planetas
- Implementar efeitos de cinturões de asteroides
- Adicionar informações detalhadas sobre cada corpo celeste
- Melhorar a renderização dos anéis de Saturno
- Adicionar controles para ajustar a velocidade da simulação
>>>>>>> 0a54b3c (criando estrutura inicial)
