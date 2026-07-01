import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  tasks: Task[] = [];
  showCreateForm = false;
  title = '';
  description = '';

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

  get todoTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'TODO');
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'IN_PROGRESS');
  }

  get doneTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'DONE');
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  submitTask(): void {
    if (!this.title.trim()) {
      return;
    }

    this.taskService.createTask({
      title: this.title.trim(),
      description: this.description.trim() || null,
      status: 'TODO',
      userId: null
    }).subscribe({
      next: () => {
        this.title = '';
        this.description = '';
        this.showCreateForm = false;
        this.loadTasks();
      },
      error: (error) => {
        console.error('Failed to create task:', error);
      }
    });
  }

  changeStatus(taskId: number, newStatus: TaskStatus): void {
    const task = this.tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    this.taskService.updateTask(taskId, {
      title: task.title,
      description: task.description,
      status: newStatus,
      userId: task.userId
    }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
      }
    });
  }

  onDeleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      },
      error: (error) => {
        console.error('Failed to delete task:', error);
      }
    });
  }
}
