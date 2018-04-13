import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChargeCodeComponent } from './add-charge-code.component';

describe('AddChargeCodeComponent', () => {
  let component: AddChargeCodeComponent;
  let fixture: ComponentFixture<AddChargeCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChargeCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChargeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
