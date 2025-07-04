// src/app/product-details/product-details.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "../elements/header/header.component";
import { FooterComponent } from "../elements/footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  img: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', id);

    if (id) {
      this.http.get(`http://localhost:3000/api/products/${id}`).subscribe({
        next: (res: any) => {
          this.product = res;
          console.log('Product details:', res);
        },
        error: (err) => {
          console.error('Error fetching product:', err);
        }
      });
    } else {
      console.error('No product ID found in route.');
    }
  }

  addToCart() {
    const userId = this.authService.getUserId();

    if (!userId) {
      alert('User not logged in!');
      return;
    }

    this.cartService.addToCart(userId, this.product.id, this.product.email, this.product.title, this.product.price).subscribe({
      next: () => alert('Added to cart!'),
      error: () => alert('Error adding to cart.'),
    });
  }
}
