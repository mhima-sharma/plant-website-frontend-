import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  standalone: true, // ✅ Required for using `imports`
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  isMoreMenuOpen = false;
  showLogoutModal = false;
  isLoggedIn = false;

  constructor(private dialog: MatDialog, private router: Router) {}

  openCart() {
    this.dialog.open(CartComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  ngOnInit() {
  const token = localStorage.getItem('token'); // or use a service to verify login
  this.isLoggedIn = !!token;
}
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleMoreMenu() {
    this.isMoreMenuOpen = !this.isMoreMenuOpen;
  }

  closeMoreMenu() {
    this.isMoreMenuOpen = false;
  }

  openLogoutPopup() {
    this.showLogoutModal = true;
    this.closeMobileMenu();
    this.closeMoreMenu();
  }

  closeLogoutPopup() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    localStorage.clear(); // Replace with authService.logout() if using a service
    this.showLogoutModal = false;
    this.router.navigate(['/user-login']);
  }
}
