// cria a classe ItemCompra para manipular os dados
class ItemCompra {
    constructor(nomeItem, tipoItem, qtdItem, statusItem) {
        this.nomeItem = nomeItem;
        this.tipoItem = tipoItem;
        this.qtdItem = qtdItem;
        this.statusItem = statusItem;
    }

    getNomeItem() {

        return this.nomeItem;
    }

    getTipoItem() {

        return this.tipoItem
    }

    getQtdItem() {

        return this.qtdItem
    }

    estaComprado() {

        if (this.statusItem === 'sim') {
            return true
        }
        else
            return false
    }

    getStatusItem() {

        return this.statusItem
    }

    setTipoItem(tipoItem) {
        this.tipoItem = tipoItem;
    }


}

class ListaItens {

    constructor() {
        this.itens = [];
    }


    gerarId() {

        if (this.itens.length === 0) {
            return 1;
        }
        else {

            let ultimoItem = this.ultimoItemLista();
            return ultimoItem + 1;
        }

    }

    adicionarItem(item) {

        let idItem = this.gerarId();

        this.itens.push({
            id: idItem,
            item: item
        });
    }

    apagarItem(id) {

        this.itens = this.itens.filter(item => item.id !== id);

    }

    buscar(id) {

        if (this.itens.length === 0) {
            return null;
        }

        const itemEncontrado = this.itens.find(elemento => elemento.id === id);

        return itemEncontrado
    }

    getId(item) {

        const listaDeCompras = this.itens;

        /*listaDeCompras.forEach(function(item){
            if(item.item === itemLista){
              return item.id  
            }
        })*/

        const idDoItem = listaDeCompras.find(i => i.item === item)

        if (idDoItem === null || idDoItem === undefined) {
            return null
        }
        else
            return idDoItem.id;
    }

    ultimoItemLista() {

        const ultimoItem = this.itens[this.itens.length - 1];

        return ultimoItem.id;

    }

