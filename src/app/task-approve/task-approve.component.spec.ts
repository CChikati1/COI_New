import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskApproveComponent } from './task-approve.component';

describe('TaskApproveComponent', () => {
  let component: TaskApproveComponent;
  let fixture: ComponentFixture<TaskApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
