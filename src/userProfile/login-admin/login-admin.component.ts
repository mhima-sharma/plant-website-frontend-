import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-admin',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  loginForm!: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.authService.loginAdmin({ email, password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // ✅ optional: save token
        this.loading = false;
        this.router.navigate(['/admindash']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }

  togglePassword() {
  this.showPassword = !this.showPassword;
}
}
