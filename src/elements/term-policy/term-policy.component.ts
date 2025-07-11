import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-term-policy',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './term-policy.component.html',
  styleUrl: './term-policy.component.css'
})
export class TermPolicyComponent {

}
