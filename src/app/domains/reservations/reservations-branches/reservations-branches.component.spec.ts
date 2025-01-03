import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsBranchesComponent } from './reservations-branches.component';

describe('ReservationsBranchesComponent', () => {
  let component: ReservationsBranchesComponent;
  let fixture: ComponentFixture<ReservationsBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsBranchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
