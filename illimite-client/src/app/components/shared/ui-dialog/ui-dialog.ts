import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-dialog',
  standalone: true,
  templateUrl: './ui-dialog.html',
  styleUrl: './ui-dialog.css'
})
export class UiDialogComponent {
  @Input() message = '';
  @Input() tone: 'info' | 'success' | 'error' = 'info';
}
