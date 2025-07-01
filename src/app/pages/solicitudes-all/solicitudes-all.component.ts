import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

export interface Item {
  solicitante: string;
  fecha: string;
  actividad: string;
  estado: string;
}

@Component({
  selector: 'app-solicitudes-all',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './solicitudes-all.component.html',
  styleUrl: './solicitudes-all.component.css',
})
export class SolicitudesAllComponent {
  displayedColumns: string[] = [
    '#',
    'solicitante',
    'fecha',
    'actividad',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Item>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Datos de ejemplo
    const datos: Item[] = [
      {
        solicitante: 'Juan Pérez',
        fecha: '2025-06-01',
        actividad: 'Revisión',
        estado: 'Pendiente',
      },
      {
        solicitante: 'María López',
        fecha: '2025-06-02',
        actividad: 'Aprobación',
        estado: 'Completa',
      },
      {
        solicitante: 'Carlos Ruiz',
        fecha: '2025-06-03',
        actividad: 'Enviado',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Ana Gómez',
        fecha: '2025-06-04',
        actividad: 'Verificación',
        estado: 'En proceso',
      },
      {
        solicitante: 'Luis Torres',
        fecha: '2025-06-05',
        actividad: 'Finalización',
        estado: 'Completada',
      },
      {
        solicitante: 'Sofía Morales',
        fecha: '2025-06-06',
        actividad: 'Seguimiento',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Pedro Díaz',
        fecha: '2025-06-07',
        actividad: 'Reporte',
        estado: 'En proceso',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
      {
        solicitante: 'Lucía Fernández',
        fecha: '2025-06-08',
        actividad: 'Auditoría',
        estado: 'Pendiente',
      },
    ];

    this.dataSource.data = datos;
  }

  accionFila(element: Item) {
    alert(`Acción en fila: ${element.solicitante}`);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
