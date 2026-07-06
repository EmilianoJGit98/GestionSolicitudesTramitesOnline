import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HubPagesComponent } from './pages/hub-pages/hub-pages.component';
import { HomeComponent } from './pages/home/home.component';
import { SolicitudesFacComponent } from './pages/factibilidad/solicitudes-fac/solicitudes-fac.component';
import { SolicitudesHcComponent } from './pages/habilitaciones/solicitudes-hc/solicitudes-hc.component';
import { SolicitudesAutComponent } from './pages/automotores/solicitudes-aut/solicitudes-aut.component';
import { VerSolicitudHcComponent } from './pages/habilitaciones/ver-solicitud-hc/ver-solicitud-hc.component';
import { VerRequisitoHcComponent } from './pages/habilitaciones/ver-requisito-hc/ver-requisito-hc.component';
import { VerSolicitudAutComponent } from './pages/automotores/ver-solicitud-aut/ver-solicitud-aut.component';
import { VerSolicitudFacComponent } from './pages/factibilidad/ver-solicitud-fac/ver-solicitud-fac.component';
import { VerRequisitoAutComponent } from './pages/automotores/ver-requisito-aut/ver-requisito-aut.component';
import { RequisitoVentanaComponent } from './pages/requisito-ventana/requisito-ventana.component';
import { SeleccionAreaComponent } from './pages/seleccion-area/seleccion-area.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'Perfiles',
    component: SeleccionAreaComponent,
  },

  {
    path: 'hub',
    component: HubPagesComponent,
    children: [
      { path: 'homeHabilitaciones', component: SolicitudesHcComponent, },
      { path: 'solicitud-hc/:idSolicitud', component: VerSolicitudHcComponent },
      { path: 'requisito-hc/:idRequisito', component: VerRequisitoHcComponent },
      { path: 'homeAutomotores', component: SolicitudesAutComponent },
      { path: 'solicitud-aut/:idSolicitud/:id_contribuyente', component: VerSolicitudAutComponent },
      { path: 'ver-requisito-aut/:idRequisito', component: VerRequisitoAutComponent },
      { path: 'homeFactibilidad', component: SolicitudesFacComponent },
      { path: 'solicitud-fac/:idSolicitud/:id_contribuyente', component: VerSolicitudFacComponent },
      { path: 'requisitoVentana/:basecode', component: RequisitoVentanaComponent },

      // children: [
      //   {
      //     path: 'solicitud-hc/:idSolicitud',
      //     component: VerSolicitudHcComponent,
      //   }
      // ],
      //},
    ],
  },
];

//
//{ path: 'homeAutomotores', component: SolicitudesAutComponent },
// { path: 'pendientes', component: SolicitudesPendientesComponent },
// { path: 'rechazados', component: SolicitudesRechazadasComponent },
// { path: 'completados', component: SolicitudesAprobadasComponent },

// Ruta para ver solicitud, definida como hija de 'hub'
//{ path: 'solicitud/:id', component: VerSolicitudComponent },