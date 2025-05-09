import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css'] // ✅ fixed from 'styleUrl'
})
export class SignupAdminComponent {
  errorMessage = '';
  signupForm!:FormGroup
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }



  onSubmit() {
    if (this.signupForm.invalid) return;

    const name = this.signupForm.get('name')?.value;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!name || !email || !password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.authService.signupAdmin({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/admin-login']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Signup failed';
      }
    });
  }
}
