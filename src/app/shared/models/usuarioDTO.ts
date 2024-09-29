import {Disciplina} from './disciplina'; 

export class UsuarioDTO {
    public idField?: string;
    public id: string;
    public disciplinas: Disciplina[];
  
    constructor(id: string,disciplinas: Disciplina[]) {
      this.id = id;
      this.disciplinas = disciplinas;
    }
  }
  