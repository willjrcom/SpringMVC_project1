package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/pronto")
public class MotoboyController{
	
	@RequestMapping
	public ModelAndView pronto() {
		ModelAndView mv = new ModelAndView("pronto");
		return mv;
	}
}
