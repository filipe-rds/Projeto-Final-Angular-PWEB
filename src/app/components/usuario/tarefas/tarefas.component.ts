import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Disciplina } from '../../../shared/models/disciplina';
import { Tarefa } from '../../../shared/models/tarefa';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MensagemSweetService } from '../../../shared/services/mensagem-sweet.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.scss'],
})
export class TarefasComponent implements OnInit {
  disciplinas: Disciplina[] = [];
  tarefas: Tarefa[] = [];
  disciplinaSelecionada!: Disciplina | null;

  constructor(
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private usuarioService: UsuarioService,
    public sweet: MensagemSweetService
  ) {}

  ngOnInit(): void {
    this.disciplinas = this.usuarioService.listarDisciplinas(); // Carrega as disciplinas do usuário
  }

  onDisciplinaSelecionada(disciplina: Disciplina): void {
    this.disciplinaSelecionada = disciplina;
    this.carregarTarefas(String(disciplina.id)); // Carrega as tarefas da disciplina selecionada
  }

  carregarTarefas(idDisciplina: string): void {
    try {
      this.tarefas = this.usuarioService.listarTarefas(idDisciplina); // Carrega as tarefas
    } catch (err) {
      this.sweet.erro('Erro ao carregar as tarefaa' );
    }
  }

  openDialog(modo: 'adicionar' | 'editar', tarefa?: Tarefa): void {
    if (!this.disciplinaSelecionada) {
      this.sweet.erro(
        'Selecione uma disciplina antes de adicionar ou editar tarefas.'
      );
      return;
    }

    const tarefaParaEditar = tarefa ? { ...tarefa } : new Tarefa('', '');
    const titulo = modo === 'adicionar' ? 'Adicionar Tarefa' : 'Editar Tarefa';

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        objeto: tarefaParaEditar,
        modo,
        titulo,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (modo === 'adicionar') {
          this.salvarTarefa(result);
        } else {
          this.editarTarefa(result);
        }
      }
    });
  }

  salvarTarefa(tarefa: Tarefa): void {
    if (!this.disciplinaSelecionada) return;

    try {
      const sucesso = this.usuarioService.criarTarefa(
        tarefa,
        String(this.disciplinaSelecionada.id)
      );
      if (sucesso) {
        this.carregarTarefas(String(this.disciplinaSelecionada.id)); // Atualiza a lista de tarefas
        this.sweet.sucesso('Tarefa criada com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao criar a tarefa' );
    }
  }

  editarTarefa(tarefa: Tarefa): void {
    if (!this.disciplinaSelecionada) return;

    try {
      const sucesso = this.usuarioService.alterarTarefa(tarefa,String(this.disciplinaSelecionada.id));
      if (sucesso) {
        this.carregarTarefas(String(this.disciplinaSelecionada.id)); // Atualiza a lista de tarefas
        this.sweet.sucesso('Tarefa atualizada com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao atualizar a tarefa' );
    }
  }

  removerTarefa(idTarefa: number): void {
    if (!this.disciplinaSelecionada) return;

    try {
      const sucesso = this.usuarioService.removerTarefa(
        idTarefa,
        String(this.disciplinaSelecionada.id)
      );
      if (sucesso) {
        this.carregarTarefas(String(this.disciplinaSelecionada.id)); // Atualiza a lista de tarefas
        this.sweet.sucesso('Tarefa removida com sucesso');
      }
    } catch (err) {
      this.sweet.erro('Erro ao remover a tarefa' );
    }
  }
}
