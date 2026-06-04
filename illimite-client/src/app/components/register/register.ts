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

    if (code.includes('auth/email-already-in-use')) {
      return 'An account already exists for this email.';
    }

    if (code.includes('auth/weak-password')) {
      return 'Password must be at least 6 characters.';
    }

    return 'Unable to create your account right now. Please try again.';
  }
}
