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
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20220906/pngtree-business-concept-contact-us-on-wall-background-project-doodle-concept-photo-image_25335972.jpg',
    
    },
    {
      image: 'https://static.vecteezy.com/system/resources/thumbnails/024/162/440/small_2x/communication-concept-with-email-message-box-and-contacts-icons-website-page-contact-connection-with-modern-network-technology-borderless-communication-business-contact-and-communication-free-photo.jpg',
   
    },
  
    {
      image: 'https://thumbs.dreamstime.com/b/three-wooden-ball-contact-icon-against-blue-background-arranging-row-over-reflecting-floor-211477031.jpg',
     
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
