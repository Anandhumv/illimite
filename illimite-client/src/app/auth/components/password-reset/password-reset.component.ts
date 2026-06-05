import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
    selector: 'app-password-reset',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="reset-container" style="max-width: 400px; margin: 50px auto; padding: 25px; border: 1px solid #ddd; border-radius: 8px;">
      <h2>Reset Password</h2>
      <p style="color: #666; font-size: 14px;">Enter your email address below, and we will send you a secure link to reset your password.</p>

      <div *ngIf="successMessage" style="color: green; margin-bottom: 15px; font-weight: bold;">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" style="color: red; margin-bottom: 15px; font-weight: bold;">
        {{ errorMessage }}
      </div>

      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email Address</label>
          <input type="email" formControlName="email" style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" placeholder="name@example.com" />
          <div *ngIf="resetForm.get('email')?.touched && resetForm.get('email')?.invalid" style="color: red; font-size: 12px; margin-top: 5px;">
            Please enter a valid email address.
          </div>
        </div>

        <button type="submit" [disabled]="resetForm.invalid || isLoading" style="width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
          {{ isLoading ? 'Sending Link...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  `
})
export class PasswordResetComponent {
    private fb = inject(FormBuilder);
    private auth = inject(Auth);

    resetForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    isLoading = false;
    successMessage = '';
    errorMessage = '';

    async onSubmit(): Promise<void> {
        if (this.resetForm.invalid) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const email = this.resetForm.get('email')?.value;

        try {
            await sendPasswordResetEmail(this.auth, email);
            this.successMessage = 'Password reset email sent successfully! Check your inbox.';
            this.resetForm.reset();
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                this.errorMessage = 'No account found with this email address.';
            } else {
                this.errorMessage = error.message || 'An error occurred. Please try again.';
            }
        } finally {
            this.isLoading = false;
        }
    }
}