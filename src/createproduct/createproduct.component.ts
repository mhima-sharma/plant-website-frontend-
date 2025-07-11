import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../app/service/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-createproduct',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './createproduct.component.html',
  styleUrl: './createproduct.component.css'
})
export class CreateproductComponent {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  products: any[] = [];

  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/products'
    : 'https://backend-plant-website.vercel.app/api/products';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9.]+$/)]],
      description: ['', Validators.required]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      console.log('Selected files:', this.selectedFiles);
    }
  }

  submitForm(): void {
    if (this.productForm.invalid || this.selectedFiles.length === 0) {
      alert('Please fill all required fields and select at least one image.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload products.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.productForm.get('title')?.value);
    formData.append('quantity', this.productForm.get('quantity')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('description', this.productForm.get('description')?.value);

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(this.baseUrl, formData, { headers }).subscribe({
      next: (res) => {
        console.log('✅ Product added successfully:', res);
        alert('Product uploaded ✅');
        this.productForm.reset();
        this.selectedFiles = [];
        this.fetchProducts(); // optional refresh
      },
      error: (err) => {
        console.error('❌ Error uploading product:', err);
        alert(err.error?.message || 'Upload failed. Please login again.');
      }
    });
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}
