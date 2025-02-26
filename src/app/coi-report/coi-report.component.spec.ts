import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoiReportComponent } from './coi-report.component';

describe('CoiReportComponent', () => {
  let component: CoiReportComponent;
  let fixture: ComponentFixture<CoiReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoiReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
