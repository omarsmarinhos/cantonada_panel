import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetailsModalComponent } from './promotion-details-modal.component';

describe('PromotionDetailsModalComponent', () => {
  let component: PromotionDetailsModalComponent;
  let fixture: ComponentFixture<PromotionDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
