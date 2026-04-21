// frontend/src/app/components/task-form/task-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  template: `
  <div class="overlay" (click)="$event.target === $event.currentTarget && cancel.emit()">
    <div class="modal">
      <div class="modal-hdr">{{ editMode ? 'Edit Task' : 'New Task' }}</div>
      <div class="modal-body">

        <div class="form-row">
          <div class="fgroup">
            <label><span class="req">*</span> Assigned To</label>
            <select [(ngModel)]="formData.assignedTo">
              <option *ngFor="let u of users" [value]="u">{{ u }}</option>
            </select>
          </div>
          <div class="fgroup">
            <label><span class="req">*</span> Status</label>
            <select [(ngModel)]="formData.status">
              <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="fgroup">
            <label>Due Date</label>
            <input type="date" [(ngModel)]="formData.dueDate"/>
          </div>
          <div class="fgroup">
            <label><span class="req">*</span> Priority</label>
            <select [(ngModel)]="formData.priority">
              <option *ngFor="let p of priorities" [value]="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <div class="form-row full">
          <div class="fgroup">
            <label>Description</label>
            <textarea [(ngModel)]="formData.comments" placeholder="Enter description..."></textarea>
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button class="btn-cancel" (click)="cancel.emit()">Cancel</button>
        <button class="btn-save" (click)="onSave()">Save</button>
      </div>
    </div>
  </div>
  `
})
export class TaskFormComponent {
  @Input() formData!: Task;
  @Input() editMode = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'];
  statuses = ['Not Started', 'In Progress', 'Completed'];
  priorities = ['Low', 'Normal', 'High'];

  onSave(): void {
    if (!this.formData.assignedTo || !this.formData.status || !this.formData.priority) {
      alert('Please fill all required fields.');
      return;
    }
    this.save.emit();
  }
}
