package proj_vendas.vendas;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import proj_vendas.vendas.model.cadastros.Cupom;
import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.empresa.PedidoTemp;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.PedidoTemps;

@Service
@Controller
@Component
public class LimpezaDiaria {

	@Autowired
	private PedidoTemps temps;
	
	@Autowired
	private Empresas empresas;
	
	@Async("fileExecutor")
	public void cleanAllTemps() {
		System.out.println("inicio - pedidos temporarios");
		List<PedidoTemp> pedidos = temps.findAll();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd kk:mm");
		System.out.println("total de pedidos temporarios: " + pedidos.size());
		
		for(int i = 0; i < pedidos.size(); i++) {
			System.out.println(pedidos.get(i).getValidade() + "\n" + format.format(new Date()));
			System.out.println(pedidos.get(i).getValidade().equals(format.format(new Date())));
			if(pedidos.get(i).getValidade().compareTo(format.format(new Date())) < 0) {
				temps.deleteById(pedidos.get(i).getId());
			}
		}
		System.out.println("Fim - pedidos temporarios");
	}
	
	// Limpar cupons
	private void verificarCupom(Empresa empresa) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		int cont = 0;
		// controlar cupons validados
		try {
			List<Cupom> listCupom = empresa.getCupom();
			for (int i = 0; i < listCupom.size(); i++) {
				if (listCupom.get(i).getValidade().compareTo(format.format(new Date())) == -1) {
					listCupom.remove(i);
					cont++;
				}
			}
			if (cont != 0) {
				empresa.setCupom(listCupom);
				empresas.save(empresa);
			}
		} catch (Exception e) {
			System.out.println(e);
		}
	}
}
