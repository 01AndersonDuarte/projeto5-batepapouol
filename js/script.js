let nome;
const mensagens = [];

function inicio(){
    nome = {name: prompt("Informe o seu nome: ")}

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
    
    requisicao.then(nomeAceito);
    requisicao.catch(nomeRecusado);

}
inicio();

function confirmacaoDePermanencia(){
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
}

function nomeAceito(requisicao){
    console.log("Status code: " + requisicao.status);
    /*setInterval(confirmacaoDePermanencia, 5000);*/
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mensagensRecebidas);
    promessa.catch(mensagensNaoRecebidas);

}
function nomeRecusado(requisicao){
    console.log("Status code: " + requisicao.response.status);
    alert("Esse nome já está em uso.");
    inicio();
}

function inserirAtualizarMensagens(){
    const mainMensagens = document.querySelector('main');
    for(let i=0; i<mensagens.length; i++){
        mainMensagens.innerHTML += `<div>
        <span>${mensagens[i].time}</span>
        <span>${mensagens[i].from}</span>
        <span>${mensagens[i].text}</span>
        </div>`;
    }
}
function mensagensRecebidas(resposta){
    alert("Dados recebidos!");
    for(let i=0; i<resposta.data.length; i++){
        mensagens.push(resposta.data[i]);
    }
    inserirAtualizarMensagens();
}
function mensagensNaoRecebidas(resposta){
    alert("Não foi possível receber os dados do servidor.");
    console.log(resposta);
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