import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidityDetailsComponent } from './validity-details.component';

describe('ValidityDetailsComponent', () => {
  let component: ValidityDetailsComponent;
  let fixture: ComponentFixture<ValidityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
