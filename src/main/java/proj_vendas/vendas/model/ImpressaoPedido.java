package proj_vendas.vendas.model;

import lombok.Data;

@Data
public class ImpressaoPedido {
	private Long comanda;
	private String nome;
	private String nomeEstabelecimento;
	private String cnpj;
	private String enderecoEmpresa;
	
	private String envio;
	private String celular;
	private String endereco;
	private String referencia;
	private String obs;
	
	private ImpressaoPizza[] pizzas;
	private ImpressaoProduto[] produtos;
	
	private float total;
	private float taxa;
	private float troco;
	
	private String texto1;
	private String texto2;
	private String promocao;
	
	private String hora;
	private String setor;
	private String cupom;
	private String servico;
}
