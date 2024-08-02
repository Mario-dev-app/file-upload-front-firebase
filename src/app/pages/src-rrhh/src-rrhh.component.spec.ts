import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrcRrhhComponent } from './src-rrhh.component';

describe('SrcRrhhComponent', () => {
  let component: SrcRrhhComponent;
  let fixture: ComponentFixture<SrcRrhhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrcRrhhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrcRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
