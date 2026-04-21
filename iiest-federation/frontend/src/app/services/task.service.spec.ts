// frontend/src/app/services/task.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService, Task } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    _id: '1',
    assignedTo: 'User 1',
    status: 'Not Started',
    dueDate: '2024-12-01',
    priority: 'Normal',
    comments: 'Test task'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTasks() should return paginated tasks', () => {
    const mockResponse = { tasks: [mockTask], total: 1, page: 1, pages: 1 };
    service.getTasks().subscribe(res => {
      expect(res.tasks.length).toBe(1);
      expect(res.total).toBe(1);
    });
    const req = httpMock.expectOne(r => r.url.includes('/api/tasks'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getTasks() should pass search param', () => {
    service.getTasks('User 1').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/api/tasks') && r.params.has('search'));
    expect(req.request.params.get('search')).toBe('User 1');
    req.flush({ tasks: [], total: 0, page: 1, pages: 1 });
  });

  it('getTask() should return a single task', () => {
    service.getTask('1').subscribe(task => {
      expect(task._id).toBe('1');
      expect(task.assignedTo).toBe('User 1');
    });
    const req = httpMock.expectOne('http://localhost:5000/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('createTask() should POST a new task', () => {
    service.createTask(mockTask).subscribe(task => {
      expect(task.assignedTo).toBe('User 1');
    });
    const req = httpMock.expectOne('http://localhost:5000/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.assignedTo).toBe('User 1');
    req.flush(mockTask);
  });

  it('updateTask() should PUT task data', () => {
    const update = { status: 'In Progress' as const };
    service.updateTask('1', update).subscribe(task => {
      expect(task.status).toBe('In Progress');
    });
    const req = httpMock.expectOne('http://localhost:5000/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockTask, status: 'In Progress' });
  });

  it('deleteTask() should DELETE a task', () => {
    service.deleteTask('1').subscribe(res => {
      expect(res.message).toBe('Task deleted');
    });
    const req = httpMock.expectOne('http://localhost:5000/api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Task deleted' });
  });
});
