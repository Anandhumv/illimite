import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithEmailAndPassword(this.email, this.password);
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = this.getAuthError(error);
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithGoogle();
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = this.getAuthError(error);
    }
  }

  private getAuthError(error: unknown): string {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
      return 'Email or password is incorrect.';
    }

    if (code.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in was cancelled.';
    }

    return 'Unable to sign in right now. Please try again.';
  }
}
