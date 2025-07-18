// src/app/login-user/login-user.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, HttpClientModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

 onLogin(): void {
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;
  this.authService.login({ email, password }).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user)); // storing user info

      this.router.navigate(['/show']); // or whatever route you have
    },
    error: (err) => alert(err.error.message || 'Login failed'),
  });
}

}
