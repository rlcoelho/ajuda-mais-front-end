# Front-end do sistema Ajuda Mais

O sistema **Ajuda Mais** tem o objetivo de gerenciar campanhas de ajuda humanitárias, cadastrando os dados dos abrigos - os locais onde as pessoas são acolhidas - e também os suprimentos que são recebidos nestes abrigos como doação. O problema que o **Ajuda Mais** procura resolver é saber quais abrigos precisam de determinado suprimento básico, por exemplo, água mineral, e quais abrigos, que, porventura tenham recedido uma grande quantidade de doação, neste exemplo, de água mineral, possam repassar esta doação excedente para o abrigo que necessita naquela semana.

Seguindo o exemplo, baseado no total de pessoas que estão no abrigo A nesta semana e sabendo via cadastro que cada pessoa consome 21 garrafas de água por semana, o **Ajuda Mais** calcula a quantidade de água que precisa ter em estoque, para saber se tem água suficiente ou não na semana. Supondo que precise de água e outro abrigo B tenha água excedente, esse repasse pode ser viabilizado.

Front-end desenvolvido no formato de Single Page Application (SPA) utilizando HTML, CSS, JavaScript e Bootstrap v5.3. 

O back-end que integra o sistema **Ajuda Mais** utiliza a linguagem Python com o microframework web Flask, framework ORM SQLAlchemy e banco de dados embutido SQLite3, além de outras bibliotecas do Python.

---
## Arquitetura e requisitos

É importante ter o Docker instalado, já que a aplicação foi concebida em uma arquitetura de microsserviços, com um componente principal (este frontend) e outra API, com possibilidade de expansão para a inserção de novas funcionalidades e consumo de APIs externas. Nesta versão, é utilizada a API VIACEP, acessível pelo link https://viacep.com.br/ws/01001000/json/ onde o 01001000 é o CEP consultado e trabalhado com as funções Javascript 'pesquisaCep()' e 'meuCallback()' além de outras funções para tratamento dos dados que estão presentes no arquivo 'js/scripts.js'.

### Diagrama do Ajuda Mais

![Diagrama dos componentes do Ajuda Mais]([URL da imagem](https://github.com/rlcoelho/ajuda-mais-front-end/blob/master/FluxogramaAjudarMais2.jpg))

---
## Como instalar utilizando o Docker

Este repositório possui um arquivo dockerfile correspondente ao frontend. Antes de criar o container Docker é necessário obter os demais repositórios, pois em cada um haverá um arquivo dockerfile necessário para o docker-compose, que irá orquestrar todos os containeres.

Nesta versão, apenas este back-end é obternecessário: https://github.com/rlcoelho/ajuda-mais-back-end.git 

Com os dois repositórios em sua máquina, crie uma estrutura de pasta, similar a esta:

- /MVP2
  - /mvp_back (onde você irá clonar o https://github.com/rlcoelho/ajuda-mais-back-end.git ) 
  - /mvp_front (onde você irá clonar o https://github.com/rlcoelho/ajuda-mais-front-end.git ) 
  - docker-compose.yml ( disponível em: https://github.com/rlcoelho/ajuda-mais-front-end.git )

Se desejar outra estrutura de pastas, você pode editar o arquivo docker-compose.yml para os locais que desejar, apenas localize os termos "build" e substitua os contextos pelas suas pastas.

Com tudo pronto basta acessar a pasta onde está o docker-compose.yml via terminal e, com o docker desktop em execução, rodar o seguinte comando:

`docker-compose up --build`

O esperado é que o back-end rode em localhost na porta 5000: `http://127.0.0.1:5000/` pois todas as rotas apontam para este destino. O front-end está configurado para rodar em localhost na porta 80, que é o padrão do servidor Nginx `http://127.0.0.1/` mas você também pode ajustar para a sua necessidade.

---
## Passo a passo para utilização do AjudaMais pela primeira vez

1. Em primeiro lugar, crie uma nova campanha e depois selecione ela na lista de campanhas.
2. Após a seleção da campanha, cadastre os abrigos (o sistema redireciona para os abrigos).
3. Após o cadastro dos abrigos, alimente a base de suprimentos `menu Cadastros, opção Suprimentos' 


