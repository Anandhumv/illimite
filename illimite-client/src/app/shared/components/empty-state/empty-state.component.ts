import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <div class="empty__icon">{{ icon() }}</div>
      <h3 class="empty__title">{{ title() }}</h3>
      <p class="empty__subtitle">{{ subtitle() }}</p>
      @if (actionLabel()) {
        <ng-content />
      }
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      gap: 0.75rem;
    }
    .empty__icon {
      font-size: 3rem;
      line-height: 1;
      margin-bottom: 0.5rem;
      filter: grayscale(0.3);
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }
    .empty__title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .empty__subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      max-width: 300px;
      line-height: 1.6;
    }
  `]
})
export class EmptyStateComponent {
  /** Emoji or unicode icon to display */
  icon     = input('📭');
  title    = input('Nothing here yet');
  subtitle = input('');
  /** Pass actionLabel to project a button via ng-content */
  actionLabel = input('');
}
