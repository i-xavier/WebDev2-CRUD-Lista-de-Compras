// cria a classe ItemCompra para manipular os dados
class ItemCompra {
    constructor(nomeItem, tipoItem, qtdItem, statusItem) {
        this.nomeItem = nomeItem;
        this.tipoItem = tipoItem;
        this.qtdItem = qtdItem;
        this.statusItem = statusItem;
    }
}

const validarDados = (dadosItem) => {
    //validarDados recebe o registro captado pelo os inputs

    let itens = Object.keys(dadosItem); //Retorna um array com os dados do objeto
    let flag = 0;

    itens.forEach((i) => {
        //Percorre o Array verificado se há elementos indefinidos, vazios, nulos ou zerados.
        if (dadosItem[i] === undefined || dadosItem[i] === '' || dadosItem[i] === null || dadosItem[i] === 0) {
            flag = 1;
        }
    })

    if (flag) {
        return false
    }
    return true;
}

let form = document.getElementById("form"); //Aponta para o formulário
let inNome = document.getElementById("inNome");
let inQuantidade = document.getElementById("inQuantidade");
let inCategoria = document.getElementById("inCategoria");
let msg = document.getElementById("msg"); //Aponta para o espaço que retornará mensagens a respeito de campos vazios
let itens = document.getElementById("itens"); //Aponta para o espaço onde os registros serão exibidos
let add = document.getElementById("add");
let registro = []; //Cria um Array para conter os registros dos itens
let checkbox = document.querySelector('.isComprado');

// Carrega os registros salvos no localStorage e exibe os itens na página
document.addEventListener('DOMContentLoaded', function () {

    if (localStorage.getItem("registro") === null) {
        registro = [];
    }
    else {
        //caso tenha um registro ele é capturado e convertido em JSON
        registro = JSON.parse(localStorage.getItem("registro"))
    }

    let html = '';

    let total = 0; //Apagar depois ou desenvolver um pouco mais Lucas, fica ao seu critério!

    //Percorre cada elemento contido em registro[]
    registro.forEach(function (element, id) {
        total++//Apagar depois ou desenvolver um pouco mais Lucas, fica ao seu critério!

        html += `
    <div id="${id}" ${isItemComprado(element.status)}>
            <span class="registros">${element.nome}</span>
            <span class="registros">${element.qtd}</span>
            <span class="registros">${element.categoria}</span>
            <span class="registros">${element.status}</span>
            <span class="options">
            <i onClick= "editarItem(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deletarItem(this)" class="fas fa-trash-alt"></i>
            </span>
        </div>
    `;
    })

    document.getElementById("total").innerHTML = total //Apagar depois ou desenvolver um pouco mais Lucas, fica ao seu critério!
    // Insere o HTML gerado no elemento que exibe os registros
    document.querySelector("#itens").innerHTML = html;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    //Captura os valores dos inputs
    const nomeItem = inNome.value;
    const tipoItem = inCategoria.value;
    const qtdItem = Number(inQuantidade.value);
    const statusItem = document.querySelector('input[name="inStatus"]:checked').value;

    //Cria um objeto
    let item = new ItemCompra(nomeItem, tipoItem, qtdItem, statusItem);

    if (validarDados(item)) {

        gravarDado(statusItem)

        // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
        add.setAttribute("data-bs-dismiss", "modal");

        add.click();

        //remove o valor para as próximas adições
        add.setAttribute("data-bs-dismiss", "");

        alert('Item cadastrado!');

    } else {
        msg.innerHTML = 'Todos os campos devem ser preenchidos!';
    }
});


const gravarDado = (sts) => {
    //Joga os dados que se encontram atualmente em input para o array registro[]
    idItem = gerarID()

    registro.push({
        id: idItem,
        nome: inNome.value,
        qtd: inQuantidade.value,
        categoria: inCategoria.value,
        status: sts

    });
    //slva registro no localStorage
    localStorage.setItem("registro", JSON.stringify(registro));

    //Joga o registro na tela
    adicionarItem(inNome.value, inCategoria.value, inQuantidade.value, sts, idItem)
    location.reload();
};

const gerarID = () => {
    
    //Verifica se há algo dentro de registro
    if (localStorage.getItem("registro") === "[]" || localStorage.getItem("registro") === "null") {
        return 1;
    }

    //trannsforma registro em um array
    let registros = JSON.parse(localStorage.getItem("registro"));

    let id;

    //Percorre o array e salva cada um dos ids
    for (let i = 0; i < registros.length; i++) {
        id = parseInt(registros[i].id);
    }

    //pega o último id e retorna somando mais um
    return id + 1;

}


const adicionarItem = (nome, tipo, qtd, sts, id) => {
    itens.innerHTML += `
    <div id="${id}" ${isItemComprado(sts)}>
            <span class="registros">${nome}</span>
            <span class="registros">${qtd}</span>
            <span class="registros">${tipo}</span>
            <span class="registros">${sts}</span>

            <span class="options">
            <i onClick= "editarItem(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deletarItem(this, ${id})" class="fas fa-trash-alt"></i>
            </span>
        </div>
    `;
    resetarCampos();
}

const deletarItem = (e, id) => {

    //Apaga a div/registro inteiro com a função remove() 
    //É utilizado 'parentElement' duas vezes pois primeiro aponta pro pai de <i>, que é o span, depois aponta pro pai de <span>, que é a <div>
    e.parentElement.parentElement.remove();
    //Remove elemento do array
    registro.splice(e.parentElement.parentElement.id, 1);

    //Atualiza no localStorage
    localStorage.setItem("registro", JSON.stringify(registro));
}

//Pega o status do item como parâmetro e verifica o seu status.
const isItemComprado = (sts) => {

    let isItemComprado = ''

    //Se status = sim, o fundo do registro fica em um tom verde pastel
    if (sts === 'sim') {
        isItemComprado = 'style="background-color: #C1E1C1"'
    }
    return isItemComprado;
}

const editarItem = (e) => {

    let itemSelecionado = e.parentElement.parentElement;

    // Preenche os inputs com os dados do item selecionado
    inNome.value = itemSelecionado.children[0].innerHTML;
    inQuantidade.value = itemSelecionado.children[1].innerHTML;
    inCategoria.value = itemSelecionado.children[2].innerHTML;
    let status = itemSelecionado.children[3].innerHTML;

    //Verifica todos os radios buttons
    document.querySelectorAll('input[name="inStatus"]').forEach(radio => {
        //Se corresponder, marque esse radio
        if (radio.value === status) {
            radio.checked = true;
        }
    });
    // Remove o registro antigo para que a versão editada seja adicionada novamente
    deletarItem(e);
}

const resetarCampos = () => {
    inNome.value = "";
    inCategoria.value = "";
    inQuantidade.value = "";
}