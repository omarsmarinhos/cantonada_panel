import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneEditModalComponent } from './zone-edit-modal.component';

describe('ZoneEditModalComponent', () => {
  let component: ZoneEditModalComponent;
  let fixture: ComponentFixture<ZoneEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
