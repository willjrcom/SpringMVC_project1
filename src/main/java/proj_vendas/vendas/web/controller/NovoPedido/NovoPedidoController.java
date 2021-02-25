package proj_vendas.vendas.web.controller.NovoPedido;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Cupom;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.LogMesa;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/novoPedido")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dados dados;

	@Autowired
	private Empresas empresas;

	@Autowired
	private PedidoTemps temps;

	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Funcionarios funcionarios;
	
	@RequestMapping("/**")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());//busca no banco de dados
		
		ModelAndView mv = new ModelAndView("novoPedido");
		mv.addObject("trocoInicial", dado.getTrocoInicio());
		return mv;
	}

	
	@RequestMapping(value = "/numeroCliente/{celular}")
	@ResponseBody
	public Cliente buscarNumeroCliente(@PathVariable Long celular) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);
	}
	

	@RequestMapping(value = "/nomeProduto/{nome}")
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		//buscar apenas codigo
		List<Produto> produto = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", true);// busca apenas 1 item
																	
		if (produto.size() >= 1) {
			return produto;
		} else {// buscar se esta indisponivel
			List<Produto> produtoIndisponivel = produtos.findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(user.getCodEmpresa(), nome, "BORDA", false);// busca produto indisponivel
			if(produtoIndisponivel.size() != 0) {
				produtoIndisponivel.get(0).setId((long) -1);// codigo -1: nao disponivel
				return produtoIndisponivel;
			}
		}
		return produtos.findByCodEmpresaAndNomeProdutoContainingAndSetorNot(user.getCodEmpresa(), nome, "BORDA");
	}

	
	@RequestMapping(value = "/bordas")
	@ResponseBody
	public List<Produto> mostrarBordas() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return produtos.findByCodEmpresaAndSetorAndDisponivel(user.getCodEmpresa(), "BORDA", true);
	}

	@RequestMapping(value = "/salvarPedido")
	@ResponseBody
	public ResponseEntity<Pedido> salvarPedido(@RequestBody Pedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		//se o pedido nao existir
		if(pedido.getId() == null) {
			// buscar dia nos dados
			Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia()); 

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda nos dados
			dados.save(dado); // salva dados

			if(pedido.getEnvio().equals("ENTREGA") && pedido.getId() == null) {//se for cliente cadastrado
				Cliente cliente = clientes.findByCodEmpresaAndCelular(user.getCodEmpresa(), pedido.getCelular());//buscar cliente nos dados
				cliente.setContPedidos(cliente.getContPedidos() + 1);//adicionar contador de pedidos
				clientes.save(cliente);
			}

			Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
			if(pedido.getEnvio().equals("MESA")) {
				LogMesa mesa = new LogMesa();
				mesa.setMesa(pedido.getNome());
				List<LogMesa> logsMesas = empresa.getLogMesa();
				logsMesas.add(mesa);
				empresa.setLogMesa(logsMesas);
				empresas.save(empresa);
			}
			
			Conquista conquista = empresa.getConquista();
			if(conquista.isCadPedido() == false) {
				conquista.setCadPedido(true);
				empresa.setConquista(conquista);
				empresas.save(empresa);
			}
		}
		
		pedido.setCodEmpresa(user.getCodEmpresa());
		pedido.setStatus("PRONTO");
		
		return ResponseEntity.ok(pedidos.save(pedido)); // salvar pedido
	}

	@RequestMapping(value = "/editarPedido/{id}")
	@ResponseBody
	public Pedido editarPedido(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Pedido pedido = pedidos.findByIdAndCodEmpresa(id, user.getCodEmpresa());
		
		if(pedido.getCodEmpresa() == user.getCodEmpresa()) {
			return pedido;
		}
		return null;
	}

	@RequestMapping(value = "/atualizar/{nome}")
	@ResponseBody
	public Pedido atualizarPedido(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Pedido pedidoAntigo = pedidos.findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(user.getCodEmpresa(), user.getDia(), nome, "FINALIZADO", "EXCLUIDO");
				
		//necessario enviar a data
		if(pedidoAntigo == null) {
			Pedido vazio = new Pedido();
			vazio.setData(user.getDia());
			return vazio;
		}
		return pedidoAntigo;
	}
	
	
	@RequestMapping(value = "/salvarTemp")
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		temp.setCodEmpresa(user.getCodEmpresa());
		temps.save(temp);
	}
	

	@RequestMapping(value = "/excluirPedidosTemp/{comanda}")
	@ResponseBody
	public void excluirPedidoTemp(@PathVariable long comanda) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndComanda(user.getCodEmpresa(), user.getDia(), comanda);
		temps.deleteInBatch(temp);
	}
	
	
	@RequestMapping("/mostrarCupons")
	@ResponseBody
	public List<Cupom> cupons(){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getCupom();
	}
	
	
	@RequestMapping("/garcons")
	@ResponseBody
	public List<Funcionario> garcons(){
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return funcionarios.findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(user.getCodEmpresa(), "GARCON", user.getCodEmpresa(), "GERENTE", user.getCodEmpresa(), "ANALISTA");
	}
}
