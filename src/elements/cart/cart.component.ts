import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CartService } from '../../app/service/cart.service';
import { BuynowComponent } from '../buynow/buynow.component';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  showCartSummary: boolean = false;
  cartItems: any[] = [];
  userId: number | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CartComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.userId = userId;
      this.loadCart();
    } else {
      console.error('User not logged in!');
      // Optional: redirect to login or show a message
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
    this.dialogRef.close();
  }

  onBuyNow() {
    const dialogRef = this.dialog.open(BuynowComponent, {
      width: '1000px',
      disableClose: false,
      data: { cart: this.cartItems }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Cart dialog closed');
      // Optional: Reload cart or take any further action
    });
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

