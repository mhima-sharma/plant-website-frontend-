import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ProductService } from '../../app/service/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-plants-product',
  imports: [CommonModule],
  templateUrl: './plants-product.component.html',
  styleUrl: './plants-product.component.css'
})
export class PlantsProductComponent {
  products: any[] = [];


  constructor(private productService: ProductService, private router:Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
 

  viewDetails(id: number): void {
    console.log(id)
    this.router.navigate(['/product/', id]);
  }
}
