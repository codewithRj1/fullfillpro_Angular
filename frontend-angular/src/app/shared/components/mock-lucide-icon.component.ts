import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lucide-icon',
    standalone: true,
    imports: [CommonModule],
    template: `<span class="mock-icon" [title]="name" [class]="class">{{name}}</span>`,
    styles: [`
    .mock-icon { 
      display: inline-block; 
      width: 1em; 
      height: 1em; 
      background: currentColor; 
      opacity: 0.5; 
      font-size: 10px; 
      overflow: hidden; 
    }
  `]
})
export class MockLucideIconComponent {
    @Input() name: string = '';
    @Input() class: string = '';
}
