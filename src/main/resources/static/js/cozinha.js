var pedidos = [];
var produtos = [];
var pizzas = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="7" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhum pedido para fazer!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;
var AllPizzas = 0;
var divisao;

//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);
	
	function buscarPedido() {
	pedidos = [];
	produtos = [];
	pizzas = [];
	Tpedidos = 0;
	Tpizzas = 0;
	AllPizzas = 0;
	
	$.ajax({
		url: "/cozinha/todosPedidos",
		type: 'PUT'
	})
	.done(function(e){
		console.log(e);
		
		for(var i = 0; i< e.length; i++){
			if(e[i].status == "COZINHA"){
				Tpedidos++;
				
				pedidos.push({
					'id' : e[i].id,
					'nomePedido' : e[i].nomePedido,
					'celular' : e[i].celular,
					'endereco': e[i].endereco,
					'envio': e[i].envio,
					'total': e[i].total,
					'troco': e[i].troco,
					'pagamento': e[i].pagamento,
					'produtos' : e[i].produtos,
					'pizzas' : JSON.parse(e[i].pizzas)
				});
			}
		}
		
		$("#todosPedidos").html("");
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				divisao = 1;
				
				linhaHtml += '<tr>';
				linhaHtml +=	'<td>' + pedidos[i].id + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].nomePedido + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pizzas[0].borda + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pizzas[0].qtd + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pizzas[0].sabor + '</td>';
				linhaHtml +=	'<td>' + pedidos[i].pizzas[0].obs + '</td>';
				if(i == 0) {//adicionar autofocus
					linhaHtml +=	'<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" autofocus="autofocus" onclick="enviarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
				}else {
					linhaHtml +=	'<td>' 
							+ '<a class="enviarPedido">'
							+ '<button type="button" class="btn btn-success" onclick="enviarPedido()"'
							+ 'value="'+ pedidos[i].id + '">Enviar</button></a></td>';
				}
				
				linhaHtml += '</tr>';
				
				if(divisao - pedidos[i].pizzas[0].qtd <= 0) {
					linhaHtml += linhaCinza;
					divisao = 1;
				}else {
					divisao -= pedidos[i].pizzas[0].qtd;
				}
				
				//mostrar produtos
				if(pedidos[i].pizzas.length > 1){
					for(var j = 1; j<pedidos[i].pizzas.length; j++){
						linhaHtml += '<tr>';
						
						if(j == 1) {
							Tpizzas = 0;
							for(var k = 0; k<pedidos[i].pizzas.length; k++) {
								Tpizzas += pedidos[i].pizzas[k].qtd;
							}
							AllPizzas += Tpizzas;
							
							if(Tpizzas == 1) {
								linhaHtml += '<td colspan="2">' + Tpizzas + ' pizza</td>';
							}else {
								linhaHtml += '<td colspan="2">' + Tpizzas + ' pizzas</td>';
							}
							
						}else {
							linhaHtml +=	'<td colspan="2"></td>';
						}
						linhaHtml +=	'<td>' + pedidos[i].pizzas[j].borda + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[j].qtd + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[j].sabor + '</td>';
						linhaHtml +=	'<td>' + pedidos[i].pizzas[j].obs + '</td>';
						linhaHtml +=	'<td></td>';
						linhaHtml += '</tr>';	
	
						if(divisao - pedidos[i].pizzas[j].qtd <= 0) {
							linhaHtml += linhaCinza;
							divisao = 1;
						}else {
							divisao -= pedidos[i].pizzas[j].qtd;
						}
					}
				}
	
				linhaHtml += linhaCinza;
				linhaHtml += linhaCinza;
				linhaHtml += linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			
		}
		if(Tpedidos == 0) {
			$("#Tpedidos").text('0');
		}else {
			$("#Tpedidos").text(pedidos.length);
		}
		
		if(AllPizzas == 0) {
			$("#Tpizzas").text('0');
		}else {
			$("#Tpizzas").text(AllPizzas);
		}
	});	
};
	
//----------------------------------------------------------------------------------------------------------
function enviarPedido() {
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	var urlEnviar = "/cozinha/enviarPedido/" + idProduto.toString();
	console.log(urlEnviar);
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
	
	$.confirm({
		icon: 'fa fa-spinner fa-spin',
		type: 'green',
	    typeAnimated: true,
	    title: 'Pedido: ' + pedidos[idBusca].nomePedido.split(' ')[0],
	    content: 'Enviar pedido?',
	    buttons: {
	        confirm: {
	            text: 'Enviar',
	            btnClass: 'btn-green',
	            keys: ['enter'],
	            action: function(){
		
					pedidos[idBusca].pizzas = JSON.stringify(pedidos[idBusca].pizzas);
					
					$.ajax({
						url: urlEnviar,
						type: 'PUT',
						data: pedidos[idBusca], //dados completos do pedido enviado
					})
					.done(function(e){
						console.log(e);
						document.location.reload(true);
					});
			    },
			},
			cancel: {
	        	text: 'Voltar',
	            btnClass: 'btn-red',
	            keys: ['esc'],
	        },
		}
	});
};
//ajax reverso
function init() {
	console.log("dwr init....");
	dwr.engine.setActiveReverseAjax(true);
};


//recarregar a cada 5 segundos
buscarPedido();

setInterval(function (){
	buscarPedido();
},5000);
