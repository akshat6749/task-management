import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Failed to load tasks:', error);
      }
    });
  }

  addTask(): void {
    this.taskService.createTask({
      title: 'Demo task from Angular',
      description: 'Created from the Angular frontend',
      status: 'TODO',
      userId: null
    }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Failed to create task:', error);
      }
    });
  }
}
