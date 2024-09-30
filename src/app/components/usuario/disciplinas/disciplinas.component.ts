import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../shared/models/usuario';
import { Disciplina } from '../../../shared/models/disciplina';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';
import { ModalComponent } from '../modal/modal.component';
import { UsuarioFirestoreService } from '../../../shared/services/usuario-firestore.service';
import { UsuarioDTO } from '../../../shared/models/usuarioDTO';

@Component({
  selector: 'disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.scss'],
})
export class DisciplinasComponent implements OnInit {
  usuario!: UsuarioDTO | null;
  disciplinas: Disciplina[] = [];

  constructor(
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private usuarioService: UsuarioService,
    public sweet: MensagemSweetService,
    private fireService:UsuarioFirestoreService
  ) {}

  ngOnInit(): void {
    this.usuario = this.localStorageService.lerUsuarioDTO();
    if (this.usuario) {
      try {
        this.atualizar();
        this.disciplinas = this.fireService.listarDisciplinas(); // Carrega as disciplinas do usuário
      } catch (err) {
        this.sweet.erro('Erro ao carregar disciplinas: ');
      }
    }
  }

  openDialog(modo: 'adicionar' | 'editar', disciplina?: Disciplina): void {
    const disciplinaParaEditar = disciplina
      ? { ...disciplina }
      : new Disciplina('', '');
    const titulo =
      modo === 'adicionar' ? 'Adicionar Disciplina' : 'Editar Disciplina';

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        objeto: disciplinaParaEditar, // Objeto disciplina sendo passado
        modo,
        titulo,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (modo === 'adicionar') {
          this.salvarDisciplina(result);
        } else {
          this.editarDisciplina(result);
        }
      }
    });
  }

  salvarDisciplina(disciplina: Disciplina): void {
    // Verifique se os campos obrigatórios estão preenchidos
    if (!disciplina.nome || !disciplina.descricao) {
      this.sweet.erro('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    disciplina.tarefas =[];
    this.fireService.criarDisciplina(disciplina).subscribe({
      next: (usuarioAtualizado: UsuarioDTO) => {
        this.disciplinas = usuarioAtualizado.disciplinas;
        this.sweet.sucesso('Disciplina criada com sucesso');
      },
      error: (err) =>{
        console.log(err);
        this.sweet.erro('Erro ao criar a disciplina: '+err.message)
      }
    });
  }

  //metodo onde era para atualizar o localStorage com o firestore
  atualizar(){
    this.fireService.atualizar();
  }

  editarDisciplina(disciplina: Disciplina): void {
    if (!disciplina.nome || !disciplina.descricao) {
      this.sweet.erro('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const sucesso = this.usuarioService.alterarDisciplina(disciplina);
      if (sucesso) {
        this.disciplinas = this.usuarioService.listarDisciplinas();
        this.sweet.sucesso('Disciplina atualizada com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao atualizar a disciplina');
    }
  }

  removerDisciplina(id: number): void {
    try {
      const sucesso = this.fireService.removerDisciplina(id);
      if (sucesso) {
        this.atualizar();
        this.disciplinas = this.fireService.listarDisciplinas();
        this.sweet.sucesso('Disciplina removida com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao remover a disciplina');
    }
  }
}
