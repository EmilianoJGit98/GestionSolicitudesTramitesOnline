import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
// import { ARRsolicitudesAut } from '../../../data/data-solicitudes-aut';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { solicitudInterface } from '../../../models/SolicitudesAutObj.model';
import { SolicitudesTramitesOnlineService } from '../../../services/SolicitudesTramitesOnline.service';
import { CommonModule } from '@angular/common';
import { AuthTokenService } from '../../../services/auth-token.service';


@Component({
  selector: 'app-solicitudes-aut',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterModule, CommonModule],
  templateUrl: './solicitudes-aut.component.html',
  styleUrl: './solicitudes-aut.component.css'
})
export class SolicitudesAutComponent implements OnInit, AfterViewInit {
  isLoading = false;
  usuario_login: number = 0;
  loginData: any;

  SolcitudesTramitesAut: any[] = [];
  arraySolicitudes: any[] = [];
  id_rubro: number = 11112;
  id_contribuyente: number = 0;
  id_estado: number = 0;
  errorMessage: string | null = null;

  displayedColumns: string[] = [
    'id_tramite',
    'nombre_tramite',
    'nombre_contribuyente',
    'fecha_inicio_tramite',
    'estado',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>([]);
  private dataOriginal: solicitudInterface[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private SoliTramitesOnlineAut: SolicitudesTramitesOnlineService, private authTokenService: AuthTokenService) { }


  ngOnInit(): void {
    this.getSolicitudesAutomotores(this.id_rubro, this.id_contribuyente, this.id_estado);
    this.loginData = this.authTokenService.getDataLogin();
    this.usuario_login = this.loginData.username
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getSolicitudesAutomotores(idRubro: number, idContribuyente: number, idEstado: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.SoliTramitesOnlineAut.FilterSolicitudesXtramites(idRubro, idContribuyente, idEstado).subscribe({
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

  showSolicitados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'pendiente');
    this.resetPagination();
  }

  showEnProceso(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'en proceso' || r.estado?.toLowerCase() === 'en_proceso');
    this.resetPagination();
  }

  showPausados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'pausado' || r.estado?.toLowerCase() === 'en_pausa');
    this.resetPagination();

  }

  showTerminados(): void {
    this.dataSource.data = this.dataOriginal.filter(r => r.estado?.toLowerCase() === 'terminado' || r.estado?.toLowerCase() === 'terminada');
    this.resetPagination();
  }

  // Opcional: si tu estado tiene mayúsculas, convierte a lowercase para comparar
  private normalizeEstado(e: string | undefined): string {
    return (e ?? '').toLowerCase().trim();
  }

  private resetPagination(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  accionFila(id_solicitud: number, id_contribuyente: number, id_tramite_contribu: number, usuario_login: number, estado: string) {
    if (estado === 'PAUSADO') {
      this.router.navigateByUrl('/hub/solicitud-aut/' + id_solicitud + '/' + id_contribuyente);
    } else {
      this.SoliTramitesOnlineAut.cambiar_estado_tramite(id_tramite_contribu, usuario_login, 4).subscribe({
        next: (resp: any) => {
          const body = resp?.body ?? resp;
          const ok = !!body?.success || (body === true);
          if (ok) {
            this.router.navigateByUrl('/hub/solicitud-aut/' + id_solicitud + '/' + id_contribuyente);
          } else {

            const mensaje = body?.message ?? 'Cambio de estado no exitoso.';
            if (mensaje === 'El trámite ya está finalizado y no puede modificarse.') {
              this.router.navigateByUrl('/hub/solicitud-aut/' + id_solicitud + '/' + id_contribuyente);
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


}
