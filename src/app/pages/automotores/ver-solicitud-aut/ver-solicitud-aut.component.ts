import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { SolicitudesTramitesOnlineService } from '../../../services/SolicitudesTramitesOnline.service';
import { map, Observable, pipe } from 'rxjs';
import { CommonModule, NgFor, NgIf, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Decodebase64Pipe } from '../../../pipes/decodebase64.pipe';
import { AuthTokenService } from '../../../services/auth-token.service';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-solicitud-aut',
  standalone: true,
  imports: [RouterModule,
    CommonModule,
    NgFor,
    NgIf,
    JsonPipe,
    Decodebase64Pipe, // standalone
    MatIconModule,
    MatMenuModule,
    MatButtonModule, FormsModule],
  templateUrl: './ver-solicitud-aut.component.html',
  styleUrl: './ver-solicitud-aut.component.css'
})
export class VerSolicitudAutComponent {
  idSolicitud: string | null = null;
  idContribuyente: string | null = null;
  usuario_login: number = 0;
  tramitesFiltrados: any[] = [];
  // tramitesFiltrados$?: Observable<any[]>;
  // dataSource: any[] = [];
  tramitesFiltradosGlobal: any[] = [];
  ContenedorFiltros: any[] = [];
  requisitosDigitalizados: any[] = [];
  loginData: any;
  isModalOpen = false;


  id_tramite_por_contribuyente: number = 0;
  cod_usu: number | null = null;
  motivo_devolucion: string = '';
  selectedReq?: any;

  id_requisito_digitalizado: number = 0;
  id_requisitos_seleccionados: string = '';
  // requisitosChecks: Array<{ idTramitesRequisitos: string, TramitesRequisitosDetalles: string, Digitalizado: 'SI' | 'NO' }> = [];

  // Cadena final con los IDs separados por comas
  checks_seleccionados: string = '';

  array_doc_digitalizados: string = '';
  array_id_requisitos: string = '';

  private _selectedIds: number[] = [];

  get selectedIds(): number[] {
    return this._selectedIds;
  }

  private _selectedChecks: { idDocumento: number; idTramitesRequisitos: number }[] = [];

  // checks_seleccionados: string = '';

  get selectedChecks(): { idDocumento: number; idTramitesRequisitos: number }[] {
    return this._selectedChecks;
  }

  private _updateChecksFromObjects(objs: { idDocumento: number; idTramitesRequisitos: number }[]) {
    this._selectedChecks = objs;
    this.checks_seleccionados = objs.map(o => `${o.idDocumento}:${o.idTramitesRequisitos}`).join(',');
  }

  private _selectedDocumentos: number[] = [];
  private _selectedTramites: number[] = [];
  checks_documentos_seleccionados: string = '';

  get selectedDocumentos(): number[] { return this._selectedDocumentos; }
  get selectedTramites(): number[] { return this._selectedTramites; }

  onCheckChange(event: any, idDocumento: number, idTramitesRequisitos: number) {
    const checked = event.target.checked;

    if (checked) {
      // Añadir si no existe
      if (!this._selectedDocumentos.includes(idDocumento)) {
        this._selectedDocumentos.push(idDocumento);
        this._selectedTramites.push(idTramitesRequisitos);
      }
    } else {
      // Eliminar del índice correspondiente
      const idx = this._selectedDocumentos.indexOf(idDocumento);
      if (idx > -1) {
        this._selectedDocumentos.splice(idx, 1);
        this._selectedTramites.splice(idx, 1);
      }
    }

    // Si necesitas un string para enviar
    this.checks_documentos_seleccionados = this._selectedDocumentos.join(',');
    this.array_id_requisitos = this._selectedTramites.join(',');
    // Y/o un string paralelo de trámites (opcional)
    const tramitesString = this._selectedTramites.join(',');
    // console.log('documentosdigitalizados:', this._selectedDocumentos);
    // console.log('idrequisitos:', this._selectedTramites);
    // console.log('Docs-Tramites (paralelo):', this._selectedDocumentos.map((d, i) => `${d}:${this._selectedTramites[i]}`).join(';'));

    console.log(this.checks_documentos_seleccionados)
    // console.log(this.array_id_requisitos)
    // Ejemplo de uso:
    // this.miFormulario.value.update({ documentos: this._selectedDocumentos, tramites: this._selectedTramites });
  }

