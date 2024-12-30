import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailCardComponent } from './complaint-detail-card.component';

describe('ComplaintDetailCardComponent', () => {
  let component: ComplaintDetailCardComponent;
  let fixture: ComponentFixture<ComplaintDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintDetailCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
