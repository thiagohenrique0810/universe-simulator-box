# Plano de Melhorias para o Simulador do Sistema Solar

Este documento lista as melhorias planejadas para o simulador do sistema solar, organizadas por categorias. As melhorias serão implementadas gradualmente, e este documento servirá como um registro do progresso.

## Como usar este documento

- [ ] Marque as caixas ao concluir cada melhoria
- [ ] Adicione notas ou observações relevantes após implementar
- [ ] Priorize as melhorias de acordo com a complexidade e impacto

## 1. Sistema de Física Avançado

- [x] **Gravidade Real**: Implementar simulação de gravidade entre corpos celestes
  - [x] Adicionar cálculos baseados na Lei da Gravitação Universal
  - [x] Permitir que órbitas sejam afetadas pela gravidade de outros corpos
  - [x] Implementar perturbações orbitais realistas

- [x] **Sistema de Colisões**: Adicionar detecção e resposta a colisões
  - [x] Implementar colisões entre corpos celestes
  - [x] Adicionar efeitos visuais para colisões (explosões, fragmentação)
  - [x] Permitir que colisões afetem órbitas e trajetórias

- [x] **Parâmetros Ajustáveis**: Permitir que o usuário modifique parâmetros físicos
  - [x] Adicionar controles para ajustar massa dos corpos celestes
  - [x] Implementar controle de intensidade da gravidade
  - [x] Adicionar opção para desativar/ativar física realista

## 2. Modo Educacional

- [ ] **Tour Guiado**: Criar um modo de tour pelo sistema solar
  - [ ] Implementar sequência de visitas a cada planeta com informações
  - [ ] Adicionar narração ou texto explicativo para cada corpo celeste
  - [ ] Criar transições suaves entre os pontos do tour

- [ ] **Fatos Científicos Interativos**: Exibir informações ao focar em corpos celestes
  - [ ] Criar sistema de cards informativos para cada planeta
  - [ ] Adicionar dados comparativos entre planetas
  - [ ] Incluir curiosidades e descobertas recentes

- [ ] **Linha do Tempo de Exploração**: Mostrar histórico de missões espaciais
  - [ ] Criar visualização cronológica de missões para cada planeta
  - [ ] Adicionar marcos importantes na exploração espacial
  - [ ] Incluir imagens históricas das missões

## 3. Fenômenos Astronômicos

- [ ] **Eclipses**: Simular eclipses solares e lunares
  - [ ] Implementar oclusão precisa da luz
  - [ ] Adicionar efeitos visuais para eclipses
  - [ ] Criar controle de tempo para visualizar eclipses específicos

- [ ] **Chuvas de Meteoros**: Adicionar eventos periódicos
  - [ ] Implementar sistema de partículas para meteoros
  - [ ] Criar calendário de eventos astronômicos
  - [ ] Adicionar opção para acelerar o tempo até o próximo evento

- [ ] **Cometas**: Implementar cometas com órbitas elípticas
  - [ ] Criar modelo visual realista para cometas (núcleo, coma, cauda)
  - [ ] Implementar órbitas de longo período
  - [ ] Adicionar efeitos de interação com o vento solar

## 4. Visualização Avançada

- [x] **Efeitos Atmosféricos**: Melhorar a representação visual das atmosferas
  - [x] Implementar shaders para dispersão atmosférica
  - [x] Criar efeitos de refração da luz através das atmosferas
  - [ ] Adicionar nuvens e padrões climáticos para planetas com atmosfera

- [x] **Anéis Planetários Expandidos**: Adicionar anéis para outros planetas
  - [x] Implementar anéis para Urano e Netuno
  - [x] Melhorar a textura e detalhes dos anéis de Saturno
  - [x] Adicionar divisões e variações de densidade nos anéis

- [x] **Iluminação Realista**: Aprimorar o sistema de luz e sombra
  - [x] Implementar oclusão de luz solar precisa
  - [x] Adicionar sombras projetadas entre corpos celestes
  - [x] Criar efeitos de luz refletida entre planetas próximos

## 5. Interatividade Expandida

- [ ] **Criação de Corpos Celestes**: Permitir que o usuário crie novos objetos
  - [ ] Implementar interface para definir parâmetros (tamanho, massa, órbita)
  - [ ] Adicionar opção para salvar configurações personalizadas
  - [ ] Criar biblioteca de texturas para objetos personalizados

