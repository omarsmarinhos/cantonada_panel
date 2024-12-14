import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCardCustomerModalComponent } from './order-card-customer-modal.component';

describe('OrderCardCustomerModalComponent', () => {
  let component: OrderCardCustomerModalComponent;
  let fixture: ComponentFixture<OrderCardCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardCustomerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCardCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
