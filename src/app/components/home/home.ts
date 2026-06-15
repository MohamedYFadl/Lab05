import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  user: any = null;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Session Auth Guard using shared AuthService
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Load registered user data
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('registeredUser');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
