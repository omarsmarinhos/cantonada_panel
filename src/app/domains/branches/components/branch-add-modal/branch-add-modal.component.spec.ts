import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAddModalComponent } from './branch-add-modal.component';

describe('BranchAddModalComponent', () => {
  let component: BranchAddModalComponent;
  let fixture: ComponentFixture<BranchAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
