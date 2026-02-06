import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-marketplace-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './marketplace-badge.component.html',
    styleUrls: ['./marketplace-badge.component.css']
})
export class MarketplaceBadgeComponent {
    @Input() marketplace: string = '';
    @Input() status: string = '';

    getMarketplaceClass(): string {
        // Colors from styles.css variables mapping would be better, but hardcoding map for speed
        switch (this.marketplace.toLowerCase()) {
            case 'amazon': return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20';
            case 'flipkart': return 'bg-[#2874f0]/10 text-[#2874f0] border-[#2874f0]/20';
            case 'meesho': return 'bg-[#f43397]/10 text-[#f43397] border-[#f43397]/20';
            case 'myntra': return 'bg-[#ff3f6c]/10 text-[#ff3f6c] border-[#ff3f6c]/20';
            case 'jiomart': return 'bg-[#0078ad]/10 text-[#0078ad] border-[#0078ad]/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    }

    getStatusIconClass(): string {
        switch (this.status?.toLowerCase()) {
            case 'live':
            case 'active': return 'bg-success';
            case 'error': return 'bg-destructive';
            case 'inactive': return 'bg-muted-foreground';
            default: return 'bg-warning';
        }
    }
}
