import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identifier = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  submit() {
    if (!this.identifier || !this.password) {
      this.errorMessage.set('Email/Username and password are required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    // Get device and IP info (IP will be determined by backend)
    const device = this.getDeviceType();
    const ipAddress = 'client'; // Backend will use actual IP

    this.authService.login({
      identifier: this.identifier,
      password: this.password,
      ipAddress: ipAddress,
      device: device
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        console.error('Login error:', err);
      }
    });
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/Mobile|Android/.test(ua)) return 'Mobile';
    if (/Tablet|iPad/.test(ua)) return 'Tablet';
    return 'Desktop';
  }
}
