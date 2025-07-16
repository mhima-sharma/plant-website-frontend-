import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  visitorCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // ✅ Increment visitor count on component load
    this.http.post('https://your-backend-url.com/api/visitor', {}).subscribe();

    // ✅ Fetch updated count
    this.http.get<{ count: number }>('https://your-backend-url.com/api/visitor/count')
      .subscribe({
        next: (res) => this.visitorCount = res.count,
        error: (err) => console.error('Failed to load visitor count', err)
      });
  }
}
