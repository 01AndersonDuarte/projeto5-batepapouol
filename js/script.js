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