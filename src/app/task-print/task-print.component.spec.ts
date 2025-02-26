import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPrintComponent } from './task-print.component';

describe('TaskPrintComponent', () => {
  let component: TaskPrintComponent;
  let fixture: ComponentFixture<TaskPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
