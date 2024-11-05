import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddModalComponent } from './category-add-modal.component';

describe('CategoryAddModalComponent', () => {
  let component: CategoryAddModalComponent;
  let fixture: ComponentFixture<CategoryAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
