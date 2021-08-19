let grupo = document.querySelector("#grupo-lista");
let historico = JSON.parse(localStorage.getItem('historico')) || [];
let dados = JSON.parse(localStorage.getItem('dados')) || [];

let clique = 0;

renderizarHistorico();

function renderizarHistorico(){
    ordenarDatas();
    for(let i = 0; i < historico.length; i++){
        let diaSelecao = (new Date(historico[i].dias)).getDate();
        let mesSelecao = (new Date(historico[i].dias)).getMonth()+1;
        let anoSelecao = (new Date(historico[i].dias)).getFullYear();
        let horaSelecao = (new Date(historico[i].dias)).getHours();
        let minutoSelecao = (new Date(historico[i].dias)).getMinutes();
        if(diaSelecao < 10){diaSelecao = "0" + diaSelecao;}
        if(mesSelecao < 10){mesSelecao = "0" + mesSelecao;}
        if(horaSelecao < 10){horaSelecao = "0" + horaSelecao;}
        if(minutoSelecao < 10){minutoSelecao = "0" + minutoSelecao;}

        let selecaoData = `${diaSelecao}/${mesSelecao}/${anoSelecao}`;
        let selecaoHora = `${horaSelecao}:${minutoSelecao}`;

        let itemLista = document.createElement('li');
        let lista = document.getElementById(selecaoData);
        itemLista.setAttribute('class','list-group-item list-group-item-action');
        let itemTexto = document.createTextNode(`${selecaoHora} - ${historico[i].propostas}`);
        itemLista.appendChild(itemTexto);
        lista.appendChild(itemLista);

        itemLista.onclick = function(){

            function adicionarOpcoes(){
                let botaoDeletar = document.createElement('button');
                botaoDeletar.setAttribute('class','btn btn-secondary deletar');
                botaoDeletar.setAttribute('type','button');
                let textoDeletar = document.createTextNode(`Deletar Atividade do Histórico`);
                botaoDeletar.appendChild(textoDeletar);
                lista.insertBefore(botaoDeletar, itemLista.nextSibling);

                botaoDeletar.onclick = function(){
                    deletarHistorico(i);
                    if(historico.length == 0){
                        grupo.innerHTML = '';
                    }
                    clique = 0;
                }
            }

            function removerOpcoes(){
                let todosBotoes = document.querySelectorAll('.deletar');
                let localizacao = document.querySelector('ul');
                for(let i = 0;i < todosBotoes.length;i++){
                    localizacao = todosBotoes[i].parentNode;
                    localizacao.removeChild(todosBotoes[i]);
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

function ordenarDatas(){
    let dias_ordenados = historico.sort((a, b) => new Date(a.dias) - new Date(b.dias));

    let dias_ordenados_formatado = [];
    let semanas_ordenados_formatado = [];

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
    }

    for(let i = 0; i < dias_ordenados_formatado.length; i++){
        grupo.innerHTML ='';
    }

    for(let i = 0; i < dias_ordenados_formatado.length; i++){
        let itemDia = document.createElement('p');
        let diaTexto = document.createTextNode(`${dias_ordenados_formatado[i]} (${semanas_ordenados_formatado[i]})`);
        itemDia.appendChild(diaTexto);
        grupo.appendChild(itemDia);
        let lista = document.createElement('ul');
        lista.setAttribute("id", dias_ordenados_formatado[i]);
        grupo.appendChild(lista);
    }
}

function deletarHistorico(indice){
    historico.splice(indice, 1);
    renderizarHistorico();
    salvarDadosNostorage();
}

function limparHistorico(){
    while(historico.length > 0){
        historico.pop();
    }
    if(historico.length == 0){
        grupo.innerHTML = '';
    }
    clique = 0;
    renderizarHistorico();
    salvarDadosNostorage();
}

function salvarDadosNostorage(){
    localStorage.setItem('historico',JSON.stringify(historico));
    localStorage.setItem('dados',JSON.stringify(dados));
}