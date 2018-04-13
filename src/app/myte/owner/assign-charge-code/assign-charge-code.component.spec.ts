import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignChargeCodeComponent } from './assign-charge-code.component';

describe('AssignChargeCodeComponent', () => {
  let component: AssignChargeCodeComponent;
  let fixture: ComponentFixture<AssignChargeCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignChargeCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignChargeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
