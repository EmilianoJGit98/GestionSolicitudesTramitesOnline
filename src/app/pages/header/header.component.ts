import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthTokenService } from '../../services/auth-token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  Token: any = '';
  public modulo253: string | null = null;
  public modulo129: string | null = null;
  public modulo204: string | null = null;

  constructor(private tokenService: AuthTokenService, private router: Router) {}

  ngOnInit() {
    this.validaToken();
    this.getModulos();
  }

  cerrarSesion() {
    this.tokenService.logout();
    this.router.navigateByUrl('login');
  }

  validaToken() {
    this.Token = this.tokenService.getAccessToken();
    if (this.Token == null) {
      this.router.navigateByUrl('login');
    } else {
    }
  }

  getModulos() {
    const modulosString = this.tokenService.getModulos();
    if (modulosString) {
      const modulos = JSON.parse(modulosString); // array de cadenas
      const idsBuscados = ['253', '129', '204'];

      // Buscar y asignar las variables si existen
      this.modulo253 = modulos.find((id: string) => id === '253') || null;
      this.modulo129 = modulos.find((id: string) => id === '129') || null;
      this.modulo204 = modulos.find((id: string) => id === '204') || null;

      // Aquí puedes hacer más con las variables si lo deseas
    } else {
      console.log('No hay módulos almacenados');
    }
  }
}
