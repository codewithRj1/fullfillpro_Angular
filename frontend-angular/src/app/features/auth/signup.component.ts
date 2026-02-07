import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  companyName = '';
  email = '';
  password = '';
  address = '';

  constructor(private router: Router) {}

  submit() {
    // TODO: call registration API
    console.log('signup', {
      name: this.name,
      companyName: this.companyName,
      email: this.email,
      password: this.password,
      address: this.address
    });
    this.router.navigate(['/book-appointment']);
  }
}
