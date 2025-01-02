import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersBranchesComponent } from './orders-branches.component';

describe('OrdersBranchesComponent', () => {
  let component: OrdersBranchesComponent;
  let fixture: ComponentFixture<OrdersBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersBranchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
