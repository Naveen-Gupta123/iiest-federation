// frontend/src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  assignedTo: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate?: string;
  priority: 'Low' | 'Normal' | 'High';
  comments?: string;
  createdAt?: string;
}

export interface TaskResponse {
  tasks: Task[];
  total: number;
  page: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(search = '', page = 1, limit = 20): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);
    return this.http.get<TaskResponse>(this.apiUrl, { params });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
