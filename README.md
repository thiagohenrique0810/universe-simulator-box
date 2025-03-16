# Simulador do Sistema Solar

Um simulador 3D interativo do Sistema Solar desenvolvido com Three.js, que permite explorar os planetas, suas órbitas, e outros corpos celestes em um ambiente web imersivo.

## Funcionalidades

- **Corpos Celestes Detalhados**: Representação 3D do Sol, planetas, luas, planetas anões e objetos do Cinturão de Kuiper com texturas realistas
- **Sistema de Órbitas**: Órbitas planetárias com animação baseadas nas leis de Kepler
- **Rotação Planetária**: Rotação dos planetas em torno de seu próprio eixo
- **Anéis Planetários**: Visualização detalhada dos anéis de Saturno e representação dos anéis mais tênues de Urano e Netuno com suas respectivas inclinações
- **Cinturão de Asteroides**: Simulação do cinturão de asteroides entre Marte e Júpiter
- **Cinturão de Kuiper**: Representação de Plutão e outros planetas anões como Éris, Makemake e Haumea
- **Nuvem de Oort**: Visualização da região mais externa do Sistema Solar com cometas de longo período
- **Física Avançada**: Simulação de gravidade real entre corpos celestes baseada na Lei da Gravitação Universal
- **Sistema de Colisões**: Detecção e resposta realista a colisões entre corpos celestes com efeitos visuais
- **Efeitos Atmosféricos**: Visualização de atmosferas planetárias com shaders de dispersão realistas
- **Padrões Climáticos**: Sistema dinâmico de nuvens e padrões climáticos para planetas com atmosfera
- **Iluminação Realista**: Sistema de luz e sombra com oclusão e projeções realistas
- **Controle de Câmera**: Navegação livre com zoom, rotação e movimento panorâmico
- **Foco em Objetos**: Clique duplo em qualquer corpo celeste para focar a câmera nele
- **Painel de Informações**: Dados detalhados sobre cada planeta e corpo celeste
- **Tour Guiado**: Sequência interativa de visitas a cada planeta com informações educativas
- **Chuvas de Meteoros**: Simulação de eventos periódicos de meteoros com sistema de partículas
- **Cometas**: Visualização de cometas com núcleo, coma e cauda, afetados pelo vento solar
- **Controles de Simulação**: Ajuste da velocidade da simulação (parar, normal, rápido)
- **Captura de Screenshots**: Funcionalidade para salvar imagens da simulação
- **Comparação de Planetas**: Ferramenta visual para comparar tamanhos e dados entre diferentes corpos celestes
- **Sistema de Busca**: Busca rápida por planetas, luas e outros objetos celestes
- **Modo Noturno**: Interface com opção de modo escuro e filtro de luz azul ajustável
- **Ferramenta de Medição**: Sistema para medir distâncias entre corpos celestes com cálculos de tempo de viagem
- **Simulador de Missões Espaciais**: Visualização de trajetórias de missões espaciais históricas e planejadas, com sistema interativo para:
  - Ativar/desativar missões individualmente com um clique
  - Visualizar todas as missões simultaneamente ou ocultar todas
  - Acessar detalhes completos das missões (objetivos, conquistas, datas) com clique duplo
  - Filtrar missões por categoria (todas, ativas, planejadas)
  - Integração com o sistema de visibilidade global para gerenciar eficientemente a renderização
  - Mostrar/ocultar o painel de missões espaciais através do controle de visibilidade
- **Modo VR**: Suporte para exploração em realidade virtual com dispositivos compatíveis com WebXR
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
- Hardware com capacidade para renderização 3D (recomendado para melhor experiência)
- Dispositivo de realidade virtual compatível com WebXR (opcional para modo VR)

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
  - Inicie o tour guiado para uma experiência educativa
  - Ative o modo VR para exploração imersiva (se disponível)
  - Use a ferramenta de medição para calcular distâncias entre objetos
  - Explore missões espaciais históricas e suas trajetórias

- **Controle de Missões Espaciais**:
  - Ative/desative a visualização de missões no painel de controle de visibilidade
  - Clique em uma missão na lista para mostrar/ocultar sua trajetória
  - Use o duplo clique em uma missão para abrir o painel de detalhes
  - Use o seletor de categoria para filtrar missões por tipo (todas/ativas/planejadas)
  - Use os botões "Mostrar Todas as Missões" ou "Ocultar Todas as Missões" para controle rápido
  - Consulte detalhes como data de lançamento, veículo, velocidade, objetivos e conquistas
  - Acesse links para sites oficiais das missões através do painel de detalhes

