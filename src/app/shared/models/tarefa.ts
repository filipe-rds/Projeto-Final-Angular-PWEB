import { Disciplina } from "./disciplina";

export class Tarefa {
  public id: number;
  public disciplina!: Disciplina;
  public nome: string;
  public descricao: string;

  constructor(nome: string, descricao: string) {
    this.id = 0;
    this.nome = nome;
    this.descricao = descricao;
  }
}
