package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDO")
public class Pedido extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private Long comanda;
	
	@Column(nullable=false)
	private String nome;
	private Long celular;
	private String endereco;
	private String referencia;
	@Lob
	private String pizzas;
	@Lob
	private String produtos;
	
	private String motoboy;
	private String ac;
	private String garcon;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	private String obs;
	private String horaPedido;
	private String data;
	private String cupom;
	private String modoPagamento;
	private boolean pago;
	
	private float taxa = 0;
	private float total = 0;
	private float troco = 0;
	private float servico = 0;
	private int codEmpresa;
}
