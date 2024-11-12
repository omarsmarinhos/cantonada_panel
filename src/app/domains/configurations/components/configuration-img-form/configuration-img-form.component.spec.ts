import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationImgFormComponent } from './configuration-img-form.component';

describe('ConfigurationImgFormComponent', () => {
  let component: ConfigurationImgFormComponent;
  let fixture: ComponentFixture<ConfigurationImgFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationImgFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationImgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
