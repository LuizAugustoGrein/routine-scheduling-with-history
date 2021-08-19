let input1 = document.querySelector('input[name=proposta]');
let input2 = document.querySelector('input[name=dia]');
let btn = document.querySelector('#botao');
let grupo = document.querySelector("#grupo-lista");
let erro = document.getElementById('erro');
let dados = JSON.parse(localStorage.getItem('dados')) || [];
let historico = JSON.parse(localStorage.getItem('historico')) || [];

let hoje = new Date();
let clique = 0;

renderizarPropostas();

function renderizarPropostas(){
    ordenarDatas();
    for(let i = 0; i < dados.length; i++){
        let diaSelecao = (new Date(dados[i].dias)).getDate();
        let mesSelecao = (new Date(dados[i].dias)).getMonth()+1;
        let anoSelecao = (new Date(dados[i].dias)).getFullYear();
        let horaSelecao = (new Date(dados[i].dias)).getHours();
        let minutoSelecao = (new Date(dados[i].dias)).getMinutes();
        if(diaSelecao < 10){diaSelecao = "0" + diaSelecao;}
        if(mesSelecao < 10){mesSelecao = "0" + mesSelecao;}
        if(horaSelecao < 10){horaSelecao = "0" + horaSelecao;}
        if(minutoSelecao < 10){minutoSelecao = "0" + minutoSelecao;}

        let selecaoData = `${diaSelecao}/${mesSelecao}/${anoSelecao}`;
        let selecaoHora = `${horaSelecao}:${minutoSelecao}`;

        let itemLista = document.createElement('li');
        let lista = document.getElementById(selecaoData);
        itemLista.setAttribute('class','list-group-item list-group-item-action');
        let itemTexto = document.createTextNode(`${selecaoHora} - ${dados[i].propostas}`);
        itemLista.appendChild(itemTexto);
        lista.appendChild(itemLista);

        itemLista.onclick = function(){

            function adicionarOpcoes(){
                let botaoDeletar = document.createElement('button');
                botaoDeletar.setAttribute('class','btn btn-secondary opcoes');
                botaoDeletar.setAttribute('type','button');
                let textoDeletar = document.createTextNode(`Deletar`);
                botaoDeletar.appendChild(textoDeletar);
                lista.insertBefore(botaoDeletar, itemLista.nextSibling);

                botaoDeletar.onclick = function(){
                    deletarProposta(i);
                    if(dados.length == 0){
                        grupo.innerHTML = '';
                    }
                    clique = 0;
                }

                let botaoConcluir = document.createElement('button');
                botaoConcluir.setAttribute('class','btn btn-primary opcoes');
                botaoConcluir.setAttribute('type','button');
                let textoConcluir = document.createTextNode(`Concluir Tarefa`);
                botaoConcluir.appendChild(textoConcluir);
                lista.insertBefore(botaoConcluir, botaoDeletar.nextSibling);

                botaoConcluir.onclick = function(){
                    concluirProposta(i);
                    if(dados.length == 0){
                        grupo.innerHTML = '';
                    }
                    clique = 0;
                }
            }
            
            if(clique == 0){
                adicionarOpcoes();
                clique = 1;
            }else if(clique == 1){
                removerOpcoes();
                clique = 0;
            }
        }
    }
}

function removerOpcoes(){
    let todosBotoes = document.querySelectorAll('.opcoes');
    let localizacao = document.querySelector('ul');
    for(let i = 0;i < todosBotoes.length;i++){
        localizacao = todosBotoes[i].parentNode;
        localizacao.removeChild(todosBotoes[i]);
    }
}

