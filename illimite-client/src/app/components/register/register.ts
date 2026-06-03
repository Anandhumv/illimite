import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) { }

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are strictly required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      localStorage.setItem('token', 'mock-skeleton-jwt-token');
      this.router.navigate(['/']);
    }, 1000);
  }
}