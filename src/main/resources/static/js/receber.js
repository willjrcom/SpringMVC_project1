var pedidos = [];
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList"></td></tr>';
var pedidoVazio = '<tr><td colspan="7">Nenhuma entrega para receber!</td></tr>';
var Tpedidos = 0;
var Tpizzas = 0;


//Ao carregar a tela
//-------------------------------------------------------------------------------------------------------------------
$("#todosPedidos").html(linhaCinza);

$.ajax({
	url: "/receber/todosPedidos",
	type: 'PUT'
})
.done(function(e){
	
	for(var i = 0; i< e.length; i++){
		if(e[i].status == "MOTOBOY"){
			Tpedidos++;
			
			pedidos.push({
				'id' : e[i].id,
				'comanda': e[i].comanda,
				'nomePedido' : e[i].nomePedido,
				'celular' : e[i].celular,
				'endereco': e[i].endereco,
				'pizzas': e[i].pizzas,
				'produtos': e[i].produtos,
				'motoboy': e[i].motoboy,
				'status': e[i].status,
				'envio': e[i].envio,
				'pagamento': e[i].pagamento,
				'taxa': e[i].taxa,
				'total': e[i].total,
				'troco': e[i].troco,
				'horaPedido': e[i].horaPedido,
				'data': e[i].data
			});
		}
	}
	
	$.ajax({
	url: "/receber/funcionarios",
	type: 'PUT'
	})
	.done(function(e){
		
		for(var i = 0; i<e.length; i++){
				funcionarios.unshift({
					'id': e[i].id,
					'nome': e[i].nome
				})
		}
		var linhaFuncionarios = '<option value="--">-------</option>';
		
		for(var i = 0; i<funcionarios.length; i++){
			linhaFuncionarios += '<option value="' + funcionarios[i].nome + '">' + funcionarios[i].nome +'</option>';
		}
		$("#filtro").html(linhaFuncionarios);
	
		$("#todosPedidos").html("");
		linhaHtml = "";
		
		if(pedidos.length == 0){
			$("#todosPedidos").html(pedidoVazio);
		}else{
			for(var i = 0; i<pedidos.length; i++){
				linhaHtml += '<tr>'
							+ '<td>' + pedidos[i].id + '</td>'
							+ '<td>' + pedidos[i].nomePedido + '</td>'
							+ '<td>' + pedidos[i].endereco + '</td>'
							+ '<td>' + pedidos[i].motoboy + '</td>'
							+ '<td>R$ ' + pedidos[i].total.toFixed(2) + '</td>'
							+ '<td>R$ ' + (pedidos[i].troco - pedidos[i].total).toFixed(2) + '</td>'
							+ '<td>' 
								+ '<a class="enviarPedido">'
								+ '<button type="button" class="btn btn-success" onclick="finalizarPedido()"'
								+ 'value="'+ pedidos[i].id + '"><span class="oi oi-timer"></span> Finalizar</button></a></td>';		
						+ '<tr>'
					+ linhaCinza;
			}
			$("#todosPedidos").html(linhaHtml);
			$("#Tpedidos").html(Tpedidos);
		}
	});
});	
	

//--------------------------------------------------------
function finalizarPedido() {
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	for(var i = 0; i<pedidos.length; i++){//buscar dados completos do pedido enviado
		if(pedidos[i].id == idProduto){
			var idBusca = i;
		}
	}
			
	if($("#filtro").val() == "--"){
		$.alert("Escolha um funcionário!");
	}else{
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + pedidos[idBusca].nomePedido,
		    content: 'Deseja finalizar?',
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						pedidos[idBusca].ac = $("#filtro").val();
						
						//receber pedido
						$.ajax({
							url: "/receber/finalizar/" + idProduto,
							type: 'PUT',
							data: pedidos[idBusca], //dados completos do pedido enviado
						})
						.done(function(e){
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