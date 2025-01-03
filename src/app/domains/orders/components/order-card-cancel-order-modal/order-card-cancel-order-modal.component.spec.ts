import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCardCancelOrderModalComponent } from './order-card-cancel-order-modal.component';

describe('OrderCardCancelOrderModalComponent', () => {
  let component: OrderCardCancelOrderModalComponent;
  let fixture: ComponentFixture<OrderCardCancelOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardCancelOrderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCardCancelOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
