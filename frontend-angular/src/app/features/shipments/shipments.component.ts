import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Shipment, Carrier } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-shipments',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './shipments.component.html',
    styleUrls: ['./shipments.component.css']
})
export class ShipmentsComponent implements OnInit {
    activeTab = signal<'shipments' | 'carriers'>('shipments');
    shipments = signal<Shipment[]>([]);
    carriers = signal<Carrier[]>([]);
    loading = signal(true);
    searchQuery = signal('');
    carrierFilter = signal('all');

    // Carrier dialog state
    carrierDialogOpen = signal(false);
    editingCarrier = signal<Carrier | null>(null);
    formName = signal('');
    formAccountCode = signal('');
    formServiceablePins = signal(0);
    formDailyLimit: number | null = null;
    formCodEnabled = signal(true);
    formIsActive = signal(true);

    filteredShipments = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const carrier = this.carrierFilter();

        return this.shipments().filter(s => {
            const matchesSearch = s.orderNo.toLowerCase().includes(query) ||
                s.trackingNo.toLowerCase().includes(query);
            const matchesCarrier = carrier === 'all' || s.carrier.id === carrier;
            return matchesSearch && matchesCarrier;
        });
    });

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.api.getShipments().subscribe({
            next: (data) => {
                this.shipments.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        this.api.getCarriers().subscribe({
            next: (data) => this.carriers.set(data),
            error: () => { }
        });
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'created': 'bg-muted text-muted-foreground',
            'picked_up': 'bg-info/10 text-info',
            'in_transit': 'bg-info/10 text-info',
            'out_for_delivery': 'bg-warning/10 text-warning',
            'delivered': 'bg-success/10 text-success',
            'rto': 'bg-destructive/10 text-destructive'
        };
        return statusMap[status] || 'bg-secondary text-secondary-foreground';
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            'created': 'Created',
            'picked_up': 'Picked Up',
            'in_transit': 'In Transit',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered',
            'rto': 'RTO'
        };
        return labels[status] || status;
    }

    openAddCarrierDialog() {
        this.editingCarrier.set(null);
        this.resetCarrierForm();
        this.carrierDialogOpen.set(true);
    }

    openEditCarrierDialog(carrier: Carrier) {
        this.editingCarrier.set(carrier);
        this.formName.set(carrier.name);
        this.formAccountCode.set(carrier.accountCode);
        this.formServiceablePins.set(carrier.serviceablePinCodes);
        this.formDailyLimit = carrier.dailyLimit ?? null;
        this.formCodEnabled.set(carrier.codEnabled);
        this.formIsActive.set(carrier.isActive);
        this.carrierDialogOpen.set(true);
    }

    saveCarrier() {
        if (!this.formName() || !this.formAccountCode()) {
            alert('Please fill required fields');
            return;
        }

        const carrierData: any = {
            name: this.formName(),
            accountCode: this.formAccountCode(),
            serviceablePinCodes: this.formServiceablePins(),
            dailyLimit: this.formDailyLimit,
            codEnabled: this.formCodEnabled(),
            isActive: this.formIsActive()
        };

        const editing = this.editingCarrier();
        if (editing) {
            this.api.updateCarrier(editing.id, carrierData).subscribe({
                next: () => {
                    this.loadData();
                    this.carrierDialogOpen.set(false);
                }
            });
        } else {
            this.api.createCarrier(carrierData).subscribe({
                next: () => {
                    this.loadData();
                    this.carrierDialogOpen.set(false);
                }
            });
        }
    }

    resetCarrierForm() {
        this.formName.set('');
        this.formAccountCode.set('');
        this.formServiceablePins.set(0);
        this.formDailyLimit = null;
        this.formCodEnabled.set(true);
        this.formIsActive.set(true);
    }

    handleExport() {
        console.log('Export shipments');
    }
}
