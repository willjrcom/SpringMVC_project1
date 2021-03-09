carregarLoading("block");
$(document).ready(() => $("#nomePagina").text("Estatísticas"));
var [todosDados, objeto, objeto1, dados, dados1] = [[], [], [], [], []];


$.ajax({
	url: '/adm/estatistica/todos',
	type: 'GET'
}).done(function(e){
	todosDados = objeto = objeto1 = e;
	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(drawBackgroundColor);

});

//vendas/lucro
//--------------------------------------------------------------------------------------------

function drawBackgroundColor() {
	gerarTotalVendas();
	gerarEntregas();
	gerarDadosMensal();
	carregarLoading("none");
}


function gerarTotalVendas(){
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'X');
    data.addColumn('number', 'Bruto');
    data.addColumn('number', 'Líquido');

	  objeto.sort(function (a, b) {
		return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
				? 1 
				: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	  });
	  
	  for(obj of objeto) {
		  if(obj.totalVendas != 0) {
			  dados.push([
			              (obj.data.split('-')[2] + '/' + obj.data.split('-')[1]),
			              obj.totalVendas,
			              obj.totalLucro
			  ]);
		  }
	  }

	  data.addRows(dados);
	  var options = {
		        hAxis: {
		          title: 'Dia'
		        },
		        vAxis: {
		          title: 'Total de Vendas R$'
		        },
		        backgroundColor: 'white'
		      };

		      var chart = new google.visualization.LineChart(document.getElementById('totalVendas'));
		      chart.draw(data, options);
}


function gerarEntregas(){
	  let data1 = new google.visualization.DataTable();
	  data1.addColumn('string', 'X');
	  data1.addColumn('number', 'Balcão');
	  data1.addColumn('number', 'Entrega');

	  objeto1.sort(function (a, b) {
			return (a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2] > b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2]) 
					? 1 
					: ((b.data.split('-')[0] + b.data.split('-')[1] + b.data.split('-')[2] > a.data.split('-')[0] + a.data.split('-')[1] + a.data.split('-')[2]) ? -1 : 0);
	  });
	  
	  for(obj1 of objeto1) {
		  if(obj1.totalVendas != 0) {
			  dados1.push([
			              obj1.data.split('-')[2] + '/' + obj1.data.split('-')[1], 
			              obj1.balcao, 
			              obj1.entrega
			  ]);
		  }
	  }
	  data1.addRows(dados1);
	  var options = {
		        hAxis: {
		          title: 'Dia'
		        },
		        vAxis: {
		          title: 'Total de Pedidos R$'
		        },
		        backgroundColor: 'white'
		      };

		      var chart = new google.visualization.LineChart(document.getElementById('entregaBalcao'));
		      chart.draw(data1, options);
}


function gerarDadosMensal(){
	let linhaHtml = '';
	let [totalVendas, totalLucro, taxa_entrega, totalPizza, totalPedidos, totalCompras, compraDiaria] = [0, 0, 0, 0, 0, 0, 0];
	console.log(todosDados)
	for(dado of todosDados){
		compraDiaria = 0;
		for(let comp of dado.compra) compraDiaria += comp.valor;
		totalCompras += compraDiaria;
		totalVendas += dado.totalVendas;
		totalLucro += dado.totalLucro;
		taxa_entrega += dado.taxa_entrega;
		totalPizza += dado.totalPizza;
		totalPedidos += dado.totalPedidos;
		
		linhaHtml += '<tr>'
					+ '<td class="text-center col-md-1">' + dado.data + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(dado.trocoInicio).toFixed(2) + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(dado.trocoFinal).toFixed(2) + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(dado.totalVendas).toFixed(2) + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(dado.totalLucro).toFixed(2) + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(dado.taxa_entrega).toFixed(2) + '</td>'
					+ '<td class="text-center col-md-1">' + dado.totalPizza + '</td>'
					+ '<td class="text-center col-md-1">' + dado.totalPedidos + '</td>'
					+ '<td class="text-center col-md-1">R$ ' + Number(compraDiaria).toFixed(2) + '</td>'
				+ '</tr>';
				
	}
	$("#gerarDadosMensal").html(linhaHtml);
	
	let somaHtml = '<tr>'
				+ '<td class="text-center col-md-1">Total:</td>'
				+ '<td class="text-center col-md-1">--</td>'
				+ '<td class="text-center col-md-1">--</td>'
				+ '<td class="text-center col-md-1">R$ ' + Number(totalVendas).toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + Number(totalLucro).toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + Number(taxa_entrega).toFixed(2) + '</td>'
				+ '<td class="text-center col-md-1">' + totalPizza + '</td>'
				+ '<td class="text-center col-md-1">' + totalPedidos + '</td>'
				+ '<td class="text-center col-md-1">R$ ' + Number(totalCompras).toFixed(2) + '</td>'
			+ '</tr>';
	$("#geralDadosSoma").html(somaHtml);
}


function carregarLoading(texto){
	$(".loading").css({
		"display": texto
	});
}
