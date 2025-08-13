import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from "../elements/header/header.component";
import { ContentComponent } from "../elements/content/content.component";
import { FooterComponent } from "../elements/footer/footer.component";
import { NeedHelpComponent } from "../elements/need-help/need-help.component";
import { PlantsProductComponent } from "../elements/plants-product/plants-product.component";
import { ChatbotComponent } from "../app/chatbot/chatbot.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-case-of-my-project',
  standalone: true,
  imports: [
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    NeedHelpComponent,
    PlantsProductComponent,
    CommonModule,
    ChatbotComponent
  ],
  templateUrl: './show-case-of-my-project.component.html',
  styleUrl: './show-case-of-my-project.component.css'
})
export class ShowCaseOfMyProjectComponent {
  activePanel: 'weather' | 'games' | 'chatbot' | null = null;
  locationGranted = false;
  userLocation: { lat: number; lon: number } | null = null;

  selectedGame: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Load Tic Tac Toe by default
    this.selectedGame = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://mhima-sharma.github.io/-tick-tack-/'
    );
  }

  closePanel() {
    this.activePanel = null;
  }

  openPanel(panel: 'weather' | 'games' | 'chatbot') {
    if (panel === 'weather') {
      this.requestLocationAccess();
    }
    this.activePanel = this.activePanel === panel ? null : panel;
  }

  selectGame(url: string) {
    this.selectedGame = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private requestLocationAccess() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.locationGranted = true;
          this.userLocation = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          };
        },
        () => {
          this.locationGranted = false;
        }
      );
    }
  }

  requestWeatherAccess() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          this.locationGranted = true;
          this.openPanel('weather');
        },
        () => {
          this.locationGranted = false;
          this.openPanel('weather');
        }
      );
    } else {
      this.locationGranted = false;
      this.openPanel('weather');
    }
  }
}
