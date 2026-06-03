import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Mock authentication trigger for Day 3 skeleton phase
    setTimeout(() => {
      this.isLoading = false;
      // Store a temporary flag to unblock routing development
      localStorage.setItem('token', 'mock-skeleton-jwt-token');
      this.router.navigate(['/']);
    }, 1000);
  }

  loginWithGoogle() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      localStorage.setItem('token', 'mock-google-skeleton-token');
      this.router.navigate(['/']);
    }, 1200);
  }
}