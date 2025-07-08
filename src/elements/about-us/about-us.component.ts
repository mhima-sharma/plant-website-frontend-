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
isChatbotOpen = false;
 toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }
}
