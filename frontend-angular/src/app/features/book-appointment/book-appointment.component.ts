import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent {
  name = '';
  email = '';
  phone = '';
  date = '';
  time = '';
  notes = '';

  constructor(private router: Router) {}

  submit() {
    // TODO: call appointment API
    console.log('book-appointment', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      date: this.date,
      time: this.time,
      notes: this.notes
    });
    this.router.navigate(['/login']);
  }
}
