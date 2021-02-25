package proj_vendas.vendas.model;

import javax.persistence.Column;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
public class Compra extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String nome;

	@Column(nullable=false)
	private float valor;
}
