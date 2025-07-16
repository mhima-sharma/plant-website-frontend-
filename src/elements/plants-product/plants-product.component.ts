import { Component } from '@angular/core';
import { ProductService } from '../../app/service/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plants-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './plants-product.component.html',
  styleUrls: ['./plants-product.component.css']
})
export class PlantsProductComponent {
  products: any[] = [];
  searchQuery: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.products = res.filter((product: any) => product.quantity > 0);
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/product', id]);
  }

  onSearch(event: Event) {
    event.preventDefault();
  }

  get filteredProducts(): any[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.products;

    return this.products.filter(product =>
      (product?.name?.toLowerCase().includes(query) ?? false) ||
      (product?.description?.toLowerCase().includes(query) ?? false)
    );
  }
}
