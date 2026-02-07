import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SuperAdminSidebarComponent } from '../sidebar/super-admin-sidebar.component';

@Component({
    selector: 'app-super-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SuperAdminSidebarComponent],
    templateUrl: './super-admin-layout.component.html',
    styleUrls: ['./super-admin-layout.component.css']
})
export class SuperAdminLayoutComponent { }
