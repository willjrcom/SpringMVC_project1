package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.repository.Dados;

@Controller
@RequestMapping("/diaAberto")
public class DiaAbertoController {
	
	@Autowired
	private Dados dados;
	
	@RequestMapping
	public ModelAndView menu() {
		return new ModelAndView("diaAberto");
	}
	
	@RequestMapping(value = "/todosDias", method = RequestMethod.PUT)
	@ResponseBody
	public List<Dado> todos() {
		return dados.findByTrocoFinalOrTrocoInicio(0,0);
	}
}