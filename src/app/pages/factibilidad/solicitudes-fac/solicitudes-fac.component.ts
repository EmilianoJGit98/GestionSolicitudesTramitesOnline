import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { ARRsolicitudesFac } from '../../../data/data-solicitudes-fac';
import { Component, ViewChild } from '@angular/core';
import { ItemFac } from '../../../models/SolicitudesFacObj.model';
import { SolicitudesTramitesOnlineService } from '../../../services/SolicitudesTramitesOnline.service';
import { solicitudInterface } from '../../../models/SolicitudesAutObj.model';
import { CommonModule } from '@angular/common';
import { AuthTokenService } from '../../../services/auth-token.service';

@Component({
  selector: 'app-solicitudes-fac',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterModule, CommonModule],
  templateUrl: './solicitudes-fac.component.html',
  styleUrl: './solicitudes-fac.component.css'
})
export class SolicitudesFacComponent {
  isLoading = false;
  usuario_login: number = 0;
  loginData: any;

  SolcitudesTramitesFac: any[] = [];
  arraySolicitudes: any[] = [];
  id_rubro: number = 0;
  id_contribuyente: number = 0;
  id_estado: number = 0;
  errorMessage: string | null = null;

  // displayedColumns: string[] = [
  //   '#',
  //   'Tramite',
  //   'n_solicitud',
  //   'fecha_inicio',
  //   'estado',
  //   'objeto',
  //   'contribuyente',
  //   'dni',
  //   'acciones',
  // ];


  displayedColumns: string[] = [
    'id_tramite',
    'solicitante',
    'fecha',
    'actividad',
    'estado',
    'acciones',
  ];


  dataSource = new MatTableDataSource<any>([]);
  private dataOriginal: solicitudInterface[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // dataSource = new MatTableDataSource<ItemFac>([]);

  constructor(private router: Router, private SoliTramitesOnlineFac: SolicitudesTramitesOnlineService, private authTokenService: AuthTokenService) { }


  ngOnInit(): void {
    // this.dataSource.data = ARRsolicitudesFac;
    this.getSolicitudesFactibilidad(this.id_rubro, this.id_contribuyente, this.id_estado);
    this.loginData = this.authTokenService.getDataLogin();
    this.usuario_login = this.loginData.username
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getSolicitudesFactibilidad(idRubro: number, idContribuyente: number, idEstado: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.SoliTramitesOnlineFac.FilterSolicitudesXtramites(idRubro, idContribuyente, idEstado).subscribe({
      next: (data: any) => {
        const tramites = Array.isArray(data?.tramites) ? data.tramites : [];
        // Guardar original y mostrar
        this.dataOriginal = tramites;
        this.dataSource.data = [...tramites];
        this.isLoading = false;
        // Asegura el paginador si está inicializado
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        console.log(this.dataSource.data);
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.errorMessage = 'Ocurrió un error al cargar los datos';
        this.isLoading = false;
      }
    });
  }

  showTodos(): void {
    this.dataSource.data = this.dataOriginal;
    this.resetPagination();
  }

  showPendientes(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'solicitado' || r.estado?.toLowerCase() === 'pendiente');
    this.resetPagination();
  }

  showPausados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'pausado' || r.estado?.toLowerCase() === 'en_pausa');
    this.resetPagination();
  }

  showEnProceso(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'en proceso' || r.estado?.toLowerCase() === 'en_proceso');
    this.resetPagination();
  }



  showFinalizados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'aprobado' || r.estado?.toLowerCase() === 'APROBADOS' || r.estado?.toLowerCase() === 'terminado');
    this.resetPagination();
  }


  showRechazados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'rechazado' || r.estado?.toLowerCase() === 'rechazados');
    this.resetPagination();
  }

  private resetPagination(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }


  accionFila(id_solicitud: number, id_contribuyente: number, id_tramite_contribu: number, usuario_login: number, estado: string) {
    if (estado === 'PAUSADO') {
      this.router.navigateByUrl('/hub/solicitud-fac/' + id_solicitud + '/' + id_contribuyente);
    } else {
      this.SoliTramitesOnlineFac.cambiar_estado_tramite(id_tramite_contribu, usuario_login, 4).subscribe({
        next: (resp: any) => {
          const body = resp?.body ?? resp;
          const ok = !!body?.success || (body === true);
          if (ok) {
            this.router.navigateByUrl('/hub/solicitud-fac/' + id_solicitud + '/' + id_contribuyente);
          } else {

            const mensaje = body?.message ?? 'Cambio de estado no exitoso.';
            if (mensaje === 'El trámite ya está finalizado y no puede modificarse.') {
              this.router.navigateByUrl('/hub/solicitud-fac/' + id_solicitud + '/' + id_contribuyente);
            } else {
              console.warn(mensaje);
            }
          }
        },
        error: (err) => {
          console.error('Error al cambiar estado:', err);
        }
      });
    }
  }


  // accionFila(id_solicitud: number, id_contribuyente: number) {
  //   // this.router.navigate(['/hub/homeHabilitaciones/solicitud-hc/', element.id]);
  //   // this.router.navigateByUrl('/hub/solicitud-fac/' + element.id);
  //   this.router.navigateByUrl('/hub/solicitud-fac/' + id_solicitud + '/' + id_contribuyente);
  // }

}
