package proj_vendas.vendas.model.cadastros;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "FICHATECNICA", indexes = @Index(name = "codEmpresa_index", columnList = "codEmpresa"))
public class FichaTecnica extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private Long codEmpresa;

	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private float preco;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Ingrediente> ingrediente;
}
