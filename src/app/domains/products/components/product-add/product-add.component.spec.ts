import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddModalComponent } from './product-add.component';

describe('ProductAddComponent', () => {
  let component: ProductAddModalComponent;
  let fixture: ComponentFixture<ProductAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
