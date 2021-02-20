$("#filtro").selectmenu().addClass("overflow");
$(document).ready(() => $("#nomePagina").text("Finalizar pedidos"));
var pedidos = [];
var funcionarios = [];
var pizzas = [];
var dado = {};
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para finalizar!</td></tr>';
var [Tpedido, Tpizzas] = [0, 0];
var verificarTroco = 0;
var valorCupom;


if($("#btnCadastrar").val() == 1){
	$("#divCadastrar").show("slow");
	$("#divFiltro").hide("slow");
}


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");
$(document).ready(function(){
	$.ajax({
		url: "/finalizar/todosPedidos",
		type: 'GET'
	}).done(function(e){
		pedidos = e;
		for(pedido of pedidos){
			pedido.pizzas = JSON.parse(pedido.pizzas);
			pedido.produtos = JSON.parse(pedido.produtos);
		}
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(pedido of pedidos){
				linhaHtml += '<tr>'
							+ '<td class="text-center col-md-1">' + pedido.comanda + '</td>'
							+ '<td class="text-center col-md-1">' + pedido.nome + '</td>'
							+ '<td class="text-center col-md-1">R$ ' + mostrarTotalComTaxa(pedido).toFixed(2) + '</td>'
							+ '<td class="text-center col-md-1">' + (pedido.pago == 0 ? 'A Pagar' : 'Paga') + '</td>'
							+ '<td class="text-center col-md-1">' + pedido.envio + '</td>'
							+ '<td class="text-center col-md-1">' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" title="finalizar" class="btn btn-success" onclick="finalizarPedido()"'
								+ 'value="'+ pedido.id + '"><i class="fas fa-cart-arrow-down"></i></button></a></td>'			
						+ '<tr>'
					+ linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
		}
		carregarLoading("none");
	});
});	


//---------------------------------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idPedido = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idPedido) var idBusca = i;	
	
	//setar valores
	Tpizzas = 0;
	dado.totalPizza = 0;
	dado.totalProduto = 0;
	dado.totalLucro = 0;
	
	//contar total do lucro e de pizzas
	for(pizza of pedidos[idBusca].pizzas) {
		dado.totalLucro += pizza.custo;
		dado.totalPizza += pizza.qtd;
	}
	Tpizzas = dado.totalPizza;
	
	//contar total do lucro e de produtos
	for(produto of pedidos[idBusca].produtos) {
		dado.totalLucro += produto.custo;
		dado.totalProduto += produto.qtd;
	}
	Tpizzas += dado.totalProduto;
	
	//teste para cupom desativado
	/*
	try{
		 valorCupom = Number(pedidos[idBusca].cupom.replace(",", ".").replace("%", "").replace("R$",""));
	}catch(Exception){}
	*/

	
	//modal jquery confirmar
	if($("#filtro").val() == "--"){
		$.alert({
			type: 'red',
			title: 'Ops..',
			content: "Escolha um funcionário!",
			buttons: {
				confirm: {
					text: 'Escolher',
					btnClass: 'btn-success',
					keys: ['esc', 'enter']
				}
			}
		});
		return 0;
	}
		
	$.confirm({
		type: 'green',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: mostrarTabela(pedidos[idBusca]),
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			imprimir: {
				text: 'Imprimir',
				btnClass: 'btn btn-warning',
				action: () => imprimir(pedidos[idBusca])
			},
	        confirm: {
	            text: 'Finalizar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
					carregarLoading("block");

					if(pedidos[idBusca].pago == false) {
						var troco = this.$content.find('#troco').val();

						troco = parseFloat(troco.toString().replace(",","."));
						
						if(Number.isFinite(troco) == false) {
							carregarLoading("none");
							
							$.alert({
								type: 'red',
								title: 'OPS...',
								content: "Digite um valor válido",
								buttons: {
									confirm:{
										text: 'Voltar',
										btnClass: 'btn-danger',
										keys: ['esc', 'enter']
									}
								}
							});
						}
						
						verificarTroco = 1;
					}
					
					//total do pedido OBS: sem a taxa
					dado.totalVendas = pedidos[idBusca].total;
					
					if(pedidos[idBusca].envio == "ENTREGA") {
						dado.entrega = 1;
					}else if(pedidos[idBusca].envio == "BALCAO"){
						dado.balcao = 1;
					}else if(pedidos[idBusca].envio == "MESA"){
						dado.mesa = 1;
					}else if(pedidos[idBusca].envio == "DRIVE"){
						dado.drive = 1;
					}
					
					//salvar dados
					$.ajax({
						url: "/finalizar/dados/" + pedidos[idBusca].id,
						type: "POST",
						dataType : 'json',
						contentType: "application/json",
						data: JSON.stringify(dado)
					});
					
					$.ajax({
						url: "/finalizar/finalizarPedido/" + idPedido + '/' + $("#filtro").val(),
						type: 'POST'
					}).done(function(){
						window.location.href = "/finalizar";
						
					}).fail(function(){
						carregarLoading("none");
						if(verificarTroco == 0) $.alert("Pedido não enviado!");
						
						else $.alert("Pedido não enviado!<br>Digite um valor válido.");
					});
				}
	        },
		}
	});
};


