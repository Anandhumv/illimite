import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',   // Fix here
  styleUrl: './register.css'       // Fix here
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are strictly required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signUpWithEmailAndPassword(this.email, this.password, this.name);
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = this.getAuthError(error);
    }
  }

  private getAuthError(error: unknown): string {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : '';

    if (code.includes('auth/email-already-in-use')) {
      return 'An account already exists for this email.';
    }

    if (code.includes('auth/weak-password')) {
      return 'Password must be at least 6 characters.';
    }

    if (code.includes('auth/operation-not-allowed')) {
      return 'Email/password sign-up is not enabled in Firebase Authentication.';
    }

    if (code.includes('auth/invalid-email')) {
      return 'Enter a valid email address.';
    }

    if (code.includes('auth/network-request-failed')) {
      return 'Network error. Check your internet connection and try again.';
    }

    if (code.includes('auth/api-key-not-valid')) {
      return 'Firebase API key is invalid. Check the Angular environment config.';
    }

    if (code.includes('auth/unauthorized-domain')) {
      return 'This localhost/domain is not allowed in Firebase Authentication settings.';
    }

    if (code || message) {
      return `${code || 'Firebase error'}: ${message || 'Unable to create account.'}`;
    }

    return 'Unable to create your account right now. Please try again.';
  }
}
