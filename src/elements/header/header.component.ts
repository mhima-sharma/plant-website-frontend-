import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../app/service/cart.service';
import { AuthService } from '../../app/auth.service';
import { Subscription } from 'rxjs';

// ✅ Optional: Create a CartItem interface if not already declared
interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  // Add more properties as needed
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoPath: string = '../../img/logo little-leafy.png';
  

  isMobileMenuOpen = false;
  isMoreMenuOpen = false;
  showLogoutModal = false;
  isLoggedIn = false;
  isHeaderBlack = false;
  cartCount = 0;
  private cartSubscription!: Subscription;
  private userId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadCartCount(this.userId);

      // Subscribe to cart change notifications
      this.cartSubscription = this.cartService.cartUpdated$.subscribe(() => {
        this.loadCartCount(this.userId!);
      });
    }
  }

  loadCartCount(userId: number): void {
    this.cartService.getCartItems(userId).subscribe(
      (items: any[]) => {
        this.cartCount = items.length;
      },
      (error) => {
        console.error('Error loading cart items', error);
      }
    );
  }
 

  openCart(): void {
    this.dialog.open(CartComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleMoreMenu(): void {
    this.isMoreMenuOpen = !this.isMoreMenuOpen;
  }

  closeMoreMenu(): void {
    this.isMoreMenuOpen = false;
  }

  openLogoutPopup(): void {
    this.showLogoutModal = true;
    this.closeMobileMenu();
    this.closeMoreMenu();
  }

  closeLogoutPopup(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    localStorage.clear();
    this.showLogoutModal = false;
    this.router.navigate(['/']);
  }

  makeHeaderBlack(): void {
    this.isHeaderBlack = true;
  }

  onNavItemClick(): void {
    this.makeHeaderBlack();
    this.closeMobileMenu();
    this.closeMoreMenu();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
