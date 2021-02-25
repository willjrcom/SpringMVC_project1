package proj_vendas.vendas.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "CLIENTE")
public class Cliente extends AbstractEntity<Long> {

	@Column(nullable=false)
	private int codEmpresa;
	
	@Column(nullable=false)
	private String nome;

	private String cpf;

	@Column(nullable=false)
	private Long celular;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	private String dataCadastro;
	private int contPedidos = 0;
}


