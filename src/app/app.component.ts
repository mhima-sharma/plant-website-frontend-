import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShowCaseOfMyProjectComponent } from "../show-case-of-my-project/show-case-of-my-project.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'my-project';
}
