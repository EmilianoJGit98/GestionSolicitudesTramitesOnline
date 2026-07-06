import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthTokenService } from '../../services/auth-token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seleccion-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seleccion-area.component.html',
  styleUrl: './seleccion-area.component.css'
})
export class SeleccionAreaComponent {

  constructor(private router: Router, private tokenService: AuthTokenService) { }

  selectorModulo(modulo: string) {
    this.tokenService.saveModuloSeleccionado(modulo)
    if (modulo == "253") {
      this.router.navigateByUrl('hub/homeFactibilidad');
    }
    if (modulo == "129") {
      this.router.navigateByUrl('hub/homeHabilitaciones');
    }
    if (modulo == "204") {
      this.router.navigateByUrl('hub/homeAutomotores');
    }
  }

}
