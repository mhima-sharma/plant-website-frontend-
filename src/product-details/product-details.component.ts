import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "../elements/header/header.component";
import { FooterComponent } from "../elements/footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../app/service/cart.service';


@Component({
  selector: 'app-product-details',
  imports: [HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  
  @Input() product: any;
img: any;
userId = 1;

  constructor(private route: ActivatedRoute, private http: HttpClient ,private cartService: CartService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:3000/api/products/${id}`).subscribe((res: any) => {
      this.product = res;
    });
  }
  


 
  // Replace with logged-in user's ID

 
  addToCart() {
    this.cartService.addToCart(this.userId, this.product.id,this.product.email,this.product.title,this.product.price).subscribe({
      next: () => alert('Added to cart!'),
      error: () => alert('Error adding to cart.'),
    });
  }
  }