function ordenarDatas(){
    let dias_ordenados = dados.sort((a, b) => new Date(a.dias) - new Date(b.dias));

    let dias_ordenados_formatado = [];
    let semanas_ordenados_formatado = [];
    let hoje_formatado = `${hoje.getDate()}/${hoje.getMonth()+1}/${hoje.getFullYear()}`;

    for(let i = 0; i < dias_ordenados.length; i++){
        let dia_num = new Date (dias_ordenados[i].dias).getDate();
        let mes_num = new Date (dias_ordenados[i].dias).getMonth()+1;
        let ano_num = new Date (dias_ordenados[i].dias).getFullYear();
        if(dia_num < 10){
            dia_num = "0"+dia_num;
        }
        if(mes_num < 10){
            mes_num = "0"+mes_num;
        }
        let dia_formatado = `${dia_num}/${mes_num}/${ano_num}`;

        if(new Date(dias_ordenados[i].dias) > new Date(hoje) || dia_formatado == hoje_formatado){
            let dia_semana1 = new Array('Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado');
            let semana_formatado = dia_semana1[new Date(dias_ordenados[i].dias).getDay()];
            let s1 = 0;
            for(y = 0; y < dias_ordenados_formatado.length; y++){
                if(dia_formatado == dias_ordenados_formatado[y]){
                    s1 = 1;
                }
            }
            if(s1 == 0){
                dias_ordenados_formatado.push(dia_formatado);
                semanas_ordenados_formatado.push(semana_formatado);
            }
        }else{
            concluirProposta(i);
            if(dados.length == 0){
                grupo.innerHTML = '';
            }
            clique = 0;
        }
    }

    for(let i = 0; i < dias_ordenados_formatado.length; i++){
        grupo.innerHTML ='';
    }

    for(let i = 0; i < dias_ordenados_formatado.length; i++){
        let itemDia = document.createElement('p');
        let diaTexto = document.createTextNode(`${dias_ordenados_formatado[i]} (${semanas_ordenados_formatado[i]})`);
        if(dias_ordenados_formatado[i] == hoje_formatado){
            itemDia = document.createElement('h5');
            diaTexto = document.createTextNode(`HOJE - ${dias_ordenados_formatado[i]} (${semanas_ordenados_formatado[i]})`);
        }
        itemDia.appendChild(diaTexto);
        grupo.appendChild(itemDia);
        let lista = document.createElement('ul');
        lista.setAttribute("id", dias_ordenados_formatado[i]);
        grupo.appendChild(lista);
    }
}

btn.onclick = function(){
    let novaProposta = input1.value;

    let hoje = new Date();
    let dia1 = hoje.getDate();
    let mes1 = hoje.getMonth()+1;
    let ano1 = hoje.getFullYear();

    let data = new Date(input2.value);
    let dia = data.getDate();
    let mes = data.getMonth()+1;
    let ano = data.getFullYear();

    if((data > hoje) || (dia == dia1 && mes == mes1 && ano == ano1)){
        console.log(novaProposta);
        if(novaProposta !== "" && novaProposta !== "Digite uma proposta"){
            let proposta1 = input1.value;
            dados.push({propostas: proposta1, dias: new Date(data)});
            renderizarPropostas(this);
            input1.value = '';
            input2.value = null;
            salvarDadosNostorage();
            removerErro();
        }else{
            removerErro();
            let erro1 = document.createElement('span');
            erro1.setAttribute('class', 'alert alert-warning');
            let erroMsg = document.createTextNode("Erro! os campos devem ser preenchidos.")
            erro1.appendChild(erroMsg);
            erro.appendChild(erro1);
            input1.focus();
        };
    }else{
        removerErro();
        let erro1 = document.createElement('span');
        erro1.setAttribute('class', 'alert alert-warning');
        let erroMsg = document.createTextNode("Erro! digite uma data maior ou igual a atual.")
        erro1.appendChild(erroMsg);
        erro.appendChild(erro1);
        input2.focus();
    }
}

function deletarProposta(indice){
    dados.splice(indice, 1);
    renderizarPropostas();
    salvarDadosNostorage();
}

function concluirProposta(indice){
    historico.push(dados[indice]);
    dados.splice(indice, 1);
    renderizarPropostas();
    salvarDadosNostorage();
}

function removerErro(){
    let spans = document.querySelectorAll('span');
    for(let i = 0;i < spans.length;i++){
        erro.removeChild(spans[i]);
    }
}

function salvarDadosNostorage(){
    localStorage.setItem('dados',JSON.stringify(dados));
    localStorage.setItem('historico',JSON.stringify(historico));
}