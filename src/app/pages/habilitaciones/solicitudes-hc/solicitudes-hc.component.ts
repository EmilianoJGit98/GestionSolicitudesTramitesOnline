import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { ItemHc } from '../../../models/SolicitudesHcObj.model';
// import { ARRsolicitudesHc } from '../../../data/data-solicitudes-hc';
import { solicitudInterface } from '../../../models/SolicitudesAutObj.model';
import { SolicitudesTramitesOnlineService } from '../../../services/SolicitudesTramitesOnline.service';

@Component({
  selector: 'app-solicitudes-hc',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterModule],
  templateUrl: './solicitudes-hc.component.html',
  styleUrl: './solicitudes-hc.component.css'
})
export class SolicitudesHcComponent {
  constructor(private router: Router) { }

  displayedColumns: string[] = [
    '#',
    'solicitante',
    'fecha',
    'nombre',
    'tipo',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ItemHc>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // this.dataSource.data = ARRsolicitudesHc;
  }

  accionFila(element: ItemHc) {
    // this.router.navigate(['/hub/homeHabilitaciones/solicitud-hc/', element.id]);
    this.router.navigateByUrl('/hub/solicitud-hc/' + element.id);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
