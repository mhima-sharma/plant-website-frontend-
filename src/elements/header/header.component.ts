import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartComponent } from "../cart/cart.component";
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  dialogOpen = false;
constructor(private dialog: MatDialog){}
  openCart() {
    this.dialog.open(CartComponent, {
      width: '500px',
      disableClose: false,
    });
  }


  closeDialog() {
    this.dialogOpen = false;
  }

}
