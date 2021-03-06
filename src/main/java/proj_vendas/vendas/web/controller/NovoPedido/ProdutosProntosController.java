package proj_vendas.vendas.web.controller.NovoPedido;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.PedidoTemp;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class ProdutosProntosController{
	
	@Autowired
	private PedidoTemps temps;

	@Autowired
	private Usuarios usuarios;

	@GetMapping("/produtosProntos")
	public ModelAndView tela() {
		return new ModelAndView("produtosProntos");
	}
	
	@RequestMapping("/produtosProntos/todosPedidos")
	@ResponseBody
	public List<PedidoTemp> todosPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		List<PedidoTemp> pedidos = temps.findByCodEmpresa(user.getCodEmpresa());
		limpezaAutomatica(pedidos);
		return pedidos; //mostrar todos
	}
	
	private void limpezaAutomatica(List<PedidoTemp> pedidos) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd kk:mm");

		for(int i = 0; i < pedidos.size(); i++) {
			if(pedidos.get(i).getStatus().equals("PRONTO")) {
				if(pedidos.get(i).getValidade().compareTo(format.format(new Date()).toString()) < 0) {
					temps.deleteById(pedidos.get(i).getId());
					pedidos.remove(i);
				}
			}
		}
	}
}