  initializeFromExisting(objs: { idDocumento: number; idTramitesRequisitos: number }[]) {
    this._updateChecksFromObjects(objs);
  }


  constructor(private router: Router, private SoliTramitesOnlineAut: SolicitudesTramitesOnlineService, private route: ActivatedRoute, private authTokenService: AuthTokenService, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSolicitud = params.get('idSolicitud');
      this.idContribuyente = params.get('id_contribuyente');
      this.getSolicitudesAutomotores(11112, 0, 0, this.idSolicitud);
      this.loginData = this.authTokenService.getDataLogin();

      this.usuario_login = this.loginData.username
      // console.log(this.usuario_login)
    });

    this.authTokenService.getUsername();
  }

  openModalWithIndex(index: number): void {
    this.selectedReq = this.requisitosDigitalizados[index];
    // Abre el modal con Bootstrap (si usas Bootstrap JS)
    const modalEl = document.getElementById('ModalRequisito');
    if (modalEl) {
      // @ts-ignore
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  }

  getSolicitudesAutomotores(idRubro: number, idContribuyente: number, idEstado: number, idSolicitud: any): void {

    this.SoliTramitesOnlineAut.FilterSolicitudesXtramites(idRubro, idContribuyente, idEstado)
      .subscribe({
        next: (data: any) => {

          // console.log("Respuesta completa del backend:", data);

          let tramites: any[] = [];

          if (Array.isArray(data)) {
            tramites = data;
          } else if (Array.isArray(data?.tramites)) {
            tramites = data.tramites;
          } else if (Array.isArray(data?.data)) {
            tramites = data.data;
          }


          const idSolicitudFiltro = Number(idSolicitud);
          const tramitesFiltrados = tramites.filter(t => t.id_solicitud === idSolicitudFiltro);

          // Guardar filtrados en la variable disponible en todo el componente
          this.tramitesFiltradosGlobal = tramitesFiltrados;

          // console.log(this.tramitesFiltradosGlobal)

          this.id_tramite_por_contribuyente = tramitesFiltrados.length > 0
            ? Number(tramitesFiltrados[0].id_tramite_contribu ?? 0)
            : 0;

          this.ContenedorFiltros = tramitesFiltrados.map(t => ({
            id_tramite: t.id_tramite,
            id_tipo_baja: t.id_tipo_baja,
            id_rubro: t.id_rubro,
            id_contribuyente: t.id_contribuyente,
            id_pat: t.id_pat,
            estado: t.estado
          }));



          this.ObtenerRequisitosDigitalizados(this.ContenedorFiltros);

          // tramitesFiltrados.forEach(t => {
          // console.log("ID:", t.id_solicitud);
          // console.log("Trámite:", t.nombre_tramite);
          // console.log("Estado:", t.estado);
          // console.log("Fecha:", t.fecha_inicio_tramite);
          // console.log("Contribuyente:", t.nombre_contribuyente);
          // console.log("Patente:", t.objeto_tramite);
          // console.log("ID TIPO BAJA:", t.id_tipo_baja);
          // });

          // const AtributosFiltro = tramitesFiltrados.map(t => ({
          //   solicitud: t.id_solicitud,
          //   tramite: t.nombre_tramite,
          //   estado: t.estado,
          //   id_tipo_baja: t.id_tipo_baja
          // }));
        }
      });
  }

  ObtenerRequisitosDigitalizados(filtrosDigitalizadosGlobal: any): void {
    this.ContenedorFiltros = filtrosDigitalizadosGlobal;

    const paramsRequisitos = this.ContenedorFiltros.map(t => ({
      id_tramite: t.id_tramite,
      id_tipo_baja: t.id_tipo_baja != null ? t.id_tipo_baja : 0,
      id_rubro: t.id_rubro,
      id_contribuyente: t.id_contribuyente,
      id_pat: t.id_pat
    }));


    paramsRequisitos.forEach(p => {
      this.SoliTramitesOnlineAut.GetRequisitoDigitalizado(p.id_tramite, p.id_tipo_baja, p.id_rubro, p.id_contribuyente, p.id_pat).subscribe({
        next: (data: any) => {

          const tramites = Array.isArray(data?.tramites) ? data.tramites : [];
          this.MostrarRequisitosDigitalizdos(data)
          // this.dataSource.data = tramites;
          // this.isLoading = false;
        },
        error: (err) => {
          // console.error('Error al cargar datos', err);
          // this.errorMessage = 'Ocurrió un error al cargar los datos';
          // this.isLoading = false;
        }
      });
    });
  }

  MostrarRequisitosDigitalizdos(data: any) {
    // limpieza inicial
    if (data?.docs_digitalizados && Array.isArray(data.docs_digitalizados)) {
      this.requisitosDigitalizados = data.docs_digitalizados;

      console.log(this.requisitosDigitalizados)

      // Depuración: mostrar atributos de cada elemento
      this.requisitosDigitalizados.forEach((doc: any, index: number) => {
        // console.log(' - idTramitesRequisitos:', doc?.idTramitesRequisitos);
        // console.log(' - TramitesRequisitosDetalles:', doc?.TramitesRequisitosDetalles);
        // console.log(' - Digitalizado:', doc?.Digitalizado);
        // console.log(' - IdDocumentosDigitalizados:', doc?.IdDocumentosDigitalizados);
        // console.log(' - titulo:', doc?.titulo);
        // console.log(' - Descripcion:', doc?.Descripcion);
        // console.log(' - fechaCreacion:', doc?.fechaCreacion);
        // console.log(' - archivo:', doc?.archivo);
        // console.log(' - img:', doc?.img);
      });
    } else {
      // manejo defensivo si la estructura es diferente
      this.requisitosDigitalizados = [];
    }
  }

  irAlRequisito(idRequisito: number) {
    this.router.navigateByUrl('/hub/ver-requisito-aut/' + idRequisito);
  }

  // onSubmitFormPausar() {
  //   this.SoliTramitesOnlineAut.PausarTramite(
  //     this.id_tramite_por_contribuyente,
  //     this.usuario_login,
  //     this.motivo_devolucion,
  //     this.array_id_requisitos
  //   ).subscribe({
  //     next: (resp) => {
  //       console.log('Respuesta:', resp);
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Trámite pausado',
  //         text: 'El trámite se ha pausado correctamente.',
  //         confirmButtonText: 'OK'
  //       }).then(() => {
  //         this.checks_documentos_seleccionados
  //         this.limpiarFormularioYCerrarModal();
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Error al pausar trámite:', err);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al pausar',
  //         text: 'No se pudo pausar el trámite. Por favor, intenta nuevamente.',
  //         confirmButtonText: 'Cerrar'
  //       });
  //     }
  //   });
  // }

  // borrarRequisitoDigitalizado(IdDocumentosDigitalizados: number) {
  //   Swal.fire({
  //     title: '¿Seguro que quieres borrar la imagen?',
  //     text: 'Esta acción eliminará la imagen de forma permanente.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, borrar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.SoliTramitesOnlineAut.EliminarRequisito(
  //         IdDocumentosDigitalizados,
  //       ).subscribe({
  //         next: (resp) => {
  //           console.log('Respuesta:', resp);
  //           Swal.fire({
  //             icon: 'success',
  //             text: 'Imagen eliminada correctamente.',
  //             confirmButtonText: 'OK'
  //           });

  //         },
  //         error: (err) => {
  //           console.error('Error al eliminar imagen:', err);
  //           Swal.fire({
  //             icon: 'error',
  //             text: 'Error al borrar Imagen',
  //             confirmButtonText: 'Cerrar'
  //           });
  //         }
  //       });
  //     } else {

  //       Swal.fire({
  //         text: 'Acción cancelada por el usuario',
  //         confirmButtonText: 'Cerrar'
  //       });
  //     }
  //   });
  // }

  FinalizarSolicitud(id_solicitud: number, id_contribuyente: number, id_tramite_contribu: number, usuario_login: number) {
    Swal.fire({
      title: '¿Seguro que quieres finalizar la solicitud?',
      text: 'Esta acción dará por terminado al proceso de aprobación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.SoliTramitesOnlineAut.cambiar_estado_tramite(id_tramite_contribu, usuario_login, 3).subscribe({
          next: (resp: any) => {
            const body = resp?.body ?? resp;
            const ok = !!body?.success || (body === true);

            if (ok) {
              Swal.fire({
                icon: 'success',
                text: 'Tramite finalizado correctamente.',
                confirmButtonText: 'OK'
              });
              window.location.reload()
              // this.router.navigateByUrl('/hub/solicitud-aut/' + id_solicitud + '/' + id_contribuyente);
            } else {
              const mensaje = body?.message ?? 'Cambio de estado no exitoso.';
              console.warn(mensaje);
            }
          },
          error: (err) => {
            console.error('Error al cambiar estado:', err);
          }
        });
      } else {

        Swal.fire({
          text: 'Acción cancelada por el usuario',
          confirmButtonText: 'Cerrar'
        });
      }
    });

  }

  private limpiarFormularioYCerrarModal(): void {
    // 1) Limpiar campos del formulario con id="formTramite"
    const form = document.getElementById('formTramite') as HTMLFormElement | null;
    if (form) {
      // Si usas Angular forms, podrías inyectar y usar FormGroup para resetear
      // form.reset(); // vs form.resetForm() si usas Template-driven
      form.reset();
    }


    const modal = document.getElementById('modalTramite');
    if (modal) {


      // @ts-ignore
      const modalInstance = bootstrap?.Modal?.getInstance?.(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // fallback simple
        modal.style.display = 'none';
      }
    }

    window.location.reload()
  }

  verRequisitoVentana(basecode: string) {
    this.router.navigate(['hub/requisitoVentana', basecode]);
  }

  onSubmitFormPausar() {
    this.SoliTramitesOnlineAut.PausarTramite(
      this.id_tramite_por_contribuyente,
      this.usuario_login,
      this.motivo_devolucion,
      this.array_id_requisitos
    ).subscribe({
      next: (resp) => {
        console.log('Respuesta:', resp);
        Swal.fire({
          icon: 'success',
          title: 'Trámite pausado',
          text: 'El trámite se ha pausado correctamente.',
          confirmButtonText: 'OK'
        }).then(async () => {
          // 1)Parsear IDs (cadena "27909,28033,27908")
          const idsStr = this.checks_documentos_seleccionados || '';
          const ids: number[] = idsStr
            .split(',')
            .map(s => Number(s))
            .filter(n => !isNaN(n));

          // 2) Borrar secuencialmente (sin confirmación)
          for (const id of ids) {
            try {
              await this.borrarRequisitoDigitalizado(id);
            } catch (e) {
              console.error('Error borrando documento', id, e);
              // Para seguir con los demás, simplemente continúas
            }
          }

          // 3) Al finalizar, señalamos que ya se eliminaron todas las imágenes
          if (ids.length > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Imágenes eliminadas',
              text: 'Se eliminaron todas las imágenes asociadas.',
              confirmButtonText: 'OK'
            });

            this.limpiarFormularioYCerrarModal();
          }

          // 4) Limpias la lista de IDs si corresponde
          this.checks_documentos_seleccionados = '';
          // Opcional: resetea otros estados de UI si los tienes
        });
      },
      error: (err) => {
        console.error('Error al pausar trámite:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al pausar',
          text: 'No se pudo pausar el trámite. Por favor, intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  borrarRequisitoDigitalizado(IdDocumentosDigitalizados: number): Promise<void> {
    // No hay confirmación: elimina directamente
    return new Promise((resolve, reject) => {
      this.SoliTramitesOnlineAut.EliminarRequisito(
        IdDocumentosDigitalizados,
      ).subscribe({
        next: (resp) => {
          console.log('Imagen eliminada:', IdDocumentosDigitalizados, resp);
          // Notificar eliminación exitosa
          // Opcional: mostrar un popup por cada eliminación (descomenta si quieres)
          // Swal.fire({ icon: 'success', text: 'Imagen eliminada correctamente.', timer: 1500, showConfirmButton: false });

          resolve();
        },
        error: (err) => {
          console.error('Error al eliminar imagen:', IdDocumentosDigitalizados, err);
          // Rechazar para poder manejar en el bucle
          Swal.fire({
            icon: 'error',
            text: 'Error al borrar Imagen',
            confirmButtonText: 'Cerrar'
          });
          reject(err);
        }
      });
    });
  }

}