- [ ] **Simulador de Missões**: Adicionar modo de planejamento de missões
  - [ ] Implementar cálculo de trajetórias e assistência gravitacional
  - [ ] Criar visualização de janelas de lançamento
  - [ ] Adicionar estimativas de tempo e recursos para missões

- [ ] **Ferramenta de Medição**: Implementar sistema para medir distâncias
  - [ ] Criar régua virtual entre corpos celestes
  - [ ] Adicionar cálculo de tempo de viagem com diferentes tecnologias
  - [ ] Implementar visualização de escala comparativa

## 6. Otimização de Desempenho

- [ ] **Níveis de Detalhe (LOD)**: Implementar redução de complexidade para objetos distantes
  - [ ] Criar geometrias simplificadas para visualização distante
  - [ ] Implementar transição suave entre níveis de detalhe
  - [ ] Otimizar renderização de grupos de objetos (asteroides)

- [ ] **Sistema de Cache de Texturas**: Melhorar o gerenciamento de memória
  - [ ] Implementar carregamento progressivo de texturas
  - [ ] Adicionar sistema de priorização baseado na visibilidade
  - [ ] Criar mecanismo de liberação de memória para texturas não utilizadas

- [ ] **Configurações de Qualidade**: Adicionar opções para ajustar desempenho
  - [ ] Criar presets de qualidade (baixa, média, alta)
  - [ ] Implementar controles para densidade de asteroides e estrelas
  - [ ] Adicionar opção para desativar efeitos visuais complexos

## 7. Compatibilidade Expandida

- [ ] **Suporte Mobile**: Otimizar para dispositivos móveis
  - [ ] Implementar controles touch intuitivos
  - [ ] Criar layout responsivo para diferentes tamanhos de tela
  - [ ] Otimizar desempenho para hardware móvel

- [ ] **Modo VR**: Adicionar suporte para realidade virtual
  - [ ] Implementar visualização estereoscópica
  - [ ] Criar controles específicos para VR
  - [ ] Otimizar escala e perspectiva para experiência imersiva

- [ ] **Versão PWA**: Criar aplicativo web progressivo
  - [ ] Implementar service workers para funcionamento offline
  - [ ] Adicionar manifesto para instalação como aplicativo
  - [ ] Otimizar armazenamento de assets para uso offline

## 8. Recursos Adicionais

- [ ] **Visualização em Escala Real**: Adicionar modo com proporções corretas
  - [ ] Implementar sistema de escala ajustável
  - [ ] Criar visualizações comparativas entre escala real e simulada
  - [ ] Adicionar informações sobre as distâncias reais

- [x] **Captura de Mídia**: Implementar sistema para salvar imagens e vídeos
  - [x] Adicionar botão para captura de screenshots
  - [ ] Implementar gravação de vídeos da simulação
  - [ ] Criar opções de compartilhamento direto

- [x] **Comparação de Planetas**: Adicionar ferramenta de comparação
  - [x] Criar visualização lado a lado de diferentes corpos celestes
  - [x] Implementar gráficos comparativos de propriedades físicas
  - [x] Adicionar tabelas de dados para comparação direta

## 9. Expansão do Sistema Solar

- [ ] **Cinturão de Kuiper**: Adicionar região além de Netuno
  - [ ] Implementar objetos principais como Plutão, Haumea, Makemake
  - [ ] Criar distribuição realista de objetos menores
  - [ ] Adicionar informações sobre esta região do sistema solar

- [ ] **Nuvem de Oort**: Implementar as bordas do sistema solar
  - [ ] Criar representação visual da nuvem
  - [ ] Adicionar cometas de longo período originários desta região
  - [ ] Implementar escala ajustável para visualizar esta região distante

- [ ] **Exoplanetas**: Adicionar sistemas planetários além do nosso
  - [ ] Implementar visualização de exoplanetas conhecidos
  - [ ] Criar modo de comparação com o Sistema Solar
  - [ ] Adicionar informações sobre métodos de detecção e características

## 10. Melhorias na Interface

- [ ] **Timeline Interativa**: Adicionar controle de tempo avançado
  - [ ] Implementar visualização de eventos passados e futuros
  - [ ] Criar marcadores para fenômenos astronômicos importantes
  - [ ] Adicionar controle preciso de velocidade da simulação

