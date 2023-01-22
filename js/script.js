let nome;
let para="Todos";
let tipo="message";

let IntervalUsuariosList;

let escolhaAnteriorU = undefined;
let escolhaAnteriorV = undefined;

let objetoMensagem = [];

function inicio(){
    let nomeDigitado = document.querySelector(".telaLogin input").value;
    nome = {name: nomeDigitado}

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
    
    requisicao.then(nomeAceito);
    requisicao.catch(nomeRecusado);

}
function listaUsuariosOnline(){
    IntervalUsuariosList = setInterval(()=>{
        const listaUsuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
        listaUsuarios.then((resposta)=>{
            const usuarioAtivos = document.querySelector('.usuariosOnline');
            usuarioAtivos.innerHTML = "";
            for(let i=0; i<resposta.data.length; i++){
                if(resposta.data[i].name===nome.name){
                    usuarioAtivos.innerHTML += `<div class="opcoes">
                    <ion-icon name="person-circle"></ion-icon>
                    <h2>Eu</h2> </div>`;
                }else{
                    usuarioAtivos.innerHTML += `<div onclick="opcaoUsuario(this)" class="opcoes">
                    <ion-icon name="person-circle"></ion-icon>
                    <h2>${resposta.data[i].name}</h2> </div>`;
                }
            }
        });
    }, 1000);

     /*Este setInterval está executando uma função arrow que verifica a lista de usuários online
    listaUsuarios está recebendo a promise e o then usado para executar essa requisição está com
    uma função arrow também, que vai inserir na página os usuários online*/
}
function nomeAceito(requisicao){
    document.querySelector(".telaLogin").classList.add('escondido');
    document.querySelector(".telaLoading img").parentNode.classList.remove('escondido');
    
    //colocar um gif carregando que sumirá junto com a tela de login no fim dessa funcao
    setInterval(()=>{
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    }, 5000);
    /*Este setInterval executa uma função que verifica se o usuário permanece logado.*/
    listaUsuariosOnline();
   
    
    chamarInserirAtualizarMensagens();
    setInterval(chamarInserirAtualizarMensagens, 3000);
    
    setTimeout(()=>{
        document.querySelector(".telaLoading img").parentNode.classList.add('escondido');
    }, 500);
    

}
function nomeRecusado(requisicao){
    alert("Esse nome já está em uso.");
    inicio();
}
function chamarInserirAtualizarMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(inserirAtualizarMensagens);
    promessa.catch(mensagensNaoRecebidas);
}
function inserirAtualizarMensagens(resposta){
    const mainMensagens = document.querySelector('main');
    mainMensagens.innerHTML = "";
    for(let i=0; i<resposta.data.length; i++){
       
        if(resposta.data[i].type==="status"){
            mainMensagens.innerHTML += `<div class="mensagensStatus">
            <span>
            <span class="tempo">(${resposta.data[i].time})</span>
            <span class="nomeUsuario">${resposta.data[i].from}</span>
            <span class="mensagemTexto">${resposta.data[i].text}</span>
            </span>
            </div>`;
        }else if(resposta.data[i].type==="message"){
            mainMensagens.innerHTML += `<div class="mensagensNaoPrivadas">
            <span>
            <span class="tempo">(${resposta.data[i].time})</span>
            <span class="nomeUsuario">${resposta.data[i].from}</span>
            <span> para </span>
            <span class="nomeUsuario">${resposta.data[i].to}:</span>
            <span class="mensagemTexto">${resposta.data[i].text}</span>
            </span>
            </div>`;
        }else if(resposta.data[i].type==="private_message"){
            mainMensagens.innerHTML += `<div class="mensagensPrivadas">
            <span>
            <span class="tempo">(${resposta.data[i].time})</span>
            <span class="nomeUsuario">${resposta.data[i].from}</span>
            <span> reservadamente para </span>
            <span class="nomeUsuario">${resposta.data[i].to}:</span>
            <span class="mensagemTexto">${resposta.data[i].text}</span>
            </span>
            </div>`;
        }
    }
    mainMensagens.scrollIntoView({block: "end"});
}
function mensagensNaoRecebidas(resposta){
    alert("Não foi possível receber os dados do servidor.");
}
function formatarMensagem(texto){
    
    let msg = {
        from: nome.name,
        to: para,
        text: texto,
        type: tipo
    }
    return msg;
}
function enviarMensagem(){
    let texto = document.querySelector("footer div input").value;
    objetoMensagem = [];
    
    objetoMensagem.push(formatarMensagem(texto));
    
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', objetoMensagem[0]);
    promessa.then((resposta)=>{
        chamarInserirAtualizarMensagens();
    });
    promessa.catch((resposta)=>{
        document.querySelector("footer input").classList.add('inputAlerta');
        setTimeout(()=>{
            document.querySelector("footer input").classList.remove('inputAlerta');
        }, 1000);
        
    });
}
function opcaoUsuario(escolhido){

    if(escolhido !== escolhaAnteriorU && escolhaAnteriorU !== undefined){
        escolhaAnteriorU.classList.remove("escolhida");
    }

    escolhido.classList.add("escolhida");

    escolhaAnteriorU = escolhido;
    para = escolhaAnteriorU.querySelector('h2').innerHTML;

    mensagemInput();
}
function mensagemInput(){
    const c = document.querySelector('footer div');

    if(tipo!=="message" && para!=="Todos"){
        c.innerHTML = "";
        c.innerHTML = `<input type="text" placeholder="Escreva aqui...">
        <p>Enviando para ${para} (Reservadamente) </p>`;
        return;
    }else if(para!="Todos"){
        c.innerHTML = "";
        c.innerHTML = `<input type="text" placeholder="Escreva aqui...">
        <p>Enviando para ${para} (Publicamente) </p>`;
        return;
    }
    c.innerHTML = `<input type="text" placeholder="Escreva aqui...">`;
}
function opcaoVisibilidade(escolhido){

    if(escolhido !== escolhaAnteriorV && escolhaAnteriorV !== undefined){
        escolhaAnteriorV.classList.remove("escolhida");
    }

    escolhido.classList.add("escolhida");
    escolhaAnteriorV = escolhido;
    if(escolhaAnteriorV.querySelector('h2').innerHTML!=="Público"){
        tipo = "private_message";
    }else{
        tipo = "message";
    }
    mensagemInput();
}

function abrirMenu(){
    document.querySelector('.menuSidebar').classList.remove('escondido');
    document.querySelector('.overlay').classList.remove('escondido');

    clearInterval(IntervalUsuariosList);
}
function fecharMenu(){
    if(tipo === "private_message" && (escolhaAnteriorU===undefined || para==="Todos")){
        alert("Você deve escolher para quem enviar a mensagem privada");
        return;
    }

    document.querySelector('.menuSidebar').classList.add('escondido');
    document.querySelector('.overlay').classList.add('escondido');
    
    listaUsuariosOnline();
    
}