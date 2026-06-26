import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  template: `
    <section class="board-shell">
      <div class="board-header">
        <p class="eyebrow">Task board</p>
        <h2>Live tasks from the Express API</h2>
        <p class="lede">This standalone component fetches tasks through the Angular service and renders them as a simple card grid.</p>
      </div>

      @if (tasks$ | async; as tasks) {
        <div class="task-grid">
          @for (task of tasks; track task.id) {
            <article class="task-card">
              <div class="task-card__top">
                <span class="status">{{ task.status }}</span>
                <time class="created">{{ task.createdAt | date: 'mediumDate' }}</time>
              </div>
              <h3>{{ task.title }}</h3>
              <p>{{ task.description || 'No description provided.' }}</p>
            </article>
          }
        </div>
      } @else {
        <div class="empty-state">Loading tasks...</div>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .board-shell {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 24px 60px rgba(23, 32, 42, 0.08);
      backdrop-filter: blur(18px);
    }

    .board-header {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.75rem;
      color: var(--accent);
      font-weight: 700;
    }

    h2,
    h3,
    p {
      margin: 0;
    }

    .lede,
    .task-card p {
      color: var(--muted);
      line-height: 1.5;
    }

    .task-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .task-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.72);
      display: grid;
      gap: 0.75rem;
    }

    .task-card__top {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: center;
      font-size: 0.85rem;
      color: var(--muted);
    }

    .status {
      text-transform: capitalize;
      background: var(--accent-soft);
      color: var(--accent);
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-weight: 700;
    }

    .created {
      white-space: nowrap;
    }

    .empty-state {
      padding: 1rem;
      color: var(--muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoardComponent {
  private readonly taskService = inject(TaskService);

  readonly tasks$ = this.taskService.getTasks();
}