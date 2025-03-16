# Simulador do Sistema Solar

Um simulador 3D interativo do Sistema Solar desenvolvido com Three.js, que permite explorar os planetas, suas órbitas, e outros corpos celestes em um ambiente web imersivo.

## Funcionalidades

- **Corpos Celestes Detalhados**: Representação 3D do Sol, planetas, luas, planetas anões e objetos do Cinturão de Kuiper com texturas realistas
- **Sistema de Órbitas**: Órbitas planetárias com animação baseadas nas leis de Kepler
- **Rotação Planetária**: Rotação dos planetas em torno de seu próprio eixo
- **Anéis Planetários**: Visualização detalhada dos anéis de Saturno, Urano e Netuno com texturas e inclinações realistas
- **Cinturão de Asteroides**: Simulação do cinturão de asteroides entre Marte e Júpiter
- **Cinturão de Kuiper**: Representação de Plutão e outros planetas anões como Éris, Makemake e Haumea
- **Física Avançada**: Simulação de gravidade real entre corpos celestes baseada na Lei da Gravitação Universal
- **Sistema de Colisões**: Detecção e resposta realista a colisões entre corpos celestes com efeitos visuais
- **Efeitos Atmosféricos**: Visualização de atmosferas planetárias com shaders de dispersão realistas
- **Padrões Climáticos**: Sistema dinâmico de nuvens e padrões climáticos para planetas com atmosfera
- **Iluminação Realista**: Sistema de luz e sombra com oclusão e projeções realistas
- **Controle de Câmera**: Navegação livre com zoom, rotação e movimento panorâmico
- **Foco em Objetos**: Clique duplo em qualquer corpo celeste para focar a câmera nele
- **Painel de Informações**: Dados detalhados sobre cada planeta e corpo celeste
- **Controles de Simulação**: Ajuste da velocidade da simulação (parar, normal, rápido)
- **Captura de Screenshots**: Funcionalidade para salvar imagens da simulação
- **Comparação de Planetas**: Ferramenta visual para comparar tamanhos e dados entre diferentes corpos celestes
- **Sistema de Busca**: Busca rápida por planetas, luas e outros objetos celestes
- **Modo Noturno**: Interface com opção de modo escuro e filtro de luz azul ajustável
- **Controles de Visibilidade**: Ative/desative a visualização de:
  - Linhas de órbita
  - Estrelas de fundo
  - Via Láctea (skybox)
  - Cinturão de asteroides
  - Anel do cinturão (representação visual)
  - Anéis planetários
  - Efeitos atmosféricos
  - Sombras e eclipses
- **Música de Fundo**: Trilha sonora espacial para maior imersão
- **Design Responsivo**: Adaptação a diferentes tamanhos de tela

## Requisitos

- Navegador moderno com suporte a WebGL (Chrome, Firefox, Edge, Safari)
- Conexão com a internet para carregar as bibliotecas externas

## Como Executar

1. Clone este repositório:
```
git clone https://github.com/seu-usuario/universe-simulator-box.git
cd universe-simulator-box
```

2. Inicie um servidor local:
   - Usando Python:
     ```
     python -m http.server
     ```
   - Ou usando Node.js:
     ```
     npx serve
     ```
   - Ou qualquer outro servidor HTTP estático

3. Acesse o simulador no navegador:
   - Abra `http://localhost:8000` (ou a porta fornecida pelo seu servidor)

## Controles

- **Navegação**:
  - Clique e arraste para rotacionar a visualização
  - Scroll do mouse para zoom
  - Clique com o botão direito e arraste para movimentar a cena
  - Clique duplo em um objeto para focar a câmera nele

- **Painel de Controle**:
  - Ajuste a velocidade da simulação com o slider ou botões predefinidos
  - Ative/desative elementos visuais usando as caixas de seleção
  - Use o sistema de busca para localizar rapidamente corpos celestes
  - Capture screenshots da simulação com o botão dedicado
  - Alterne entre modo claro e escuro para melhor conforto visual
  - Use o modo de comparação para visualizar diferenças entre planetas

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
    - `stars.js`: Sistema de estrelas de fundo e skybox da Via Láctea
    - `gravity-physics.js`: Sistema de simulação física gravitacional
    - `collisions.js`: Sistema de detecção e resposta a colisões
    - `atmosphere.js`: Sistema de efeitos atmosféricos
    - `climate.js`: Sistema de padrões climáticos
    - `lighting.js`: Sistema de iluminação realista
  - `ui/`: Componentes de interface
    - `info-panel.js`: Painel de informações dos planetas
    - `planet-selection.js`: Sistema de seleção de planetas
    - `simulation-controls.js`: Controles de simulação e visibilidade
    - `planet-comparison.js`: Sistema de comparação de planetas
  - `audio/`: Sistema de áudio
    - `background-music.js`: Gerenciamento da música de fundo
- `textures/`: Texturas dos planetas, luas e Via Láctea
- `sounds/`: Arquivos de áudio para a experiência sonora
- `img/`: Imagens e recursos para a interface
  - `favicon.js`: Sistema de favicon dinâmico

## Tecnologias Utilizadas

- **Three.js**: Biblioteca JavaScript para renderização 3D
- **HTML5/CSS3**: Estrutura e estilo da página
- **JavaScript (ES6 Modules)**: Lógica de programação e interatividade
- **OrbitControls**: Controle de câmera para Three.js
- **WebGL**: Renderização gráfica acelerada por hardware
- **Shaders**: Programas GLSL para efeitos visuais avançados

## Detalhes de Implementação

- **Escala Ajustada**: Os tamanhos dos planetas e distâncias foram ajustados para melhor visualização (não estão em escala real)
- **Iluminação Realista**: O Sol funciona como fonte de luz para todo o sistema, com sombras dinâmicas
- **Física Gravitacional**: Implementação da Lei da Gravitação Universal de Newton para interações entre corpos
- **Efeitos Atmosféricos**: Uso de shaders personalizados para simular dispersão atmosférica
- **Sistemas Climáticos**: Simulação de nuvens e padrões climáticos para planetas com atmosfera
- **Cinturão de Kuiper**: Representação dos planetas anões e objetos trans-netunianos
- **Detecção de Colisões**: Sistema físico de colisões entre corpos celestes com efeitos visuais
- **Otimização de Desempenho**: Uso de técnicas como instanciação para o cinturão de asteroides
- **Texturas de Alta Qualidade**: Imagens detalhadas para cada planeta e lua
- **Skybox da Via Láctea**: Fundo estelar imersivo para simular o espaço profundo
- **Física Simplificada**: Órbitas baseadas nas leis de Kepler para movimento realista

## Próximas Melhorias Planejadas

- Implementar tour guiado pelo sistema solar
- Adicionar simulação de chuvas de meteoros e eventos astronômicos
- Implementar a Nuvem de Oort com cometas de longo período
- Adicionar suporte para dispositivos móveis com controles touch
- Implementar modo VR para experiência imersiva
- Criar ferramenta de medição para distâncias entre corpos celestes
- Adicionar simulador de missões espaciais
- Expandir o sistema para incluir exoplanetas conhecidos
