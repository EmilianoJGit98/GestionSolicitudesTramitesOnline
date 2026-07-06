import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthTokenService } from '../../services/auth-token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    username: '',
    password: '',
    client_secret: '',
  };

  // codigos
  //gestionsolicitudesfactibilidad 253 0?
  //GestionHabilitacionesComerciales 129 11107
  //solicitudes tramites automotores 204 11112
  public modulo253: string | null = null;
  public modulo129: string | null = null;
  public modulo204: string | null = null;
  LoginData: any[] = [];
  private _username: string | null = null;
  private readonly STORAGE_KEY = 'app_username';

  constructor(private router: Router, private tokenService: AuthTokenService) {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this._username = saved;
  }

  ngOnInit() {
    this.tokenService.logout();
  }

  setUsuario(username: string): void {
    this._username = username;
    localStorage.setItem(this.STORAGE_KEY, username); // opcional
  }

  getUsuario(): string | null {
    return this._username;
  }

  clear(): void {
    this._username = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }


  onLogin() {
    this.tokenService
      .login(this.loginObj.username, this.loginObj.password)
      .subscribe(
        (res: any) => {
          if (res?.access_token) {
            // console.log(res.info_user.Modulos);
            this.onLoginResponse(res, this.loginObj.username);

            // Extraemos los módulos
            const modulos = res.info_user.Modulos;

            const cumplidas: string[] = [];

            if (modulos.includes("253")) {
              cumplidas.push('homeFactibilidad');
            }
            if (modulos.includes("129")) {
              cumplidas.push('homeHabilitaciones');
            }
            if (modulos.includes("204")) {
              cumplidas.push('homeAutomotores');
            }

            if (cumplidas.length >= 2) {
              this.router.navigateByUrl(`Perfiles`);
            } else if (cumplidas.length === 1) {
              this.router.navigateByUrl(`hub/${cumplidas[0]}`);
            }

            // if (modulos.includes("253")) {
            //   this.router.navigateByUrl('hub/homeFactibilidad');
            // } else if (modulos.includes("129")) {
            //   this.router.navigateByUrl('hub/homeHabilitaciones');
            // } else if (modulos.includes("204")) {
            // this.router.navigateByUrl('hub/homeAutomotores');
            // }


            Swal.fire({
              icon: 'success',
              title: '',
              text: 'Bienvenido.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              showCloseButton: true,
            });
          }
        },
        (error) => {
          if (error) {
            const excepcionLogin: any = {
              'USUARIO DE BAJA':
                'El usuario está deshabilitado, comuniquese con el administrador', // [400]
              'Token Expirado.':
                'La sesión caducó, por favor vuelva a iniciar sesión.', // [401]
              'CLAVE INCORRECTA': 'Clave Incorrecta.', // [400]
              'USUARIO INEXISTENTE':
                'No se encontró el usuario ingresado, intente con otro.', // [404]
              'NO TIENE ACCESO AL MODULO':
                'El usuario no cuenta con los permisos necesarios.', // [405]
              'USUARIO BLOQUEADO POR INTENTOS INCORRECTOS':
                'El usuario se bloqueó debido a que supero la cantidad de intentos fallidos.', // [423]
              'CLAVE VENCIDA':
                'La contraseña se encuentra expirada, comuniquese con el administrador.', // [426]
            };

            // Mostrar el mensaje de error correspondiente
            const errorMessage =
              excepcionLogin[error.detail] ||
              error.detail ||
              'Ocurrió un error inesperado.';

            Swal.fire({
              icon: 'error',
              title: '',
              text: errorMessage,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timerProgressBar: true,
              showCloseButton: true,
            });
          }
        }
      );
  }

  private onLoginResponse(tokenData: any, username: string): void {
    // console.log(tokenData);
    // console.log(tokenData.info_user.Modulos);
    console.log(username);
    this.tokenService.saveDataLogin(tokenData);
    this.tokenService.saveToken(tokenData.access_token); // Asegúrate de que esto coincide con la respuesta real
    this.tokenService.saveUsername(username); // Almacena el nombre de usuario
    this.tokenService.saveTokenType(tokenData.token_type); // Almacena el nombre de usuario
    this.tokenService.saveModulos(tokenData.info_user.Modulos); // Almacena el nombre de usuario

  }
}
