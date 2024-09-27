import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioFirestoreService {

  colecaoUsuarios: AngularFirestoreCollection<Usuario>;
  NOME_COLECAO = 'usuarios';

  constructor(private afs: AngularFirestore) { 
    this.colecaoUsuarios = afs.collection('usuarios');
  }

  listar(): Observable<Usuario[]> {
    // usando options para idField para mapear o id gerado pelo firestore para o campo id de usuário
    return this.colecaoUsuarios.valueChanges({idField: 'id'});
   
  }

  criarUsuario(user: Usuario): Observable<object>{
    
    return from(this.colecaoUsuarios.add(Object.assign({},user)));
  }
}
