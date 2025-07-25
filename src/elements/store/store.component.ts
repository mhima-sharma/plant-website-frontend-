import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { NeedHelpComponent } from '../need-help/need-help.component';
import { FooterComponent } from '../footer/footer.component';
import { PlantsProductComponent } from '../plants-product/plants-product.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; // ✅ Carousel module

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NeedHelpComponent,
    FooterComponent,
    PlantsProductComponent,
    NgbCarouselModule // ✅ Add this for carousel support
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  isChatbotOpen = false;

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }

  // ✅ Carousel image list
  carouselImages: string[] = [
    'https://cdn11.bigcommerce.com/s-ifhig5mh0a/images/stencil/1280w/carousel/33/DMWN-Website-Homepage-Hero-Slider-2024-Your-One-Stop-Shop.png?c=1',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiRpURr22nOuxzV216rTfbQquq_nhxyYeceA&s',
    'https://cdn0.weddingwire.com/vendor/789627/3_2/960/jpg/img-4241_51_726987-170681362983175.jpeg'
  ];
}
