import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionAddModalComponent } from './promotion-add-modal.component';

describe('PromotionAddModalComponent', () => {
  let component: PromotionAddModalComponent;
  let fixture: ComponentFixture<PromotionAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
