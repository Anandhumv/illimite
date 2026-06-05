import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-card__header">
          <span class="auth-card__logo">✦</span>
          <h1 class="auth-card__title">Create account</h1>
          <p class="auth-card__subtitle">Join Illimite today — it's free</p>
        </div>

        <form class="auth-form">
          <div class="form-group">
            <label class="form-label" for="displayName">Full Name</label>
            <input id="displayName" class="form-input" type="text" placeholder="Jane Doe" autocomplete="name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input id="email" class="form-input" type="email" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input id="password" class="form-input" type="password" placeholder="Min. 8 characters" autocomplete="new-password" />
          </div>
          <button type="submit" class="btn-primary">Create Account</button>
        </form>

        <p class="auth-card__footer">
          Already have an account?
          <a routerLink="/auth/login" class="auth-link">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at 40% 60%, rgba(96,165,250,0.08) 0%, transparent 60%),
                  #05050f;
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      background: rgba(15, 15, 26, 0.9);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    }
    .auth-card__header { text-align: center; margin-bottom: 2rem; }
    .auth-card__logo {
      font-size: 2rem;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .auth-card__title {
      margin: 0.75rem 0 0.25rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .auth-card__subtitle { margin: 0; font-size: 0.875rem; color: #64748b; }

    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.8rem; font-weight: 500; color: #94a3b8; }
    .form-input {
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .form-input:focus { border-color: #60a5fa; }
    .form-input::placeholder { color: #334155; }
    .btn-primary {
      margin-top: 0.5rem;
      padding: 0.8rem;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      font-family: inherit;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .auth-card__footer { margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: #64748b; }
    .auth-link { color: #60a5fa; text-decoration: none; font-weight: 500; }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {}
