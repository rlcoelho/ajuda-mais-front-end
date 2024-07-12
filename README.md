# Front-end do sistema Ajuda Mais

O sistema **Ajuda Mais** tem o objetivo de gerenciar campanhas de ajuda humanitárias, cadastrando os dados dos abrigos - os locais onde as pessoas são acolhidas - e também os suprimentos que são recebidos nestes abrigos como doação. O problema que o **Ajuda Mais** procura resolver é saber quais abrigos precisam de determinado suprimento básico, por exemplo, água mineral, e quais abrigos, que, porventura tenham recedido uma grande quantidade de doação, neste exemplo, de água mineral, possam repassar esta doação excedente para o abrigo que necessita naquela semana.

Seguindo o exemplo, baseado no total de pessoas que estão no abrigo A nesta semana e sabendo via cadastro que cada pessoa consome 21 garrafas de água por semana, o **Ajuda Mais** calcula a quantidade de água que precisa ter em estoque, para saber se tem água suficiente ou não na semana. Supondo que precise de água e outro abrigo B tenha água excedente, esse repasse pode ser viabilizado.

Front-end desenvolvido no formato de Single Page Application (SPA) utilizando HTML, CSS, JavaScript e Bootstrap v5.3. 

O back-end que integra o sistema **Ajuda Mais** utiliza a linguagem Python com o microframework web Flask, framework ORM SQLAlchemy e banco de dados embutido SQLite3, além de outras bibliotecas do Python.

---
## Arquitetura e requisitos

É importante ter o Docker instalado, já que a aplicação foi concebida em uma arquitetura de microsserviços, com um componente principal (este frontend) e outra API, com possibilidade de expansão para a inserção de novas funcionalidades e consumo de APIs externas. Nesta versão, é utilizada a API VIACEP, acessível pelo link https://viacep.com.br/ws/01001000/json/ onde o 01001000 é o CEP consultado e trabalhado com as funções Javascript 'pesquisaCep()' e 'meuCallback()' além de outras funções para tratamento dos dados que estão presentes no arquivo 'js/scripts.js'.




---
## Como executar utilizando o Docker

Este repositório possui um arquivo dockerfile correspondente ao frontend. Para exe


---
## Melhorias previstas



