import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockLucideIconComponent } from '../mock-lucide-icon.component';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule, MockLucideIconComponent],
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
    @Input() title: string = '';
    @Input() value: string | number = '';
    @Input() icon: string = 'activity';
    @Input() trend: number = 0;
    @Input() iconClass: string = '';
}
