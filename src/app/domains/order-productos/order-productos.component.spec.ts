import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductosComponent } from './order-productos.component';

describe('OrderProductosComponent', () => {
  let component: OrderProductosComponent;
  let fixture: ComponentFixture<OrderProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
