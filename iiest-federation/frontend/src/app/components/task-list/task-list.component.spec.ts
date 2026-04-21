// frontend/src/app/components/task-list/task-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

const mockTasks = [
  { _id: '1', assignedTo: 'User 1', status: 'Completed' as const,  dueDate: '2024-10-12', priority: 'Low' as const,    comments: 'Good' },
  { _id: '2', assignedTo: 'User 2', status: 'In Progress' as const, dueDate: '2024-09-14', priority: 'High' as const,   comments: 'Review' },
];

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    spy.getTasks.and.returnValue(of({ tasks: mockTasks, total: 2, page: 1, pages: 1 }));
    spy.createTask.and.returnValue(of(mockTasks[0]));
    spy.updateTask.and.returnValue(of(mockTasks[0]));
    spy.deleteTask.and.returnValue(of({ message: 'Task deleted' }));

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskFormComponent],
      imports: [FormsModule],
      providers: [{ provide: TaskService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
    expect(component.total).toBe(2);
  });

  it('should display tasks in the table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('openNew() should open form in create mode', () => {
    component.openNew();
    expect(component.showForm).toBeTrue();
    expect(component.editMode).toBeFalse();
    expect(component.formData.assignedTo).toBe('User 1');
  });

  it('openEdit() should open form in edit mode', () => {
    component.openEdit(mockTasks[0]);
    expect(component.showForm).toBeTrue();
    expect(component.editMode).toBeTrue();
    expect(component.formData._id).toBe('1');
  });

  it('confirmDelete() should open delete modal', () => {
    component.confirmDelete(mockTasks[0]);
    expect(component.showDelete).toBeTrue();
    expect(component.deleteTask?._id).toBe('1');
  });

  it('saveTask() should call createTask when not in edit mode', () => {
    component.openNew();
    component.saveTask();
    expect(taskService.createTask).toHaveBeenCalled();
  });

  it('saveTask() should call updateTask when in edit mode', () => {
    component.openEdit(mockTasks[0]);
    component.saveTask();
    expect(taskService.updateTask).toHaveBeenCalledWith('1', jasmine.any(Object));
  });

  it('doDelete() should call deleteTask', () => {
    component.confirmDelete(mockTasks[0]);
    component.doDelete();
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('refresh() should reset search and reload', () => {
    component.search = 'test';
    component.page = 3;
    component.refresh();
    expect(component.search).toBe('');
    expect(component.page).toBe(1);
    expect(taskService.getTasks).toHaveBeenCalled();
  });

  it('goPage() should update page and reload', () => {
    component.pages = 5;
    component.goPage(3);
    expect(component.page).toBe(3);
    expect(taskService.getTasks).toHaveBeenCalled();
  });
});
