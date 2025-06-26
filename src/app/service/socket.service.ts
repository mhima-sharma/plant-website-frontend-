import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
interface Message {
  sender: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private apiUrl='http://localhost:3000/api'

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
  }

  //Start One to One
  joinRoom(roomId: string): void {
    this.socket.emit('join', roomId);
  }

  sendMessage(data: { roomId: string; sender: string; message: string }): void {
    this.socket.emit('sendMessage', data);
  }

  newMessage(): Observable<Message> {
    console.log("hiiiii")
    return new Observable<Message>((observer) => {
      const handler = (data: Message | Message[]) => {
        console.log(data,"data___________")
        if (Array.isArray(data)) {
          data.forEach((msg) => observer.next(msg));
        } else {
          observer.next(data);
        }
      };

      this.socket.on('newMessage', handler);

      // Cleanup to prevent multiple subscriptions
      return () => {
        this.socket.off('newMessage', handler);
      };
    });
  }
  // End One to One

  // Start One to One 
   joinGroupRoom(groupId: number, username: string) {
    this.socket.emit('joinGroupRoom', { groupId, username });
  }

  sendGroupMessage(groupId: number, sender: string, message: string) {
    this.socket.emit('sendGroupMessage', { groupId, sender, message });
  }

  onnewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newMessage', data => observer.next(data));
    });
  }

  onUnauthorized(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('unauthorized', () => observer.next('unauthorized'));
    });
  }
  emitUserOnline(username: string) {
  this.socket.emit('userOnline', username);
}

listenOnlineUsers() {
  return new Observable<string[]>(observer => {
    this.socket.on('onlineUsers', (data: string[]) => {
      observer.next(data);
    });
  });
}
//   deleteMessage(messageId: number): Observable<any> {
//     return this.http.delete('${this.apiUrl}/messages/${messageId}');
//   }

//   onMessageUpdated(): Observable<any> {
//   return new Observable(observer => {
//     this.socket.on('messageUpdated', updated => observer.next(updated));
//   });
// }
}