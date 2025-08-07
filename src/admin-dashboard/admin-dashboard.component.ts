import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../app/auth.service';
import { AdminSidebarComponent } from "../app/admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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

  // ✅ Fetch only products added by logged-in user, excluding quantity = 0
  fetchProducts(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      this.router.navigate(['/admin-login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(`${this.baseUrl}/my`, { headers }).subscribe({
      next: (res) => {
        this.products = res.filter(product => product.quantity > 0);
        console.log('Filtered My Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching my products:', err);
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
          this.router.navigate(['/admin-login']);
        }
      }
    });
  }

  // ✅ Delete product
  deleteProduct(id: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized');
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.delete(`${this.baseUrl}/products/${id}`, { headers }).subscribe({
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

  // ✅ Navigate to edit product
  editProduct(id: number): void {
    this.router.navigate(['/editProduct', id]);
  }
}
