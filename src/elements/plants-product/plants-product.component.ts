import { Component } from '@angular/core';
import { ProductService } from '../../app/service/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-plants-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plants-product.component.html',
  styleUrls: ['./plants-product.component.css']
})
export class PlantsProductComponent {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  // Fetch and filter out sold-out products
  fetchAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        // Filter out products with zero quantity
        this.products = res.filter((product: any) => product.quantity > 0);
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
