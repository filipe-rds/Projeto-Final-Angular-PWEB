import { Usuario } from "./usuario";
import { Tarefa } from "./tarefa";

export class Disciplina {
  public id: number;
  public nome: string;
  public descricao: string;
  public tarefas: Tarefa[] = [];

  constructor(nome: string, descricao: string) {
    this.id = 0;
    this.nome = nome;
    this.descricao = descricao;
  }

}
