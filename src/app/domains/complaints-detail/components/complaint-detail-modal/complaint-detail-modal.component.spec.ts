import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailModalComponent } from './complaint-detail-modal.component';

describe('ComplaintDetailModalComponent', () => {
  let component: ComplaintDetailModalComponent;
  let fixture: ComponentFixture<ComplaintDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
