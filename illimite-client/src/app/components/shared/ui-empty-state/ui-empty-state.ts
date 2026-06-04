import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-empty-state',
  standalone: true,
  templateUrl: './ui-empty-state.html',
  styleUrl: './ui-empty-state.css'
})
export class UiEmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = '';
}