    marcarItem(statusItem, id) {

        let buscarItem = this.buscar(id);

        if (statusItem === 'sim') {
            buscarItem.item.statusItem = 'nao';
        } else if (statusItem === 'nao') {
            buscarItem.item.statusItem = 'sim';
        }
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

const listaDeCompras = new ListaItens();
let form = document.getElementById("form"); //Aponta para o formulário
let inNome = document.getElementById("inNome");
let inQuantidade = document.getElementById("inQuantidade");
let inCategoria = document.getElementById("inCategoria");
let msg = document.getElementById("msg"); //Aponta para o espaço que retornará mensagens a respeito de campos vazios
let itens = document.getElementById("itens"); //Aponta para o espaço onde os registros serão exibidos
let add = document.getElementById("add");
let checkbox = document.querySelector('[name="isComprado"]');

console.log("antes");
// Carrega os registros salvos no localStorage e exibe os itens na página
document.addEventListener('DOMContentLoaded', () => {


    console.log("entrou no DOMContentLoaded");

    if (localStorage.getItem("listaDeCompras") === null) {
        return
    }

    const listaCompletaAtual = JSON.parse(localStorage.getItem("listaDeCompras"))

    listaDeCompras.itens = listaCompletaAtual;

    let html = '';

    //let total = 0; Apagar depois 

    //Percorre cada elemento contido em registro[]
    listaCompletaAtual.forEach(function (registro) {
        //total++ Apagar depois

        //nome, tipo, qtd, sts, id
        adicionarItem(registro.item.nomeItem, registro.item.tipoItem, registro.item.qtdItem, registro.item.statusItem, registro.id );

        /*html += `
    <div id="${registro.id}" ${isItemComprado(registro.item.statusItem)}>
            <input type="checkbox" id="comprado${registro.id}" name="isComprado" value="sim">
            <span class="registros">${registro.item.nomeItem}</span>
            <span class="registros">${registro.item.qtdItem}</span>
            <span class="registros">${registro.item.tipoItem}</span>
            <span class="registros">${registro.item.statusItem}</span>
            <span class="options">
            <i onClick="editarItem(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick="deletarItem(this, ${registro.id})" class="fas fa-trash-alt"></i>
            </span>
        </div>
    `;*/

    })

    //document.getElementById("total").innerHTML = total Apagar depois

    // Insere o HTML gerado no elemento que exibe os registros
    //document.querySelector("#itens").innerHTML = html;


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

        gravarDado(item);
        //listaDeCompras.adicionarItem(item);

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

/*checkbox.addEventListener('change', (e) => {
    
    e.marcarComoComprado();
})*/

const gravarDado = (item) => {
    //Joga os dados que se encontram atualmente em input para o array registro[]
    listaDeCompras.adicionarItem(item);

    //salva registro no localStorage
    localStorage.setItem("listaDeCompras", JSON.stringify(listaDeCompras.itens));

    //Joga o registro na tela
    adicionarItem(item.getNomeItem(), item.getTipoItem(), item.getQtdItem(), item.getStatusItem(), listaDeCompras.getId(item))
    //location.reload(); Apagar depois
};

const adicionarItem = (nome, tipo, qtd, sts, id) => {
    /*itens.innerHTML += `
    <div id="${id}" ${isItemComprado(sts)}>

            <input type="checkbox" id="comprado${id}" name="isComprado" value="sim">
            <span class="registros">${nome}</span>
            <span class="registros">${qtd}</span>
            <span class="registros">${tipo}</span>
            <span class="registros">${sts}</span>

            <span class="options">
            <i onClick= "editarItem(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deletarItem(this, ${id})" class="fas fa-trash-alt"></i>
            </span>
        </div>
    `;*/

    const itemDiv = document.createElement("div");
    itemDiv.id = id;

    isItemComprado(sts, itemDiv);

    const checkboxSpan = document.createElement("span");
    const checkboxItem = document.createElement("input");
    checkboxItem.setAttribute("name", "isComprado");
    checkboxItem.setAttribute("type", "checkbox");
    checkboxItem.setAttribute("value", "sim");
    checkboxItem.id = `comprado${id}`;
    checkboxSpan.appendChild(checkboxItem);

    checkboxItem.addEventListener("change", function () {
        listaDeCompras.marcarItem(sts, id);
        //localStorage.setItem()
    })

    const itemNomeSpan = document.createElement("span");
    const conteudoNomeItem = document.createTextNode(nome);
    itemNomeSpan.appendChild(conteudoNomeItem);
    itemNomeSpan.classList.add("registros");

    const itemQtdSpan = document.createElement("span");
    const conteudoQtdItem = document.createTextNode(qtd);
    itemQtdSpan.appendChild(conteudoQtdItem);
    itemQtdSpan.classList.add("registros");

    const itemTipoSpan = document.createElement("span");
    const conteudoTipoItem = document.createTextNode(tipo);
    itemTipoSpan.appendChild(conteudoTipoItem);
    itemTipoSpan.classList.add("registros");

    const itemStatusSpan = document.createElement("span");
    const conteudoStatusItem = document.createTextNode(sts);
    itemStatusSpan.appendChild(conteudoStatusItem);
    itemStatusSpan.classList.add("registros");

    const itemOptions = document.createElement("span");
    itemOptions.classList.add("options");

    const botaoEditar = document.createElement("i");
    botaoEditar.classList.add("fas", "fa-edit");
    botaoEditar.setAttribute("data-bs-toggle", "modal");
    botaoEditar.setAttribute("data-bs-target", "#form");

    botaoEditar.addEventListener("click", function (e) {
        editarItem(e);
    })

    const botaoDeletar = document.createElement("i");
    botaoDeletar.classList.add("fas", "fa-trash-alt");

    botaoDeletar.addEventListener("click", function () {
        deletarItem(itemDiv, id);
    })

    itemOptions.appendChild(botaoEditar);
    itemOptions.appendChild(botaoDeletar);

    itemDiv.appendChild(checkboxSpan);
    itemDiv.appendChild(itemNomeSpan);
    itemDiv.appendChild(itemQtdSpan);
    itemDiv.appendChild(itemTipoSpan);
    itemDiv.appendChild(itemStatusSpan);
    itemDiv.appendChild(itemOptions);

    itens.appendChild(itemDiv);

    resetarCampos();
}

const deletarItem = (e, id) => {

    //Apaga a div/registro inteiro com a função remove() 
    //É utilizado 'parentElement' duas vezes pois primeiro aponta pro pai de <i>, que é o span, depois aponta pro pai de <span>, que é a <div>
    e.remove();
    //Remove elemento do array
    listaDeCompras.apagarItem(id);

    //Atualiza no localStorage
    localStorage.setItem("listaDeCompras", JSON.stringify(listaDeCompras.itens));
}

//Pega o status do item como parâmetro e verifica o seu status.
const isItemComprado = (sts, itemDiv) => {
    if (sts === "sim") {
        itemDiv.style.textDecoration = "line-through";
        itemDiv.style.opacity = "0.5";
    }
}

const editarItem = (e) => {

    console.log(e);
    /*let itemSelecionado = e.parentElement.parentElement;

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
    deletarItem(e);*/


}

const resetarCampos = () => {
    inNome.value = "";
    inCategoria.value = "";
    inQuantidade.value = "";
}
