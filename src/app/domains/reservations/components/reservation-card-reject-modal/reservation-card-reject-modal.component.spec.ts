import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCardRejectModalComponent } from './reservation-card-reject-modal.component';

describe('ReservationCardRejectModalComponent', () => {
  let component: ReservationCardRejectModalComponent;
  let fixture: ComponentFixture<ReservationCardRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCardRejectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCardRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
