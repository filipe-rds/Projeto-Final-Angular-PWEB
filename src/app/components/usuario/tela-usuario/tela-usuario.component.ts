import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../shared/models/usuario';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ThemeModeService } from '../../../shared/services/theme-mode.service';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
  selector: 'tela-usuario',
  templateUrl: './tela-usuario.component.html',
  styleUrl: './tela-usuario.component.scss'
})
export class TelaUsuarioComponent implements OnInit {
  escolha: string = 'disciplinas';

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, public themeService: ThemeModeService, private localStorageService: LocalStorageService, private usuarioService: UsuarioService) {
    const idUsuario = Number(this.rotaAtual.snapshot.paramMap.get('id')) || undefined;
    if (idUsuario) {
      this.usuarioService.buscarUsuario(idUsuario).subscribe(
        usuario => {
          localStorageService.atualizarUsuario(usuario);
      });
    }
  }

  ngOnInit(): void {
    //
  }

  toggleThemeMode() {
    this.themeService.updateThemeMode();
    // Recarrega o componente forçando a navegação para a mesma rota
    this.roteador.navigate([this.roteador.url]).then(() => {
      window.location.reload();
    });
  }

  logout() {
    this.usuarioService.logout();
    this.roteador.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  dados() {
    this.escolha = 'dados';
  }

  disciplinas() {
    this.escolha = 'disciplinas';
  }

  tarefas() {
    this.escolha = 'tarefas';
  }

  progresso() {
    this.escolha = 'progresso';
  }



}
