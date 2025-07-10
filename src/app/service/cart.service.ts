import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = '';

  constructor(private http: HttpClient) {
     const isLocalhost = window.location.hostname === 'localhost';
    this.baseUrl = isLocalhost
      ? 'http://localhost:3000/api/cart'
      : 'https://backend-plant-website.vercel.app/api/cart';
  }

  addToCart(userId: number, productId: number, quantity: number = 1,title:string, price:number) {
    return this.http.post(`${this.baseUrl}/add`, {
      userId,
      productId,
      title, 
      price,
      quantity,
    });
  }


  getCartItems(userId: number) {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }



  getCartData() {
      return this.http.get<any[]>(`${this.baseUrl}/user-cart`);
    }
 

 
}
