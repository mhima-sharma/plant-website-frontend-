import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { NeedHelpComponent } from "../need-help/need-help.component";

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent, NeedHelpComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
