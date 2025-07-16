import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { ShowCaseOfMyProjectComponent } from "../show-case-of-my-project/show-case-of-my-project.component";
import { HttpClientModule } from '@angular/common/http';

declare let gtag: Function; // Declare the global gtag function

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'my-project';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-N71CH0CJQM', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
