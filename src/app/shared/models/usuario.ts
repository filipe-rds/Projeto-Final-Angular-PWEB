import { Disciplina } from './disciplina';

export class Usuario {
  public id: string;
  public nome: string;
  public email: string;
  public senha: string;
  public disciplinas: Disciplina[];

  constructor(nome: string, email: string, senha: string) {
    this.id ="0";
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.disciplinas = [];
  }

}
