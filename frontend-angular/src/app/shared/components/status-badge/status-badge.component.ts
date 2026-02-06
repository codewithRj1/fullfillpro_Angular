import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
    @Input() status: string = '';
    @Input() type: 'default' | 'live' | 'error' | 'warning' | 'info' = 'default';

    getBadgeClass(): string {
        switch (this.status.toLowerCase()) {
            case 'active':
            case 'delivered':
            case 'paid':
            case 'in stock':
            case 'connected':
                return 'bg-success/10 text-success border-success/20';
            case 'inactive':
            case 'cancelled':
            case 'refunded':
            case 'out of stock':
                return 'bg-muted text-muted-foreground border-border';
            case 'pending':
            case 'processing':
            case 'shipped':
            case 'low stock':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'error':
            case 'failed':
            case 'blacklisted':
            case 'overstocked':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-primary/10 text-primary border-primary/20';
        }
    }

    getDotClass(): string {
        switch (this.status.toLowerCase()) {
            case 'active':
            case 'delivered':
            case 'paid':
            case 'in stock':
            case 'connected':
                return 'bg-success animate-pulse';
            case 'inactive':
            case 'cancelled':
            case 'refunded':
            case 'out of stock':
                return 'bg-muted-foreground';
            case 'pending':
            case 'processing':
            case 'shipped':
            case 'low stock':
                return 'bg-warning animate-pulse';
            case 'error':
            case 'failed':
            case 'blacklisted':
            case 'overstocked':
                return 'bg-destructive';
            default:
                return 'bg-primary';
        }
    }
}
