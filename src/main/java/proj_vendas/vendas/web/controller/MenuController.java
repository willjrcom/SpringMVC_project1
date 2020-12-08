package proj_vendas.vendas.web.controller;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private LogUsuarios logUsuarios;
	
	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private PedidoTemps temps;
	
	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		
		//pedidos
		int totalAberto = pedidos.totalPedidos(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia(), "FINALIZADO", "EXCLUIDO");
		int totalFinalizado = pedidos.totalPedidos(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia(), "PRONTO", "EXCLUIDO");
		
		//pizzas
		int cozinha = temps.totalPedidos(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia(), "COZINHA");
		int pronto = temps.totalPedidos(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia(), "PRONTO");
		
		if(empresa != null) {
			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", "Contato: " + empresa.getCelular());
		}else {
			mv.addObject("empresa", "GazalTech");
			mv.addObject("contato", "Acesse: EMPRESA -> OPÇÕES -> Cadastre-se");
		}
		
		//pizzas
		mv.addObject("cozinha", cozinha);
		mv.addObject("pronto", pronto);
	
		//pedidos
		mv.addObject("totalFinalizado", totalFinalizado);
		mv.addObject("totalAberto", totalAberto);
		
		//empresa
		mv.addObject("usuario", user.getEmail());
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}
	
	@RequestMapping("/login")
	@ResponseBody
	public void login() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		LocalDate diaAtual = LocalDate.now(); // Create a date object
		String dia = diaAtual.toString();
	    
		//alterar a tabela dados
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);//busca no banco de dados
		
		if(dado == null) {//verifica se ja existe
			dado = new Dado();
		}
		dado.setCodEmpresa(user.getCodEmpresa());
		dado.setData(dia);//seta a data atual
		
		//alterar a tabela dia
		Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
		
		if(data == null) {//verifica se dia existe
			data = new Dia();
		}
		data.setCodEmpresa(user.getCodEmpresa());
		data.setDia(dia);//seta dia
		
		//salvar dados
		dias.save(data);//salva o dia
		dados.save(dado);//salva a data
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		
		log.setUsuario(user.getEmail());
		log.setAcao("login");
		log.setData(hora.toString());
		log.setCodEmpresa(user.getCodEmpresa());
		
		logUsuarios.save(log); //salvar logUsuario
	}
	
	@RequestMapping(value = "/verificarData/{dia}")
	@ResponseBody
	public Dado alterarData(@PathVariable String dia) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado1 = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
		
		if(dado1 != null) {//se ja existir
			Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
			data.setDia(dia);
			data.setCodEmpresa(user.getCodEmpresa());
			dias.save(data);
			return dado1;
			
		}else {//se nao existir
			//alterar a tabela dados
			Dado dado = new Dado();
			dado.setCodEmpresa(user.getCodEmpresa());
			dado.setData(dia);
			
			//alterar a tabela dia
			Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
			
			if(data == null) {
				data = new Dia();
			}
			data.setDia(dia);
			data.setCodEmpresa(user.getCodEmpresa());
			//salvar dados
			dias.save(data);
			return dados.save(dado);
		}
	}
	
	@RequestMapping(value = "/troco/{data}/{trocoInicial}")
	@ResponseBody
	public int buscarId(@PathVariable String data, @PathVariable double trocoInicial) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);
		dado.setTrocoInicio(trocoInicial);
		dados.save(dado);
		return 200;
	}
	
	@RequestMapping(value = "/mostrarDia")
	@ResponseBody
	public Dia MostrarDia() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dias.findByCodEmpresa(user.getCodEmpresa());
	}
	
	@RequestMapping("/autenticado")
	@ResponseBody
	public String autenticado() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ((UserDetails)principal).getUsername();
	}
}
