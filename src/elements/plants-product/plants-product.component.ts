import { Component } from '@angular/core';
import { ProductService } from '../../app/service/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-plants-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plants-product.component.html',
  styleUrls: ['./plants-product.component.css'] // ✅ Corrected here
})
export class PlantsProductComponent {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  // ✅ Separated for better readability
  fetchAllProducts() {
   this.productService.getAllProducts().subscribe({
  next: (res) => {
    console.log('API Response:', res);  // Check what you are getting here
    this.products = res; // Save the products to display
  },
  error: (err) => {
    console.error('Error fetching products', err);
  }
});
  }

  viewDetails(id: number): void {
    console.log('Navigating to product id:', id);
    this.router.navigate(['/product', id]);
  }
}
