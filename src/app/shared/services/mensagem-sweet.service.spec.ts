import { TestBed } from '@angular/core/testing';

import { MensagemSweetService } from './mensagem-sweet.service';

describe('MensagemSweetService', () => {
  let service: MensagemSweetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensagemSweetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
