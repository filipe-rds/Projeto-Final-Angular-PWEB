import { TestBed } from '@angular/core/testing';

import { UsuarioFirestoreService } from './usuario-firestore.service';

describe('UsuarioFirestoreService', () => {
  let service: UsuarioFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
