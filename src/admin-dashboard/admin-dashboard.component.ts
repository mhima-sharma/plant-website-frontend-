import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../app/service/product.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // ✅ Import this

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private http: HttpClient // ✅ Inject HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        console.log('Products fetched in Admin Dashboard:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  deleteProduct(id: number) {
    this.http.delete(`http://localhost:3000/api/products/${id}`)
      .subscribe({
        next: () => {
          // Remove product from UI after deletion
          this.products = this.products.filter(p => p.id !== id);
          console.log('Product deleted:', id);
        },
        error: (err: any) => console.error('Delete error:', err)
      });
  }
}
