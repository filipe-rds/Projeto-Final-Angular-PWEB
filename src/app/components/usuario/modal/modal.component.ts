import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { objeto: any, modo: 'adicionar' | 'editar', titulo: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    this.dialogRef.close(this.data.objeto);
  }
}
