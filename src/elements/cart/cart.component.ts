import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CartService } from '../../app/service/cart.service';
import { BuynowComponent } from '../buynow/buynow.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  showCartSummary: boolean = false; 
  cartItems: any[] = [];
  userId = 1; // Replace this with dynamic userId if available

  constructor(
    private cartService: CartService,
    public dialogRef: MatDialogRef<CartComponent>,
    private dialog: MatDialog
  ) {

  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
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

// stockMessages: { [productId: number]: string } = {};

// increaseQuantity(item: any) {
//   if (item.quantity < item.stock) {
//     item.quantity++;
//     this.stockMessages[item.id] = ''; // Clear any old message
//   } else {
//     this.stockMessages[item.id] = 'Stock is full'; // Show error
//   }
// }

// decreaseQuantity(item: any) {
//   if (item.quantity > 1) {
//     item.quantity--;
//     this.stockMessages[item.id] = ''; // Clear error if any
//   }
// }

  onBuyNow() {
    const dialogRef = this.dialog.open(BuynowComponent, {
      width: '500px',
      disableClose: false,
      data: { cart: this.cartItems }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Cart dialog closed');
     
    });
  }
  
}
