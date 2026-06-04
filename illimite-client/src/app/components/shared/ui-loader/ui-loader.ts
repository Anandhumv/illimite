import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-loader',
  standalone: true,
  templateUrl: './ui-loader.html',
  styleUrl: './ui-loader.css'
})
export class UiLoaderComponent {
  @Input() label = 'Loading...';
}
