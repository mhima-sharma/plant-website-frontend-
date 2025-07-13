import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../app/service/cart.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

declare var Razorpay: any;

@Component({
  selector: 'app-buynow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './buynow.component.html',
  styleUrl: './buynow.component.css'
})
export class BuynowComponent implements AfterViewInit {
  cartItems: any[] = [];
  billingDetailsForm!: FormGroup;
  paymentForm!: FormGroup;
  userId: number;
  apiUrl: string;
  loading = false;
  city: string = '';
  pincode: string = '';

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

    this.billingDetailsForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      shippingAddress: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initGoogleAutocomplete();
  }

  initGoogleAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        types: ['geocode'],
        componentRestrictions: { country: 'in' }
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        this.billingDetailsForm.controls['shippingAddress'].setValue(place.formatted_address);
        this.city = '';
        this.pincode = '';
        for (const component of place.address_components) {
          if (component.types.includes('postal_code')) {
            this.pincode = component.long_name;
          }
          if (component.types.includes('locality')) {
            this.city = component.long_name;
          }
        }
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    return this.getSubtotal() + 5;
  }

  placeOrder() {
    if (!window.confirm('Do you want to place this order?')) return;

    this.loading = true;
    const totalAmount = this.getTotal();
    const selectedGateway = this.paymentForm.value.paymentMethod;

    const orderPayload = {
      userId: this.userId,
      billingDetails: {
        fullName: this.billingDetailsForm.value.fullName,
        email: this.billingDetailsForm.value.email,
        phone: this.billingDetailsForm.value.phoneNumber,
        shippingAddress: this.billingDetailsForm.value.shippingAddress,
        city: this.city,
        pincode: this.pincode
      },
      cartItems: this.cartItems,
      paymentMethod: selectedGateway,
      totalAmount: totalAmount
    };

    this.http.post<any>(`${this.apiUrl}/orders`, orderPayload).subscribe(
      (orderRes) => {
        this.loading = false;
        if (orderRes.gateway === 'razorpay') {
          this.initiateRazorpay(orderRes);
        } else if (orderRes.gateway === 'easebuzz') {
          this.initiateEasebuzz(orderRes);
        }
      },
      (error) => {
        this.loading = false;
        console.error('Order creation failed:', error);
      }
    );
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
        this.loading = true;
        this.http
          .post(`${this.apiUrl}/payments/update-status`, {
            paymentMethod: 'razorpay',
            txnid: orderRes.txnId,
            razorpay_order_id: orderRes.razorpayOrderId,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            status: 'success'
          })
          .subscribe(() => {
            this.clearCart(orderRes.txnId);
            this.router.navigate(['/paysucess'], {
              queryParams: { txnid: orderRes.txnId }
            });
          });
      },
      prefill: {
        name: this.billingDetailsForm.value.fullName,
        email: this.billingDetailsForm.value.email,
        contact: this.billingDetailsForm.value.phoneNumber
      },
      theme: { color: '#3399CC' }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', (response: any) => {
      this.loading = true;
      this.http
        .post(`${this.apiUrl}/payments/update-status`, {
          paymentMethod: 'razorpay',
          txnid: orderRes.txnId,
          razorpay_order_id: orderRes.razorpayOrderId,
          razorpay_payment_id: response.error.metadata.payment_id,
          razorpay_signature: '',
          status: 'failure'
        })
        .subscribe(() => {
          this.router.navigate(['/payfail'], {
            queryParams: { txnid: orderRes.txnId }
          });
        });
    });
  }

  initiateEasebuzz(orderRes: any) {
    const clientId = 'BVK2USG0F';
    const paymentMode = 'test';
    const accessKey = orderRes.access_key;
    const EasebuzzCheckout = (window as any).EasebuzzCheckout;

    if (!EasebuzzCheckout) {
      console.error('Easebuzz SDK not loaded');
      return;
    }

    const easebuzzCheckout = new EasebuzzCheckout(
      clientId,
      paymentMode,
      true
    );

    easebuzzCheckout.initiatePayment({
      access_key: accessKey,
      onResponse: (res: any) => {
        this.loading = true;
        this.http
          .post(`${this.apiUrl}/payments/update-status`, {
            paymentMethod: 'easebuzz',
            txnid: res.txnid,
            status: res.status
          })
          .subscribe(() => {
            if (res.status === 'success') {
              this.clearCart(res.txnid);
              this.router.navigate(['/paysucess'], {
                queryParams: { txnid: res.txnid }
              });
            } else {
              this.router.navigate(['/payfail'], {
                queryParams: { txnid: res.txnid }
              });
            }
          });
      },
      theme: '#123456'
    });
  }

  clearCart(txnid: string) {
    this.http
      .post(`${this.apiUrl}/cart/clear`, { userId: this.userId })
      .subscribe(() => {
        this.http
          .post(`${this.apiUrl}/orders/update-stock`, { txnid: txnid })
          .subscribe(() => {
            this.loading = false;
          });
      });
  }
}
