import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../app/service/cart.service';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  showCartSummary: boolean = false;
  cartItems: any[] = [];
  userId: number | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.userId = userId;
      this.loadCart();
    } else {
      console.error('User not logged in!');
    }
  }

  loadCart() {
    if (this.userId === null) {
      console.error('User ID is null. Cannot load cart.');
      return;
    }

    console.log('Calling loadCart for user:', this.userId);

    this.cartService.getCartItems(this.userId).subscribe({
      next: (res: any) => {
        this.cartItems = res;
        console.log('Cart items loaded:', res);
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
      },
    });
  }

  close() {
    // Redirect to home or close side panel/modal if used that way
    this.router.navigate(['/']);
  }

  onBuyNow() {
    this.router.navigate(['/buynow'], { state: { cart: this.cartItems } });
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any) {
    const index = this.cartItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
