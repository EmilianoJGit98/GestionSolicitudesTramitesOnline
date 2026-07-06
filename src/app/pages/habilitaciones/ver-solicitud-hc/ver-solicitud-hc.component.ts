import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ver-solicitud-hc',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './ver-solicitud-hc.component.html',
  styleUrl: './ver-solicitud-hc.component.css'
})
export class VerSolicitudHcComponent {

  constructor(private router: Router) { }

  ngOnInit(): void { }


  irAlRequisito(idRequisito: number) {
    // this.router.navigate(['/hub/homeHabilitaciones/solicitud-hc/', element.id]);
    this.router.navigateByUrl('/hub/requisito-hc/' + idRequisito);
  }

}