- [x] **Sistema de Busca**: Facilitar localização de objetos
  - [x] Implementar campo de busca com autocompletar
  - [x] Adicionar categorização de resultados
  - [x] Criar atalhos para objetos frequentemente buscados

- [x] **Modo Noturno**: Reduzir fadiga visual
  - [x] Implementar tema escuro para a interface
  - [x] Adicionar filtro de luz azul opcional
  - [x] Criar transição automática baseada no horário do sistema

---

## Registro de Implementações

### [16/03/2023] - [Captura de Screenshots]
**Descrição:** Implementada funcionalidade para capturar e salvar screenshots da simulação.
**Arquivos modificados:** js/modules/ui/simulation-controls.js, styles.css
**Observações:** Adicionado botão para captura de screenshots, com feedback visual para o usuário. Uma próxima melhoria relacionada pode ser a implementação de gravação de vídeos.

### [16/03/2023] - [Modo Noturno]
**Descrição:** Implementado sistema completo de modo noturno com opção de filtro de luz azul ajustável.
**Arquivos modificados:** js/modules/ui/simulation-controls.js, styles.css
**Observações:** O modo noturno altera cores da interface para reduzir o cansaço visual. O filtro de luz azul aplica um efeito de "cores quentes" à simulação, que pode ser ajustado conforme a preferência do usuário. As configurações são salvas no localStorage.

### [16/03/2023] - [Sistema de Busca]
**Descrição:** Implementado sistema de busca para localização rápida de objetos do sistema solar.
**Arquivos modificados:** js/modules/ui/simulation-controls.js, js/modules/ui/planet-selection.js, styles.css
**Observações:** O sistema permite buscar planetas, luas e planetas anões por nome ou tipo. Possui navegação por teclado (setas), feedback visual, e foca automaticamente no objeto selecionado. A implementação foi integrada com o sistema de seleção de objetos existente.

### [16/03/2023] - [Comparação de Planetas]
**Descrição:** Implementado sistema de comparação entre diferentes corpos celestes.
**Arquivos modificados:** js/modules/ui/planet-comparison.js, js/modules/ui/planet-selection.js, js/app.js, styles.css
**Observações:** O sistema permite selecionar até 3 objetos (planetas, luas ou planetas anões) e comparar suas propriedades físicas em uma tabela interativa. Destaca valores máximos e mínimos, exibe descrições e permite uma fácil visualização lado a lado de características como diâmetro, massa, distância do Sol, etc.

### [16/03/2023] - [Gravidade Real]
**Descrição:** Implementado sistema de física avançada com simulação de gravidade real entre corpos celestes.
**Arquivos modificados:** js/modules/core/gravity-physics.js, js/modules/ui/simulation-controls.js, js/app.js, styles.css
**Observações:** O sistema implementa a Lei da Gravitação Universal de Newton para simular as interações gravitacionais entre os corpos celestes. Inclui controles para ativar/desativar o sistema, ajustar a intensidade da gravidade e resetar as órbitas. As órbitas dos planetas e luas agora são afetadas pela influência gravitacional de outros corpos, criando perturbações orbitais realistas.

### [20/06/2023] - [Implementação do Cinturão de Kuiper]
**Descrição:** Adicionados objetos do Cinturão de Kuiper, incluindo os planetas anões Plutão, Éris, Makemake e Haumea.
**Arquivos modificados:** js/modules/data/planet-data.js, js/modules/core/celestial-bodies.js, js/modules/core/animation-loop.js, js/modules/ui/info-panel.js, js/modules/ui/planet-selection.js
**Observações:** Foram implementados os principais objetos do Cinturão de Kuiper com órbitas elípticas realistas e inclinações corretas. Plutão e os outros planetas anões foram adicionados com suas características reais e luas. O sistema de informações foi atualizado para exibir detalhes sobre esses objetos quando clicados.

### [21/06/2023] - [Efeitos Atmosféricos]
**Descrição:** Implementado sistema de efeitos atmosféricos para planetas com shaders de dispersão atmosférica.
**Arquivos modificados:** js/modules/core/atmosphere.js, js/modules/ui/controls/visibility-controls.js, js/app.js, styles.css
**Observações:** O sistema utiliza shaders personalizados para simular o efeito de dispersão atmosférica (scattering) em planetas com atmosfera. Cada planeta tem configurações específicas para cor e densidade da atmosfera. Foi adicionado controle na interface para ativar/desativar os efeitos atmosféricos. Este sistema cria um halo realista em torno dos planetas que muda dependendo da iluminação, tornando a simulação visualmente mais realista.

