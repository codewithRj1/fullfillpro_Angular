import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-global-rules',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './global-rules.component.html',
    styleUrls: ['./global-rules.component.css']
})
export class GlobalRulesComponent {
    autoSync = true;
    priceFloor = 10;
    blockLowStock = false;
}
