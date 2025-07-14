import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = '';

  // ✅ Add this to allow components to subscribe to cart count changes
  private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  constructor(private http: HttpClient) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.baseUrl = isLocalhost
      ? 'http://localhost:3000/api/cart'
      : 'https://backend-plant-website.vercel.app/api/cart';
  }

  // ✅ Use this whenever cart changes
  notifyCartUpdated() {
    this.cartUpdatedSource.next();
  }

    // ✅ Add this to allow item removal from cart
  removeCartItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${itemId}`);
  }

  // ✅ Add this to allow quantity updates
  updateCartItem(item: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${item.id}`, item);
  }

 
 

  addToCart(userId: number, productId: number, quantity: number = 1, title: string, price: number) {
    return this.http.post(`${this.baseUrl}/add`, {
      userId,
      productId,
      title,
      price,
      quantity,
    });
  }

  // getCartItems(userId: number) {
  //   return this.http.get(`${this.baseUrl}/${userId}`);
  // }
  getCartItems(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
}

  getCartData() {
    return this.http.get<any[]>(`${this.baseUrl}/user-cart`);
  }
}
