// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-signup-user',
//   imports: [RouterLink],
//   templateUrl: './signup-user.component.html',
//   styleUrl: './signup-user.component.css'
// })
// export class SignupUserComponent {

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';


@Component({
  selector: 'app-signup-user',
  // standalone:true,
  imports: [RouterLink,ReactiveFormsModule,RouterLink],
  templateUrl: './signup-user.component.html',
   styleUrl: './signup-user.component.css'
})
export class SignupUserComponent implements OnInit {
  signupForm!:FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSignup() {
    if (this.signupForm.invalid) return;

    const { name, email, password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.authService.signup({ name, email, password }).subscribe({
      next: () => alert('Signup successful'),
      error: err => alert(err.error.message || 'Signup failed'),
    });
  }
}