### [22/06/2023] - [Anéis Planetários Expandidos]
**Descrição:** Implementado sistema de anéis para Urano e Netuno, complementando os anéis existentes de Saturno.
**Arquivos modificados:** js/modules/core/celestial-bodies.js, js/modules/data/planet-data.js, js/modules/ui/controls/visibility-controls.js, js/app.js
**Observações:** Criada uma função genérica para gerar anéis planetários com propriedades customizáveis, aplicada a Urano e Netuno. Os anéis foram implementados com as inclinações corretas (97° para Urano, mostrando sua rotação única no sistema solar, e 29° para Netuno). Foi adicionado controle na interface para ativar/desativar a visibilidade dos anéis de cada planeta separadamente. Estas adições tornam a representação do sistema solar mais completa e realista.

### [23/06/2023] - [Sistema de Colisões]
**Descrição:** Implementado sistema de detecção e resposta a colisões entre corpos celestes.
**Arquivos modificados:** js/modules/core/collisions.js, js/modules/core/gravity-physics.js, js/modules/ui/controls/physics-controls.js, js/app.js
**Observações:** O sistema detecta colisões entre planetas, luas e planetas anões, aplicando respostas físicas baseadas em massa e velocidade. Adicionados efeitos visuais de explosão para as colisões usando sistemas de partículas. Os controles permitem ajustar a elasticidade das colisões e a intensidade das explosões. O sistema integra-se com o módulo de física gravitacional existente, permitindo que colisões afetem as órbitas dos corpos celestes de forma realista.

### [24/06/2023] - [Padrões Climáticos]
**Descrição:** Implementado sistema de padrões climáticos para planetas com atmosfera.
**Arquivos modificados:** js/modules/core/climate.js, js/modules/ui/controls/visibility-controls.js, js/app.js
**Observações:** Criado um sistema de nuvens dinâmicas e padrões climáticos para os planetas com atmosfera. O sistema utiliza shaders personalizados para simular a formação e movimento de nuvens, incluindo tempestades e variações sazonais. Os controles permitem ativar/desativar o sistema climático. Cada planeta tem configurações específicas com base em suas características reais, como a Grande Mancha Vermelha de Júpiter e as faixas características dos planetas gasosos.

### [26/06/2023] - [Iluminação Realista]
**Descrição:** Implementado sistema de iluminação realista com oclusão e sombras.
**Arquivos modificados:** js/modules/core/lighting.js, js/modules/ui/controls/lighting-controls.js, js/modules/ui/controls/visibility-controls.js, js/app.js
**Observações:** Criado um sistema completo de iluminação realista que inclui projeção de sombras entre corpos celestes, detecção de eclipses solares e lunares, e efeitos de oclusão de luz. O sistema utiliza tanto luzes pontuais quanto direcionais para criar sombras de alta qualidade. Foram adicionados controles para ajustar a intensidade da luz solar e ativar/desativar sombras e eclipses. O sistema também otimiza o desempenho atualizando as sombras apenas quando necessário e ajustando o frustum da câmera com base na posição do observador.

### [15/03/2024] - [Tour Guiado pelo Sistema Solar]
**Descrição:** Implementado sistema de tour guiado interativo pelos planetas e outros corpos celestes.
**Arquivos modificados:** js/modules/ui/tour-guide.js, js/app.js, styles.css
**Observações:** O tour guiado permite aos usuários explorar os diferentes corpos celestes do Sistema Solar de forma sequencial e educativa. O sistema inclui 15 paradas, desde o Sol até o Cinturão de Kuiper, com descrições informativas sobre cada corpo celeste. A interface apresenta controles para navegar entre as paradas (anterior/próximo), pausar o tour, ou encerrá-lo. A câmera realiza transições suaves entre os objetos, proporcionando uma experiência imersiva. Durante o tour, a velocidade de simulação é reduzida para permitir melhor visualização dos detalhes.

