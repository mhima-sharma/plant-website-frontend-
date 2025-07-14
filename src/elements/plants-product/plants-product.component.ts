import { Component } from '@angular/core';
import { ProductService } from '../../app/service/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⬅ Needed for ngModel

@Component({
  selector: 'app-plants-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ⬅ Add FormsModule
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

  // ✅ Fetch products and exclude sold-out ones
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

  // ✅ Navigate to product details
  viewDetails(id: number): void {
    this.router.navigate(['/product', id]);
  }

  // ✅ Handle form submit (optional)
  onSearch(event: Event) {
    event.preventDefault(); // Prevent form refresh
  }

  // ✅ Getter for filtered products
  get filteredProducts(): any[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.products;

    return this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }
}
