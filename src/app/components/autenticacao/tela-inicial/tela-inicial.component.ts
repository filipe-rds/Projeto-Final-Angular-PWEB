import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeModeService } from '../../../shared/services/theme-mode.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';


@Component({
  selector: 'tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent implements OnInit {
  escolha: string = 'login';

  constructor(private rotaAtual: ActivatedRoute, private roteador: Router, public themeService: ThemeModeService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    const usuario = this.localStorageService.lerUsuario();
    if (usuario && usuario.id) {
      // Verifique se a navegação já está no caminho correto
      if (this.roteador.url !== `/tela-inicial/${usuario.id}`) {
        this.roteador.navigate([`/tela-inicial/${usuario.id}`]);
      }
    }
  }


  toggleThemeMode() {
    this.themeService.updateThemeMode();
    // Recarrega o componente forçando a navegação para a mesma rota
    this.roteador.navigate([this.roteador.url]).then(() => {
      window.location.reload();
    });
  }


  login() {
    this.escolha = 'login';
  }

  cadastrar() {
    this.escolha = 'cadastro';
  }
}
