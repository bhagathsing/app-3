import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCodeDetailsComponent } from './charge-code-details.component';

describe('ChargeCodeDetailsComponent', () => {
  let component: ChargeCodeDetailsComponent;
  let fixture: ComponentFixture<ChargeCodeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCodeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
