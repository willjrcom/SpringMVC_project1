var pedidos = [];
var linhaHtml= "";
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido cancelado!</td></tr>';
var Tpizzas = 0;
$(document).ready(() => $("#nomePagina").text("Pedidos excluídos"));

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
carregarLoading("block");

$.ajax({
	url: "/u/pedidosExcluidos/todosPedidos",
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
			Tpizzas = 0;
			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			
			linhaHtml += '<tr>'
						+ '<td>' + pedido.comanda + '</td>'
						+ '<td>' + pedido.nome + '</td>'
						+ '<td>' + Tpizzas + '</td>'
						+ '<td>' + pedido.modoPagamento + '</td>'
						+ '<td>'
							+ '<a title="Ver pedido" data-toggle="tooltip" data-html="true">'
							+ '<button class="botao" onclick="verPedido()"'
							+ 'value="'+ pedido.id + '"><i class="fas fa-search"></i></button></a></td>'			
					+ '<tr>';
		}
		$("#todosPedidos").html(linhaHtml);
	}
	carregarLoading("none");
});	


//-------------------------------------------------------------------------------------------------------
function verPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	//buscar dados completos do pedido enviado
	for(i in pedidos) if(pedidos[i].id == idProduto) var idBusca = i;
	
	Tpizzas = 0;
	for(produto of pedidos[idBusca].produtos) Tpizzas += produto.qtd;
	
	for(pizza of pedidos[idBusca].pizzas) Tpizzas += pizza.qtd;
	
	if(pedidos[idBusca].pizzas.length != 0) {
		linhaHtml = '<table class="table table-striped table-hover">'
					+ '<thead><tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
					+ '</tr></thead>';
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td>' + pizza.qtd + " x " + pizza.sabor + '</td>'
						 +  '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
						 +	'<td>' + pizza.borda + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table class="table table-striped table-hover">'
					+ '<thead><tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr></thead>';
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td>' + produto.qtd + " x " + produto.sabor + '</td>'
						 +  '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	linhaHtml += '<hr>'
				+ '<div class="row">'
				+ '<div class="col-md-6"><b>Total de Produtos:</b><br>' + Tpizzas + '</div>'
				+ '<div class="col-md-6"><b>Total do Pedido:</b> R$<br>' + mostrarTotalComTaxa(pedidos[idBusca]).toFixed(2) + '</div>'
				+ '<div class="col-md-6"><b>Modo de pagamento:</b><br>' + pedidos[idBusca].modoPagamento + '</div>'
				+ '<div class="col-md-6"><b>Modo de Envio:</b><br>' + pedidos[idBusca].envio + '</div>'
				+ '<div class="col-md-6"><b>Hora do pedido:</b><br>' + pedidos[idBusca].horaPedido + '</div>';
	
	if(pedidos[idBusca].envio === 'ENTREGA') {
		linhaHtml += '<div class="col-md-6"><b>Motoboy:</b><br>' + pedidos[idBusca].motoboy + '</div>'
					+ '<div class="col-md-6"><b>Endereço:</b><br>' + pedidos[idBusca].endereco + '</div>';
	}
	
	if(pedidos[idBusca].envio === 'MESA') {
		linhaHtml += '<div class="col-md-6"><b>Garçon:</b><br>' + pedidos[idBusca].garcon + '</div>'
					+ '<div class="col-md-6"><b>Serviços:</b><br>' + pedidos[idBusca].servico + ' %</div>';
	}
	linhaHtml += '</div>';
		
	$.alert({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml,
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			tudo: {
			text: '<i class="fas fa-print"></i> Pedido',
	        btnClass: 'btn-success',
	        	action: function(){
					imprimirTudo(pedidos[idBusca]);
				}
			}
		},
	    cancel: {
            isHidden: true, // hide the button
            keys: ['esc']
		}
	});
};



//-------------------------------------------------
function imprimirTudo(cliente) {
			
	impressaoPedido = cliente;
	impressaoPedido.setor = "A";
	
	$.ajax({
		url: "/imprimir/imprimirPedido",
		type: 'POST',
		dataType : 'json',
		contentType: "application/json",
		data: JSON.stringify(impressaoPedido)
	});
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

