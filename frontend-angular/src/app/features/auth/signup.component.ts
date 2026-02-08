import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  readonly defaultSignupRole = 'admin';
  fullName = '';
  companyName = '';
  companyAddress = '';
  email = '';
  mobileNumber = '';
  password = '';
  warehouseId = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  submit() {
    if (!this.fullName || !this.companyName || !this.companyAddress || !this.email || !this.mobileNumber || !this.password || !this.warehouseId) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.signup({
      fullName: this.fullName,
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      warehouseId: this.warehouseId,
      role: this.defaultSignupRole
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        console.log('Signup successful:', response);
        // Redirect to book appointment after successful signup
        this.router.navigate(['/book-appointment']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Signup failed. Please try again.');
        console.error('Signup error:', err);
      }
    });
  }
}
