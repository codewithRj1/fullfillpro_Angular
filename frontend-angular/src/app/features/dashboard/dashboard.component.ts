import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsApi } from '../../core/apis/analytics.api';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { MockLucideIconComponent } from '../../shared/components/mock-lucide-icon.component';

interface DashboardTab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, MockLucideIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeMainTab = signal('overview');
  activeSubTab = signal<string | null>(null);

  mainTabs: DashboardTab[] = [
    { id: 'overview', label: 'Business Overview', icon: 'layout-dashboard' },
    { id: 'products', label: 'Product Report', icon: 'package' },
    { id: 'sales', label: 'Sales Report', icon: 'trending-up' },
    { id: 'buybox', label: 'Buybox', icon: 'trophy' }
  ];

  subTabsByMain: Record<string, DashboardTab[]> = {
    overview: [
      { id: 'inventory', label: 'Inventory Report', icon: 'boxes' },
      { id: 'orders', label: 'Order Report', icon: 'shopping-cart' },
      { id: 'forecast', label: 'Inventory Forecast', icon: 'bar-chart-3' }
    ],
    products: [
      { id: 'autoinventory', label: 'Auto Inventory', icon: 'upload' }
    ],
    sales: [
      { id: 'sales-trends', label: 'Sales Trends', icon: 'trending-up' }
    ],
    buybox: [
      { id: 'repricing', label: 'Repricing Settings', icon: 'settings-2' }
    ]
  };

  constructor(private analyticsApi: AnalyticsApi) { }

  ngOnInit() {
    this.analyticsApi.getDashboardStats().subscribe(data => {
      console.log('Dashboard data loaded', data);
    });
  }

  setActiveMainTab(id: string) {
    this.activeMainTab.set(id);
    this.activeSubTab.set(null);
  }

  setActiveSubTab(id: string) {
    this.activeSubTab.set(id);
  }

  getSubTabs(): DashboardTab[] {
    return this.subTabsByMain[this.activeMainTab()] ?? [];
  }

  getCurrentTabId(): string {
    return this.activeSubTab() ?? this.activeMainTab();
  }
}
