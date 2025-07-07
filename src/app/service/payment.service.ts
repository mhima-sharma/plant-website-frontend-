import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // private apiUrl = 'http://localhost:3000/api';
   private apiUrl = '';

  

  constructor(private http: HttpClient) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.apiUrl = isLocalhost
      ? 'http://localhost:3000/api'
      : 'https://backend-plant-website.vercel.app/api';
  
  }

  // createOrder(orderData: any) {
  //   return this.http.post(`${this.apiUrl}/orders`, orderData);
  // }
  
  createOrder(orderData: any) {
    return this.http.post<{ order_id: number, access_key: string }>(`${this.apiUrl}/payments/create-order`, orderData);
  }

  initiateEasebuzzPayment(orderId: number, totalAmount: number, customer: any) {
    return this.http.post(`${this.apiUrl}/easebuzz-order`, { orderId, totalAmount, customer });
  }
}







 