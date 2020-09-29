
//var contador
//------------------------------------------------------------------------------------------------------------------------
var contPizza = {};
var contProduto = [];

//var cliente
//------------------------------------------------------------------------------------------------------------------------
var cliente = {};
var pizzas = [];
var produtos = [];
var buscaProdutos = [];
var op;
var string = '';

//var pedido
//------------------------------------------------------------------------------------------------------------------------
var Sabor;
var Preco;
var Qtd ;
var Descricao;
var Borda;
var BordaPreco;
var BordaCusto;
var Obs;
var Custo;
var tPizzas = 0;
var tPedido = 0;
var linhaHtml = "";
var linhaCinza = '<tr id="linhaCinza"><td colspan="7" class="fundoList" ></td></tr>';
var produtosSelect = $("#novoProduto").html();
var buttonRemove = '<a class="removerProduto"><button type="button" class="btn btn-danger">Remover</button></a>';
var pedidoVazio = '<tr><td colspan="7">Nenhum produto adicionado!</td></tr>';
var imprimirTxt = '';
var url_atual = window.location.href;

//quantidade
var qtdHtml = '<label>Quantidade: <span id="qtdInput">1</span></label><br>'
			+ '<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">'
				+ '<div class="btn-group mr-2" role="group" aria-label="First group">'
				    + '<button type="button" onclick="qtdProduto(0.5)" class="btn btn-link">0.5</button>'
				    + '<button type="button" onclick="qtdProduto(1)" class="btn btn-link">1</button>'
				    + '<button type="button" onclick="qtdProduto(2)" class="btn btn-link">2</button>'
				    + '<button type="button" onclick="qtdProduto(3)" class="btn btn-link">3</button>'
				    + '<button type="button" onclick="qtdProduto(4)" class="btn btn-link">4</button>'
				    + '<button type="button" onclick="qtdProduto(5)" class="btn btn-link">5</button>'
			  + '</div>'
			+ '</div>'
			
			+ '<label>Observação:</label>'
			+ '<input type="text" class="form-control" name="obs" id="obs" placeholder="Observação" />';

var celular = url_atual.split("/")[4];//pega o id de novo cadastro
celular = parseInt(celular);
url_atual = url_atual.split("/")[5]; //pega o id de edicao do pedido