### [15/03/2024] - [Chuvas de Meteoros]
**Descrição:** Implementado sistema de simulação de chuvas de meteoros e eventos astronômicos.
**Arquivos modificados:** js/modules/core/meteor-showers.js, js/app.js, styles.css
**Observações:** O sistema de chuvas de meteoros permite visualizar as principais chuvas de meteoros que ocorrem durante o ano, como as Perseidas e Leônidas. Cada chuva possui características realistas, incluindo taxa de meteoros, cor, velocidade e ponto radiante específico. Os meteoros são renderizados com caudas utilizando sistemas de partículas para criar efeitos visuais impressionantes. A interface inclui um painel de eventos que mostra as próximas chuvas de meteoros, com opções para iniciar uma chuva específica ou meteoros aleatórios. O sistema está integrado ao ciclo de animação principal, permitindo a visualização dos meteoros em tempo real dentro do contexto do Sistema Solar.

### [15/03/2024] - [Nuvem de Oort e Cometas]
**Descrição:** Implementação da Nuvem de Oort e sistema de cometas de período longo
**Arquivos modificados:** js/app.js, js/modules/core/oort-cloud.js, js/modules/core/comets.js, js/modules/ui/oort-cloud-controls.js
**Observações:** Visualização da região mais externa do Sistema Solar e simulação de cometas com órbitas de longo período, incluindo efeitos visuais realistas de caudas de cometas

### [15/03/2024] - [Ferramenta de Medição]
**Descrição:** Ferramenta para medir distâncias entre corpos celestes
**Arquivos modificados:** js/app.js, js/modules/ui/measurement-tool.js
**Observações:** Oferece uma interface intuitiva para medir a distância entre quaisquer dois objetos no Sistema Solar, exibindo os resultados em unidades astronômicas (UA) e quilômetros (km). Inclui informações educativas como tempo de viagem da luz e tempo estimado de sondas espaciais para percorrer as distâncias medidas, facilitando a compreensão das escalas astronômicas.

---

## Prioridades para Próxima Iteração

1. Implementar a Nuvem de Oort com cometas de longo período
2. Criar ferramenta de medição para distâncias entre corpos celestes
3. Adicionar simulador de missões espaciais
4. Implementar modo VR para experiência imersiva
5. Expandir o sistema para incluir exoplanetas conhecidos 

# Melhorias Implementadas e Planejadas

## Implementadas

### Captura de Screenshots
- **Descrição**: Funcionalidade para capturar screenshots da simulação
- **Arquivos Modificados**: 
  - `js/app.js` - Adição da função de captura
  - `js/modules/ui/screenshot.js` - Criação do módulo de screenshot
- **Observações**: Permite salvar imagens da simulação em diferentes resoluções

### Modo Noturno
- **Descrição**: Sistema completo de modo noturno com filtro de luz azul ajustável
- **Arquivos Modificados**:
  - `js/app.js` - Integração do modo noturno
  - `js/modules/ui/night-mode.js` - Criação do módulo de modo noturno
  - `css/style.css` - Adição de estilos para o modo noturno
- **Observações**: Reduz o cansaço visual para uso noturno

### Sistema de Busca
- **Descrição**: Sistema para buscar objetos do sistema solar
- **Arquivos Modificados**:
  - `js/app.js` - Integração do sistema de busca
  - `js/modules/ui/search-system.js` - Criação do módulo de busca
- **Observações**: Facilita a localização de corpos celestes na simulação

### Comparação de Planetas
- **Descrição**: Sistema para comparar características de corpos celestes
- **Arquivos Modificados**:
  - `js/app.js` - Integração do sistema de comparação
  - `js/modules/ui/planet-comparison.js` - Criação do módulo de comparação
- **Observações**: Permite análise visual e de dados entre planetas

### Gravidade Real
- **Descrição**: Sistema avançado de física simulando gravidade real
- **Arquivos Modificados**:
  - `js/app.js` - Integração do sistema de física
  - `js/modules/physics/gravity-system.js` - Criação do módulo de física
- **Observações**: Movimentos orbitais precisos baseados em cálculos gravitacionais

### Implementação do Cinturão de Kuiper
- **Descrição**: Adição de objetos do Cinturão de Kuiper
- **Arquivos Modificados**:
  - `js/celestial-bodies.js` - Adição de objetos do Cinturão de Kuiper
  - `js/modules/core/kuiper-belt.js` - Criação do sistema do Cinturão de Kuiper
- **Observações**: Expande o sistema para incluir objetos transneptunianos

