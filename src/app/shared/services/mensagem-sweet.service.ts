import {Injectable} from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class MensagemSweetService {

    constructor() {
    }

    info(mensagem: string) {
        Swal.fire({
            title: 'Atenção!',
            text: mensagem,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }

    erro(mensagem: string) {
        Swal.fire({
            title: 'Erro!',
            text: mensagem,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    sucesso(mensagem: string) {
        Swal.fire({
          title: 'Sucesso!',
          text: mensagem,
          icon: 'success',
          confirmButtonText: 'OK'
        });
    }
}
