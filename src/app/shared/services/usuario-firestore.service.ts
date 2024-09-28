import { Injectable } from '@angular/core';
import {from, of,throwError,Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
import { Disciplina } from '../models/disciplina';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { switchMap , map , catchError } from 'rxjs/operators';
import {LocalStorageService} from '../services/local-storage.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuarioFirestoreService {

  colecaoUsuarios: AngularFirestoreCollection<Usuario>;
  NOME_COLECAO = 'usuarios';
  API ="http://localhost:8080/usuarios";

  constructor(private afs: AngularFirestore, private localStorageService: LocalStorageService,private httpClient: HttpClient) { 
    this.colecaoUsuarios = afs.collection('usuarios');
  }

  // listar(): Observable<Usuario[]> {
  //   // usando options para idField para mapear o id gerado pelo firestore para o campo id de usuário
  //   return this.colecaoUsuarios.valueChanges({idField: 'id'}); 
  // }

  validarUsuario(usuario: Usuario): Observable<any>{
    console.log('ID do usuário:', usuario.id);
    console.log(typeof usuario.id);
    const user = usuario;
    console.log(user);
    if(user){
      return this.afs.collection('usuarios',ref =>ref.where('id','==',user.id)).valueChanges().pipe(
        map(users =>{
          console.log(users[0]);
          if(users) 
            return users[0];
          else 
            return null;
        })
      );
    }else{
      return throwError(() => new Error('sei n'));
    }
  }

    criarUsuario(usuario:Usuario): Observable<Usuario>{
      return this.httpClient.post<Usuario>(this.API,usuario).pipe(
        switchMap(usuarioAdicionado =>{
          const usuarioParaFirestore: Usuario = {
            ...usuarioAdicionado,
            senha: '',  // ou deixar vazio ou fazer um DTO para usuario sem a senha
            disciplinas: usuario.disciplinas // Inicializa como um array vazio
          };
  
          return from(this.colecaoUsuarios.add(usuarioParaFirestore)).pipe(
            map(() => usuarioAdicionado),
            catchError(err => {return throwError(err)})
          );       
          // return this.login(usuario);
        }),
        catchError(err => {
          return throwError(err);
        })   
      );
    }

    public listar(): Observable<Usuario[]>{
      return this.httpClient.get<Usuario[]>(this.API);
    }
    
    public atualizar(id : number, usuario: Usuario): Observable<Usuario>{
      return this.httpClient.put<Usuario>(this.API + "/" + id, usuario);
    }

    login(usuario: Usuario): Observable<Usuario> {
      return this.httpClient.post<Usuario>(this.API + "/login", usuario).pipe(
        map((usuarioRetornado) => {
          const u = new Usuario(usuarioRetornado.nome, usuarioRetornado.email, "");
          u.id = usuarioRetornado.id;
          if (!u || !u.id) {
            throw new Error("Usuário ou id do usuário nulo");
          }
          return u; // Retorna o usuário
        }),
        switchMap((u: Usuario) => this.validarUsuario(u).pipe(
          switchMap(usuarioValidado => {
            if (usuarioValidado) {
              // Adiciona o usuário ao Local Storage
              this.localStorageService.armazenarUsuario(usuarioValidado);
              return of(usuarioValidado); // Retorna o usuário validado
            } else {
              throw new Error("Usuário não encontrado no Firestore");
            }
          })
        )),
        catchError(err => {
          return throwError(err);
        })
      );
    }

}
