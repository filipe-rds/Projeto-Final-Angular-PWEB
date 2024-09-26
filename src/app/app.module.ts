import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/autenticacao/login/login.component';
import { CadastroComponent } from './components/autenticacao/cadastro/cadastro.component';
import { TelaInicialComponent } from './components/autenticacao/tela-inicial/tela-inicial.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './modules/material/material.module';
import { TelaUsuarioComponent } from './components/usuario/tela-usuario/tela-usuario.component';
import { DadosComponent } from './components/usuario/dados/dados.component';
import { DisciplinasComponent } from './components/usuario/disciplinas/disciplinas.component';
import { TarefasComponent } from './components/usuario/tarefas/tarefas.component';
import { ProgressoComponent } from './components/usuario/progresso/progresso.component';
import { ModalComponent } from './components/usuario/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    TelaInicialComponent,
    TelaUsuarioComponent,
    DadosComponent,
    DisciplinasComponent,
    TarefasComponent,
    ProgressoComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
