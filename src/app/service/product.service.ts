import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private apiUrl = 'http://localhost:3000/api/products'; // Base API URL
  private apiUrl = ''; // Base API URL


  constructor(private http: HttpClient) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.apiUrl = isLocalhost
      ? 'http://localhost:3000/api/products'
      : 'https://backend-plant-website.vercel.app/api/products';
  }

  // ✅ Get all products
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ Get product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create product
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // ✅ Delete product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
