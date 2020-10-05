
var funcionarios = [];
var linhaHtml= "";
var linhaCinza = '<tr><td colspan="6" class="fundoList" ></td></tr>';
var pedidoVazio = '<tr><td colspan="6">Nenhum Funcionário encontrado!</td></tr>';
var horaExtra = 10;


//-------------------------------------------------------
function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return mesF+"-"+anoF;
}
	
	
//------------------------------------------------------------
$.ajax({
	url: '/empresa/editar',
	type: 'PUT'
}).done(function(e){
	if(e.length != 0) {
		horaExtra = e.horaExtra;
	}

	$("#horaExtra").text('R$ ' + horaExtra.toFixed(2));
	
	//Ao carregar a tela
	//-------------------------------------------------------------------------------------------------------------------
	$("#todosFuncionarios").html(linhaCinza);
	
	$.ajax({
		url: "/pagamento/todosFuncionarios",
		type: 'PUT'
	}).done(function(e){
		funcionarios = e;
		$("#todosFuncionarios").html("");
		linhaHtml = "";
		
		if(funcionarios.length == 0){
			$("#todosFuncionarios").html(pedidoVazio);
		}else{
			for(var i = 0; i<funcionarios.length; i++){
				linhaHtml += '<tr>'
								+ '<td>' + funcionarios[i].id + '</td>'
								+ '<td>' + funcionarios[i].nome + '</td>'
								+ '<td>R$ ' + funcionarios[i].salario.toFixed(2) + '</td>'
								+ '<td>' + funcionarios[i].cargo + '</td>'
								+ '<td>'
									+'<div class="row">'
										+'<div class="col-md-1">'
											+'<a>'
											+ '<button type="button" title="Adicionar Horas" onclick="addHoras()" class="botao"'
											+ 'value="'+ funcionarios[i].id + '"><span class="oi oi-clock"></span></button>'
											+'</a>'
										+'</div>'
										
										+'<div class="col-md-1">'
											+'<a>'
											+ '<button type="button" title="Adicionar Gastos" onclick="addGastos()" class="botao"'
											+ 'value="'+ funcionarios[i].id + '"><span class="oi oi-credit-card"></span></button>'
											+'</a>'
										+'</div>'
										
										+'<div class="col-md-1">'
											+'<a>'
											+ '<button type="button" title="Pagar" onclick="pagarSalario()" class="botao"'
											+ 'value="'+ funcionarios[i].id + '"><span class="oi oi-task"></span></button>'
											+'</a>'
										+'</div>'
									+'</div>'
								+'</td>'
							+ '</tr>'
						+ linhaCinza;
			}
			
			$("#todosFuncionarios").html(linhaHtml);
		}
	});	
});


