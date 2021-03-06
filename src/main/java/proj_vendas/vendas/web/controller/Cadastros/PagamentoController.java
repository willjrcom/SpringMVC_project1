package proj_vendas.vendas.web.controller.Cadastros;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Funcionario;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Pagamento;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class PagamentoController {

	@Autowired
	private Funcionarios funcionarios;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;

	@GetMapping("/pagamento")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		DecimalFormat decimal = new DecimalFormat("0.00");
		float horaExtra = empresas.findByCodEmpresa(user.getCodEmpresa()).getHoraExtra();

		ModelAndView mv = new ModelAndView("pagamento");

		mv.addObject("horaExtra", decimal.format(horaExtra));
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}

	@RequestMapping(value = "/pagamento/empresa")
	@ResponseBody
	public Empresa empresa() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return empresas.findByCodEmpresa(user.getCodEmpresa());
	}

	@RequestMapping(value = "/pagamento/todosFuncionarios")
	@ResponseBody
	public List<Funcionario> todos() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return funcionarios.findByCodEmpresa(user.getCodEmpresa());
	}

	@RequestMapping(value = "/pagamento/salvar/{id}/{data}")
	@ResponseBody
	public ResponseEntity<Pagamento> salvar(@RequestBody Pagamento pagamento, @PathVariable long id,
			@PathVariable String data) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		SimpleDateFormat formatLogData = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");
		SimpleDateFormat formatData = new SimpleDateFormat("yyyy-MM");

		// log usuario
		pagamento.setUsuario(user.getEmail());
		pagamento.setLogData(formatLogData.format(new Date()));

		if (data.equals("0")) {
			pagamento.setData(formatData.format(new Date()));
		} else {
			pagamento.setData(data);
		}

		Funcionario funcionario = funcionarios.findById(id).get();

		if (funcionario.getCodEmpresa() == user.getCodEmpresa()) {
			// buscar pagamentos
			List<Pagamento> todosPagamentos = funcionario.getPagamento();
			todosPagamentos.add(pagamento);
			funcionario.setPagamento(todosPagamentos);
			funcionarios.save(funcionario);

			// receber valor para confirmar total
			if (pagamento.getDiarias() != 0)
				pagamento.setDiarias(1);

			return ResponseEntity.ok(pagamento);
		}
		return ResponseEntity.badRequest().build();
	}

	@RequestMapping(value = "/pagamento/buscar/{id}/{data}")
	@ResponseBody
	public List<Pagamento> buscar(@PathVariable Long id, @PathVariable String data) {
		List<Pagamento> pagamento = funcionarios.findById(id).get().getPagamento();
		System.out.println(data);

		if (pagamento != null) {
			for (int j = 0; j < pagamento.size(); j++) {
				System.out.println(pagamento.get(j).getData());
				if (!pagamento.get(j).getData().equals(data)) {
					pagamento.remove(j);
				}
			}
			return pagamento;
		} else {
			return null;
		}
	}
}
