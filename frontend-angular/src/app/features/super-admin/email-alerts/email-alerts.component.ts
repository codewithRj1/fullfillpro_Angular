import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconModule } from '../../../shared/modules/icon.module';

type Company = { id: string; name: string; selected: boolean };

@Component({
    selector: 'app-email-alerts',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './email-alerts.component.html',
    styleUrls: ['./email-alerts.component.css']
})
export class EmailAlertsComponent {
    sendToAll = signal(true);
    subject = '';
    message = '';
    companies = signal<Company[]>([
        { id: 'CMP-1001', name: 'PrimeKart', selected: false },
        { id: 'CMP-1002', name: 'UrbanWeave', selected: false },
        { id: 'CMP-1003', name: 'ShipSwift', selected: false },
        { id: 'CMP-1004', name: 'NovaRetail', selected: false }
    ]);

    selectedCount = computed(() => this.companies().filter(c => c.selected).length);

    toggleAllSelection() {
        const next = !this.sendToAll();
        this.sendToAll.set(next);
        if (next) {
            this.companies.update(list => list.map(c => ({ ...c, selected: false })));
        }
    }

    toggleCompany(id: string) {
        this.companies.update(list => list.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    }

    send() {
        console.log('send-email-alerts', {
            sendToAll: this.sendToAll(),
            subject: this.subject,
            message: this.message,
            companies: this.companies().filter(c => c.selected).map(c => c.id)
        });
    }
}
