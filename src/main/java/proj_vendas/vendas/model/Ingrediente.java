package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "INGREDIENTES")
public class Ingrediente extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private int codEmpresa;

	@Column(nullable=false)
	private String nome;
	
	private float preco;
}