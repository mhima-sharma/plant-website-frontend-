import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../elements/header/header.component";
import { FooterComponent } from "../../elements/footer/footer.component";

interface Accessory {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  category: string;
}

@Component({
  selector: 'app-plant-accessories',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './plant-accessories.component.html',
  styleUrls: ['./plant-accessories.component.css']
})
export class PlantAccessoriesComponent {
  categories: string[] = ['Accessories', 'Seeds', 'Soil & Compost', 'Pots', 'Gardening Tools'];
  selectedCategory: string = 'Accessories';
  Math = Math;
  // showNotice: boolean = true;
  allAccessories: Accessory[] = [
    {
      id: 1,
      name: 'Watering Can',
      imageUrl: 'https://example.com/watering-can.jpg',
      price: 299,
      rating: 4.5,
      category: 'Accessories'
    },
    {
      id: 2,
      name: 'Plant Stand',
      imageUrl: 'https://example.com/plant-stand.jpg',
      price: 499,
      rating: 4.0,
      category: 'Accessories'
    },
    {
      id: 3,
      name: 'Organic Seeds Pack',
      imageUrl: 'https://example.com/seeds.jpg',
      price: 99,
      rating: 4.8,
      category: 'Seeds'
    },
    {
      id: 4,
      name: 'Compost Soil Mix',
      imageUrl: 'https://example.com/soil.jpg',
      price: 149,
      rating: 4.3,
      category: 'Soil & Compost'
    },
    {
      id: 5,
      name: 'Ceramic Pot',
      imageUrl: 'https://example.com/pot.jpg',
      price: 299,
      rating: 4.2,
      category: 'Pots'
    },
    {
      id: 6,
      name: 'Garden Shears',
      imageUrl: 'https://example.com/shears.jpg',
      price: 349,
      rating: 4.6,
      category: 'Gardening Tools'
    }
  ];

  get accessories(): Accessory[] {
    return this.allAccessories.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  addToCart(item: Accessory): void {
    console.log('Add to cart:', item.name);
  }

  //  dismissNotice(): void {
  //   this.showNotice = false;
  //   console.log('this.showNotice--------------->',this.showNotice);
  // }
}
