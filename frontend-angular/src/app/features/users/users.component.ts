import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { User, UserRole } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users = signal<User[]>([]);
    loading = signal(true);
    searchQuery = signal('');

    // User dialog state
    userDialogOpen = signal(false);
    editingUser = signal<User | null>(null);
    formName = signal('');
    formEmail = signal('');
    formRole = signal<UserRole>('viewer');
    formIsActive = signal(true);

    roleConfig: Record<UserRole, { label: string; variant: string }> = {
        admin: { label: 'Admin', variant: 'bg-primary/10 text-primary' },
        operations: { label: 'Operations', variant: 'bg-info/10 text-info' },
        finance: { label: 'Finance', variant: 'bg-success/10 text-success' },
        warehouse: { label: 'Warehouse', variant: 'bg-warning/10 text-warning' },
        viewer: { label: 'Viewer', variant: 'bg-muted text-muted-foreground' }
    };

    filteredUsers = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.users().filter(u =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
    });

    roleStats = computed(() => {
        const stats: Record<UserRole, number> = {
            admin: 0,
            operations: 0,
            finance: 0,
            warehouse: 0,
            viewer: 0
        };
        this.users().forEach(u => stats[u.role]++);
        return stats;
    });

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.api.getUsers().subscribe({
            next: (data) => {
                this.users.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openAddUserDialog() {
        this.editingUser.set(null);
        this.resetUserForm();
        this.userDialogOpen.set(true);
    }

    openEditUserDialog(user: User) {
        this.editingUser.set(user);
        this.formName.set(user.name);
        this.formEmail.set(user.email);
        this.formRole.set(user.role);
        this.formIsActive.set(user.isActive);
        this.userDialogOpen.set(true);
    }

    saveUser() {
        if (!this.formName() || !this.formEmail()) {
            alert('Please fill required fields');
            return;
        }

        const userData: any = {
            name: this.formName(),
            email: this.formEmail(),
            role: this.formRole(),
            isActive: this.formIsActive()
        };

        const editing = this.editingUser();
        if (editing) {
            this.api.updateUser(editing.id, userData).subscribe({
                next: () => {
                    this.loadData();
                    this.userDialogOpen.set(false);
                }
            });
        } else {
            this.api.createUser(userData).subscribe({
                next: () => {
                    this.loadData();
                    this.userDialogOpen.set(false);
                }
            });
        }
    }

    resetUserForm() {
        this.formName.set('');
        this.formEmail.set('');
        this.formRole.set('viewer');
        this.formIsActive.set(true);
    }

    getInitials(name: string): string {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    getRoleClass(role: UserRole): string {
        return this.roleConfig[role].variant;
    }

    getRoleLabel(role: UserRole): string {
        return this.roleConfig[role].label;
    }
}
