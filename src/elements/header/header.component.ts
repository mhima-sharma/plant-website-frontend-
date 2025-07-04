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
  isMobileMenuOpen = false;
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


  closeDialog() {
    this.dialogOpen = false;
  }

}
