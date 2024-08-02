import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrcPostulanteComponent } from './src-postulante.component';

describe('SrcPostulanteComponent', () => {
  let component: SrcPostulanteComponent;
  let fixture: ComponentFixture<SrcPostulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrcPostulanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrcPostulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