if(celular % 2 == 1 || celular % 2 == 0) {
	$("#numeroCliente").val(celular);
}
if(typeof url_atual == "undefined") {
	$("#enviarPedido").addClass("pula");
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$0,00');
}else {
	
	urlNumero = "/novoPedido/editarPedido/" + url_atual.toString();
	
	$.ajax({
		url: urlNumero,
		type: 'PUT'
	}).done(function(e){

		$("#atualizarPedido").addClass("pula");
		$("#divBuscar").hide();
		$("#enviarPedido").hide();
		$("#mostrarProdutos").show();
		$("#atualizarPedido").show();
		$(".mostrarPedidos").show();
		$("#mostrar").show(); 
		$("#cancelar").html('<span class="oi oi-ban"></span> Cancelar alteração');

		cliente.id = e.id;
		cliente.comanda = e.comanda;
		cliente.nomePedido = e.nomePedido;
		cliente.pizzas = JSON.parse(e.pizzas);
		cliente.produtos = JSON.parse(e.produtos);
		cliente.status = e.status;
		cliente.envio = e.envio;
		cliente.pagamento =  e.pagamento;
		cliente.total = e.total;
		cliente.troco = e.troco;
		cliente.horaPedido = e.horaPedido;
		cliente.data = e.data;
		
		//mostrar entrega
		if(e.envio == 'ENTREGA') {
			$("#mostrar").show('slow'); //esconder tabelas

			cliente.celular = e.celular;
			cliente.endereco = e.endereco;
			cliente.taxa = e.taxa;
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeCliente").text(cliente.nomePedido);
			$("#celCliente").text(cliente.celular);
			$("#enderecoCliente").text(cliente.endereco);
			$("#taxaCliente").text('Taxa: R$ ' + parseFloat(cliente.taxa).toFixed(2));
		}
		
		//mostrar entrega
		if(e.envio == 'BALCAO' || e.envio == 'MESA' || e.envio == 'DRIVE') {

			$("#mostrar").hide();
			$("#divEnvio").hide();
				
			//adicionar cliente
			$("#idCliente").text(cliente.id);
			$("#nomeBalcao").html('<h2>Cliente: ' + cliente.nomePedido + '</h2>');
		}
		
		for(var i = 0; i<cliente.pizzas.length; i++) {
			tPizzas += cliente.pizzas[i].qtd;
			pizzas.unshift({
				'sabor' : cliente.pizzas[i].sabor,
				'qtd' : cliente.pizzas[i].qtd,
				'borda' : cliente.pizzas[i].borda,
				'obs' : cliente.pizzas[i].obs,
				'preco' : cliente.pizzas[i].preco,
				'custo' : cliente.pizzas[i].custo,
				'setor' : cliente.pizzas[i].setor,
				'descricao' : cliente.pizzas[i].descricao
			});
		}
		for(var i = 0; i<cliente.produtos.length; i++) {
			tPizzas += cliente.produtos[i].qtd;
			produtos.unshift({
				'sabor' : cliente.produtos[i].sabor,
				'qtd' : cliente.produtos[i].qtd,
				'borda' : cliente.produtos[i].borda,
				'preco' : cliente.produtos[i].preco,
				'obs' : cliente.produtos[i].obs
			});
		}
		tPedido = cliente.total;
		
		mostrarProdutos();
		$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>' + 'Total do Pedido: R$' + cliente.total.toFixed(2));
		
	}).fail(function(){
		$.alert("falhou!");
	});	
}


//------------------------------------------------------------------------------------------------------------------------
$('#buscarCliente').on('click', function(){

	if($.trim($("#numeroCliente").val()) % 2 == 1 || $.trim($("#numeroCliente").val()) % 2 == 0){
		var numero = $("#numeroCliente").val();
		
		$.ajax({
			url: "/novoPedido/numeroCliente/" + numero.toString(),
			type: 'PUT'
		}).done(function(e){

			if(e.length != 0) {
				$("#mostrar").show('slow'); //mostrar tabelas
				
				$("#nomeCliente").text(e.nome).css('background-color', '#D3D3D3');
				cliente.nomePedido = e.nome;
				
				$("#celCliente").text(e.celular);
				cliente.celular = e.celular;
				
				$("#enderecoCliente").text(e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro);
				cliente.endereco = e.endereco.rua + ' - ' + e.endereco.n  + ' - ' + e.endereco.bairro;
				
				$("#taxaCliente").text('Taxa: R$ ' + parseFloat(e.endereco.taxa).toFixed(2));
				cliente.taxa = e.endereco.taxa;

				$("#divBuscar").hide('slow');
				$("#mostrarProdutos").show('slow');

				$("#divEnvio").html('<label>Envio:</label>'
							+'<select name="opcao" class="form-control" id="envioCliente">'
								+'<option value="ENTREGA">Entrega</option>'
								+'<option value="BALCAO">Balcão</option>'
								+'<option value="MESA">Mesa</option>'
								+'<option value="DRIVE">Drive-Thru</option>'
							+'</select>');
			}else {
				window.location.href = "/cadastroCliente/" + numero;
			}
		}).fail(function(){
			console.log("Cliente não encontrado!");
		});
		
	}else if(typeof $("#numeroCliente").val() == 'string'){
		$("#nomeBalcao").html('<h2>Cliente: ' + $("#numeroCliente").val() + '</h2>');
		cliente.nomePedido = $("#numeroCliente").val();
		cliente.envio = 1;
		
		$("#idCliente").text('0');
		$("#divBuscar").hide('slow');
		$("#mostrar").hide("slow");
		$("#mostrarProdutos").show('slow');
		$("#divEnvio").html('<label>Envio:</label>'
					+'<select name="opcao" class="form-control" id="envioCliente">'
						+'<option value="BALCAO">Balcão</option>'
						+'<option value="MESA">Mesa</option>'
						+'<option value="DRIVE">Drive-Thru</option>'
					+'</select>');
		cliente.envio = "BALCAO";
	}
});


