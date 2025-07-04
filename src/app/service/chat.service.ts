// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {
//   private sessionId: string = Math.random().toString(36).substring(7); // Unique session ID

//   private backendUrl = 'http://localhost:3000/api/dialogflow/chat'; // Node.js backend
//   private messagesUrl = 'http://localhost:3000/api/dialogflow/messages'; // <-- NEW: Get all messages

//   constructor(private http: HttpClient) {}

//   sendMessage(message: string): Observable<any> {
//     return this.http.post(this.backendUrl, {
//       sessionId: this.sessionId,
//       userMessage: message
//     });
//   }

//   getAllMessages(): Observable<any[]> {
//     return this.http.get<any[]>(this.messagesUrl);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private sessionId: string = Math.random().toString(36).substring(7); // Unique session ID for each chat session

  // ✅ Updated backend URLs to point to the ChatGPT controller
  private backendUrl = 'http://localhost:3000/api/ai/chat'; // New ChatGPT route
  private messagesUrl = 'http://localhost:3000/api/ai/messages'; // New route to get chat history

  constructor(private http: HttpClient) {}

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
