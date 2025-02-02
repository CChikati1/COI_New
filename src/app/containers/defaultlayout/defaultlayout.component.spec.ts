import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultlayoutComponent } from './defaultlayout.component';

describe('DefaultlayoutComponent', () => {
  let component: DefaultlayoutComponent;
  let fixture: ComponentFixture<DefaultlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultlayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