### Efeitos Atmosféricos
- **Descrição**: Adição de efeitos atmosféricos nos planetas
- **Arquivos Modificados**:
  - `js/celestial-bodies.js` - Adição de propriedades atmosféricas
  - `js/modules/effects/atmosphere.js` - Criação do sistema de atmosfera
- **Observações**: Visuais mais realistas para planetas com atmosfera

### Anéis Planetários Expandidos
- **Descrição**: Anéis para Urano e Netuno
- **Arquivos Modificados**:
  - `js/celestial-bodies.js` - Atualização dos dados de Urano e Netuno
  - `js/modules/effects/planetary-rings.js` - Expansão do sistema de anéis
- **Observações**: Maior precisão na representação dos anéis dos planetas gigantes

### Sistema de Colisões
- **Descrição**: Detecção e resposta a colisões
- **Arquivos Modificados**:
  - `js/app.js` - Integração do sistema de colisões
  - `js/modules/physics/collision-system.js` - Criação do sistema de colisões
- **Observações**: Permite simulações de impactos e seus efeitos

### Padrões Climáticos
- **Descrição**: Padrões climáticos para planetas com atmosfera
- **Arquivos Modificados**:
  - `js/modules/effects/climate-patterns.js` - Criação do sistema climático
  - `js/celestial-bodies.js` - Adição de propriedades climáticas
- **Observações**: Simulações dinâmicas de clima nos planetas

### Iluminação Realista
- **Descrição**: Sistema de iluminação com sombras e oclusão
- **Arquivos Modificados**:
  - `js/app.js` - Melhoria do sistema de iluminação
  - `js/modules/effects/lighting-system.js` - Criação do sistema de iluminação avançada
- **Observações**: Representação mais precisa da iluminação solar

### Tour Guiado pelo Sistema Solar
- **Descrição**: Sistema interativo de tour guiado explorando corpos celestes
- **Arquivos Modificados**:
  - `js/app.js` - Integração do sistema de tour
  - `js/modules/ui/tour-guide.js` - Criação do módulo de tour
- **Observações**: Experiência educativa com descrições detalhadas

### Chuvas de Meteoros
- **Descrição**: Simulação de chuvas de meteoros e eventos astronômicos
- **Arquivos Modificados**: 
  - `js/app.js` - Integração do sistema de meteoros
  - `js/modules/core/meteor-showers.js` - Criação do módulo de meteoros
- **Observações**: Visualização de eventos astronômicos reais com dados precisos

### Nuvem de Oort e Cometas
- **Descrição**: Implementação da Nuvem de Oort e sistema de cometas de período longo
- **Arquivos Modificados**:
  - `js/app.js` - Integração da Nuvem de Oort e cometas
  - `js/modules/core/oort-cloud.js` - Criação do módulo da Nuvem de Oort
  - `js/modules/core/comets.js` - Criação do sistema de cometas
  - `js/modules/ui/oort-cloud-controls.js` - Interface para controle da Nuvem de Oort
- **Observações**: Visualização da região mais externa do Sistema Solar e simulação de cometas com órbitas de longo período, incluindo efeitos visuais realistas de caudas de cometas

### Ferramenta de Medição
- **Descrição**: Ferramenta para medir distâncias entre corpos celestes
- **Arquivos Modificados**:
  - `js/app.js` - Integração da ferramenta de medição
  - `js/modules/ui/measurement-tool.js` - Criação do módulo de medição
- **Observações**: Oferece uma interface intuitiva para medir a distância entre quaisquer dois objetos no Sistema Solar, exibindo os resultados em unidades astronômicas (UA) e quilômetros (km). Inclui informações educativas como tempo de viagem da luz e tempo estimado de sondas espaciais para percorrer as distâncias medidas, facilitando a compreensão das escalas astronômicas.

## Planejadas para Próximas Versões

### Simulador de Missões Espaciais
- **Descrição**: Simulação de trajetórias de missões espaciais históricas e planejadas
- **Prioridade**: Alta
- **Observações**: Conteúdo educativo sobre exploração espacial

### Modo VR
- **Descrição**: Suporte para dispositivos de realidade virtual
- **Prioridade**: Média
- **Observações**: Experiência imersiva de exploração espacial

### Exoplanetas
- **Descrição**: Adição de sistemas de exoplanetas conhecidos
- **Prioridade**: Baixa
- **Observações**: Expandir além do Sistema Solar 