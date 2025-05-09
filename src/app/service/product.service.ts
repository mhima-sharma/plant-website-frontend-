import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}
  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/api/products/${id}`);
  }


  // ✅ Create product
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // ✅ Get all products
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
