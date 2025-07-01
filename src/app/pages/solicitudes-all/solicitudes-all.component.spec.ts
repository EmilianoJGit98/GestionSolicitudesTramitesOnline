import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAllComponent } from './solicitudes-all.component';

describe('SolicitudesAllComponent', () => {
  let component: SolicitudesAllComponent;
  let fixture: ComponentFixture<SolicitudesAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
