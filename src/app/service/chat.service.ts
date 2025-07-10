import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private sessionId: string = Math.random().toString(36).substring(7); // Unique session ID for each chat session

  private apiUrl: string;

  private backendUrl: string;
  private messagesUrl: string;

  constructor(private http: HttpClient) {
    const isLocalhost = window.location.hostname === 'localhost';
    this.apiUrl = isLocalhost
      ? 'http://localhost:3000/api'
      : 'https://backend-plant-website.vercel.app/api';

    this.backendUrl = `${this.apiUrl}/ai/chat`;
    this.messagesUrl = `${this.apiUrl}/ai/messages`;
  }

  // ✅ Send message to ChatGPT
  sendMessage(message: string): Observable<any> {
    return this.http.post(this.backendUrl, {
      message
    });
  }

  // ✅ Fetch all chat messages from DB
  getAllMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.messagesUrl);
  }
}
