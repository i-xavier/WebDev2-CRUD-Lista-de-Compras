// cria a classe ItemCompra para manipular os dados
class ItemCompra {
    constructor(nomeItem, tipoItem, qtdItem, statusItem) {
        this.nomeItem = nomeItem;
        this.tipoItem = tipoItem;
        this.qtdItem = qtdItem;
        this.statusItem = statusItem;
    }

}

// cria classe ListaItens
class ListaItens {

    constructor() {

        //cria uma constante que captura o que esta salvo no localStorage/ caso não tenha nada a lista é iniciada com []
        const dadosItens =
            JSON.parse(localStorage.getItem("listaDeCompras")) || [];

        //percorre cada um dos registros para instanciar os ItemCompra registrados
        this.itens = dadosItens.map(elemento => {
            return {
                id: elemento.id,
                item: new ItemCompra(
                    elemento.item.nomeItem,
                    elemento.item.tipoItem,
                    elemento.item.qtdItem,
                    elemento.item.statusItem
                )
            };
        });
    }



    gerarId() {

        //avalia se a lista esta vazia
        if (this.itens.length === 0) {
            return 1;
        }
        else {
            //retorna o último id livre
            let ultimoItem = this.ultimoItemLista();
            return ultimoItem + 1;
        }

    }

    adicionarItem(nomeItem, tipoItem, qtdItem, statusItem) {

        // gera id
        let idItem = this.gerarId();

        this.itens.push({
            id: idItem,
            item: new ItemCompra(nomeItem, tipoItem, qtdItem, statusItem)
        });

        //Atualiza no localStorage
        localStorage.setItem("listaDeCompras", JSON.stringify(this.itens));
    }

    apagarItem(id) {

        //com o filter é criado uma nova lista de itens sem o item que foi passado por parametro
        this.itens = this.itens.filter(item => item.id !== id);

        //Atualiza no localStorage
        localStorage.setItem("listaDeCompras", JSON.stringify(this.itens));

    }

    alterarItem(id, dados) {
        //procura o item passado por parametro
        const registro = this.itens.find(item => item.id === id);

        // se não for encontrado nada, retorna false
        if (!registro) {
            return false;
        }

        //copia os dados inputados pelo o usuário para o item encontrado anteriormente
        Object.assign(registro.item, dados);

        localStorage.setItem("listaDeCompras", JSON.stringify(this.itens));

        return true;
    }

    buscar(id) {

        //se lista vazia, retorna nulo
        if (this.itens.length === 0) {
            return null;
        }


        const itemEncontrado = this.itens.find(elemento => elemento.id === id);

        return itemEncontrado
    }

