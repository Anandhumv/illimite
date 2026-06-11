import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

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
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  async onSubmit() {
    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      this.toastService.error(this.errorMessage);
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Enter a valid email address.';
      this.toastService.error(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithEmailAndPassword(email, this.password);
      this.isLoading = false;
      this.toastService.success('Signed in successfully.');
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = this.getAuthError(error);
      this.toastService.error(this.errorMessage);
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithGoogle();
      this.isLoading = false;
      this.toastService.success('Signed in with Google.');
      this.router.navigate(['/']);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = this.getAuthError(error);
      this.toastService.error(this.errorMessage);
    }
  }

  private getAuthError(error: unknown): string {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

    if (code.includes('auth/invalid-email')) {
      return 'Enter a valid email address.';
    }

    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
      return 'Email or password is incorrect.';
    }

    if (code.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in was cancelled.';
    }

    return 'Unable to sign in right now. Please try again.';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