## Estrutura do Projeto

- `index.html`: Página principal
- `styles.css`: Estilos da página
- `js/app.js`: Código principal do simulador (arquivo coordenador)
- `js/modules/`: Pasta contendo os módulos do sistema
  - `data/`: Dados do sistema
    - `planet-data.js`: Dados físicos dos planetas
    - `planet-info.js`: Informações descritivas dos planetas
    - `exoplanet-data.js`: Dados sobre exoplanetas
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
    - `meteor-showers.js`: Sistema de chuvas de meteoros
    - `comets.js`: Sistema de cometas
    - `oort-cloud.js`: Simulação da Nuvem de Oort
    - `space-missions.js`: Sistema de simulação de missões espaciais
    - `exoplanet-system.js`: Sistema de visualização de exoplanetas
  - `ui/`: Componentes de interface
    - `info-panel.js`: Painel de informações dos planetas
    - `planet-selection.js`: Sistema de seleção de planetas
    - `simulation-controls.js`: Controles de simulação e visibilidade
    - `planet-comparison.js`: Sistema de comparação de planetas
    - `tour-guide.js`: Sistema de tour guiado
    - `measurement-tool.js`: Ferramenta de medição de distâncias
    - `space-missions-panel.js`: Painel de missões espaciais
    - `oort-cloud-controls.js`: Controles para a Nuvem de Oort
    - `exoplanet-panel.js`: Interface para exoplanetas
    - `main-menu.js`: Menu principal do simulador
  - `vr/`: Componentes de realidade virtual
    - `vr-system.js`: Sistema principal de VR
    - `vr-instructions.js`: Instruções para modo VR
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
- **WebXR**: API para experiências de realidade virtual
- **Shaders**: Programas GLSL para efeitos visuais avançados

## Detalhes de Implementação

- **Escala Ajustada**: Os tamanhos dos planetas e distâncias foram ajustados para melhor visualização (não estão em escala real)
- **Iluminação Realista**: O Sol funciona como fonte de luz para todo o sistema, com sombras dinâmicas
- **Física Gravitacional**: Implementação da Lei da Gravitação Universal de Newton para interações entre corpos
- **Efeitos Atmosféricos**: Uso de shaders personalizados para simular dispersão atmosférica
- **Sistemas Climáticos**: Simulação de nuvens e padrões climáticos para planetas com atmosfera
- **Cinturão de Kuiper**: Representação dos planetas anões e objetos trans-netunianos
- **Nuvem de Oort**: Simulação da região mais externa do Sistema Solar com cometas de longo período
- **Detecção de Colisões**: Sistema físico de colisões entre corpos celestes com efeitos visuais
- **Otimização de Desempenho**: Uso de técnicas como instanciação para o cinturão de asteroides
- **Texturas de Alta Qualidade**: Imagens detalhadas para cada planeta e lua
- **Skybox da Via Láctea**: Fundo estelar imersivo para simular o espaço profundo
- **Física Simplificada**: Órbitas baseadas nas leis de Kepler para movimento realista
- **Modo VR**: Experiência imersiva otimizada para dispositivos de realidade virtual

## Próximas Melhorias Planejadas

- Completar sistema de exoplanetas com mais sistemas planetários conhecidos
- Adicionar linha do tempo completa de exploração espacial com marcos históricos
- Implementar sistema de níveis de detalhe (LOD) para melhor desempenho
- Criar sistema de cache de texturas para gerenciamento otimizado de memória
- Adicionar configurações de qualidade ajustáveis (baixa, média, alta)
- Otimizar para dispositivos móveis com controles touch intuitivos
- Criar versão PWA (Progressive Web App) com funcionamento offline
- Adicionar modo de visualização em escala real
- Implementar captura de vídeos além dos screenshots existentes
- Expandir o sistema de missões espaciais com:
  - Visualização detalhada dos instrumentos científicos de cada sonda
  - Animação de eventos-chave de cada missão (aterrissagens, sobrevoos)
  - Sistema de previsão de posições futuras com base em dados reais
  - Linha do tempo interativa com marcos importantes de cada missão
  - Indicadores visuais do estado atual de comunicação com cada sonda

## Atualizações Recentes

- **Sistema de Missões Espaciais Aprimorado**: 
  - Melhorias na sincronização entre controles e visualização 3D
  - Correções no sistema de visibilidade das missões
  - Integração entre painéis de controle e sistema de visibilidade global
  - Otimização do gerenciamento de ativação/desativação de missões
  - Aprimoramento da estrutura de código com separação clara de responsabilidades
