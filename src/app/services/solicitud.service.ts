import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = 'URL_DEL_BACKEND'; // Aquí debes poner la URL de tu backend

  constructor(private http: HttpClient) { }

  enviarId(id: number) {
      return this.http.post(`/ver-solicitud`, { id });
      //return this.http.post(`${this.apiUrl}/ver-solicitud`, { id });
  }
}