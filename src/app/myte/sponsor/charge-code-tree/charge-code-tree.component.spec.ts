import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCodeTreeComponent } from './charge-code-tree.component';

describe('ChargeCodeTreeComponent', () => {
  let component: ChargeCodeTreeComponent;
  let fixture: ComponentFixture<ChargeCodeTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCodeTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCodeTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
