export interface solicitudInterface {
    id_tramite: number;
    nombre_tramite: string;
    id_rubro: number;
    id_solicitud: number;
    id_contribuyente: number;
    nombre_contribuyente: string;
    nro_dni_sw: number;
    telefono?: string;
    mail?: string;
    objeto_tramite?: string;
    fecha_inicio_tramite: string; // ISO date
    fecha_fin_tramite?: string | null;
    observacion_tramite?: string;
    id_tramite_contribu?: number;
    estado?: string;
    activo?: number;
    id_pat?: number;
    id_tipo_baja?: any;
    anulado?: number;
    partida?: any;
    nro_dni_sc?: any;
    id_complejidad?: any;
    nombre_fantasia?: string | null;
    tipo_comercio?: string | null;
    razon_social?: string | null;
    comercio_descripcion?: string | null;
    actividad_descripcion?: string | null;
}

// export interface ItemAut {
//     id: number;
//     Tramite: string;
//     n_solicitud: string;
//     fecha_inicio: string;
//     estado: string;
//     objeto: string;
//     contribuyente: string;
//     dni: string;
// }