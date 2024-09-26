import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../shared/models/usuario';
import { Disciplina } from '../../../shared/models/disciplina';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.scss'],
})
export class DisciplinasComponent implements OnInit {
  usuario!: Usuario | null;
  disciplinas: Disciplina[] = [];

  constructor(
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private usuarioService: UsuarioService,
    public sweet: MensagemSweetService
  ) {}

  ngOnInit(): void {
    this.usuario = this.localStorageService.lerUsuario();
    if (this.usuario) {
      try {
        this.disciplinas = this.usuarioService.listarDisciplinas(); // Carrega as disciplinas do usuário
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
    this.usuarioService.criarDisciplina(disciplina).subscribe({
      next: (usuarioAtualizado) => {
        this.disciplinas = usuarioAtualizado.disciplinas;
        this.sweet.sucesso('Disciplina criada com sucesso');
      },
      error: (err) =>
        this.sweet.erro('Erro ao criar a disciplina'),
    });
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
      const sucesso = this.usuarioService.removerDisciplina(id);
      if (sucesso) {
        this.disciplinas = this.usuarioService.listarDisciplinas();
        this.sweet.sucesso('Disciplina removida com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao remover a disciplina');
    }
  }
}
