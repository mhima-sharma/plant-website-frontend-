import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartComponent } from "../cart/cart.component";
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  dialogOpen = false;
  isMobileMenuOpen: boolean = false;
  isMoreMenuOpen: boolean = false;
  showLogoutModal: boolean = false;
  router: any;
constructor(private dialog: MatDialog){}
  openCart() {
    this.dialog.open(CartComponent, {
      width: '500px',
      disableClose: false,
    });
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
    // Replace this with your logout logic
    localStorage.clear(); // or this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }

}
