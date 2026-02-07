import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconModule } from '../../shared/modules/icon.module';

type SuperUser = {
    id: string;
    name: string;
    companyName: string;
    email: string;
    plan: string;
    superMark: boolean;
    active: boolean;
};

@Component({
    selector: 'app-super-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './super-admin.component.html',
    styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent {
    search = signal('');
    planFilter = signal('all');

    users = signal<SuperUser[]>([
        { id: 'CMP-1001', name: 'Rahul Verma', companyName: 'PrimeKart', email: 'rahul@primekart.com', plan: 'Pro', superMark: true, active: true },
        { id: 'CMP-1002', name: 'Neha Singh', companyName: 'UrbanWeave', email: 'neha@urbanweave.com', plan: 'Growth', superMark: false, active: true },
        { id: 'CMP-1003', name: 'Aman Jain', companyName: 'ShipSwift', email: 'aman@shipswift.com', plan: 'Starter', superMark: false, active: false },
        { id: 'CMP-1004', name: 'Riya Nair', companyName: 'NovaRetail', email: 'riya@novaretail.com', plan: 'Pro', superMark: true, active: true }
    ]);

    filteredUsers = computed(() => {
        const term = this.search().toLowerCase();
        const plan = this.planFilter();
        return this.users().filter(u => {
            const matchesTerm =
                u.name.toLowerCase().includes(term) ||
                u.companyName.toLowerCase().includes(term) ||
                u.id.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term);
            const matchesPlan = plan === 'all' ? true : u.plan.toLowerCase() === plan;
            return matchesTerm && matchesPlan;
        });
    });

    toggleActive(user: SuperUser) {
        this.users.update(list =>
            list.map(u => u.id === user.id ? { ...u, active: !u.active } : u)
        );
    }

    goToSellerDashboard(user: SuperUser) {
        this.router.navigate(['/dashboard'], { queryParams: { sellerId: user.id } });
    }

    constructor(private router: Router) { }
}
