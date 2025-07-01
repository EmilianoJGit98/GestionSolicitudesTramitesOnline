import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesRechazadasComponent } from './solicitudes-rechazadas.component';

describe('SolicitudesRechazadasComponent', () => {
  let component: SolicitudesRechazadasComponent;
  let fixture: ComponentFixture<SolicitudesRechazadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesRechazadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesRechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
