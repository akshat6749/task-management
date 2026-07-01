import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginPayload } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <h1>Login</h1>

      <form class="auth-form" (ngSubmit)="onLogin()">
        <label>
          <span>Email</span>
          <input name="email" [(ngModel)]="email" type="email" />
        </label>

        <label>
          <span>Password</span>
          <input name="password" [(ngModel)]="password" type="password" />
        </label>

        <button type="submit">Sign In</button>
      </form>

      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

      <p>
        New here?
        <a routerLink="/register">Create an account</a>
      </p>
    </section>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  onLogin(): void {
    const payload: LoginPayload = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: () => {
        void this.router.navigateByUrl('/');
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}