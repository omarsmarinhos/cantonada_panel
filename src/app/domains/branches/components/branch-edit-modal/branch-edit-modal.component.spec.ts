import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEditModalComponent } from './branch-edit-modal.component';

describe('BranchEditModalComponent', () => {
  let component: BranchEditModalComponent;
  let fixture: ComponentFixture<BranchEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
