import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-global-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.css']
})
export class GlobalToastComponent {
  protected readonly toastService = inject(ToastService);
}