    getId(item) {

        const listaDeCompras = this.itens;

        //procura um registro de item que seja identico ao passado por parametro
        const idDoItem = listaDeCompras.find(i => i.item === item)

        //se não encontrar nada retorna nulo, se encontrar retorna o id
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

    getListaItens() {

        return this.itens;
    }

    marcarItem(statusItem, id) {

        //busca item
        let buscarItem = this.buscar(id);

        if (!buscarItem) {
            return;
        }

        //altera o status do item encontrado com o valor passado por parametro
        buscarItem.item.statusItem = statusItem;

        localStorage.setItem(
            "listaDeCompras",
            JSON.stringify(this.itens)
        );

        //atualiza no DOM
        atualizarRegistro(id);
    }

}

const marcarItem = function (statusItem, id) {

    //busca item
    let buscarItem = listaDeCompras.buscar(id);

    if (!buscarItem) {
        return;
    }

    //altera o status do item encontrado com o valor passado por parametro
    buscarItem.item.statusItem = statusItem;

    localStorage.setItem(
        "listaDeCompras",
        JSON.stringify(listaDeCompras.itens)
    );

    //atualiza no DOM
    atualizarRegistro(id);
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

const listaDeCompras = new ListaItens(); //instancia lista
let form = document.getElementById("form"); //Aponta para o formulário
let inNome = document.getElementById("inNome"); //Aponta para o espaço que captura o nome
let inQuantidade = document.getElementById("inQuantidade"); //Aponta para o espaço que captura a quantidade
let inCategoria = document.getElementById("inCategoria"); //Aponta para o espaço que captura a categoria
let msg = document.getElementById("msg"); //Aponta para o espaço que retornará mensagens a respeito de campos vazios
let itens = document.getElementById("itens"); //Aponta para o espaço onde os registros serão exibidos
let add = document.getElementById("add");
let idItemAlterar = null; //constante que guarda o id do item que foi selecionado para edição
let total = document.getElementById("total");
let totalItens = 0;

document.addEventListener('DOMContentLoaded', () => {

    const lista = listaDeCompras.getListaItens();

    //Percorre cada elemento contido em registro[]
    lista.forEach(function (registro) {

        contarTotalItens(1);
        //nome, tipo, qtd, sts, id
        adicionarItem(registro.item.nomeItem, registro.item.tipoItem, registro.item.qtdItem, registro.item.statusItem, registro.id);
    })

});

//caso o modal seja fechado
form.addEventListener("hidden.bs.modal", () => {

    //a constante que guarda o id do item em edição é resetada
    idItemAlterar = null;

})

const contarTotalItens = function (item){

    if(item === 1){
        totalItens++;
    }else if(item === 0){
        totalItens--;
    }

    total.innerText = totalItens;
} 


form.addEventListener("submit", (e) => {
    e.preventDefault();
    //Captura os valores dos inputs
    const nomeItem = inNome.value;
    const tipoItem = inCategoria.value;
    const qtdItem = Number(inQuantidade.value);
    const statusItem = document.querySelector('input[name="inStatus"]:checked').value;

    const verificarItem = { nome: nomeItem, tipo: tipoItem, qtd: qtdItem, status: statusItem };


    //Cria um objeto

    //analisa se há um item sendo editado ou não
    if (idItemAlterar === null) {
        if (validarDados(verificarItem)) {

            //esvazia qualquer mensagem que foi msotrada ao usuário anteriormente
            msg.innerHTML = '';

            gravarDado(nomeItem, tipoItem, qtdItem, statusItem);
            //listaDeCompras.adicionarItem(item);

            contarTotalItens(1);

            // Define temporariamente o atributo do Bootstrap para fechar o modal após o envio
            add.setAttribute("data-bs-dismiss", "modal");

            add.click();

            //remove o valor para as próximas adições
            add.setAttribute("data-bs-dismiss", "");

            alert('Item cadastrado!');

        } else {
            msg.innerHTML = 'Todos os campos devem ser preenchidos!';
        }

    } else {
        if (validarDados(verificarItem)) {

            msg.innerHTML = '';

            let item = new ItemCompra(nomeItem, tipoItem, qtdItem, statusItem);

            //passa o id do item sendo editdo e a instancia do objeto 
            listaDeCompras.alterarItem(idItemAlterar, item);

            //atualizar o registro na tela
            atualizarRegistro(idItemAlterar);

            add.setAttribute("data-bs-dismiss", "modal");

            add.click();

            //remove o valor para as próximas adições
            add.setAttribute("data-bs-dismiss", "");

            alert('Item editado!');

        } else {
            msg.innerHTML = 'Todos os campos devem ser preenchidos!';
        }
    }



});

const gravarDado = (nomeItem, tipoItem, qtdItem, statusItem) => {

    //salva os dados no repositório
    listaDeCompras.adicionarItem(nomeItem, tipoItem, qtdItem, statusItem);

    //Atualiza o DOM
    adicionarItem(nomeItem, tipoItem, qtdItem, statusItem, listaDeCompras.ultimoItemLista())

};

const adicionarItem = (nome, tipo, qtd, sts, id) => {

    //cria um elemento div 
    const itemDiv = document.createElement("div");
    itemDiv.id = id;

    isItemComprado(sts, itemDiv);

    //cria um span que guarda os dados a respeito do checkbox do item
    const checkboxSpan = document.createElement("span");

    const checkboxItem = document.createElement("input");

    checkboxItem.setAttribute("name", "isComprado");
    checkboxItem.setAttribute("type", "checkbox");
    checkboxItem.setAttribute("value", "sim");
    //checkboxItem.id = `comprado${id}`;
    checkboxItem.classList.add("checkbox");

    // Carrega o status salvo no localStorage
    checkboxItem.checked = (sts === "sim");

    checkboxSpan.appendChild(checkboxItem);

    //evento observa qualquer mudança feita no checkbox desse registro
    checkboxItem.addEventListener("change", function () {

        const status = this.checked ? "sim" : "nao";

        marcarItem(status, id, itemDiv);

    });

    //cria um span que guarda os dados a respeito do nome do item
    const itemNomeSpan = document.createElement("span");
    const conteudoNomeItem = document.createTextNode(nome);
    itemNomeSpan.appendChild(conteudoNomeItem);
    itemNomeSpan.classList.add("registros");

    //cria um span que guarda os dados a respeito do checkbox da quantidade
    const itemQtdSpan = document.createElement("span");
    const conteudoQtdItem = document.createTextNode(qtd);
    itemQtdSpan.appendChild(conteudoQtdItem);
    itemQtdSpan.classList.add("registros");

    //cria um span que guarda os dados a respeito do checkbox da categoria 
    const itemTipoSpan = document.createElement("span");
    const conteudoTipoItem = document.createTextNode(tipo);
    itemTipoSpan.appendChild(conteudoTipoItem);
    itemTipoSpan.classList.add("registros");

    //cria um span que guarda os dados a respeito do checkbox do status do item
    const itemStatusSpan = document.createElement("span");
    const conteudoStatusItem = document.createTextNode(sts);
    itemStatusSpan.appendChild(conteudoStatusItem);
    itemStatusSpan.classList.add("registros");

    //cria um span que guarda organiza os botões de ação como apagar e editar
    const itemOptions = document.createElement("span");
    itemOptions.classList.add("options");

    const botaoEditar = document.createElement("i");
    botaoEditar.classList.add("fas", "fa-edit");
    botaoEditar.setAttribute("data-bs-toggle", "modal");
    botaoEditar.setAttribute("data-bs-target", "#form");

    //"ouve" os cliques no botão editar
    botaoEditar.addEventListener("click", function () {
        editarItem(id);
    })

    const botaoDeletar = document.createElement("i");
    botaoDeletar.classList.add("fas", "fa-trash-alt");

    //"ouve" os cliques no botão apagar
    botaoDeletar.addEventListener("click", function () {
        deletarItem(itemDiv, id);

    })

    //"cola" os elementos que ficarão dentro do conteiner de botões
    itemOptions.appendChild(botaoEditar);
    itemOptions.appendChild(botaoDeletar);

    //"cola" todos os elementos que se encontram dentro da div
    itemDiv.appendChild(checkboxSpan);
    itemDiv.appendChild(itemNomeSpan);
    itemDiv.appendChild(itemQtdSpan);
    itemDiv.appendChild(itemTipoSpan);
    itemDiv.appendChild(itemStatusSpan);
    itemDiv.appendChild(itemOptions);

    //joga a div para um local dentro do html para que o usuário veja o registro
    itens.appendChild(itemDiv);

}

const deletarItem = (e, id) => {

    //Apaga a div/registro inteiro com a função remove() 
    //É utilizado 'parentElement' duas vezes pois primeiro aponta pro pai de <i>, que é o span, depois aponta pro pai de <span>, que é a <div>
    e.remove();

    //Remove item do total
    contarTotalItens(0);

    //Remove elemento do array
    listaDeCompras.apagarItem(id);


}

//Pega o status do item como parâmetro e verifica o seu status.
const isItemComprado = (sts, itemDiv) => {

    //muda o style da div para deixar claro o estado do item
    if (sts === "sim") {
        itemDiv.style.backgroundColor = "#d1e7dd"; // Verde bem suave (padrão 'success' do Bootstrap)
        itemDiv.style.color = "#0f5132"; // Texto em um verde mais escuro para dar contraste
        itemDiv.style.opacity = "0.8";
    } else {
        itemDiv.style.backgroundColor = "";
        itemDiv.style.color = "";
        itemDiv.style.opacity = "";
    }
}

const atualizarRegistro = function (id) {

    //captura a div que precisa ser carregada
    const pai = document.getElementById(id);
    const filhos = pai.children;
    //busca os dados registrados no localStorage
    const elemento = listaDeCompras.buscar(id);

    const sts = elemento.item.statusItem;
    //const sts = document.querySelector(`input[name="inStatus"][value="${elemento.item.statusItem}"]`);

    filhos[0].querySelector('input').checked = (sts === 'sim');
    filhos[1].innerText = elemento.item.nomeItem;
    filhos[2].innerText = elemento.item.qtdItem;
    filhos[3].innerText = elemento.item.tipoItem;
    filhos[4].innerText = sts;

    //atualiza como o registro deve ser mostrado oa usuário por conta do status
    isItemComprado(sts, pai)

}

const editarItem = (id) => {
    const elemento = listaDeCompras.buscar(id);

    // Acessando as propriedades corretas dentro de 'item'
    inNome.value = elemento.item.nomeItem;
    inCategoria.value = elemento.item.tipoItem;
    inQuantidade.value = elemento.item.qtdItem;

    // Marcando o radio button correto (sim ou nao)
    document.querySelector(`input[name="inStatus"][value="${elemento.item.statusItem}"]`).checked = true;

    idItemAlterar = id;
}

const resetarCampos = () => {
    inNome.value = "";
    inCategoria.value = "";
    inQuantidade.value = "";
}
