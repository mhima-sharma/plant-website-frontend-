import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { NeedHelpComponent } from "../need-help/need-help.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent, NeedHelpComponent,CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
   banners = [
      {
      image: 'https://www.asiafarming.com/wp-content/uploads/2022/11/Plant-Nursery-Business-Plan1-1024x683.jpg',
    
    },
    {
      image: 'https://cdnwebsite.databox.com/wp-content/uploads/2020/12/01062702/about-us-page-examples.png',
   
    },
  
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-TPjdvVB71EI4G6CyzYN8wt6dd7jdE_u9sA&s',
     
    }
  ];
isChatbotOpen = false;
current=0;
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
}
