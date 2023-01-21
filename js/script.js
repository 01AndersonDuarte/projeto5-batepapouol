let nome;
const mensagens = [];

function inicio(){
    nome = {name: prompt("Informe o seu nome: ")}

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
    
    requisicao.then(nomeAceito);
    requisicao.catch(nomeRecusado);

}
inicio();

function nomeAceito(requisicao){
    setInterval(()=>{
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    }, 5000);
    /*Este setInterval executa uma função que verifica se o usuário permanece logado.*/
    setInterval(()=>{
        const listaUsuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
        listaUsuarios.then((resposta)=>{
            const usuarioAtivos = document.querySelector('.usuariosOnline');
            usuarioAtivos.innerHTML = "";
            for(let i=0; i<resposta.data.length; i++){
                usuarioAtivos.innerHTML += `<div class="opcoes">
                <ion-icon name="person-circle"></ion-icon>
                <h2>${resposta.data[i].name}</h2>
            </div>`;
            }
        });
    }, 1000);
    /*Este setInterval está executando uma função arrow que verifica a lista de usuários online
    listaUsuarios está recebendo a promise e o then usado para executar essa requisição está com
    uma função arrow também, que vai inserir na página os usuários online*/
    
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mensagensRecebidas);
    promessa.catch(mensagensNaoRecebidas);

}
function nomeRecusado(requisicao){
    alert("Esse nome já está em uso.");
    inicio();
}

function inserirAtualizarMensagens(){
    const mainMensagens = document.querySelector('main');
    for(let i=0; i<mensagens.length; i++){
       
        if(mensagens[i].type==="status"){
            mainMensagens.innerHTML += `<div class="mensagensStatus">
            <span>
            <span class="tempo">(${mensagens[i].time})</span>
            <span class="nomeUsuario">${mensagens[i].from}</span>
            <span class="mensagemTexto">${mensagens[i].text}</span>
            </span>
            </div>`;
        }else if(mensagens[i].type==="message"){
            mainMensagens.innerHTML += `<div class="mensagensNaoPrivadas">
            <span>
            <span class="tempo">(${mensagens[i].time})</span>
            <span class="nomeUsuario">${mensagens[i].from}</span>
            <span> para </span>
            <span class="nomeUsuario">${mensagens[i].to}:</span>
            <span class="mensagemTexto">${mensagens[i].text}</span>
            </span>
            </div>`;
        }else if(mensagens[i].type==="private_message"){
            mainMensagens.innerHTML += `<div class="mensagensPrivadas">
            <span>
            <span class="tempo">(${mensagens[i].time})</span>
            <span class="nomeUsuario">${mensagens[i].from}</span>
            <span> reservadamente para </span>
            <span class="nomeUsuario">${mensagens[i].to}:</span>
            <span class="mensagemTexto">${mensagens[i].text}</span>
            </span>
            </div>`;
        }
        
    }
}
function mensagensRecebidas(resposta){
    console.log(resposta.data);
    for(let i=0; i<resposta.data.length; i++){
        mensagens.push(resposta.data[i]);
    }
    inserirAtualizarMensagens();
}
function mensagensNaoRecebidas(resposta){
    alert("Não foi possível receber os dados do servidor.");
}




function abrirMenu(){
    document.querySelector('.menuSidebar').classList.remove('escondido');
    document.querySelector('.overlay').classList.remove('escondido');


    /*const overlay = document.querySelector('.overlay');
    // remover a classe escondido
    overlay.classList.remove('escondido');*/
}
function fecharMenu(){
    document.querySelector('.menuSidebar').classList.add('escondido');
    document.querySelector('.overlay').classList.add('escondido');
}