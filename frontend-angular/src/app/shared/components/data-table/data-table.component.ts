import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'number' | 'date' | 'custom';
    width?: string;
}

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
    @Input() columns: Column[] = [];
    @Input() data: any[] = [];
    @Input() loading = false;
    @Input() emptyMessage = 'No data available';

    @Output() rowClick = new EventEmitter<any>();
    @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

    sortColumn: string | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    onSort(column: Column) {
        if (!column.sortable) return;

        if (this.sortColumn === column.key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column.key;
            this.sortDirection = 'asc';
        }

        this.sortChange.emit({ column: column.key, direction: this.sortDirection });
    }

    onRowClick(row: any) {
        this.rowClick.emit(row);
    }

    getCellValue(row: any, key: string): any {
        return key.split('.').reduce((obj, k) => obj?.[k], row);
    }

    getSortIcon(column: Column): string {
        if (!column.sortable) return '';
        if (this.sortColumn !== column.key) return '↕';
        return this.sortDirection === 'asc' ? '↑' : '↓';
    }
}
