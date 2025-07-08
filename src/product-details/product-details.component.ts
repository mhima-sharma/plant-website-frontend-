import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "../elements/header/header.component";
import { FooterComponent } from "../elements/footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../app/service/cart.service';
import { AuthService } from '../app/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  @Input() product: any;
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get(`http://localhost:3000/api/products/${id}`).subscribe({
        next: (res: any) => {
          this.product = res;
          if (!this.product.quantity) {
            this.product.quantity = 0;
          }
        },
        error: (err) => {
          console.error('Error fetching product:', err);
        }
      });
    }
  }

  increaseQuantity() {
    if (this.selectedQuantity < this.product.quantity) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCart() {
    const userId = this.authService.getUserId();

    if (!userId) {
      alert('User not logged in!');
      return;
    }

    if (this.product.quantity === 0) {
      alert('Product is out of stock.');
      return;
    }

    this.cartService.addToCart(
      userId,
      this.product.id,
      this.selectedQuantity, // ⬅️ quantity is 3rd param
      this.product.title,
      this.product.price
    ).subscribe({
      next: () => alert('Added to cart!'),
      error: () => alert('Error adding to cart.')
    });
  }
}
