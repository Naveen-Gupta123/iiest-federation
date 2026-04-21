// frontend/src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  pages = 1;
  search = '';
  searchSubject = new Subject<string>();

  showForm = false;
  editMode = false;
  showDelete = false;

  selectedTask: Task | null = null;
  deleteTask: Task | null = null;

  formData: Task = this.emptyForm();

  loading = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.searchSubject.pipe(debounceTime(300)).subscribe(val => {
      this.search = val;
      this.page = 1;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(this.search, this.page, this.pageSize).subscribe({
      next: res => {
        this.tasks = res.tasks;
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  emptyForm(): Task {
    return { assignedTo: 'User 1', status: 'Not Started', dueDate: '', priority: 'Normal', comments: '' };
  }

  openNew(): void {
    this.formData = this.emptyForm();
    this.editMode = false;
    this.showForm = true;
  }

  openEdit(task: Task): void {
    this.formData = { ...task };
    this.selectedTask = task;
    this.editMode = true;
    this.showForm = true;
  }

  confirmDelete(task: Task): void {
    this.deleteTask = task;
    this.showDelete = true;
  }

  saveTask(): void {
    if (!this.formData.assignedTo || !this.formData.status || !this.formData.priority) return;
    if (this.editMode && this.selectedTask?._id) {
      this.taskService.updateTask(this.selectedTask._id, this.formData).subscribe(() => {
        this.showForm = false;
        this.loadTasks();
      });
    } else {
      this.taskService.createTask(this.formData).subscribe(() => {
        this.showForm = false;
        this.loadTasks();
      });
    }
  }

  doDelete(): void {
    if (!this.deleteTask?._id) return;
    this.taskService.deleteTask(this.deleteTask._id).subscribe(() => {
      this.showDelete = false;
      this.deleteTask = null;
      this.loadTasks();
    });
  }

  onSearchChange(val: string): void { this.searchSubject.next(val); }
  goPage(p: number): void { if (p >= 1 && p <= this.pages) { this.page = p; this.loadTasks(); } }
  setPageSize(size: number): void { this.pageSize = size; this.page = 1; this.loadTasks(); }
  refresh(): void { this.search = ''; this.page = 1; this.loadTasks(); }
  get pageArray(): number[] { return Array.from({ length: this.pages }, (_, i) => i + 1); }
}
