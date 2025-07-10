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

  // ✅ Fetch only products added by the logged-in user, excluding quantity = 0
  fetchProducts(): void {
    const token = localStorage.getItem('token'); // 👈 Get token from storage

    this.http.get<any[]>(`${this.baseUrl}/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        this.products = res.filter(product => product.quantity > 0);
        console.log('Filtered My Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching my products:', err);
      }
    });
  }

  // Delete product
  deleteProduct(id: number): void {
    const token = localStorage.getItem('token');

    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.baseUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
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
