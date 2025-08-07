import { Component } from '@angular/core';
import { HeaderComponent } from "../elements/header/header.component";
import { ContentComponent } from "../elements/content/content.component";
import { FooterComponent } from "../elements/footer/footer.component";
import { NeedHelpComponent } from "../elements/need-help/need-help.component";
import { PlantsProductComponent } from "../elements/plants-product/plants-product.component";
import { ChatbotComponent } from "../app/chatbot/chatbot.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-case-of-my-project',
  imports: [HeaderComponent, ContentComponent, FooterComponent, NeedHelpComponent, PlantsProductComponent, CommonModule],
  templateUrl: './show-case-of-my-project.component.html',
  styleUrl: './show-case-of-my-project.component.css'
})
export class ShowCaseOfMyProjectComponent {
isChatbotOpen = false;
isWeatherOpen = false;
 isGameOpen = false;
 selectedGame = 'tic-tac-toe';

 toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }
  toggleWeather() {
  this.isWeatherOpen = !this.isWeatherOpen;
}
 toggleGame() {
    this.isGameOpen = !this.isGameOpen;
  }
  selectGame(game: string) {
  this.selectedGame = game;
}

}
