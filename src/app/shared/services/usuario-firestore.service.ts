import { Injectable } from '@angular/core';
import {from, throwError,Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { switchMap , map , catchError } from 'rxjs/operators';


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

  criarUsuario(user: Usuario): Observable<any>{
    
    return this.afs.collection<Usuario>('usuarios', ref => ref.where('email', '==', user.email))
    .valueChanges()
    .pipe(
      // Verifica se o email já existe
      switchMap(usuarios => {
        if (usuarios.length > 0) {
          // Se o email já existir, retorna um erro
          return throwError(() => new Error('Email já cadastrado.'));
        } else {
          // Se o email não existir, faz a inserção do novo usuário
          return from(this.afs.collection('usuarios').add(Object.assign({}, user)));
        }
      }),
      catchError(err => {
        // Captura e lida com o erro
        console.error('Erro ao criar usuário:', err.message);
        return throwError(err);
      }),
      switchMap((docRef) => {
        user.id =docRef.id;
        // Atualiza o firestore para conter o campo id 
        return from(docRef.update({id: user.id}))
      }),
      catchError(err => {
        return throwError(err)
      })
    );


  }
}
