import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  onLogout(): void {
    this.authService.logout();
    this.toastr.success('You have logged out successfully.', 'Logged Out');
    this.router.navigate(['/login']);
  }
}
