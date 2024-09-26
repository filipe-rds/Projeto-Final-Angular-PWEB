import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaUsuarioComponent } from './tela-usuario.component';

describe('TelaUsuarioComponent', () => {
  let component: TelaUsuarioComponent;
  let fixture: ComponentFixture<TelaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
