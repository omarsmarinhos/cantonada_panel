import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintBranchCardComponent } from './complaint-branch-card.component';

describe('ComplaintBranchCardComponent', () => {
  let component: ComplaintBranchCardComponent;
  let fixture: ComponentFixture<ComplaintBranchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintBranchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintBranchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