//------------------------------------------------------------------------------------------------------------------------
/*$('#nomeProduto').on('blur', function(){
	buscarProdutos();
});*/

$('#buscarProduto').click(function(){
	buscarProdutos();
});

//-----------------------------------------------------------------------------------------------------------------
function buscarProdutos() {
	if($.trim($("#nomeProduto").val()) != ""){

		var produto = $("#nomeProduto").val();
		
		$.ajax({
			url: "/novoPedido/nomeProduto/" + produto.toString(),
			type: 'PUT'
		}).done(function(e){
			
			$("#nomeProduto").val('');
			buscaProdutos = [];
			
			for(var i = 0; i < e.length; i++){
				buscaProdutos.push({
					'id': e[i].id,
					'nomeProduto': e[i].nomeProduto,
					'preco': e[i].preco,
					'setor': e[i].setor
				});
			};
	
			$("#listaProdutos").show('slow');
			$("#todosProdutos").html(" ");
			
			linhaHtml = '<table class="h-100">'
						+ '<thead>'
							+ '<tr>'
								+ '<th class="col-md-1"><h5>Produto</h5></th>'
								+ '<th class="col-md-1"><h5>Preço</h5></th>'
								+ '<th class="col-md-1"><h5>Adicionar</h5></th>'
							+ '</tr>'
						+ '</thead>'
						+ '<tbody>';
			
			//abrir modal de produtos encontrados
			for(produto of buscaProdutos){
				linhaHtml += '<tr>'
							+ '<td align="center">' + produto.nomeProduto + '</td>'
							+ '<td align="center">R$ ' + produto.preco + '</td>'
							+ '<td align="center">'
								+ '<div>'
									+ '<button onclick="enviarProduto()"'
									+ 'title="Adicionar" onclick="enviarProduto()" class="botao" value="' + produto.id + '">'
										+ '<span class="oi oi-plus"></span>'
									+ '</button>'
								+ '</div>'
							+ '</td>'
						+ '</tr>';
			}
			
			linhaHtml += '</tbody>'
						+ '<table>';
					
			$.confirm({
				type: 'blue',
				title: '<h4 align="center">Lista de Produtos</h4>',
				content: linhaHtml,
			    closeIcon: true,
				buttons: {
			        confirm: {
						isHidden: true,
			            text: 'Voltar',
			            btnClass: 'btn-green',
			            keys: ['enter','esc'],
					}
				}
			});
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------
function enviarProduto() {
	
	//zerar valores de borda
	BordaPreco = 0;
	BordaCusto = 0;
	Borda = '';
	
	//resetar valor anterior
	Qtd = 1;
	
	var botaoReceber = $(event.currentTarget);
	var idProduto = botaoReceber.attr('value');
	
	$.ajax({
		url: '/novoPedido/addProduto/' + idProduto,
		type: 'PUT'
	})
	.done(function(e){
		
		Sabor = e.nomeProduto;
		Preco = e.preco;
		Custo = parseFloat(e.custo);
		Setor = e.setor;
		Descricao = e.descricao;
		
		//pizza
		if(Setor == 'PIZZA') {
			
			//buscar borda recheada
			$.ajax({
				url: '/novoPedido/bordas',
				type: 'PUT'
			}).done(function(e){
				
				//buscar bordas
				var bordas = '';
				for(var k = 0; k<e.length; k++) {
					bordas += '<option value="' + e[k].id + '">' + e[k].nomeProduto + '</option>';
				}
				
				var bordasHtml = '<label>Borda Recheada:</label>'
								+ '<select class="form-control" name="borda" id="borda">'
									+ '<option value="0"></option>'
									+ bordas
								+ '</select><br>';
			
						
				$.confirm({
					type: 'blue',
					title: Setor + ': ' + Sabor,
					content: bordasHtml + qtdHtml,
				    closeIcon: true,
					buttons: {
						confirm: {
							text: 'adicionar',
							btnClass: 'btn-success',
							keys: ['enter'],
							action: function(){
					
								console.log(Qtd);
								Obs = $("#obs").val();
								
								//multiplica o preco da pizza
								Preco *= Qtd;
								
								//adiciona o valor da borda
								bordaId = parseFloat($("#borda").val());
								
								//se for escolhido uma borda
								if(bordaId != 0) {
									
									//buscar borda por id
									$.ajax({
										url: "/novoPedido/buscarBorda/" + bordaId,
										type: 'PUT'
									}).done(function(event){
										
										Borda = event.nomeProduto;
										BordaPreco = parseFloat(event.preco);
										BordaCusto = parseFloat(event.custo);
										Preco += (BordaPreco * Qtd);
										Custo += parseFloat(BordaCusto * Qtd);
										
										tPizzas += Qtd;
										tPedido += Preco;
										
										pizzas.unshift({
											'sabor' : Sabor,
											'qtd': Qtd,
											'borda': Borda,
											'obs': Obs,
											'preco': Preco,
											'custo': parseFloat(Custo),
											'setor': Setor,
											'descricao': Descricao,
										});

										mostrarProdutos();
										$(".mostrarPedidos").show('slow');
									});
									
								//sem borda
								}else {
									tPizzas += Qtd;
									tPedido += Preco;
									
									pizzas.unshift({
										'sabor' : Sabor,
										'qtd': Qtd,
										'borda': Borda,
										'obs': Obs,
										'preco': Preco,
										'custo': parseFloat(Custo),
										'setor': Setor,
										'descricao': Descricao,
									});

									mostrarProdutos();
									$(".mostrarPedidos").show('slow');
								}

							}
						}
					}
				});
			}).fail(function(){
				$.alert("Nenhuma borda cadastrada ou encontrada!")
			});
			
		//outros produtos do cardapio
		}else {
			$.confirm({
				type: 'blue',
				title: Setor + ': ' + Sabor,
				content: qtdHtml,
			    closeIcon: true,
				buttons: {
					confirm: {
						text: 'adicionar',
						btnClass: 'btn-success',
						keys: ['enter'],
						action: function(){
				
							Obs = $("#obs").val();
							Preco *= Qtd;
							tPizzas += Qtd;
							tPedido += Preco;

							produtos.unshift({
								'sabor' : Sabor,
								'qtd': Qtd,
								'obs': Obs,
								'preco': Preco,
								'custo': parseFloat(Custo),
								'setor': Setor
							});

							mostrarProdutos();
							$(".mostrarPedidos").show('slow');
						}
					}
				}
			});
		}
	});//final do ajax principal
};


//---------------------------------------------------------------
function qtdProduto(qtd) {
	$("#qtdInput").text(qtd);
	Qtd = qtd;
}


//---------------------------------------------------------------------------------------------------------------------
function mostrarProdutos() {

	$("#novoProduto").html("");
	$("#novoPizza").html("");
	
	for(var i=0; i<pizzas.length; i++){
		linhaHtml = '<tr>'
					 +	'<td>' + pizzas[i].borda + '</td>'
					 +	'<td>' + pizzas[i].sabor + '</td>'
					 +	'<td>' + pizzas[i].obs + '</td>'
					 +	'<td>' + pizzas[i].qtd + '</td>'
					 +	'<td>R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
				 + '</tr>'
				 + linhaCinza;
		$("#novoPizza").append(linhaHtml);
	}
	for(var i=0; i<produtos.length; i++){
		linhaHtml = '<tr>'
				 +	'<td>' + produtos[i].sabor + '</td>'
				 +	'<td>' + produtos[i].obs + '</td>'
				 +	'<td>' + produtos[i].qtd + '</td>'
				 +	'<td>R$ ' + produtos[i].preco.toFixed(2) + '</td>'
			 + '</tr>'
			 + linhaCinza;
		$("#novoProduto").append(linhaHtml);
	}
	
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><hr>Total do Pedido: R$ ' + tPedido.toFixed(2));
}


//------------------------------------------------------------------------------------------------------------------------
$(".removerProduto").click(function(e){
	
	tPizzas -= produtos[0].qtd;
	tPedido -= produtos[0].preco;
	
	produtos.shift();
	
	if(produtos.length == 0) {
		$("#novoProduto").append(pedidoVazio);
	}
	
	if(pizzas.length == 0 && produtos.length == 0) {
		$(".mostrarPedidos").hide('slow');
	} else {
		mostrarProdutos();
	}
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$(".removerPizza").click(function(e){
	
	tPizzas -= pizzas[0].qtd;
	tPedido -= pizzas[0].preco;
	
	pizzas.shift();
	
	if(pizzas.length == 0) {
		$("#novoPizza").append(pedidoVazio);
	} 
	
	if(pizzas.length == 0 && produtos.length == 0) {
		$(".mostrarPedidos").hide('slow');	
	}else {
		mostrarProdutos();
	}
	$("#Ttotal").html('Total de Produtos: ' + tPizzas + '<br><br>Total do Pedido: R$ ' + tPedido.toFixed(2));	
});


//------------------------------------------------------------------------------------------------------------------------
$("#enviarPedido").click(function() {
	

	if($("#nomeCliente").text() == "" && $("#nomeBalcao").text() == ""){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum cliente adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum produto adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Apenas valores inteiros!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});	
		
	}else{
		cliente.envio = $("#envioCliente").val();
		
		if(cliente.envio == '' || cliente.envio == null) {
			cliente.envio = $("#envioCliente").val();
		}
		mostrarTabela(pizzas, produtos);

		if(cliente.envio == 'ENTREGA') {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
						+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
						+ '<br><b>Taxa:</b> R$ ' + parseFloat(cliente.taxa).toFixed(2)
						+ '<br><b>Total:</b> R$ ' + (parseFloat(tPedido) + parseFloat(cliente.taxa)).toFixed(2)
						+'<br><br><b>Receber:</b>'
						 + '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + (parseFloat(tPedido) + parseFloat(cliente.taxa)).toFixed(2) + '"/>';
		}else {
			linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
					+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
					+'<br><br><b>Receber:</b>'
					+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '"/>';
		}
		
		linhaHtml += '<br><label>O pedido foi pago:</label>'
					+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
						+'<option value="Não">Não</option>'
						+'<option value="Sim">Sim</option>'
					+ '</select>'
					+ '<br><b>Deseja enviar o pedido?</b>';
	
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nomePedido,
		    content: linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
						
						var troco = this.$content.find('#troco').val();

						troco = troco.toString().replace(",",".");
						troco = parseFloat(troco);

						if(pizzas.length != 0) {
							cliente.status = "COZINHA";
						}else {
							cliente.status = "PRONTO";
						}
						
						//buscar data do sistema
						$.ajax({
							url: '/novoPedido/data',
							type: 'PUT'
						}).done(function(e){
							cliente.data = e.dia;
							cliente.total = tPedido;
							cliente.produtos = JSON.stringify(produtos);
							cliente.pizzas = JSON.stringify(pizzas);
							cliente.horaPedido = new Date;
							cliente.pagamento = $("#pagamentoCliente").val();

							if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
								cliente.total += parseFloat(cliente.taxa);
							}
							
							if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
								troco = cliente.total;
							}

							cliente.troco = parseFloat(troco);
							
							//salvar pedido
							$.ajax({
								url: "/novoPedido/salvarPedido",
								type: "PUT",
								dataType : 'json',
								contentType: "application/json",
								data: JSON.stringify(cliente)
								
							}).done(function(e){
								imprimir();
								   
								$.alert({
									type: 'green',
									title: 'Sucesso!',
									content: 'Pedido enviado!',
									buttons: {
								        confirm: {
								            text: 'Obrigado!',
								            btnClass: 'btn-green',
								            keys: ['enter','esc'],
								            action: function(){
												window.location.href = "/novoPedido";
											}
										}
									}
								});
								
							}).fail(function(e){
								$.alert("Pedido não enviado!");
								if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
									cliente.troco -= parseFloat(cliente.taxa);
								}
							});
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
});



//------------------------------------------------------------------------------------------------------------------------
$("#atualizarPedido").click(function() {
	
	if($("#nomeCliente").text() == "" && $("#nomeBalcao").text() == ""){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum cliente adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(Object.keys(produtos).length === 0 && Object.keys(pizzas).length === 0){
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Nenhum produto adicionado!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else if(tPizzas % 2 != 0 && tPizzas % 2 != 1){	
		$.alert({
			type: 'red',
			title: 'Alerta',
			content: "Apenas valores inteiros!",
			buttons: {
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc', 'enter']
				}
			}
		});
	}else{
		
		if($('#envioCliente').is(':visible'))
		{
			cliente.envio = $("#envioCliente").val();
		}
		mostrarTabela(pizzas, produtos);

		linhaHtml += '<hr><b>Nº Produtos:</b> ' + tPizzas 
				+ '<br><b>Pedido:</b> R$ ' + tPedido.toFixed(2)
				+'<br><br><b>Receber:</b>'
				+ '<input type="text" placeholder="Precisa de troco?" class="form-control" id="troco" value="' + tPedido + '"/>'
				
				+'<br><label>O pedido foi pago:</label>'
				+'<select name="pagamento" class="form-control" id="pagamentoCliente">'
					+'<option value="Não">Não</option>'
					+'<option value="Sim">Sim</option>'
				+'</select>'
				+ '<br><b>Deseja enviar o pedido?</b>';
		
		//modal jquery confirmar
		$.confirm({
			type: 'green',
		    title: 'Pedido: ' + cliente.nomePedido,
		    content: linhaHtml,
		    buttons: {
		        confirm: {
		            text: 'Enviar',
		            btnClass: 'btn-green',
		            keys: ['enter'],
		            action: function(){
			
						var troco = this.$content.find('#troco').val();

						troco = troco.toString().replace(",",".");
						
						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							$("#troco").val(tPedido);
						}
						
						var cozinha = this.$content.find('#cozinha').val();
						if(cozinha == 'sim') {
							cliente.status = 'COZINHA';
						}
						
						cliente.total = parseFloat(tPedido);
						cliente.produtos = JSON.stringify(produtos);
						cliente.pizzas = JSON.stringify(pizzas);
						cliente.pagamento = $("#pagamentoCliente").val();

						if((troco % 2 != 0 && troco % 2 != 1) || (troco < tPedido)) {
							troco = cliente.total;
						}

						cliente.troco = parseFloat(troco);
						
						$.ajax({
							url: "/novoPedido/atualizarPedido/" + url_atual,
							type: "PUT",
							dataType : 'json',
							contentType: "application/json",
							data: JSON.stringify(cliente)
							
						}).done(function(e){
							imprimir();
							
							$.alert({
								type: 'green',
								title: 'Sucesso!',
								content: 'Pedido atualizado!',
								buttons: {
							        confirm: {
							            text: 'Obrigado!',
							            btnClass: 'btn-green',
							            keys: ['enter','esc'],
							            action: function(){
											window.location.href = "/novoPedido";
										}
									}
								}
							});
							
						}).fail(function(e){
							$.alert("Pedido não enviado!");
							if(cliente.taxa % 2 == 0 || cliente.taxa % 2 == 1) {
								cliente.troco -= ParseFloat(cliente.taxa);
							}
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
});


//----------------------------------------------------------------------------
function mostrarTabela(pizzas, produtos) {
	
	linhaHtml = '';
	if(pizzas.length != 0) {
		linhaHtml += '<table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Borda</h5></th>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<pizzas.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + pizzas[i].borda + '</td>'
						 +	'<td align="center">' + pizzas[i].sabor + '</td>'
						 +	'<td align="center">' + pizzas[i].obs + '</td>'
						 +	'<td align="center">' + pizzas[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + pizzas[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}

	if(produtos.length != 0) {
		linhaHtml += '<hr><table style="width: 100%">'
					+ '<tr>'
						+ '<th class="col-md-1"><h5>Sabor</h5></th>'
						+ '<th class="col-md-1"><h5>Obs</h5></th>'
						+ '<th class="col-md-1"><h5>Qtd</h5></th>'
						+ '<th class="col-md-1"><h5>Preço</h5></th>'
					+ '</tr>';
		
		for(var i=0; i<produtos.length; i++){
			linhaHtml += '<tr>'
						 +	'<td align="center">' + produtos[i].sabor + '</td>'
						 +	'<td align="center">' + produtos[i].obs + '</td>'
						 +	'<td align="center">' + produtos[i].qtd + '</td>'
						 +  '<td align="center">R$ ' + produtos[i].preco.toFixed(2) + '</td>'
					 +  '</tr>';
		}
		linhaHtml += '</table>';
	}
}
//----------------------------------------------------------------------------
function imprimir() {
	$.ajax({
		url: '/empresa/editar',
		type: 'PUT'
	}).done(function(e){
		if(e.length != 0) {
			imprimirTxt = '<h1 align="center">' + e.nomeEmpresa + '</h1>'
						+ '<h2 align="center"><b>' + cliente.envio + '</b></h2>'
						+ '<h3>Cliente: ' + cliente.nomePedido + '</h3>';
			if(cliente.envio == 'ENTREGA') {
				imprimirTxt += '<p>Celular: ' + cliente.celular
							+ '<br>Endereço: ' + cliente.endereco
							+ '<br>Taxa de entrega: ' + cliente.taxa + '</p>';
			}
			
			var data = cliente.horaPedido;
			hora = data.getHours();
			hora = (hora.length == 1) ? '0'+hora : hora;
			minuto = data.getMinutes();
			minuto = (minuto.length == 0) ? '00' : minuto;
			minuto = (minuto.length == 1) ? '0'+minuto : minuto;
			segundo = data.getSeconds();
			segundo = (segundo.length == 0) ? '00' : segundo;
			segundo = (segundo.length == 1) ? '0'+segundo : segundo;
	        dia  = data.getDate().toString();
	        dia = (dia.length == 1) ? '0'+dia : dia;
	        mes  = (data.getMonth()+1).toString();
	        mes = (mes.length == 1) ? '0'+mes : mes;
	        ano = data.getFullYear();
			
			mostrarTabela(pizzas, produtos);//construir html
			imprimirTxt += 'Hora: ' + hora + ':' + minuto + ':' + segundo
						+ '<br>Data: ' + dia + '/' + mes + '/' + ano
						+ '<hr>' + linhaHtml + '<hr>'
						+ '<label>Total: R$ ' + cliente.total.toFixed(2) + '</label>'
						+ '<label><br>Levar: R$ ' + (cliente.troco - cliente.total).toFixed(2) + '</label>'; 
				
			tela_impressao = window.open('about:blank');
			tela_impressao.document.write(imprimirTxt);
			tela_impressao.window.print();
			tela_impressao.window.close();
		}
	});
}