import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';
import { UsuarioFirestoreService } from '../../../shared/services/usuario-firestore.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  usuario: Usuario = new Usuario("", "", "");

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, private usuarioService: UsuarioFirestoreService,private localStorageService: LocalStorageService ,public sweet: MensagemSweetService) { }



  cadastro(): void {
  
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

    console.log(this.usuario);
    this.usuarioService.criarUsuario(this.usuario).subscribe({
      next: () =>{
        console.log("Usuario cadastrado");
        this.usuarioService.login(this.usuario).subscribe({
          next: () => {
            console.log("login feito com sucesso")
            const dto = this.localStorageService.lerUsuarioDTO();
            console.log(dto?.id);
            this.roteador.navigate([`tela-usuario/${dto?.id}`]).then(() => {
              window.location.reload();
            });
          },
          error: (err) => this.sweet.erro("erro ao fazer login:"+err)
        });
        return this.usuario;
      },
      error: (err) => {
      this.sweet.info(`Erro ao inserir usuário: ${err}`);
      }
    });
   
  }

}
