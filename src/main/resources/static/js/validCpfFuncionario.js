$("#avisoCpf").hide();
$("#avisoCel").hide();
var link = window.location.href.split("/")[3];


// Método para consultar o CEP
$('#cpf').on('blur', function(){

	if($.trim($("#cpf").val()) != ""){
		
		var cpf = $(this).val();
		urlEnviar = "/" + link + "/buscarCpf/" + cpf;
		console.log(urlEnviar);
		
		$.ajax({
			url:  urlEnviar,
			type: 'PUT',
				
		}).done(function(e){
			if(e.length != 0) {
				$("#avisoCpf").show();
				$("#enviar").hide();
			}else {
				$("#avisoCpf").hide();
				$("#enviar").show();
			}
		}).fail(function(){
			console.log("Falhou!");
		});
	}			
});


//-----------------------------------------------------------------------------------------
$('#cel').on('blur', function(){

	if($.trim($("#cel").val()) != ""){
		
		var cel = $(this).val();
		
		//buscar cpf
		urlEnviar = "/" + link + "/buscarCelular/" + cel;
		console.log(urlEnviar);
		
		$.ajax({
			url:  urlEnviar,
			type: 'PUT',
				
		}).done(function(e){
			if(e.length != 0) {
				$("#avisoCel").show();
				$("#enviar").hide();
			}else {
				$("#avisoCel").hide();
				$("#enviar").show();
			}
		}).fail(function(){
			console.log("Falhou!");
		});
	}			
});

/*
var token = "36C6B9E3-5910-4A62-B04B-1B52B5652927";
var cpf = $("#cpf").val();
var nascimento = "26012000";
var plugin = "CPF";
$.ajax({
	method: 'GET',
	url: "https://www.sintegraws.com.br/api/v1/execute-api.php?token=" + token 
	+ "&cpf=" + cpf 
	+ "&data-nascimento=" + nascimento 
	+ "&plugin=" + plugin,
	
}).done(function(e){
	console.log(e);
	
}).fail(function(){
	$.alert("Cpf não encontrado!");
});
*/
