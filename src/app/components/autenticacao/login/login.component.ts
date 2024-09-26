import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario: Usuario = new Usuario("", "", "");

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, private usuarioService: UsuarioService, public sweet: MensagemSweetService) { }

  login(): void {
    this.usuarioService.validarUsuario(this.usuario).subscribe({
      next: (usuarioEncontrado) => {
        this.sweet.sucesso('Usuário logado: ' + usuarioEncontrado.nome);
        this.roteador.navigate([`tela-usuario/${usuarioEncontrado.id}`]).then(() => {
          window.location.reload();
        });
      },
      error: error => {
        // Lida com o erro se o login falhar
        this.sweet.info('Erro ao acessar usuário: ' + error.message);
      }
    });
  }

}
