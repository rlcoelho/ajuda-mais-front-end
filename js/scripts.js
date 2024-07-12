/*
  --------------------------------------------------------------------------------------
  Variáveis globais para recuperar campanha selecionada e listar abrigos
  --------------------------------------------------------------------------------------
*/
let campanhaSelecionadaId = '';
let campanhaSelecionadaNome = '';


/*
  --------------------------------------------------------------------------------------
  Função para posicionar a section corretamente ao clicar no menu
  --------------------------------------------------------------------------------------
*/
function scrollToSection(sectionId) {
    let section = document.getElementById(sectionId);
    if (section) {
        let position = section.offsetTop - 110; // 110px é o tamanho do header
        requestAnimationFrame(() => {
        window.scrollTo({ top: position, behavior: 'smooth' })
        });
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para formatar campos data no formato DD/MM/AAAA
  --------------------------------------------------------------------------------------
*/
function formatarData(dataString) {
    let data = new Date(dataString);
    let dia = ("0" + data.getUTCDate()).slice(-2);
    let mes = ("0" + (data.getUTCMonth() + 1)).slice(-2);
    let ano = data.getUTCFullYear();
    return dia + "/" + mes + "/" + ano;
}


/*
  --------------------------------------------------------------------------------------
  Função para formatar campos data no formato DD/MM/AAAA HH:MM
  --------------------------------------------------------------------------------------
*/
function formatarDataHora(dataString) {
    let data = new Date(dataString);
    let dia = ("0" + data.getUTCDate()).slice(-2);
    let mes = ("0" + (data.getUTCMonth() + 1)).slice(-2);
    let ano = data.getUTCFullYear();
    let horas = ("0" + data.getUTCHours()).slice(-2);
    let minutos = ("0" + data.getUTCMinutes()).slice(-2);

    return dia + "/" + mes + "/" + ano + " " + horas + ":" + minutos;
}


/*
  --------------------------------------------------------------------------------------
  Função para formatar CEP no formato 00000-000
  --------------------------------------------------------------------------------------
*/
function formatarCep(cepNumerico) {
     cepNumerico = String(cepNumerico).replace(/-/g, '').replace(/\s/g, '');
    if (cepNumerico.length === 8) {
        const cepFormatado = `${cepNumerico.slice(0, 5)}-${cepNumerico.slice(5)}`;
        return cepFormatado;
    } else {
        return null;
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para consultar WS ViaCEP - limpa os campos do Form
  --------------------------------------------------------------------------------------
*/
function limpaFormularioCep() {
    //Limpa valores do formulário de cep.
    document.getElementById('inputLogradouro').value=("");
    document.getElementById('inputBairro').value=("");
    document.getElementById('inputCidade').value=("");
    document.getElementById('inputEstado').value=("");
}


/*
  --------------------------------------------------------------------------------------
  Função para consultar WS ViaCEP - preenche os campos do Form com o retorno
  --------------------------------------------------------------------------------------
*/
function meuCallback(conteudo) {
    if (!("erro" in conteudo)) {
        limpaFormularioCep();
        //Atualiza os campos com os valores.
        document.getElementById('inputLogradouro').value=(conteudo.logradouro);
        document.getElementById('inputBairro').value=(conteudo.bairro);
        document.getElementById('inputCidade').value=(conteudo.localidade);
        document.getElementById('inputEstado').value=(conteudo.uf);        
    }
    else {
        //CEP não Encontrado.
        limpaFormularioCep();
        alert("CEP não encontrado.");
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para consultar WS ViaCEP - pesquisa o CEP
  --------------------------------------------------------------------------------------
*/
function pesquisaCep(valor) {

    let cep = valor.replace(/\D/g, '');

    if (cep != "") {
        let validacep = /^[0-9]{8}$/;    
        if(validacep.test(cep)) {
            limpaFormularioCep();
            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('inputLogradouro').value="...";
            document.getElementById('inputBairro').value="...";
            document.getElementById('inputCidade').value="...";
            document.getElementById('inputEstado').value="...";

            //Cria um elemento javascript.
            let script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meuCallback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);
        }
        else {
            //cep é inválido.
            limpaFormularioCep();
            alert("Formato de CEP inválido.");
        }
    }
    else {
        //cep sem valor, limpa formulário.
        limpaFormularioCep();
    }
};


/* 
--------------------------------------------------------------------------------------
Funções para CRUD de Campanhas 
--------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para criar ícones em cada campanha com eventos onclick
  --------------------------------------------------------------------------------------
*/
const insertIconsCampanha = (parent) => {
    let trashIcon = document.createElement("span");
    trashIcon.className = "material-symbols-outlined icon";
    trashIcon.textContent = "delete";
    trashIcon.title = "Excluir"; // texto alternativo
    trashIcon.onclick = function () {
        let div = this.parentElement.parentElement;
        const idCampanha = div.id;
        if (confirm("Você tem certeza?")) {
            verificaSeCampanhaTemAbrigos(idCampanha, div);
        }
    };
    parent.appendChild(trashIcon);
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota POST para incluir uma campanha
  --------------------------------------------------------------------------------------
*/
const postCampanha = async (inputDescricaoCampanha) => {
    const formData = new FormData();
    formData.append('descricao_campanha', inputDescricaoCampanha);
    let url = 'http://127.0.0.1:5000/campanha/';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para carregar as campanhas dentro do select na Seção Inicial
  --------------------------------------------------------------------------------------
*/
const getSelectCampanhas = async () => {
    let url = 'http://127.0.0.1:5000/campanhas';
    fetch(url, {
        method: 'get',
    })
    .then(response => response.json())
    .then(data => {
        let select = document.getElementById('largeSelect');
        // Limpa as opções existentes
        select.innerHTML = '';
        // Adiciona a opção padrão
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Escolha uma campanha';
        select.add(defaultOption);
        // Adiciona as campanhas
        data.campanhas.forEach(campanha => {
            let option = document.createElement('option');
            option.value = campanha.id_campanha;
            option.text = campanha.descricao_campanha;
            select.add(option);
            select.addEventListener('change', () => {
                // Obtém a opção selecionada
                let selectedOption = select.options[select.selectedIndex];
                // Atribui o id_campanha e o descricao_campanha selecionado para usar na section abrigos
                campanhaSelecionadaId = selectedOption.value;
                campanhaSelecionadaNome = selectedOption.text;
                document.getElementById("tituloNomeCampanha").textContent = campanhaSelecionadaNome;
                scrollToSection('abrigos');
                getListAbrigos(campanhaSelecionadaId);
                window.location.href = `#abrigos`;                
            });
        });
    });
}


/*
--------------------------------------------------------------------------------------
  Função com a rota GET para obter a lista de campanhas
--------------------------------------------------------------------------------------
*/
const getListaCampanhas = async () => {
    let url = 'http://127.0.0.1:5000/campanhas';
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpa a tabela antes de inserir as novas linhas
        let table = document.getElementById('tabelaCampanhas');
        while (table.rows.length > 1) { // mantém a linha do cabeçalho
            table.deleteRow(1);
        }
        data.campanhas.forEach(item => {
            insertListCampanhas(
                item.id_campanha,
                item.descricao_campanha
            )
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir itens na lista de campanhas 
  --------------------------------------------------------------------------------------
*/
const insertListCampanhas = (id_campanha, descricao_campanha) => {
    let table = document.getElementById('tabelaCampanhas');
    let row = table.insertRow();
    row.id = id_campanha;
    row.insertCell(0).textContent = descricao_campanha;
    insertIconsCampanha(row.insertCell(1));
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota GET para verificar se uma campanha pode ser excluída
  --------------------------------------------------------------------------------------
*/
const verificaSeCampanhaTemAbrigos = (idCampanha, div) => {
    let url = 'http://127.0.0.1:5000/campanha/tem_abrigos?id_campanha=' + idCampanha;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {

        let tem_abrigos = false;
        if (data.tem_abrigos.tem_abrigos === true) {
            tem_abrigos = true;
        } else if (data.tem_abrigos.tem_abrigos === false) {
            tem_abrigos = false;
        } else {
            console.error('Resposta inesperada do servidor:', data.tem_abrigos.tem_abrigos);
        }
      
        if (tem_abrigos) {
            alert('Esta campanha não pode ser excluída porque tem abrigos associados a ela.');
        } else {
            deleteItemCampanha(idCampanha, div);
        }
    })
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota DELETE para excluir uma campanha
  --------------------------------------------------------------------------------------
*/
const deleteItemCampanha = (idCampanha, div) => {
    let url = 'http://127.0.0.1:5000/campanha?id_campanha=' + idCampanha;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => {
            if (response.status === 200) {
                // Recarrega as listas de campanhas após a exclusão
                getSelectCampanhas();
                getListaCampanhas(); 
                // Remove a linha na interface do usuário
                div.remove();
                alert("Campanha removida!");
            } else {
                // Algo deu errado
                alert("Erro ao excluir a campanha.");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para incluir uma nova campanha
  --------------------------------------------------------------------------------------
*/
const novaCampanha = () => {
    let inputDescricaoCampanha = document.getElementById("descricao_campanha").value;
    
    // Verifica se o campo do formulário foi preenchido
    if (inputDescricaoCampanha.trim() !== "") {
            postCampanha(inputDescricaoCampanha);
            alert("Campanha incluída com sucesso!");
            // limpa o campo do formulário após a inclusão e recarrega select
            document.getElementById("descricao_campanha").value = "";
            getSelectCampanhas();
            getListaCampanhas();
    } else {
        alert("Por favor, preencha o campo do formulário antes de enviar.");
    }
}


/* 
--------------------------------------------------------------------------------------
Funções para CRUD de Abrigos
--------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função com a rota GET para buscar os dados de um abrigo
  --------------------------------------------------------------------------------------
*/
const buscaAbrigo = async (idAbrigo) => {
    let url = 'http://127.0.0.1:5000/abrigo?id_abrigo=' + idAbrigo;
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('idAbrigoHidden').value = data.id_abrigo;
        document.getElementById('inputDescricao').value = data.descricao_abrigo;
        document.getElementById('inputStatus').value = data.ativo;
        document.getElementById('inputCapacidadeMaxima').value = data.capacidade_maxima;
        document.getElementById('inputLotacaoAtual').value = data.lotacao_atual;
        document.getElementById('inputLogradouro').value = data.logradouro;
        document.getElementById('inputNumero').value = data.numero;
        document.getElementById('inputComplemento').value = data.complemento;
        document.getElementById('inputBairro').value = data.bairro;
        document.getElementById('inputCidade').value = data.cidade;
        document.getElementById('inputEstado').value = data.estado;
        document.getElementById('inputCep').value = data.cep;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para limpar campos do formulário de cadastro de Abrigo
  --------------------------------------------------------------------------------------
*/
function limparCamposFormAbrigo() {
    document.getElementById("idAbrigoHidden").value = '';
    document.getElementById("inputDescricao").value = '';
    document.getElementById("inputStatus").value = 'true';
    document.getElementById("inputCapacidadeMaxima").value = '';
    document.getElementById("inputLotacaoAtual").value = '';
    document.getElementById("inputCep").value = '';
    document.getElementById("inputLogradouro").value = '';
    document.getElementById("inputNumero").value = '';
    document.getElementById("inputComplemento").value = '';
    document.getElementById("inputBairro").value = '';
    document.getElementById("inputCidade").value = '';
    document.getElementById("inputEstado").value = '';
}


/*
  --------------------------------------------------------------------------------------
  Função para incluir ou atualizar um Abrigo
  --------------------------------------------------------------------------------------
*/
const salvarAbrigo = () => {

    let idAbrigo = document.getElementById('idAbrigoHidden').value;
    let inputDescricao = document.getElementById("inputDescricao").value;
    let inputStatus = document.getElementById("inputStatus").value;
    let inputCapacidadeMaxima = document.getElementById("inputCapacidadeMaxima").value;
    let inputLotacaoAtual = document.getElementById("inputLotacaoAtual").value;
    let inputCep = formatarCep(document.getElementById("inputCep").value);
    let inputLogradouro = document.getElementById("inputLogradouro").value;
    let inputNumero = document.getElementById("inputNumero").value;
    let inputComplemento = document.getElementById("inputComplemento").value;
    let inputBairro = document.getElementById("inputBairro").value;
    let inputCidade = document.getElementById("inputCidade").value;
    let inputEstado = document.getElementById("inputEstado").value;

    if (idAbrigo) {
        // Atualizar abrigo existente
        if (inputDescricao.trim() !== "" && inputCapacidadeMaxima.trim() !== "" && inputLotacaoAtual.trim() !== "") {
            try {
                putAbrigo(idAbrigo, inputDescricao, inputStatus, inputCapacidadeMaxima, inputLotacaoAtual,
                    inputCep, inputLogradouro, inputNumero, inputComplemento, inputBairro, inputCidade, inputEstado
                );
                alert("Abrigo atualizado com sucesso!");
                limparCamposFormAbrigo()
                scrollToSection('abrigos');
                getListAbrigos(campanhaSelecionadaId); 
                window.location.href = '#abrigos';
            } catch (error) {
                alert("Ocorreu um erro e o abrigo não foi atualizado!");
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios antes de enviar.");
        } 

    } else {      
        // Incluir abrigo novo
        if (inputDescricao.trim() !== "" && inputCapacidadeMaxima.trim() !== "" && inputLotacaoAtual.trim() !== "") {
            try {
                postAbrigo(inputDescricao, inputStatus, inputCapacidadeMaxima, inputLotacaoAtual,
                    inputCep, inputLogradouro, inputNumero, inputComplemento, inputBairro, inputCidade, inputEstado
                );
                alert("Abrigo incluído com sucesso!");
                limparCamposFormAbrigo()
                scrollToSection('abrigos');
                getListAbrigos(campanhaSelecionadaId); 
                window.location.href = '#abrigos';
            } catch (error) {
                alert("Ocorreu um erro e o abrigo não foi registrado!");
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios antes de enviar.");
        } 
    }
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota PUT para atualizar um abrigo
  --------------------------------------------------------------------------------------
*/
const putAbrigo = async (idAbrigo, inputDescricao, inputStatus, inputCapacidadeMaxima, inputLotacaoAtual, 
    inputCep, inputLogradouro, inputNumero, inputComplemento, inputBairro, inputCidade, inputEstado) => {
    let formData = new FormData();
    formData.append('id_abrigo', idAbrigo)
    formData.append('fk_campanha', campanhaSelecionadaId);
    formData.append('descricao_abrigo', inputDescricao);
    formData.append('ativo', inputStatus);
    formData.append('capacidade_maxima', inputCapacidadeMaxima); 
    formData.append('lotacao_atual', inputLotacaoAtual);  
    formData.append('cep', inputCep);  
    formData.append('logradouro', inputLogradouro);  
    formData.append('numero', inputNumero);  
    formData.append('complemento', inputComplemento);  
    formData.append('bairro', inputBairro);  
    formData.append('cidade', inputCidade);  
    formData.append('estado', inputEstado);  
    //for (const pair of formData.entries()) {
    //    console.log(pair[0], pair[1]);
    //}
    let url = 'http://127.0.0.1:5000/abrigo';
    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => response.json())
        //.then((data) => {
        //    console.log('Dados da resposta:', data);
        //})
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota POST que inclui um abrigo
  --------------------------------------------------------------------------------------
*/
const postAbrigo = async (inputDescricao, inputStatus, inputCapacidadeMaxima, inputLotacaoAtual, 
    inputCep, inputLogradouro, inputNumero, inputComplemento, inputBairro, inputCidade, inputEstado) => {
    let formData = new FormData();
    formData.append('fk_campanha', campanhaSelecionadaId);
    formData.append('descricao_abrigo', inputDescricao);
    formData.append('ativo', inputStatus);
    formData.append('capacidade_maxima', inputCapacidadeMaxima); 
    formData.append('lotacao_atual', inputLotacaoAtual);  
    formData.append('cep', inputCep);  
    formData.append('logradouro', inputLogradouro);  
    formData.append('numero', inputNumero);  
    formData.append('complemento', inputComplemento);  
    formData.append('bairro', inputBairro);  
    formData.append('cidade', inputCidade);  
    formData.append('estado', inputEstado);  
    let url = 'http://127.0.0.1:5000/abrigo/';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota GET para obter a lista de abrigos por campanha
  --------------------------------------------------------------------------------------
*/
const getListAbrigos = async (idCampanha) => {
    let url = 'http://127.0.0.1:5000/abrigos?id_campanha=' + idCampanha;
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpa a lista antes de inserir as novas linhas
        let lista = "";
        let itens = "";
        lista = document.getElementById('lista-abrigos');
        itens = lista.getElementsByTagName('li');
        console.log(itens);
        for (let i = itens.length - 1; i >= 0; i--) {
            lista.removeChild(itens[i]);
        }
        data.abrigos.forEach( async (item) => {
            await insertListAbrigos(
                item.id_abrigo, 
                item.fk_campanha, 
                item.descricao_abrigo, 
                item.capacidade_maxima, 
                item.lotacao_atual, 
                item.logradouro,
                item.numero,
                item.complemento,
                item.bairro,
                item.cidade,
                item.estado,
                item.cep,                  
                item.ativo,       
                item.data_inclusao, 
                item.data_atualizacao
            );
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir itens na lista de abrigos que será exibida
  --------------------------------------------------------------------------------------
*/
const insertListAbrigos = async (id_abrigo, fk_campanha, descricao_abrigo, capacidade_maxima, 
                                lotacao_atual, logradouro, numero, complemento, bairro, 
                                cidade, estado, cep, ativo, data_inclusao, data_atualizacao) => {
    
    let lista = document.getElementById('lista-abrigos');
    let item = "";
    let divInfo = "";
    
    item = document.createElement("li");
    item.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-start", "my-2", "rounded");   
    divInfo = document.createElement("div");
    divInfo.classList.add("ms-2", "me-auto");

     // Título com o nome do abrigo
    let nomeAbrigo = document.createElement("div");
    nomeAbrigo.classList.add("fw-bold", "text-primary-emphasis");
    nomeAbrigo.textContent = descricao_abrigo; 

     // Status
    let status = document.createElement("span");
    status.classList.add("fw-bold");
    status.style.fontSize = "0.75rem";
    status.textContent = "Status: ";
    let statusValor = document.createElement("span");
    statusValor.style.fontSize = "1rem";
    statusValor.textContent = ativo ? "Ativo" : "Inativo";

    // Separador " — "
    let separador1 = document.createElement("span");
    separador1.style.margin = "0 0.5rem";
    separador1.style.fontSize = "0.75rem";
    separador1.textContent = " — ";

    // Data de início
    let dataInicio = document.createElement("span"); 
    dataInicio.classList.add("fw-bold");
    dataInicio.style.fontSize = "0.75rem";
    dataInicio.textContent = "Data de início: ";
    let dataInicioValor = document.createElement("span");
    dataInicioValor.style.fontSize = "1rem";
    dataInicioValor.textContent = formatarData(data_inclusao);

    let quebraLinha1 = document.createElement("br");

    // Capacidade máxima
    let capacidadeMaxima = document.createElement("span");
    capacidadeMaxima.classList.add("fw-bold");
    capacidadeMaxima.style.fontSize = "0.75rem";
    capacidadeMaxima.textContent = "Capacidade máxima: ";
    let capacidadeMaximaValor = document.createElement("span");
    capacidadeMaximaValor.style.fontSize = "1rem";
    capacidadeMaximaValor.textContent = capacidade_maxima;

    // Separador " — "
    let separador2 = document.createElement("span");
    separador2.style.margin = "0 0.5rem";
    separador2.style.fontSize = "0.75rem";
    separador2.textContent = " — ";

    // Ocupação atual
    let lotacaoAtual = document.createElement("span");
    lotacaoAtual.classList.add("fw-bold");
    lotacaoAtual.style.fontSize = "0.75rem";
    lotacaoAtual.textContent = "Ocupação Atual: ";
    let lotacaoAtualValor = document.createElement("span");
    lotacaoAtualValor.style.fontSize = "1rem";
    lotacaoAtualValor.textContent = lotacao_atual;

    let quebraLinha2 = document.createElement("br");

    // Endereço
    let endereco = document.createElement("span");
    endereco.classList.add("fw-bold");
    endereco.style.fontSize = "0.75rem";
    endereco.textContent = "Endereço: ";
    let enderecoValor = document.createElement("span");
    enderecoValor.style.fontSize = "0.75rem";
    enderecoValor.textContent = logradouro + ", " + numero + " - " +  complemento + " - " + 
                                bairro + " - " + cidade + " - " + estado + ' - CEP: ' + cep;

    // Adicionando elementos
    divInfo.appendChild(nomeAbrigo);
    
    divInfo.appendChild(status);
    divInfo.appendChild(statusValor);
    divInfo.appendChild(separador1);
    divInfo.appendChild(dataInicio);
    divInfo.appendChild(dataInicioValor);
    divInfo.appendChild(quebraLinha1);

    divInfo.appendChild(capacidadeMaxima);
    divInfo.appendChild(capacidadeMaximaValor);
    divInfo.appendChild(separador2);
    divInfo.appendChild(lotacaoAtual);
    divInfo.appendChild(lotacaoAtualValor);
    divInfo.appendChild(quebraLinha2);

    divInfo.appendChild(endereco);
    divInfo.appendChild(enderecoValor);

    item.appendChild(divInfo);

    // Botões "Alterar" e "Suprimentos"
    let btnAlterar = document.createElement("span");
    btnAlterar.classList.add("btn", "btn-sm", "text-bg-secondary", "me-2");
    btnAlterar.style.fontSize = "0.75rem";
    btnAlterar.setAttribute("data-id-abrigo", id_abrigo);
    btnAlterar.setAttribute("data-bs-toggle", "modal");
    btnAlterar.setAttribute("data-bs-target", "#staticBackdrop"); 
    btnAlterar.onclick = function() {
        let idAbrigo = this.getAttribute('data-id-abrigo'); 
        buscaAbrigo(idAbrigo);
    };
    btnAlterar.textContent = "Alterar";

    let btnSuprimentos = document.createElement("span");
    btnSuprimentos.classList.add("btn", "btn-sm", "text-bg-success", "me-2");
    btnSuprimentos.style.fontSize = "0.75rem";
    btnSuprimentos.onclick = function() {
        scrollToSection('controle');
        window.location.href = '#controle';
    };
    btnSuprimentos.textContent = "Suprimentos";

    item.appendChild(btnAlterar);
    item.appendChild(btnSuprimentos);

    // Adiciona o item à lista
    lista.appendChild(item);
}


/* 
--------------------------------------------------------------------------------------
Funções para CRUD de Suprimentos
--------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para criar ícones em cada suprimento com eventos onclick
  --------------------------------------------------------------------------------------
*/
const insertIconsSuprimentos = (parent) => {
    let editIcon = document.createElement("span");
    editIcon.className = "material-symbols-outlined icon";
    editIcon.textContent = "edit";
    editIcon.title = "Alterar"; // texto alternativo
    editIcon.setAttribute("data-bs-toggle", "modal");
    editIcon.setAttribute("data-bs-target", "#staticBackdrop2");
    editIcon.onclick = function () {
        let div = this.parentElement.parentElement;
        let idSuprimento = div.id;
        buscaSuprimento(idSuprimento);
    }   
    parent.appendChild(editIcon);

    let trashIcon = document.createElement("span");
    trashIcon.className = "material-symbols-outlined icon";
    trashIcon.textContent = "delete";
    trashIcon.title = "Excluir"; // texto alternativo
    trashIcon.onclick = function () {
        let div = this.parentElement.parentElement;
        let idSuprimento = div.id;
        if (confirm("Você tem certeza?")) {
            deleteItemSuprimento(idSuprimento, div);
        }
    };
    parent.appendChild(trashIcon);
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota DELETE para excluir um suprimento
  --------------------------------------------------------------------------------------
*/
const deleteItemSuprimento = (idSuprimento, div) => {
    let url = 'http://127.0.0.1:5000/suprimento?id_suprimento=' + idSuprimento;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => {
            if (response.status === 200) {
                // Recarrega a lista de suprimentos após a exclusão
                getListaSuprimentos(); 
                // Remove a linha na interface do usuário
                div.remove();
                alert("Suprimento removido!");
            } else {
                // Algo deu errado
                alert("Erro ao excluir o suprimento.");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para limpar campos do formulário de cadastro de suprimento
  --------------------------------------------------------------------------------------
*/
function limparCamposFormSuprimento() {
    document.getElementById("idSuprimentoHidden").value = '';
    document.getElementById("inputDescricaoSuprimento").value = '';
    document.getElementById("inputQtdSemanaPessoa").value = '';
}


/*
  --------------------------------------------------------------------------------------
  Função para incluir ou atualizar um suprimento
  --------------------------------------------------------------------------------------
*/
const salvarSuprimento = () => {

    let idSuprimento = document.getElementById('idSuprimentoHidden').value;
    let inputDescricaoSuprimento = document.getElementById("inputDescricaoSuprimento").value;
    let inputQtdSemanaPessoa = document.getElementById("inputQtdSemanaPessoa").value;

    if (idSuprimento) {
        // Atualizar suprimento existente
        if (inputDescricaoSuprimento.trim() !== "" && inputQtdSemanaPessoa.trim() !== "") {
            try {
                putSuprimento(idSuprimento, inputDescricaoSuprimento, inputQtdSemanaPessoa);
                alert("Suprimento atualizado com sucesso!");
                limparCamposFormSuprimento()
                scrollToSection('suprimentos');
                getListaSuprimentos();
                window.location.href = '#suprimentos';
            } catch (error) {
                alert("Ocorreu um erro e o suprimento não foi atualizado!");
            }
        } else {
            alert("Por favor, preencha todos os campos antes de enviar.");
        } 

    } else {      
        // Incluir suprimento novo
        if (inputDescricaoSuprimento.trim() !== "" && inputQtdSemanaPessoa.trim() !== "") {
            try {
                postSuprimento(inputDescricaoSuprimento, inputQtdSemanaPessoa);
                alert("Suprimento incluído com sucesso!");
                limparCamposFormSuprimento()
                scrollToSection('suprimentos');
                getListaSuprimentos(); 
                window.location.href = '#suprimentos';
            } catch (error) {
                alert("Ocorreu um erro e o suprimento não foi registrado!");
            }
        } else {
            alert("Por favor, preencha todos os campos antes de enviar.");
        } 
    }
}


/*
--------------------------------------------------------------------------------------
  Função com a rota GET para obter a lista de suprimentos
--------------------------------------------------------------------------------------
*/
const getListaSuprimentos = async () => {
    let url = 'http://127.0.0.1:5000/suprimentos';
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpa a tabela antes de inserir as novas linhas
        let table = document.getElementById('tabelaSuprimentos');
        while (table.rows.length > 1) { // mantém a linha do cabeçalho
            table.deleteRow(1);
        }
        data.suprimentos.forEach(item => {
            insertListSuprimentos(
                item.id_suprimento,
                item.descricao_suprimento,
                item.qtd_para_pessoa_semana
            )
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir itens na lista de suprimentos 
  --------------------------------------------------------------------------------------
*/
const insertListSuprimentos = (id_suprimento, descricao_suprimento, qtd_para_pessoa_semana) => {
    let table = document.getElementById('tabelaSuprimentos');
    let row = table.insertRow();
    row.id = id_suprimento;
    row.insertCell(0).textContent = descricao_suprimento;
    row.insertCell(1).textContent = qtd_para_pessoa_semana;
    insertIconsSuprimentos(row.insertCell(2));
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota PUT para atualizar um suprimento
  --------------------------------------------------------------------------------------
*/
const putSuprimento = async (idSuprimento, inputDescricaoSuprimento, inputQtdSemanaPessoa) => {
    let formData = new FormData();
    formData.append('id_suprimento', idSuprimento);
    formData.append('descricao_suprimento', inputDescricaoSuprimento);
    formData.append('qtd_para_pessoa_semana', inputQtdSemanaPessoa);   

    let url = 'http://127.0.0.1:5000/suprimento';
    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => response.json())
        //.then((data) => {
        //    console.log('Dados da resposta:', data);
        //})
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota POST que inclui um suprimento
  --------------------------------------------------------------------------------------
*/
const postSuprimento = async (inputDescricaoSuprimento, inputQtdSemanaPessoa) => {
    let formData = new FormData();
    formData.append('descricao_suprimento', inputDescricaoSuprimento);
    formData.append('qtd_para_pessoa_semana', inputQtdSemanaPessoa); 
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
    let url = 'http://127.0.0.1:5000/suprimento/';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Dados da resposta:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função com a rota GET para buscar os dados de um suprimento
  --------------------------------------------------------------------------------------
*/
const buscaSuprimento = async (idSuprimento) => {
    let url = 'http://127.0.0.1:5000/suprimento?id_suprimento=' + idSuprimento;
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('idSuprimentoHidden').value = data.id_suprimento;
        document.getElementById('inputDescricaoSuprimento').value = data.descricao_suprimento;
        document.getElementById('inputQtdSemanaPessoa').value = data.qtd_para_pessoa_semana;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  FIM das funções para CRUD
  --------------------------------------------------------------------------------------
*/


/*
  --------------------------------------------------------------------------------------
  Inicializa as listas somente após a página estar totalmente carregada
  --------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', (event) => {
    getSelectCampanhas();
    getListaCampanhas();
    getListaSuprimentos();    
});