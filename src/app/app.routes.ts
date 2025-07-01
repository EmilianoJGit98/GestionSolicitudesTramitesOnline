import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HubPagesComponent } from './pages/hub-pages/hub-pages.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistersListComponent } from './pages/registers-list/registers-list.component';
import { SolicitudesPendientesComponent } from './pages/solicitudes-pendientes/solicitudes-pendientes.component';
import { SolicitudesRechazadasComponent } from './pages/solicitudes-rechazadas/solicitudes-rechazadas.component';
import { SolicitudesAprobadasComponent } from './pages/solicitudes-aprobadas/solicitudes-aprobadas.component';
import { SolicitudesAllComponent } from './pages/solicitudes-all/solicitudes-all.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'hub',
    component: HubPagesComponent,
    children: [
      { path: '', component: SolicitudesAllComponent },
      { path: 'home', component: SolicitudesAllComponent },
      { path: 'pendientes', component: SolicitudesPendientesComponent },
      { path: 'rechazados', component: SolicitudesRechazadasComponent },
      { path: 'completados', component: SolicitudesAprobadasComponent },
      { path: 'ListaRegistros', component: RegistersListComponent },
      // { path: 'eventos/actividades/:id', component: ActividadesComponent },
      // { path: 'eventos/asignarA/:id', component: AsignarActividadesComponent },
      // { path: 'eventos/actividades/:idEvento/:idRubro', component: ActividadesComponent },
      // { path: 'eventos/actividades-asignadas/:idEvento', component: ActividadesAsignadasComponent },
    ],
  },
];
