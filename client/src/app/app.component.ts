import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  template: `
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">Task Management</p>
        <h1>Backend-first task tracking with a lightweight Angular frontend.</h1>
        <p>Sequelize, BullMQ, and Express sit behind a standalone Angular 22 client that only knows how to ask for tasks and render them.</p>
      </section>

      <app-task-list></app-task-list>
    </main>
  `,
  styles: [`
    .app-shell {
      max-width: 1120px;
      margin: 0 auto;
      padding: 3rem 1.25rem 4rem;
      display: grid;
      gap: 1.5rem;
    }

    .hero {
      display: grid;
      gap: 0.75rem;
      max-width: 760px;
      margin-top: 1rem;
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent);
    }

    h1,
    p {
      margin: 0;
    }

    h1 {
      font-size: clamp(2.4rem, 5vw, 4.8rem);
      line-height: 0.95;
      letter-spacing: -0.05em;
      max-width: 11ch;
    }

    .hero p:last-child {
      max-width: 68ch;
      color: var(--muted);
      font-size: 1.02rem;
      line-height: 1.6;
    }
  `]
})
export class AppComponent {}