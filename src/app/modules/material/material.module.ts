import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    SweetAlert2Module,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:
    [
      CommonModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatMenuModule,
      SweetAlert2Module,
      HttpClientModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
    ]
})
export class MaterialModule { }
