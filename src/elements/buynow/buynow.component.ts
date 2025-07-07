// import { Component, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CartService } from '../../app/service/cart.service';
// import { CommonModule } from '@angular/common';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../app/auth.service';

// declare var Razorpay: any;

// @Component({
//   selector: 'app-buynow',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './buynow.component.html',
//   styleUrl: './buynow.component.css',
//   standalone: true,
// })
// export class BuynowComponent implements AfterViewInit {
//   cartItems: any[] = [];
//   checkoutForm: FormGroup;
//   userId: number;

//   @ViewChild('addressInput') addressInput!: ElementRef;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private cartService: CartService,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.cartItems = data?.cart;

//     this.userId = this.authService.getUserId() ?? 0;

//     this.checkoutForm = this.fb.group({
//       fullName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phoneNumber: ['', Validators.required],
//       shippingAddress: ['', Validators.required],
//       paymentMethod: ['', Validators.required]
//     });
//   }

//   ngAfterViewInit(): void {
//     this.initGoogleAutocomplete();
//   }

//   initGoogleAutocomplete() {
//     const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
//       types: ['geocode'],
//       componentRestrictions: { country: 'in' }
//     });

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       if (place && place.formatted_address) {
//         this.checkoutForm.controls['shippingAddress'].setValue(place.formatted_address);
//       }
//     });
//   }

//   getTotal(): number {
//     return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   }

//   placeOrder() {
//     const totalAmount = this.getTotal();
//     const selectedGateway = this.checkoutForm.value.paymentMethod;

//     const orderPayload = {
//       userId: this.userId,
//       billingDetails: {
//         fullName: this.checkoutForm.value.fullName,
//         email: this.checkoutForm.value.email,
//         phone: this.checkoutForm.value.phoneNumber,
//         shippingAddress: this.checkoutForm.value.shippingAddress
//       },
//       cartItems: this.cartItems,
//       paymentMethod: selectedGateway,
//       totalAmount: totalAmount
//     };

//     this.http.post<any>('http://localhost:3000/api/orders', orderPayload).subscribe(orderRes => {
//       console.log('Order Created:', orderRes);

//       if (orderRes.gateway === 'razorpay') {
//         this.initiateRazorpay(orderRes);
//       } else if (orderRes.gateway === 'easebuzz') {
//         this.initiateEasebuzz(orderRes);
//       } else {
//         console.error('Unsupported Payment Gateway');
//       }
//     }, error => {
//       console.error('Order creation failed:', error);
//     });
//   }

//   initiateRazorpay(orderRes: any) {
//     const options = {
//       key: 'rzp_test_uEJqigl3qciRzl',
//       amount: orderRes.amount,
//       currency: orderRes.currency,
//       name: 'My App',
//       description: 'Order Payment',
//       order_id: orderRes.razorpayOrderId,
//       handler: (res: any) => {
//         console.log('Razorpay Payment Success:', res);

//         this.http.post('http://localhost:3000/api/payments/update-status', {
//           paymentMethod: 'razorpay',
//           txnid: orderRes.txnId,
//           razorpay_order_id: orderRes.razorpayOrderId,
//           razorpay_payment_id: res.razorpay_payment_id,
//           razorpay_signature: res.razorpay_signature,
//           status: 'success'
//         }).subscribe(() => {
//           this.clearCart();
//           this.router.navigate(['/paysucess'], { queryParams: { txnid: orderRes.txnId } });
//         }, error => {
//           console.error('Error updating payment status:', error);
//         });
//       },
//       prefill: {
//         name: this.checkoutForm.value.fullName,
//         email: this.checkoutForm.value.email,
//         contact: this.checkoutForm.value.phoneNumber
//       },
//       theme: { color: '#3399CC' }
//     };

//     const rzp = new Razorpay(options);
//     rzp.open();

//     rzp.on('payment.failed', (response: any) => {
//       console.error('Razorpay Payment Failed:', response);

//       this.http.post('http://localhost:3000/api/payments/update-status', {
//         paymentMethod: 'razorpay',
//         txnid: orderRes.txnId,
//         razorpay_order_id: orderRes.razorpayOrderId,
//         razorpay_payment_id: response.error.metadata.payment_id,
//         razorpay_signature: '',
//         status: 'failure'
//       }).subscribe(() => {
//         this.router.navigate(['/payfail'], { queryParams: { txnid: orderRes.txnId } });
//       }, error => {
//         console.error('Error updating payment status:', error);
//       });
//     });
//   }

//   initiateEasebuzz(orderRes: any) {
//     const clientId = "BVK2USG0F";
//     const paymentMode = "test";
//     const accessKey = orderRes.access_key;

//     const EasebuzzCheckout = (window as any).EasebuzzCheckout;

//     if (!EasebuzzCheckout) {
//       console.error('Easebuzz SDK not loaded');
//       return;
//     }

//     const easebuzzCheckout = new EasebuzzCheckout(clientId, paymentMode, true);

//     easebuzzCheckout.initiatePayment({
//       access_key: accessKey,
//       onResponse: (res: any) => {
//         console.log('Easebuzz Payment Response:', res);

//         this.http.post('http://localhost:3000/api/payments/update-status', {
//           paymentMethod: 'easebuzz',
//           txnid: res.txnid,
//           status: res.status
//         }).subscribe(() => {
//           if (res.status === 'success') {
//             this.clearCart();
//             this.router.navigate(['/paysucess'], { queryParams: { txnid: res.txnid } });
//           } else {
//             this.router.navigate(['/payfail'], { queryParams: { txnid: res.txnid } });
//           }
//         }, error => {
//           console.error('Error updating payment status:', error);
//         });
//       },
//       theme: '#123456',
//     });
//   }

//   clearCart() {
//     this.http.post('http://localhost:3000/api/cart/clear', { userId: this.userId })
//       .subscribe(() => {
//         console.log('Cart cleared successfully');
//       }, error => {
//         console.error('Error clearing cart:', error);
//       });
//   }
// }
import { Component, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../app/service/cart.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-buynow',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buynow.component.html',
  styleUrl: './buynow.component.css',
  standalone: true,
})
export class BuynowComponent implements AfterViewInit {
  cartItems: any[] = [];
  checkoutForm: FormGroup;
  userId: number;
  apiUrl: string;

