package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/dev")
public class DevController {
	
	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView menu() {
		ModelAndView mv = new ModelAndView("dev");
		return mv;
	}
	
	@RequestMapping(value = "/liberar/{codigo}", method = RequestMethod.PUT)
	@ResponseBody
	public boolean liberarCadastro(@PathVariable String codigo) {
		if(codigo.equals("objetivo42461255")) {
			return true;
		}else {
			return false;
		}
	}
	
	@RequestMapping(value = "/criar", method = RequestMethod.PUT)
	@ResponseBody
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
		return usuarios.save(usuario);
	}
}
