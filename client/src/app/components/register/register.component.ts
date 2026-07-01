import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterPayload } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <h1>Create Account</h1>

      <form class="auth-form" (ngSubmit)="onRegister()">
        <label>
          <span>Name</span>
          <input name="name" [(ngModel)]="name" type="text" />
        </label>

        <label>
          <span>Email</span>
          <input name="email" [(ngModel)]="email" type="email" />
        </label>

        <label>
          <span>Password</span>
          <input name="password" [(ngModel)]="password" type="password" />
        </label>

        <button type="submit">Register</button>
      </form>

      <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

      <p>
        Already have an account?
        <a routerLink="/login">Sign in</a>
      </p>
    </section>
  `
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  onRegister(): void {
    const payload: RegisterPayload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    if (!payload.name || !payload.email || !payload.password) {
      this.errorMessage = 'Name, email, and password are required.';
      this.successMessage = '';
      return;
    }

    this.authService.register(payload).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Registration successful. Redirecting to login...';
        setTimeout(() => {
          void this.router.navigateByUrl('/login');
        }, 700);
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage = error?.error?.message || 'Registration failed.';
      }
    });
  }
}