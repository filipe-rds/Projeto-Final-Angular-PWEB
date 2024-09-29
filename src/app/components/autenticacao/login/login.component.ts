import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';
import { UsuarioFirestoreService } from '../../../shared/services/usuario-firestore.service';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario: Usuario = new Usuario("", "", "");

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, private localStorageService: LocalStorageService, private usuarioService: UsuarioFirestoreService, public sweet: MensagemSweetService) { }

  login(): void {
     this.usuarioService.login(this.usuario).subscribe({
      next: () => {
        this.sweet.sucesso('Usuário logado: ');
        const r = this.localStorageService.lerUsuarioDTO();
        this.roteador.navigate([`tela-usuario/${r?.id}`]).then(() => {
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
