var pedidos = [];
var pizzas = [];
var produtos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum pedido cancelado!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/adm/pedidosExcluidos/todosPedidos",
	type: 'PUT'
})
.done(function(e){
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
						+ '<td>' + pedido.nome + '</td>';

			Tpizzas = 0;

			for(produto of pedido.produtos) Tpizzas += produto.qtd;
			
			for(pizza of pedido.pizzas) Tpizzas += pizza.qtd;
			
			linhaHtml += '<td>' + Tpizzas + '</td>'
						+ '<td>R$ ' + pedido.total.toFixed(2) + '</td>'
						+ '<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" title="finalizar" class="botao" onclick="verPedido()"'
							+ 'value="'+ pedido.id + '"><span class="oi oi-magnifying-glass"></span></button></a></td>'			
					+ '<tr>'
				+ linhaCinza;
		}
		$("#todosPedidos").html(linhaHtml);
		$("#Tpedidos").html(Tpedidos);
	}
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
		linhaHtml = '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(pizza of pedidos[idBusca].pizzas){
			linhaHtml += '<tr>'
						 +	'<td>' + pizza.borda + '</td>'
						 +	'<td>' + pizza.sabor + '</td>'
						 +	'<td>' + pizza.obs + '</td>'
						 +	'<td>' + pizza.qtd + '</td>'
						 +  '<td>R$ ' + pizza.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	if(pedidos[idBusca].produtos.length != 0) {
		linhaHtml += '<table>'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(produto of pedidos[idBusca].produtos){
			linhaHtml += '<tr>'
						 +	'<td>' + produto.sabor + '</td>'
						 +	'<td>' + produto.obs + '</td>'
						 +	'<td>' + produto.qtd + '</td>'
						 +  '<td>R$ ' + produto.preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	
	linhaHtml += '<hr><b>Total de Produtos:</b> ' + Tpizzas + '<br><br>'
			+ '<b>Total do Pedido:</b> R$' + pedidos[idBusca].total.toFixed(2)
			+ '<br><b>Modo de Envio:</b> ' + pedidos[idBusca].envio
			+ '<br><b>Hora do pedido:</b> ' + pedidos[idBusca].horaPedido;

	$.alert({
		type: 'red',
	    title: 'Pedido: ' + pedidos[idBusca].nome,
	    content: linhaHtml,
	    closeIcon: true,
	    columnClass: 'col-md-8',
	    buttons: {
			tudo: {
			text: '<span class="oi oi-print"></span> Pedido',
	        btnClass: 'btn-success',
	        	action: function(){
					imprimirTudo(pedidos[idBusca]);
				}
			}
		}
	});
};



//-------------------------------------------------
function imprimirTudo(cliente) {
	//salvar hora atual
	var data = new Date();
	hora = data.getHours();
	hora = (hora.length == 0) ? '00' : hora;
	hora = (hora <= 9) ? '0'+hora : hora;
	minuto = data.getMinutes();
	minuto = (minuto.length == 0) ? '00' : minuto;
	minuto = (minuto <= 9) ? '0'+minuto : minuto;
	segundo = data.getSeconds();
	segundo = (segundo.length == 0) ? '00' : segundo;
	segundo = (segundo <= 9) ? '0'+segundo : segundo;
dia  = data.getDate().toString();
dia = (dia.length == 1) ? '0'+dia : dia;
mes  = (data.getMonth()+1).toString();
mes = (mes.length == 1) ? '0'+mes : mes;
ano = data.getFullYear();


//buscar dados da empresa
	$.ajax({
		url: '/novoPedido/empresa',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			
			impressaoPedido = {};
			impressaoPedido.nomeEstabelecimento = e.nomeEstabelecimento;//nome do estabelecimento
			impressaoPedido.envio = cliente.envio; //forma de envio
			impressaoPedido.texto1 = e.texto1;//texto1 gerado pela empresa
					
					//numero da comanda e nome
			impressaoPedido.comanda = cliente.comanda;
			impressaoPedido.nome = cliente.nome;
		
			//mostrar endereco do cliente
			if(cliente.envio == 'ENTREGA') {
				impressaoPedido.celular = cliente.celular
				impressaoPedido.endereco =  cliente.endereco;
			}
			impressaoPedido.pizzas = cliente.pizzas;
			impressaoPedido.produtos = cliente.produtos;
	
			
			//pagamento em entrega
			if(cliente.envio == 'ENTREGA') {//total com taxa
				impressaoPedido.total = cliente.total;
				impressaoPedido.taxa = cliente.taxa;
				
				//total sem taxa
			}else impressaoPedido.total = cliente.total;
	
			//total a levar de troco
			impressaoPedido.troco = cliente.troco;

			if(cliente.obs != null) impressaoPedido.obs = cliente.obs;
						
			//texto2 e promocao
			impressaoPedido.texto2 = e.texto2;
			impressaoPedido.promocao = e.promocao;
						
			//salvar hora
			impressaoPedido.hora = hora + ':' + minuto + ':' + segundo;
			impressaoPedido.data = dia + '/' + mes + '/' + ano;
			
			$.ajax({
				url: "/novoPedido/imprimirTudo",
				type: 'PUT',
				dataType : 'json',
				contentType: "application/json",
				data: JSON.stringify(impressaoPedido)
			});
		}
	});
}
