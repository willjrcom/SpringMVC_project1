package proj_vendas.vendas.service;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Email;
import proj_vendas.vendas.model.log.LogUsuario;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Usuarios;

@Service
public class UsuarioService implements UserDetailsService{
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private LogUsuarios logUsuarios;
	/*
	@Autowired
	private EmailController emailController;
	*/
	@Transactional
	public Usuario buscarPorEmail(String email) {
		return usuarios.findByEmail(email);
	}
	
	@Override @Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = buscarPorEmail(username);
				
		if(usuario.isAtivo() == false) {

			salvarLog("500", username);
			
			//email
			Email email = new Email();
			email.setEmail(username);
			email.setAssunto("Usuário bloqueado - Sistema Pizzaria Web");
			email.setTexto("-1");
			
			//try {
				//emailController.sendMail(email);
			//} catch (MessagingException e) {}
			
			return new User(usuario.getEmail(), "-1", AuthorityUtils.createAuthorityList(usuario.getPerfil()));
		}else {
			salvarLog("200", username);
		}
		
		
		// Setar nova data ao fazer login
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		usuario.setDia(format.format(new Date()));
		usuarios.save(usuario);
			
		return new User(
			usuario.getEmail(),
			usuario.getSenha(),
			AuthorityUtils.createAuthorityList(usuario.getPerfil())
			);
	}
	
	public int salvarLog(String acao, String username) {

		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		log.setAcao(acao);
		log.setUsuario(username);
		log.setData(hora.toString());
		log.setCodEmpresa(0);
		logUsuarios.save(log);
		return 0;
	}
}
