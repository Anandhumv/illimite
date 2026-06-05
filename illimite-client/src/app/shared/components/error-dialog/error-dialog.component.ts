import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  template: `
    @if (visible()) {
      <div class="dialog-backdrop" (click)="onDismiss()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="dialog__body">
            <h3 class="dialog__title">{{ title() }}</h3>
            <p class="dialog__message">{{ message() }}</p>
          </div>
          <button class="dialog__close" (click)="onDismiss()" aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .dialog {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: #1a1a2e;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(239, 68, 68, 0.1);
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(12px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .dialog__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }
    .dialog__body { flex: 1; }
    .dialog__title {
      margin: 0 0 0.4rem;
      font-size: 1rem;
      font-weight: 600;
      color: #f1f5f9;
    }
    .dialog__message {
      margin: 0;
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .dialog__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #475569;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      transition: color 0.2s, background 0.2s;
    }
    .dialog__close:hover {
      color: #f1f5f9;
      background: rgba(255,255,255,0.07);
    }
  `]
})
export class ErrorDialogComponent {
  visible = input(false);
  title   = input('Something went wrong');
  message = input('An unexpected error occurred. Please try again.');

  dismissed = output<void>();

  onDismiss() {
    this.dismissed.emit();
  }
}
