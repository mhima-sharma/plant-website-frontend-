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
   banners = [
      {
      image: 'https://hips.hearstapps.com/hmg-prod/images/collection-of-beautiful-houseplants-on-wooden-table-royalty-free-image-1712685460.jpg?crop=1xw:0.84415xh;0,0.195xh',
    
    },
    {
      image: 'https://static.wixstatic.com/media/f86e41_caf02ba05279478b8263170b4225e1d8~mv2.jpg/v1/fill/w_640,h_674,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/f86e41_caf02ba05279478b8263170b4225e1d8~mv2.jpg',
   
    },
  
    {
      image: 'https://www.thespruce.com/thmb/QfK5tJS-meUkWvIQzQw58Qe0FeA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1305874785-69013559885f43568cc6a99b6e1e42d0.jpg',
     
    }
  ];
  isChatbotOpen = false;
  current=0;
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


  
ngOnInit(){
  setInterval(() => {
      this.current = (this.current + 1) % this.banners.length;
    }, 5000);
}
goTo(index: number) {
    this.current = index;
  }
  prev() {
    this.current = (this.current - 1 + this.banners.length) % this.banners.length;
  }
  next() {
    this.current = (this.current + 1) % this.banners.length;
  }

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
