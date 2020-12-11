$("#filtro").selectmenu().addClass( "overflow" );
var pedidos = [];
var pizzas = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="8" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="8">Nenhum pedido para entregar!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/motoboy/todosPedidos",
	type: 'GET'
}).done(function(e){
	
	pedidos = e;
	for(pedido of pedidos){
		Tpedidos++;
		pedido.pizzas = JSON.parse(pedido.pizzas);
		pedido.produtos = JSON.parse(pedido.produtos);
	}
	$("#todosPedidos").html("");
	linhaHtml = "";
	
	if(pedidos.length == 0){
		$("#todosPedidos").html(pedidoVazio);
	}else{
		for(pedido of pedidos){
			linhaHtml += '<tr>'
						+ '<td>' + pedido.comanda + '</td>'
						+ '<td>' + pedido.nome + '</td>'
						+ '<td>' + pedido.endereco + '</td>';
			
			Tpizzas = 0;
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			
			linhaHtml += '<td>' + Tpizzas + '</td>'
						+ '<td>R$ ' + (pedido.total + Number(pedido.taxa)).toFixed(2) + '</td>'
						+ '<td>R$ ' + pedido.troco.toFixed(2) + '</td>'
						+ '<td>R$ ' + (pedido.troco - pedido.total - Number(pedido.taxa)).toFixed(2) + '</td>'	
						+ '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
							+ 'value="'+ pedido.id + '"><span class="oi oi-location"></span></button></a></td>'		
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
});


//------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
		
	
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um motoboy!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
	}else{
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nome,
		    content: 'Deseja entregar?',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						//pedidos[idBusca].motoboy = $("#filtro").val();
						pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
						pedidos[idBusca].produtos = JSON.stringify(pedidos[idBusca].produtos);
						
						var objeto = {};

						objeto.motoboy = $("#filtro").val();
						objeto.taxa = pedidos[idBusca].taxa;
						objeto.comanda = pedidos[idBusca].comanda;
						objeto.endereco = pedidos[idBusca].endereco;
						objeto.nome = pedidos[idBusca].nome;
						
						
						//buscar tabela de motoboys do dia
						$.ajax({
							url: "/motoboy/logMotoboys",
							type: "GET"
						}).done(function(e){
							logmotoboys = e;
							if(logmotoboys != '') logmotoboys = JSON.parse(logmotoboys);
							else logmotoboys = [];
							
							log = {};
							logmotoboys.unshift(objeto);
							log.pizzas = JSON.stringify(logmotoboys);

							$.ajax({
								url: "/motoboy/salvarMotoboys",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(log)
							});
						});
						
						//ENVIAR PEDIDO
						$.ajax({
							url: "/motoboy/enviarMotoboy/" + idProduto + '/' + $("#filtro").val(),
							type: 'PUT'
						}).done(function(){
							document.location.reload(true);
						});
						
					}
				},
		        cancel: {
		        	text: 'Voltar',
		            btnClass: 'btn-red',
		            keys: ['esc'],
		        },
			}
		});
	}
};
