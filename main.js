
const KEY_BD = '@usuarioestudo'

var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    renderizar();
}

function renderizar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        tbody.innerHTML = listaRegistros.usuarios
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                            <td>${usuario.id}</td> 
                            <td>${usuario.nome}</td> 
                            <td>${usuario.unidadeMedida}</td> 
                            <td>${usuario.quantidade}</td> 
                            <td>${usuario.preco}</td> 
                            <td>${usuario.produtoPerecivel}</td> 
                            <td>${usuario.dataValidade}</td>
                            <td>${usuario.dataFabricacao}</td>
                            <td>
                                <button onclick='visualizar("cadastro", false , ${usuario.id})' class="btn btn-secondary">Editar</button>
                                
                                <button onclick='confirmarExcluir(${usuario.id})' class="btn btn-danger">Deletar</button>
                            </td>
                        </tr>`
            }).join('')
    }
}

function insertUsuario(nome, unidadeMedida, quantidade, preco, produtoPerecivel, dataValidade, dataFabricacao){
    const id = listaRegistros.ultimoIdGerado +1;
    listaRegistros.ultimoIdGerado =id;
    listaRegistros.usuarios.push({
        id, nome, unidadeMedida, quantidade, preco, produtoPerecivel, dataValidade, dataFabricacao
    })
    gravarBD();
    renderizar();
    visualizar('lista');
}

function editUsuario(id, nome, unidadeMedida, quantidade, preco, produtoPerecivel, dataValidade, dataFabricacao){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome ;
    usuario.unidadeMedida = unidadeMedida;
    usuario.quantidade = quantidade;
    usuario.preco = preco;
    usuario.produtoPerecivel = produtoPerecivel;
    usuario.dataValidade = dataValidade;
    usuario.dataFabricacao = dataFabricacao;
    gravarBD();
    renderizar();
    visualizar('lista');
}

function deleteUserUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    })
    gravarBD();
    renderizar();
}

function confirmarExcluir(id){
    if(confirm('Você deseja remover esse item? ' +id)){
        deleteUserUsuario(id);
    }
}

function limparEdicao(){
    document.getElementById('nome').value = '';
    document.getElementById('unidadeMedida').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('produtoPerecivel').value = 'undefined';
    document.getElementById('dataValidade').value = '';
    document.getElementById('dataFabricacao').value = '';

}

function visualizar(pagina, novo=false, id=null) {
    document.body.setAttribute('page', pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find(usuario => usuario.id === id)
            if(usuario){
                document.getElementById('id').value = usuario.id;
                document.getElementById('nome').value = usuario.nome;
                document.getElementById('unidadeMedida').value = usuario.unidadeMedida;
                document.getElementById('quantidade').value = usuario.quantidade;
                document.getElementById('preco').value =  usuario.preco;
                document.getElementById('produtoPerecivel').value = usuario.produtoPerecivel;
                document.getElementById('dataValidade').value = usuario.dataValidade;
                document.getElementById('dataFabricacao').value = usuario.dataFabricacao;
            }
        }
        document.getElementById('nome').focus();
    }
}

function submeter(e){
    e.preventDefault()
    const data = {
        id : document.getElementById('id').value,
        nome : document.getElementById('nome').value,
        unidadeMedida : document.getElementById('unidadeMedida').value,
        quantidade : document.getElementById('quantidade').value,
        preco : document.getElementById('preco').value,
        produtoPerecivel : document.getElementById('produtoPerecivel').value,
        dataValidade : document.getElementById('dataValidade').value,
        dataFabricacao : document.getElementById('dataFabricacao').value,
    }
    if(data.id){
       /*  editUsuario(...data); */
       editUsuario(
        data.id,
        data.nome,
        data.unidadeMedida,
        data.quantidade,
        data.preco,
        data.produtoPerecivel,
        data.dataValidade,
        data.dataFabricacao,
       )
      
    }else{
        insertUsuario(
            data.nome,
            data.unidadeMedida,
            data.quantidade,
            data.preco,
            data.produtoPerecivel,
            data.dataValidade,
            data.dataFabricacao,
        )
    }
}

window.addEventListener('load', () =>{
    lerBD();
    document.getElementById('cadastro-registros').addEventListener('submit', submeter);
})