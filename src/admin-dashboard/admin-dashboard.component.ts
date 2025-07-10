import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../app/service/product.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  private baseUrl: string;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router
  ) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.baseUrl = isLocalhost
      ? 'http://localhost:3000/api/products'
      : 'https://backend-plant-website.vercel.app/api/products';
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  // Fetch all products excluding those with quantity = 0
  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.filter(product => product.quantity > 0);
        console.log('Filtered Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // Delete product
  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.baseUrl}/${id}`).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Product deleted:', id);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  // Navigate to edit product
  editProduct(id: number): void {
    this.router.navigate(['/editProduct', id]);
  }
}
