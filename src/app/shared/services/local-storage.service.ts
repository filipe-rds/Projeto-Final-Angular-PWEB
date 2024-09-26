import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly usuarioKey = 'usuario';

  armazenarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  lerUsuario(): Usuario | null {
    const usuarioData = localStorage.getItem(this.usuarioKey);
    return usuarioData ? JSON.parse(usuarioData) : null;
  }

  removerUsuario(): void {
    localStorage.removeItem(this.usuarioKey);
  }

  atualizarUsuario(usuario: Usuario): void {
    this.armazenarUsuario(usuario);
  }
}