//----------------------------------------------------------------------------
function imprimir(cliente) {
	
	impressaoPedido = cliente;

	impressaoPedido.pizzas = cliente.pizzas;
	impressaoPedido.produtos = cliente.produtos;

	if(cliente.obs != "") impressaoPedido.obs = cliente.obs;
				
	//salvar hora
	impressaoPedido.hora = cliente.horaPedido;
	impressaoPedido.data = cliente.data.split("-")[2] + "/" + cliente.data.split("-")[1] + "/" + cliente.data.split("-")[0];
	
	$.ajax({
		url: "/imprimir/imprimirPedido",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
}


//----------------------------------------------------------------------
function mostrarTabela(pedido){
	linhaHtml = '';
	if(pedido.pizzas.length != 0) {
		linhaHtml += '<table style="width:100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
					+ '</tr>';
		
		for(pizza of pedido.pizzas){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + pizza.qtd + " x " + pizza.sabor + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + pizza.preco.toFixed(2) + '</td>'
						 +	'<td class="text-center col-md-1">' + pizza.borda + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	if(pedido.produtos.length != 0) {
		linhaHtml += '<table style="width:100%">'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of pedido.produtos){
			linhaHtml += '<tr>'
						 +	'<td class="text-center col-md-1">' + produto.qtd + " x " + produto.sabor + '</td>'
						 +  '<td class="text-center col-md-1">R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
	
	linhaHtml += '<hr>';
	
	if(pedido.envio == "ENTREGA"){
		linhaHtml += '<br><b>Endereço:</b> ' + pedido.endereco
					+ '<br><b>Motoboy:</b> ' + pedido.motoboy;
	}
	
	if(pedido.pago == 0) 
		linhaHtml += '<br><b>Receber:</b>'
					+ '<div class="input-group mb-3">'
					+ '<span class="input-group-text">R$</span>'
					+ '<input class="form-control" id="troco" placeholder="Precisa de troco?" value="'
						+ mostrarTotalComTaxa(pedido) + '"/>'
				+ '</div>';
	
	linhaHtml += '<b>Total de Produtos:</b> ' + Tpizzas	
				+ '<br><b>Total do Pedido:</b> R$' + mostrarTotalComTaxa(pedido).toFixed(2)
				+ '<br><b class="fRight">Deseja finalizar o pedido?</b>';
	
	return linhaHtml;
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}


function isNumber(str) {
    return !isNaN(parseFloat(str))
}


function mostrarTotalComTaxa(cliente){
	if(isNumber(cliente.taxa) == true)
		return (cliente.total + cliente.taxa);
	else
		return cliente.total;
}