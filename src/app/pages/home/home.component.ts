import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; // Asegúrate de importar MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { AuthTokenService } from '../../services/auth-token.service';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
}

interface comprobante {
  NroComprobante: string;
  LiberacionPago: string;
  nro_doc: string;
  nomraz: string;
  puntov: number;
  fechahora: string;
  idLiquidacion: number;
  title: string;
  unit_price: any;
  importado: number;
  fecha_importacion: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  deshabilitados: number = 1;
  estadoCargaEventos: boolean = false;
  msjVista: string = 'Mostrar solo los registros inactivos';

  filterValue: string = '';

  constructor(private tokenService: AuthTokenService) {}

  displayedColumns: string[] = [
    'NroComprobante',
    'LiberacionPago',
    'nomraz',
    'fechahora',
    'title',
    'unit_price',
    'fecha_importacion',
    'importar',
  ];

  // Usa MatTableDataSource en lugar de un arreglo normal para la paginación
  dataSource = new MatTableDataSource<comprobante>([
    {
      NroComprobante: '98918749257',
      LiberacionPago: '2025-01-17 09:04:23.000',
      // money_release_status: 'pending',
      nro_doc: '38192502',
      nomraz: 'María soledad Aguilar',
      // codbarf: '9270600000025014822505010000007006000000250145',
      puntov: 82,
      fechahora: '2025-01-14 10:04:00',
      // idrubro: 11109,
      // idSubRubro: 11109228,
      idLiquidacion: 17060894,
      title:
        'ARTESANOS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 60000.0,
      importado: 0,
      fecha_importacion: '2025-02-13 14:20:35.000',
    },
    {
      NroComprobante: '98918824031',
      LiberacionPago: '2025-01-17 09:05:42.000',
      // money_release_status: 'pending',
      nro_doc: '40487063',
      nomraz: 'Antonella Ovelar',
      // codbarf: '9271600000025014822505010000009016000000250148',
      puntov: 82,
      fechahora: '2025-01-14 10:05:00',
      // idrubro: 11109,
      // idSubRubro: 11109231,
      idLiquidacion: 17060913,
      title:
        'REVENTAS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 160000.0,
      importado: 1,
      fecha_importacion: '2025-02-14 10:15:00.000',
    },
    {
      NroComprobante: '98919130637',
      LiberacionPago: '2025-01-17 09:07:52.000',
      // money_release_status: 'pending',
      nro_doc: '46065212',
      nomraz: 'Yanela Casasola',
      // codbarf: '9270500000025014822505010000010005000000250143',
      puntov: 82,
      fechahora: '2025-01-14 10:07:00',
      // idrubro: 11109,
      // idSubRubro: 11109229,
      idLiquidacion: 17060937,
      title:
        'ARTESANOS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202 $50000)',
      unit_price: 50000.0,
      importado: 0,
      fecha_importacion: '2025-02-15 12:20:30.000',
    },
    {
      NroComprobante: '98919708571',
      LiberacionPago: '2025-01-17 09:12:41.000',
      // money_release_status: 'pending',
      nro_doc: '35898671',
      nomraz: 'Daniela Zanin',
      // codbarf: '9271500000025014822505010000012015000000250146',
      puntov: 82,
      fechahora: '2025-01-14 10:11:00',
      // idrubro: 11109,
      // idSubRubro: 11109223,
      idLiquidacion: 17060974,
      title:
        'FOOD TRUCK 3X3 (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 150000.0,
      importado: 0,
      fecha_importacion: '2025-02-16 13:35:25.000',
    },
    {
      NroComprobante: '99283707242',
      LiberacionPago: '2025-01-17 09:23:28.000',
      // money_release_status: 'pending',
      nro_doc: '46152799',
      nomraz: 'Gonzalo Caballero',
      // codbarf: '9270500000025014822505010000013005000000250140',
      puntov: 82,
      fechahora: '2025-01-14 10:23:00',
      // idrubro: 11109,
      // idSubRubro: 11109229,
      idLiquidacion: 17061048,
      title:
        'ARTESANOS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202 $50000)',
      unit_price: 50000.0,
      importado: 1,
      fecha_importacion: '2025-02-17 14:50:00.000',
    },
    {
      NroComprobante: '98920134583',
      LiberacionPago: '2025-01-17 09:25:15.000',
      // money_release_status: 'pending',
      nro_doc: '35012368',
      nomraz: 'Carlos Romero',
      // codbarf: '9270900000025014822505010000014505000000250142',
      puntov: 82,
      fechahora: '2025-01-14 10:25:00',
      // idrubro: 11109,
      // idSubRubro: 11109227,
      idLiquidacion: 17061112,
      title:
        'REVENTAS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 120000.0,
      importado: 0,
      fecha_importacion: '2025-02-18 10:05:35.000',
    },
    {
      NroComprobante: '98921057413',
      LiberacionPago: '2025-01-17 09:30:02.000',
      // money_release_status: 'pending',
      nro_doc: '40356240',
      nomraz: 'Lucía Gómez',
      // codbarf: '9271800000025014822505010000015006000000250149',
      puntov: 82,
      fechahora: '2025-01-14 10:30:00',
      // idrubro: 11109,
      // idSubRubro: 11109221,
      idLiquidacion: 17061172,
      title:
        'FOOD TRUCK 3X3 (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 180000.0,
      importado: 1,
      fecha_importacion: '2025-02-19 11:30:00.000',
    },
    {
      NroComprobante: '98922593528',
      LiberacionPago: '2025-01-17 09:35:42.000',
      // money_release_status: 'pending',
      nro_doc: '45162829',
      nomraz: 'Carlos Sánchez',
      // codbarf: '9272200000025014822505010000017007000000250145',
      puntov: 82,
      fechahora: '2025-01-14 10:35:00',
      // idrubro: 11109,
      // idSubRubro: 11109230,
      idLiquidacion: 17061225,
      title:
        'ARTESANOS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 70000.0,
      importado: 0,
      fecha_importacion: '2025-02-20 12:10:25.000',
    },
    {
      NroComprobante: '98923610252',
      LiberacionPago: '2025-01-17 09:40:00.000',
      // money_release_status: 'pending',
      nro_doc: '40762053',
      nomraz: 'Ana Pérez',
      // codbarf: '9272400000025014822505010000018008000000250146',
      puntov: 82,
      fechahora: '2025-01-14 10:40:00',
      // idrubro: 11109,
      // idSubRubro: 11109221,
      idLiquidacion: 17061280,
      title:
        'REVENTAS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 140000.0,
      importado: 1,
      fecha_importacion: '2025-02-21 12:50:00.000',
    },
    {
      NroComprobante: '98924713641',
      LiberacionPago: '2025-01-17 09:45:00.000',
      // money_release_status: 'pending',
      nro_doc: '46358012',
      nomraz: 'Pablo Fernández',
      // codbarf: '9272600000025014822505010000019009000000250147',
      puntov: 82,
      fechahora: '2025-01-14 10:45:00',
      // idrubro: 11109,
      // idSubRubro: 11109225,
      idLiquidacion: 17061338,
      title:
        'ARTESANOS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 65000.0,
      importado: 0,
      fecha_importacion: '2025-02-22 13:05:00.000',
    },
    {
      NroComprobante: '98925951415',
      LiberacionPago: '2025-01-17 09:50:00.000',
      // money_release_status: 'pending',
      nro_doc: '37465732',
      nomraz: 'Marcos Díaz',
      // codbarf: '9272800000025014822505010000020001000000250148',
      puntov: 82,
      fechahora: '2025-01-14 10:50:00',
      // idrubro: 11109,
      // idSubRubro: 11109224,
      idLiquidacion: 17061396,
      title:
        'FOOD TRUCK 3X3 (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 130000.0,
      importado: 1,
      fecha_importacion: '2025-02-23 14:20:00.000',
    },
    {
      NroComprobante: '98927326873',
      LiberacionPago: '2025-01-17 09:55:10.000',
      // money_release_status: 'pending',
      nro_doc: '45612397',
      nomraz: 'Felipe Martínez',
      // codbarf: '9273000000025014822505010000021002000000250149',
      puntov: 82,
      fechahora: '2025-01-14 10:55:00',
      // idrubro: 11109,
      // idSubRubro: 11109229,
      idLiquidacion: 17061455,
      title:
        'REVENTAS LOCALES (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 120000.0,
      importado: 0,
      fecha_importacion: '2025-02-24 15:10:00.000',
    },
    {
      NroComprobante: '98928551301',
      LiberacionPago: '2025-01-17 09:59:23.000',
      // money_release_status: 'pending',
      nro_doc: '40792374',
      nomraz: 'Paula Silva',
      // codbarf: '9273200000025014822505010000022003000000250150',
      puntov: 82,
      fechahora: '2025-01-14 11:00:00',
      // idrubro: 11109,
      // idSubRubro: 11109220,
      idLiquidacion: 17061513,
      title:
        'FOOD TRUCK 3X3 (IX FIESTA NAC. E INTERNAC. DEL RIO , MATE Y TERERE 01 Y 0202)',
      unit_price: 140000.0,
      importado: 1,
      fecha_importacion: '2025-02-25 13:40:00.000',
    },
  ]);

  // Captura la instancia del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    // Enlaza el paginator a la fuente de datos
    this.dataSource.paginator = this.paginator;
    // this.getModulos();
  }

  mostrarInactivos(): void {
    // Cambia el estado de deshabilitados
    this.deshabilitados = this.deshabilitados === 1 ? 0 : 1;

    // Actualiza el mensaje de vista
    this.msjVista =
      this.deshabilitados === 1
        ? 'Mostrar todos los registros'
        : 'Mostrar solo los registros inactivos';
    // this.iconEmpty =
    //   this.deshabilitados === 1 ? 'visibility' : 'visibility_off';

    // Guardar el estado en localStorage
    localStorage.setItem('deshabilitados', String(this.deshabilitados));

    // Cargar los eventos según el nuevo estado
    // this.cargarEventos(this.deshabilitados);
  }

  // getModulos() {
  //   const modulosString = this.tokenService.getModulos();
  //   if (modulosString) {
  //     const modulos = JSON.parse(modulosString);
  //     // hacer algo con los módulos
  //     console.log(modulos);
  //   } else {
  //     console.log('No hay módulos almacenados');
  //   }
  // }
}
