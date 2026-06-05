import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Auth, user } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-profile-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="profile-container" style="max-width: 500px; margin: 40px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
      <h2>Edit Profile</h2>
      
      <div *ngIf="successMessage" style="color: green; margin-bottom: 15px; font-weight: bold;">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" style="color: red; margin-bottom: 15px; font-weight: bold;">
        {{ errorMessage }}
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Display Name</label>
          <input type="text" formControlName="displayName" style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Profile Picture URL</label>
          <input type="text" formControlName="photoURL" style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Phone Number</label>
          <input type="text" formControlName="phoneNumber" style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>

        <button type="submit" [disabled]="profileForm.invalid || isLoading" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          {{ isLoading ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>
    </div>
  `
})
export class ProfileEditComponent implements OnInit {
    private fb = inject(FormBuilder);
    private profileService = inject(ProfileService);
    private auth = inject(Auth);

    profileForm!: FormGroup;
    isLoading = false;
    currentUserId: string | null = null;
    successMessage = '';
    errorMessage = '';

    ngOnInit(): void {
        this.initForm();
        this.loadUserData();
    }

    private initForm(): void {
        this.profileForm = this.fb.group({
            displayName: ['', [Validators.required, Validators.minLength(2)]],
            photoURL: ['', [Validators.pattern(/https?:\/\/.+/)]],
            phoneNumber: ['', [Validators.pattern(/^[0-9+\s-]{10,15}$/)]]
        });
    }

    private loadUserData(): void {
        user(this.auth).pipe(take(1)).subscribe((currentUser) => {
            if (currentUser) {
                this.currentUserId = currentUser.uid;
                this.profileService.getUserProfile().pipe(take(1)).subscribe((profile) => {
                    if (profile) {
                        this.profileForm.patchValue({
                            displayName: profile.displayName || '',
                            photoURL: profile.photoURL || '',
                            phoneNumber: profile.phoneNumber || ''
                        });
                    }
                });
            }
        });
    }

    async onSubmit(): Promise<void> {
        if (this.profileForm.invalid || !this.currentUserId) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        try {
            await this.profileService.updateUserProfile(this.currentUserId, this.profileForm.value);
            this.successMessage = 'Profile updated successfully!';
        } catch (error: any) {
            this.errorMessage = error.message || 'Failed to update profile.';
        } finally {
            this.isLoading = false;
        }
    }
}