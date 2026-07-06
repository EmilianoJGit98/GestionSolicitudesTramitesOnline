import { Injectable } from '@angular/core';
// import { ActividadInterface } from '../models/actividades.model';
import { solicitudInterface } from '../models/SolicitudesAutObj.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';


@Injectable({
    providedIn: 'root'
})
export class SolicitudesTramitesOnlineService {
    /** Aca reemplazamos la ruta estatica por la variable de entorno, donde llama el archivo enviroment (desarrollo) o enviroment.
     *  prod (producción) lo llamas de la siguiente manera ${environment.base_url+'/restoDeLaURL'}
     * # environment: -> hace referencia a la constante que tenes en el archivo environment.ts
     * # url_base: hace referencia a la propiedad o clave del objeto que te mencione arriba (environment).
     *
     * NOTA: aca podes agregar mas claves que no queres que esten por todo el codigo o que vas a repetir varias veces y usar en
     * varios servicios, como ejemplo: otra api, default_language, app_version, auth_token_name.
    */
    private apiUrl = `${environment.base_url + '/tramites-online'}`;
    // private apiUrl = `/tramites-online/listar_tramites_online/`;



    constructor(private http: HttpClient) { }

    // Método para obtener actividades por ID
    // public FilterSolicitudesXtramites(idRubro: number, idContribuyente: number, idEstado: number): Observable<any> {
    //     // Convertimos el array de IDs a una cadena separada por comas

    //     return this.http.get<any>(`${this.apiUrl}?id_rubro=${idRubro}&id_contribuyente=${idContribuyente}&id_estado=${idEstado}`);
    // }

    public FilterSolicitudesXtramites(idRubro: number, idContribuyente: number, idEstado: number): Observable<any> {
        const formData = new FormData();
        formData.append('id_rubro', idRubro.toString());
        formData.append('id_contribuyente', idContribuyente.toString());
        formData.append('id_estado', idEstado.toString());

        return this.http.post<any>(this.apiUrl + '/listar_tramites_online/', formData);
    }

    public GetRequisitoDigitalizadoFac(id_tramite: number, id_rubro: number, id_contribuyente: number, partida: number, detalle: any): Observable<any> {
        const formData = new FormData();
        const safe = (v: any) => (v != null ? v.toString() : '');

        formData.append('id_tramite', safe(id_tramite));
        formData.append('id_rubro', safe(id_rubro));
        formData.append('id_contribuyente', safe(id_contribuyente));
        formData.append('partida', safe(partida));
        formData.append('detalle', safe(detalle));

        return this.http.post<any>(this.apiUrl + '/listar_requisitos_hab_comerciales/', formData);
    }

    public GetRequisitoDigitalizado(id_tramite: number, id_tipo_baja: any, id_rubro: number, id_contribuyente: number, id_pat: number): Observable<any> {
        const formData = new FormData();
        const safe = (v: any) => (v != null ? v.toString() : '');

        formData.append('id_tramite', safe(id_tramite));
        formData.append('id_tipo_baja', safe(id_tipo_baja));
        formData.append('id_rubro', safe(id_rubro));
        formData.append('id_contribuyente', safe(id_contribuyente));
        formData.append('id_pat', safe(id_pat));

        return this.http.post<any>(this.apiUrl + '/listar_documentos_digitalizados_tramites/', formData);
    }

    public PausarTramite(
        id_tramite_por_contribuyente: number,
        cod_usu: number,
        motivo_devolucion: string,
        // id_documento_digitalizado: string, // documentos digitalizados, cadena
        id_requisito: string // cadena, id de los requisitos "1,2,3"

    ): Observable<any> {
        const url = this.apiUrl + '/pausar_tramite/'; // ajusta si la ruta es distinta

        // Construimos body como url-encoded
        const body = new HttpParams()
            .set('id_tramite_por_contribuyente', id_tramite_por_contribuyente)
            .set('cod_usu', cod_usu)
            .set('motivo_devolucion', motivo_devolucion)
            .set('id_requisito', id_requisito);

        return this.http.post<any>(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }


    public EliminarRequisito(
        IdDocumentosDigitalizados: number
    ): Observable<any> {
        const url = this.apiUrl + '/eliminar_documento_digitalizado/'; // ajusta si la ruta es distinta
        const body = new HttpParams()
            .set('id_documento_digital', IdDocumentosDigitalizados)
        return this.http.post<any>(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }


    public cambiar_estado_tramite(
        id_tramite_por_contribuyente: number,
        cod_usu: number,
        id_estado: number
    ): Observable<any> {
        const url = this.apiUrl + '/editar_estado_tramite/'; // ajusta si la ruta es distinta

        // Construimos body como url-encoded
        const body = new HttpParams()
            .set('id_tramite_por_contribuyente', id_tramite_por_contribuyente)
            .set('cod_usu', cod_usu)
            .set('id_estado', id_estado);

        return this.http.post<any>(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }

    public asignar_expediente(
        id_solicitud: number,
        expediente: string,
    ): Observable<any> {
        const url = this.apiUrl + '/asignar_expediente_tramite_factibilidad/'; // ajusta si la ruta es distinta

        // Construimos body como url-encoded
        const body = new HttpParams()
            .set('id_solicitud_factibilidad', id_solicitud)
            .set('expediente', expediente)

        return this.http.post<any>(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }

    public asignar_grado_molestia(
        id_solicitud: number,
        id_grado_molestia: string,
    ): Observable<any> {
        const url = this.apiUrl + '/asignar_grado_molestia_tramite_factibilidad/'; // ajusta si la ruta es distinta

        // Construimos body como url-encoded
        const body = new HttpParams()
            .set('id_solicitud_factibilidad', id_solicitud)
            .set('id_grado_molestia', id_grado_molestia)

        return this.http.post<any>(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }


    public getDatosPartida(partida: number): Observable<any> {
        const formData = new FormData();
        formData.append('partida', partida.toString());
        // formData.append('id_contribuyente', idContribuyente.toString());
        // formData.append('id_estado', idEstado.toString());

        return this.http.post<any>(this.apiUrl + '/datos_partida/', formData);
    }
}


