import { Injectable } from '@angular/core';
import {from,tap ,of,throwError,Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
import { Disciplina } from '../models/disciplina';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { switchMap , map , catchError, take } from 'rxjs/operators';
import {LocalStorageService} from '../services/local-storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UsuarioDTO } from '../models/usuarioDTO';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Tarefa } from '../models/tarefa';


@Injectable({
  providedIn: 'root'
})
export class UsuarioFirestoreService {

  colecaoUsuarios: AngularFirestoreCollection<UsuarioDTO>;
  NOME_COLECAO = 'usuarios';
  API ="http://localhost:8080/usuarios";

  constructor(private afs: AngularFirestore, private localStorageService: LocalStorageService,private httpClient: HttpClient) { 
    this.colecaoUsuarios = afs.collection('usuarios');
  }

  // listar(): Observable<Usuario[]> {
  //   // usando options para idField para mapear o id gerado pelo firestore para o campo id de usuário
  //   return this.colecaoUsuarios.valueChanges({idField: 'id'}); 
  // }

  validarUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO | null> {
    //console.log("Validando usuário com ID:", usuario.idField); // Adicione este log
    return this.colecaoUsuarios.doc(usuario.idField).get().pipe(
      map(snapshot => {
        if (snapshot.exists) {
          return { idField: snapshot.id, ...snapshot.data() } as UsuarioDTO;
        } else {
          return null;
        }
      }),
      catchError(err => {
        console.error("Erro ao validar usuário:", err); // Adicione log de erro
        return throwError(() => new Error('Erro ao validar usuário'));
      })
    );
  }
  

  criarUsuarioPostgres(usuario:Usuario):Observable<Usuario>{
    return this.httpClient.post<Usuario>(this.API,usuario);
  }
  criarUsuarioFirestore(usuario: Usuario){
    const dto = new UsuarioDTO(usuario.id.toString(),usuario.disciplinas);

    if (!dto.disciplinas) {
      dto.disciplinas = []; // Inicializa como um array vazio se for indefinido
    }

    //console.log('Tentando adicionar o usuário ao Firestore:', dto);

    const usuarioData = {
      id: dto.id,
      disciplinas: dto.disciplinas,
      idField: ''
    };

    return from(this.colecaoUsuarios.add(usuarioData)).pipe(
      switchMap(docRef => {
        const docId = docRef.id;
        dto.idField = docId;
  
        return from(this.colecaoUsuarios.doc(docId).update({
          idField: dto.idField 
        })).pipe(
          map(() => {
            this.localStorageService.armazenarUsuarioDTO(dto);
            //console.log('ID do usuário atualizado no Firestore com sucesso.');
            return docId; // Opcional: Retorna o id gerado, se necessário
          })
        );
      }),catchError(err => { 
        console.error('Erro ao adicionar usuário ao Firestore:', err);
        return throwError(() => new Error('erro'+ err))
      })
    );
  }
  criarUsuario(usuario: Usuario): Observable<any> {
    //console.log('Iniciando criação do usuário:', usuario);
    return this.criarUsuarioPostgres(usuario).pipe(
      // tap(usuarioCriado => console.log('Usuário criado no Postgres:', usuarioCriado)),
      switchMap(usuarioCriado => {
        return this.criarUsuarioFirestore(usuarioCriado).pipe(
          // tap(idFirestore => console.log('Usuário criado no Firestore com id:', idFirestore)),
          map(idFirestore => {
            //console.log("2");
            //console.log('Usuário criado com sucesso no Firestore com id:', idFirestore);
            return usuarioCriado; // Retorna o usuário criado
          })
        )
  }),
      catchError(err => {
        console.error('Erro ao criar usuário:', err);
        return throwError(() => new Error('Erro ao criar usuário no Postgres ou Firestore :'+ err));
      })
    );
  }
  

    public listar(): Observable<Usuario[]>{
      return this.httpClient.get<Usuario[]>(this.API);
    }

    public getIdField(usuario: Usuario):Observable<string>{
      // console.log("Buscando ID para o usuário com ID:", usuario.id);
      // console.log(typeof usuario.id);
      return this.afs.collection('usuarios',ref =>ref.where('id','==',usuario.id.toString())).snapshotChanges().pipe(
        take(1),
        switchMap(actions => {
          // console.log("Resultados da consulta:", actions);
          if(actions.length > 0){
            const docId =actions[0].payload.doc.id;
            //console.log("ID encontrado:", docId);
            return of(docId);
          } else{
            return throwError(() => new Error('Usuario não encontrado '));
          }
        }), catchError(err => {
          return throwError(() =>new Error('erro:'+ err));
        })
      )
    }

    public alterarFirestore(usuario:UsuarioDTO): Observable<any>{
      // console.log("::::");
      // console.log(usuario);

      if (!usuario.idField) {
        console.error("idField não é válido:", usuario.idField);
        return throwError(() => new Error('idField não pode ser vazio'));
      }

            return from(this.colecaoUsuarios.doc(usuario.idField).set({
              id:usuario.id,
              idField:usuario.idField,
              disciplinas: usuario.disciplinas.map(disciplina =>this.serializeDisciplina(disciplina))
            })).pipe(
              catchError(err => {
                console.error("Erro ao atualizar usuário no Firestore:", err);
                return throwError(() => new Error('Erro ao atualizar usuário'+err.message));
              })
            );
    }
  
    
    public alterarUsuario(usuario: Usuario): Observable<any>{
       return this.httpClient.patch<Usuario>(this.API + "/" + usuario.id, usuario);    
    }

    login(usuario: Usuario): Observable<any> {
      return this.httpClient.post<Usuario>(this.API + "/login", usuario).pipe(
        switchMap((usuarioRetornado: Usuario) => {
          //console.log("Usuário retornado do backend:", usuarioRetornado);
          const u = new UsuarioDTO(usuarioRetornado.id.toString(),usuario.disciplinas);
          return this.getIdField(usuarioRetornado).pipe(
            map(idField =>{
              u.idField = idField;
              return u; // Retorna o usuário
            })
          )
        }),        
        //valida se o usuario existe no firestore
        switchMap((u:UsuarioDTO) => {
          //console.log(u);
          //console.log("Antes de validar usuário, ID:", u.idField);
          return this.validarUsuario(u).pipe(
            map((usuarioValidado: UsuarioDTO | null) => {
              if(usuarioValidado){
                this.localStorageService.armazenarUsuarioDTO(usuarioValidado);
                return usuarioValidado;
              }else{
                return throwError(() => new Error('Usuario não encontrado no Firestore'))
              }
            })
          );
        }),catchError(err => {
          console.error("Erro ao fazer login:", err);
          return throwError(() => new Error('Erro ao fazer login'));
          })
      );
    }

     serializeTarefa(tarefa: Tarefa): {id: number,nome:string,descricao:string} {
      return {
        id: tarefa.id,
        nome: tarefa.nome,
        descricao: tarefa.descricao,
      };
    }

    serializeDisciplina(disciplina: Disciplina): {id: number; nome: string; descricao: string; tarefas:{id: number,nome: string, descricao: string}[]} {
      return {
        id: disciplina.id,
        nome: disciplina.nome,
        descricao: disciplina.descricao,
        tarefas: disciplina.tarefas.map(tarefa =>this.serializeTarefa(tarefa))
      };
    }

    atualizar(): Observable<any> {

      // Lê o UsuarioDTO do Local Storage
      const usuarioDTO = this.localStorageService.lerUsuarioDTO();
  
      // Verifica se o UsuarioDTO existe e se o idField é válido
      if (!usuarioDTO || !usuarioDTO.idField) {
          throw new Error('Usuário não encontrado ou idField inválido');
      }
  
      // Busca o documento correspondente no Firestore usando idField
      return this.colecaoUsuarios.doc(usuarioDTO.idField).get().pipe(
          map(snapshot => {
              if (snapshot.exists) {
                  // Se o documento existe, obtém os dados
                  const usuarioFirestore = { idField: snapshot.id, ...snapshot.data() } as UsuarioDTO;
  
                  // Atualiza o Local Storage com os dados do Firestore
                  this.localStorageService.armazenarUsuarioDTO(usuarioFirestore);
                  return usuarioFirestore; // Retorna o usuário atualizado
              } else {
                  throw new Error('Documento não encontrado no Firestore');
              }
          }),
          catchError(err => {
              console.error("Erro ao atualizar usuário:", err);
              return throwError(() => new Error('Erro ao atualizar usuário no Firestore'));
          })
      );
  }
  

    criarDisciplina(disciplina: Disciplina): Observable<any> {
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
    
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
    
      return this.validarUsuario(usuario).pipe(
        switchMap(usuarioValidado => { // Mudei de map para switchMap
          if (!usuarioValidado) {
            return throwError(() => new Error("Usuário não existe"));
          } else {
            let tamanho: number = usuarioValidado.disciplinas.length;
            let id: number;
    
            if (tamanho > 0) {
              id = Number(usuarioValidado.disciplinas[tamanho - 1].id) + 1;
            } else {
              id = 1;
            }
    
            disciplina.id = id;
            usuarioValidado.disciplinas.push(disciplina);
    
            return this.alterarFirestore(usuarioValidado).pipe(
              map(() => {
                this.localStorageService.armazenarUsuarioDTO(usuarioValidado); // Atualiza o Local Storage aqui
                return usuarioValidado; // Retorna o usuário atualizado
              }),
              catchError(err => {
                console.error("Erro ao atualizar disciplinas no Firestore:", err);
                return throwError(() => new Error("Erro ao atualizar disciplinas"));
              })
            );
          }
        })
      );
    }


    //CRUD de disciplinas 

    alterarDisciplina(disciplina: Disciplina){
      if (disciplina.nome.length <= 0) {
        throw new Error('Nome da disciplina não pode ser vazio');
      }
      if (disciplina.descricao.length <= 0) {
        throw new Error('Descrição da disciplina não pode ser vazia');
      }
  
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
  
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }

        if(usuario && usuario.disciplinas.length > 0){
          const indiceDisciplina = usuario.disciplinas.findIndex(
            (element) => element.id == disciplina.id
          );
          console.log(indiceDisciplina);

          if(indiceDisciplina !== -1){
            console.log(usuario.disciplinas[indiceDisciplina]);
            usuario.disciplinas[indiceDisciplina] = disciplina;
            //console.log(usuario.disciplinas[indiceDisciplina]);
            return this.alterarFirestore(usuario).pipe(
              map(() => {
                console.log(usuario);
                this.localStorageService.atualizarUsuarioDTO(usuario);
                console.log("Local Storage atualizado:", this.localStorageService.lerUsuarioDTO());
                return usuario;
              }),catchError(() => throwError(() => new Error('erro ao editar disciplina')))
            )
          }else{
            throw new Error('Disciplina não encontrada');
          }
        }else{
          throw new Error('Usuário não possui nenhuma disicplina cadastrada');
        }
    }

    removerDisciplina(idDisciplina: number){
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();

    if (usuario == null) {
      throw new Error('Usuário não encontrado');
    }

    if (usuario && usuario.disciplinas.length > 0) {
      let indexdisciplina = usuario.disciplinas.findIndex(
        (element) => element.id == idDisciplina
      );

      if (indexdisciplina !== -1) {
        usuario.disciplinas.splice(indexdisciplina, 1);

        return this.alterarFirestore(usuario).pipe(
          map(() =>{
            //console.log(usuario);
            this.localStorageService.atualizarUsuarioDTO(usuario);
            //console.log("Local Storage atualizado:", this.localStorageService.lerUsuarioDTO());
            return usuario;
          }),
          catchError(err => {
            console.error("Erro ao atualizar disciplinas no Firestore:", err);
            return throwError(() => new Error("Erro ao atualizar disciplinas"));
          })
        );
      } else {
        throw new Error('Disciplina não encontrada');
      }
    } else {
      throw new Error('Usuário não possui nenhuma disicplina cadastrada');
    }
  }

    listarDisciplinas(): Disciplina[] {
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();

      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
  
      if (usuario && usuario.disciplinas.length >= 0) {
        return usuario.disciplinas;
      } else {
        throw new Error('Usuário não possui nenhuma disicplina cadastrada');
      }
    }
    // crud tarefas

    listarTarefas(idDisciplina: string): Tarefa[] {
      if (idDisciplina.length <= 0) {
        throw new Error('Id da disciplina não pode ser vazio');
      }
  
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
  
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
  
      if (usuario.disciplinas.length > 0) {
        let disciplinaEncontrada = usuario.disciplinas.find(
          (element) => element.id == Number(idDisciplina)
        );
        //console.log(disciplinaEncontrada);
  
        if (disciplinaEncontrada) {
          if (disciplinaEncontrada.tarefas.length >= 0) {
            return disciplinaEncontrada.tarefas;
          } else {
            throw new Error('Disciplina não possui nenhuma tarefa cadastrada');
          }
        } else {
          throw new Error('Disciplina não encontrada');
        }
      } else {
        throw new Error('Usuário não possui nenhuma disciplina cadastrada');
      }
    }

    criarTarefa(tarefa: Tarefa, idDisciplina: string):Observable<any> {
      if (idDisciplina.length <= 0) {
        throw new Error('Id da disciplina não pode ser vazio');
      }
  
      if (tarefa.nome.length <= 0) {
        throw new Error('Nome da tarefa não pode ser vazio');
      }
  
      if (tarefa.descricao.length <= 0) {
        throw new Error('Descrição da tarefa não pode ser vazia');
      }
  
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
  
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
  
      //ok
  
      if (usuario.disciplinas.length > 0) {
        let disciplinaEncontrada = usuario.disciplinas.find(
          (element) => element.id == Number(idDisciplina)
        );
  
        //ok
  
        if (disciplinaEncontrada) {
          let tamanho: number = disciplinaEncontrada.tarefas.length;
          let id: number;
  
          if (tamanho > 0) {
            id = Number(disciplinaEncontrada.tarefas[tamanho - 1].id) + 1;
          } else {
            id = 1;
          }
  
          tarefa.id = id;
  
          disciplinaEncontrada.tarefas.push(tarefa);
          //(usuario);
          return this.alterarFirestore(usuario).pipe(
            map(() =>{
              //console.log(usuario);
              this.localStorageService.atualizarUsuarioDTO(usuario);
              //console.log("Local Storage atualizado:", this.localStorageService.lerUsuarioDTO());
              return usuario;
            }),
            catchError(err => {
              console.error("Erro ao atualizar tarefas no Firestore:", err);
              return throwError(() => new Error("Erro ao atualizar as tarefas"));
            })
          );
  
        } else {
          throw new Error('Disciplina não encontrada');
        }
      } else {
        throw new Error('Usuário não possui nenhuma disciplina cadastrada');
      }
    }

    alterarTarefa(tarefa: Tarefa, idDisciplina: string):Observable<any>{
      if (idDisciplina.length <= 0) {
        throw new Error('Id da disciplina não pode ser vazio');
      }
  
      if (tarefa.nome.length <= 0) {
        throw new Error('Nome da tarefa não pode ser vazio');
      }
  
      if (tarefa.descricao.length <= 0) {
        throw new Error('Descrição da tarefa não pode ser vazia');
      }
  
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
  
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
  
      //ok

      let indexDisciplina = usuario.disciplinas.findIndex(
        (element) => element.id == Number(idDisciplina)
      );

      if(indexDisciplina !== -1){
        let indexTarefa = usuario.disciplinas[indexDisciplina].tarefas.findIndex((element) => element.id == tarefa.id);
  
          if (indexTarefa !== -1) {
            usuario.disciplinas[indexDisciplina].tarefas[indexTarefa] = tarefa;
            this.localStorageService.atualizarUsuarioDTO(usuario);
            // Lucas, dava pra usar PATCH nessa situação?
            return this.alterarFirestore(usuario).pipe(
              map(() =>{
                //console.log(usuario);
                this.localStorageService.atualizarUsuarioDTO(usuario);
                //console.log("Local Storage atualizado:", this.localStorageService.lerUsuarioDTO());
                return usuario;
              }),
              catchError(err => {
                console.error("Erro ao atualizar tarefas no Firestore:", err);
                return throwError(() => new Error("Erro ao atualizar as tarefas"));
              })
            );
          } else {
            throw new Error('Tarefa não encontrada');
          }
        } else {
          throw new Error('Disciplina não encontrada');
        }
    }

    removerTarefa(idTarefa: number, idDisciplina: string):Observable<any>{
      if (idDisciplina.length <= 0) {
        throw new Error('Id da disciplina não pode ser vazio');
      }
  
      if (idTarefa <= 0) {
        throw new Error('Id da tarefa não pode ser vazio');
      }
  
      let usuario: UsuarioDTO | null = this.localStorageService.lerUsuarioDTO();
  
      if (usuario == null) {
        throw new Error('Usuário não encontrado');
      }
  
      let indexDisciplina = usuario.disciplinas.findIndex(
        (element) => element.id == Number(idDisciplina)
      );

      if (indexDisciplina !== -1) {
        let indexTarefa = usuario.disciplinas[indexDisciplina].tarefas.findIndex(
          (element) => element.id == idTarefa
        );

        if (indexTarefa !== -1) {
          // Remove a tarefa
          usuario.disciplinas[indexDisciplina].tarefas.splice(indexTarefa, 1);
          // console.log(usuario.disciplinas[indexDisciplina].tarefas);
          // console.log(usuario.disciplinas);
      
            //(usuario);
            return this.alterarFirestore(usuario).pipe(
              map(() =>{
                //console.log(usuario);
                this.localStorageService.atualizarUsuarioDTO(usuario);
                //console.log("Local Storage atualizado:", this.localStorageService.lerUsuarioDTO());
                return usuario;
              }),
              catchError(err => {
                console.error("Erro ao atualizar tarefas no Firestore:", err);
                return throwError(() => new Error("Erro ao atualizar as tarefas"));
              })
            );
  
            
          } else {
            throw new Error('Tarefa não encontrada');
          }
        } else {
          throw new Error('Disciplina não encontrada');
        }
      }


    }
  


