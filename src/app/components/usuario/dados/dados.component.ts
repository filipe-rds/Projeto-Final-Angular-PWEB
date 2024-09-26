import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../shared/models/usuario';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';

@Component({
  selector: 'dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss'],
})
export class DadosComponent implements OnInit {
  usuario!: Usuario | null;
  formulario!: FormGroup;

  constructor(
    private rotaAtual: ActivatedRoute,
    private roteador: Router,
    private localStorageService: LocalStorageService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    public sweet: MensagemSweetService
  ) {}

  ngOnInit(): void {
    this.usuario = this.localStorageService.lerUsuario();
    if (!this.usuario) {
      this.sweet.erro('Usuário não encontrado!');
      this.roteador.navigate(['']);
      return;
    }

    this.formulario = this.fb.group({
      id: [this.usuario?.id],
      nome: [this.usuario?.nome],
      email: [this.usuario?.email],
      senha: [this.usuario?.senha],
    });
  }

  salvar() {
    if (this.formulario.invalid) {
      this.sweet.info('Formulário inválido');
      return;
    }

    const dadosAtualizados = this.formulario.value;

    // Preserva as disciplinas existentes
    const usuarioAtualizado: Usuario = {
      ...this.usuario,
      ...dadosAtualizados,
      disciplinas: this.usuario?.disciplinas || [], // preserva as disciplinas
    };

    this.usuarioService.alterarUsuario(usuarioAtualizado).subscribe(
      () => {
        this.localStorageService.atualizarUsuario(usuarioAtualizado); // Atualiza o local storage
        this.sweet.sucesso('Dados salvos com sucesso');
        this.roteador.navigate([`tela-usuario/${usuarioAtualizado.id}`]);
      },
      (error) => {
        this.sweet.erro('Erro ao alterar o usuário');
      }
    );
  }

  cancelar() {
    if (this.usuario?.id) {
      this.roteador.navigate([`tela-usuario/${this.usuario.id}`]).then(() => {
        window.location.reload();
      });
    }
  }
}
