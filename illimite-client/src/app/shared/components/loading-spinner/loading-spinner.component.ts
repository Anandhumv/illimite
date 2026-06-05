import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-wrapper" [class.spinner-wrapper--fullscreen]="fullscreen()">
      <div class="spinner">
        <div class="spinner__ring"></div>
        <div class="spinner__ring spinner__ring--2"></div>
      </div>
      @if (message()) {
        <p class="spinner__message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }
    .spinner-wrapper--fullscreen {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 15, 0.7);
      backdrop-filter: blur(6px);
      z-index: 999;
    }
    .spinner {
      position: relative;
      width: 48px;
      height: 48px;
    }
    .spinner__ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: #a78bfa;
      animation: spin 0.9s linear infinite;
    }
    .spinner__ring--2 {
      inset: 8px;
      border-top-color: #60a5fa;
      animation-duration: 0.6s;
      animation-direction: reverse;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spinner__message {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }
  `]
})
export class LoadingSpinnerComponent {
  /** Show as a full-screen overlay */
  fullscreen = input(false);
  /** Optional status message below the spinner */
  message = input('');
}
