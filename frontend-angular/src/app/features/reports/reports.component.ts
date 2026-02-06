import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, IconModule],
    template: `<div class="p-6"><h1 class="text-2xl font-bold">Reports & Analytics</h1><p class="text-muted-foreground mt-2">View insights and performance metrics</p><div class="mt-6 p-8 bg-muted/30 rounded-lg border border-border text-center"><lucide-icon name="bar-chart-3" class="w-12 h-12 mx-auto mb-4 opacity-50"></lucide-icon><p class="text-muted-foreground">Reports feature coming soon</p></div></div>`,
    styles: []
})
export class ReportsComponent { }
