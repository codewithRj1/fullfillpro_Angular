import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryApi } from '../../core/apis/inventory.api';
import { Warehouse, PurchaseOrder } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';
import { Column } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-warehouses',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './warehouses.component.html',
    styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
    warehouses = signal<Warehouse[]>([]);
    purchaseOrders = signal<PurchaseOrder[]>([]);
    loading = signal(true);

    activeTab = signal<'warehouses' | 'receiving'>('warehouses');
    searchQuery = signal('');

    // Dialog state
    dialogOpen = signal(false);
    editingWarehouse = signal<Warehouse | null>(null);

    // Form state
    formName = signal('');
    formAddress = signal('');
    formCity = signal('');
    formState = signal('');
    formPinCode = signal('');
    formContactPerson = signal('');
    formPhone = signal('');
    formIsDefault = signal(false);
    formIsActive = signal(true);

    // Receiving dialog
    receivingDialogOpen = signal(false);
    selectedPO = signal<PurchaseOrder | null>(null);
    receivingWarehouse = signal('');
    receivedQuantities = signal<Record<string, number>>({});

    filteredWarehouses = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.warehouses().filter(wh =>
            wh.name.toLowerCase().includes(query) ||
            wh.city.toLowerCase().includes(query)
        );
    });

    pendingPOs = computed(() => {
        return this.purchaseOrders().filter(po =>
            po.status === 'sent' || po.status === 'partially_received'
        );
    });

    activeWarehouses = computed(() => {
        return this.warehouses().filter(wh => wh.isActive);
    });

    warehouseColumns: Column[] = [
        { key: 'name', label: 'Warehouse', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'pinCode', label: 'PIN Code', sortable: false },
        { key: 'contact', label: 'Contact', sortable: false },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: '', sortable: false }
    ];

    poColumns: Column[] = [
        { key: 'poNo', label: 'PO Number', sortable: true },
        { key: 'vendor', label: 'Vendor', sortable: true },
        { key: 'items', label: 'Items', sortable: false },
        { key: 'expectedDate', label: 'Expected Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: '', sortable: false }
    ];

    constructor(private inventoryApi: InventoryApi, private toast: ToastService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.inventoryApi.getWarehouses().subscribe({
            next: (data) => {
                this.warehouses.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        this.inventoryApi.getPurchaseOrders().subscribe({
            next: (data) => this.purchaseOrders.set(data),
            error: () => { }
        });
    }

    openAddDialog() {
        this.editingWarehouse.set(null);
        this.resetForm();
        this.dialogOpen.set(true);
    }

    openEditDialog(warehouse: Warehouse) {
        this.editingWarehouse.set(warehouse);
        this.formName.set(warehouse.name);
        this.formAddress.set(warehouse.address);
        this.formCity.set(warehouse.city);
        this.formState.set(warehouse.state);
        this.formPinCode.set(warehouse.pinCode);
        this.formContactPerson.set(warehouse.contactPerson);
        this.formPhone.set(warehouse.phone);
        this.formIsDefault.set(warehouse.isDefault);
        this.formIsActive.set(warehouse.isActive);
        this.dialogOpen.set(true);
    }

    resetForm() {
        this.formName.set('');
        this.formAddress.set('');
        this.formCity.set('');
        this.formState.set('');
        this.formPinCode.set('');
        this.formContactPerson.set('');
        this.formPhone.set('');
        this.formIsDefault.set(false);
        this.formIsActive.set(true);
    }

    handleSave() {
        if (!this.formName() || !this.formAddress() || !this.formCity() || !this.formState() || !this.formPinCode()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        const warehouseData: Omit<Warehouse, 'id'> = {
            name: this.formName(),
            address: this.formAddress(),
            city: this.formCity(),
            state: this.formState(),
            pinCode: this.formPinCode(),
            contactPerson: this.formContactPerson(),
            phone: this.formPhone(),
            isDefault: this.formIsDefault(),
            isActive: this.formIsActive(),
        };

        const editing = this.editingWarehouse();
        if (editing) {
            this.inventoryApi.updateWarehouse(editing.id, warehouseData).subscribe({
                next: () => {
                    this.loadData();
                    this.dialogOpen.set(false);
                    this.resetForm();
                }
            });
        } else {
            this.inventoryApi.createWarehouse(warehouseData).subscribe({
                next: () => {
                    this.loadData();
                    this.dialogOpen.set(false);
                    this.resetForm();
                }
            });
        }
    }

    openReceivingDialog(po: PurchaseOrder) {
        this.selectedPO.set(po);
        this.receivingWarehouse.set(po.warehouseId || '');
        const initialQtys: Record<string, number> = {};
        po.items.forEach(item => {
            initialQtys[item.id] = 0;
        });
        this.receivedQuantities.set(initialQtys);
        this.receivingDialogOpen.set(true);
    }

    handleReceive() {
        const po = this.selectedPO();
        const whId = this.receivingWarehouse();
        if (!po || !whId) {
            this.toast.error('Please select a warehouse');
            return;
        }

        // In real implementation, call API to receive PO items
        this.toast.success(`Received items for PO ${po.poNo} at warehouse`);
        this.receivingDialogOpen.set(false);
        this.selectedPO.set(null);
    }

    setReceivedQuantity(itemId: string, qty: number) {
        const current = this.receivedQuantities();
        this.receivedQuantities.set({ ...current, [itemId]: qty });
    }
}
