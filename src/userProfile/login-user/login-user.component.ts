import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';
//import { HttpClientModule } from '@angular/common/http';


@Component({
    selector: 'app-login-user',
    standalone: true,
    imports: [RouterLink,ReactiveFormsModule],
    templateUrl: './login-user.component.html',
    styleUrl: './login-user.component.css'
})
export class LoginUserComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe({
      next: () => this.router.navigate(['/']),
      
      error: err => alert(err.error.message || 'Login failed'),
    });
  }
}
