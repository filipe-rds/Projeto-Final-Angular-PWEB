import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { UsuarioDTO } from '../models/usuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly usuarioKey = 'usuario';

  armazenarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }
  armazenarUsuarioDTO(usuario: UsuarioDTO): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  lerUsuario(): Usuario | null {
    const usuarioData = localStorage.getItem(this.usuarioKey);
    return usuarioData ? JSON.parse(usuarioData) : null;
  }

  lerUsuarioDTO(): UsuarioDTO | null {
    const usuarioData = localStorage.getItem(this.usuarioKey);
    return usuarioData ? JSON.parse(usuarioData) : null;
  }

  removerUsuario(): void {
    localStorage.removeItem(this.usuarioKey);
  }

  atualizarUsuario(usuario: Usuario): void {
    this.armazenarUsuario(usuario);
  }
  

  atualizarUsuarioDTO(usuario: UsuarioDTO): void {
    this.armazenarUsuarioDTO(usuario);
  }
}
