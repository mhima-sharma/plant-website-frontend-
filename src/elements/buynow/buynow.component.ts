import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../app/service/cart.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-buynow',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './buynow.component.html',
  styleUrl: './buynow.component.css'
})
export class BuynowComponent implements AfterViewInit {
  cartItems: any[] = [];
  checkoutForm: FormGroup;
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
    this.cartItems = (data?.cart || []).map((item: any) => ({
      ...item,
      selected: true
    }));

    this.userId = this.authService.getUserId() ?? 0;

    const isLocalhost = window.location.hostname === 'localhost';
    this.apiUrl = isLocalhost
      ? 'http://localhost:3000/api'
      : 'https://backend-plant-website.vercel.app/api';

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
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
      if (place?.formatted_address) {
        this.checkoutForm.controls['shippingAddress'].setValue(place.formatted_address);
        this.city = '';
        this.pincode = '';

        for (const component of place.address_components || []) {
          const types = component.types;
          if (types.includes('postal_code')) {
            this.pincode = component.long_name;
          }
          if (types.includes('locality') || types.includes('sublocality_level_1')) {
            this.city = component.long_name;
          }
        }
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + 5;
  }

  updatePrice() {
    // Triggered when checkbox is toggled, can add validation logic here if needed
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const selectedItems = this.cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      alert('Please select at least one product to place the order.');
      return;
    }

    if (!window.confirm('Do you want to place this order?')) return;

    this.loading = true;

    const totalAmount = this.getTotal();
    const selectedGateway = this.checkoutForm.value.paymentMethod;

    const orderPayload = {
      userId: this.userId,
      billingDetails: {
        fullName: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phoneNumber,
        shippingAddress: this.checkoutForm.value.shippingAddress,
        city: this.city,
        pincode: this.pincode
      },
      cartItems: selectedItems,
      paymentMethod: selectedGateway,
      totalAmount
    };

    this.http.post<any>(`${this.apiUrl}/orders`, orderPayload).subscribe({
      next: (orderRes) => {
        this.loading = false;
        if (orderRes.gateway === 'razorpay') {
          this.initiateRazorpay(orderRes);
        } else if (orderRes.gateway === 'easebuzz') {
          this.initiateEasebuzz(orderRes);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Order creation failed:', error);
        alert('Something went wrong. Please try again.');
      }
    });
  }

  initiateRazorpay(orderRes: any) {
    const options = {
      key: 'rzp_test_uEJqigl3qciRzl',
      amount: orderRes.amount,
      currency: orderRes.currency,
      name: 'Plant Store',
      description: 'Order Payment',
      order_id: orderRes.razorpayOrderId,
      handler: (res: any) => {
        this.loading = true;
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
        });
      },
      prefill: {
        name: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        contact: this.checkoutForm.value.phoneNumber
      },
      theme: { color: '#5CB85C' }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', (response: any) => {
      this.loading = true;
      this.http.post(`${this.apiUrl}/payments/update-status`, {
        paymentMethod: 'razorpay',
        txnid: orderRes.txnId,
        razorpay_order_id: orderRes.razorpayOrderId,
        razorpay_payment_id: response.error.metadata.payment_id,
        razorpay_signature: '',
        status: 'failure'
      }).subscribe(() => {
        this.router.navigate(['/payfail'], { queryParams: { txnid: orderRes.txnId } });
      });
    });
  }

  initiateEasebuzz(orderRes: any) {
    const EasebuzzCheckout = (window as any).EasebuzzCheckout;

    if (!EasebuzzCheckout) {
      console.error('Easebuzz SDK not loaded');
      return;
    }

    const easebuzz = new EasebuzzCheckout("BVK2USG0F", "test", true);

    easebuzz.initiatePayment({
      access_key: orderRes.access_key,
      onResponse: (res: any) => {
        this.loading = true;
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
        });
      },
      theme: '#5CB85C'
    });
  }
getSelectedItemCount(): number {
  return this.cartItems.filter(item => item.selected).length;
}
  clearCart(txnid: string) {
    this.http.post(`${this.apiUrl}/cart/clear`, { userId: this.userId }).subscribe(() => {
      this.http.post(`${this.apiUrl}/orders/update-stock`, { txnid }).subscribe(() => {
        this.loading = false;
      });
    });
  }
}
