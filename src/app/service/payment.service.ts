import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any) {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  initiateEasebuzzPayment(orderId: number, totalAmount: number, customer: any) {
    return this.http.post(`${this.apiUrl}/easebuzz-order`, { orderId, totalAmount, customer });
  }
}
