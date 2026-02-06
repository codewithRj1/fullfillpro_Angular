import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { MockLucideIconComponent } from '../../shared/components/mock-lucide-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, MockLucideIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = signal('overview');

  tabs = [
    { id: 'overview', label: 'Business Overview', icon: 'layout-dashboard' },
    { id: 'inventory', label: 'Inventory Report', icon: 'boxes' },
    { id: 'orders', label: 'Order Report', icon: 'shopping-cart' },
    { id: 'forecast', label: 'Inventory Forecast', icon: 'bar-chart-3' },
    { id: 'sales', label: 'Sales Trends', icon: 'trending-up' },
    { id: 'products', label: 'Product Report', icon: 'package' },
    { id: 'buybox', label: 'Buybox Grid', icon: 'trophy' },
    { id: 'repricing', label: 'Repricing Settings', icon: 'settings-2' },
    { id: 'autoinventory', label: 'Auto Inventory', icon: 'upload' },
  ];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getDashboardStats().subscribe(data => {
      console.log('Dashboard data loaded', data);
    });
  }

  setActiveTab(id: string) {
    this.activeTab.set(id);
  }
}
