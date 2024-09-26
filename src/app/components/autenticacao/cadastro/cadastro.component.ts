import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  usuario: Usuario = new Usuario("", "", "");

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, private usuarioService: UsuarioService, public sweet: MensagemSweetService) { }

  cadastro(): void {
    console.log(this.usuario);

    if (this.usuario.nome.length <= 0) {
      this.sweet.info('Nome não pode estar vazio');
      return;
    }
    if (this.usuario.email.length <= 0) {
      this.sweet.info('E-mail não pode estar vazio');
      return;
    }
    if (this.usuario.senha.length <= 0) {
      this.sweet.info('Senha não pode estar vazia');
      return;
    }

    this.usuarioService.criarUsuario(this.usuario).subscribe(() => {
      this.sweet.info("Usuario cadastrado");
      return this.usuario;
    }, error => {
      this.sweet.info('Erro ao inserir usuário:');
    }
    );
    this.roteador.navigate([`tela-usuario/${this.usuario.id}`]).then(() => {
      window.location.reload();
    });
  }

}
