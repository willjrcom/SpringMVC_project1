package proj_vendas.vendas.web.controller.Cadastros;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class CadastroFuncionarioController{
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping("/cadastroFuncionario/**")
	public ModelAndView CadastroFuncionario() {
		return new ModelAndView("cadastroFuncionario");
	}

	@RequestMapping(value = "/cadastroFuncionario/cadastrar")
	@ResponseBody
	public Funcionario cadastrarCliente(@RequestBody Funcionario funcionario) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		funcionario.setCodEmpresa(user.getCodEmpresa());
		
		return funcionarios.save(funcionario);
	}
		
	@RequestMapping(value = "/cadastroFuncionario/buscarCpf/{cpf}/{id}")
	@ResponseBody
	public Funcionario buscarCpf(@PathVariable String cpf, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Funcionario busca = funcionarios.findByCodEmpresaAndCpf(user.getCodEmpresa(), cpf);
		
		if(busca != null && id != -2) {
			long funcionario = funcionarios.findById(id).get().getId();
			
			if(busca.getId() == funcionario) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
	
	@RequestMapping(value = "/cadastroFuncionario/buscarCelular/{celular}/{id}")
	@ResponseBody
	public Funcionario buscarCelular(@PathVariable String celular, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Funcionario busca = funcionarios.findByCodEmpresaAndCelular(user.getCodEmpresa(), celular);
	
		if(busca != null && id != -2) {
			long funcionario = funcionarios.findById(id).get().getId();
			
			if(busca.getId() == funcionario) {
				Funcionario vazio = new Funcionario();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
	
	@RequestMapping(value = "/cadastroFuncionario/editarFuncionario/{id}")
	@ResponseBody
	public Optional<Funcionario> buscarFuncionario(@PathVariable Long id) {
		return funcionarios.findById(id);
	}
}