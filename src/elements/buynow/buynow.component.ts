import { Component, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../app/service/cart.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var Razorpay: any;


@Component({
  selector: 'app-buynow',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './buynow.component.html',
  styleUrl: './buynow.component.css',
  standalone: true, // only if using standalone component structure
})
export class BuynowComponent {
  cartItems: any[] = [];
  checkoutForm: FormGroup;
 showCartSummary = false;
 showcartItems: any[] = [];
//  const formData = this.checkoutForm.value;

 
// showCartSummary: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,private http: HttpClient,private cartService: CartService) {
    this.cartItems = data?.cart;
    console.log('Received data:', this.cartItems); // ✅ Debug log
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      paymentMethod: ['Credit / Debit Card', Validators.required]
    });
  }

    getTotal(): number {
      return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    ngOnInit() {
      
    }

  async startRazorpayCheckout() {
    const payload = {
      gateway: 'razorpay',
      amount: 610000, // ₹6100.00 in paise
      currency: 'INR',
      name: this.checkoutForm.value.fullName,
      email: this.checkoutForm.value.email,
      contact: this.checkoutForm.value.phoneNumber,
      address: this.checkoutForm.value.shippingAddress,
    };

    try {
      const response = await this.http
        .post<any>('https://api.thub.sanchidev.in/api/v1/payments/create-order', payload)
        .toPromise();

      const order = response.data;

      const options = {
        key: 'rzp_test_uEJqigl3qciRzl', // Replace with live key in prod
        amount: order.amount,
        currency: order.currency,
        name: 'My App',
        description: 'Order Payment',
        order_id: order.id,
        handler: (res: any) => {
        console.log('Razorpay Payment Success:', res);
          // TODO: Optionally call your backend to verify payment
        },
        prefill: {
          name: this.checkoutForm.value.fullName,
          email: this.checkoutForm.value.email,
          contact: this.checkoutForm.value.phoneNumber,
        },
        theme: {
          color: '#3399CC',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order', error);
    }
  }
}



// cartItems: any[] = [];
// showCartSummary = false;


// onBuyNow() {
//   this.cartService.getCartData().subscribe((data) => {
//     this.cartItems = data;
//     this.showCartSummary = true;
//   });
// }

// getTotal(): number {
//   return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// }