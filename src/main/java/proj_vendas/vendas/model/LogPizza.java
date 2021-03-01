package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class LogPizza extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String pizza;
	
	private int contador = 0;
}

