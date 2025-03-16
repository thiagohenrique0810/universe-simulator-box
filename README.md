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
- `js/app.js`: Código principal do simulador
- `js/textures-downloader.js`: Informações para download das texturas
- `textures/`: Pasta para armazenar as texturas dos planetas (precisa ser criada)

## Tecnologias Utilizadas

- **Three.js**: Para renderização 3D e manipulação da cena
- **HTML5/CSS3**: Para a estrutura e estilo da página
- **JavaScript**: Para a lógica de programação e interatividade

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
