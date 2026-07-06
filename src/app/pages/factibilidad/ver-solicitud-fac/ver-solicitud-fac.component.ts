import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitudesTramitesOnlineService } from '../../../services/SolicitudesTramitesOnline.service';
import { AuthTokenService } from '../../../services/auth-token.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Decodebase64Pipe } from '../../../pipes/decodebase64.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-solicitud-fac',
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
  templateUrl: './ver-solicitud-fac.component.html',
  styleUrl: './ver-solicitud-fac.component.css'
})
export class VerSolicitudFacComponent {
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


  datosPartida: any[] = [];
  partida: number = 0;
  id_requisito_digitalizado: number = 0;
  id_requisitos_seleccionados: string = '';
  // requisitosChecks: Array<{ idTramitesRequisitos: string, TramitesRequisitosDetalles: string, Digitalizado: 'SI' | 'NO' }> = [];

  // Cadena final con los IDs separados por comas
  checks_seleccionados: string = '';

  array_doc_digitalizados: string = '';
  array_id_requisitos: string = '';

  nExpediente: string = '';

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

    // console.log(checked)
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
  }

  initializeFromExisting(objs: { idDocumento: number; idTramitesRequisitos: number }[]) {
    this._updateChecksFromObjects(objs);
  }


  constructor(private router: Router, private SoliTramitesOnlineAut: SolicitudesTramitesOnlineService, private route: ActivatedRoute, private authTokenService: AuthTokenService, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSolicitud = params.get('idSolicitud');
      this.idContribuyente = params.get('id_contribuyente');
      this.getSolicitudesFactibilidad(0, 0, 0, this.idSolicitud);
      this.loginData = this.authTokenService.getDataLogin();

      this.usuario_login = this.loginData.username
      // console.log(this.usuario_login)
    });

    this.authTokenService.getUsername();
  }

  getSolicitudesFactibilidad(idRubro: number, idContribuyente: number, idEstado: number, idSolicitud: any): void {

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

          // console.log(tramitesFiltrados);

          this.tramitesFiltradosGlobal = tramitesFiltrados;

          console.log(this.tramitesFiltradosGlobal)

          this.id_tramite_por_contribuyente = tramitesFiltrados.length > 0
            ? Number(tramitesFiltrados[0].id_tramite_contribu ?? 0)
            : 0;

          this.ContenedorFiltros = tramitesFiltrados.map(t => ({
            partida_c: t.objeto_tramite,
          }));


          tramitesFiltrados.forEach(tf => {


            // console.log(tf.id_rubro);
            // console.log(tf.id_contribuyente);
            // console.log(tf.objeto_tramite);
          });

          const partidaCValue = this.ContenedorFiltros.length > 0 ? this.ContenedorFiltros[0].partida_c : null;

          // console.log(this.ContenedorFiltros);

          this.ObtenerRequisitosDigitalizados(this.tramitesFiltradosGlobal);
          this.ObtenerDatosPartida(partidaCValue);


          // tramitesFiltrados.forEach(t => {
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
      objeto_tramite: t.objeto_tramite,
      nro_dni_sw: t.nro_dni_sw,
      id_actividad: t.id_actividad
    }));

    // console.log(this.ContenedorFiltros)

    paramsRequisitos.forEach(p => {
      // console.log(p.objeto_tramite);
      // console.log(p.nro_dni_sw);
      // console.log(p.id_actividad);
      let dniContribu = p.nro_dni_sw;
      let ultimosTresStr = String(dniContribu).slice(-3);
      let detalleComercio = p.objeto_tramite + "/" + ultimosTresStr + "-" + p.id_actividad

      // console.log(detalleComercio)


      this.SoliTramitesOnlineAut.GetRequisitoDigitalizadoFac(p.id_tramite, p.id_rubro, p.id_contribuyente, p.objeto_tramite, detalleComercio).subscribe({
        next: (data: any) => {
          // console.log(data)
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

  ObtenerDatosPartida(partida: any): void {
    this.partida = partida;


    this.SoliTramitesOnlineAut.getDatosPartida(this.partida).subscribe({
      next: (response) => {
        // Si la API devuelve { success: true, data: [...] }
        this.datosPartida = response?.data ?? [];

        // console.log(this.datosPartida)
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.datosPartida = [];
      }
    });
  }


  MostrarRequisitosDigitalizdos(data: any) {
    // limpieza inicial
    if (data?.requisitos && Array.isArray(data.requisitos)) {
      this.requisitosDigitalizados = data.requisitos;

      // console.log(this.requisitosDigitalizados)
    } else {
      // manejo defensivo si la estructura es diferente
      this.requisitosDigitalizados = [];
    }
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

  onSubmitFormPausar() {
    this.SoliTramitesOnlineAut.PausarTramite(
      this.id_tramite_por_contribuyente,
      this.usuario_login,
      this.motivo_devolucion,
      this.array_id_requisitos
    ).subscribe({
      next: (resp) => {
        // console.log('Respuesta:', resp);
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

  onSubmitFormExpediente(t: any) {
    const id_solicitud = t.id_solicitud;
    const cod_usu = this.usuario_login;
    const expediente = t.expediente;
    const formExpediente = document.getElementById('formTramiteExpediente') as HTMLFormElement;


    this.SoliTramitesOnlineAut.asignar_expediente(
      id_solicitud,
      expediente
    ).subscribe({
      next: (resp) => {
        // console.log('Respuesta:', resp);
        Swal.fire({
          icon: 'success',
          // title: 'Correcto',
          text: 'Expediente asignado correctamente.',
          confirmButtonText: 'OK'
        }).then(async () => {

          window.location.reload()

          // formExpediente.reset();
          // const modalExpediente = document.getElementById('modalExpediente');
          // if (modalExpediente) {


          // @ts-ignore
          // const modalInstance = bootstrap?.Modal?.getInstance?.(modal);
          // if (modalInstance) {
          //   modalInstance.hide();
          // } else {
          // fallback simple
          // modalExpediente.style.display = 'none';
          // }
          // }


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
    // console.log(id_solicitud + ' ' + expediente)

    // asignar_expediente

    // if (!expediente || !expediente.trim()) {
    // valida y corta
    // return;
    // }

    // aquí llamas a PausarTramite incluyendo expediente en el lugar correcto
  }

  onSubmitFormGradoMolestia(t: any) {
    const id_solicitud = t.id_solicitud;
    const cod_usu = this.usuario_login;
    const id_grado_molestia = t.id_grado_molestia;
    this.SoliTramitesOnlineAut.asignar_grado_molestia(
      id_solicitud,
      id_grado_molestia
    ).subscribe({
      next: (resp) => {
        // console.log('Respuesta:', resp);
        Swal.fire({
          icon: 'success',
          // title: 'Correcto',
          text: 'Grado de molestia asignado correctamente.',
          confirmButtonText: 'OK'
        }).then(async () => {

          window.location.reload()
        });
      },
      error: (err) => {
        console.error('Error al asignar grado de molestia al trámite:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al asignar grado de molestia al trámite:',
          text: 'Por favor, intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
    // console.log(id_solicitud + ' ' + expediente)

    // asignar_expediente

    // if (!expediente || !expediente.trim()) {
    // valida y corta
    // return;
    // }

    // aquí llamas a PausarTramite incluyendo expediente en el lugar correcto
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
}
