import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-createproduct',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './createproduct.component.html',
  styleUrl: './createproduct.component.css'
})
export class CreateproductComponent {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  productService: any;
  products: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9.]+$/)]],
      description: ['', Validators.required]
    });
  }

  // Triggered when file input changes
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      console.log('Selected files:', this.selectedFiles);
    }
  }

  // Submit product form with images
  submitForm(): void {
    if (this.productForm.invalid || this.selectedFiles.length === 0) {
      alert('Please fill all required fields and select at least one image.');
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

    this.http.post('http://localhost:3000/api/products', formData).subscribe({
      next: (res) => {
        console.log('Product added successfully:', res);
        alert('Product uploaded ✅');
        this.productForm.reset();
        this.selectedFiles = [];
      },
      error: (err) => {
        console.error('Error uploading product:', err);
        alert('Upload failed. Please check console/logs.');
      }
    });
  }



  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}


