import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  loginData = {
    email: '',
    password: ''
  };
  submittedData: any = null;
  loginError = false;
  loginSuccess = false;
  registeredUser: any = null;

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('registeredUser');
      if (stored) {
        this.registeredUser = JSON.parse(stored);
        // Pre-fill email from registered user
        this.loginData.email = this.registeredUser.email;
      }
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('registeredUser');
        if (stored) {
          const regUser = JSON.parse(stored);

          if (this.loginData.email === regUser.email && this.loginData.password === regUser.password) {
            this.loginSuccess = true;
            this.loginError = false;
            this.submittedData = {
              email: this.loginData.email,
              fullName: regUser.fullName
            };

            this.authService.login();

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1200);
            return;
          }
        }
      }

      this.loginError = true;
      this.loginSuccess = false;
      this.submittedData = null;
    } else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  onReset(form: NgForm): void {
    form.resetForm();
    this.loginData = {
      email: '',
      password: ''
    };
    this.submittedData = null;
    this.loginError = false;
    this.loginSuccess = false;
  }
}