  @ViewChild('addressInput') addressInput!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartItems = data?.cart;
    this.userId = this.authService.getUserId() ?? 0;

    const isLocalhost = window.location.hostname === 'localhost';
    this.apiUrl = isLocalhost
      ? 'http://localhost:3000/api'
      : 'https://backend-plant-website.vercel.app/api';

    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initGoogleAutocomplete();
  }

  initGoogleAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        this.checkoutForm.controls['shippingAddress'].setValue(place.formatted_address);
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  placeOrder() {
    const totalAmount = this.getTotal();
    const selectedGateway = this.checkoutForm.value.paymentMethod;

    const orderPayload = {
      userId: this.userId,
      billingDetails: {
        fullName: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phoneNumber,
        shippingAddress: this.checkoutForm.value.shippingAddress
      },
      cartItems: this.cartItems,
      paymentMethod: selectedGateway,
      totalAmount: totalAmount
    };

    this.http.post<any>(`${this.apiUrl}/orders`, orderPayload).subscribe(orderRes => {
      console.log('Order Created:', orderRes);

      if (orderRes.gateway === 'razorpay') {
        this.initiateRazorpay(orderRes);
      } else if (orderRes.gateway === 'easebuzz') {
        this.initiateEasebuzz(orderRes);
      } else {
        console.error('Unsupported Payment Gateway');
      }
    }, error => {
      console.error('Order creation failed:', error);
    });
  }

  initiateRazorpay(orderRes: any) {
    const options = {
      key: 'rzp_test_uEJqigl3qciRzl',
      amount: orderRes.amount,
      currency: orderRes.currency,
      name: 'My App',
      description: 'Order Payment',
      order_id: orderRes.razorpayOrderId,
      handler: (res: any) => {
        console.log('Razorpay Payment Success:', res);

        this.http.post(`${this.apiUrl}/payments/update-status`, {
          paymentMethod: 'razorpay',
          txnid: orderRes.txnId,
          razorpay_order_id: orderRes.razorpayOrderId,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
          status: 'success'
        }).subscribe(() => {
          this.clearCart(orderRes.txnId);
          this.router.navigate(['/paysucess'], { queryParams: { txnid: orderRes.txnId } });
        }, error => {
          console.error('Error updating payment status:', error);
        });
      },
      prefill: {
        name: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        contact: this.checkoutForm.value.phoneNumber
      },
      theme: { color: '#3399CC' }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', (response: any) => {
      console.error('Razorpay Payment Failed:', response);

      this.http.post(`${this.apiUrl}/payments/update-status`, {
        paymentMethod: 'razorpay',
        txnid: orderRes.txnId,
        razorpay_order_id: orderRes.razorpayOrderId,
        razorpay_payment_id: response.error.metadata.payment_id,
        razorpay_signature: '',
        status: 'failure'
      }).subscribe(() => {
        this.router.navigate(['/payfail'], { queryParams: { txnid: orderRes.txnId } });
      }, error => {
        console.error('Error updating payment status:', error);
      });
    });
  }

  initiateEasebuzz(orderRes: any) {
    const clientId = "BVK2USG0F";
    const paymentMode = "test";
    const accessKey = orderRes.access_key;

    const EasebuzzCheckout = (window as any).EasebuzzCheckout;

    if (!EasebuzzCheckout) {
      console.error('Easebuzz SDK not loaded');
      return;
    }

    const easebuzzCheckout = new EasebuzzCheckout(clientId, paymentMode, true);

    easebuzzCheckout.initiatePayment({
      access_key: accessKey,
      onResponse: (res: any) => {
        console.log('Easebuzz Payment Response:', res);

        this.http.post(`${this.apiUrl}/payments/update-status`, {
          paymentMethod: 'easebuzz',
          txnid: res.txnid,
          status: res.status
        }).subscribe(() => {
          if (res.status === 'success') {
            this.clearCart(res.txnid);
            this.router.navigate(['/paysucess'], { queryParams: { txnid: res.txnid } });
          } else {
            this.router.navigate(['/payfail'], { queryParams: { txnid: res.txnid } });
          }
        }, error => {
          console.error('Error updating payment status:', error);
        });
      },
      theme: '#123456',
    });
  }

  clearCart(txnid: string) {
    this.http.post(`${this.apiUrl}/cart/clear`, { userId: this.userId })
      .subscribe(() => {
        console.log('Cart cleared successfully');

        // Call stock update API here
        this.http.post(`${this.apiUrl}/orders/update-stock`, { txnid: txnid })
          .subscribe(() => {
            console.log('Stock updated successfully');
          }, error => {
            console.error('Error updating stock:', error);
          });

      }, error => {
        console.error('Error clearing cart:', error);
      });
  }
}
