package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "SALARIOS")
public class Salario extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private Long idFuncionario;
	
	@Column(nullable=false)
	private String usuario;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	private String data;
	
	@Column(nullable=false)
	private String logData;
	private int horas = 0;
	private double gastos = 0;
	private double pago = 0;
	
	@Column(nullable=false)
	private int codEmpresa;
}


