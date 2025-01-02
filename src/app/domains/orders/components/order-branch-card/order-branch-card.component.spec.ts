import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBranchCardComponent } from './order-branch-card.component';

describe('OrderBranchCardComponent', () => {
  let component: OrderBranchCardComponent;
  let fixture: ComponentFixture<OrderBranchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBranchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBranchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
