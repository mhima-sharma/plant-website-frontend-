import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { NeedHelpComponent } from "../need-help/need-help.component";
import { FooterComponent } from "../footer/footer.component";
import { PlantsProductComponent } from "../plants-product/plants-product.component";

@Component({
  selector: 'app-store',
  imports: [HeaderComponent, NeedHelpComponent, FooterComponent, PlantsProductComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

}
