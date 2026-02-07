import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconModule } from '../../../shared/modules/icon.module';

type CompanySetting = {
    id: string;
    name: string;
    plan: string;
    active: boolean;
    warehouseLimit: number;
    autoSync: boolean;
    prioritySupport: boolean;
};

@Component({
    selector: 'app-company-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './company-settings.component.html',
    styleUrls: ['./company-settings.component.css']
})
export class CompanySettingsComponent {
    search = signal('');
    companies = signal<CompanySetting[]>([
        { id: 'CMP-1001', name: 'PrimeKart', plan: 'Pro', active: true, warehouseLimit: 12, autoSync: true, prioritySupport: true },
        { id: 'CMP-1002', name: 'UrbanWeave', plan: 'Growth', active: true, warehouseLimit: 6, autoSync: true, prioritySupport: false },
        { id: 'CMP-1003', name: 'ShipSwift', plan: 'Starter', active: false, warehouseLimit: 2, autoSync: false, prioritySupport: false }
    ]);

    filtered = computed(() => {
        const term = this.search().toLowerCase();
        return this.companies().filter(c =>
            c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term)
        );
    });
}
