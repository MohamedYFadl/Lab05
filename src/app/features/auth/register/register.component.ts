import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    if (confirmPassword.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    }
    return { passwordMismatch: true };
  } else {
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submittedData: any = null;

  mobilePattern = /^01[0125][0-9]{8}$/;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      mobiles: this.fb.array([
        this.createMobileControl()
      ]),
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  get mobiles(): FormArray {
    return this.registerForm.get('mobiles') as FormArray;
  }

  createMobileControl(): AbstractControl {
    return this.fb.control('', [
      Validators.required,
      Validators.pattern(this.mobilePattern)
    ]);
  }

  addMobile(): void {
    this.mobiles.push(this.createMobileControl());
  }

  removeMobile(index: number): void {
    if (this.mobiles.length > 1) {
      this.mobiles.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.submittedData = { ...this.registerForm.value };

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('registeredUser', JSON.stringify(this.submittedData));
      }

      this.registerForm.reset();
      while (this.mobiles.length > 1) {
        this.mobiles.removeAt(1);
      }

      this.registerForm.markAsPristine();
      this.registerForm.markAsUntouched();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.registerForm.reset();
    while (this.mobiles.length > 1) {
      this.mobiles.removeAt(1);
    }
    this.submittedData = null;
  }
}
