import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconModule } from '../../../shared/modules/icon.module';

@Component({
    selector: 'app-super-admin-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, IconModule],
    templateUrl: './super-admin-sidebar.component.html',
    styleUrls: ['./super-admin-sidebar.component.css']
})
export class SuperAdminSidebarComponent {
    navItems = [
        { label: 'Dashboard', icon: 'layout-dashboard', path: '/super-admin/dashboard', exact: true },
        { label: 'Global Rules', icon: 'settings', path: '/super-admin/global-rules', exact: false },
        { label: 'Company Settings', icon: 'building-2', path: '/super-admin/company-settings', exact: false },
        { label: 'Email Alerts', icon: 'send', path: '/super-admin/email-alerts', exact: false }
    ];
}
