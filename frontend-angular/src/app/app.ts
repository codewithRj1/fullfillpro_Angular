import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalToastComponent } from './shared/components/global-toast/global-toast.component';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToastComponent, GlobalLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-angular');
}
