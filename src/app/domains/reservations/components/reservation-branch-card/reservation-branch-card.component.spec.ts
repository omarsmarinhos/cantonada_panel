import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationBranchCardComponent } from './reservation-branch-card.component';

describe('ReservationBranchCardComponent', () => {
  let component: ReservationBranchCardComponent;
  let fixture: ComponentFixture<ReservationBranchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationBranchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationBranchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
