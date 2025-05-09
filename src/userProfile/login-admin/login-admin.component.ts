// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-login-admin',
//   imports: [RouterLink],
//   templateUrl: './login-admin.component.html',
//   styleUrl: './login-admin.component.css'
// })
// export class LoginAdminComponent {

// }
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-admin',
  imports:[ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  errorMessage = '';
  loginForm!: FormGroup;
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

    this.authService.loginAdmin({ email, password }).subscribe({
      next: (res) => {
        // optionally save token or admin info
        this.router.navigate(['/admindash']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}