//-------------------------------------------------------------------------
	function addHoras() {
		
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
		for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
			if(funcionarios[i].id == idProduto){
				var idBusca = i;
			}
		}
		mesAtual = new Date();
				
		$.alert({
			type: 'blue',
			title: 'Mês',
			content: '<input type="number" id="mes" min="1" value="' + (mesAtual.getMonth() + 1)  + '" max="12" class="form-control" />',
			buttons: {
				confirm: {
					text: 'Acessar',
					btnClass: 'btn-primary',
					keys: ['enter'],
					action: function(){
						var mes = this.$content.find('#mes').val();
						mes = (mes.length == 1) ? '0'+mes : mes;
								
						var salario = {};
						salario.id = funcionarios[idBusca].id;
						salario.mes = mes + '-' + dataAtualFormatada().split('-')[1];
	
						//buscar o mes de gastos do funcionario
						$.ajax({
							url: '/pagamento/buscar/' + funcionarios[idBusca].id + '/' + salario.mes,
							type: 'PUT'
						}).done(function(e){
							console.log(e)
							
							var horas = 0;
							
							for(j = 0; j<e.length; j++) {
								horas += e[j]. horas;
							}
							
							linhaHtml = '<table>'
										+ '<tr>'
											+ '<th class="col-md-1"><h5>Horas Extra</h5></th>'
											+ '<th class="col-md-1"><h5>Total</h5></th>'
										+ '</tr>'
								
										+ '<tr>'
											+ '<td>' + horas + '</td>'
											+ '<td>R$ ' + (horas * horaExtra).toFixed(2) +'</td>'
										+ '</tr>'
									+'</table>'
				
							+ '<hr><label>Total a adicionar: <button class="btn btn-link" onclick="aviso1()"><span class="oi oi-question-mark"></span></button></label><br>'
							+'<input type="number" class="form-control" id="horas" name="horas" placeholder="Digite o total de horas a adicionar"/>';
							
							$.alert({
								type: 'green',
							    title: 'Funcionário: ' + funcionarios[idBusca].nome,
							    content: linhaHtml,
							    buttons: {
							        confirm: {
										text: 'Adicionar Horas',
							    		keys: ['enter'],
							            btnClass: 'btn-green',
							            action: function(){
											
											var horas = this.$content.find('#horas').val();
											
											var funcionario = {};
											funcionario.idFuncionario = funcionarios[idBusca].id;
											funcionario.horas = horas;
											funcionario.data = dataAtualFormatada();
											
											$.ajax({
												url: '/pagamento/salvar',
												type: 'PUT',
												dataType : 'json',
												contentType: "application/json",
												data: JSON.stringify(funcionario)
											}).done(function(e){
												console.log(e);
											});
										}
									},
							        cancel:{
										text: 'Voltar',
							    		keys: ['esc'],
							            btnClass: 'btn-danger'
									}
								}
							});
						});
					}
				}
			}
		});
	};
	
	
	//-------------------------------------------------------------------------
	function addGastos() {
		
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
		for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
			if(funcionarios[i].id == idProduto){
				var idBusca = i;
			}
		}
		mesAtual = new Date()
				
		$.alert({
			type: 'blue',
			title: 'Mês',
			content: '<input type="number" id="mes" min="1" value="' + (mesAtual.getMonth() + 1)  + '" max="12" class="form-control" />',
			buttons: {
				confirm: {
					text: 'Acessar',
					btnClass: 'btn-primary',
					keys: ['enter'],
					action: function(){
						var mes = this.$content.find('#mes').val();
						mes = (mes.length == 1) ? '0'+mes : mes;
								
						var salario = {};
						salario.id = funcionarios[idBusca].id;
						salario.mes = mes + '-' + dataAtualFormatada().split('-')[1];
	
						//buscar o mes de gastos do funcionario
						$.ajax({
							url: '/pagamento/buscar/' + funcionarios[idBusca].id + '/' + salario.mes,
							type: 'PUT'
						}).done(function(e){
							console.log(e)
							
							var gastos = 0;
							
							for(j = 0; j<e.length; j++) {
								gastos += e[j].gastos;
							}
							
							linhaHtml = '<table>'
										+ '<tr><th class="col-md-1"><h5>Gastos totais</h5></th></tr>'
										+ '<tr><td>R$ ' + gastos.toFixed(2) + '</td></tr>'
									+'</table>'
							
							+ '<hr><label>Total de gastos: <button class="btn btn-link" onclick="aviso2()"><span class="oi oi-question-mark"></span></button></label><br>'
							+'<input class="form-control" id="gastos" name="gasto" placeholder="Digite o total a ser gasto"/>';
							
							$.alert({
								type: 'green',
							    title: 'Funcionário: ' + funcionarios[idBusca].nome,
							    content: linhaHtml,
							    buttons: {
							        confirm: {
										text: 'Adicionar Gastos',
							    		keys: ['enter'],
							            btnClass: 'btn-green',
							            action: function(){
									
											var gastos = this.$content.find('#gastos').val();
											
											gastos = gastos.toString().replace(",",".");
											
											var funcionario = {};
											funcionario.idFuncionario = funcionarios[idBusca].id;
											funcionario.gastos = gastos;
											funcionario.data = dataAtualFormatada();
											
											$.ajax({
												url: '/pagamento/salvar',
												type: 'PUT',
												dataType : 'json',
												contentType: "application/json",
												data: JSON.stringify(funcionario)
											}).fail(function(){
												$.alert({
													type: 'red',
													title: 'OPS..',
													content: 'Digite um valor valido',
													buttons: {
														confirm: {
															text: 'Voltar',
															btnClass: 'btn-success',
															keys: ['esc', 'enter']
														}
													}
												});
											});
										}
									},
							        cancel:{
										text: 'Voltar',
							    		keys: ['esc'],
							            btnClass: 'btn-danger'
									}
								}
							});
						});
					}
				}
			}
		});
	};
				
	
	
	//-------------------------------------------------------------------------
	function pagarSalario() {
		
		var botaoReceber = $(event.currentTarget);
		var idProduto = botaoReceber.attr('value');
		
		for(var i = 0; i<funcionarios.length; i++){//buscar dados completos do pedido enviado
			if(funcionarios[i].id == idProduto){
				var idBusca = i;
			}
		}
		
		mesAtual = new Date()
				
		$.alert({
			type: 'blue',
			title: 'Mês',
			content: '<input type="number" id="mes" min="1" value="' + (mesAtual.getMonth() + 1)  + '" max="12" class="form-control" />',
			buttons: {
				confirm: {
					text: 'Acessar',
					btnClass: 'btn-primary',
					keys: ['enter'],
					action: function(){
						var mes = this.$content.find('#mes').val();
						mes = (mes.length == 1) ? '0'+mes : mes;
								
						var salario = {};
						salario.id = funcionarios[idBusca].id;
						salario.mes = mes + '-' + dataAtualFormatada().split('-')[1];
	
						//buscar o mes de gastos do funcionario
						$.ajax({
							url: '/pagamento/buscar/' + funcionarios[idBusca].id + '/' + salario.mes,
							type: 'PUT'
						}).done(function(e){
							console.log(e)
							
							var gastos = 0;
							var horas = 0;
							var total = 0;
							var pago = 0;
							
							for(j = 0; j<e.length; j++) {
								gastos += e[j].gastos;
								horas += e[j]. horas;
								pago += e[j]. pago;
							}
							
							var totalExtra = horas * horaExtra;
							
							linhaHtml = '<table>'
										+ '<tr>'
											+ '<th class="col-md-1"><h5>Salário</h5></th>'
											+ '<th class="col-md-1"><h5>Extra</h5></th>'
											+ '<th class="col-md-1"><h5>Gastos</h5></th>'
											+ '<th class="col-md-1"><h5>Pago</h5></th>'
											+ '<th class="col-md-1"><h5>Total</h5></th>'
										+ '</tr>'
							
										+ '<tr>'
											+ '<td>R$ ' + funcionarios[idBusca].salario.toFixed(2) + '</td>'
											+ '<td>R$ ' + totalExtra.toFixed(2) + '</td>'
											+ '<td>R$ ' + gastos.toFixed(2) + '</td>'
											+ '<td>R$ ' + pago.toFixed(2) + '</td>'
											+ '<td>R$ ' + (funcionarios[idBusca].salario + totalExtra - gastos - pago).toFixed(2) + '</td>'
										+ '</tr>'
									+'</table>'
						
							+ '<hr><label>Total pago: <button class="btn btn-link" onclick="aviso()"><span class="oi oi-question-mark"></span></button></label><br>'
							+'<input class="form-control" id="pagamento" name="pagamento" placeholder="Digite o total a ser pago"/>';
							
							$.alert({
								type: 'green',
							    title: 'Funcionário: ' + funcionarios[idBusca].nome,
							    content: linhaHtml,
					    	    columnClass: 'col-md-12',
							    buttons: {
							        confirm: {
										text: 'Pagar funcionário',
							    		keys: ['enter'],
							            btnClass: 'btn-green',
							            action: function(){
											var pagamento = this.$content.find('#pagamento').val();

											pagamento = pagamento.toString().replace(",",".");
											
											var funcionario = {};
											funcionario.idFuncionario = funcionarios[idBusca].id;
											funcionario.pago = pagamento;
											funcionario.data = dataAtualFormatada();
											
											$.ajax({
												url: '/pagamento/salvar',
												type: 'PUT',
												dataType : 'json',
												contentType: "application/json",
												data: JSON.stringify(funcionario)
											}).fail(function(){
												$.alert({
													type: 'red',
													title: 'OPS..',
													content: 'Digite um valor valido',
													buttons: {
														confirm: {
															text: 'Voltar',
															btnClass: 'btn-success',
															keys: ['esc', 'enter']
														}
													}
												});
											});
										}
									},
							        cancel:{
										text: 'Voltar',
							    		keys: ['esc'],
							            btnClass: 'btn-danger'
									}
								}
							});
						});
					}
				},
				cancel: {
					text: 'Voltar',
					btnClass: 'btn-danger',
					keys: ['esc']
				}
			}
		});
	};
	
	
	//-------------------------------------------------------------------
	function aviso() {
		$.alert({
			type:'blue',
			title:'Pagamento',
			content:'Este campo é utilizado para descontar o valor que foi pago ao funcionário.'
				+'<br><b>Pode ser usado para:</b>'
				+'<br>&nbsp- Pagamentos diarios.'
				+'<br>&nbsp- Pagamentos semanais.'
				+'<br>&nbsp- Pagamentos mensais.',
			buttons:{
				confirm:{
					text:'Voltar',
					btnClass:'btn-success',
					keys:['enter','esc']
				}
			}
		});
	}
	
	//-------------------------------------------------------------------
	function aviso1() {
		$.alert({
			type:'blue',
			title:'Pagamento',
			content:'Este campo é utilizado para adicionar as horas extras ao funcionário'
				+ '<br>Será multiplicada automaticamente e feito o calculo do valor total.',
			buttons:{
				confirm:{
					text:'Voltar',
					btnClass:'btn-success',
					keys:['enter','esc']
				}
			}
		});
	}
	
	//-------------------------------------------------------------------
	function aviso2() {
		$.alert({
			type:'blue',
			title:'Pagamento',
			content:'Este campo é utilizado para selecionar o quanto foi gasto pelo funcionário no dia a dia e descontar do valor final',
			buttons:{
				confirm:{
					text:'Voltar',
					btnClass:'btn-success',
					keys:['enter','esc']
				}
			}
		});
	}