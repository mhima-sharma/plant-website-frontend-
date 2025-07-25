import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact-us',
  imports: [HeaderComponent, FooterComponent,CommonModule,FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  isChatbotOpen = false;
email = 'mahimasharma052002@gmail.com';
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''

  };

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}


   toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }
  onSubmit() {
    const endpoint = 'https://getform.io/f/azywegjb';

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    this.http.post(endpoint, this.formData, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Message sent successfully!';
        this.errorMessage = '';
        this.formData = { name: '', email: '', subject: '', message: '' }; // Reset form
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Something went wrong. Please try again.';
      }
    });
  }
}
