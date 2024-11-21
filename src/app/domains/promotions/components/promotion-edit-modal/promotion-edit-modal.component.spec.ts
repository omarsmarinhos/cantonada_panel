import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEditModalComponent } from './promotion-edit-modal.component';

describe('PromotionEditModalComponent', () => {
  let component: PromotionEditModalComponent;
  let fixture: ComponentFixture<PromotionEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
