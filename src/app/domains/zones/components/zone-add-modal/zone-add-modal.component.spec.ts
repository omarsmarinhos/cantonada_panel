import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneAddModalComponent } from './zone-add-modal.component';

describe('ZoneAddModalComponent', () => {
  let component: ZoneAddModalComponent;
  let fixture: ComponentFixture<ZoneAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
